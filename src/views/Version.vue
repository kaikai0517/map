<template>
	<div class="w-full">
		<Nav title="版本細節"></Nav>
		<div
			:class="listRef?.clientHeight < bodyHeight ? 'h-[100vh]' : 'h-full'"
			class="p-5"
		>
			<n-timeline ref="listRef">
				<n-timeline-item
					v-for="item in commit"
					class="text-white"
					:color="isVersion(item.commit.message) ? '#d9f9a5' : '#81726a'"
					:content="item.commit.message"
					:time="formateDate(item.commit.committer.date)"
				/>
			</n-timeline>
		</div>
	</div>
</template>

<script setup>
import axios from "axios";
import dayjs from "dayjs";

const commit = ref();

const listRef = ref();

const isVersion = (message) => {
	return message.includes(".");
};

const bodyHeight = computed(() => document.documentElement.clientHeight);

const formateDate = (date) => {
	return dayjs(date).format("YYYY-MM-DD HH:mm:ss");
};
const getCommit = async () => {
	const { data } = await axios.get(
		"https://api.github.com/repos/kaikai0517/map/commits"
	);
	commit.value = data;
};
onMounted(async () => {
	await getCommit();
});
</script>

<style>
.n-timeline-item-content__content {
	color: white !important;
}
</style>
