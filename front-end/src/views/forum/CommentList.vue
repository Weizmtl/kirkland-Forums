<template>
  <div>
    <div class="comment-body">
      <div class="comment-title">
        <div class="title">
          Comment<span class="count">0</span>
        </div>
        <div class="tab">
        <span
            @click="orderChange(0)"
            :class="['tab-item', orderType == 0 ? 'active' : '']"
        >HOT</span
        >
          <el-divider direction="vertical"/>
          <span
              @click="orderChange(1)"
              :class="['tab-item', orderType == 1 ? 'active' : '']"
          >Newest</span
          >
        </div>
      </div>
    </div>
<!--    post comment-->
    <div class="comment-form-panel">
      <CommentPost
          :articleId="articleId"
          :pCommentId="0"
          :avatarWidth="50"
          :userId="currentUserInfo.userId"
          :showInsertImg="currentUserInfo.userId != null"
          @postCommentFinish="postCommentFinish"
      ></CommentPost>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  articleId: {
    type: String,
  },
  articleUserId: {
    type: String,
  },
});

//current user info
const currentUserInfo = ref({});
watch(
    () => store.state.loginUserInfo,
    (newVal, oldVal) => {
      currentUserInfo.value = newVal || {};
    },
    { immediate: true, deep: true }
);
</script>

<style lang="scss">
.comment-body {
  .comment-title {
    display: flex;
    align-items: center;

    .title {
      font-size: 16px;

      .count {
        font-size: 14px;
        padding: 0px 10px;
      }
    }
  }
}
</style>