<template>
  <div class="top-panel">
    <el-form :model="searchFormData" label-width="50px">
      <el-row>
        <el-col :span="4">
          <el-form-item label="Title" prop="titleFuzzy">
            <el-input
                placeholder="Please input a title"
                v-model="searchFormData.titleFuzzy"
                clearable
                @keyup.enter.native="loadDataList"
            >
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="Nick Name" prop="nickNameFuzzy">
            <el-input
                placeholder="Please input nickname"
                v-model="searchFormData.nickNameFuzzy"
                clearable
                @keyup.enter.native="loadDataList"
            >
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="board" prop="sex">
            <el-cascader
                placeholder="Please select board"
                :options="boardList"
                :props="boardProps"
                clearable
                v-model="searchFormData.boardIds"
                :style="{ width: '100%' }"
            />
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="attachment" prop="sex">
            <el-select
                v-model="searchFormData.attachmentType"
                clearable
                placeholder="Please select"
                :style="{ width: '100%' }"
            >
              <el-option :value="1" label="with attachment"></el-option>
              <el-option :value="0" label="no attachment"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="status" prop="status">
            <el-select
                v-model="searchFormData.status"
                clearable
                placeholder="please select status"
                :style="{ width: '100%' }"
            >
              <el-option :value="-1" label="deleted"></el-option>
              <el-option :value="0" label="to be review"></el-option>
              <el-option :value="1" label="reviewed"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="4">
          <el-form-item label="Top" prop="topType">
            <el-select
                v-model="searchFormData.topType"
                clearable
                placeholder="Please select"
                :style="{ width: '100%' }"
            >
              <el-option :value="0" label="Untop"></el-option>
              <el-option :value="1" label="Top"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="4" :style="{ 'padding-left': '10px' }">
          <el-button-group>
            <el-button type="primary" @click="loadDataList">Search</el-button>
            <el-button
                type="success"
                @click="auditBatch"
                :disabled="selectBatchList.length == 0"
            >Batch review</el-button
            >
            <el-button
                type="danger"
                @click="delBatch"
                :disabled="selectBatchList.length == 0"
            >Batch delete</el-button
            >
          </el-button-group>
        </el-col>
      </el-row>
    </el-form>
  </div>
  <div class="data-list">
    <Table
        ref="tableRef"
        :columns="columns"
        :showPagination="true"
        :dataSource="tableData"
        :fetch="loadDataList"
        :options="tableOptions"
        @rowSelected="setRowSelected"
    >
      <!-- User info -->
      <template #userInfo="{ index, row }">
        <div class="user-info">
          <Avatar :userId="row.userId" :width="50"></Avatar>
          <div class="name-info">
            <div>
              <a
                  :href="proxy.globalInfo.webDomain + 'user/' + row.userId"
                  target="_blank"
                  class="a-link"
              >{{ row.nickName }}</a
              >
            </div>
            <div>{{ row.userIpAddress }}</div>
          </div>
        </div>
      </template>
      <!--Cover-->
      <template #cover="{ index, row }">
        <Cover :cover="row.cover"></Cover>
      </template>
      <!--Title-->
      <template #titleInfo="{ index, row }">
        <a
            class="a-link"
            target="_blank"
            tag="a"
            :href="proxy.globalInfo.webDomain + 'post/' + row.articleId"
        >{{ row.title }}</a
        >
      </template>
      <!--Board-->
      <template #boardInfo="{ index, row }">
        <div>
          <span>{{ row.pBoardName }}</span>
          <span v-if="row.boardName">/{{ row.boardName }}</span>
        </div>
      </template>
      <!--Interactive info-->
      <template #interactionInfo="{ index, row }">
        <div>view：{{ row.readCount }}</div>
        <div>like：{{ row.goodCount }}</div>
        <div>
          comment：<span>{{ row.commentCount }}</span>
          <span
              class="a-link"
              :style="{ 'margin-left': '5px' }"
              @click="showComment(row.articleId)"
              v-if="row.commentCount"
          >check</span
          >
        </div>
      </template>
      <!--attachment info-->
      <template #attachmentInfo="{ index, row }">
        <div v-if="row.attachmentType == 0">no attachment</div>
        <div v-if="row.attachmentType == 1">
          <span
              @click="showAttachment(row.nickName, row.articleId)"
              class="a-link"
          >check attachment</span
          >
        </div>
      </template>
      <!--status-->
      <template #statusInfo="{ index, row }">
        <span v-if="row.status == -1" :style="{ color: 'red' }">Deleted</span>
        <span v-if="row.status == 0" :style="{ color: 'red' }">To be review</span>
        <span v-if="row.status == 1" :style="{ color: 'green' }">Reviewed</span>
        <div v-if="row.topType == 1" :style="{ color: 'green' }">Top</div>
        <div v-if="row.topType == 0" :style="{ color: 'green' }">Untop</div>
      </template>
      <!--Operation info-->
      <template #op="{ index, row }">
        <div class="op" v-if="row.status != -1">
          <el-dropdown trigger="click">
            <span class="iconfont icon-more"> </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="updateBoard(row)"
                >modify board</el-dropdown-item
                >
                <el-dropdown-item
                    @click="topArticle(row)"
                    v-if="row.topType == 1 && row.status == 1"
                >Untop</el-dropdown-item
                >
                <el-dropdown-item
                    @click="topArticle(row)"
                    v-if="row.topType == 0 && row.status == 1"
                >Top</el-dropdown-item
                >
                <el-dropdown-item @click="delArticle(row)"
                >Delete</el-dropdown-item
                >
                <el-dropdown-item @click="audit(row)" v-if="row.status == 0"
                >Review</el-dropdown-item
                >
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </template>
    </Table>
  </div>
  <!--Modify board-->
  <ArticleBoard ref="articleBoardRef" @reload="loadDataList"></ArticleBoard>
  <!--check attachment-->
  <ArticleAttachmentt ref="attachmenttRef"></ArticleAttachmentt>
  <!--view comment-->
  <ArticleComment ref="commentRef"></ArticleComment>
