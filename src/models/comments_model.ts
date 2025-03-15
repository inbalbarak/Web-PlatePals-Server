import mongoose, { Schema } from "mongoose";
export interface CommentAttributes {
  _id?: string;
  content: string;
  author: mongoose.Types.ObjectId;
  postId: mongoose.Types.ObjectId;
  rating?: number;
}

const commentSchema = new mongoose.Schema<CommentAttributes>(
  {
    author: { type: Schema.Types.ObjectId, ref: "Users", required: true },
    content: { type: String, required: true },
    rating: { type: Number, min: 0, max: 5 },
    postId: { type: Schema.Types.ObjectId, ref: "Posts", required: true },
  },
  { timestamps: true }
);

const CommentModel = mongoose.model<CommentAttributes>(
  "Comments",
  commentSchema
);
export default CommentModel;

/**
 * @swagger
 * components:
 *   schemas:
 *     Comments:
 *       type: object
 *       required:
 *         - content
 *         - author
 *         - postId
 *         - rating
 *       properties:
 *         author:
 *           type: string
 *           description: The author id
 *         content:
 *           type: string
 *           description: The comment content
 *         rating:
 *           type: number
 *           description: The chosen rating
 *         postId:
 *           type: string
 *           description: The post id
 *       example:
 *         author: '6783ef381c4c2468f4c...'
 *         rating: 4
 *         content: 'loved this recipe'
 *         postId: '6783ef381c4c2468f4c...'
 */
