<template>
	<div
		class="flex flex-col items-center px-4 gap-7 justify-center h-[100vh] relative"
	>
		<n-icon class="absolute top-28 right-20" size="80" color="#ffffff">
			<GlassCheers />
		</n-icon>
		<n-icon class="absolute top-10 left-20" size="80" color="#ffffff">
			<GlassMartiniAlt />
		</n-icon>
		<n-icon class="absolute bottom-32 right-[5%]" size="60" color="#ffffff">
			<GlassWhiskey />
		</n-icon>
		<n-icon class="absolute bottom-28 left-10" size="80" color="#ffffff">
			<WineGlassAlt />
		</n-icon>
		<div
			class="neon-text text-3xl text-center animate__animated animate__zoomIn text-white flex"
		>
			歡迎使用
		</div>
		<div
			class="neon-text text-3xl text-center animate__animated animate__zoomIn text-white"
		>
			台灣酒吧地圖
		</div>
		<div
			class="neon-text text-center animate__animated animate__zoomIn text-white"
		>
			{{ `VER ${packageJson.version}` }}
		</div>
		<n-button class="px-[150px] bg-fifth neon-icon mt-5" @click="getStart">
			開始
		</n-button>
		<div class="text-fifth text-3xl text-center fixed bottom-5">
			edited by kai.chen
			<n-icon class="ld ld-bounce ml-5" color="#ffffff">
				<Pencil />
			</n-icon>
		</div>
	</div>
</template>

<script setup>
import { Pencil } from "@vicons/ionicons5";
import "animate.css";
import { useRouter } from "vue-router";
import {
	GlassCheers,
	GlassMartiniAlt,
	GlassWhiskey,
	WineGlassAlt,
} from "@vicons/fa";
import packageJson from "../../package.json";

const router = useRouter();

const getStart = () => {
	router.push({
		path: "/search",
	});
};
</script>

<style scoped>
.neon-text {
	animation: flicker 2s linear infinite;
}

@keyframes flicker {
	0%,
	18%,
	22%,
	25%,
	53%,
	57%,
	100% {
		text-shadow: 0 0 4px #fff, 0 0 11px #fff, 0 0 19px #fff,
			0 0 40px rgba(67, 232, 216, 1), 0 0 80px rgba(67, 232, 216, 1),
			0 0 90px rgba(67, 232, 216, 1), 0 0 100px rgba(67, 232, 216, 1),
			0 0 150px rgba(67, 232, 216, 1);
	}

	20%,
	24%,
	55% {
		text-shadow: none;
	}
}
</style>
