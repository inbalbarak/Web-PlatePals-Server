import createController from "./base_controller";
import UserModel, { UserAttributes } from "../models/users_model";

const usersController = createController<UserAttributes>(UserModel);

export default usersController;
