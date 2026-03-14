const express = require('express');
const auth = require('../middleware/auth');
const {
  getCommentsByTaskId,
  createComment,
  deleteComment
} = require('../controllers/commentController');
const {
  validateObjectIdParam,
  validateCommentCreate
} = require('../middleware/validators');
const handleValidationErrors = require('../middleware/handleValidation');

const router = express.Router();

router.get('/:taskId', auth, validateObjectIdParam('taskId'), handleValidationErrors, getCommentsByTaskId);
router.post('/', auth, validateCommentCreate, handleValidationErrors, createComment);
router.delete('/:id', auth, validateObjectIdParam('id'), handleValidationErrors, deleteComment);

module.exports = router;
