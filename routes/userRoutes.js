const express = require('express');
const auth = require('../middleware/auth');
const { getUsers, getUserById } = require('../controllers/userController');
const { validateObjectIdParam } = require('../middleware/validators');
const handleValidationErrors = require('../middleware/handleValidation');

const router = express.Router();

router.get('/', auth, getUsers);
router.get('/:id', auth, validateObjectIdParam('id'), handleValidationErrors, getUserById);

module.exports = router;
