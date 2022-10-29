import { defineStore } from "pinia";
export const usePopupStore = defineStore("popupStore", {
	state: () => ({
		detailPopupShow: false,
		sideMenuShow: false,
	}),
});
