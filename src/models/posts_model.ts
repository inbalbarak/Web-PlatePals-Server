import mongoose, { Schema } from "mongoose";
export interface PostAttributes {
  _id?: string;
  title: string;
  author: mongoose.Types.ObjectId;
  tags: mongoose.Types.ObjectId[];
  averageRating: number;
  ratingCount: number;
  imageUrl?: string;
  ingredients: string;
  instructions: string;
  commentCount: number;
}

const postSchema = new mongoose.Schema<PostAttributes>(
  {
    title: {
      type: String,
      required: true,
    },
    author: { type: Schema.Types.ObjectId, ref: "Users", required: true },
    tags: [
      {
        type: Schema.Types.ObjectId,
        ref: "Tags",
        default: [],
      },
    ],
    imageUrl: {
      type: String,
    },
    ingredients: {
      type: String,
      required: true,
    },
    instructions: {
      type: String,
      required: true,
    },
    averageRating: {
      type: Number,
      default: 0,
    },
    ratingCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

postSchema.virtual("commentCount", {
  ref: "Comments",
  localField: "_id",
  foreignField: "postId",
  count: true,
});

postSchema.set("toJSON", { virtuals: true });
postSchema.set("toObject", { virtuals: true });

const PostModel = mongoose.model<PostAttributes>("Posts", postSchema);
export default PostModel;

/**
 * @swagger
 * components:
 *   schemas:
 *     Posts:
 *       type: object
 *       required:
 *         - title
 *         - author
 *         - ingredients
 *         - instructions
 *       properties:
 *         title:
 *           type: string
 *           description: The post title
 *         author:
 *           type: string
 *           description: The username of the user that created the post
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           description: The post tag IDs
 *         rating:
 *           type: number
 *           description: The post rating
 *         ingredients:
 *           type: string
 *           description: The post ingredients
 *         instructions:
 *           type: string
 *           description: The post instructions
 *       example:
 *         title: "title example"
 *         author: "6783ef381c4c2468f4c..."
 *         tags: ["123", "1234"]
 *         rating: 4
 *         ingredients: "post ingredients listing"
 *         instructions: "post instructions"
 */
