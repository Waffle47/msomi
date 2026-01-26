import express from 'express';
import { register, login, changePassword, deleteAccount, logout } from '../controllers/auth.js';
//import { authMiddleware } from '../middleware/auth.js';
import { registerValidation, loginValidation, changePasswordValidation, deleteAccountValidation, validateRequest } from '../middleware/validate.js';

const router = express.Router();

router.post('/register', express.json(), express.urlencoded({ extended: true }), registerValidation, validateRequest, register);
router.post('/login', express.json(), express.urlencoded({ extended: true }), loginValidation, validateRequest, login);
router.post('/change-password', express.json(), express.urlencoded({ extended: true }), changePasswordValidation, validateRequest, changePassword);
router.delete('/delete-account', express.json(), express.urlencoded({ extended: true }), deleteAccountValidation, validateRequest, deleteAccount);
router.post('/logout', express.json(), express.urlencoded({ extended: true }), logout);

export default router;