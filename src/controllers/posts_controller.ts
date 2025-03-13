import createController from "./base_controller";
import PostModel, { PostAttributes } from "../models/posts_model";
import { Request, Response } from "express";

const postsController = createController<PostAttributes>(PostModel);

postsController.getAll = async (req, res) => {
  try {
    const posts = await PostModel.find()
      .populate([{ path: "tags", select: "name" }])
      .lean();

    res.status(200).send(posts);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const getByAuthor = async (req: Request, res: Response) => {
  try {
    const userPosts = await PostModel.find({
      author: req.params.userId,
    }).lean();
    res.status(200).json(userPosts);
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

export { postsController, getByAuthor };
