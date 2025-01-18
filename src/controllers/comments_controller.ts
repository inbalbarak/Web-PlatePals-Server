import { BaseController } from "./base_controller";
import { Request, Response } from "express";
import CommentModel, { CommentAttributes } from "../models/comments_model";

class CommentsController extends BaseController<CommentAttributes> {
  constructor() {
    super(CommentModel);
  }

  getByPostId = async (req: Request, res: Response) => {
    try {
      const comments = await CommentModel.find({ postId: req.params.postId });
      res.status(200).send(comments);
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  };
}

export default new CommentsController();
