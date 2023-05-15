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
                    <span class="menu-item">All</span>
                    <template v-for="board in boardList">
                        <el-popover
                                placement="bottom-start"
                                :width="300"
                                trigger="hover" v-if="board.children.length >0"
                        >
                            <template #reference>
                                <span class="menu-item">{{ board.boardName }}</span>
                            </template>
                            <div class="sub-board-list">
                                <span class="sub-board"
                                      v-for="subBoard in board.children">{{ subBoard.boardName }}</span>
                            </div>
                        </el-popover>
                        <span class="menu-item" v-else>{{board.boardName}}</span>
                    </template>

                </div>

                <!-- login and register panel -->
                <div class="user-info-panel">
                    <div class="op-btn">
                        <el-button type="primary" class="op-btn">
                            Post<span class="= iconfont icon-add"></span>
                        </el-button>
                        <el-button type="primary" calss="op-btn">
                            Search<span class="= iconfont icon-search"></span>
                        </el-button>
                    </div>

                    <!--display user Info-->
                    <template v-if="userInfo.userId">
                        <div class="message-info">
                            <el-dropdown>
                                <el-badge :value="12" class="item">
                                    <div class="iconfont icon-message"></div>
                                </el-badge>
                                <template #dropdown>
                                    <el-dropdown-menu>
                                        <el-dropdown-item>Reply me</el-dropdown-item>
                                        <el-dropdown-item>Like me</el-dropdown-item>
                                        <el-dropdown-item>Download mine</el-dropdown-item>
                                        <el-dropdown-item>Like my comment</el-dropdown-item>
                                        <el-dropdown-item>System Message</el-dropdown-item>
                                    </el-dropdown-menu>
                                </template>
                            </el-dropdown>
                        </div>

                        <div class="user-info">
                            <el-dropdown>
                                <avatar :userId="userInfo.userId" :width="50"></avatar>
                                <template #dropdown>
                                    <el-dropdown-menu>
                                        <el-dropdown-item>My Page</el-dropdown-item>
                                        <el-dropdown-item>Logout</el-dropdown-item>
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
            <router-view/>
        </div>
        <!-- login and register -->
        <LoginAndRegister ref="loginRegisterRef"></LoginAndRegister>
    </div>
</template>

<script setup>
import LoginAndRegister from "./LoginAndRegister.vue";
import {ref, reactive, getCurrentInstance, onMounted, watch} from "vue";
import {useRouter, useRoute} from "vue-router";
import {useStore} from "vuex";

const {proxy} = getCurrentInstance();
const router = useRouter();
const route = useRoute();
const store = useStore();

const api = {
    getUserInfo: "/getUserInfo",
    loadBoard: "/board/loadBoard",
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
        document.documentElement.getScrollTop ||
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

</script>

<style lang="scss">
.header {
  top:0px;
  width: 100%;
  position: fixed;
  box-shadow: 0 2px 6px 0 #ddd;

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
        font-size: 35px;
      }
    }

    .menu-panel {
      flex: 1;
        .menu-item{
            margin-left: 20px;
            cursor: pointer;
        }
    }

    .user-info-panel {
      width: 345px;
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
        .icon-message {
          font-size: 20px;
          color: rgb(147, 147, 147);
        }

        margin-left: 5px;
        margin-right: 25px;
        cursor: pointer;
      }
    }
  }
}
.sub-board-list {
    display:flex;
    flex-wrap:wrap;
    .sub-board{
        padding:0px 10px;
        border-radius:20px;
        margin-right: 10px;
        background: rgb(239,239,239);
        border: 1px solid #ddd;
        color: rgb(119,118,118);
        margin-top: 10px;
        cursor: pointer;
    }
    .sub-board:hover{
        color: var(--link);
    }
}
.body-content{
    margin-top: 60px;
    position:relative;

}
</style>
