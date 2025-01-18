import { BaseController } from "./base_controller";
import UserModel, { UserAttributes } from "../models/users_model";

const UsersController = new BaseController<UserAttributes>(UserModel);

export default UsersController;
