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

postsController.getAll = async (req, res) => {
  try {
    const posts = await PostModel.find()
      .populate([
        { path: "author", select: "username" },
        { path: "tags", select: "name" },
      ])
      .lean();

    const flattedPosts = posts.map((post: any) => {
      return {
        ...post,
        author: post.author.username,
        tags: post.tags.map((tag) => tag.name),
      };
    });

    res.status(200).send(flattedPosts);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

export { postsController, getByAuthor };
