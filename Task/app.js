// load app dependencies
const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.NODE_ENV || 3000;

app.set('port', port);

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/test', (req, res, next) => {
  const Joi = require('joi');

  const data = req.body;


  const detailAddressschema = Joi.object.keys({
      line1:Joi.string().alphanum(),
      line2:Joi.string().alphanum(),
      line3:Joi.string().alphanum(),
  })

  const schema = Joi.object()({
    email:Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
    phone: Joi.string().regex(/^\d{3}-\d{3}-\d{4}$/).required(),
    address: Joi.object({
        contactName:Joi.string(),
        detailAddress:detailAddressschema
    }),
    pin:Joi.number(),
    country:Joi.string(),
    cart: Joi.array()
    .items({
      id: Joi.string()
        .required(),
      count: Joi.number()
        .required(),
    })
  });

  Joi.validate(data, schema, (err, value) => {
    const id = Math.ceil(Math.random() * 9999999);

    if (err) {
      res.status(422).json({
        status: 'error',
        message: 'Invalid request data',
        data: data
      });
    } else {
      res.json({
        status: 'success',
        message: 'User Validated successfully',
        data: Object.assign({id}, value)
      });
    }
  });

});

app.listen(port, () => { console.log(`App running on port ${port}`) });