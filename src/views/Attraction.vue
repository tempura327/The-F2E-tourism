<template>
  <div class="container">
    <div class="row mb-12">
      <div class="col">
        <h1 class="font-bold text-h1 text-primary mb-6">景點</h1>
        <h5 class="h5 text-gray font-bold">
          台灣的各個美景，都美不勝收。
          <br />
          等你一同來發現這座寶島的奧妙！
        </h5>
      </div>
    </div>

    <div class="row mb-4">
      <SearchBar
        :className="['mb-4 duration-700', isMapExpanded || isMobile ? 'w-full' : 'w-2/4']"
        :options="searchOption"
        :isSelectorShow="true"
        @searchClick="searchAttraction"></SearchBar>
    </div>

    <div class="flex flex-wrap mb-32">
      <div :class="mapClass.map">
        <div id="map" class="rounded"></div>
      </div>

      <div :class="mapClass.info" ref="attractionInfo">
        <section class="info flex flex-col bg-gray-80 text-white rounded overflow-y-auto p-4">
          <font-awesome-icon class="text-white ml-auto mb-2 hover:scale-150 cursor-pointer" icon="xmark" @click="clearAttractionInfo" />
          <h2 class="text-h2 text-white font-bold mb-2">{{ info.ScenicSpotName }}</h2>

          <h4 class="text-h5 text-white mb-2">{{ info.OpenTime }}</h4>

          <Gallery :images="images" galleryClass="mb-4"></Gallery>

          <h4 class="text-h4 text-white">{{ info.Address }}</h4>
          <h4 class="text-h4 text-white">{{ info.Class1 }}</h4>
          <h4 class="text-h4 text-white">{{ info.Phone }}</h4>
          <hr class="my-3" v-if="info.DescriptionDetail" />
          <h4 class="text-h4 text-white">{{ info.DescriptionDetail }}</h4>
        </section>
      </div>
    </div>

    <SimpleModal id="detail-modal" size="sm" :isShow="isModalShow" @onCloseClick="closeModal">
      <h3 class="text-h3 text-gray-80 font-bold">
        請開啟定位允許，或點擊地圖上任一點來定位
        <br />
        如果沒有定位，在本頁無法以距離搜尋景點
        <br />
        景點詳細資訊展開時無法改定位，請先把景點資訊關閉再改
      </h3>
    </SimpleModal>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';

  import { Map, Marker, LngLatLike, Popup } from 'mapbox-gl';
  import 'mapbox-gl/dist/mapbox-gl.css';

  import Card from '@/components/Card.vue';
  import SearchBar from '@/components/SearchBar.vue';
  import Gallery from '@/components/Gallery.vue';
  import SimpleModal from '@/components/SimpleModal.vue';

  import query from '@/utility/queryHelper';
  import { attraction, boundary } from '@/utility/type';

  @Component({
    components: {
      Card,
      SearchBar,
      Gallery,
      SimpleModal,
    },
  })
  export default class Attraction extends Vue {
    // props

    // data
    isCurrentPosLocked = true;
    isModalShow = false;
    isMobile = this.$store.state.isMobile;
    baseUrl = 'https://ptx.transportdata.tw/MOTC/v2/Tourism/ScenicSpot?%24filter=';
    entireDayOtherWord = ['<p>24HR</p>', 'Sun 24 hours；Mon 24 hours；Tue 24 hours；Wed 24 hours；Thu 24 hours；Fri 24 hours；Sat 24 hours'];
    searchOption = [
      { value: 5, label: '5km' },
      { value: 10, label: '10km' },
      { value: 15, label: '15km' },
      { value: 20, label: '20km' },
      { value: 25, label: '25km' },
      { value: 30, label: '30km' },
      { value: -1, label: '全部' },
    ];
    map!: Map;
    currentPosMarker!: Marker;
    markerMap: { [key: string]: Marker } = {};
    currentBoundary: boundary = {
      xMax: 0,
      xMin: 0,
      yMax: 0,
      yMin: 0,
      center: [],
      radius: 5,
    };
    info: attraction = {
      Address: '',
      City: '',
      Class1: '',
      Description: '',
      DescriptionDetail: '',
      OpenTime: '',
      Phone: '',
      Picture: {
        PictureUrl1: '',
        PictureDescription1: '',
      },
      Position: {
        PositionLon: 0,
        PositionLat: 0,
        GeoHash: '',
      },
      ScenicSpotID: '',
      ScenicSpotName: '',
      SrcUpdateTime: '',
      UpdateTime: '',
      ZipCode: '',
      ParkingPosition: {},
    };
    images: string[] = [];
    isMapExpanded = true;

    // hooks
    created(): void {
      this.getCurrentPosition();
    }

    // methods
    getCurrentPosition(): void {
      window.navigator.geolocation.getCurrentPosition(
        (pos) => {
          this.currentBoundary.center = [pos.coords.longitude, pos.coords.latitude];
          this.drawMap(pos.coords.longitude, pos.coords.latitude);

          // only set currentPosMarker if user allow geolocation API.
          this.setCurrentPositionMarker(...this.currentBoundary.center);

          return [pos.coords.longitude, pos.coords.latitude];
        },
        (err) => {
          if (err.code === err.PERMISSION_DENIED) {
            this.isModalShow = true;
            // this.currentBoundary.center = [120.68, 23.58];
            this.drawMap(120.68, 23.58);
          }
        },
      );
    }
    setBoundary(lng: number, lat: number, radius: number): void {
      (this.map as Map).addSource('polygon', this.createGeoJSONCircle([lng, lat], radius));

      (this.map as Map).addLayer({
        id: 'polygon',
        type: 'fill',
        source: 'polygon',
        layout: {},
        paint: {
          'fill-color': '#333333',
          'fill-opacity': 0.1,
        },
      });

      (this.map as Map).setCenter([lng, lat]);
    }
    removeBoundary(): void {
      if ((this.map as Map).getLayer('polygon')) {
        (this.map as Map).removeLayer('polygon').removeSource('polygon');
      }
    }
    createGeoJSONCircle(center: number[], radiusInKm: number, points = 64): any {
      const coords = {
        latitude: center[1],
        longitude: center[0],
      };

      // in Taiwan
      // longitude 1deg:101.77545km
      // latitude 1deg:110.9362km.

      const ret = []; // put coordinates in ret
      const distanceX = radiusInKm / (101.77545 * Math.cos((coords.latitude * Math.PI) / 180));
      const distanceY = radiusInKm / 110.9362;

      let theta, x, y;

      for (let i = 0; i < points; i++) {
        theta = (i / points) * (2 * Math.PI); // width of a part of circle

        x = distanceX * Math.cos(theta);
        y = distanceY * Math.sin(theta);

        ret.push([coords.longitude + x, coords.latitude + y]);
      }
      ret.push(ret[0]);

      this.currentBoundary.xMax = ret[0][0];
      this.currentBoundary.xMin = ret[32][0];
      this.currentBoundary.yMax = ret[16][1];
      this.currentBoundary.yMin = ret[48][1];

      return {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              geometry: {
                type: 'Polygon',
                coordinates: [ret],
              },
            },
          ],
        },
      };
    }
    drawMap(long: number, lat: number): void {
      this.map = new Map({
        container: 'map', // id
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [long, lat],
        zoom: 10, // starting zoom
        accessToken: 'pk.eyJ1IjoidGVtcHVyYTMyNyIsImEiOiJja3Z6eXVqdnQ1YTdxMm9tdHUwMGx4eXBmIn0.7SOTd4xVrpfdvJiDx5R34g',
      });

      this.map.on('style.load', () => {
        this.map.setFog({}); // Set the default atmosphere style
      });

      // click map to change canter of map and change the position of currentPosMarker
      // without doing this, search feat will goes wrong if user don't allow geolocation API.
      this.map.on('click', (e) => {
        if (this.isCurrentPosLocked) return;

        const { lat, lng } = e.lngLat.wrap();
        this.currentBoundary.center = [lng, lat];

        if (this.currentPosMarker instanceof Marker) {
          this.currentPosMarker.setLngLat([lng, lat]);
        } else {
          this.setCurrentPositionMarker(lng, lat); // here
        }

        this.map.flyTo({
          center: [lng, lat] as LngLatLike,
        });
      });
    }
    setMarker(color = 'gold'): any {
      return (method: { name: string; para: any }) => {
        return (lngLat: LngLatLike) => {
          const process: any = new Marker({ color, draggable: false }).setLngLat(lngLat);

          if (method.name) {
            process[method.name](method.para);
          }

          return process.addTo(this.map);
        };
      };
    }
    setMultipleMarker(data: attraction[]): void {
      let attractionData;
      let html = '';

      for (let i = 0; i < data.length; i++) {
        attractionData = data[i];
        html = `
            <h1 class='text-md font-bold'>${attractionData.ScenicSpotName}</h1>
            <span>${attractionData.Address || ''}</span>
            <span>${attractionData.Phone || ''}</span>
            <span>${attractionData.Position.PositionLon}, ${attractionData.Position.PositionLat}</span>
          `;

        this.markerMap[`attraction-${attractionData.ScenicSpotID}`] = this.setMarker()({ name: 'setPopup', para: new Popup().setHTML(html) })([
          attractionData.Position.PositionLon,
          attractionData.Position.PositionLat,
        ]);

        // https://github.com/mapbox/mapbox-gl-js/issues/7793
        // mapbox does not support click event of marker.
        this.markerMap[`attraction-${attractionData.ScenicSpotID}`].getElement().addEventListener('click', () => {
          this.isMapExpanded = false;
          this.info = data[i];

          if (this.entireDayOtherWord.includes(this.info.OpenTime)) {
            this.info.OpenTime = '全天';
          }

          this.images = Object.values(this.info.Picture).filter((d: string) => d.startsWith('https'));

          // if media is mobile, attraction info will be put below map.
          // the page should be scrolled to attraction info automatically when marker is clicked,
          // otherwise, user may have difficult to find attraction info.
          if (window.innerWidth <= 428) {
            window.scroll({
              top: (this.$refs.attractionInfo as HTMLElement).offsetTop,
              behavior: 'smooth',
            });
          }
        });
      }
    }
    setCurrentPositionMarker(lng: number, lat: number): void {
      this.currentPosMarker = this.setMarker('#dc3545')({
        name: 'setPopup',
        para: new Popup().setHTML("<p class='text-lg'>目前位置，點擊標記解鎖後(變藍)，再點地圖可以換位置</p>"),
      })([lng, lat]);

      this.currentPosMarker.togglePopup();

      this.currentPosMarker.getElement().addEventListener('click', (e) => {
        this.isCurrentPosLocked = !this.isCurrentPosLocked;

        const target = e.target as HTMLElement;
        const element = target.tagName === 'path' ? e.target : (target.parentNode as HTMLElement).childNodes[2];

        (element as HTMLElement).setAttribute('fill', this.isCurrentPosLocked ? '#dc3545' : '#08A6BB');
      });
    }
    removeMarker(): void {
      for (const i in this.markerMap) {
        this.markerMap[i].remove();
      }

      this.markerMap = {};
    }
    async searchAttraction(data: { keyword: string; type: number }): Promise<void> {
      this.removeMarker();
      this.removeBoundary();

      if (data.type > 0) {
        if (this.currentBoundary.center.length === 2) {
          this.currentBoundary.radius = data.type;
          this.setBoundary(...this.currentBoundary.center, this.currentBoundary.radius);
        } else {
          // if this.currentBoundary.center.length !== 2 means that user didn't set position of currentPosMarker.
          this.isModalShow = true;
          return;
        }
      }

      const res = await query(this.getQueryUrl(data));

      const validatedRes = data.type > 0 ? this.countDistance(res) : res;

      if (validatedRes.length < 1) return;

      this.setMultipleMarker(validatedRes);

      if (validatedRes.length === 1) {
        const { PositionLon, PositionLat } = validatedRes[0].Position;

        this.map.flyTo({
          center: [PositionLon, PositionLat] as LngLatLike,
        });
      }
    }
    getQueryUrl(data: { keyword: string; type: number }): string {
      let queryUrl = this.baseUrl;

      if (data.keyword) {
        queryUrl += `contains(ScenicSpotName%2C'${data.keyword}')&`;
      }

      if (data.type > 0) {
        queryUrl += `Position%2FPositionLon%20ge%20${this.currentBoundary.xMin}%20and%20Position%2FPositionLon%20le%20${this.currentBoundary.xMax}%20and%20Position%2FPositionLat%20ge%20${this.currentBoundary.yMin}%20and%20Position%2FPositionLat%20le%20${this.currentBoundary.yMax}&`;
      }

      return `${queryUrl}%24format=JSON`;
    }
    countDistance(data: attraction[]): attraction[] {
      // there 2 reasons why countDistance() is necessary .
      // 1. transport data api don't support distance filter
      // 2. if you use this.currentBoundary.xMax, this.currentBoundary.xMin, this.currentBoundary.yMax and this.currentBoundary.yMin to be conditions,
      // there will still some data which are not in this.currentBoundary.radius.

      // in Taiwan
      // longitude 1deg:101.77545km
      // latitude 1deg:110.9362km.

      const res = data.filter((i: attraction) => {
        const lat = i.Position.PositionLat - this.currentBoundary.center[1];
        const latDistance = lat * 110.9362;
        const lngDistance = (i.Position.PositionLon - this.currentBoundary.center[0]) * 101.77545 * Math.cos(lat);
        const distance = Math.sqrt(Math.pow(lngDistance, 2) + Math.pow(latDistance, 2));

        return distance <= this.currentBoundary.radius;
      });

      return res;
    }
    closeModal(): void {
      this.isModalShow = false;
    }
    clearAttractionInfo(): void {
      this.isMapExpanded = true;
      this.info = {
        Address: '',
        City: '',
        Class1: '',
        Description: '',
        DescriptionDetail: '',
        OpenTime: '',
        Phone: '',
        Picture: {
          PictureUrl1: '',
          PictureDescription1: '',
        },
        Position: {
          PositionLon: 0,
          PositionLat: 0,
          GeoHash: '',
        },
        ScenicSpotID: '',
        ScenicSpotName: '',
        SrcUpdateTime: '',
        UpdateTime: '',
        ZipCode: '',
        ParkingPosition: {},
      };
    }

    // computed
    get mapClass(): { map: string; info: string } {
      return this.isMapExpanded ? { map: 'wrapper-full', info: 'wrapper-0' } : { map: 'wrapper-half', info: 'wrapper-half' };
    }
  }
</script>

<style lang="scss" scoped>
  #map {
    width: 100%;
    height: 600px;
  }

  .info {
    height: 100%;
    max-height: 600px;
  }

  .wrapper {
    &-full,
    &-0,
    &-half {
      padding: 0 6px;
      transition: width 1s, opacity 3s;
    }
  }

  .wrapper-full {
    width: 100%;
  }

  .wrapper-0 {
    width: 0%;
    opacity: 0;
  }

  .wrapper-half {
    width: 50%;
    opacity: 1;
  }

  @media (max-width: 428px) {
    #map {
      height: 400px;
    }

    .wrapper {
      &-half:first-child {
        margin-bottom: 16px;
        padding: auto;
        transition: width 1s, opacity 3s;
      }

      &-half {
        width: 100%;
      }
    }
  }
</style>
