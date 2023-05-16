<template>
    <div class="container-body article-list-body"
         :style="{ width:proxy.globalInfo.bodyWidth + 'px' }">
        <div class="article-panel">
            <div class="top-tab">
                <div :class="['tab', orderType == 0 ? 'active' : '']" @click="changeOrderType(0)">Hot</div>
                <el-divider direction="vertical"></el-divider>
                <div :class="['tab', orderType == 1 ? 'active' : '']" @click="changeOrderType(1)">Release Time</div>
                <el-divider direction="vertical"></el-divider>
                <div :class="['tab', orderType == 2 ? 'active' : '']" @click="changeOrderType(2)">Newest</div>
            </div>
            <div class="article-list">
                <DataList :loading="loading" :dataSource="articleListInfo" @loadData="loadArticle"
                          noDataMsg= "Haven't found any yet. To be the first? ">
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

const changeOrderType =(type)=>{
    orderType.value = type;
    loadArticle();
}

//articles list
const orderType = ref(0);
const loading=ref(false)
const articleListInfo = ref({});
const loadArticle = async () => {
    loading.value = true;
    let params = {
        pageNo: articleListInfo.value.pageNo,
        boardId: 0,
        orderType:orderType.value,
    }


    let result = await proxy.Request({
        url: api.loadArticle,
        params: params,
        showLoading:false,
    });
    loading.value = false
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
        .tab{
            cursor: pointer;
        }
        .active{
            color: var(--link);
        }
    }
  }
}

</style>