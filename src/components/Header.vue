<template>
  <nav class="nav">
    <div class="nav_logo">
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" class="mr-5">
        <g clip-path="url(#clip0_53:24)">
          <path
            d="M0 20C0 8.9543 8.9543 0 20 0C31.0457 0 40 8.9543 40 20C40 31.0457 31.0457 40 20 40C8.9543 40 0 31.0457 0 20Z"
            fill="url(#paint0_linear_53:24)" />
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M43.2107 23.0979C43.2107 23.0979 37.5383 19.507 33.2539 19.507C27.5866 19.507 23.7974 24.4044 19.2131 24.4044C13.8703 24.4044 13.198 22.9892 10.2019 22.9892C5.96747 22.9892 0.378658 25.6429 -2.56875 24.6852C-4.94725 23.9123 -7.81065 22.3512 -7.81065 22.3512V35.4594L43.2107 36.2473V23.0979Z"
            fill="url(#paint1_linear_53:24)" />
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M-6.96973 31.8558C-6.96973 31.8558 -6.71107 23.6089 -0.847368 22.3194C4.2794 21.5526 8.232 27.5046 12.8163 27.5046C18.1591 27.5046 20.6771 24.0503 25.8644 24.0503C29.6478 24.0503 33.3422 27.0535 38.4943 26.0125C49.9379 23.7003 44.0516 23.3036 44.0516 23.3036V36.4118L-6.96973 37.1997V31.8558Z"
            fill="url(#paint2_linear_53:24)" />
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M-1.46149 32.3825C-1.46149 32.3825 0.999992 29.0743 2.93175 28.7413C4.8635 28.4082 5.93267 31.633 5.93267 31.633C5.93267 31.633 6.8371 31.492 7.32835 31.633C7.81959 31.7741 8.20858 32.3825 8.20858 32.3825C8.20858 32.3825 8.83426 30.4392 11.4323 30.4392C14.0304 30.4392 15.3504 33.0646 15.3504 33.0646C15.3504 33.0646 16.2152 32.3825 17.1158 32.3825C18.0164 32.3825 19.0358 33.0646 19.0358 33.0646C19.0358 33.0646 19.672 30.4392 22.3563 30.4392C25.0406 30.4392 26.1856 32.6672 26.1856 32.6672C26.1856 32.6672 27.2702 31.9828 28.324 31.9828C29.3778 31.9828 30.6354 32.6672 30.6354 32.6672C30.6354 32.6672 30.9883 30.5057 32.558 29.2318C34.1278 27.9578 37.5456 28.7413 37.5456 28.7413L39.4152 29.7254V40H-1.46149V32.3825Z"
            fill="url(#paint3_linear_53:24)" />
          <ellipse cx="24.7619" cy="9.52382" rx="3.33333" ry="3.33333" fill="#FEFFCA" />
        </g>
        <defs>
          <linearGradient id="paint0_linear_53:24" x1="0" y1="0" x2="0" y2="40" gradientUnits="userSpaceOnUse">
            <stop stop-color="#A2E9FF" />
            <stop offset="0.552083" stop-color="#DDFDFF" />
          </linearGradient>
          <linearGradient id="paint1_linear_53:24" x1="43.2107" y1="19.507" x2="43.2107" y2="36.2473" gradientUnits="userSpaceOnUse">
            <stop stop-color="#AAF3FA" />
            <stop offset="1" stop-color="#D5FAFD" />
          </linearGradient>
          <linearGradient id="paint2_linear_53:24" x1="-6.96973" y1="22.2512" x2="-6.96973" y2="37.1997" gradientUnits="userSpaceOnUse">
            <stop stop-color="#7EDEE7" />
            <stop offset="1" stop-color="#B5F1F5" />
          </linearGradient>
          <linearGradient id="paint3_linear_53:24" x1="-1.46149" y1="28.4429" x2="-1.46149" y2="40" gradientUnits="userSpaceOnUse">
            <stop stop-color="#4297A8" />
            <stop offset="1" stop-color="#77C8D3" />
          </linearGradient>
          <clipPath id="clip0_53:24">
            <path d="M0 20C0 8.9543 8.9543 0 20 0C31.0457 0 40 8.9543 40 20C40 31.0457 31.0457 40 20 40C8.9543 40 0 31.0457 0 20Z" fill="white" />
          </clipPath>
        </defs>
      </svg>

      <img src="../assets/Travel Taiwan.svg" alt="" />
    </div>

    <ul class="nav_menu">
      <li class="nav_item" v-show="isSignInShow">
        <button class="auth" ref="auth" v-show="!$store.state.currentUser.token"></button>
        <img :src="avatar" alt="" class="nav_avatar" v-show="$store.state.currentUser.token" />
      </li>

      <li class="nav_menu_item">
        <router-link to="/">首頁</router-link>
      </li>

      <li class="nav_menu_item">
        <router-link to="/attraction">景點導覽</router-link>
      </li>

      <li class="nav_menu_item">
        <router-link to="/activity">觀光活動</router-link>
      </li>
    </ul>
  </nav>
</template>

<script lang="ts">
  import { Component, Vue, Watch } from 'vue-property-decorator';

  import Spinner from '@/components/Spinner.vue';

  @Component({
    components: {
      Spinner,
    },
  })
  export default class Header extends Vue {
    // props
    // data
    isLoading = true;
    isTooltipShow = false;
    isSignInShow = false;
    avatar = '';

    // methods

    // watch
    @Watch('$store.state.currentUser.token', { deep: true })
    isLoginWatch(newVal: string): void {
      this.isLoading = newVal === undefined;

      if (newVal.length > 0) {
        this.avatar = this.$store.state.currentUser.avatar;
      } else {
        this.avatar = '';
      }
    }
    @Watch('$route.fullPath', { deep: true, immediate: true })
    routerWatch(newVal: string): void {
      this.isSignInShow = newVal.includes('activity');
    }
  }
</script>
