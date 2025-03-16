import mongoose, { Schema } from "mongoose";
export interface UserAttributes {
  username?: string;
  email: string;
  password: string;
  imageUrl?: string;
  _id?: string;
  refreshToken?: string[];
  savedPosts: mongoose.Types.ObjectId[];
}

const userSchema = new mongoose.Schema<UserAttributes>({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
  },
  password: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
  },
  refreshToken: {
    type: [String],
    default: [],
  },
  savedPosts: [
    {
      type: Schema.Types.ObjectId,
      ref: "Posts",
      default: [],
    },
  ],
});

const UserModel = mongoose.model<UserAttributes>("Users", userSchema);
export default UserModel;

/**
 * @swagger
 * components:
 *   schemas:
 *     Users:
 *       type: object
 *       required:
 *         - email
 *         - username
 *       properties:
 *         email:
 *           type: string
 *           description: The user email
 *         username:
 *           type: string
 *           description: The user username
 *       example:
 *         email: 'usernameexample'
 *         username: '123456'
 */
