<template>
	<n-space vertical class="px-10 mt-16 space-y-3">
		<n-select
			v-model:value="selectLine"
			:options="lineList"
			placeholder="請選擇捷運線"
			size="large"
		/>
		<n-select
			v-model:value="selectStation"
			:options="stationList"
			:disabled="!selectLine"
			placeholder="請選擇車站"
			:fallback-option="trim"
			size="large"
		/>
		<div class="flex justify-center mt-5">
			<n-button class="bg-third w-[80%]" @click="confirm"> 確認 </n-button>
		</div>
	</n-space>
</template>

<script setup>
import lineJson from "@/assets/TRTCLine.json";
import stationJson from "@/assets/TRTCStation.json";
import { useRouter } from "vue-router";
import { useGoogleStore } from "@/store/GoogleStore.js";

const googleStore = useGoogleStore();

const router = useRouter();

const lineList = computed(() => {
	return lineJson.map((item) => {
		return {
			value: item.LineID,
			label: item.LineName.Zh_tw,
		};
	});
});

const selectLine = ref();
const selectStation = ref();

const stationList = computed(() => {
	return stationJson
		?.filter((item) => {
			return item.LineID == selectLine.value;
		})?.[0]
		?.Stations?.map((item) => {
			return {
				value: item.StationName.Zh_tw,
				label: item.StationName.Zh_tw,
			};
		});
});

const confirm = () => {
	if (!selectStation.value) return;
	if (localStorage.getItem("station") != selectStation.value) {
		try {
			localStorage.setItem("station", selectStation.value);
			googleStore.nearBySearchMapInfo(500, `${selectStation.value}站`);
		} catch (error) {
			console.log(error);
		}
	}
	googleStore.searshType = "MRT";
	localStorage.removeItem("city");
	localStorage.removeItem("town");
	router.push({
		path: "/barlist",
		query: {
			type: "MRT",
		},
	});
};

const trim = () => {
	selectStation.value = undefined;
	return {
		label: undefined,
		value: undefined,
	};
};
</script>

<style>
.n-radio__label {
	color: white !important;
}
</style>
