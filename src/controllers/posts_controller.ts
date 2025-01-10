import createController from "./base_controller";
import PostModel, { PostAttributes } from "../models/posts_model";

const postsController = createController<PostAttributes>(PostModel);

export default postsController;
