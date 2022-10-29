<template>
	<n-page-header class="sticky top-0 z-10">
		<template #default>
			<div class="text-fifth flex items-center px-5 pt-5 pb-2">
				<div class="basis-1/3 flex gap-2 items-center" @click="handleBack">
					<n-button class="bg-white p-1 rounded-lg scale-75">
						<n-icon size="20">
							<ArrowBack />
						</n-icon>
						<div>回上頁</div></n-button
					>
				</div>
				<div class="basis-1/3 text-center neon-text text-2xl">{{ title }}</div>
				<div class="basis-1/3 flex justify-end">
					<n-icon size="30" @click="popupStore.sideMenuShow = true">
						<ReorderThreeSharp />
					</n-icon>
				</div>
			</div>
		</template>
	</n-page-header>
	<SideMenu />
</template>

<script setup>
import { ArrowBack, ReorderThreeSharp } from "@vicons/ionicons5";
import { useRouter } from "vue-router";
import SideMenu from "./SideMenu.vue";
import { usePopupStore } from "../store/PopupStore.js";

const popupStore = usePopupStore();

const router = useRouter();

const props = defineProps({
	title: String,
});

const handleBack = () => {
	router.back();
};
</script>

<style>
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
