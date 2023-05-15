<template>
    <div class="article-item">
        <div class="article-item-inner">
            <div class="article-body">
                <div class="user-info">
                    <Avatar :userId="data.userId" :width="30"></Avatar>
                    <router-link to="'/users/' + data.userId">{{ data.nickName }}</router-link>
                    <el-divider direction="vertical"></el-divider>
                    <div class="post-time">{{ data.postTime }}</div>
                    <div class="address">{{ data.userIpAddress }}</div>
                    <el-divider direction="vertical"></el-divider>
                    <router-link :to="'/'">{{ data.pBoardName }}</router-link>
                    <template v-if="data.boardName">
                        <el-divider direction="vertical"></el-divider>
                        <router-link :to="'/'">{{ data.boardName }}</router-link>
                    </template>
                </div>
                <router-link to="/">{{data.title}}</router-link>
                <div class="summary">{{data.summary}}</div>
                <div class="article-info">
                    <span class="iconfont icon-eye-solid">
                        {{data.readCount==0 ? "Read" : data.readCount}}
                    </span>

                    <span class="iconfont icon-good">
                        {{data.goodCount==0 ? "Like" : data.goodCount}}
                    </span>

                    <span class="iconfont icon-comment">
                        {{data.commentCount==0 ? "Comment" : data.commentCount}}
                    </span>

                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import Avatar from "@/components/Avatar.vue";

const props = defineProps({
    data: {
        type: Object
    },
});
</script>

<style lang="scss">
.article-item {
  .article-item-inner {
    .article-body {
      .user-info {
        display: flex;
      }
    }
  }
}
</style>