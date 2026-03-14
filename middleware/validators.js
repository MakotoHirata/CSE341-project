const { body, param } = require('express-validator');

const taskStatusEnum = ['todo', 'in-progress', 'done'];
const taskPriorityEnum = ['low', 'medium', 'high'];

const validateObjectIdParam = (name = 'id') => [
  param(name).isMongoId().withMessage(`${name} must be a valid MongoDB ObjectId`)
];

const atLeastOne = (fields) =>
  body().custom((value, { req }) => {
    const hasAnyField = fields.some((field) => req.body[field] !== undefined);
    if (!hasAnyField) {
      throw new Error(`At least one of [${fields.join(', ')}] is required`);
    }
    return true;
  });

const validateProjectCreate = [
  body('projectName')
    .isString()
    .withMessage('projectName must be a string')
    .notEmpty()
    .withMessage('projectName is required'),
  body('description').optional().isString().withMessage('description must be a string'),
  body('ownerId').optional().isMongoId().withMessage('ownerId must be a valid MongoDB ObjectId'),
  body('members').optional().isArray().withMessage('members must be an array'),
  body('members.*').optional().isMongoId().withMessage('each member must be a valid MongoDB ObjectId')
];

const validateProjectUpdate = [
  body('projectName').optional().isString().withMessage('projectName must be a string').notEmpty(),
  body('description').optional().isString().withMessage('description must be a string'),
  body('ownerId').optional().isMongoId().withMessage('ownerId must be a valid MongoDB ObjectId'),
  body('members').optional().isArray().withMessage('members must be an array'),
  body('members.*').optional().isMongoId().withMessage('each member must be a valid MongoDB ObjectId'),
  atLeastOne(['projectName', 'description', 'ownerId', 'members'])
];

const validateTaskCreate = [
  body('title').isString().withMessage('title must be a string').notEmpty().withMessage('title is required'),
  body('description').optional().isString().withMessage('description must be a string'),
  body('status').optional().isIn(taskStatusEnum).withMessage('status must be one of todo, in-progress, done'),
  body('priority').optional().isIn(taskPriorityEnum).withMessage('priority must be one of low, medium, high'),
  body('dueDate').optional().isISO8601().withMessage('dueDate must be a valid ISO8601 date'),
  body('projectId').isMongoId().withMessage('projectId must be a valid MongoDB ObjectId'),
  body('assignedUserId').optional().isMongoId().withMessage('assignedUserId must be a valid MongoDB ObjectId')
];

const validateTaskUpdate = [
  body('title').optional().isString().withMessage('title must be a string').notEmpty(),
  body('description').optional().isString().withMessage('description must be a string'),
  body('status').optional().isIn(taskStatusEnum).withMessage('status must be one of todo, in-progress, done'),
  body('priority').optional().isIn(taskPriorityEnum).withMessage('priority must be one of low, medium, high'),
  body('dueDate').optional({ nullable: true }).isISO8601().withMessage('dueDate must be a valid ISO8601 date'),
  body('projectId').optional().isMongoId().withMessage('projectId must be a valid MongoDB ObjectId'),
  body('assignedUserId').optional({ nullable: true }).isMongoId().withMessage('assignedUserId must be a valid MongoDB ObjectId'),
  atLeastOne(['title', 'description', 'status', 'priority', 'dueDate', 'projectId', 'assignedUserId'])
];

const validateCommentCreate = [
  body('taskId').isMongoId().withMessage('taskId must be a valid MongoDB ObjectId'),
  body('commentText')
    .isString()
    .withMessage('commentText must be a string')
    .notEmpty()
    .withMessage('commentText is required')
];

module.exports = {
  validateObjectIdParam,
  validateProjectCreate,
  validateProjectUpdate,
  validateTaskCreate,
  validateTaskUpdate,
  validateCommentCreate
};
