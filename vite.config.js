import { defineConfig } from "vite";
import { resolve } from "path";
import vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { NaiveUiResolver } from "unplugin-vue-components/resolvers";
import { VitePWA } from "vite-plugin-pwa";
import { createHtmlPlugin } from "vite-plugin-html";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		VitePWA({
			registerType: "autoUpdate",
			includeAssets: ["robots.txt"],
			manifest: {
				name: "酒吧圖鑑",
				short_name: "酒吧圖鑑",
				description: "歡迎使用酒吧圖鑑,下班小酌一杯",
				theme_color: "#000000",
			},
		}),
		vue(),
		createHtmlPlugin({
			minify: true,
			inject: {
				data: {
					title: "酒吧圖鑑",
				},
			},
		}),
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
