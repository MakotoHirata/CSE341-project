const express = require('express');
const auth = require('../middleware/auth');
const {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject
} = require('../controllers/projectController');
const {
  validateObjectIdParam,
  validateProjectCreate,
  validateProjectUpdate
} = require('../middleware/validators');
const handleValidationErrors = require('../middleware/handleValidation');

const router = express.Router();

router.get('/', auth, getProjects);
router.get('/:id', auth, validateObjectIdParam('id'), handleValidationErrors, getProjectById);
router.post('/', auth, validateProjectCreate, handleValidationErrors, createProject);
router.put('/:id', auth, validateObjectIdParam('id'), validateProjectUpdate, handleValidationErrors, updateProject);
router.delete('/:id', auth, validateObjectIdParam('id'), handleValidationErrors, deleteProject);

module.exports = router;
