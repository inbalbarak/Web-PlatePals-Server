import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Document } from "mongoose";
import { OAuth2Client } from "google-auth-library";
import { NextFunction, Request, Response } from "express";
import UsersModel, { UserAttributes } from "../models/users_model";
import UserModel from "../models/users_model";

const register = async (req: Request, res: Response) => {
  try {
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await UsersModel.create({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });

    res.status(200).send(user);
  } catch (err) {
    res.status(400).send(err);
  }
};

type tTokens = {
  accessToken: string;
  refreshToken: string;
};

const generateToken = (userId: string): tTokens | null => {
  if (!process.env.TOKEN_SECRET) {
    return null;
  }

  const random = Math.random().toString();
  const accessToken = jwt.sign(
    {
      _id: userId,
      random: random,
    },
    process.env.TOKEN_SECRET,
    { expiresIn: process.env.TOKEN_EXPIRES }
  );

  const refreshToken = jwt.sign(
    {
      _id: userId,
      random: random,
    },
    process.env.TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRES }
  );
  return {
    accessToken: accessToken,
    refreshToken: refreshToken,
  };
};

const login = async (req: Request, res: Response) => {
  try {
    const user = await UsersModel.findOne({ username: req.body.username });
    if (!user) {
      res.status(400).send("wrong username or password");
      return;
    }
    const validPassword =
      (await bcrypt.compare(req.body.password, user.password)) ||
      req.body.password === user.password;

    if (!validPassword) {
      res.status(400).send("wrong username or password");
      return;
    }
    if (!process.env.TOKEN_SECRET) {
      res.status(500).send("Server Error");
      return;
    }

    const tokens = generateToken(user._id);
    if (!tokens) {
      res.status(500).send("Server Error");
      return;
    }

    if (!user.refreshToken) {
      user.refreshToken = [];
    }

    user.refreshToken.push(tokens.refreshToken);
    await user.save();
    res.status(200).send({
      _id: user._id,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    });
  } catch (err) {
    res.status(400).send(err);
  }
};

type tUser = Document<unknown, object, UserAttributes> &
  UserAttributes &
  Required<{
    _id: string;
  }> & {
    __v: number;
  };

const verifyRefreshToken = (refreshToken: string | undefined) => {
  return new Promise<tUser>((resolve, reject) => {
    if (!refreshToken) {
      reject("fail");
      return;
    }

    if (!process.env.TOKEN_SECRET) {
      reject("fail");
      return;
    }

    jwt.verify(
      refreshToken,
      process.env.TOKEN_SECRET,
      async (err: unknown, payload: any) => {
        if (err) {
          reject("fail");
          return;
        }

        const userId = payload._id;
        try {
          const user = await UsersModel.findById(userId);
          if (!user) {
            reject("fail");
            return;
          }
          if (!user.refreshToken || !user.refreshToken.includes(refreshToken)) {
            user.refreshToken = [];
            await user.save();
            reject("fail");
            return;
          }
          const tokens = user.refreshToken!.filter(
            (token) => token !== refreshToken
          );
          user.refreshToken = tokens;

          resolve(user);
        } catch (_err) {
          reject("fail");
          return;
        }
      }
    );
  });
};

const refresh = async (req: Request, res: Response) => {
  try {
    const user = await verifyRefreshToken(req.body.refreshToken);

    if (!user) {
      res.status(400).send("fail");
      return;
    }

    const tokens = generateToken(user._id);

    if (!tokens) {
      res.status(500).send("Server Error");
      return;
    }

    if (!user.refreshToken) {
      user.refreshToken = [];
    }

    user.refreshToken.push(tokens.refreshToken);
    await user.save();

    res.status(200).send({
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      _id: user._id,
    });
  } catch (_err) {
    res.status(400).send("fail");
  }
};

type Payload = {
  _id: string;
};
const client = new OAuth2Client();

export const googleLogin = async (req: Request, res: Response) => {
  const credential = req.body.credential;
  try {
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.CLIENT_ID,
    });

    const payload = ticket.getPayload();
    req.body.email = payload.email;

    const email = payload?.email;
    let user = await UsersModel.findOne({ email: email });

    if (user == null) {
      user = await UsersModel.create({
        email: email,
        imgUrl: payload?.picture,
        password: "google-signin",
      });
    }

    const tokens = generateToken(user._id);
    res.status(200).send({
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      _id: user._id,
    });
  } catch (_err) {
    res.status(400).send("error in google login");
  }
};

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authorization = req.header("authorization");
  const token = authorization && authorization.split(" ")[1];

  if (!token) {
    res.status(401).send("Access Denied");
    return;
  }
  if (!process.env.TOKEN_SECRET) {
    res.status(500).send("Server Error");
    return;
  }

  jwt.verify(token, process.env.TOKEN_SECRET, (err, payload: Payload) => {
    if (err) {
      res.status(401).send("Access Denied");
      return;
    }
    req.params.userId = payload._id;
    next();
  });
};

const logout = (req: Request, res: Response) => {
  const authorization = req.header("authorization");
  const token = authorization && authorization.split(" ")[1];

  if (token === null) {
    res.status(401).send();
    return;
  }
  jwt.verify(
    token,
    process.env.TOKEN_SECRET,
    async (err, userInfo: UserAttributes) => {
      if (err) {
        return res.status(403).send(err.message);
      }
      const userId = userInfo._id;

      try {
        const user = await UserModel.findById(userId);
        if (userId == null) {
          return res.status(403).send("invalid request");
        }

        user.refreshToken = [];
        await user.save();

        res.status(200).send();
      } catch (err) {
        res.status(403).send(err.message);
      }
    }
  );
};

export default {
  register,
  login,
  refresh,
  googleLogin,
  logout,
};
