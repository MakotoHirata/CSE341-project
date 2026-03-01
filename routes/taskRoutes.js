const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router();

const {
  getTasks,
  createTask,
  updateTask,
  deleteTask
} = require('../controllers/taskController');

/**
 * #swagger.tags = ['Tasks']
 * #swagger.summary = 'Get all tasks'
 * #swagger.description = 'Retrieve all tasks for the logged-in user'
 * #swagger.security = [{ "cookieAuth": [] }]
 */
router.get('/', auth, getTasks);

/**
 * #swagger.tags = ['Tasks']
 * #swagger.summary = 'Create a new task'
 * #swagger.description = 'Create a new task'
 * #swagger.security = [{ "cookieAuth": [] }]
 * #swagger.requestBody = {
 *   required: true,
 *   content: {
 *     "application/json": {
 *       schema: {
 *         type: "object",
 *         required: ["title"],
 *         properties: {
 *           title: {
 *             type: "string",
 *             example: "Buy groceries"
 *           },
 *           description: {
 *             type: "string",
 *             example: "Milk and eggs"
 *           },
 *           status: {
 *             type: "string",
 *             enum: ["todo", "doing", "done"],
 *             example: "todo"
 *           },
 *           priority: {
 *             type: "string",
 *             enum: ["low", "medium", "high"],
 *             example: "medium"
 *           },
 *           isArchived: {
 *             type: "boolean",
 *             example: false
 *           }
 *         }
 *       }
 *     }
 *   }
 * }
 */
router.post('/', auth, createTask);

/**
 * #swagger.tags = ['Tasks']
 * #swagger.summary = 'Update a task'
 * #swagger.description = 'Update a task by ID'
 * #swagger.security = [{ "cookieAuth": [] }]
 * #swagger.parameters['id'] = {
 *   in: 'path',
 *   required: true,
 *   type: 'string',
 *   description: 'Task ID'
 * }
 * #swagger.requestBody = {
 *   required: true,
 *   content: {
 *     "application/json": {
 *       schema: {
 *         type: "object",
 *         properties: {
 *           title: { type: "string" },
 *           description: { type: "string" },
 *           priority: {
 *             type: "string",
 *             enum: ["low", "medium", "high"]
 *           },
 *           status: {
 *             type: "string",
 *             enum: ["todo", "doing", "done"]
 *           },
 *           isArchived: { type: "boolean" }
 *         }
 *       }
 *     }
 *   }
 * }
 */
router.put('/:id', auth, updateTask);

/**
 * #swagger.tags = ['Tasks']
 * #swagger.summary = 'Delete a task'
 * #swagger.description = 'Delete a task by ID'
 * #swagger.security = [{ "cookieAuth": [] }]
 * #swagger.parameters['id'] = {
 *   in: 'path',
 *   required: true,
 *   type: 'string',
 *   description: 'Task ID'
 * }
 */
router.delete('/:id', auth, deleteTask);

module.exports = router;