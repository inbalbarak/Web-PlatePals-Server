import { BaseController } from "./base_controller";
import PostModel, { PostAttributes } from "../models/posts_model";
import { Request, Response } from "express";

class PostsController extends BaseController<PostAttributes> {
  constructor() {
    super(PostModel);
  }

  getAll = async (req: Request, res: Response) => {
    try {
      const posts = await PostModel.find()
        .populate([{ path: "tags", select: "name" }])
        .lean();

      res.status(200).send(posts);
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  };
}

export default new PostsController();
