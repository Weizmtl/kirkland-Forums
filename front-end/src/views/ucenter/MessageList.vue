<template>
  <div
      class="container-body message-center"
      :style="{ width: proxy.globalInfo.bodyWidth + 'px' }"
  >
    <div class="user-banner">
      <router-link to="/" class="a-link">Home</router-link>
      <span class="iconfont icon-right"></span>
      <span>Message Center</span>
    </div>
    <div class="message-panel">
      <div class="tab-list">
        <el-tabs :model-value="activeTabName" @tab-change="tabChange">
          <el-tab-pane name="reply">
            <template #label>
              <div class="tab-item">
                <span>Reply me</span>
                <span class="count-tag" v-if="messageCountInfo.reply > 0">{{
                    messageCountInfo.reply > 99 ? "99+" : messageCountInfo.reply
                  }}</span>
              </div>
            </template>
          </el-tab-pane>
          <el-tab-pane name="likePost">
            <template #label>
              <div class="tab-item">
                <span>Like me</span>
                <span class="count-tag" v-if="messageCountInfo.likePost > 0">{{
                    messageCountInfo.likePost > 99
                        ? "99+"
                        : messageCountInfo.likePost
                  }}</span>
              </div>
            </template>
          </el-tab-pane>
          <el-tab-pane name="downloadAttachment">
            <template #label>
              <div class="tab-item">
                <span>Download mine</span>
                <span
                    class="count-tag"
                    v-if="messageCountInfo.downloadAttachment > 0"
                >{{
                    messageCountInfo.downloadAttachment > 99
                        ? "99+"
                        : messageCountInfo.downloadAttachment
                  }}</span
                >
              </div>
            </template>
          </el-tab-pane>
          <el-tab-pane name="likeComment">
            <template #label>
              <div class="tab-item">
                <span>Like my comment</span>
                <span
                    class="count-tag"
                    v-if="messageCountInfo.likeComment > 0"
                >{{
                    messageCountInfo.likeComment > 99
                        ? "99+"
                        : messageCountInfo.likeComment
                  }}</span
                >
              </div>
            </template>
          </el-tab-pane>
          <el-tab-pane name="sys">
            <template #label>
              <div class="tab-item">
                <span>System message</span>
                <span class="count-tag" v-if="messageCountInfo.sys > 0">{{
                    messageCountInfo.sys > 99 ? "99+" : messageCountInfo.sys
                  }}</span>
              </div>
            </template>
          </el-tab-pane>
        </el-tabs>
        <router-link :to="`/user/${userId}`" class="a-link go-ucenter"
        >&lt;&lt;个人中心</router-link>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, reactive, getCurrentInstance, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "vuex";
const { proxy } = getCurrentInstance();
const router = useRouter();
const route = useRoute();
const store = useStore();

const api = {
  loadMessageList: "/ucenter/loadMessageList",
};

const activeTabName = ref("reply");

const tabChange = (type) => {
  router.push(`/user/message/${type}`);
};

const loading = ref(false);
const messageListInfo = ref({});
const loadMessage = async () => {
  loading.value = true;
  let params = {
    pageNo: messageListInfo.value.pageNo,
    code: activeTabName.value,
  };
  let result = await proxy.Request({
    url: api.loadMessageList,
    params: params,
    showLoading: false,
  });
  loading.value = false;
  if (!result) {
    return;
  }
  messageListInfo.value = result.data;
  store.commit("readMessage", activeTabName.value);
};

//message amount
const messageCountInfo = ref({});
watch(
    () => store.state.messageCountInfo,
    (newVal, oldVal) => {
      messageCountInfo.value = newVal || {};
    },
    { immediate: true, deep: true }
);

</script>
<style scoped lang="scss">
.message-center {
  .user-banner {
    color: #9ba7b9;
    line-height: 35px;

    .icon-right {
      padding: 0px 5px;
    }
  }
  .message-panel {
    background: #fff;
    padding: 10px;
    margin-top: 5px;
     .tab-item {
        position: relative;
        padding: 0px 10px;

        .count-tag {
          position: absolute;
          right: -10px;
          height: 15px;
          line-height: 15px;
          min-width: 20px;
          display: inline-block;
          background: #f56c6c;
          border-radius: 10px;
          font-size: 13px;
          text-align: center;
          color: #fff;
          margin-left: 10px;
        }
      }
    }
  }

</style>