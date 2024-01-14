import { Hono } from "hono";
import auth from "./routes/auth";
import profile from "./routes/profile";
import { jwt } from "hono/jwt";
import itineraries from "./routes/itineraries";
import { showRoutes } from "hono/dev";

const app = new Hono();

app.route("/auth", auth);

app.use(
  "/*",
  jwt({
    secret: process.env.JWT_SECRET || "",
  })
);

app.route("/profile", profile);

app.route("/itinerary", itineraries);

showRoutes(app);

export default app;
