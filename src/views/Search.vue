<template>
	<Nav></Nav>
	<div class="h-[100vh] pt-20">
		<div class="flex items-center text-4xl justify-center mt-20">
			<n-icon class="mx-2" size="60" color="#ffffff">
				<WineSharp />
			</n-icon>
			<div class="text-fifth neon-text">酒吧地圖</div>
		</div>
		<n-space vertical class="px-10 mt-20 space-y-3">
			<n-select
				v-model:value="selectCity"
				:options="cityList"
				placeholder="請選擇縣市"
				size="large"
			/>
			<n-select
				v-model:value="selectTown"
				:options="townList"
				:disabled="!selectCity"
				placeholder="請選擇鄉鎮"
				:fallback-option="trim"
				size="large"
			/>
			<div class="flex justify-center mt-5">
				<n-button class="bg-third w-[80%]" @click="confirm"> 確認 </n-button>
			</div>
		</n-space>
	</div>
</template>

<script setup>
import cityJson from "@/assets/city.json";
import townJson from "@/assets/town.json";
import { WineSharp } from "@vicons/ionicons5";
import { useRouter } from "vue-router";
import { useGoogleStore } from "@/store/GoogleStore.js";
import Nav from "@/components/Nav.vue";

const googleStore = useGoogleStore();

const router = useRouter();

const cityList = computed(() => {
	return cityJson.map((item) => {
		return {
			value: item.name,
			label: item.name,
		};
	});
});

const selectCity = ref();
const selectTown = ref();

const townList = computed(() => {
	return townJson
		?.filter((item) => item.full_name.includes(selectCity.value))
		.map((item) => {
			return {
				value: item.name,
				label: item.name,
			};
		});
});

const confirm = () => {
	if (!selectTown.value) return;
	if (
		localStorage.getItem("city") != selectCity.value ||
		localStorage.getItem("town") != selectTown.value
	) {
		try {
			localStorage.setItem("city", selectCity.value);
			localStorage.setItem("town", selectTown.value);
			googleStore.initMapInfo(selectCity.value, selectTown.value);
		} catch (error) {
			console.log(error);
		}
	}
	router.push({
		path: "/barlist",
	});
};

const trim = () => {
	selectTown.value = undefined;
	return {
		label: undefined,
		value: undefined,
	};
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
