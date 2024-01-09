import { Hono } from "hono";
import { validator } from "hono/validator";
import { z } from "zod";
import { PrismaClient, User } from "@prisma/client";
import { sign } from "hono/jwt";

const prisma = new PrismaClient();

const registerSchema = z.object({
  email: z.string().min(3).max(20),
  password: z.string().min(4).max(30),
  passwordConfirmation: z.string().min(4).max(30),
});

const loginSchema = z.object({
  email: z.string().min(3).max(20),
  password: z.string().min(4).max(30),
});

const auth = new Hono();

auth.post(
  "/login",
  validator("json", (value, c) => {
    const parsed = loginSchema.safeParse(value);
    if (!parsed.success) {
      return c.text("Invalid!", 401);
    }
    return parsed.data;
  }),
  async (c) => {
    const { email, password } = c.req.valid("json");

    if (!email || !password) {
      return c.text("Please provide a username and password", 400);
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return c.text("Invalid credentials", 401);
    }

    const passwordMatch = await Bun.password.verify(
      password,
      user.passwordHash
    );

    if (!passwordMatch) {
      return c.text("Invalid credentials", 401);
    }

    const jwt = await generateJWT(user);

    const { passwordHash, ...userWithoutPassword } = user;

    return c.json({
      message: "User returned successfully",
      user: userWithoutPassword,
      jwt,
    });
  }
);

auth.post(
  "/register",
  validator("json", (value, c) => {
    const parsed = registerSchema.safeParse(value);
    if (!parsed.success) {
      return c.text("Invalid!", 401);
    }
    return parsed.data;
  }),
  async (c) => {
    const { email, password, passwordConfirmation } = c.req.valid("json");
    if (password !== passwordConfirmation) {
      return c.text("Passwords do not match");
    }

    const passwordHash = await Bun.password.hash(password);

    const user = await prisma.user.create({ data: { email, passwordHash } });

    return c.json(user);
  }
);

const generateJWT = async (user: User) => {
  const payload = {
    id: user.id,
    email: user.email,
  };

  return await sign(payload, process.env.JWT_SECRET || "");
};

export default auth;
