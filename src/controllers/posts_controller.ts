import { BaseController } from "./base_controller";
import PostModel, { PostAttributes } from "../models/posts_model";
import { Request, Response } from "express";

class PostsController extends BaseController<PostAttributes> {
  constructor() {
    super(PostModel);
  }

  getByIds = async (req: Request, res: Response) => {
    try {
      const posts = await PostModel.find({
        _id: { $in: req.body.ids },
      })
        .populate({ path: "commentCount" })
        .lean();

      res.status(200).json(posts);
    } catch (err) {
      res.status(500).json({ message: err });
    }
  };

  getAll = async (req: Request, res: Response) => {
    try {
      const posts = await PostModel.find()
        .populate([
          { path: "tags", select: "name" },
          { path: "author", select: "username" },
          { path: "commentCount" },
        ])
        .lean();

      res.status(200).send(posts);
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  };

  getByAuthor = async (req: Request, res: Response) => {
    try {
      const userPosts = await PostModel.find({
        author: req.params.userId,
      })
        .populate({ path: "commentCount" })
        .lean();
      res.status(200).json(userPosts);
    } catch (err) {
      res.status(500).json({ message: err });
    }
  };
}

export default new PostsController();
