<template>
  <el-image
      class="comment-img"
      :src="proxy.globalInfo.imageUrl + src"
      :zoom-rate="1.2"
      :preview-src-list="imgList ? imgList : [src]"
      :initial-index="0"
      fit="scale-down"
      loading="lazy"
      hide-on-click-modal
  />
</template>

<script>
import { getCurrentInstance } from "vue";
const { proxy } = getCurrentInstance();
const props = defineProps({
  src: {
    type: String,
  },
  imgList: {
    type: Array,
  },
});
</script>

<style scoped>
.comment-img {
  width: 80px;
  height: 80px;
  background: #eeeeee;
}
</style>