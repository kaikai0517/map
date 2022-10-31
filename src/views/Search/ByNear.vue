<template>
	<n-space vertical class="px-10 mt-16 space-y-3">
		<div class="flex gap-2">
			<n-radio
				:checked="checkedValue == 1"
				:value="1"
				name="location"
				@change="handleChange"
			>
				當前定位
			</n-radio>
			<n-radio
				:checked="checkedValue == 2"
				:value="2"
				name="location"
				@change="handleChange"
			>
				輸入地址
			</n-radio>
		</div>

		<n-input
			v-model:value="address"
			type="text"
			placeholder="請輸入地址"
			v-if="checkedValue == 2"
		/>
		<n-input-number
			v-model:value="radius"
			placeholder="請輸入半徑"
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

const address = ref();

const checkedValue = ref(1);

const confirm = () => {
	if (!radius.value) return;
	try {
		if (checkedValue.value == 1) address.value = "";
		googleStore.nearBySearchMapInfo(radius.value, address.value);
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

const handleChange = (e) => {
	checkedValue.value = e.target.value;
};
</script>

<style>
.n-radio__label {
	color: white !important;
}
</style>
