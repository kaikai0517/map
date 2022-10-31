<template>
	<n-space vertical class="px-10 mt-16 space-y-3">
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
</template>

<script setup>
import cityJson from "@/assets/city.json";
import townJson from "@/assets/town.json";
import { useRouter } from "vue-router";
import { useGoogleStore } from "@/store/GoogleStore.js";

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
			googleStore.textSearchMapInfo(selectCity.value, selectTown.value);
		} catch (error) {
			console.log(error);
		}
	}
	router.push({
		path: "/barlist",
		query: {
			type: "City",
		},
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

<style></style>
