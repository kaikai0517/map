<template>
	<div id="app" class="bg-primary" style="font-family: '手札體-繁'">
		<Loading
			v-if="
				(googleStore.searchMapInfoLoading ||
					googleStore.getGeolocationLoading) &&
				route.path != '/'
			"
		/>
		<n-loading-bar-provider v-else>
			<router-view></router-view>
		</n-loading-bar-provider>
	</div>
</template>

<script setup>
import Loading from "./components/Loading.vue";
import { useGoogleStore } from "./store/GoogleStore.js";
import { useRoute } from "vue-router";
const googleStore = useGoogleStore();
const route = useRoute();
onMounted(() => {
	googleStore.getGeolocation();
});
</script>
