<template>
  <div class="edit-post">
    <el-form
        :model="formData"
        :rules="rules"
        ref="formDataRef"
        class="post-panel"
        label-width="90px"
    >
      <div class="post-editor">
        <el-card :body-style="{ padding: '5px' }">
          <template #header>
            <div class="post-editor-title">
            <span>TEXT</span>
              <div class="change-editor-type">
                <span class="iconfont icon-change" @click="changeEditor">
                  Toggle  {{
                    editorType == 0 ? "markdown editor" : "Html editor"
                  }}
                </span>
              </div>
            </div>
          </template>

          <el-form-item prop="content" label-width="0">
            <EditorHtml
                :height="htmlEditorHeight"
                v-if="editorType == 0"
                v-model="formData.content"
            ></EditorHtml>
            <EditorMarkdown
                :height="markdownHeight"
                v-if="editorType == 1"
                v-model="formData.markdownContent"
                @htmlContent="setHtmlContent"
            >
            </EditorMarkdown>
          </el-form-item>
        </el-card>
      </div>
      <div class="post-setting">
        <el-card :body-style="{ padding: '5px' }">
          <template #header>
            <span>Setting</span>
          </template>
          <div class="setting-inner">
            <!--input-->
            <el-form-item label="Title" prop="title">
              <el-input
                  clearable
                  :maxlength="150"
                  placeholder=""
                  v-model="formData.title"
              ></el-input>
            </el-form-item>
            <el-form-item label="board" prop="boardIds">
              <el-cascader
                  placeholder="please select board"
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
            <!--textarea-->
            <el-form-item label="Summary" prop="summary">
              <el-input
                  clearable
                  placeholder=""
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

            <el-form-item
                label="Credits"
                prop="integral"
                v-if="formData.attachment"
            >
              <el-input
                  clearable
                  placeholder="please input credits"
                  v-model="formData.integral"
              ></el-input>
              <span class="tips">0 means no credits download</span>
            </el-form-item>

            <!--input-->
            <el-form-item label="" prop="">
              <el-button
                  type="primary"
                  :style="{ width: '100%' }"
                  @click="postHandler"
              >Save</el-button
              >
            </el-form-item>
          </div>
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

const markdownHeight = window.innerHeight - 80 - 60;
const htmlEditorHeight = window.innerHeight - 80 - 120;

const api = {
  loadBoard: "/forum/loadBoard4Post",
  postArticle: "/forum/postArticle",
  articleDetail4Update: "/forum/articleDetail4Update",
  updateArticle: "/forum/updateArticle",
};

const articleId = ref(null);
const getArticleDetail = () => {
  nextTick(async () => {
    formDataRef.value.resetFields();
    if (articleId.value) {
      //modify
      let result = await proxy.Request({
        url: api.articleDetail4Update,
        params: {
          articleId: articleId.value,
        },
        showError: false,
        errorCallback: (response) => {
          ElMessageBox.alert(response.info, "Error", {
            "show-close": false,
            callback: (action) => {
              router.go(-1);
            },
          });
        },
      });
      if (!result) {
        return;
      }
      let articleInfo = result.data.forumArticle;
      //config editor
      editorType.value = articleInfo.editorType;
      //config board info
      articleInfo.boardIds = [];
      articleInfo.boardIds.push(articleInfo.pBoardId);
      if (articleInfo.boardId != null && articleInfo.boardId != 0) {
        articleInfo.boardIds.push(articleInfo.boardId);
      }
      //config cover info
      if (articleInfo.cover) {
        articleInfo.cover = { imageUrl: articleInfo.cover };
      }
      //config attachment
      if (result.data.attachment) {
        articleInfo.attachment = {
          name: result.data.attachment.fileName,
        };
        articleInfo.integral = result.data.attachment.integral;
      }
      formData.value = articleInfo;
    } else {
      formData.value = {};
      editorType.value = proxy.VueCookies.get("editorType") || 0;
    }
  });
};

//Sets the html text information for the markdown editor
const setHtmlContent = (htmlContent) => {
  formData.value.content = htmlContent;
};

watch(
    () => route,
    (newVal, oldVal) => {
      if (
          newVal.path.indexOf("/editPost") != -1 ||
          newVal.path.indexOf("/newPost") != -1
      ) {
        articleId.value = newVal.params.articleId;
        getArticleDetail();
      }
    },
);

const formData = ref({});
const formDataRef = ref();
const rules = {
  title: [{ required: true, message: "please input article title" }],
  boardIds: [{ required: true, message: "please select board" }],
  content: [{ required: true, message: "plaese input text" }],
  integral: [
    { required: true, message: "please input credits for download" },
    { validator: proxy.Verify.number, message: "credits only numbers" },
  ],
};

//post article
const postHandler = () => {
  formDataRef.value.validate(async (valid) => {
    if (!valid) {
      return;
    }
    let params = {};
    Object.assign(params, formData.value);
    //config board id
    if (params.boardIds.length == 1) {
      params.pBoardId = params.boardIds[0];
    } else if (params.boardIds.length == 2) {
      params.pBoardId = params.boardIds[0];
      params.boardId = params.boardIds[1];
    }
    delete params.boardIds;
    //config editor type
    params.editorType = editorType.value;
    //Obtain content
    const contentText = params.content.replace(/<(?!img).*?>/g, "");
    if (contentText == "") {
      proxy.message.warning("The text cannot be empty\n");
      return;
    }
    if (params.attachment != null) {
      params.attachmentType == 1;
    } else {
      params.attachmentType = 0;
    }

    //cover
    if (!(params.cover instanceof File)) {
      delete params.cover;
    }

    if (!(params.attachment instanceof File)) {
      delete params.attachment;
    }

    let result = await proxy.Request({
      url: params.articleId ? api.updateArticle : api.postArticle,
      params: params,
    });
    if (!result) {
      return;
    }
    proxy.Message.success("save successfully");
    router.push(`/post/${result.data}`);
  });
};

//board info
const boardProps = {
  multiple: false,
  checkStrictly: true,
  value: "boardId",
  label: "boardName",
};
const boardList = ref([]);
const loadBardList = async () => {
  let result = await proxy.Request({
    url: api.loadBoard,
  });
  if (!result) {
    return;
  }
  boardList.value = result.data;
};
loadBardList();

// Editor type 0: html editor 1:markdown
const editorType = ref(null);
const changeEditor = () => {
  proxy.Confirm("The toggle editor will empty the content being edited. Are you sure you want to toggle?", () => {
    editorType.value = editorType.value == 0 ? 1 : 0;
    formData.value.content = "";
    formData.value.markdownContent = "";
    proxy.VueCookies.set("editorType", editorType.value, -1);
  });
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
      .post-editor-title {
        display: flex;
        justify-content: space-between;
        .change-editor-type {
          .iconfont {
            cursor: pointer;
            color: var(--link);
            font-size: 14px;
          }
        }
      }
    }
    .post-setting {
      margin-left: 10px;
      width: 450px;
      .setting-inner {
        max-height: calc(100vh - 120px);
        overflow: auto;
        .el-form-item {
          align-items:flex-start;
        }
      }
      .tips {
        color: #797979;
        font-size: 13px;
      }
    }
  }
}
</style>