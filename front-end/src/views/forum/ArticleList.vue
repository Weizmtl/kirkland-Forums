<template>
  <div class="container-body article-list-body"
       :style="{ width:proxy.globalInfo.bodyWidth + 'px' }">

    <!--secondary board info-->
    <div class="sub-board" v-if="pBoardId">
      <span v-for="item in subBoardList">{{ item.boardName }}</span>
    </div>
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
                  noDataMsg="Haven't found any yet. To be the first? ">
          <template #default="{data}">
            <ArticleListItem :data="data"></ArticleListItem>
          </template>
        </DataList>
      </div>
    </div>
  </div>
</template>

<script setup>

import {ref, reactive, getCurrentInstance, watch} from "vue";
import {useRouter, useRoute} from "vue-router";
import ArticleListItem from "@/views/forum/ArticleListItem.vue";
import DataList from "@/components/DataList.vue";
import {useStore} from "vuex";

const {proxy} = getCurrentInstance();
const router = useRouter();
const route = useRoute();
const store = useStore();
const api = {
  loadArticle: "/forum/loadArticle",
};

const changeOrderType = (type) => {
  orderType.value = type;
  loadArticle();
}

//articles list
const orderType = ref(0);
const loading = ref(false)
const articleListInfo = ref({});
// primary plate
const pBoardId = ref(0);
// secondary plate
const boardId = ref(0);
const loadArticle = async () => {
  loading.value = true;
  let params = {
    pageNo: articleListInfo.value.pageNo,
    pBoardId: pBoardId.value,
    boardId: boardId.value,
    orderType: orderType.value,
  }
  let result = await proxy.Request({
    url: api.loadArticle,
    params: params,
    showLoading: false,
  });
  loading.value = false;
  if (!result) {
    return;
  }
  articleListInfo.value = result.data;
};
loadArticle();

//secondary board
const subBoardList = ref([]);
const setSubBoard = () => {
    subBoardList.value = store.getters.getSubBoardList(pBoardId.value);
}

//Listen for routing changes
watch(
    () => route.params,
    (newVal, oldVal) => {
      pBoardId.value = newVal.pBoardId;
      boardId.value = newVal.boardId;
      setSubBoard();
      loadArticle();
    },
    {immediate: true, deep: true}
);

//Monitor plate data changes
watch(
    () => store.state.boardList,
    (newVal, oldVal) => {
      setSubBoard();
    },
    { immediate: true, deep: true }
);


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

      .tab {
        cursor: pointer;
      }

      .active {
        color: var(--link);
      }
    }
  }
}

</style>