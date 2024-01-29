FROM oven/bun
WORKDIR /opt/app

COPY --from=node:18 /usr/local/bin/node /usr/local/bin/node
COPY ./src ./src
COPY ./package.json ./
COPY ./bun.lockb ./
COPY ./prisma ./prisma

# Install packages
RUN bun install

ENV SUPABASE_KEY_SECRET="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNvcGxjb2d2YmxvZ3FkbGRtbmR4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDUxOTUyODQsImV4cCI6MjAyMDc3MTI4NH0.gAILzh8zdKI2pX9rjRHU7YEMlUqxJC_WmaZHgW9JuPE"
ENV DATABASE_URL="postgres://postgres.soplcogvblogqdldmndx:HK2Gy^SXhctz*5@aws-0-ap-southeast-2.pooler.supabase.com:6543/postgres?pgbouncer=true"

ENV DIRECT_DATABASE_URL="postgresql://postgres:HK2Gy^SXhctz*5@db.soplcogvblogqdldmndx.supabase.co:5432/postgres"



# Run generation
RUN bunx prisma generate

# COPY public public

ENV NODE_ENV production
CMD ["bun", "src/index.ts"]

EXPOSE 3000
