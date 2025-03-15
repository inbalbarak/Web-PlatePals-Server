import { BaseController } from "./base_controller";
import UserModel, { UserAttributes } from "../models/users_model";
import { Request, Response } from "express";

class UsersController extends BaseController<UserAttributes> {
  constructor() {
    super(UserModel);
  }

  updateSavedPosts = async (req: Request, res: Response) => {
    try {
      const { toSave, postId } = req.body;
      const action = toSave ? "$push" : "$pull";
      const user = await UserModel.findByIdAndUpdate(
        { _id: req.params.id },
        { [action]: { savedPosts: postId } },
        { new: true }
      );
      res.status(201).json(user);
    } catch (err) {
      res.status(500).json({ message: err });
    }
  };
}

export default new UsersController();
