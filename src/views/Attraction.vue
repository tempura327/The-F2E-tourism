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
        <SearchBar :options="searchOption" :isSelectorShow="true"></SearchBar>
      </div>
      <div class="col-6"></div>
    </div>

    <div class="row mb-32">
      <div class="col-6">
        <div id="map" class="rounded"></div>
      </div>

      <div class="col-6">
        <section class="info bg-gray-60 text-white rounded p-4">
          <!-- Gallery -->
          <h2 class="text-h2 text-white font-bold">info.ScenicSpotName</h2>
          <h4 class="text-h2 text-white">info.Address</h4>
          <h4 class="text-h2 text-white">info.Class1</h4>
          <h4 class="text-h2 text-white">info.OpenTime</h4>
          <h4 class="text-h2 text-white">info.Phone</h4>
          <h4 class="text-h2 text-white">info.DescriptionDetail</h4>
        </section>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Vue, Watch } from 'vue-property-decorator';

  import { Map, Marker, LngLatLike, Popup } from 'mapbox-gl';
  import 'mapbox-gl/dist/mapbox-gl.css';

  import Card from '@/components/Card.vue';
  import SearchBar from '@/components/SearchBar.vue';

  // import modalHelper from '@/utility/modalHelper.ts';
  // import query from '@/utility/queryHelper';

  @Component({
    components: {
      Card,
      SearchBar,
    },
  })
  export default class SimpleCard extends Vue {
    // props

    // data
    // isLoading = false;
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
    setCurrentPositionMarker(lng: number, lat: number): void {
      this.currentPosMarker = this.setMarker('#dc3545')({ name: 'setPopup', para: new Popup().setHTML("<p class='text-lg'>Here!</p>") })([lng, lat]);

      this.currentPosMarker.togglePopup();
    }

    // watch
    // @Watch('$store.state.attraction')
    // attractionWatch(): void {
    //   this.attractionData = this.$store.state.attraction;
    //   this.isLoading = this.$store.state.isAttractionLoading;
    // }
  }
</script>

<style lang="scss" scoped>
  #map {
    width: 100%;
    height: 600px;
  }

  .info {
    height: 600px;
  }
</style>
