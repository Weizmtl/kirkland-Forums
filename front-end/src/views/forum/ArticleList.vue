<template>
    <div class="container-body article-list-body"
         :style="{ width:proxy.globalInfo.bodyWidth + 'px' }">
        <div class="article-panel">
            <div class="top-tab">
                <div>HOT</div>
                <el-divider direction="vertical"></el-divider>
                <div>Release Time</div>
                <el-divider direction="vertical"></el-divider>
                <div>Newest</div>
            </div>
            <div class="article-list">
                <DataList :dataSource="articleListInfo" @loadData="loadArticle">
                    <template #default="{data}">
                        <ArticleListItem :data="data"></ArticleListItem>
                    </template>
                </DataList>
            </div>
        </div>
    </div>
</template>

<script setup>

import {ref, reactive, getCurrentInstance} from "vue";
import {useRouter, useRoute} from "vue-router";
import ArticleListItem from "@/views/forum/ArticleListItem.vue";
import DataList from "@/components/DataList.vue";

const {proxy} = getCurrentInstance();
const router = useRouter();
const route = useRoute();

const api = {
    loadArticle: "/forum/loadArticle",
};

//articles list
const articleListInfo = ref({});
const loadArticle = async () => {
    let params ={
        pageNo: articleListInfo.value.pageNo,
        boardId: 0,
    }


    let result = await proxy.Request({
        url: api.loadArticle,
        params: params,
    });
    if (!result) {
        return
    }
    articleListInfo.value = result.data;
};
loadArticle();

</script>

<style lang="scss">
.article-list-body {
  .article-panel {
    background: #fff;

    .top-tab {
      display: flex;
      align-items: center;
      padding: 10px;
      font-size: 14px;
      border-bottom: 1px solid #ddd;
    }
      .article-list{
          padding-bottom: 5px;
      }
  }

}

</style>