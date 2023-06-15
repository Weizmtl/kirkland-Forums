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
      </Table>
    </div>
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