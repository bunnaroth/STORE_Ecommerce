import { Router } from 'express';
import { registerController, loginController } from '../controllers/authController.js';
import { validateRegisterInput, validateLoginInput } from '../validators/authValidator.js';

const router = Router();

router.post('/register', validateRegisterInput, registerController);
router.post('/login', validateLoginInput, loginController);

export default router;
