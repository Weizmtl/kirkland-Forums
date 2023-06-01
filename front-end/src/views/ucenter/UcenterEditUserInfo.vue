<template>
  <Dialog
      :show="dialogConfig.show"
      :title="dialogConfig.title"
      :buttons="dialogConfig.buttons"
      width="450px"
      :showCancel="false"
      @close="dialogConfig.show = false"
  >

  </Dialog>
</template>

<script setup>
import { ref, reactive, getCurrentInstance, nextTick } from "vue";
import { useRouter, useRoute } from "vue-router";
const { proxy } = getCurrentInstance();
const router = useRouter();
const route = useRoute();


</script>



<style scoped lang="scss">

</style>