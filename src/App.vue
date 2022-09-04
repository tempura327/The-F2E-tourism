<template>
  <div id="app" class="overflow-hidden">
    <Header></Header>

    <router-view></router-view>

    <Footer></Footer>
  </div>
</template>

<script lang="ts">
  import { Component, Vue, Watch } from 'vue-property-decorator';

  import Header from '@/components/Header.vue';
  import Footer from '@/components/Footer.vue';

  @Component({
    components: {
      Header,
      Footer,
    },
  })
  export default class App extends Vue {
    // props

    // data

    // hooks
    mounted(): void {
      this.$store.commit('setIsMobile', window.innerWidth <= 428);

      if (document.getElementById('gapi-script')) return; // if script has been loaded, return.

      const gsiScriptTag = document.createElement('script');

      // new api. the old one will be deprecated in March 2023.
      gsiScriptTag.src = 'https://accounts.google.com/gsi/client';
      gsiScriptTag.id = 'gsi-script';

      // append script tag into head tag
      document.getElementsByTagName('head')[0].appendChild(gsiScriptTag);
    }

    // methods

    // watch
    @Watch('$store.state.isModalShow')
    modalShowWatch(): void {
      this.$el.parentElement?.classList.toggle('overflow-hidden');
    }
  }
</script>

<style lang="scss">
  #app {
    font-family: Arial, Helvetica, sans-serif;
  }
</style>
