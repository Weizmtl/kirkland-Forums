<template>
  <div
      class="container-body message-center"
      :style="{ width: proxy.globalInfo.bodyWidth + 'px' }"
  >
    <div class="user-banner">
      <router-link to="/" class="a-link">Home</router-link>
      <span class="iconfont icon-right"></span>
      <span>Message Center</span>
    </div>
  </div>
</template>
<script setup>
import { ref, reactive, getCurrentInstance, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "vuex";
const { proxy } = getCurrentInstance();
const router = useRouter();
const route = useRoute();
const store = useStore();
</script>
<style scoped lang="scss">

</style>