import type { BunupPlugin } from "bunup";
import { defineConfig } from "bunup";
import fs from "fs";
import path from "path";

const removeCreateRequirePlugin: BunupPlugin = {
	name: "remove-createRequire",
	hooks: {
		onBuildDone: async (ctx) => {
			const walk = (dir: string) => {
				for (const file of fs.readdirSync(dir)) {
					const filePath = path.join(dir, file);
					const stat = fs.statSync(filePath);
					if (stat.isDirectory()) {
						walk(filePath);
					} else if (filePath.endsWith(".js")) {
						let content = fs.readFileSync(filePath, "utf-8");

						content = content.replace(
							/import\s*\{\s*createRequire\s+as\s+\w+\s*\}\s*from\s*["']node:module["'];?/g,
							"",
						);

						content = content.replace(/var\s+\w+\s*=\s*\w+\(import\.meta\.url\);?/g, "");

						fs.writeFileSync(filePath, content);
					}
				}
			};

			walk(ctx.meta.rootDir);
		},
	},
};

export default defineConfig({
	clean: true,
	dts: { inferTypes: true },
	entry: ["src/index.ts"],
	format: ["esm"],
	minify: true,
	outDir: "xanovi_preview/src/lib/xanovi_lib",
	splitting: false,
	sourcemap: "none",
	plugins: [removeCreateRequirePlugin],
});
