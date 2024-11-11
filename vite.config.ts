import { builtinModules } from "node:module";
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
		rollupOptions: {
			external: [...builtinModules, /^node:/],
		},
	},
	plugins: [
		devServer({
			entry: path.resolve(process.cwd(), "src/main.ts"),
		}),
	],
});
