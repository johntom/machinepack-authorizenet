module.exports = {
  friendlyName: 'Create transaction request',
  description: 'pass credentials to authorize.net to setup a payment transaction',
  extendedDescription: 'nodejs version 1.0.6 from https://www.npmjs.com/package/authorize-net ',
  cacheable: false,
  sync: false,
  idempotent: false,
  inputs: {
    apiLoginId: {
      example: 'xxxx4Tk9K',
      description: 'The AN API LOGIN ID',
      required: true
    },
    transactionKey: {
      example: 'xxxxN24Hqm7C5V98',
      description: 'Your TRANSACTION KEY .',
      required: true
    },
    testMode: {
      example: true,
      description: "true or false this.endpoint = options.testMode === true ? 'https://apitest.authorize.net/xml/v1/request.api' : 'https://api.authorize.net/xml/v1/request.api';",
      required: true
    },

    secretKey: {
      example: 'Simon',
      description: 'Your secret .',
      required: false
    },
    amount: {
      description: 'The amount to charge, in the smallest currency unit (e.g. 500 to charge $5.00)',
      extendedDescription: 'A positive integer in the smallest currency unit (e.g 100 cents to charge $1.00, or 1 to charge ¥1, a 0-decimal currency) representing how much to charge the card. The minimum amount is $0.50 (or equivalent in charge currency).',
      example: 500,
      required: true
    },
    currency: {
      description: '3-letter ISO code for currency.',
      example: 'usd',
      required: true
    },
    cardnumber: {
      description: 'The cc # to charge.',
      extendedDescription: 'If you also pass a customer ID, the card must be the ID of a card belonging to the customer. Otherwise, if you do not pass a customer ID, the card you provide must either be a Stripe token, like the ones returned by Stripe.js.',
      example: '4242424242424242',
      required: true
    },
    cardexpmonth: {
      description: 'The cc expiration month.',
      extendedDescription: ' AuthorizeNet.js.',
      example: 12,
      required: true
    },
    cardexpyear: {
      description: 'The cc expiration year.',
      extendedDescription: ' AuthorizeNet.js.',
      example: 2016,
      required: true
    },

    cvv2: {
      description: 'needed for ccv.',
      extendedDescription: ' AuthorizeNet.js',
      example: '123',
      required: true
    },
    description: {
      description: 'An arbitrary string to attach to the charge object in Stripe.',
      extendedDescription: 'It is displayed when in the web interface alongside the charge. Note that if you use Stripe to send automatic email receipts to your customers, your receipt emails will include the description of the charge(s) that they are describing.',
      example: 'This notable charge was for several gallons of mayonnaise!'
    },
    billingFirstName: {
      description: 'billingFirstName.',
      extendedDescription: ' AuthorizeNet.js',
      example: 'John',
      required: true
    },
    billingLastName: {
      description: 'billingLastName.',
      extendedDescription: ' AuthorizeNet.js',
      example: 'Smith',
      required: true
    },

    billingAddress1: {
      description: 'billingAddress1.',
      extendedDescription: ' AuthorizeNet.js',
      example: '500 %th Ave',
      required: true
    },
    billingCity: {
      description: 'billingCity.',
      extendedDescription: ' AuthorizeNet.js',
      example: 'New York',
      required: true
    },
    billingState: {
      description: 'billingState.',
      extendedDescription: ' AuthorizeNet.js',
      example: 'NY',
      required: true
    },
    billingPostalCode: {
      description: 'billingPostalCode.',
      extendedDescription: ' AuthorizeNet.js',
      example: '10011',
      required: true
    },
    billingCountry: {
      description: 'billingCountry.',
      extendedDescription: ' AuthorizeNet.js',
      example: 'USA',
      required: true
    },
  },

  defaultExit: 'success',
  exits: {
    error: {
      description: 'Unexpected error occurred.'
    },
    wrongOrNoKey: {
      description: 'Invalid or unprovided API Login Id and transactionKey.'
    },


    // success: {
    //   description: 'Returns a resultCode ok.',
    //   example: 'message:[{  "code": "I00001", "text": "Successful." }]'
    // },

    success: {
      description: 'Payment captured successfully'
    }


  },


  fn: function(inputs, exits) {

    var anet = require('authorize-net');
    var service = new anet({
      API_LOGIN_ID: inputs.apiLoginId,
      TRANSACTION_KEY: inputs.transactionKey,
      testMode: inputs.testMode
    });

  //  console.log('ser ', service);

    //// var service=require('node-authorize-net')(inputs.apiLoginId,inputs.transactionKey);
    //// service.authCaptureTransaction(inputs.amount,inputs.cardnumber,inputs.cardexpyear,inputs.cardexpmonth,inputs.cardcode).then(function (transaction) {
    var order = {};
    var creditCard = {};
    var prospect = {};
    var billTo = {};
    var shipTo = {};
    var other = '';
    var order = {};


    creditCard.creditCardNumber = inputs.cardnumber;
    creditCard.expirationYear = inputs.cardexpyear;
    creditCard.expirationMonth = inputs.cardexpmonth;
    creditCard.cvv2 = inputs.cvv2;


    prospect.billingFirstName= inputs.billingFirstName; //customerFirstName
    prospect.billingLastName= inputs.billingLastName;//customerLastName
    //prospect.customerEmail = inputs.billingEmail;
    prospect.billingAddress = inputs.billingCity;
    prospect.billingCity = inputs.billingState;
    prospect.billingState = inputs.billingPostalCode;
    prospect.billingPostalCode = inputs.billingPostalCode;
    prospect.billingCountry = inputs.billingCountry;



    prospect.shippingFirstName = inputs.billingFirstName;
    prospect.shippingLastName = inputs.billingLastName;
    prospect.shippingAddress = inputs.billingAddress1;
    prospect.shippingCity = inputs.billingCity;
    prospect.shippingState = inputs.billingState;
    prospect.shippingPostalCode = inputs.billingPostalCode;
    prospect.shippingCountry = inputs.billingCountry;
    // prospect (object)
    //
    // 'customerFirstName' (string): First name of the customer (also used for the billing).
    // 'customerLastName' (string): Last name of the customer (also used for the billing).
    // 'customerEmail' (string): Email of the customer.



    order.amount = inputs.amount;

   // service.authorizeTransaction(order, creditCard, prospect, other).then(function(transaction) {
    // or    //
    service.submitTransaction(order, creditCard, prospect, other).then(function(transaction) {

      // console.log('1 transaction', transaction);
      //   console.log('2', transaction.authCode)
      // //console.log('3', transaction._orininal);//.transactionResponse);
      //  console.log('3', transaction._original);
      //  console.log('3', transaction._original.responseCode);
      // if (transaction.transactionResponse.responseCode[0] === 1) {

      if (transaction._original.responseCode[0] === '1') {
             console.log('success');
        return exits.success(transaction) //.transactionResponse)
      } else {
           console.log('error');
        return exits.error('error');
      }
    });

  }




};
