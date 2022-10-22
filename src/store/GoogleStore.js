import { defineStore } from "pinia";

export const useGoogleStore = defineStore("googleStore", {
	state: () => ({
		link: `https://maps.googleapis.com/maps/api/js?key=${
			import.meta.env.VITE_APP_GOOGLE_MAP_API_KEY
		}&libraries=places`,
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
		getDistance() {
			this.getDistanceLoading = true;
			const destinationData = this.resultsArr.map(
				(item) => item.formatted_address
			);
			let origin = new google.maps.LatLng(
				this.currentPosition.lat,
				this.currentPosition.lng
			);
			let service = new google.maps.DistanceMatrixService();
			service.getDistanceMatrix(
				{
					origins: [origin],
					destinations: destinationData,
					travelMode: "DRIVING",
					// transitOptions: TransitOptions,
					// drivingOptions: DrivingOptions,
					// unitSystem: UnitSystem,
					// avoidHighways: Boolean,
					// avoidTolls: Boolean,
				},
				this.getDistanceCallback
			);
		},
		getDistanceCallback(response) {
			for (let i = 0; i < response?.rows[0].elements.length; i++) {
				this.resultsArr[i].destinationData = response?.rows[0].elements[i];
			}
			this.data = this.data.concat(this.resultsArr);
			localStorage.removeItem("data", JSON.stringify(this.data));
			localStorage.setItem("data", JSON.stringify(this.data));
			this.getDistanceLoading = false;
		},
		initMapInfo(city, town) {
			this.initMapInfoLoading = true;
			this.data = [];
			let map = new google.maps.Map(document.getElementById("map"));
			let request = {
				query: `${city}${town}酒吧`,
			};

			let service = new google.maps.places.PlacesService(map);
			service.textSearch(request, this.NearbySearchCallback);
		},
		NearbySearchCallback(results, status, pagination) {
			this.resultsArr = results;
			if (status == google.maps.places.PlacesServiceStatus.OK) {
				this.getDistance();
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
