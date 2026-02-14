
const express = require('express');
const router = express.Router();
const {
  getTasks,
  createTask,
  updateTask,
  deleteTask
} = require('../controllers/taskController');

/**
 * @swagger
 * /tasks:
 *   get:
 *     summary: Get all tasks
 *     tags:
 *       - Tasks
 *     responses:
 *       200:
 *         description: List of tasks
 */
router.get('/', getTasks);

/**
 * 
 * /tasks:
 *   post:
 *     summary: Create a new task
 *     tags:
 *       - Tasks
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               priority:
 *                 type: string
 *                 enum: [low, medium, high]
 *     responses:
 *       201:
 *         description: Task created
 */
router.post('/', createTask);

/**
@swagger
 * /tasks/{id}:
 *  put:
 *    summary: Update task
 *    tags: [Tasks]
 *    parameters:
 *     - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *    requestBody:
 *      required: true
 *      content:
 *       application/json:
 *          schema:
 *            type: object
 *            properties:
 *              title:
 *                type: string
 *              description:
 *                type: string
 *              priority:
 *                type: string
 *                enum: [low, medium, high]
 *              completed:
 *                type: boolean
 *    responses:
 *      200:
 *        description: Task updated
 *      400:
 *        description: Bad request
 *      404:
 *        description: Task not found
 *      500:
 *        description: Internal server error
 */
router.put('/:id', updateTask);

/**
 * @swagger
 * /tasks/{id}:
 * delete:
 *   summary: Delete task
 *   tags: [Tasks]
 *   parameters:
 *     - in: path
 *       name: id
 *       required: true
 *       schema:
 *         type: string
 *   responses:
 *     200:
 *       description: Task deleted successfully
 *     404:
 *       description: Task not found
 *     500:
 *       description: Internal server error
 */
router.delete('/:id', deleteTask);

/**
 * @swagger
 * /tasks/{id}:
 *   delete:
 *     summary: Delete task
 *     tags:
 *       - Tasks
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *     responses:
 *       200:
 *         description: Task deleted
 */
router.delete('/:id', (req, res) => {
  res.status(501).json({ message: 'Not implemented yet' });
});

module.exports = router;