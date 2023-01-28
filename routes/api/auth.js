const express = require('express');

const ctrl = require('../../controllers/auth');
const { validation, authenticate, upload } = require('../../middlewares');

const { signupSchema, loginSchema, subscriptionSchema } = require('../../shemas/users');

const router = express.Router();

router.post('/signup', validation(signupSchema), ctrl.signup);

router.post('/login', validation(loginSchema), ctrl.login);

router.get('/current', authenticate, ctrl.getCurrent);

router.post('/logout', authenticate, ctrl.logout);

router.patch('/avatars', authenticate, upload.single('avatar'), ctrl.updateAvatar);

module.exports = router;