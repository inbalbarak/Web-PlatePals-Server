import { Model } from "mongoose";
import { Request, Response } from "express";

class BaseController<T> {
  model: Model<T>;
  constructor(model: Model<T>) {
    this.model = model;
  }

  create = async (req: Request, res: Response) => {
    const obj = new this.model(req.body);

    try {
      const savedObj = await obj.save(req.body);
      res.status(201).json(savedObj);
    } catch (err) {
      res.status(400).json({ message: err });
    }
  };

  getAll = async (_req: Request, res: Response) => {
    try {
      res.status(200).json(await this.model.find());
    } catch (err) {
      res.status(500).json({ message: err });
    }
  };

  getById = async (req: Request, res: Response) => {
    try {
      res.status(200).json(await this.model.findById(req.params.id));
    } catch (err) {
      res.status(500).json({ message: err });
    }
  };

  update = async (req: Request, res: Response) => {
    try {
      res
        .status(201)
        .json(
          await this.model.findByIdAndUpdate({ _id: req.body._id }, req.body)
        );
    } catch (err) {
      res.status(500).json({ message: err });
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      const deletedRes = await this.model.deleteOne({ _id: req.params.id });
      res.status(200).send(deletedRes);
    } catch (err) {
      res.status(500).send(err.message);
    }
  };
}

const createController = <T>(model: Model<T>) => new BaseController<T>(model);
export default createController;
