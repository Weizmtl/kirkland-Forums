<template>
  <div class="edit-post">
    <el-form
        :model="formData"
        :rules="rules"
        ref="formDataRef"
        class="post-panel"
        label-width="60px"
    >
      <div class="post-editor">
        <el-card :body-style="{ padding: '5px' }">
          <template #header>
            <span>Text</span>
          </template>
          <EditorMarkdown></EditorMarkdown>
        </el-card>
      </div>
      <div class="post-setting">
        <el-card :body-style="{ padding: '5px' }">
          <template #header>
            <span>Setting</span>
          </template>

          <el-form-item label="Title" prop="title">
            <el-input
                clearable
                placeholder="Hint"
                v-model="formData.title"
            ></el-input>
          </el-form-item>

          <el-form-item label="Boards" prop="boardIds">
            <el-cascader
                placeholder="Please select board"
                :options="boardList"
                :props="boardProps"
                clearable
                v-model="formData.boardIds"
                :style="{ width: '100%' }"
            />
          </el-form-item>

          <el-form-item label="Cover" prop="cover">
            <CoverUpload v-model="formData.cover"></CoverUpload>
          </el-form-item>

          <el-form-item label="Summary" prop="summary">
            <el-input
                clearable
                placeholder="Hint"
                type="textarea"
                :rows="5"
                :maxlength="200"
                resize="none"
                show-word-limit
                v-model="formData.summary"
            ></el-input>
          </el-form-item>

          <el-form-item label="Attachment" prop="cover">
            <AttachmentSelector
                v-model="formData.attachment"
            ></AttachmentSelector>
          </el-form-item>

          <el-form-item label="" prop="">
            <el-button
                type="primary"
                :style="{ width: '100%' }"
                @click="postHandler"
            >SAVE</el-button
            >
          </el-form-item>

        </el-card>
      </div>
    </el-form>
  </div>
</template>
<script setup>
import {ref, reactive, getCurrentInstance, watch, nextTick} from "vue";
import {useRouter, useRoute} from "vue-router";
import EditorMarkdown from "@/components/EditorMarkdown.vue";

const {proxy} = getCurrentInstance();
const router = useRouter();
const route = useRoute();


const formData = ref({});
const formDataRef = ref();
const rules = {
  title: [{required: true, message: "Please input article title"}],
};
</script>

<style lang="scss">
.edit-post {
  .post-panel {
    display: flex;
    .el-card__header {
      padding: 10px;
    }
    .post-editor {
      flex: 1;
    }
    .post-setting {
      margin-left: 10px;
      width: 450px;
    }
  }
}
</style>