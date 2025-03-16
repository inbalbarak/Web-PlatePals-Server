import { BaseController } from "./base_controller";
import TagModel, { TagAttributes } from "../models/tags_model";

const tagsController = new BaseController<TagAttributes>(TagModel);

export default tagsController;
