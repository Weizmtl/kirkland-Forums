<template>
<div class="edit-post">
  <el-form
      :model="formData"
      :rules="rules"
      ref="formDataRef"
  >
    <el-form-item label="" prop="">
      <el-input
        clearable
        placeholder="Hint"
        v-model="formData.title"
      ></el-input>
    </el-form-item>
  </el-form>
</div>
</template>
<script setup>
import { ref, reactive, getCurrentInstance, watch, nextTick } from "vue";
import { useRouter, useRoute } from "vue-router";

const { proxy } = getCurrentInstance();
const router = useRouter();
const route = useRoute();


const formData = ref({});
const formDataRef = ref();
const rules = {
  title: [{ required: true, message: "Please input article title" }],
};
</script>



<style scoped lang="scss">

</style>