<template>
  <div>
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
      </Table>
    </div>
  </div>

</template>
<script>
import { getCurrentInstance, reactive, ref, toRaw } from "vue";
const { proxy } = getCurrentInstance();

const api={
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

</script>

<style scoped>

</style>