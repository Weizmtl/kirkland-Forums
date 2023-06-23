<template>
  <div>
    <Dialog
        :show="dialogConfig.show"
        :title="dialogConfig.title"
        :buttons="dialogConfig.buttons"
        width="500px"
        @close="dialogConfig.show = false"
    >
      <el-form
          :model="formData"
          :rules="rules"
          ref="formDataRef"
          label-width="80px"
      >
        <el-form-item label="Message content" prop="message">
          <el-input
              clearable
              placeholder="Please enter a message"
              type="textarea"
              :rows="5"
              :maxlength="200"
              resize="none"
              show-word-limit
              v-model="formData.message"
          ></el-input>
        </el-form-item>

        <el-form-item label="credit" prop="integral">
          <el-input
              clearable
              placeholder="The integral, it's empty or zero doesn't add or subtract, it can be negative"
              v-model="formData.integral"
          ></el-input>
        </el-form-item>
      </el-form>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, reactive, getCurrentInstance, nextTick } from "vue";
const { proxy } = getCurrentInstance();

const api = {
  sendMessage: "/user/sendMessage",
};

const dialogConfig = reactive({
  show: false,
  title: "Send message",
  buttons: [
    {
      text: "Ok",
      click: (e) => {
        submitForm();
      },
    },
  ],
});

const formData = ref({});
const formDataRef = ref();
const rules = {
  message: [{ required: true, message: "Please input a message" }],
};

const sendMessage = (data) => {
  dialogConfig.show = true;
  nextTick(() => {
    formDataRef.value.resetFields();
    formData.value = {
      userId: data.userId,
      nickName: data.nickName,
    };
  });
};
defineExpose({ sendMessage });

const emit = defineEmits(["reload"]);
//submit form
const submitForm = () => {
  formDataRef.value.validate(async (valid) => {
    if (!valid) {
      return;
    }
    let params = {};
    Object.assign(params, formData.value);
    let result = await proxy.Request({
      url: api.sendMessage,
      params,
    });
    if (!result) {
      return;
    }
    dialogConfig.show = false;

    proxy.Message.success("send successfully");
    emit("reload");
  });
};
</script>

<style lang="scss" scoped>
</style>