import {Hono} from "hono";
import {PrismaClient} from "@prisma/client";
import {validator} from "hono/validator";
import {z} from "zod";

const prisma = new PrismaClient();

const profile = new Hono();

profile.get("/", async (c) => {
	const userId = c.get("jwtPayload").id;

	const user = await prisma.user.findUnique({ where: { id: userId } });

	if (!user) {
		return c.text("User doesn't exist", 401);
	}

	return c.json({ user: { email: user.email, name: user.name, id: user.id } });
});

const updateSchema = z.object({
	name: z.string().min(1).max(100),
});

profile.patch("/",
	validator("json", (value, c) => {
		const parsed = updateSchema.safeParse(value);
		if (!parsed.success) {
			return c.text("Invalid!", 401);
		}
		return parsed.data;
	}),
	async (c) => {
	const userId = c.get("jwtPayload").id;
	const { name } = c.req.valid("json");

	const user = await prisma.user.findUnique({ where: { id: userId } });

	if (!user) {
		return c.text("User doesn't exist", 401);
	}

	console.log({name: c.body});

	await prisma.user.update({ where: { id: userId }, data: { name } });

	return c.json({ user: { email: user.email, name, id: user.id } });
});

export default profile;
