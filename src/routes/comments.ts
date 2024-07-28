import { Router } from 'express';
import {protect} from '../middlewares/auth';
import { addComment, getComments } from '../controllers/commentController';

const router = Router();

router.post('/addComment/:postId', protect, addComment);
router.get('/:postId', getComments);

export default router;
