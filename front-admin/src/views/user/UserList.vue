<template>
  <div class="top-panel">
    <el-form :model="searchFormData" label-width="50px">
      <el-row>
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
          <el-form-item label="gender" prop="sex">
            <el-select
                v-model="searchFormData.sex"
                clearable
                placeholder="Please select gender"
                :style="{ width: '100%' }"
            >
              <el-option :value="1" label="male"></el-option>
              <el-option :value="0" label="female"></el-option>
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
              <el-option :value="1" label="normal"></el-option>
              <el-option :value="0" label="disable"></el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="5" :style="{ 'padding-left': '10px' }">
          <el-button type="primary" @click="loadDataList">Search</el-button>
        </el-col>
      </el-row>
    </el-form>
  </div>
<Table
    :columns="columns"
    :showPagination="true"
    :dataSource="tableData"
    :fetch="loadDataList"
    :options="tableOptions"
>
<!--cover-->
<template #avatar="{ index, row }">
  <Avatar :userId="row.userId"></Avatar>
</template>
<template #nickName="{ index, row }">
  {{ row.nickName }}
  <span v-if="row.sex">({{ row.sex == 0 ? "female" : "male" }})</span>
</template>
<!--login info-->
<template #loginInfo="{ index, row }">
  <div>last login time：{{ row.lastLoginTime }}</div>
  <div>last login ip：{{ row.lastLoginIp }}</div>
  <div>last login location：{{ row.lastLoginIpAddress }}</div>
</template>
<!--style-->
<template #integral="{ index, row }">
  <div>total：{{ row.totalIntegral }}</div>
  <div>current：{{ row.currentIntegral }}</div>
</template>

<!--status-->
<template #status="{ index, row }">
  <span v-if="row.status == 1" :style="{ color: 'green' }">normal</span>
  <span v-else :style="{ color: 'red' }">disable</span>
</template>
<template #op="{ index, row }">
  <div class="op" v-if="row.status != -1">
    <el-dropdown trigger="click">
      <span class="iconfont icon-more"> </span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item @click="updateUserStatus(row)">{{
              row.status == 1 ? "disabled" : "abled"
            }}</el-dropdown-item>
          <el-dropdown-item @click="sendMessage(row)"
          >send system message</el-dropdown-item>
          >
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>
</Table>
<SendMessage ref="sendMessageRef" @reload="loadDataList"></SendMessage>
</template>

<script>
import SendMessage from "./SendMessage.vue";
import { getCurrentInstance, reactive, ref } from "vue";
const { proxy } = getCurrentInstance();

const api = {
  loadDataList: "/user/loadUserList",
  updateUserStatus: "/user/updateUserStatus",
};

//列表
const columns = [
  {
    label: "avatar",
    prop: "avatar",
    width: 80,
    scopedSlots: "avatar",
  },
  {
    label: "nickname",
    prop: "nickName",
    width: 150,
    scopedSlots: "nickName",
  },
  {
    label: "email",
    prop: "email",
    width: 180,
  },
  {
    label: "persondesc",
    prop: "personDescription",
  },
  {
    label: "jointime",
    prop: "joinTime",
    width: 180,
  },
  {
    label: "login time",
    prop: "lastLoginTime",
    width: 260,
    scopedSlots: "loginInfo",
  },
  {
    label: "credit",
    prop: "totalIntegral",
    width: 150,
    scopedSlots: "integral",
  },
  {
    label: "status",
    prop: "status",
    scopedSlots: "status",
    width: 60,
  },
  {
    label: "operation",
    prop: "op",
    width: 80,
    scopedSlots: "op",
  },
];
//search
const searchFormData = reactive({});
//list
const tableData = ref({});
const tableOptions = {
  extHeight: 50,
};

const loadDataList = async () => {
  let params = {
    pageNo: tableData.value.pageNo,
    pageSize: tableData.value.pageSize,
  };

  Object.assign(params, searchFormData);
  let result = await proxy.Request({
    url: api.loadDataList,
    params,
  });
  if (!result) {
    return;
  }
  tableData.value = result.data;
};

//disable
const updateUserStatus = (data) => {
  const title = data.status == 1 ? "disable" : "able";
  proxy.Confirm(`are you sure${title}user${data.nickName}`, async () => {
    let result = await proxy.Request({
      url: api.updateUserStatus,
      params: {
        userId: data.userId,
        status: data.status == 1 ? 0 : 1,
      },
    });
    if (!result) {
      return;
    }
    loadDataList();
  });
};

const sendMessageRef = ref();
const sendMessage = (row) => {
  sendMessageRef.value.sendMessage(row);
};
</script>

<style lang="scss">
.op {
  cursor: pointer;
}
</style>