import { defineStore } from "pinia";

export const useGoogleStore = defineStore("googleStore", {
	state: () => ({
		link: `https://maps.googleapis.com/maps/api/js?key=AIzaSyBG89P3nwtzZhrugoDSPSk_OkrJkSrE2IQ&libraries=places`,
		currentPosition: {
			lat: null,
			lng: null,
		},
		data: [],
		resultsArr: [],
		city: undefined,
		town: undefined,
		getGeolocationLoading: false,
		initGooglemapsScriptLoading: false,
		getDistanceLoading: false,
		initMapInfoLoading: false,
	}),
	actions: {
		initGooglemapsScript() {
			this.initGooglemapsScriptLoading = true;
			return new Promise((resolve, reject) => {
				let googleScript = document.querySelector(`script[src="${this.link}"]`);
				if (!googleScript) {
					googleScript = document.createElement("script");
					googleScript.src = this.link;
					googleScript.async = true;
					document.head.append(googleScript);
					googleScript.addEventListener("error", () => {
						reject();
						this.initGooglemapsScriptLoading = false;
					});
					googleScript.addEventListener("load", () => {
						resolve();
						this.initGooglemapsScriptLoading = false;
					});
				}
			});
		},
		getGeolocation() {
			this.getGeolocationLoading = true;
			return new Promise((resolve) => {
				navigator.geolocation.watchPosition((position) => {
					const { latitude, longitude } = position.coords;
					this.currentPosition.lat = latitude;
					this.currentPosition.lng = longitude;
					resolve();
					this.getGeolocationLoading = false;
				});
			});
		},
		getDistance(item) {
			this.getDistanceLoading = true;

			let origin = new google.maps.LatLng(
				this.currentPosition.lat,
				this.currentPosition.lng
			);
			const callBack = (results) => {
				item.destinationData = results.rows[0].elements[0];
				this.getDistanceLoading = false;
			};
			let service = new google.maps.DistanceMatrixService();
			service.getDistanceMatrix(
				{
					origins: [origin],
					destinations: [item.formatted_address],
					travelMode: "DRIVING",
					// transitOptions: TransitOptions,
					// drivingOptions: DrivingOptions,
					// unitSystem: UnitSystem,
					// avoidHighways: Boolean,
					// avoidTolls: Boolean,
				},
				callBack
			);
		},
		initMapInfo(city, town) {
			this.initMapInfoLoading = true;
			this.data = [];
			let map = new google.maps.Map(document.createElement("div"));
			let request = {
				query: `"${city}${town} 酒吧"`,
			};

			let service = new google.maps.places.PlacesService(map);
			service.textSearch(request, this.textSearchCallback);
		},
		textSearchCallback(results, status, pagination) {
			this.resultsArr = results;
			if (status == google.maps.places.PlacesServiceStatus.OK) {
				this.data = this.data.concat(results);
				localStorage.removeItem("data", JSON.stringify(this.data));
				localStorage.setItem("data", JSON.stringify(this.data));
				if (pagination.hasNextPage) {
					//最多可以取60筆資料，每次20筆
					pagination.nextPage(); //呼叫下一頁的函式
				} else {
					this.initMapInfoLoading = false;
				}
			}
		},
	},
});
