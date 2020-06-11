const { User } = require('./../models/User');

const auth = async (req, res, next) => {
  try {
    const token = req.cookies.w_auth;
    const user = await User.findByToken(token);
    if (!user) throw new Error();

    req.token = token;
    req.user = user;
    next();
  } catch (error) {
    res.json({
      isAuth: false,
      error: 'Token is not provided'
    });
  }
};

module.exports = { auth };
