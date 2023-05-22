<template>
  <div class="image-viewer">
    <el-image-viewer
        :initial-index="previewImgIndex"
        hide-on-click-modal
        :url-list="imageList"
        @close="closeImgViewer"
        v-if="previewImgIndex != null">
    </el-image-viewer>
  </div>
</template>

<script setup>
import {ref} from "vue";

const prosp = defineProps({
  imageList: {
    type: Array,
  },
});

const previewImgIndex = ref(null);

const show = (index) => {
  stopScroll();
  previewImgIndex.value = index;
};

defineExpose({show});

const closeImgViewer = () => {
  startScroll();
  previewImgIndex.value = null;
};

//Stop rolling
const stopScroll = () => {
  document.body.style.overflow = "hidden";
};

// Start rolling
const startScroll = () => {
  document.body.style.overflow = "auto";
};
</script>

<style lang="scss">
//Picture transparency
.image-viewer {
  .el-image-viewer__mask {
    opacity: 0.7;
  }
}
</style>