import { BaseController } from "./base_controller";
import { Request, Response } from "express";
import CommentModel, { CommentAttributes } from "../models/comments_model";
import PostModel from "../models/posts_model";
import mongoose from "mongoose";

class CommentsController extends BaseController<CommentAttributes> {
  constructor() {
    super(CommentModel);
  }

  async getByPostId(req: Request, res: Response) {
    try {
      const comments = await CommentModel.find({ postId: req.params.id })
        .populate("author")
        .lean();
      res.status(200).send(comments);
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  }

  async create(req: Request, res: Response) {
    const comment = new CommentModel(req.body);

    try {
      await comment.save(req.body).then(async (comment) => {
        const postId: string = req.body.postId;
        const result = await CommentModel.aggregate([
          {
            $match: {
              postId: new mongoose.Types.ObjectId(postId),
              rating: { $exists: true },
            },
          },
          {
            $group: {
              _id: null,
              ratingCount: { $sum: 1 },
              averageRating: { $avg: "$rating" },
            },
          },
        ]);

        const updatedPost = await PostModel.findByIdAndUpdate(
          req.body.postId,
          {
            averageRating: result[0]?.averageRating.toFixed(2) ?? null,
            ratingCount: result[0]?.ratingCount ?? null,
          },
          { new: true }
        ).lean();

        res.status(200).send({
          comment,
          updatedAverageRating: updatedPost.averageRating,
        });
      });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  }

  async getByPostIdUserId(req: Request, res: Response) {
    try {
      const comment = await CommentModel.findOne({
        postId: req.params.postId,
        author: req.params.userId,
      });

      res.status(200).send(comment);
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  }
}

export default new CommentsController();
