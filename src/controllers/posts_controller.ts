import createController from "./base_controller";
import PostModel, { PostAttributes } from "../models/posts_model";

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

export default postsController;
