import { Router } from 'express';
import {
  registerController,
  loginController,
  updateProfileController,
} from '../controllers/authController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { validateRegisterInput, validateLoginInput } from '../validators/authValidator.js';

const router = Router();

router.post('/register', validateRegisterInput, registerController);
router.post('/login', validateLoginInput, loginController);
router.patch('/profile', authMiddleware, updateProfileController);

export default router;
