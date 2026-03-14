const express = require('express');
const auth = require('../middleware/auth');
const {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask
} = require('../controllers/taskController');
const {
  validateObjectIdParam,
  validateTaskCreate,
  validateTaskUpdate
} = require('../middleware/validators');
const handleValidationErrors = require('../middleware/handleValidation');

const router = express.Router();

router.get('/', auth, getTasks);
router.get('/:id', auth, validateObjectIdParam('id'), handleValidationErrors, getTaskById);
router.post('/', auth, validateTaskCreate, handleValidationErrors, createTask);
router.put('/:id', auth, validateObjectIdParam('id'), validateTaskUpdate, handleValidationErrors, updateTask);
router.delete('/:id', auth, validateObjectIdParam('id'), handleValidationErrors, deleteTask);

module.exports = router;
