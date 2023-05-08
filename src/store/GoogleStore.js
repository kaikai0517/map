import { defineStore } from "pinia";
export const useGoogleStore = defineStore("googleStore", {
	state: () => ({
		// link: `https://maps.googleapis.com/maps/api/js?key=AIzaSyBG89P3nwtzZhrugoDSPSk_OkrJkSrE2IQ&libraries=places`,
		currentPosition: {
			lat: null,
			lng: null,
		},
		searchType: "",
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
		searchMapInfoLoading: false,
		getMapDetailLoading: false,
	}),
	actions: {
		// 取得當前位置
		getGeolocation() {
			this.getGeolocationLoading = true;
			navigator.geolocation.watchPosition((position) => {
				const { latitude, longitude } = position.coords;
				this.currentPosition.lat = latitude;
				this.currentPosition.lng = longitude;
				this.getGeolocationLoading = false;
			});
		},
		// 取得店家距離
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
					destinations: [
						item.formatted_address ? item.formatted_address : item.vicinity,
					],
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
		// 文字搜尋取得店家列表
		textSearchMapInfo(str) {
			this.searchMapInfoLoading = true;
			this.data = [];
			let map = new google.maps.Map(document.createElement("div"));
			console.log(str);
			let request = {
				type: ["bar"],
				query: `"${str}酒吧"`,
			};

			let service = new google.maps.places.PlacesService(map);
			service.textSearch(request, this.searchCallback);
		},
		searchCallback(results, status, pagination) {
			this.resultsArr = results;
			console.log(status);
			if (status == google.maps.places.PlacesServiceStatus.OK) {
				this.data = this.data.concat(results);
				localStorage.removeItem("data", JSON.stringify(this.data));
				localStorage.setItem("data", JSON.stringify(this.data));
				if (pagination.hasNextPage) {
					//最多可以取60筆資料，每次20筆
					pagination.nextPage(); //呼叫下一頁的函式
				} else {
					this.searchMapInfoLoading = false;
				}
			} else {
				this.searchMapInfoLoading = false;
			}
		},
		nearBySearchMapInfo(radius, address) {
			this.searchMapInfoLoading = true;
			this.data = [];
			let position = {};
			let getLocation = new Promise((resolve, reject) => {
				if (address) {
					let geocoder = new google.maps.Geocoder();
					geocoder.geocode({ address: address }, (results, status) => {
						if (status == google.maps.GeocoderStatus.OK) {
							position.lat = results[0].geometry.location.lat();
							position.lng = results[0].geometry.location.lng();
							resolve();
						} else {
							reject();
						}
					});
				} else {
					position = this.currentPosition;
					resolve();
				}
			});
			getLocation.then(() => {
				let origin = new google.maps.LatLng(position.lat, position.lng);
				let map = new google.maps.Map(document.createElement("div"), {
					center: origin,
				});
				let request = {
					location: origin,
					radius,
					keyword: '"酒吧"',
				};
				let service = new google.maps.places.PlacesService(map);
				service.nearbySearch(request, this.searchCallback);
			});
		},
		// 取得店家細節
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
			}
			this.getMapDetailLoading = false;
		},
	},
});
