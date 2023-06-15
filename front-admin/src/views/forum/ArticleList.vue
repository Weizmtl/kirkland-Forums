<template>
  <div class="top-panel">
    <el-form :model="searchFormData" label-width="50px">
      <el-row>
        <el-col :span="4">
          <el-form-item label="Title" prop="titleFuzzy">
            <el-input
                placeholder="Please enter a title"
                v-model="searchFormData.titleFuzzy"
                clearable
                @keyup.enter.native="loadDataList"
            >
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="Nickname" prop="nickNameFuzzy">
            <el-input
                placeholder="Please enter a nickname"
                v-model="searchFormData.nickNameFuzzy"
                clearable
                @keyup.enter.native="loadDataList"
            >
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="Board" prop="sex">
            <el-cascader
                placeholder="Please select a board"
                :options="boardList"
                :props="boardProps"
                clearable
                v-model="searchFormData.boardIds"
                :style="{ width: '100%' }"
            />
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="Attachment" prop="sex">
            <el-select
                v-model="searchFormData.attachmentType"
                clearable
                placeholder="Please select"
                :style="{ width: '100%' }"
            >
              <el-option :value="1" label="Yes"></el-option>
              <el-option :value="0" label="No"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="Status" prop="status">
            <el-select
                v-model="searchFormData.status"
                clearable
                placeholder="Please select status"
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
          <el-form-item label="top" prop="topType">
            <el-select
                v-model="searchFormData.topType"
                clearable
                placeholder="Please select"
                :style="{ width: '100%' }"
            >
              <el-option :value="0" label="not on top"></el-option>
              <el-option :value="1" label="top"></el-option>
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
            >Batch approval</el-button
            >
            <el-button
                type="danger"
                @click="delBatch"
                :disabled="selectBatchList.length == 0"
            >Batch Remove</el-button
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
          <div>Read：{{ row.readCount }}</div>
          <div>Like：{{ row.goodCount }}</div>
          <div>
            Comment：<span>{{ row.commentCount }}</span>
            <span
                class="a-link"
                :style="{ 'margin-left': '5px' }"
                @click="showComment(row.articleId)"
                v-if="row.commentCount"
            >View</span
            >
          </div>
        </template>
        <!--Attachment info-->
        <template #attachmentInfo="{ index, row }">
          <div v-if="row.attachmentType == 0">none attachment</div>
          <div v-if="row.attachmentType == 1">
          <span
              @click="showAttachment(row.nickName, row.articleId)"
              class="a-link"
          >Check attachment</span
          >
          </div>
        </template>
        <!--Status-->
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
                  >modify</el-dropdown-item
                  >
                  <el-dropdown-item
                      @click="topArticle(row)"
                      v-if="row.topType == 1 && row.status == 1"
                  >cancel top</el-dropdown-item
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
</template>
<script>
import {getCurrentInstance, reactive, ref, toRaw} from "vue";

const {proxy} = getCurrentInstance();

const api = {
  loadDataList: "/forum/loadArticle",
};

//Colum List
const columns = [{
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
    label: "Interactive info",
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
    label: "IP",
    prop: "userIpAddress",
    width: 100,
  },
  {
    label: "Operation",
    prop: "op",
    width: 80,
    scopedSlots: "op",
  },];

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