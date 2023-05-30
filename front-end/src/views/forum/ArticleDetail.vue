<template>
  <div class="container-body article-detail-body"
       :style="{ width:proxy.globalInfo.bodyWidth + 'px' }"
       v-if="Object.keys(articleInfo).length > 0">
    <!--    Plate navigation-->
    <div class="board-info">
      <router-link :to="`/forum/${articleInfo.pBoardId}`" class="a-link">{{
          articleInfo.pBoardName
        }}
      </router-link>
      <span class="iconfont icon-right"></span>
      <template v-if="articleInfo.boardId">
        <router-link
            class="a-link"
            :to="`/forum/${articleInfo.pBoardId}/${articleInfo.boardId}`"
        >{{ articleInfo.boardName }}
        </router-link>
        <span class="iconfont icon-right"></span>
      </template>
      <span>{{ articleInfo.title }}</span>
    </div>

    <!--    Article details-->
    <div class="details-container" :style="{width:proxy.globalInfo.bodyWidth - 300 + 'px'}">

      <div class="article-detail">
        <!--        Title-->
        <div class="title">{{ articleInfo.title }}</div>
        <!--        user info-->
        <div class="user-info">
          <Avatar :userId="articleInfo.userId" :width="50"></Avatar>

          <div class="user-info-detail">
            <router-link class="nick-name"
                         :to="`/user/${articleInfo.userId}`">{{ articleInfo.nickName }}
            </router-link>
            <div class="time-info">
              <span>{{ articleInfo.postTime }}</span>
              <span class="address">&nbsp;·&nbsp;{{ articleInfo.userIpAddress }}</span>
              <span class="iconfont icon-eye-solid">
                {{ articleInfo.readCount == 0 ? "Read" : articleInfo.readCount }}
              </span>
            </div>
          </div>
        </div>
        <!--   article Content-->
        <div class="detail" id="detail" v-html="articleInfo.content"></div>
      </div>
      <!--        attachment-->
      <div class="attachment-panel" v-if="attachment" id="view-attachment">
        <div class="title">Attachment</div>
        <div class="attachment-info">
          <div class="iconfont icon-zip item" item></div>
          <div class="file-name item">{{ attachment.fileName }}</div>
          <div class="size item">{{ proxy.Utils.sizeToStr(attachment.fileSize) }}</div>
          <div class="item">Required<span class="integral">{{ attachment.integral }}</span>points</div>
          <div class="download-count item">Downloaded {{ attachment.downloadCount }} times</div>
          <div class="download-btn item">
            <el-button type="primary" size="small" @click="downloadAttachment(attachment.fileId)">
              Download
            </el-button>
          </div>
        </div>
      </div>
      <!--        comment-->
      <div class="comment-panel" id="view-comment">
        <CommentList
            v-if="articleInfo.articleId"
            :articleId="articleInfo.articleId"
            :articleUserId="articleInfo.userId">
            @updateCommentCount="updateCommentCount">
        </CommentList>
      </div>
    </div>
      <!--menu-->
      <div class="toc-panel">
        <div class="top-containner">
          <div class="toc-title">menu</div>
          <div class="toc-list">
            <template v-if="tocArray.length == 0">
              <div class="no-toc">not find menu</div>
            </template>
            <template v-else>
              <div v-for="toc in tocArray">
              <span
                  @click="gotoAnchor(toc.id)"
                  :class="['toc-item', toc.id == anchorId ? 'active' : '']"
                  :style="{ 'padding-left': toc.level * 15 + 'px' }"
              >{{ toc.title }}</span
              >
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
  <!--      Left side shortcut-->
  <div class="quick-panel" :style="{left :quickPanelLeft + 'px'}">
    <!--    Like shortcut-->
    <el-badge :value="articleInfo.goodCount" type="info" :hidden="!articleInfo.goodCount >0">
      <div class="quick-item" @click="doLikeHandler">
        <span :class="['iconfont icon-good', haveLike ? 'have-like' : '']"></span>
      </div>
    </el-badge>
    <!--      comment shortcut-->
    <el-badge :value="articleInfo.commentCount" type="info" :hidden="!articleInfo.commentCount >0">
      <div class="quick-item" @click="goToPosition('view-comment')">
        <span class="iconfont icon-comment"></span>
      </div>
    </el-badge>
    <!--    attachment shortcut-->
    <div class="quick-item" @click="goToPosition('view-attachment')">
      <span class="iconfont icon-attachment"></span>
    </div>
    <!--preview image-->
    <ImageViewer ref="imageViewerRef" :imageList="previewImgList"></ImageViewer>
  </div>
