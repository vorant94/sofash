import path from "node:path";
import process from "node:process";
import devServer from "@hono/vite-dev-server";
import { defineConfig } from "vite";

export default defineConfig({
	build: {
		sourcemap: true,
		lib: {
			entry: path.resolve(process.cwd(), "src/main.ts"),
			formats: ["es"],
			fileName: "main",
		},
	},
	plugins: [
		devServer({
			entry: path.resolve(process.cwd(), "src/main.ts"),
		}),
	],
});
