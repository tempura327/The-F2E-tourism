<template>
  <div class="container">
    <div class="row">
      <div class="col">
        <h1 class="font-bold text-h1 text-primary mb-6">景點</h1>
        <h5 class="h5 text-gray font-bold mb-12">
          台灣的各個美景，都美不勝收。
          <br />
          等你一同來發現這座寶島的奧妙！
        </h5>
      </div>
    </div>

    <div class="row mb-4">
      <div class="col-6">
        <SearchBar :options="searchOption" :isSelectorShow="true" @searchClick="searchAttraction"></SearchBar>
      </div>
      <div class="col-6"></div>
    </div>

    <div class="row mb-32">
      <div :class="mapClass.map">
        <div id="map" class="rounded"></div>
      </div>

      <div :class="mapClass.info">
        <section class="info bg-gray-80 text-white rounded overflow-y-auto p-4">
          <h2 class="text-h2 text-white font-bold mb-4">
            {{ info.ScenicSpotName }}
            <span class="text-h4 text-white">{{ info.OpenTime }}</span>
          </h2>

          <Gallery :images="images" galleryClass="mb-4"></Gallery>

          <h4 class="text-h4 text-white">{{ info.Address }}</h4>
          <h4 class="text-h4 text-white">{{ info.Class1 }}</h4>
          <h4 class="text-h4 text-white">{{ info.Phone }}</h4>
          <hr class="my-2" v-if="info.DescriptionDetail" />
          <h4 class="text-h4 text-white">{{ info.DescriptionDetail }}</h4>
        </section>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';

  import { Map, Marker, LngLatLike, Popup } from 'mapbox-gl';
  import 'mapbox-gl/dist/mapbox-gl.css';

  import Card from '@/components/Card.vue';
  import SearchBar from '@/components/SearchBar.vue';
  import Gallery from '@/components/Gallery.vue';

  import query from '@/utility/queryHelper';

  @Component({
    components: {
      Card,
      SearchBar,
      Gallery,
    },
  })
  export default class Attraction extends Vue {
    // props

    // data
    // isLoading = false;
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
    currentBoundary: { xMax: number; xMin: number; yMax: number; yMin: number; center: number[]; radius: number } = {
      xMax: 0,
      xMin: 0,
      yMax: 0,
      yMin: 0,
      center: [],
      radius: 5,
    };
    info: {
      Address: string;
      City: string;
      Class1: string;
      Description: string;
      DescriptionDetail: string;
      OpenTime: string;
      ParkingPosition: { PositionLon?: number; PositionLat?: number; GeoHash?: string };
      Phone: string;
      Picture: { PictureUrl1: string; PictureDescription1: string };
      Position: { PositionLon: number; PositionLat: number; GeoHash: string };
      ScenicSpotID: string;
      ScenicSpotName: string;
      SrcUpdateTime: string;
      UpdateTime: string;
      ZipCode: string;
    } = {
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
      window.navigator.geolocation.getCurrentPosition((pos) => {
        this.currentBoundary.center = [pos.coords.longitude, pos.coords.latitude];

        this.drawMap(pos.coords.longitude, pos.coords.latitude);
        this.setCurrentPositionMarker(pos.coords.longitude, pos.coords.latitude);
      });
    }
    setBoundary(lng: number, lat: number, radius: number): void {
      if ((this.map as Map).getLayer('polygon')) {
        (this.map as Map).removeLayer('polygon').removeSource('polygon');
      }

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
    createGeoJSONCircle(center: number[], radiusInKm: number, points = 64): any {
      const coords = {
        latitude: center[1],
        longitude: center[0],
      };

      // in Taiwan
      // longtitude 1deg:101.77545km
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
    setMultipleMarker(data: any): void {
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
        this.markerMap[`attraction-${attractionData.ScenicSpotID}`].getElement().addEventListener('click', (e) => {
          this.isMapExpanded = false;

          this.info = data[i];

          if (this.entireDayOtherWord.includes(this.info.OpenTime)) {
            this.info.OpenTime = '全天';
          }

          this.images = Object.values(this.info.Picture).filter((d: string) => d.startsWith('https'));
        });
      }
    }
    setCurrentPositionMarker(lng: number, lat: number): void {
      this.currentPosMarker = this.setMarker('#dc3545')({ name: 'setPopup', para: new Popup().setHTML("<p class='text-lg'>Here!</p>") })([lng, lat]);

      this.currentPosMarker.togglePopup();
    }
    removeMarker(): void {
      for (const i in this.markerMap) {
        this.markerMap[i].remove();
      }

      this.markerMap = {};
    }
    async searchAttraction(data: { keyword: string; type: number }): Promise<void> {
      this.setBoundary(this.currentBoundary.center[0], this.currentBoundary.center[1], this.currentBoundary.radius);
      console.log(data);
      const res = await query(`
          https://ptx.transportdata.tw/MOTC/v2/Tourism/ScenicSpot?%24filter=contains(ScenicSpotName%2C'${data.keyword}')%20and%20Position%2FPositionLon%20ge%20${this.currentBoundary.xMin}%20and%20Position%2FPositionLon%20le%20${this.currentBoundary.xMax}%20and%20Position%2FPositionLat%20ge%20${this.currentBoundary.yMin}%20and%20Position%2FPositionLat%20le%20${this.currentBoundary.yMax}&%24top=10&%24format=JSON
        `);
      console.log(res);
      const validatedRes = this.countDistance(res);
      console.log(validatedRes);

      if (validatedRes.length < 1) return;

      this.setMultipleMarker(validatedRes);
    }
    countDistance(data: any): any[] {
      // there 2 reasons why countDistance() is necessary .
      // 1. transport data api don't support distance filter
      // 2. if you use this.currentBoundary.xMax, this.currentBoundary.xMin, this.currentBoundary.yMax and this.currentBoundary.yMin to be conditions,
      // there will still some data which are not in this.currentBoundary.radius.

      // in Taiwan
      // longtitude 1deg:101.77545km
      // latitude 1deg:110.9362km.

      const res = data.filter((i: any) => {
        const lat = i.Position.PositionLat - this.currentBoundary.center[1];
        const latDistance = lat * 110.9362;
        const lngDistance = (i.Position.PositionLon - this.currentBoundary.center[0]) * 101.77545 * Math.cos(lat);
        const distance = Math.sqrt(Math.pow(lngDistance, 2) + Math.pow(latDistance, 2));

        return distance <= this.currentBoundary.radius;
      });

      return res;
    }

    // computed
    get mapClass(): { map: string; info: string } {
      return this.isMapExpanded ? { map: 'map-col-12', info: 'hidden' } : { map: 'map-col-6', info: 'map-col-6' };
    }
  }
</script>

<style lang="scss" scoped>
  #map {
    // @apply w-full;
    width: 100%;
    height: 600px;
  }

  .map-col-12,
  .map-col-6 {
    padding: 0 16px;
    box-sizing: border-box;
    transition: all 1s;
  }

  .map-col-12 {
    // @apply col-12 ease-in duration-1000;
    width: 100%;
  }

  .map-col-6 {
    // @apply col-6 ease-in duration-1000;
    width: 50%;
  }

  .info {
    height: 600px;
  }
</style>
