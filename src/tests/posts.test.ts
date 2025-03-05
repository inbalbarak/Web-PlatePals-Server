import request from "supertest";
import initApp from "../server";
import mongoose from "mongoose";
import { Express } from "express";
import PostModel from "../models/posts_model";
import UserModel, { UserAttributes } from "../models/users_model";

let app: Express;

type User = UserAttributes & { token?: string };
const testUser: User = {
  username: "inbal2",
  email: "test2@user.com",
  password: "testpassword",
};

beforeAll(async () => {
  console.log("beforeAll");
  app = await initApp();
  await PostModel.deleteMany();
  await UserModel.deleteMany();
  await request(app).post("/auth/register").send(testUser);
  const res = await request(app).post("/auth/login").send(testUser);
  testUser.token = res.body.accessToken;
  testUser._id = res.body._id;
});

afterAll((done) => {
  console.log("afterAll");
  mongoose.connection.close();
  done();
});

describe("Posts Tests", () => {
  test("Posts test get all", async () => {
    const response = await request(app).get("/posts");
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(0);
  });

  test("Test Create Post", async () => {
    const response = await request(app)
      .post("/posts")
      .set({ authorization: "JWT " + testUser.token })
      .send({
        title: "recipe title",
        author: testUser._id,
        tags: [],
        rating: 0,
        ingredients: "ingredients",
        instructions: "instructions",
      });
    expect(response.statusCode).toBe(201);
    expect(response.body.author).toBe(testUser._id);
    expect(response.body.title).toBe("Test Post");
    expect(response.body.ingredients).toBe("ingredients");
    expect(response.body.instructions).toBe("instructions");
  });

  test("Test get post by author", async () => {
    const response = await request(app).get("/posts/author/" + testUser._id);
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body[0].title).toBe("recipe title");
    expect(response.body[0].ingredients).toBe("ingredients");
  });
});
