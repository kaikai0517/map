import { createWebHistory, createRouter } from "vue-router";

const routes = [
	{
		path: "/:catchAll(.*)",
		redirect: "/",
	},
	{
		path: "/",
		name: "home",
		component: () => import("@/views/Home.vue"),
	},
	{
		path: "/barlist",
		name: "Barlist",
		component: () => import("@/views/Barlist.vue"),
	},
	{
		path: "/search",
		name: "Search",
		component: () => import("@/views/Search.vue"),
	},
];

const router = createRouter({
	history: createWebHistory(),
	routes,
	scrollBehavior: () => ({ left: 0, top: 0 }),
});

export default router;
