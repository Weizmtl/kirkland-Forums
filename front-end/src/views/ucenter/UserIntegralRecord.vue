
<template>
  <Dialog
      :show="dialogConfig.show"
      :title="dialogConfig.title"
      :buttons="dialogConfig.buttons"
      width="600px"
      :showCancel="false"
      @close="dialogConfig.show = false"
  >
  </Dialog>
</template>

<script setup>

</script>
<style scoped lang="scss">

</style>