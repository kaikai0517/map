<template>
	<div class="h-[100vh] pt-20">
		<div class="flex items-center text-4xl justify-center mt-20">
			<n-icon class="mx-2" size="60" color="#ffffff">
				<WineSharp />
			</n-icon>
			<div class="text-fifth neon-text">酒吧地圖</div>
		</div>
		<n-space vertical class="px-10 mt-20 space-y-3">
			<n-select
				v-model:value="select.city"
				:options="cityList"
				placeholder="請選擇縣市"
				:disabled="getListLoading"
				size="large"
			/>
			<n-select
				v-model:value="select.town"
				:options="townList"
				:disabled="!select.city || getListLoading"
				placeholder="請選擇鄉鎮"
				size="large"
			/>
			<div class="flex justify-center mt-5">
				<n-button class="bg-third w-[80%]" @click="confirm"> 確認 </n-button>
			</div>
		</n-space>
	</div>
</template>

<script setup>
import axios from "axios";
import { WineSharp } from "@vicons/ionicons5";
import { useGoogleStore } from "@/store/GoogleStore.js";
import { useRouter } from "vue-router";

const googleStore = useGoogleStore();

const router = useRouter();

const cityList = ref();

const zipcodeList = ref();

const city = localStorage.getItem("city");
const town = localStorage.getItem("town");

const select = reactive({
	city: undefined,
	town: undefined,
});

const townList = computed(() =>
	zipcodeList.value
		?.filter((item) => item.full_name.includes(select.city))
		.map((item) => {
			return {
				value: item.name,
				label: item.name,
			};
		})
);

const getListLoading = ref(false);

const getList = async () => {
	try {
		getListLoading.value = true;
		const city = await axios.get(
			"https://demeter.5fpro.com/tw/zipcode/cities.json"
		);
		cityList.value = city.data.map((item) => {
			return {
				value: item.name,
				label: item.name,
			};
		});
		const { data } = await axios.get(
			"https://demeter.5fpro.com/tw/zipcodes.json"
		);
		zipcodeList.value = data;
		getListLoading.value = false;
	} catch (error) {}
};
const confirm = async () => {
	if (city != select.city || town != select.town) {
		if (select.city.includes("臺")) {
			select.city = select.city.replace("臺", "台");
		}
		localStorage.setItem("city", select.city);
		localStorage.setItem("town", select.town);
		await googleStore.getGeolocation();
		await googleStore.initMapInfo(select.city, select.town);
		await googleStore.getDistance();
	}
	router.push({
		path: "/barlist",
	});
};

onMounted(async () => {
	await getList();
});
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
