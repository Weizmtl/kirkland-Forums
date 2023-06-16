<template>
  <div>
    <Dialog
        :show="dialogConfig.show"
        :title="dialogConfig.title"
        :buttons="dialogConfig.buttons"
        width="500px"
        @close="dialogConfig.show = false"
    >
      <el-form :model="formData" ref="formDataRef" label-width="50px">

        <el-form-item label="Title">
          {{ formData.title }}
        </el-form-item>

        <el-form-item label="Board" prop="">
          <el-cascader
              placeholder="Please select a board"
              :options="boardList"
              :props="boardProps"
              clearable
              v-model="formData.boardIds"
              :style="{ width: '100%' }"
          />
        </el-form-item>
      </el-form>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, reactive, getCurrentInstance, nextTick, toRaw } from "vue";
const { proxy } = getCurrentInstance();

const dialogConfig = reactive({
  show: false,
  title: "Modify Board",
  buttons: [
    {
      text: "Confirm",
      click: (e) => {
        submitForm();
      },
    },
  ],
});

const api = {
  loadBoard: "board/loadBoard",
  updateBoard: "/forum/updateBoard",
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

const boardProps = {
  multiple: false,
  checkStrictly: true,
  value: "boardId",
  label: "boardName",
};
const formData = ref({});
const formDataRef = ref();
const updateBoard = async (data) => {
  dialogConfig.show = true;
  nextTick(() => {
    formDataRef.value.resetFields();
    data.boardIds = [];
    data.boardIds.push(data.pBoardId);
    if (data.boardId != null && data.boardId != 0) {
      data.boardIds.push(data.boardId);
    }
    formData.value = data;
  });
};
defineExpose({ updateBoard });

const emit = defineEmits(["reload"]);
const submitForm = async () => {
  let params = {
    articleId: formData.value.articleId,
  };
  params.boardIds = toRaw(formData.value.boardIds);
  if (params.boardIds.length == 1) {
    params.pBoardId = params.boardIds[0];
  } else if (params.boardIds.length == 2) {
    params.pBoardId = params.boardIds[0];
    params.boardId = params.boardIds[1];
  }
  delete params.boardIds;
  let result = await proxy.Request({
    url: api.updateBoard,
    params: params,
  });
  if (!result) {
    return;
  }
  dialogConfig.show = false;
  emit("reload");
};
</script>

<style lang="scss" scoped>
</style>
