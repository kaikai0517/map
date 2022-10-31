<template>
	<n-drawer
		:show="popupStore.sideMenuShow"
		placement="right"
		class="bg-primary"
		@mask-click="close"
		style="font-family: '手札體-繁'"
	>
		<n-drawer-content>
			<n-list class="bg-primary text-white">
				<n-list-item v-for="item in list" @click="goTo(item.path)">
					<div
						class="flex justify-between items-center"
						:class="{ 'text-[#43e8d8]': route.path == item.path }"
					>
						{{ item.name }}
						<n-icon
							size="20"
							:class="{ 'ld ld-bounce': route.path == item.path }"
							:color="route.path == item.path ? '#43e8d8' : '#ffffff'"
						>
							<WineOutline />
						</n-icon>
					</div>
				</n-list-item>
			</n-list>
		</n-drawer-content>
	</n-drawer>
</template>

<script setup>
import { useRoute, useRouter } from "vue-router";
import { WineOutline } from "@vicons/ionicons5";
import { usePopupStore } from "../store/PopupStore.js";

const popupStore = usePopupStore();

const route = useRoute();
const router = useRouter();

const list = reactive([
	{
		path: "/search",
		name: "搜尋",
	},
	{
		path: "/barlist",
		name: "酒吧列表",
	},
	{
		path: "/version",
		name: "版本細節",
	},
]);

const goTo = (path) => {
	popupStore.sideMenuShow = false;
	router.push({
		path,
	});
};

const close = () => {
	popupStore.sideMenuShow = false;
};
</script>

<style></style>
