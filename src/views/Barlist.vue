<template>
	<Nav></Nav>
	<div
		ref="listRef"
		class="py-5 !text-white"
		:class="listRef?.clientHeight < bodyHeight ? 'h-[100vh]' : 'h-full'"
	>
		<n-collapse
			default-expanded-names="1"
			accordion
			v-if="sortData.length > 0"
			@item-header-click="getDetail"
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
					<n-gradient-text
						:type="item?.isOpen ? 'success' : 'danger'"
						class="mx-5"
						:class="{ 'ld ld-breath': item.isOpen }"
					>
						{{
							item?.isOpen
								? "營業中"
								: item?.isOpen === false
								? "休息中"
								: "無營業時間"
						}}
					</n-gradient-text>
					<div class="flex flex-col items-end gap-3 pr-2 text-fifth">
						<n-rate
							readonly
							:default-value="item.rating"
							allow-half
							size="small"
						/>
						<div>
							<div>{{ item.rating }} {{ `(${item.user_ratings_total})` }}</div>
						</div>
					</div>
				</template>
				<div class="text-white flex items-center mb-3">
					<n-icon class="mx-2" size="20" color="#ffffff">
						<MapPin />
					</n-icon>
					<div>
						<div>{{ item.formatted_address }}</div>
					</div>
				</div>
				<div v-if="googleStore.getDistanceLoading" class="flex items-center">
					<n-icon class="mx-2 ld ld-bounce" size="20" color="#ffffff">
						<CarAlt />
					</n-icon>
					<div class="text-white">定位中...</div>
				</div>
				<div
					class="text-white flex items-center"
					v-else-if="item.destinationData?.distance?.text"
				>
					<n-icon class="mx-2" size="20" color="#ffffff">
						<CarAlt />
					</n-icon>
					{{ item.destinationData?.distance?.text }}
					{{ `( ${item.destinationData?.duration?.text} ) ` }}
				</div>
				<div v-else class="text-white ml-10">當前位置無法定位</div>
			</n-collapse-item>
		</n-collapse>
		<n-empty description="查無資料" v-else class="h-full mt-[35vh]">
			<template #extra>
				<n-button size="small" class="text-white mt-5" @click="goBack">
					搜看看別的縣市
				</n-button>
			</template>
		</n-empty>
	</div>
</template>

<script setup>
import { MapPin } from "@vicons/tabler";
import { CarAlt } from "@vicons/fa";
import Nav from "@/components/Nav.vue";
import { useRouter } from "vue-router";
import { useGoogleStore } from "@/store/GoogleStore.js";

const googleStore = useGoogleStore();

const router = useRouter();

const data = JSON.parse(localStorage.getItem("data"));
let city = localStorage.getItem("city");
const town = localStorage.getItem("town");

const listRef = ref();

const bodyHeight = computed(() => document.documentElement.clientHeight);

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
	for (let i = 0; i < strArr.length; i++) {
		if (item.includes(strArr[i])) {
			return true;
		}
	}
};

const sortData = computed(() => {
	return data
		.filter((item) => {
			return (
				item?.formatted_address.includes(`${town}`) &&
				!filterData(item.name) &&
				item.types.includes("bar")
			);
		})
		.sort((a, b) => {
			return b.user_ratings_total * b.rating - a.user_ratings_total * a.rating;
		})
		.map((item) => {
			return {
				...item,
				isOpen: item.opening_hours?.open_now,
			};
		});
});

const getDetail = (e) => {
	if (sortData.value[e.name].destinationData) return;
	googleStore.getDistance(sortData.value[e.name]);
};

const goBack = () => {
	router.back();
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
