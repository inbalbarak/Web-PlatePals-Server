import request from "supertest";
import initApp from "../server";
import mongoose from "mongoose";
import { Express } from "express";
import postModel from "../models/posts_model";
import userModel, { UserAttributes } from "../models/users_model";
import commentModel from "../models/comments_model";

var app: Express;

type User = UserAttributes & { token?: string };
const testUser: User = {
  email: "test@user.com",
  password: "testpassword",
  username: "testuser",
};

let postId = "";
let commentId = "";

beforeAll(async () => {
  console.log("beforeAll");
  app = await initApp();
  await postModel.deleteMany();
  await userModel.deleteMany();
  await commentModel.deleteMany();
  await request(app).post("/auth/register").send(testUser);
  const res = await request(app).post("/auth/login").send(testUser);
  testUser.token = res.body.refreshToken;
  testUser._id = res.body._id;
  expect(testUser.token).toBeDefined();

  // Create a test post
  const postResponse = await request(app)
    .post("/posts")
    .set({ authorization: "JWT " + testUser.token })
    .send({
      title: "Test Post",
      ingredients: "Test Ingredients",
      instructions: "Test Instructions",
      author: testUser._id,
    });

  expect(postResponse.statusCode).toBe(201);
  postId = postResponse.body._id;
});

afterAll((done) => {
  console.log("afterAll");
  mongoose.connection.close();
  done();
});

describe("Comments Tests", () => {
  test("Create Comment", async () => {
    const response = await request(app)
      .post("/comments")
      .set({ authorization: "JWT " + testUser.token })
      .send({
        postId,
        userId: testUser._id,
        content: "This is a test comment",
      });

    expect(response.statusCode).toBe(201);
    expect(response.body.content).toBe("This is a test comment");
    expect(response.body.postId).toBe(postId);
    expect(response.body.userId).toBe(testUser._id);

    commentId = response.body._id;
  });

  test("Get Comments by Post Id", async () => {
    const response = await request(app)
      .get(`/comments/post/${postId}`)
      .set({ authorization: "JWT " + testUser.token });

    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body[0]._id).toBe(commentId);
  });

  test("Get Comment by Post ID and User ID", async () => {
    const response = await request(app)
      .get(`/comments/post/${postId}/user/${testUser._id}`)
      .set({ authorization: "JWT " + testUser.token });

    expect(response.statusCode).toBe(200);
    expect(response.body.content).toBe("This is a test comment");
    expect(response.body.userId).toBe(testUser._id);
  });

  test("Create Comment Fail (Missing Content)", async () => {
    const response = await request(app)
      .post("/comments")
      .set({ authorization: "JWT " + testUser.token })
      .send({
        postId,
        userId: testUser._id,
      });

    expect(response.statusCode).toBe(400);
  });
});
