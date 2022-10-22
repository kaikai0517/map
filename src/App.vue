<template>
	<div class="bg-primary" style="font-family: '手札體-繁'">
		<Loading
			v-if="
				googleStore.getGeolocationLoading ||
				googleStore.initGooglemapsScriptLoading ||
				googleStore.getDistanceLoading ||
				googleStore.initMapInfoLoading
			"
		></Loading>
		<router-view v-else></router-view>
	</div>
	<div id="map"></div>
</template>

<script setup>
import Loading from "@/components/Loading.vue";
import { useGoogleStore } from "@/store/GoogleStore.js";
const googleStore = useGoogleStore();

onMounted(async () => {
	await googleStore.initGooglemapsScript();
});
</script>
<style scoped></style>
