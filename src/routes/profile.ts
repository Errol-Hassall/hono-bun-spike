import {Hono} from "hono";
import {PrismaClient} from "@prisma/client";

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

export default profile;
