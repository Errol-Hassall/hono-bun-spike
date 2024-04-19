// import { PrismaClient } from "@prisma/client";
// import { z } from "zod";
// import { Hono } from "hono";
// import { createClient } from "@supabase/supabase-js";
// import { validator } from "hono/validator";
//
// const supabase = createClient(
//   "https://soplcogvblogqdldmndx.supabase.co",
//   process.env.SUPABASE_KEY_SECRET || ""
// );
//
// const prisma = new PrismaClient();
//
// const uploadSchema = z.object({
//   file: z.string(),
// });
//
// const downloadSchema = z.object({
//   id: z.string(),
// });
//
// const itineraries = new Hono();
//
// itineraries.post("/upload", async (c) => {
//   const { file } = await c.req.parseBody();
//   const userId = c.get("jwtPayload").id;
//
//   const uploadedFile = await supabase.storage
//     .from("Itineraries")
//     .upload(userId, file as File);
//
//   if (!uploadedFile.data) return c.text("Error uploading file", 500);
//
//   const dbEntry = await prisma.itinerary.create({
//     data: {
//       name: "test",
//       userId: userId,
//       documentId: uploadedFile.data.path,
//     },
//   });
//
//   const publicUrl = await supabase.storage
//     .from("Itineraries")
//     .getPublicUrl(uploadedFile.data.path);
//
//   return c.json({
//     message: "File uploaded successfully",
//     dbEntry,
//     publicUrl,
//   });
// });
//
// itineraries.get(
//   "/download/:id",
//   validator("param", (value, c) => {
//     const parsed = downloadSchema.safeParse(value);
//     if (!parsed.success) {
//       return c.text("Invalid!", 401);
//     }
//     return parsed.data;
//   }),
//   async (c) => {
//     const userId = c.get("jwtPayload").id;
//     const { id } = c.req.valid("param");
//
//     const itinerary = await prisma.itinerary.findFirst({
//       where: { userId, documentId: id },
//     });
//
//     if (!itinerary) return c.text("No file found", 404);
//
//     // return the public url of the file
//     const publicUrl = supabase.storage
//       .from("Itineraries")
//       .getPublicUrl(itinerary.documentId);
//
//     if (!publicUrl) return c.text("Error downloading file", 500);
//
//     return c.json({
//       message: "File downloaded successfully",
//       publicUrl: publicUrl,
//     });
//   }
// );
//
// export default itineraries;
