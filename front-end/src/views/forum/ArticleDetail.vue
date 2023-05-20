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
                {{ articleInfo.readCount == 0 ? "阅读" : articleInfo.readCount }}
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
          <div class="size item">{{ attachment.fileSize }}</div>
          <div class="item">Required<span class="integral">{{ attachment.integral }}</span>points</div>
          <div class="download-count item">Downloaded{{ attachment.downloadCount }}times</div>
          <div class="download-btn item">
            <el-button type="primary" size="small">download</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
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
};
// article content
const articleInfo = ref({});
// article attachment
const attachment = ref([]);
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
};

onMounted(() => {
  getArticleDetail(route.params.articleId);
});

</script>

<style lang="scss">

.article-detail-body {
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
        font-weight: bold;
      }

      .user-info {
        margin-top: 15px;
        display: flex;
        padding-bottom: 10px;
        border-bottom: 1px solid #ddd;

        .user-info-detail {
          margin-left: 10px;

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

    .attachment-panel{
      background: #fff;
      margin-top: 20px;
      padding: 20px;
      .title{
        font-size:16px;
      }
      .attachment-info{
        display: flex;
        align-items: center;
      }
    }
  }
}


</style>
