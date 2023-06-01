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
              Modify</div>
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
<!--          extend info-->
          <div class="user-extend-panel">
            <div class="info-item">
              <div class="label iconfont icon-integral">Credits</div>
              <div
                  class="value a-link"
                  v-if="isCurrentUser"
                  @click="showIntegralRecord"
              >
                {{ userInfo.currentIntegral }}
              </div>
              <div v-else class="value">{{ userInfo.currentIntegral }}</div>
            </div>
            <div class="info-item">
              <div class="label iconfont icon-like">Liked</div>
              <div class="value">{{ userInfo.likeCount }}</div>
            </div>
            <div class="info-item">
              <div class="label iconfont icon-post">Posted</div>
              <div class="value">{{ userInfo.postCount }}</div>
            </div>
            <div class="info-item">
              <div class="label iconfont icon-register">Join</div>
              <div class="value">{{ userInfo.joinTime }}</div>
            </div>
            <div class="info-item">
              <div class="label iconfont icon-login">Last Land</div>
              <div class="value">{{ userInfo.lastLoginTime }}</div>
            </div>
          </div>
        </div>
        <div class="article-panel">
          <el-tabs :model-value="activeTabName" @tab-change="changeTab">
            <el-tab-pane label="Post" :name="0"></el-tab-pane>
            <el-tab-pane label="Comment" :name="1"></el-tab-pane>
            <el-tab-pane label="Like" :name="2"></el-tab-pane>
          </el-tabs>
          <div class="article-list">
            <DataList
                :loading="loading"
                :dataSource="articleListInfo"
                @loadData="loadArticle"
                noDataMsg="No related articles are available"
            >
              <template #default="{ data }">
                <ArticleListItem
                    :data="data"
                    :showEdit="activeTabName == 0 && isCurrentUser"
                    :showComment="showComment"
                ></ArticleListItem>
              </template>
            </DataList>
          </div>
        </div>

      </div>
    </div>
</template>

<script setup>
import { ref, reactive, getCurrentInstance, onMounted, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "vuex";
const { proxy } = getCurrentInstance();
const router = useRouter();
const route = useRoute();
const store = useStore();

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

//right side article
const activeTabName = ref(0);
const changeTab = (type) => {
  activeTabName.value = type;
  loadArticle();
};
const loading = ref(false);
const articleListInfo = ref({});
const loadArticle = async () => {
  loading.value = true;
  let params = {
    pageNo: articleListInfo.value.pageNo,
    type: activeTabName.value,
    userId: userId.value,
  };
  let result = await proxy.Request({
    url: api.loadUserArticle,
    params: params,
    showLoading: false,
  });
  loading.value = false;
  if (!result) {
    return;
  }
  articleListInfo.value = result.data;
};

const isCurrentUser = ref(false);
//Reset the current user
const resetCurrentUser = () => {
  const loginUserInfo = store.getters.getLoginUserInfo;
  if (loginUserInfo && loginUserInfo.userId === userId.value) {
    isCurrentUser.value = true;
  } else {
    isCurrentUser.value = false;
  }
};

watch(
    () => store.state.loginUserInfo,
    (newVal, oldVal) => {
      resetCurrentUser();
    },
    { immediate: true, deep: true }
);

watch(
    () => route.params.userId,
    (newVal, oldVal) => {
      if (newVal) {
        userId.value = newVal;
        resetCurrentUser();
        loadUserInfo();
      }
    },
    { immediate: true, deep: true }
);


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
        .nick-name {
          .iconfont {
            margin-left: 5px;
            color: var(--link);
          }
        }
        .desc {
          margin-top: 5px;
          text-align: left;
          font-size: 14px;
          color: #929393;
        }
      }
      .user-extend-panel {
        margin-top: 10px;
        background: #fff;
        padding: 10px;
        .info-item {
          display: flex;
          justify-content: space-between;
          line-height: 30px;
          .label {
            font-size: 13px;
          }
          .label::before {
            font-size: 22px;
            color: #888888;
            padding-right: 5px;
          }
          .value {
            font-size: 13px;
          }
        }
      }
    }
    .article-panel {
      flex: 1;
      background: #fff;
      padding: 0px 10px 10px 10px;
    }
  }
}
</style>
