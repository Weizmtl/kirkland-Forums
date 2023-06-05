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
        </el-tabs>
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

const activeTabName = ref("reply");
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