</template>

<script setup>
import hljs from "highlight.js";
import "highlight.js/styles/atom-one-light.css";
import CommentList from "./CommentList.vue";
import {ref, reactive, getCurrentInstance, onMounted, nextTick, onUnmounted, watch,} from "vue";
import {useRouter, useRoute} from "vue-router";
import {useStore} from "vuex";
import Avatar from "@/components/Avatar.vue";

const {proxy} = getCurrentInstance();
const router = useRouter();
const route = useRoute();
const store = useStore();

const api = {
  getArticleDetail: "/forum/getArticleDetail",
  doLike: "/forum/doLike",
  getUserDownloadInfo: "/forum/getUserDownloadInfo",
  attachmentDownload: "/api/forum/attachmentDownload",

};
const currentUserInfo = ref({});
// article content
const articleInfo = ref({});
// article attachment
const attachment = ref([]);
//Whether clicked the like
const haveLike = ref(false);

const getArticleDetail = async (articleId) => {
  let result = await proxy.Request({
    url: api.getArticleDetail,
    params: {
      articleId: articleId,
    },
  });
  if (!result) {
    return;
  }
  articleInfo.value = result.data.forumArticle;
  attachment.value = result.data.attachment;
  haveLike.value = result.data.haveLike;
  store.commit("setActivePboardId", result.data.forumArticle.pBoardId);
  store.commit("setActiveBoardId", result.data.forumArticle.boardId);

  //image preview
  imagePreview();
  //code highlighting
  highlightCode();
};

onMounted(() => {
  getArticleDetail(route.params.articleId);
});

// Left side shortcut
const quickPanelLeft = (window.innerWidth - proxy.globalInfo.bodyWidth) / 2 - 110;

const goToPosition = (domId) => {
  document.querySelector("#" + domId).scrollIntoView();
};

//like
const doLikeHandler = async () => {
  if (!store.getters.getLoginUserInfo) {
    store.commit("showLogin", true);
    return;
  }
  let result = await proxy.Request({
    url: api.doLike,
    params: {
      articleId: articleInfo.value.articleId,
    },
  });
  if (!result) {
    return;
  }
  haveLike.value = !haveLike.value;
  let goodCount = 1;
  if (!haveLike.value) {
    goodCount = -1;
  }
  articleInfo.value.goodCount = articleInfo.value.goodCount + goodCount;
};

//download attachment
const downloadAttachment = async (fileId) => {
  if (!currentUserInfo.value) {
    store.commit("showLogin", true);
    return;
  }
  // 0 credit
  if (
      attachment.value.integral == 0 ||
      currentUserInfo.value.userId == articleInfo.value.userId
  ) {
    downloadDo(fileId);
    return;
  }

  //Obtain user download information
  let result = await proxy.Request({
    url: api.getUserDownloadInfo,
    params: {
      fileId: fileId,
    },
  });
  if (!result) {
    return;
  }
  //Determine whether the user has downloaded it already.
  if (result.data.haveDownload) {
    downloadDo(fileId);
    return;
  }

  //Determine whether the user credits are enough
  if (result.data.userIntegral < attachment.value.integral) {
    proxy.Message.warning("You don't have enough credits to download");
    return;
  }

  proxy.Confirm(
      `you have ${result.data.userIntegral}credits,
      The current download will be deducted${attachment.value.integral}credits,
      do you want to download`,
      () => {
        downloadDo(fileId);
      }
  );
};

