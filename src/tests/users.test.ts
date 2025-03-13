import mongoose from "mongoose";
import UserModel, { UserAttributes } from "../models/users_model";
import initApp from "../server";
import request from "supertest";
import { Express } from "express";

let app: Express;

type User = UserAttributes & { token?: string; userId?: string };
const testUser: User = {
  username: "inbal3",
  email: "test3@user.com",
  password: "testpassword",
  savedPosts: [],
};

const testPostId = "507f1f77bcf86cd799439022";

beforeAll(async () => {
  app = await initApp();
  await UserModel.deleteMany();
  await request(app).post("/auth/register").send(testUser);
  const res = await request(app).post("/auth/login").send(testUser);
  testUser.token = res.body.accessToken;
  testUser.userId = res.body.userId;
});

afterAll((done) => {
  console.log("afterAll");
  mongoose.connection.close();
  done();
});

describe("Users tests", () => {
  test("Test get user by id", async () => {
    const response = await request(app).get("/users/" + testUser.userId);
    expect(response.statusCode).toBe(200);
    expect(response.body.username).toBe(testUser.username);
    expect(response.body.email).toBe(testUser.email);
  });

  test("Test update user", async () => {
    const response = await request(app)
      .put("/users/")
      .set({ authorization: "JWT " + testUser.token })
      .send({
        _id: testUser.userId,
        username: testUser.username + "changed",
      });

    expect(response.statusCode).toBe(201);
  });

  test("Test get user by id after change", async () => {
    const response = await request(app).get("/users/" + testUser.userId);
    expect(response.statusCode).toBe(200);
    expect(response.body.username).toBe(testUser.username + "changed");
    expect(response.body.email).toBe(testUser.email);
  });

  test("Test update saved posts - save post", async () => {
    const response = await request(app)
      .put(`/users/${testUser._id}/saved-posts`)
      .set({ authorization: "JWT " + testUser.token })
      .send({ toSave: true, postId: testPostId });

    expect(response.statusCode).toBe(201);
    expect(response.body.savedPosts).toContain(testPostId);
  });

  test("Test update saved posts - unsave post", async () => {
    await request(app)
      .put(`/users/${testUser._id}/saved-posts`)
      .set({ authorization: "JWT " + testUser.token })
      .send({ toSave: true, postId: testPostId });

    const response = await request(app)
      .put(`/users/${testUser._id}/saved-posts`)
      .set({ authorization: "JWT " + testUser.token })
      .send({ toSave: false, postId: testPostId });

    expect(response.statusCode).toBe(201);
    expect(response.body.savedPosts).not.toContain(testPostId);
  });
});
