<template>
  <div>
    <Dialog
        :show="dialogConfig.show"
        :title="dialogConfig.title"
        :buttons="dialogConfig.buttons"
        width="700px"
        :showCancel="false"
        @close="dialogConfig.show = false"
    >
      <div class="comment-list">
        <div class="comment-item" v-for="item in commentList">
          <div class="p-comment-item">
            <avatar :userId="item.userId" :width="40"></avatar>
            <div class="content-info">
              <a
                  target="_blank"
                  class="a-link"
                  :href="proxy.globalInfo.webDomain + 'user/' + item.userId"
              >{{ item.nickName }}</a
              >
              <div v-html="item.content" class="comment-content"></div>
              <div v-if="item.imgPath">
                <CommentImage
                    :src="item.imgPath.replace('.', '_.')"
                    :imgList="[proxy.globalInfo.imageUrl + item.imgPath]"
                ></CommentImage>
              </div>
              <div class="post-info">
                Post：{{ item.postTime }}&nbsp;·&nbsp;{{
                  item.userIpAddress
                }}&nbsp;&nbsp;Like：{{ item.goodCount }}
              </div>
              <div v-if="item.children">
                <div class="s-comment-item" v-for="sub in item.children">
                  <avatar :userId="sub.userId" :width="40"></avatar>
                  <div class="content-info">
                    <a
                        target="_blank"
                        class="a-link"
                        :href="proxy.globalInfo.webDomain + 'user/' + sub.userId"
                    >{{ sub.nickName }}</a
                    >
                    <span v-if="sub.replyUserId">
                      Reply
                      <a
                          target="_blank"
                          class="a-link"
                          :href="
                          proxy.globalInfo.webDomain + 'user/' + sub.replyUserId
                        "
                      >{{ sub.replyNickName }}</a
                      >
                    </span>
                    <div v-html="sub.content" class="comment-content"></div>
                    <div class="post-info">
                      Post：{{ sub.postTime }}&nbsp;·&nbsp;{{
                        sub.userIpAddress
                      }}
                      Like：{{ sub.goodCount }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="commentList.length == 0">No Comment</div>
    </Dialog>
  </div>
</template>

<script setup>
import CommentImage from "./CommentImage.vue";
import { ref, reactive, getCurrentInstance } from "vue";
const { proxy } = getCurrentInstance();

const dialogConfig = reactive({
  show: false,
  title: "View comments",
  buttons: [
    {
      text: "Close",
      click: (e) => {
        dialogConfig.show = false;
      },
    },
  ],
});

const api = {
  loadComment: "/forum/loadComment4Article",
};

const commentList = ref([]);
const show = async (articleId) => {
  dialogConfig.show = true;
  let result = await proxy.Request({
    url: api.loadComment,
    params: {
      articleId: articleId,
    },
  });
  if (!result) {
    return;
  }
  commentList.value = result.data;
};
defineExpose({ show });
</script>

<style lang="scss" scoped>
.comment-list {
  .comment-item {
    margin-top: 10px;
    border-bottom: 1px solid #ddd;
    padding: 10px 0px;
    .p-comment-item {
      display: flex;
    }
    .content-info {
      margin-left: 5px;
    }
    .comment-content {
      margin: 5px 0px;
    }
    .post-info {
      font-size: 12px;
      color: rgb(135, 130, 130);
    }
    .s-comment-item {
      display: flex;
      margin-top: 10px;
    }
  }
}
</style>
