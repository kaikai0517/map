import { defineConfig } from "vite";
import { resolve } from "path";
import vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { NaiveUiResolver } from "unplugin-vue-components/resolvers";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		VitePWA({
			registerType: "autoUpdate",
			includeAssets: ["robots.txt"],
			manifest: {
				name: process.env.VITE_TITLE,
				short_name: "酒吧地圖",
				description: "酒吧地圖",
				theme_color: "#000000",
			},
		}),
		vue(),
		AutoImport({
			imports: [
				"vue",
				{
					"naive-ui": [
						"useDialog",
						"useMessage",
						"useNotification",
						"useLoadingBar",
					],
				},
			],
		}),
		Components({
			resolvers: [NaiveUiResolver()],
		}),
	],
	resolve: {
		alias: {
			"@": resolve(__dirname, "./src"),
			"@static": resolve(__dirname, "./public/static"),
		},
	},
});
