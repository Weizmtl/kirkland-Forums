<template>
  <div>
    <div class="header" v-if="showHeader">
      <div class="header-content" :style="{ width: proxy.globalInfo.bodyWidth + 'px' }">
        <!-- logo -->
        <router-link to="/" class="logo">
                    <span v-for="item in logoInfo" :style="{ color: item.color }">{{ item.letter }}
                    </span>
        </router-link>

        <!-- subsection panel -->
        <div class="menu-panel">
          <router-link :class="['menu-item home',
              activePboardId == undefined ? 'active' : '',]" to="/">Home
          </router-link>
          <template v-for="board in boardList">
            <el-popover
                placement="bottom-start"
                :width="300"
                trigger="hover" v-if="board.children.length >0"
            >
              <template #reference>
                <span
                    :class="[
                    'menu-item',
                    board.boardId == activePboardId ? 'active' : '',]"
                    @click="boardClickHandler(board)">{{ board.boardName }}</span>
              </template>
              <div class="sub-board-list">
                <span :class="['sub-board',subBoard.boardId == activeBoardId ? 'active' : '',]"
                      v-for="subBoard in board.children"
                      @click="subBoardClickHandler(subBoard)">{{ subBoard.boardName }}</span>
              </div>
            </el-popover>
            <span :class="[
                    'menu-item',
                    board.boardId == activePboardId ? 'active' : '',]" v-else
                  @click="boardClickHandler(board)">{{ board.boardName }}</span>
          </template>

        </div>

        <!-- login and register panel -->
        <div class="user-info-panel">
          <div class="op-btn">
            <el-button type="primary" class="op-btn" @click="newPost">
              Post<span class="= iconfont icon-add"></span>
            </el-button>
            <el-button type="primary" calss="op-btn" @click="goSearch">
              Search<span class="= iconfont icon-search"></span>
            </el-button>
          </div>

          <!--display user Info-->
          <template v-if="userInfo.userId">
            <div class="message-info">
              <el-dropdown>
                <el-badge :value="messageCountInfo.total"
                          class="item"
                          :hidden="
                    messageCountInfo.total == null ||
                    messageCountInfo.total == 0
                  ">
                  <div class="iconfont icon-message"></div>
                </el-badge>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item
                        @click="gotoMessage('reply')"
                        class="message-item">
                      <span class="text">Reply me</span>
                      <span
                          class="count-tag"
                          v-if="messageCountInfo.reply > 0"
                      >{{
                          messageCountInfo.reply > 99
                              ? "99+"
                              : messageCountInfo.reply
                        }}</span>
                    </el-dropdown-item>
                    <el-dropdown-item
                        @click="gotoMessage('likePost')"
                        class="message-item">
                      <span class="text">Like me</span>
                      <span
                          class="count-tag"
                          v-if="messageCountInfo.likePost > 0"
                      >{{
                          messageCountInfo.likePost > 99
                              ? "99+"
                              : messageCountInfo.likePost
                        }}</span>
                    </el-dropdown-item>
                    <el-dropdown-item
                        @click="gotoMessage('downloadAttachment')"
                        class="message-item">
                      <span class="text">Download mine</span>
                      <span
                          class="count-tag"
                          v-if="messageCountInfo.downloadAttachment > 0"
                      >{{
                          messageCountInfo.downloadAttachment > 99
                              ? "99+"
                              : messageCountInfo.downloadAttachment
                        }}</span>
                    </el-dropdown-item>
                    <el-dropdown-item
                        @click="gotoMessage('likeComment')"
                        class="message-item">
                      <span class="text">Like my comment</span>
                      <span class="count-tag" v-if="messageCountInfo.sys > 0">{{
                          messageCountInfo.sys > 99 ? "99+" : messageCountInfo.sys
                        }}</span>
                    </el-dropdown-item>
                    <el-dropdown-item
                        @click="gotoMessage('sys')"
                        class="message-item">
                      <span class="text">System Message</span>
                      <span
                          class="count-tag"
                          v-if="messageCountInfo.likeComment > 0"
                      >{{
                          messageCountInfo.likeComment > 99
                              ? "99+"
                              : messageCountInfo.likeComment
                        }}</span>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>

            <div class="user-info">
              <el-dropdown>
                <avatar
                    :userId="userInfo.userId"
                    :width="50"
                    :addLink="false">
                </avatar>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item @click="gotoUcenter(userInfo.userId)">My Page</el-dropdown-item>
                    <el-dropdown-item @click="logout">Logout</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>

          </template>


          <el-button-group :style="{ 'margin-left': '10px' }" v-else>
            <el-button type="primary" plain @click="loginAndRegister(1)"
            >Login
            </el-button>
            <el-button type="primary" plain @click="loginAndRegister(0)"
            >Register
            </el-button>
          </el-button-group>
        </div>
      </div>
    </div>
    <div class="body-content">
      <router-view />
    </div>
    <div class="footer">
      <div
          class="footer-content"
          :style="{ width: proxy.globalInfo.bodyWidth + 'px' }"
      >
        <el-row>
          <el-col :span="6" class="item">
            <div class="logo">
              <div class="logo-letter">
                <span v-for="item in logoInfo" :style="{ color: item.color }">{{
                    item.letter
                  }}</span>
              </div>
              <div class="info">stable simple community</div>
            </div>
          </el-col>
          <el-col :span="6" class="item">
            <div class="title">Site-related</div>
            <div>
              <a href="https://www.ville.kirkland.qc.ca/">Kirkland</a>
            </div>
            <div><a href="https://www.pointe-claire.ca/en/">Pointe Claire</a></div>
            <div><a href="https://www.beaconsfield.ca/en">Beaconsfield</a></div>
          </el-col>
          <el-col :span="6" class="item">
            <div class="title">Blogroll
            </div>
          </el-col>
          <el-col :span="6" class="item">
            <div class="title">Follow webmaster</div>
          </el-col>
        </el-row>
      </div>
    </div>
    <!-- login and register -->
    <LoginAndRegister ref="loginRegisterRef"></LoginAndRegister>
    <!--back to top-->
    <el-backtop :right="100" :bottom="100"></el-backtop>
  </div>
