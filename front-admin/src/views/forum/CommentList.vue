<template>
  <div class="top-panel">
    <el-form :model="searchFormData" label-width="50px">
      <el-row>
        <el-col :span="4">
          <el-form-item label="Content" prop="contentFuzzy">
            <el-input
                placeholder="Support fuzzy search"
                v-model="searchFormData.contentFuzzy"
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
          <el-form-item label="Status" prop="status">
            <el-select
                v-model="searchFormData.status"
                clearable
                placeholder="Please select status"
                :style="{ width: '100%' }"
            >
              <el-option :value="-1" label="Deleted"></el-option>
              <el-option :value="0" label="To be Review"></el-option>
              <el-option :value="1" label="Reviewed"></el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="4" :style="{ 'padding-left': '10px' }">
          <el-button-group>
            <el-button type="primary" @click="loadDataList">Search</el-button>
            <el-button type="success" @click="auditBatch">Batch Review</el-button>
            <el-button type="danger" @click="delBatch">Batch delete</el-button>
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
      <!-- user info -->
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
    </Table>
  </div>
</template>

<script>
import CommentImage from "./CommentImage.vue";
import { getCurrentInstance, reactive, ref, toRaw } from "vue";
const { proxy } = getCurrentInstance();

const api = {
  loadDataList: "/forum/loadComment",
  delComment: "/forum/delComment",
  auditComment: "/forum/auditComment",
};

//列表
const columns = [
  {
    label: "user info",
    prop: "avatar",
    width: 200,
    scopedSlots: "userInfo",
  },
  {
    label: "comment content",
    prop: "content",
    scopedSlots: "contentInfo",
  },
  {
    label: "like",
    width: 150,
    prop: "goodCount",
  },
  {
    label: "status",
    prop: "status",
    width: 100,
    scopedSlots: "statusInfo",
  },
  {
    label: "post date",
    prop: "postTime",
    width: 180,
  },
  {
    label: "post ip",
    prop: "userIpAddress",
    width: 100,
  },
  {
    label: "operation",
    prop: "op",
    width: 80,
    scopedSlots: "op",
  },
];
</script>

<style scoped>

</style>