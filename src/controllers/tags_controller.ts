import createController from "./base_controller";
import TagModel, { TagAttributes } from "../models/tags_model";

const tagsController = createController<TagAttributes>(TagModel);

export default tagsController;
