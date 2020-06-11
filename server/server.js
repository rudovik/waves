const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const formidable = require('express-formidable');
const cloudinary = require('cloudinary');
const async = require('async');

const app = express();
require('dotenv').config();

const DB = require('./db');
DB();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use(express.static('client/build'));

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET
});

// Models
const { User } = require('./models/User');
const { Wood } = require('./models/Wood');
const { Brand } = require('./models/Brand');
const { Product } = require('./models/Product');
const { Payment } = require('./models/payment');
const { Site } = require('./models/Site');

// Middlewares
const { auth } = require('./middleware/auth');
const { admin } = require('./middleware/admin');

//=======================================
//              PRODUCTS
//=======================================

app.post('/api/product/shop', async (req, res) => {
  try {
    let order = req.body.order ? req.body.order : 'desc';
    let sortBy = req.body.sortBy ? req.body.sortBy : '_id';
    let limit = req.body.limit ? parseInt(req.body.limit) : 100;
    let skip = req.body.skip ? parseInt(req.body.skip) : null;
    let findArgs = {};

    for (let key in req.body.filters) {
      if (req.body.filters[key].length) {
        if (key === 'price') {
          findArgs[key] = {
            $gte: req.body.filters[key][0],
            $lte: req.body.filters[key][1]
          };
        } else {
          findArgs[key] = req.body.filters[key];
        }
      }
    }

    findArgs['publish'] = true;

    const articles = await Product.find(findArgs)
      .populate('brand')
      .populate('wood')
      .sort([[sortBy, order]])
      .skip(skip)
      .limit(limit)
      .exec();

    res.status(200).json({ size: articles.length, articles });
  } catch (error) {
    res.status(400).send(error);
  }
});

// By ARRIVAL
//  /articles?sortBy=createdAt&order=desc&limit=4

// BY SELL
// /articles?sortBy=sold&order=desc&limit=4
app.get('/api/product/articles', async (req, res) => {
  try {
    const order = req.query ? req.query.order : 'asc';
    const sortBy = req.query.sortBy ? req.query.sortBy : '_id';
    const limit = req.query.limit ? parseInt(req.query.limit) : 100;

    const products = await Product.find()
      .populate('brand')
      .populate('wood')
      .sort([[sortBy, order]])
      .limit(limit)
      .exec();
    res.send(products);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.get('/api/product/articles_by_id', async (req, res) => {
  try {
    let type = req.query.type;
    let items = req.query.id.split(',');
    // if (type === 'array') {
    //   let ids = req.query.id.split(',');
    //   items = [];
    //   items = ids.map((item) => {
    //     return mongoose.Types.ObjectId(item);
    //   });
    // }
    const products = await Product.find({ _id: { $in: items } })
      .populate('brand')
      .populate('wood')
      .exec();

    res.status(200).send(products);
  } catch (error) {
    res.status(400).send('');
  }
});

app.post('/api/product/article', auth, admin, async (req, res) => {
  try {
    let product = new Product(req.body);
    product = await product.save();
    res.status(200).json({ success: true, product });
  } catch (error) {
    res.json({ success: false, error });
  }
});

//=======================================
//              WOODS
//=======================================

app.post('/api/product/wood', auth, admin, async (req, res) => {
  try {
    let wood = new Wood(req.body);
    wood = await wood.save();
    res.status(200).json({ success: true, wood });
  } catch (error) {
    console.log(error);
    res.json({ success: false, error });
  }
});

app.get('/api/product/woods', async (req, res) => {
  try {
    const woods = await Wood.find({});
    res.status(200).json(woods);
  } catch (error) {
    res.status(400).send(error);
  }
});

//=======================================
//              BRAND
//=======================================

app.post('/api/product/brand', auth, admin, async (req, res) => {
  try {
    let brand = new Brand({ name: req.body.brand });

    brand = await brand.save();
    res.status(200).json({ success: true, brand });
  } catch (error) {
    res.json({ success: false, error });
    console.log(error);
  }
});

app.get('/api/product/brands', async (req, res) => {
  try {
    const brands = await Brand.find({});
    res.status(200).json(brands);
  } catch (error) {
    res.status(400).send(error);
  }
});

//=======================================
//              USERS
//=======================================

app.get('/api/users/auth', auth, async (req, res) => {
  try {
    res.status(200).json({
      isAdmin: req.user.role === 0 ? false : true,
      isAuth: true,
      email: req.user.email,
      name: req.user.name,
      lastname: req.user.lastname,
      role: req.user.role,
      cart: req.user.cart,
      history: req.user.history
    });
  } catch (error) {}
});

app.post('/api/users/register', async (req, res) => {
  try {
    let user = new User(req.body);

    user = await user.save();

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/users/login', async (req, res) => {
  try {
    let user = await User.findOne({ email: req.body.email });

    if (!user) throw new Error('Auth failed, email not found');

    await user.comparePassword(req.body.password);

    user = await user.generateToken();

    res.cookie('w_auth', user.token).status(200).json({
      loginSuccess: true,
      userData: user
    });
  } catch (error) {
    console.log(error);
    res.json({ loginSuccess: false, message: error.message });
  }
});

app.get('/api/users/logout', auth, async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { _id: req.user._id },
      { token: '' }
    );
    res.status(200).send({
      success: true
    });
  } catch (error) {
    res.json({ success: false, error });
  }
});

app.get('/', (req, res) => {
  res.status(200).json({ hello: 'Hello, World!' });
});

app.post('/api/users/uploadimage', auth, admin, formidable(), (req, res) => {
  cloudinary.uploader.upload(
    req.files.file.path,
    (result) => {
      console.log(result);
      res.status(200).send({ public_id: result.public_id, url: result.url });
    },
    {
      public_id: `${Date.now()}`,
      resource_type: 'auto'
    }
  );
});

app.get('/api/users/removeimage', auth, admin, (req, res) => {
  let image_id = req.query.public_id;

  cloudinary.uploader.destroy(image_id, (error, result) => {
    if (error) return res.json({ success: false });
    res.status(200).send('Ok');
  });
});

app.post('/api/users/addToCart', auth, async (req, res) => {
  try {
    let user = await User.findOne({ _id: req.user._id });
    let duplicate = false;

    user.cart.forEach((item) => {
      if (item.id == req.query.productId) {
        duplicate = true;
      }
    });

    if (duplicate) {
      user = await User.findOneAndUpdate(
        {
          _id: req.user._id,
          'cart.id': mongoose.Types.ObjectId(req.query.productId)
        },
        { $inc: { 'cart.$.quantity': 1 } },
        { new: true }
      );
      res.status(200).json(user.cart);
    } else {
      user = await User.findOneAndUpdate(
        { _id: req.user._id },
        {
          $push: {
            cart: {
              id: mongoose.Types.ObjectId(req.query.productId),
              quantity: 1,
              date: Date.now()
            }
          }
        },
        { new: true }
      );
      res.status(200).json(user.cart);
    }
  } catch (error) {
    console.log(error);
    return res.json({ success: false, error });
  }
});

app.get('/api/users/removeFromCart', auth, async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { _id: req.user.id },
      { $pull: { cart: { id: mongoose.Types.ObjectId(req.query._id) } } },
      { new: true }
    );
    let cart = user.cart;
    let array = cart.map((item) => {
      return mongoose.Types.ObjectId(item.id);
    });

    const cartDetail = await Product.find({ _id: { $in: array } })
      .populate('brand')
      .populate('wood')
      .exec();

    return res.status(200).json({
      cartDetail,
      cart
    });
  } catch (error) {
    console.log(error);
    res.status(400).send('Error!');
  }
});

