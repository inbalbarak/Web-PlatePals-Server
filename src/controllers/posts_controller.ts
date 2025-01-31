import createController from "./base_controller";
import PostModel, { PostAttributes } from "../models/posts_model";

const postsController = createController<PostAttributes>(PostModel);

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

export default postsController;
