<template>
	<div>
		<Nav title="酒吧列表"></Nav>
		<div
			class="py-5 !text-white"
			:class="listRef?.clientHeight < bodyHeight ? 'h-[100vh]' : 'h-full'"
		>
			<n-collapse
				default-expanded-names="1"
				accordion
				v-if="sortData?.length > 0"
				@item-header-click="getDetail"
				ref="listRef"
			>
				<n-collapse-item
					v-for="(item, index) in sortData"
					:key="index"
					:title="item.name"
					:name="index"
				>
					<template #arrow>
						<div
							class="w-[10vw] text-center text-white"
							:class="[
								{ 'neon-text text-[#cdc392] text-3xl': index + 1 == 1 },
								{ 'neon-text text-[#e8e5da] text-2xl': index + 1 == 2 },
								{ 'neon-text text-[#9eb7e5] ': index + 1 == 3 },
							]"
						>
							{{ index + 1 }}
						</div>
					</template>
					<template #header-extra>
						<div class="flex flex-col items-end gap-3 pr-2 text-fifth">
							<n-rate
								readonly
								:default-value="item.rating"
								allow-half
								size="small"
							/>
							<div>
								<div>
									{{ item.rating }} {{ `(${item.user_ratings_total})` }}
								</div>
							</div>
						</div>
					</template>
					<div class="text-white flex items-center mb-3">
						<n-icon class="mx-2" size="20" color="#ffffff">
							<MapPin />
						</n-icon>
						<div @click="goToGooglemap">
							<div class="underline underline-offset-4">
								{{
									item.formatted_address
										? item.formatted_address
										: item.vicinity
								}}
							</div>
						</div>
					</div>
					<div class="text-white flex items-center justify-between">
						<div
							v-if="
								googleStore.getDistanceLoading ||
								googleStore.getGeolocationLoading
							"
							class="flex items-center"
						>
							<n-icon class="mx-2 ld ld-bounce" size="20" color="#ffffff">
								<CarAlt />
							</n-icon>
							<div class="text-white">定位中...</div>
						</div>
						<div
							class="flex items-center"
							v-else-if="item.destinationData?.distance?.text"
						>
							<n-icon class="mx-2" size="20" color="#ffffff">
								<CarAlt />
							</n-icon>
							{{ item.destinationData?.distance?.text }}
							{{ `( ${item.destinationData?.duration?.text} ) ` }}
						</div>
						<div v-else class="text-white ml-10">當前位置無法定位</div>
						<n-button class="bg-white mr-3" @click="getInfo"
							>查看店家資訊</n-button
						>
					</div>
				</n-collapse-item>
			</n-collapse>
			<n-empty description="查無資料" v-else class="pt-[35vh] h-[100vh]">
				<template #extra>
					<n-button size="small" class="text-white mt-5" @click="goBack">
						搜看看別的縣市
					</n-button>
				</template>
			</n-empty>
		</div>
		<DetailPopup></DetailPopup>
	</div>
</template>

<script setup>
import { MapPin } from "@vicons/tabler";
import { CarAlt } from "@vicons/fa";
import Nav from "@/components/Nav.vue";
import { useGoogleStore } from "@/store/GoogleStore.js";
import { usePopupStore } from "@/store/PopupStore.js";
import { useRouter, useRoute } from "vue-router";
import DetailPopup from "@/components/DetailPopup/index.vue";

const googleStore = useGoogleStore();
const popupStore = usePopupStore();

const router = useRouter();
const route = useRoute();

const listRef = ref();

const bodyHeight = computed(() => document.documentElement.clientHeight);

const data = JSON.parse(localStorage.getItem("data"));
const town = localStorage.getItem("town");

const filterData = (item) => {
	const strArr = [
		"燒烤",
		"燒肉",
		"碳烤",
		"ok",
		"歌",
		"KTV",
		"烤物",
		"居酒屋",
		"牛郎",
		"餐廳",
		"民宿",
	];
	for (let i = 0; i < strArr?.length; i++) {
		if (item?.includes(strArr[i])) {
			return true;
		}
	}
};

const sortData = computed(() => {
	return data
		?.filter((item) => {
			const hasAddress = item?.formatted_address
				? item?.formatted_address?.includes(`${town}`)
				: true;
			return (
				hasAddress && !filterData(item.name) && item.types?.includes("bar")
			);
		})
		.sort((a, b) => {
			return b.user_ratings_total * b.rating - a.user_ratings_total * a.rating;
		});
});

const currentData = ref();

const getDetail = (e) => {
	currentData.value = e;
	if (sortData.value[e.name].destinationData) return;
	googleStore.getDistance(sortData.value[e.name]);
};

const getInfo = () => {
	googleStore.getMapDetail(sortData.value[currentData.value.name]);
	popupStore.detailPopupShow = true;
};

const goBack = () => {
	router.back();
};

const goToGooglemap = () => {
	const {
		place_id,
		geometry: {
			location: { lat, lng },
		},
	} = sortData.value[currentData.value.name];
	const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}&query_place_id=${place_id}`;
	window.open(url);
};
</script>

<style>
.n-collapse-item__header-main {
	color: #94bfa7 !important;
}

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
		text-shadow: 0 0 4px #fff, 0 0 11px #fff, 0 0 19px #fff, 0 0 40px #e0b7b7,
			0 0 80px #e0b7b7, 0 0 90px #e0b7b7, 0 0 100px #e0b7b7, 0 0 150px #e0b7b7;
	}

	20%,
	24%,
	55% {
		text-shadow: none;
	}
}
</style>
