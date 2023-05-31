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
            <div class="avatar-inner">
              <Avatar :userId="userInfo.userId" :width="120"></Avatar>
            </div>
            <div class="nick-name">
              <span>{{ userInfo.nickName }}</span>
              <span v-if="userInfo.sex == 0" class="iconfont icon-woman"></span>
              <span v-if="userInfo.sex == 1" class="iconfont icon-man"></span>
            </div>
            <div class="desc">
              {{ userInfo.personDescription }}
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

const api = {
  getUserInfo: "/ucenter/getUserInfo",
  loadUserArticle: "/ucenter/loadUserArticle",
};

const userId = ref(null);
const userInfo = ref({});

const loadUserInfo = async () => {
  let result = await proxy.Request({
    url: api.getUserInfo,
    params: {
      userId: userId.value,
    },
    errorCallback: () => {
      setTimeout(() => {
        router.push("/");
      }, 1500);
    },
  });
  if (!result) {
    return;
  }
  userInfo.value = result.data;
};
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
  .ucenter-panel {
    display: flex;

    .user-side {
      width: 300px;
      margin-right: 10px;

      .avatar-panel {
        background: #fff;
        text-align: center;
        padding: 10px;

        .edit-btn {
          text-align: right;
          font-size: 14px;
        }

        .avatar-inner {
          display: flex;
          justify-content: center;
        }
      }
    }
  }
}
</style>