const downloadDo = (fileId) => {
  document.location.href = api.attachmentDownload + "?fileId=" + fileId;
  attachment.value.downloadCount = attachment.value.downloadCount + 1;
};
// article image preview
const imageViewerRef = ref(null);
const previewImgList = ref([]);
const imagePreview = () => {
  nextTick(() => {
    const imageNodeList = document
        .querySelector("#detail")
        .querySelectorAll("img");
    const imageList = [];
    imageNodeList.forEach((item, index) => {
      const src = item.getAttribute("src");
      imageList.push(src);
      item.addEventListener("click", () => {
        imageViewerRef.value.show(index);
      });
    });
    previewImgList.value = imageList;
  });
};

//Code highlighting
const highlightCode = () => {
  nextTick(() => {
    let blocks = document.querySelectorAll("pre code");
    blocks.forEach((item) => {
      hljs.highlightBlock(item);
    });
  });
};

// update comment quantity
const updateCommentCount = (commentCount) => {
  articleInfo.value.commentCount = commentCount;
};

//obtain menu
const tocArray = ref([]);

</script>

<style lang="scss">

.article-detail-body {
  position: relative;

  .board-info {
    line-height: 40px;

    .icon-right {
      margin: 0px 10px;
    }
  }

  .details-container {
    .article-detail {
      background: #fff;
      padding: 15px;

      .title {
        font-weight: bolder;
      }

      .user-info {
        margin-top: 15px;
        display: flex;
        padding-bottom: 10px;
        border-bottom: 1px solid #ddd;

        .user-info-detail {
          margin-left: 10px;

          .nick-name {
            text-decoration: none;
            color: #4e5969;
            font-size: 15px;
          }

          .nick-name:hover {
            color: var(--link);
          }

          .time-info {
            margin-top: 5px;
            font-size: 13px;
            color: var(--text2);

            .iconfont {
              margin-left: 10px;
            }

            .iconfont::before {
              padding-right: 3px;
            }

            .btn-edit {
              .iconfont {
                font-size: 14px;
              }
            }
          }
        }
      }

      .detail {
        line-height: 22px;

        a {
          text-decoration: none;
          color: var(--link);
        }

        img {
          max-width: 90%;
          cursor: pointer;
        }
      }
    }

    .attachment-panel {
      background: #fff;
      margin-top: 20px;
      padding: 20px;

      .title {
        font-size: 16px;
      }

      .attachment-info {
        display: flex;
        align-items: center;
        color: #9f9f9f;
        margin-top: 10px;

        .item {
          margin-right: 10px;
        }

        .icon-zip {
          font-size: 20px;
          color: #6ca1f7;
        }

        .file-name {
          color: #6ca1f7;
        }

        .integral {
          color: red;
          padding: 0px 5px;
        }
      }
    }

    .comment-panel {
      margin-top: 20px;
      background: #fff;
      padding:20px;
    }


  }
}

.quick-panel {
  position: fixed;
  width: 50px;
  top: 150px;
  text-align: center;

  .el-badge__content.is-fixed {
    top: 5px;
    right: 15px;
  }

  .quick-item {
    width: 50px;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    background: #fff;
    margin-bottom: 30px;
    cursor: pointer;

    .iconfont {
      font-size: 20px;
      color: var(--text2);
    }

    .have-like {
      color: #DD4A68;
    }
  }
}
.toc-panel {
  position: absolute;
  top: 45px;
  right: 0px;
  width: 285px;

  .top-containner {
    width: 285px;
    position: fixed;
    background: #fff;

    .toc-title {
      border-bottom: 1px solid #ddd;
      padding: 10px;
    }

    .toc-list {
      max-height: calc(100vh - 200px);
      overflow: auto;
      padding: 5px;

      .no-toc {
        text-align: center;
        color: #5f5d5d;
        line-height: 40px;
        font-size: 13px;
      }

      .toc-item {
        cursor: pointer;
        display: block;
        line-height: 35px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        color: #555666;
        border-radius: 3px;
        font-size: 14px;
        border-left: 2px solid #fff;
      }

      .toc-item:hover {
        background: #eeeded;
      }

      .active {
        border-left: 2px solid #6ca1f7;
        border-radius: 0px 3px 3px 0px;
        background: #eeeded;
      }
    }
  }
}

</style>
