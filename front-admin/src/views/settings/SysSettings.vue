<template>
    <div>
      <el-form
          :model="formData"
          :rules="rules"
          ref="formDataRef"
          label-width="150px"
          :style="{ width: '800px' }"
      >
        <el-divider content-position="left">registration message</el-divider>
        <el-row>
          <el-col :span="24">
            <el-form-item label="welcome" prop="registerWelcomInfo">
              <el-input
                  v-model="formData.registerWelcomInfo"
                  placeholder="please input welcome message"
                  maxlength="250"
              >
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-divider content-position="left">mail setting</el-divider>
        <el-row>
          <el-col :span="24">
            <el-form-item label="mail title" prop="emailTitle">
              <el-input
                  v-model="formData.emailTitle"
                  placeholder="please input title"
                  maxlength="200"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="mail content" prop="emailContent">
              <el-input
                  v-model="formData.emailContent"
                  placeholder="Please enter the message content, the verification code use %s placeholder"
                  maxlength="300"
              >
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-divider content-position="left">review setting</el-divider>
        <el-row>
          <el-col :span="12">
            <el-form-item label="Whether article need to be review" prop="postAudit">
              <el-radio-group v-model="formData.postAudit">
                <el-radio :label="false">no</el-radio>
                <el-radio :label="true">yes</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Whether comment need to be review" prop="commentAudit">
              <el-radio-group v-model="formData.commentAudit">
                <el-radio :label="false">no</el-radio>
                <el-radio :label="true">yes</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>

        <el-divider content-position="left">post setting</el-divider>
        <el-row>
          <el-col :span="12"
          ><el-form-item label="post credits" prop="postIntegral">
            <el-input
                v-model="formData.postIntegral"
                placeholder="Please enter the number of points you can earn for Posting"
            >
            </el-input>
          </el-form-item>
            <el-form-item label="Number of posts per day" prop="postDayCountThreshold">
              <el-input
                  v-model="formData.postDayCountThreshold"
                  placeholder="Please enter the number of posts per day"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Number of images that can be uploaded per day" prop="dayImageUploadCount">
              <el-input
                  v-model="formData.dayImageUploadCount"
                  placeholder="Please enter the number of images you can upload per day"
              >
              </el-input>
            </el-form-item>
            <el-form-item label="Allowable attachment size（MB）" prop="attachmentSize">
              <el-input
                  v-model="formData.attachmentSize"
                  placeholder="Please enter the maximum allowed size of the attachment"
              >
                <template #append>MB</template>
              </el-input>
            </el-form-item></el-col
          >
        </el-row>

        <el-divider content-position="left">comment setting</el-divider>
        <el-row>
          <el-col :span="24">
            <el-form-item label="Whether to open comments" prop="commentOpen">
              <el-radio-group v-model="formData.commentOpen">
                <el-radio :label="true">able</el-radio>
                <el-radio :label="false">disable</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="comment credit" prop="commentIntegral">
              <el-input
                  v-model="formData.commentIntegral"
                  placeholder="Please enter the number of points you can earn for your comments"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
                label="Number of comments allowed per day"
                prop="commentDayCountThreshold"
            >
              <el-input
                  v-model="formData.commentDayCountThreshold"
                  placeholder="Please enter the number of comments you can post per day"
              >
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-divider content-position="left">like setting</el-divider>
        <el-row>
          <el-col :span="12">
            <el-form-item label="Number of likes per day" prop="likeDayCountThreshold">
              <el-input
                  v-model="formData.likeDayCountThreshold"
                  placeholder="Please enter the number of likes per day"
              >
              </el-input>
            </el-form-item> </el-col
          ></el-row>

        <el-form-item label="">
          <el-button type="primary" @click="saveSetting">save</el-button>
        </el-form-item>

      </el-form>
    </div>
</template>

<script>
import { getCurrentInstance, ref } from "vue";
const { proxy } = getCurrentInstance();
const api = {
  loadSetting: "/setting/getSetting",
  saveSetting: "/setting/saveSetting",
};
const formData = ref({});

const rules = {
  registerWelcomInfo: [{ required: true, message: "Please enter a welcome message" }],
  emailTitle: [{ required: true, message: "Please enter email title" }],
  emailContent: [{ required: true, message: "Please enter email content" }],

  postAudit: [{ required: true, message: "Please select whether the article needs to be reviewed" }],
  commentAudit: [{ required: true, message: "Please select whether the comments needs to be reviewed" }],
  postIntegral: [
    { required: true, message: "please input post credits" },
    {
      validator: proxy.Verify.number,
      message: "please input correct number",
    },
  ],
  postDayCountThreshold: [
    { required: true, message: "Please enter the number of posts per day" },
    {
      validator: proxy.Verify.number,
      message: "please input correct number",
    },
  ],
  dayImageUploadCount: [
    { required: true, message: "Please enter the number of images you can upload per day" },
    {
      validator: proxy.Verify.number,
      message: "please input correct number",
    },
  ],
  dayImageUploadCount: [
    { required: true, message: "Please enter the maximum allowed size of the attachment" },
    {
      validator: proxy.Verify.number,
      message: "please input correct number",
    },
  ],
  commentOpen: [{ required: true, message: "Please select whether to enable comments" }],
  commentIntegral: [
    { required: true, message: "Please enter the number of points you can earn for your comments" },
    {
      validator: proxy.Verify.number,
      message: "please input correct number",
    },
  ],
  commentDayCountThreshold: [
    { required: true, message: "Please enter the number of comments you can post per day" },
    {
      validator: proxy.Verify.number,
      message: "please input correct number",
    },
  ],
  likeDayCountThreshold: [
    { required: true, message: "Please enter the number of liked you can post per day" },
    {
      validator: proxy.Verify.number,
      message: "please input correct number",
    },
  ],
};
const formDataRef = ref();

const getSetting = async () => {
  let result = await proxy.Request({
    url: api.loadSetting,
  });
  if (!result) {
    return;
  }
  let resultData = result.data;
  for (let item in resultData) {
    let subData = resultData[item];
    if (subData != null) {
      for (let sub in subData) {
        formData.value[sub] = subData[sub];
      }
    }
  }
  console.log(formData.value);
};
getSetting();

const saveSetting = async () => {
  let result = await proxy.Request({
    url: api.saveSetting,
    params: formData.value,
  });
  if (!result) {
    return;
  }
  proxy.Message.success("save successfully");
};
</script>

<style lang="scss">
</style>