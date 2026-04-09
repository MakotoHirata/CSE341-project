const express = require('express');
const auth = require('../middleware/auth');
const {
  getCommentsByTaskId,
  createComment,
  updateComment,
  deleteComment
} = require('../controllers/commentController');
const {
  validateObjectIdParam,
  validateCommentCreate,
  validateCommentUpdate
} = require('../middleware/validators');
const handleValidationErrors = require('../middleware/handleValidation');

const router = express.Router();

router.get('/:taskId', auth, validateObjectIdParam('taskId'), handleValidationErrors, getCommentsByTaskId);
router.post('/', auth, validateCommentCreate, handleValidationErrors, createComment);
router.put('/:id', auth, validateObjectIdParam('id'), validateCommentUpdate, handleValidationErrors, updateComment);
router.delete('/:id', auth, validateObjectIdParam('id'), handleValidationErrors, deleteComment);

module.exports = router;
