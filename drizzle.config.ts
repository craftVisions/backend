import { defineConfig } from "drizzle-kit";

export default defineConfig({
    schema: "./src/db/schema",
    out: "./migration",
    dialect: "postgresql",
    dbCredentials: {
        database: 'craft_vision',
        url: process.env.DATABASE_URL as string,
    },
});