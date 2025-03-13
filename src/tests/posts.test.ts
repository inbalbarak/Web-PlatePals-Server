import request from "supertest";
import initApp from "../server";
import mongoose from "mongoose";
import postModel from "../models/posts_model";
import { Express } from "express";
import userModel, { UserAttributes } from "../models/users_model";

let app: Express;

type User = UserAttributes & { token?: string; userId?: string };
const testUser: User = {
  email: "test@user.com",
  password: "testpassword",
  username: "testuser",
};

beforeAll(async () => {
  console.log("beforeAll");
  app = await initApp();
  await postModel.deleteMany();
  await userModel.deleteMany();
  await request(app).post("/auth/register").send(testUser);
  const res = await request(app).post("/auth/login").send(testUser);
  testUser.token = res.body.refreshToken;
  testUser.userId = res.body.userId;
  expect(testUser.token).toBeDefined();
});

afterAll((done) => {
  console.log("afterAll");
  mongoose.connection.close();
  done();
});

let postId = "";
describe("Posts Tests", () => {
  test("Posts test get all", async () => {
    const response = await request(app)
      .get("/posts")
      .set({ authorization: "JWT " + testUser.token });
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(0);
  });

  test("Test Create Post", async () => {
    const response = await request(app)
      .post("/posts")
      .set({ authorization: "JWT " + testUser.token })
      .send({
        ingredients: "Test Ingredients",
        instructions: "Test Instructions",
        title: "Test Post",
        author: testUser.username,
      });
    expect(response.statusCode).toBe(201);
    expect(response.body.title).toBe("Test Post");
    expect(response.body.instructions).toBe("Test Instructions");
    expect(response.body.ingredients).toBe("Test Ingredients");
    postId = response.body._id;
  });

  test("Test get post by author", async () => {
    const response = await request(app)
      .get("/posts?author=" + testUser.username)
      .set({ authorization: "JWT " + testUser.token });
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body[0].title).toBe("Test Post");
    expect(response.body[0].instructions).toBe("Test Instructions");
    expect(response.body[0].ingredients).toBe("Test Ingredients");
  });

  test("Test Create Post 2", async () => {
    const response = await request(app)
      .post("/posts")
      .set({ authorization: "JWT " + testUser.token })
      .send({
        ingredients: "test",
        instructions: "test",
        title: "Test Post 2",
        author: testUser.username,
      });
    expect(response.statusCode).toBe(201);
  });

  test("Posts test get all 2", async () => {
    const response = await request(app)
      .get("/posts")
      .set({ authorization: "JWT " + testUser.token });

    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(2);
  });

  test("Test Delete Post", async () => {
    const response = await request(app)
      .delete("/posts/" + postId)
      .set({ authorization: "JWT " + testUser.token });
    expect(response.statusCode).toBe(200);
    const response2 = await request(app).get("/posts/" + postId);
    expect(response2.statusCode).toBe(404);
  });

  test("Test Create Post fail", async () => {
    const response = await request(app)
      .post("/posts")
      .set({ authorization: "JWT " + testUser.token })
      .send({
        ingredients: "test",
      });
    expect(response.statusCode).toBe(400);
  });
});
