import React from 'react';
import PaypalExpressBtn from 'react-paypal-express-checkout';

const Paypal = (props) => {
  const onSuccess = (payment) => {
    // console.log(JSON.stringify(payment));
    props.onSuccess(payment);
  };

  const onCancel = (data) => {
    console.log(JSON.stringify(data));
  };

  const onError = (err) => {
    console.log(JSON.stringify(err));
  };

  let env = 'sandbox';
  let currency = 'USD';
  let total = props.toPay;

  const client = {
    sandbox:
      'Ac-eLEgnrdGnZ5Jw_nxzjcp5siC8NXrTSkxr-OA4jpzefywkUemTXZU_F-FDZGJwA2TUOHTKXdbmBX2_',
    production: ''
  };

  /*{"paid":true,"cancelled":false,"payerID":"BCFL3J3SNZSQC","paymentID":"PAYID-L3GBMNQ2H290203FK502610H","paymentToken":"EC-0G854882U2370434P","returnUrl":"https://www.paypal.com/checkoutnow/error?paymentId=PAYID-L3GBMNQ2H290203FK502610H&token=EC-0G854882U2370434P&PayerID=BCFL3J3SNZSQC","address":{"recipient_name":"John Doe","line1":"1 Maire-Victorin","city":"Toronto","state":"ON","postal_code":"M5A 1E1","country_code":"CA"},"email":"sb-4w1tb1816567@personal.example.com"} */

  return (
    <div>
      <PaypalExpressBtn
        env={env}
        client={client}
        currency={currency}
        total={total}
        onError={onError}
        onSuccess={onSuccess}
        onCancel={onCancel}
        style={{
          size: 'large',
          color: 'blue',
          shape: 'rect',
          label: 'checkout'
        }}
      />
    </div>
  );
};

export default Paypal;
