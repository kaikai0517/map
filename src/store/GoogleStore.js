import { defineStore } from "pinia";
export const useGoogleStore = defineStore("googleStore", {
	state: () => ({
		link: `https://maps.googleapis.com/maps/api/js?key=AIzaSyBG89P3nwtzZhrugoDSPSk_OkrJkSrE2IQ&libraries=places`,
		currentPosition: {
			lat: null,
			lng: null,
		},
		data: [],
		detailId: "",
		resultsArr: [],
		city: undefined,
		town: undefined,
		detailData: {},
		detailDataPosition: {},
		getGeolocationLoading: false,
		initGooglemapsScriptLoading: false,
		getDistanceLoading: false,
		initMapInfoLoading: false,
		getMapDetailLoading: false,
	}),
	actions: {
		getGeolocation() {
			this.getGeolocationLoading = true;
			navigator.geolocation.watchPosition((position) => {
				const { latitude, longitude } = position.coords;
				this.currentPosition.lat = latitude;
				this.currentPosition.lng = longitude;
				this.getGeolocationLoading = false;
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
		getMapDetail(item) {
			if (item.place_id == this.detailId) return;
			this.getMapDetailLoading = true;
			this.detailId = item.place_id;
			this.detailDataPosition = item.geometry.location;
			const request = {
				placeId: item.place_id,
				// fields: ['name', 'rating', 'formatted_phone_number', 'geometry']
			};
			let map = new google.maps.Map(document.createElement("div"));
			let service = new google.maps.places.PlacesService(map);
			service.getDetails(request, this.mapDetailCallback);
		},
		mapDetailCallback(place, status) {
			if (status == google.maps.places.PlacesServiceStatus.OK) {
				this.detailData = place;
				this.getMapDetailLoading = false;
			}
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
