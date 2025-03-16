import appInit from "./server";
import https from "https"
import fs from "fs"

const port = process.env.PORT;

const tmpFunc = async () => {
  const app = await appInit();
  if (process.env.NODE_ENV != "production") {
    app.listen(port, () => {
      console.log(`Example app listening at http://localhost:${port}`);
    });
  } else {
    const prop = {
      key: fs.readFileSync("../client-key.pem"),
      cert: fs.readFileSync("../client-cert.pem")
    }
    https.createServer(prop, app).listen(port)
  }
};

tmpFunc();