<template>
  <div class="container-body article-list-body"
       :style="{ width:proxy.globalInfo.bodyWidth + 'px' }">
    <div class="board-info">
      <router-link :to="`/forum/${articleInfo.pBoardId}`">{{articleInfo.pBoardName}}</router-link>
      <span class="iconfont icon-right"></span>
    </div>
  </div>
</template>

<script setup>
import {ref, reactive, getCurrentInstance, onMounted, nextTick, onUnmounted, watch,} from "vue";
import {useRouter, useRoute} from "vue-router";
import {useStore} from "vuex";

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
</style>
