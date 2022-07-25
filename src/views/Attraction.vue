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

    <div class="row">
      <div class="col">
        <SearchBar></SearchBar>
      </div>
    </div>

    <div class="row">
      <div class="col">
        <div id="map"></div>
      </div>

      <div class="col">
        <section class="info">
          <h2 class="h2 text-bold"></h2>
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
