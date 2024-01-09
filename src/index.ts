import { Hono } from "hono";
import auth from "./routes/auth";
import profile from "./routes/profile";
import { jwt } from "hono/jwt";

const app = new Hono();

app.route("/auth", auth);

app.use(
  "/*",
  jwt({
    secret: process.env.JWT_SECRET || "",
  })
);

app.route("/profile", profile);

export default app;
