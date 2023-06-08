<template>
  <div
      class="container-body search-body"
      :style="{ width: proxy.globalInfo.bodyWidth + 'px' }"
  >
    <div
        class="search-panel"
        :style="{ 'padding-top': startSearch ? '0px' : searchPanelHeight + 'px' }"
    >
      <el-form
          :model="formData"
          :rules="rules"
          ref="formDataRef"
          @submit.prevent
      >

        <el-form-item prop="keyword">
          <el-input
              size="large"
              clearable
              placeholder="input the keyword you want to find"
              v-model="formData.keyword"
              @keyup.enter="search"
              @focus="startSearchHandler"
          >
            <template #suffix>
              <span
                  class="iconfont icon-search"
                  @click="search"
                  @blur="formData.keyword = $event.target.value.trim()"
              ></span>
            </template>
          </el-input>
        </el-form-item>
      </el-form>
  </div>
  </div>


</template>
<script setup>


import { ref, reactive, getCurrentInstance, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
const { proxy } = getCurrentInstance();
import { useStore } from "vuex";
const router = useRouter();
const route = useRoute();
const store = useStore();

const formData = ref({});
const formDataRef = ref();
</script>

<style scoped lang="scss">
.search-body {
  background: #fff;
  padding: 10px;
  min-height: calc(100vh - 210px);
  .search-panel {
    display: flex;
    justify-content: center;
    .el-input {
      width: 700px;
    }
  }
}
</style>