</template>

<script setup>
import LoginAndRegister from "./LoginAndRegister.vue";
import {ref, reactive, getCurrentInstance, onMounted, watch} from "vue";
import {useRouter} from "vue-router";
import {useStore} from "vuex";

const {proxy} = getCurrentInstance();
const router = useRouter();

const store = useStore();

const api = {
  getUserInfo: "/getUserInfo",
  loadBoard: "/board/loadBoard",
  loadMessageCount: "/ucenter/getMessageCount",
  logout: "/logout",
  getSysSetting: "/getSysSetting",
}

const logoInfo = ref([
  {
    letter: "K",
    color: "#3285FF",
  },
  {
    letter: "i",
    color: "#FB3624",
  },
  {
    letter: "r",
    color: "#FFBA02",
  },
  {
    letter: "k",
    color: "#3285FF",
  },
  {
    letter: "l",
    color: "#FB3624",
  },
  {
    letter: "a",
    color: "#FFBA02",
  },
  {
    letter: "n",
    color: "#3285FF",
  },
  {
    letter: "d",
    color: "#FB3624",
  },
]);

const showHeader = ref(true);

//get the height of the scrollbar
const getScrollTop = () => {
  let scrollTop =
      document.documentElement.scrollTop ||
      window.pageYOffset ||
      document.body.scrollTop;
  return scrollTop;
};

const initScroll = () => {
  let initScrollTop = getScrollTop();
  let scrollType = 0;
  window.addEventListener("scroll", () => {
    let currentScrollTop = getScrollTop();
    if (currentScrollTop > initScrollTop) {
      // scroll down
      scrollType = 1;
    } else {
      scrollType = 0;
    }
    initScrollTop = currentScrollTop;
    console.log(currentScrollTop);
    if (scrollType == 1 && currentScrollTop > 100) {
      showHeader.value = false;
    } else {
      showHeader.value = true;
    }
  });
};

//login and register
const loginRegisterRef = ref();
const loginAndRegister = (type) => {
  loginRegisterRef.value.showPanel(type);
};

onMounted(() => {
  initScroll();
  getUserInfo();
});

//get user info
const getUserInfo = async () => {
  let result = await proxy.Request({
    url: api.getUserInfo,
  });
  if (!result) {
    return;
  }
  store.commit("updateLoginUserInfo", result.data);
};
//Obtain forums section info.
const boardList = ref([]);
const loadBoard = async () => {
  let result = await proxy.Request({
    url: api.loadBoard,
  });
  if (!result) {
    return;
  }
  boardList.value = result.data;
  store.commit("saveBoardList", result.data);
};
loadBoard();


//Listens for login user info.
const userInfo = ref({});
watch(
    () => store.state.loginUserInfo,
    (newVal, oldVal) => {
      if (newVal != undefined && newVal != null) {
        userInfo.value = newVal;
      } else {
        userInfo.value = {};
      }
    },
    {immediate: true, deep: true}
);
//Listen to whether the login box is displayed
watch(() => store.state.showLogin, (newVal, oldVal) => {
  if (newVal) {
    loginAndRegister(1);
  }
}, {immediate: true, deep: true});

//Plate click
const boardClickHandler = (board) => {
  router.push(`/forum/${board.boardId}`);
}

//Secondary plate
const subBoardClickHandler = (subBoard) => {
  router.push(`/forum/${subBoard.pBoardId}/${subBoard.boardId}`);
}

