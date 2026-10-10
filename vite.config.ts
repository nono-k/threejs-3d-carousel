import { defineConfig } from "vite";
import glsl from "vite-plugin-glsl";
import path from "node:path";

export default defineConfig({
  base: "/threejs-3d-carousel/",
	root: "src/",
	publicDir: "../public/",
	plugins: [glsl()],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
});
