import { Document, Schema, model } from 'mongoose';

export interface IPost extends Document {
  content: string;
  category: string;
  image: string;
  user: Schema.Types.ObjectId;
  upvotes: Schema.Types.ObjectId[];
  downvotes: Schema.Types.ObjectId[];
  comments: Schema.Types.ObjectId[]; 
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema = new Schema<IPost>({
  content: { type: String, required: true },
  category: { type: String, required: true },
  image: { type: String },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  upvotes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  downvotes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],  
}, { timestamps: true });

export default model<IPost>('Post', PostSchema);