//currently selected plate
const activePboardId = ref(0);
watch(
    () => store.state.activePboardId,
    (newVal, oldVal) => {
      if (newVal !== 0) {
        activePboardId.value = newVal;
      }
    },
    {immediate: true, deep: true}
);

const activeBoardId = ref(0);
watch(
    () => store.state.activeBoardId,
    (newVal, oldVal) => {
      activeBoardId.value = newVal;
    },
    {immediate: true, deep: true}
);

//Post article
const newPost = () => {
  if (!store.getters.getLoginUserInfo) {
    loginAndRegister();
  } else {
    router.push('/newPost');
  }
}

const gotoUcenter = (userId) => {
  router.push(`/user/${userId}`);
};

//message correlation methods
const gotoMessage = (type) => {
  router.push(`/user/message/${type}`);
};



const messageCountInfo = ref({});
const loadMessageCount = async () => {
  let result = await proxy.Request({
    url: api.loadMessageCount,
  });
  if (!result) {
    return;
  }
  messageCountInfo.value = result.data;
  store.commit("updateMessageCountInfo", result.data);
};

watch(
    () => store.state.messageCountInfo,
    (newVal, oldVal) => {
      messageCountInfo.value = newVal || {};
    },
    { immediate: true, deep: true }
);

watch(
    () => store.state.loginUserInfo,
    (newVal, oldVal) => {
      if (newVal) {
        loadMessageCount();
      }
    },
    { immediate: true, deep: true }
);

//Logout
const logout = () => {
  proxy.Confirm("Do you want logout?", async () => {
    let result = await proxy.Request({
      url: api.logout,
    });
    if (!result) {
      return;
    }
    store.commit("updateLoginUserInfo", null);
  });
};

//Get system configuration
const loadSysSetting = async () => {
  let result = await proxy.Request({
    url: api.getSysSetting,
  });
  if (!result) {
    return;
  }
  store.commit("saveSysSetting", result.data);
};
const goSearch = () => {
  router.push("/search");
};

</script>

<style lang="scss">
.header {
  top: 0px;
  width: 100%;
  position: fixed;
  box-shadow: 0 2px 6px 0 #ddd;
  z-index: 1000;
  background: #fff;

  .header-content {
    margin: 0px auto;
    align-items: center;
    height: 60px;
    display: flex;
    align-items: center;

    .logo {
      display: block;
      text-decoration: none;
      margin-right: 5px;

      span {
        font-size: 30px;
      }
    }

    .menu-panel {
      flex: 1;

      .menu-item {
        margin-left: 20px;
        cursor: pointer;
      }

      .home {
        text-decoration: none;
        color: #000;
      }

      .active {
        color: var(--link);
      }
    }

    .user-info-panel {
      width: 400px;
      display: flex;
      align-items: center;

      .op-btn {
        .iconfont {
          margin-left: 5px;
        }

        .el-button + .el-button {
          margin-left: 5px;
        }
      }

      .message-info {
        margin-left: 5px;
        margin-right: 25px;
        cursor: pointer;

        .icon-message {
          font-size: 25px;
          color: rgb(147, 147, 147);
        }
      }
    }
  }
}

.sub-board-list {
  display: flex;
  flex-wrap: wrap;

  .sub-board {
    padding: 0px 10px;
    border-radius: 20px;
    margin-right: 10px;
    background: rgb(239, 239, 239);
    border: 1px solid #ddd;
    color: rgb(119, 118, 118);
    margin-top: 10px;
    cursor: pointer;
  }

  .sub-board:hover {
    color: var(--link);
  }

  .active {
    background: var(--link);
    color: #fff;
  }

  .active:hover {
    color: #fff;
  }
}

.body-content {
  margin-top: 60px;
  position: relative;
  min-height: calc(100vh - 210px);
}

.message-item {
  display: flex;
  justify-content: space-around;
  .text {
    flex: 1;
  }
  .count-tag {
    height: 15px;
    line-height: 15px;
    min-width: 20px;
    display: inline-block;
    background: #f56c6c;
    border-radius: 10px;
    font-size: 13px;
    text-align: center;
    color: #fff;
    margin-left: 10px;
  }
}

.footer {
  background: #e9e9e9;
  height: 140px;
  margin-top: 10px;
  .footer-content {
    margin: 0px auto;
    padding-top: 10px;
    .item {
      text-align: left;
      .title {
        font-size: 18px;
        margin-bottom: 10px;
      }
      a {
        font-size: 14px;
        text-decoration: none;
        color: var(--text2);
        line-height: 25px;
      }
    }

    .logo {
      .logo-letter {
        font-size: 30px;
      }
      .info {
        margin-top: 10px;
        color: rgb(93, 91, 91);
      }
    }
  }
}
</style>