import request from "supertest";
import appInit from "../server";
import mongoose from "mongoose";
import { Express } from "express";

let app: Express;

beforeAll(async () => {
  console.log("Before all tests");
  app = await appInit();
});

afterAll(() => {
  console.log("After all tests");
  mongoose.connection.close();
});

describe("File Tests", () => {
  test("upload file", async () => {
    const filePath = `${__dirname}/test_file.txt`;

    try {
      const response = await request(app)
        .post("/files?file=test_file.txt")
        .attach("file", filePath);
      expect(response.statusCode).toEqual(200);
      let url = response.body.url;
      url = url.replace(/^.*\/\/[^/]+/, "");
      const res = await request(app).get(url);
      expect(res.statusCode).toEqual(200);
    } catch (err) {
      console.log(err);
      expect(1).toEqual(2);
    }
  });
});
