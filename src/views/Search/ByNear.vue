<template>
	<n-space vertical class="px-10 mt-20 space-y-3">
		<n-input-number
			v-model:value="radius"
			placeholder="輸入半徑"
			:min="0"
			:max="50000"
		/>
		<div class="flex justify-center mt-5">
			<n-button class="bg-third w-[80%]" @click="confirm"> 確認 </n-button>
		</div>
	</n-space>
</template>

<script setup>
import { useRouter } from "vue-router";
import { useGoogleStore } from "@/store/GoogleStore.js";

const googleStore = useGoogleStore();

const router = useRouter();

const radius = ref();

const confirm = () => {
	if (!radius.value) return;
	try {
		googleStore.nearBySearchMapInfo(radius.value);
	} catch (error) {
		console.log(error);
	}

	router.push({
		path: "/barlist",
		query: {
			type: "Near",
		},
	});
};
</script>

<style></style>
