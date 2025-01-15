import createController from "./base_controller";
import PostModel, { PostAttributes } from "../models/posts_model";

const postsController = createController<PostAttributes>(PostModel);

postsController.getAll = async (req, res) => {
  try {
    const posts = await PostModel.find().populate([
      { path: "author", select: "username" },
      { path: "tags", select: "name" },
    ]);

    // TODO get ratings from comments model
    res.status(200).send(posts);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

export default postsController;
