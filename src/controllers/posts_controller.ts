import createController from "./base_controller";
import PostModel, { PostAttributes } from "../models/posts_model";
import { Request, Response } from "express";

const postsController = createController<PostAttributes>(PostModel);

const getByAuthor = async (req: Request, res: Response) => {
  try {
    res.status(200).json(await PostModel.find({ author: req.params.authorId }));
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

export { postsController, getByAuthor };
