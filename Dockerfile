FROM oven/bun

WORKDIR /usr/src/app

COPY package*.json bun.lockb ./
RUN bun install
COPY . .

RUN bunx prisma generate

ENV NODE_ENV production

EXPOSE 3000

CMD ["bun", "start"]
