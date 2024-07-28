import { Response } from 'express';
import Comment from '../models/Comment';
import Post from '../models/Post';
import { AuthRequest } from '../middlewares/auth';

export const addComment = async (req: AuthRequest, res: Response) => {
  const { content } = req.body;
  const { postId } = req.params;

  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated',
      });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    const comment = new Comment({
      post: post._id,
      user: req.user._id,
      text: content
    });

    const savedComment = await comment.save();

    // Add the comment reference to the post's comments array
    post.comments.push(savedComment.id);
    await post.save();

    res.status(201).json({
      success: true,
      data: savedComment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: (error as Error).message,
    });
  }
};

export const getComments = async (req: AuthRequest, res: Response) => {
  const { postId } = req.params;
  try {
    const comments = await Comment.find({ post: postId }).populate('user', 'username profilePicture');
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};