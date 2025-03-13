import express, { Request, Response } from "express";
const router = express.Router();
import multer from "multer";

const base = process.env.DOMAIN_BASE + "/";
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "storage/");
  },
  filename: function (req, file, cb) {
    const ext = file.originalname.split(".").filter(Boolean).slice(1).join(".");
    cb(null, Date.now() + "." + ext);
  },
});
const upload = multer({ storage: storage });

router.post("/", upload.single("file"), function (req: Request, res: Response) {
  console.log("router.post(/file: " + base + req.file?.path);
  res.status(200).send({ url: base + req.file?.path });
});

export default router;
