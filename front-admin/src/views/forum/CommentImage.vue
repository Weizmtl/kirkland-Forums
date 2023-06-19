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
export default {
  name: "CommentImage"
}
</script>

<style scoped>

</style>