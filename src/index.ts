import { Hono } from "hono";
import auth from "./routes/auth";
import profile from "./routes/profile";
import { jwt } from "hono/jwt";
import { showRoutes } from "hono/dev";
import { cors } from 'hono/cors'

const app = new Hono();

// using cors I need to allow Access-Control-Allow-Origin for the origin localhost:5173
app.use('*', cors({
    origin: 'http://localhost:5173',
    allowHeaders: ['Content-Type', 'Authorization'],
    allowMethods: ['POST', 'GET', 'OPTIONS'],
    exposeHeaders: ['Content-Length'],
    maxAge: 600,
    credentials: true,
}))
app.options('*', (c) => {
    return c.text('', 204)
})


app.route("/auth", auth);

app.use(
  "/*",
  jwt({
    secret: process.env.JWT_SECRET || "",
  })
);

app.route("/profile", profile);

showRoutes(app);

export default app;
