const { Router } = require('express');
const {
  loginController,
  registerController,
} = require('../controllers/auth.controller');

const authRoutes = Router();

authRoutes.post('/register', registerController);
authRoutes.post('/login', loginController);

module.exports = authRoutes;