app.post('/api/users/successBuy', auth, async (req, res) => {
  let history = [];
  let transactionData = {};
  let products = [];
  // user history
  req.body.cartDetail.forEach((item) => {
    history.push({
      dateOfPurchase: Date.now(),
      name: item.name,
      brand: item.brand.name,
      id: item._id,
      price: item.price,
      quantity: item.quantity,
      paymentId: req.body.paymentData.paymentID
    });
  });

  // PAYMENTS DASH
  transactionData.user = {
    id: req.user._id,
    name: req.user.name,
    lastname: req.user.lastname,
    email: req.user.email
  };
  transactionData.data = req.body.paymentData;
  transactionData.product = history;

  try {
    const user = await User.findOneAndUpdate(
      { _id: req.user._id },
      { $push: { history: history }, $set: { cart: [] } },
      { new: true }
    );
    const payment = new Payment(transactionData);
    payment.save();

    payment.product.forEach((item) => {
      products.push({ id: item.id, quantity: item.quantity });
    });

    async.eachSeries(
      products,
      (item, callback) => {
        Product.update(
          { id: item.id },
          {
            $inc: {
              sold: item.quantity
            }
          },
          { new: false },
          callback
        );
      },
      (err) => {
        if (err) return res.json({ success: false, err });
        res.status(200).json({
          success: true,
          cart: user.cart,
          cartDetail: []
        });
      }
    );
  } catch (error) {
    console.log(error);
    return res.json({ success: false, error });
  }
});

app.post('/api/users/update_profile', auth, async (req, res) => {
  try {
    const profile = User.findOneAndUpdate(
      { _id: req.user._id },
      {
        $set: req.body
      },
      { new: true }
    );

    return res.status(200).send({
      success: true
    });
  } catch (error) {
    return res.json({ success: false, err });
  }
});

//=======================================
//              SITE
//=======================================

app.get('/api/site/site_data', async (req, res) => {
  try {
    const site = await Site.find({});
    res.status(200).send(site[0].siteInfo);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

app.post('/api/site/site_data', auth, admin, async (req, res) => {
  try {
    const siteInfo = await Site.findOneAndUpdate(
      { name: 'Site' },
      { $set: { siteInfo: req.body } },
      { new: true }
    );
    res.status(200).send({
      success: true,
      siteInfo: siteInfo.siteInfo
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, error });
  }
});

// DEFAULT
if (process.env.NODE_ENV === 'production') {
  const path = require('path');
  app.get('/*', (req, res) => {
    res.sendfile(path.resolve(__dirname, '../client', 'build', 'index.html'));
  });
}

const port = process.env.PORT || 3002;

app.listen(port, () => {
  console.log(`Server Running at ${port}`);
});
