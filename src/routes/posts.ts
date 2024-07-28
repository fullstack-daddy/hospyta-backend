import express from 'express';
import { createPost, updatePost, deletePost, getPosts, upvotePost, downvotePost, addComment, getComments } from '../controllers/postController';
import { protect } from '../middlewares/auth';
import upload  from '../middlewares/multer';

const router = express.Router();

router.post('/', protect, upload.single('image'), createPost);
router.put('/:id', protect, upload.single('image'), updatePost);
router.delete('/:id', protect, deletePost);
router.get('/', getPosts);
router.post('/:id/upvote', protect, upvotePost);
router.post('/:id/downvote', protect, downvotePost);
router.post('/:id/comments', protect, addComment);
router.get('/:id/comments', getComments);

export default router;
