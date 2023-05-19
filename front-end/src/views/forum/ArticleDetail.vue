<template>
  <div class="container-body article-detail-body"
       :style="{ width:proxy.globalInfo.bodyWidth + 'px' }"
       v-if="Object.keys(articleInfo).length > 0">
    <!--    Plate navigation-->
    <div class="board-info">
      <router-link :to="`/forum/${articleInfo.pBoardId}`" class="a-link">{{
          articleInfo.pBoardName
        }}
      </router-link>
      <span class="iconfont icon-right"></span>
      <template v-if="articleInfo.boardId">
        <router-link
            class="a-link"
            :to="`/forum/${articleInfo.pBoardId}/${articleInfo.boardId}`"
        >{{ articleInfo.boardName }}
        </router-link>
        <span class="iconfont icon-right"></span>
      </template>
      <span>{{ articleInfo.title }}</span>
    </div>

    <!--    Article details-->
    <div class="details-container" :style="{width:proxy.globalInfo.bodyWidth - 300 + 'px'}">
      <div class="article-detail">
        <div class="title">{{ articleInfo.title }}</div>
        <div class="user-info">
          <Avatar :userId="articleInfo.userId" :width="50"></Avatar>
          <div class="user-info-detail">
            <div class="nick-name">{{ articleInfo.nickName }}</div>
            <div class="time-info">
              <span>{{articleInfo.postTime}}</span>
              <span class="address">&nbsp;·&nbsp;{{ articleInfo.userIpAddress }}</span>
              <span class="iconfont icon-eye-solid">
                {{ articleInfo.readCount == 0 ? "阅读" : articleInfo.readCount }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, reactive, getCurrentInstance, onMounted, nextTick, onUnmounted, watch,} from "vue";
import {useRouter, useRoute} from "vue-router";
import {useStore} from "vuex";
import Avatar from "@/components/Avatar.vue";

const {proxy} = getCurrentInstance();
const router = useRouter();
const route = useRoute();
const store = useStore();

const api = {
  getArticleDetail: "/forum/getArticleDetail",
};

const articleInfo = ref({});
const getArticleDetail = async (articleId) => {
  let result = await proxy.Request({
    url: api.getArticleDetail,
    params: {
      articleId: articleId,
    },
  });
  if (!result) {
    return;
  }
  articleInfo.value = result.data.forumArticle;
};

onMounted(() => {
  getArticleDetail(route.params.articleId);
});

</script>

<style lang="scss">

.article-detail-body {
  .board-info {
    line-height: 40px;

    .icon-right {
      margin: 0px 10px;
    }
  }

  .details-container {
    .article-detail {
      background: #fff;
      padding: 10px;

      .title {
        font-weight: bold;
      }
    }
  }
}

</style>
