const { body, validationResult } = require('express-validator');

exports.validateCreateTask = [
  body('title')
    .isString()
    .withMessage('Title must be a string')
    .notEmpty()
    .withMessage('Title is required'),

  body('description')
    .optional()
    .isString()
    .withMessage('Description must be a string'),

  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high'])
    .withMessage('Invalid priority'),

  body('status')
    .optional()
    .isIn(['todo', 'doing', 'done'])
    .withMessage('Invalid status'),

  body('isArchived')
    .optional()
    .isBoolean()
    .withMessage('isArchived must be boolean'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }
    next();
  }
];