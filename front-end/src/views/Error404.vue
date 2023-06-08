<script setup>

</script>

<template>
  <div class="error">
    <div class="info">404</div>
    <div><router-link to="/" class="a-link">Back to home</router-link></div>
  </div>
</template>

<style lang="scss">
.error {
  text-align: center;
  padding-top: 200px;
  .info {
    font-size: 100px;
    color: rgb(26, 149, 231);
  }
}
</style>