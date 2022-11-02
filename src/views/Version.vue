<template>
	<div>
		<Nav title="版本細節"></Nav>
		<div
			:class="listRef?.clientHeight < bodyHeight ? 'h-[100vh]' : 'h-full'"
			class="p-5"
		>
			<n-timeline id="list" ref="listRef">
				<n-timeline-item
					v-for="item in commit"
					class="text-white"
					:color="isVersion(item.commit.message) ? '#d9f9a5' : '#81726a'"
					:content="item.commit.message"
					:time="formateDate(item.commit.committer.date)"
				/>
			</n-timeline>
			<div id="bottom"></div>
		</div>
	</div>
</template>

<script setup>
import dayjs from "dayjs";
import { useLoadingBar } from "naive-ui";
import axios from "axios";

const loadingBar = useLoadingBar();

const commit = ref([]);

const listRef = ref();

let options = {
	rootMargin: "20px",
	threshold: 0,
};
const callback = (entries) => {
	if (entries[0].isIntersecting && commit.value.length > 0) {
		page.value++;
		getCommit();
	}
};
let observer = new IntersectionObserver(callback, options);

const isVersion = (message) => {
	return message.includes(".");
};

const bodyHeight = computed(() => document.documentElement.clientHeight);

const formateDate = (date) => {
	return dayjs(date).format("YYYY-MM-DD HH:mm:ss");
};

const page = ref(1);

const getCommit = async () => {
	try {
		loadingBar.start();

		const { data } = await axios.get(
			"https://api.github.com/repos/kaikai0517/map/commits",
			{
				params: {
					client_id: import.meta.env.VITE_CLIENT_ID,
					client_secret: import.meta.env.VITE_CLIENT_SECRET,
					page: page.value,
				},
			}
		);
		commit.value = commit.value.concat(data);
		if (data.length == 0) {
			observer.unobserve(document.getElementById("bottom"));
		}
		loadingBar.finish();
	} catch (error) {
		console.log(error);
	}
};

onMounted(async () => {
	await getCommit();
	observer.observe(document.getElementById("bottom"));
});
</script>

<style>
.n-timeline-item-content__content {
	color: white !important;
}
</style>
