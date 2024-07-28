import { Request, Response } from 'express';
import Post, { IPost } from '../models/Post';  // Assuming the interface IPost is exported from the model
import cloudinary from '../config/cloudinary';
import { AuthRequest } from '../middlewares/auth';

export const createPost = async (req: AuthRequest, res: Response) => {
  const { content, category } = req.body;

  try {
    let imageUrl = '';

    if (req.file) {
      const result = await new Promise<any>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream((error, result) => {
          if (result) {
            resolve(result);
          } else {
            reject(error);
          }
        });

        stream.end(req.file?.buffer ?? Buffer.from(''));
      });

      imageUrl = result.secure_url;
    }

    const newPost = new Post({
      content,
      category,
      image: imageUrl,
      user: req.user?.id,
    });

    const savedPost = await newPost.save();

    res.status(201).json({
      success: true,
      data: savedPost,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: (error as Error).message,
    });
  }
};

export const updatePost = async (req: AuthRequest, res: Response) => {
  const { content, category } = req.body;

  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    if (post.user.toString() !== req.user?.id) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    let imageUrl = post.image;

    if (req.file) {
      const result = await new Promise<any>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream((error, result) => {
          if (result) {
            resolve(result);
          } else {
            reject(error);
          }
        });

        stream.end(req.file?.buffer ?? Buffer.from(''));
      });

      imageUrl = result.secure_url;
    }

    post.content = content || post.content;
    post.category = category || post.category;
    post.image = imageUrl;

    const updatedPost = await post.save();

    res.status(200).json({
      success: true,
      data: updatedPost,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: (error as Error).message,
    });
  }
};

export const deletePost = async (req: AuthRequest, res: Response) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    if (post.user.toString() !== req.user?.id) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    await Post.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Post removed',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: (error as Error).message,
    });
  }
};

export const getPosts = async (req: Request, res: Response) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: posts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: (error as Error).message,
    });
  }
};

export const upvotePost = async (req: AuthRequest, res: Response) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated',
      });
    }

    const userId = req.user.id;

    if (post.upvotes.includes(userId)) {
      post.upvotes = post.upvotes.filter((id) => id.toString() !== userId);
    } else {
      post.upvotes.push(userId);
    }

    const updatedPost = await post.save();

    res.status(200).json({
      success: true,
      data: updatedPost,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: (error as Error).message,
    });
  }
};

export const downvotePost = async (req: AuthRequest, res: Response) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    if (post.downvotes.includes(req.user!.id)) {
      post.downvotes = post.downvotes.filter((userId) => userId.toString() !== req.user!.id);
    } else {
      post.downvotes.push(req.user!.id);
    }

    const updatedPost = await post.save();

    res.status(200).json({
      success: true,
      data: updatedPost,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: (error as Error).message,
    });
  }
};

export const addComment = async (req: AuthRequest, res: Response) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    const newComment = {
      user: req.user!.id,
      text: req.body.text,
    };

    post.comments.push(newComment);

    const updatedPost = await post.save();

    res.status(200).json({
      success: true,
      data: updatedPost,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: (error as Error).message,
    });
  }
};

export const getComments = async (req: Request, res: Response) => {
  try {
    const post = await Post.findById(req.params.id).populate('comments.user');

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    res.status(200).json({
      success: true,
      data: post.comments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: (error as Error).message,
    });
  }
};
