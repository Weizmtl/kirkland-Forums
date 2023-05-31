<template>
    <div
        class="container-body ucenter"
        :style="{ width: proxy.globalInfo.bodyWidth + 'px' }"
    >
      <div class="user-banner">
        <router-link to="/" class="a-link">Home</router-link>
        <span class="iconfont icon-right"></span>
        <span>Personal Center</span>
      </div>
      <div class="ucenter-panel">
        <div class="user-side">
          <!--Avatar info-->
          <div class="avatar-panel">
            <div
                class="edit-btn a-link"
                v-if="isCurrentUser"
                @click="updateUserInfo"
            >
              Modify Profile
            </div>
          </div>
        </div>
      </div>
    </div>
</template>

<script setup>
import { ref, reactive, getCurrentInstance, onMounted, watch } from "vue";
import { useRouter, useRoute } from "vue-router";

const { proxy } = getCurrentInstance();
const router = useRouter();
const route = useRoute();
</script>

<style lang="scss" scoped>
.ucenter {
  .user-banner {
    color: #9ba7b9;
    line-height: 35px;
    .icon-right {
      padding: 0px 5px;
    }
  }
}
</style>
