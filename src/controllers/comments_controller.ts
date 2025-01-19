import { BaseController } from "./base_controller";
import { Request, Response } from "express";
import CommentModel, { CommentAttributes } from "../models/comments_model";
import PostModel from "../models/posts_model";

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
    super
      .create(req, res)
      .then(async (comment) => {
        const result = await CommentModel.aggregate([
          {
            $match: {
              postId: req.body.postId,
              rating: { $exists: true },
            },
          },
          {
            $group: {
              _id: null,
              count: { $sum: 1 },
              averageViews: { $avg: "$rating" },
            },
          },
        ]);

        PostModel.findByIdAndUpdate(req.body.postId, {
          averageRating: result[0].averageRating,
          ratingCount: result[0].count,
        });

        res.status(200).send(comment);
      })
      .catch((error) => {
        res.status(500).send({ message: error.message });
      });
  }
}

export default new CommentsController();