</template>

<script setup>
import ArticleBoard from "./ArticleBoard.vue";
import ArticleAttachmentt from "./ArticleAttachmentt.vue";
import ArticleComment from "./ArticleComment.vue";
import { getCurrentInstance, reactive, ref, toRaw } from "vue";
const { proxy } = getCurrentInstance();

const api = {
  loadDataList: "/forum/loadArticle",
  loadBoard: "/board/loadBoard",
  delArticle: "/forum/delArticle",
  topArticle: "/forum/topArticle",
  auditArticle: "/forum/auditArticle",
};

//Table
const columns = [
  {
    label: "User info",
    prop: "avatar",
    width: 200,
    scopedSlots: "userInfo",
  },
  {
    label: "Cover",
    width: 100,
    prop: "cover",
    scopedSlots: "cover",
  },
  {
    label: "Title",
    scopedSlots: "titleInfo",
  },
  {
    label: "Board",
    width: 200,
    scopedSlots: "boardInfo",
  },
  {
    label: "Interaction info",
    width: 150,
    scopedSlots: "interactionInfo",
  },
  {
    label: "Attachment",
    prop: "attachment",
    width: 100,
    scopedSlots: "attachmentInfo",
  },
  {
    label: "Status",
    prop: "status",
    width: 100,
    scopedSlots: "statusInfo",
  },
  {
    label: "Post Time",
    prop: "postTime",
    width: 180,
  },
  {
    label: "Post IP",
    prop: "userIpAddress",
    width: 100,
  },
  {
    label: "Operation",
    prop: "op",
    width: 80,
    scopedSlots: "op",
  },
];

//Search
const searchFormData = reactive({});
//Table
const tableData = ref({});
const tableOptions = {
  extHeight: 90,
  selectType: "checkbox",
};

const loadDataList = async () => {
  let params = {
    pageNo: tableData.value.pageNo,
    pageSize: tableData.value.pageSize,
  };
  Object.assign(params, searchFormData);
  params.boardIds = toRaw(params.boardIds) || [];
  if (params.boardIds.length == 1) {
    params.pBoardId = params.boardIds[0];
  } else if (params.boardIds.length == 2) {
    params.pBoardId = params.boardIds[0];
    params.boardId = params.boardIds[1];
  }
  delete params.boardIds;
  let result = await proxy.Request({
    url: api.loadDataList,
    params,
  });
  if (!result) {
    return;
  }
  tableData.value = result.data;
};

//obtain board
const boardProps = {
  multiple: false,
  checkStrictly: true,
  value: "boardId",
  label: "boardName",
};
const boardList = ref([]);
const loadBoardList = async () => {
  let result = await proxy.Request({
    url: api.loadBoard,
  });
  if (!result) {
    return;
  }
  boardList.value = result.data;
};
loadBoardList();

//modify board
const articleBoardRef = ref();
const updateBoard = (row) => {
  articleBoardRef.value.updateBoard(row);
};

//check attachment
const attachmenttRef = ref();
const showAttachment = (nickName, articleId) => {
  attachmenttRef.value.show(nickName, articleId);
};
//view comment
const commentRef = ref();
const showComment = (articleId) => {
  commentRef.value.show(articleId);
};

//review
const audit = (data) => {
  proxy.Confirm(`Do you want to review【${data.title}】?`, async () => {
    let result = await proxy.Request({
      url: api.auditArticle,
      params: {
        articleIds: data.articleId,
      },
    });
    if (!result) {
      return;
    }
    loadDataList();
  });
};

//delete
const delArticle = (data) => {
  proxy.Confirm(`Do you want to delete【${data.title}】`, async () => {
    let result = await proxy.Request({
      url: api.delArticle,
      params: {
        articleIds: data.articleId,
      },
    });
    if (!result) {
      return;
    }
    loadDataList();
  });
};

//Top
const topArticle = (data) => {
  const opName = data.topType == 0 ? "Set to top" : "Untop";
  proxy.Confirm(`Do you want to make【${data.title}】 ${opName} top`, async () => {
    let result = await proxy.Request({
      url: api.topArticle,
      params: {
        topType: data.topType == 0 ? 1 : 0,
        articleId: data.articleId,
      },
    });
    if (!result) {
      return;
    }
    loadDataList();
  });
};

const selectBatchList = ref([]);
const setRowSelected = (rows) => {
  selectBatchList.value = [];
  rows.forEach((element) => {
    selectBatchList.value.push(element.articleId);
  });
};
const tableRef = ref();

//batch audit
const auditBatch = (data) => {
  proxy.Confirm(`Do you want to do batch audit？`, async () => {
    let result = await proxy.Request({
      url: api.auditArticle,
      params: {
        articleIds: selectBatchList.value.join(","),
      },
    });
    if (!result) {
      return;
    }
    tableRef.value.clearSelection();
    loadDataList();
  });
};

//batch delete
const delBatch = (data) => {
  proxy.Confirm(`Do you want to make batch delete？`, async () => {
    let result = await proxy.Request({
      url: api.delArticle,
      params: {
        articleIds: selectBatchList.value.join(","),
      },
    });
    if (!result) {
      return;
    }
    tableRef.value.clearSelection();
    loadDataList();
  });
};
</script>

<style lang="scss">
.data-list {
  .user-info {
    display: flex;
    align-items: center;
    .name-info {
      margin-left: 5px;
      font-size: 13px;
    }
  }
  .op {
    .iconfont {
      cursor: pointer;
    }
  }
}
</style>