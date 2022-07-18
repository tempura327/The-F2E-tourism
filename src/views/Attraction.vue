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
        <!-- SearchBar -->
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

  import { Map, Marker, Point } from 'mapbox-gl';
  import 'mapbox-gl/dist/mapbox-gl.css';

  import Card from '@/components/Card.vue';

  // import modalHelper from '@/utility/modalHelper.ts';
  // import query from '@/utility/queryHelper';

  @Component({
    components: {
      Card,
    },
  })
  export default class SimpleCard extends Vue {
    // props

    // data
    // isLoading = false;

    // hooks
    created(): void {
      this.getCurrentPosition();
    }

    // methods
    getCurrentPosition(): void {
      window.navigator.geolocation.getCurrentPosition((pos) => {
        this.drawMap(pos.coords.longitude, pos.coords.latitude);
      });
    }
    drawMap(long: number, lat: number): void {
      const map = new Map({
        container: 'map', // id
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [long, lat],
        zoom: 10, // starting zoom
        accessToken: 'pk.eyJ1IjoidGVtcHVyYTMyNyIsImEiOiJja3Z6eXVqdnQ1YTdxMm9tdHUwMGx4eXBmIn0.7SOTd4xVrpfdvJiDx5R34g',
      });

      map.on('style.load', () => {
        map.setFog({}); // Set the default atmosphere style
      });

      new Marker({
        // element:this.$refs.mark1,
        color: 'gold',
        draggable: false,
        // content: '<img src="" />' // icon of marker
      })
        .setLngLat([long, lat])
        .addTo(map as any);
    }

    // watch
    // @Watch('$store.state.attraction')
    // attractionWatch(): void {
    //   this.attractionData = this.$store.state.attraction;
    //   this.isLoading = this.$store.state.isAttractionLoading;
    // }
  }
</script>
