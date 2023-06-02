<template>
  <Dialog
      :show="dialogConfig.show"
      :title="dialogConfig.title"
      :buttons="dialogConfig.buttons"
      width="450px"
      :showCancel="false"
      @close="dialogConfig.show = false"
  >
    <el-form :model="formData" ref="formDataRef" label-width="40px">

      <el-form-item label="Nickname" prop="nickeName">
        {{ formData.nickName }}
      </el-form-item>
      <el-form-item label="Avatar" prop="avatar">
        <CoverUpload
            :imageUlrPrefix="proxy.globalInfo.avatarUrl"
            v-model="formData.avatar"
        ></CoverUpload>
      </el-form-item>

      <el-form-item label="Gender" prop="sex">
        <el-radio-group v-model="formData.sex">
          <el-radio :label="0">Female</el-radio>
          <el-radio :label="1">Male</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="" prop="">
        <el-input
            clearable
            placeholder="Please enter a brief introduction"
            type="textarea"
            :rows="5"
            :maxlength="100"
            resize="none"
            show-word-limit
            v-model="formData.personDescription"
        ></el-input>
      </el-form-item>
    </el-form>
  </Dialog>
</template>

<script setup>
import { ref, reactive, getCurrentInstance, nextTick } from "vue";
import { useRouter, useRoute } from "vue-router";
const { proxy } = getCurrentInstance();
const router = useRouter();
const route = useRoute();

const api = {
  updateUserInfo: "/ucenter/updateUserInfo",
};

const dialogConfig = reactive({
  show: false,
  title: "Edit personal profile",
  buttons: [
    {
      type: "primary",
      text: "OK",
      click: (e) => {
        updateUserInfoHandler();
      },
    },
  ],
});

const formData = ref({});
const formDataRef = ref();

const emit = defineEmits(["resetUserInfo"]);
const updateUserInfoHandler = () => {
  formDataRef.value.validate(async (valid) => {
    if (!valid) {
      return;
    }
    let params = {};
    Object.assign(params, formData.value);
    let result = await proxy.Request({
      url: api.updateUserInfo,
      params,
    });
    if (!result) {
      return;
    }
    dialogConfig.show = false;
    if (params.avatar instanceof File) {
      router.go(0);
    } else {
      emit("resetUserInfo", params);
    }
  });
};

const showEditUserInfoDialog = (userInfo) => {
  dialogConfig.show = true;
  nextTick(() => {
    formDataRef.value.resetFields();
    const dataInfo = JSON.parse(JSON.stringify(userInfo));
    dataInfo.avatar = {
      imageUrl: dataInfo.userId,
    };
    formData.value = dataInfo;
  });
};

defineExpose({ showEditUserInfoDialog });
</script>



<style scoped lang="scss">

</style>