import mongoose from "mongoose";
import UserModel, { UserAttributes } from "../models/users_model";
import initApp from "../server";
import request from "supertest";
import { Express } from "express";
import PostModel from "../models/posts_model";

let app: Express;

type User = UserAttributes & { token?: string };
const testUser: User = {
  username: "inbal3",
  email: "test3@user.com",
  password: "testpassword",
  savedPosts: [],
};

let postId = "";

beforeAll(async () => {
  app = await initApp();
  await UserModel.deleteMany();
  await request(app).post("/auth/register").send(testUser);
  const res = await request(app).post("/auth/login").send(testUser);
  testUser.token = res.body.refreshToken;
  testUser._id = res.body.userId;
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
  Promise.all([PostModel.deleteMany(), UserModel.deleteMany()])
    .then(() => {
      mongoose.connection.close();
      done();
    })
    .catch(done);
});

describe("Users tests", () => {
  test("Test get user by id", async () => {
    const response = await request(app)
      .get("/users/" + testUser._id)
      .set({ authorization: "JWT " + testUser.token });
    expect(response.statusCode).toBe(200);
    expect(response.body.username).toBe(testUser.username);
    expect(response.body.email).toBe(testUser.email);
  });

  test("Test update user", async () => {
    const response = await request(app)
      .put("/users/")
      .set({ authorization: "JWT " + testUser.token })
      .send({
        _id: testUser._id,
        username: testUser.username + "changed",
      });

    expect(response.statusCode).toBe(201);
  });

  test("Test get user by id after change", async () => {
    const response = await request(app)
      .get("/users/" + testUser._id)
      .set({ authorization: "JWT " + testUser.token });
    expect(response.statusCode).toBe(200);
    expect(response.body.username).toBe(testUser.username + "changed");
    expect(response.body.email).toBe(testUser.email);
  });

  test("Test update saved posts - save post", async () => {
    const response = await request(app)
      .put(`/users/${testUser._id}/saved-posts`)
      .set({ authorization: "JWT " + testUser.token })
      .send({ toSave: true, postId });

    expect(response.statusCode).toBe(201);
    expect(response.body.savedPosts).toContain(postId);
  });

  test("Test update saved posts - unsave post", async () => {
    await request(app)
      .put(`/users/${testUser._id}/saved-posts`)
      .set({ authorization: "JWT " + testUser.token })
      .send({ toSave: true, postId });

    const response = await request(app)
      .put(`/users/${testUser._id}/saved-posts`)
      .set({ authorization: "JWT " + testUser.token })
      .send({ toSave: false, postId });

    expect(response.statusCode).toBe(201);
    expect(response.body.savedPosts).not.toContain(postId);
  });
});
