import { Document, Schema, model } from 'mongoose';

export interface IComment extends Document {
  post: Schema.Types.ObjectId;
  user: Schema.Types.ObjectId;
  text: string;
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema = new Schema<IComment>({
  post: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true },
}, { timestamps: true });

export default model<IComment>('Comment', CommentSchema);