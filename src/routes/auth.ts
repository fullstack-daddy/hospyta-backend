import { Router } from 'express';
import { register, login, getMe } from '../controllers/authController';
import { protect } from '../middlewares/auth';
import upload from '../middlewares/multer';


const router = Router();

router.post('/register', upload.single('profilePicture'), register);
router.post('/login', login);
router.get('/me', protect, getMe);

export default router;
