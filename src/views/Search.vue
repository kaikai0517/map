<template>
	<Nav></Nav>
	<div class="h-[100vh]">
		<div class="flex items-center text-4xl justify-center mt-[30%]">
			<n-icon class="mx-2" size="60" color="#ffffff">
				<WineSharp />
			</n-icon>
			<div class="text-fifth neon-text">酒吧地圖</div>
		</div>

		<component :is="tab"></component>
	</div>
	<div class="sticky bottom-0 w-full py-3">
		<div class="flex">
			<div
				class="basis-1/2 flex items-center justify-center gap-2"
				@click="tabChange(index)"
				v-for="(item, index) in tabList"
			>
				<n-icon
					size="20"
					:class="{ 'ld ld-bounce': index == tabIndex }"
					:color="index == tabIndex ? '#43e8d8' : '#ffffff'"
				>
					<component :is="item.icon"></component>
				</n-icon>
				<div :class="index == tabIndex ? 'text-[#43e8d8]' : 'text-white'">
					{{ item.title }}
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { City } from "@vicons/fa";
import { WineSharp } from "@vicons/ionicons5";
import { MapPin } from "@vicons/tabler";
import Nav from "@/components/Nav.vue";
import ByCity from "@/views/Search/ByCity.vue";
import ByNear from "@/views/Search/ByNear.vue";

const tabList = [
	{ title: "區域搜尋", component: ByCity, icon: City },
	{ title: "附近搜尋", component: ByNear, icon: MapPin },
];

const tab = ref(markRaw(tabList[0].component));

const tabIndex = ref(0);

const tabChange = (index) => {
	tabIndex.value = index;
	tab.value = markRaw(tabList[index].component);
};
</script>

<style scoped>
.v-enter-active,
.v-leave-active {
	transition: opacity 1s;
}

.v-enter-from,
.v-leave-to {
	opacity: 0;
}

.v-enter-to,
.v-leave-from {
	opacity: 1;
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
