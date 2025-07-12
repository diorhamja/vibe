const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user.controller');
const requireAuth = require('../middleware/requireAuth');
const { upload } = require('../middleware/cloudinary');

router.post('/register', upload.single("profilePicture"), UserController.register);
router.post('/login', UserController.login);
router.post('/logout', UserController.logout);
router.get('/me', requireAuth, UserController.getCurrentUser);
router.get('/:id', requireAuth, UserController.getOneUser);
router.patch('/:id', requireAuth, upload.single("profilePicture"), UserController.updateUser);

module.exports = router;
