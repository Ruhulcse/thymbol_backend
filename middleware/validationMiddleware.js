// src/middleware/validationMiddleware.js
const { plainToInstance } = require('class-transformer');
const { validate } = require('class-validator');

const validationMiddleware = (type) => {
  return async (req, res, next) => {
    console.log('req.body', req.body);
    const dto = plainToInstance(type, req.body);
    const errors = await validate(dto);
    if (errors.length) {
      res.status(400).json({
        message: 'Validation failed',
        errors: errors.map(error => ({
          property: error.property,
          constraints: error.constraints,
        })),
      });
      return;
    }
    next();
  };
};

module.exports = validationMiddleware;
