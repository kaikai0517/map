<template>
	<div>
		<n-drawer
			:show="popupStore.detailPopupShow"
			class="!h-full bg-primary"
			placement="bottom"
			style="font-family: '手札體-繁'"
		>
			<n-drawer-content :native-scrollbar="false" class="relative">
				<Loading v-if="googleStore.getMapDetailLoading" />
				<div v-else class="relative">
					<div class="text-center neon-text text-3xl mb-10 mt-5">
						{{ googleStore.detailData?.name }}
					</div>
					<div @click="handleBack" class="absolute top-2 right-0 text-white">
						關閉
					</div>
					<div class="text-white space-y-3 mb-10">
						<div class="flex gap-3">
							<div>電話：</div>
							<a
								v-if="googleStore.detailData?.formatted_phone_number"
								:href="`tel:${googleStore.detailData?.international_phone_number}`"
								class="text-white"
								>{{ googleStore.detailData?.formatted_phone_number }}</a
							>
							<div v-else>無</div>
						</div>
						<div class="flex gap-1">
							<div class="w-12">地址：</div>
							<div class="underline underline-offset-4" @click="goToGooglemap">
								{{ googleStore.detailData?.formatted_address }}
							</div>
						</div>
						<div class="flex gap-3">
							<div>店家網站 -></div>
							<button class="px-5" @click="goToWebsite">go</button>
						</div>
					</div>

					<!-- <n-carousel
						effect="card"
						prev-slide-style="transform: translateX(-150%) translateZ(-800px);"
						next-slide-style="transform: translateX(50%) translateZ(-800px);"
						class="h-[30vh] py-10"
						:show-dots="false"
						autoplay
					>
						<n-carousel-item
							class="object-cover"
							:style="{ width: '80%' }"
							v-for="item in googleStore?.detailData.photos"
						>
							<img class="carousel-img w-full" :src="item.getUrl()" />
						</n-carousel-item>
					</n-carousel> -->
					<div class="text-white space-y-5">
						<div class="text-2xl">營業時間：</div>
						<div>
							<div
								v-for="item in googleStore.detailData?.opening_hours
									?.weekday_text"
							>
								{{ item }}
							</div>
						</div>

						<div class="text-2xl">評論：</div>
						<div class="space-y-10">
							<div v-for="item in formatData" class="space-y-3">
								<div class="flex justify-between">
									<div class="flex gap-3">
										<div>{{ item.author_name }}</div>
										<div>{{ `(${item.relative_time_description})` }}</div>
									</div>
									<n-rate
										readonly
										:default-value="item.rating"
										allow-half
										size="small"
									/>
								</div>
								<div v-html="item.text"></div>
							</div>
						</div>
					</div>
				</div>
			</n-drawer-content>
		</n-drawer>
	</div>
</template>

<script setup>
import { useGoogleStore } from "../../store/GoogleStore.js";
import Loading from "../Loading.vue";
import { usePopupStore } from "../../store/PopupStore.js";

const popupStore = usePopupStore();

const googleStore = useGoogleStore();

const formatData = computed(() => {
	return googleStore.detailData.reviews?.map((item) => {
		return {
			...item,
			text: item.text.replace(/\n/g, "<br>"),
		};
	});
});

const goToWebsite = () => {
	window.open(googleStore.detailData.website);
};
const handleBack = () => {
	popupStore.detailPopupShow = false;
};
const goToGooglemap = () => {
	const url = `https://www.google.com/maps/search/?api=1&query=${googleStore.detailDataPosition.lat},${googleStore.detailDataPosition.lng}&query_place_id=${googleStore.detailData.place_id}`;
	window.open(url);
};
</script>

<style>
.neon-text {
	animation: flicker 2s linear infinite;
}
.n-base-close {
	width: 30px !important;
	height: 30px !important;
}
.n-drawer-header {
	color: white !important;
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
