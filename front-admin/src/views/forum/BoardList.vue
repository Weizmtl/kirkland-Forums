<template>
  <div>
    <el-button type="primary" @click="showEdit('add', 0)">create board</el-button>
    <el-row :gutter="10" :style="{ 'margin-top': '10px' }">
      <el-col :span="14">
        <el-card class="box-card">
          <template #header>
            <div class="card-header">
              <span>first board</span>
            </div>
          </template>
          <Table
              :columns="columns"
              :showPagination="false"
              :dataSource="tableData"
              :fetch="loadDataList"
              :options="tableOptions"
              ref="dataTableRef"
              @rowClick="rowClick"
          >
            <template #cover="{ index, row }">
              <Cover :cover="row.cover"></Cover>
            </template>
            <!--borad info-->
            <template #boardInfo="{ index, row }">
              <div>board name：{{ row.boardName }}</div>
              <div>Posting permission：{{ postTypeMap[row.postType] }}</div>
            </template>

            <template #op="{ index, row }">
              <div class="op">
                <a
                    href="javascript:void(0)"
                    class="a-link"
                    @click="showEdit('update', 0, row)"
                >modify</a
                >
                <el-divider direction="vertical" />
                <a href="javascript:void(0)" class="a-link" @click="del(row)"
                >delete</a
                >
                <el-divider direction="vertical" />
                <a
                    href="javascript:void(0)"
                    :class="[index == 0 ? 'not-allow' : 'a-link']"
                    @click="changeSort(index, 'up', 0)"
                >move up</a
                >
                <el-divider direction="vertical" />
                <a
                    href="javascript:void(0)"
                    :class="[
                    index == tableData.list.length - 1 ? 'not-allow' : 'a-link',
                  ]"
                    @click="changeSort(index, 'down', 0)"
                >move down</a
                >
              </div>
            </template>
          </Table>
        </el-card>
      </el-col>
      <el-col :span="10">
        <el-card class="box-card">
          <template #header>
            <div class="card-header">
              <span>Secondary plate</span>
              <a
                  href="javascript:void(0)"
                  class="a-link"
                  @click="showEdit('add', 1)"
              >new Secondary plate</a
              >
            </div>
          </template>
          <Table
              :columns="columns"
              :showPagination="false"
              :dataSource="tableChildData"
              :options="tableOptions"
          >
            <template #cover="{ index, row }">
              <Cover :cover="row.cover"></Cover>
            </template>

            <template #boardInfo="{ index, row }">
              <div>board name：{{ row.boardName }}</div>
              <div>Posting permission：{{ postTypeMap[row.postType] }}</div>
            </template>
            <template #op="{ index, row }">
              <div class="op">
                <a
                    href="javascript:void(0)"
                    class="a-link"
                    @click="showEdit('update', 1, row)"
                >modify</a
                >
                <el-divider direction="vertical" />
                <a href="javascript:void(0)" class="a-link" @click="del(row)"
                >delete</a
                >
                <el-divider direction="vertical" />
                <a
                    href="javascript:void(0)"
                    :class="[index == 0 ? 'not-allow' : 'a-link']"
                    @click="changeSort(index, 'up', 1)"
                >up</a
                >
                <el-divider direction="vertical" />
                <a
                    href="javascript:void(0)"
                    :class="[
                    index == tableData.list.length - 1 ? 'not-allow' : 'a-link',
                  ]"
                    @click="changeSort(index, 'down', 1)"
                >down</a>
              </div>
            </template>
          </Table>
        </el-card>
      </el-col>
    </el-row>
    <Dialog
        :show="dialogConfig.show"
        :title="dialogConfig.title"
        :buttons="dialogConfig.buttons"
        width="550px"
        @close="dialogConfig.show = false"
    >
      <el-form
          :model="formData"
          :rules="rules"
          ref="formDataRef"
          label-width="110px"
      >
        <el-form-item
            label="first board"
            prop="boardName"
            v-if="formData.boardType == 1"
        >
          {{ formData.pBoardName }}
        </el-form-item>
        <el-form-item label="board name" prop="boardName">
          <el-input placeholder="please input name" v-model="formData.boardName">
          </el-input>
        </el-form-item>
        <el-form-item label="Posting permission" prop="postType">
          <el-radio-group v-model="formData.postType">
            <el-radio :label="1">{{ postTypeMap[1] }}</el-radio>
            <el-radio :label="0">{{ postTypeMap[0] }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="cover" prop="cover">
          <CoverUpload v-model="formData.cover"></CoverUpload>
        </el-form-item>
        <el-form-item label="summary" prop="boardDesc">
          <el-input
              v-model="formData.boardDesc"
              type="textarea"
              placeholder="please enter summary"
              :autosize="{ minRows: 4, maxRows: 4 }"
          >
          </el-input>
        </el-form-item>
      </el-form>
    </Dialog>
  </div>
</template>

<script>
import { getCurrentInstance, ref, reactive, nextTick } from "vue";

const { proxy } = getCurrentInstance();

const api = {
  loadBoard: "/board/loadBoard",
  saveBoard: "/board/saveBoard",
  delBoard: "/board/delBoard",
  changeBoardSort: "/board/changeBoardSort",
};

const postTypeMap = {
  0: "Only administrators are allowed to post",
  1: "everyone is allowed to post",
};

const columns = [
  {
    label: "cover",
    prop: "cover",
    width: 80,
    scopedSlots: "cover",
  },
  {
    label: "board info",
    prop: "boardName",
    width: 210,
    scopedSlots: "boardInfo",
  },
  {
    label: "summary",
    prop: "boardDesc",
  },
  {
    label: "operation",
    prop: "op",
    width: 190,
    scopedSlots: "op",
  },
];

const tableData = reactive({});
const tableOptions = {
  extHeight: 100,
};

//table
const dataTableRef = ref();

const tableChildData = reactive({});

//current selected board
const currentBoard = ref(null);

const loadDataList = async () => {
  let result = await proxy.Request({
    url: api.loadBoard,
  });
  if (!result) {
    return;
  }
  tableData.list = result.data;

  if (currentBoard.value == null && result.data.length > 0) {
    currentBoard.value = result.data[0];
    tableChildData.list = result.data[0].children;
  } else {
    currentBoard.value = result.data.find((item) => {
      return item.boardId == currentBoard.value.boardId;
    });
    tableChildData.list = currentBoard.value.children;
  }
  nextTick(() => {
    dataTableRef.value.setCurrentRow("boardId", currentBoard.value.boardId);
  });
};

//board click
const rowClick = (row) => {
  tableChildData.list = row.children;
  currentBoard.value = row;
};

//new,modify
const dialogConfig = reactive({
  show: false,
  title: "title",
  buttons: [
    {
      type: "danger",
      text: "ok",
      click: (e) => {
        submitForm();
      },
    },
  ],
});
const formData = ref({});
const rules = {
  boardName: [{ required: true, message: "please enter name of board" }],
  postType: [{ required: true, message: "Please select whether to allow Posting" }],
};
const formDataRef = ref();
const showEdit = (opType, boardType, data) => {
  dialogConfig.show = true;
  nextTick(() => {
    formDataRef.value.resetFields();
    if (opType == "add") {
      dialogConfig.title = "new board";
      formData.value = {};
    } else if (opType == "update") {
      dialogConfig.title = "modify board";
      formData.value = JSON.parse(JSON.stringify(data));

      if (formData.value.cover) {
        formData.value.cover = { imageUrl: formData.value.cover };
      }
    }
    formData.value.boardType = boardType;
    if (boardType == 1) {
      formData.value.pBoardName = currentBoard.value.boardName;
      formData.value.pBoardId = currentBoard.value.boardId;
    } else {
      formData.value.pBoardId = 0;
    }
  });
};

const submitForm = () => {
  formDataRef.value.validate(async (valid) => {
    if (!valid) {
      return;
    }
    let params = {};
    Object.assign(params, formData.value);
    delete params.children;


    if (!(params.cover instanceof File)) {
      delete params.cover;
    }

    let result = await proxy.Request({
      url: api.saveBoard,
      params,
    });
    if (!result) {
      return;
    }
    dialogConfig.show = false;
    proxy.Message.success("save successfully");
    loadDataList();
  });
};
</script>

<style scoped>

</style>