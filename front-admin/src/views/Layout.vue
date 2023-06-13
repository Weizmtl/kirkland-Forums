<template>
  <div class="layout-body">
    <el-container>
      <el-aside class="aside" :style="{ width: asideWidth + 'px' }">
      </el-aside>
      <<div class="logo">
      <span v-if="!menuCollapse">KKbbs back-end Management</span>
    </div>
      <div class="menu-panel">
        <el-menu
            :default-openeds="defaultOpeneds"
            :collapse-transition="false"
            :collapse="menuCollapse"
            class="el-menu-vertical-demo"
            default-active="2"
            background-color="#3d3c4a"
            text-color="#fff"
            active-text-color="#fff"
            router
            :defaultActive="defaultActive"
        >
        </el-menu>
      </div>
    </el-container>
  </div>
</template>

<script>
import { useRoute, useRouter } from "vue-router";
import { ref, watch } from "vue";
const router = useRouter();
const route = useRoute();
//aside width
const asideWidth = ref(250);

//system menu
const menuList = [
  {
    menuName: "content management",
    icon: "icon-article",
    path: "/forum",
    children: [
      {
        menuName: "article management",
        path: "/forum/article",
      },
      {
        menuName: "comment management",
        path: "/forum/comment",
      },
      {
        menuName: "form management",
        path: "/forum/board",
      },
    ],
  },
  {
    menuName: "user management",
    icon: "icon-user",
    path: "/user",
    children: [
      {
        menuName: "user list",
        path: "/user/list",
      },
    ],
  },
  {
    menuName: "configuration",
    icon: "icon-settings",
    path: "/settings",
    children: [
      {
        menuName: "system configuration",
        path: "/settings/sys",
      },
    ],
  },
];
</script>

<style lang="scss">
.layout-body {
  .aside {
    background: #3d3c4a;

    .logo {
      display: flex;
      height: 50px;
      color: #fff;
      background: #191828;
      align-items: center;
      font-size: 18px;
      padding-left: 5px;
    }

    .menu-panel {
      height: calc(100vh - 50px);

      .menu-name {
        padding-left: 10px;
      }

      //Remove border
      .el-menu {
        border-right: none;
      }

      //Remove the color of each menu border
      .el-menu-item {
        background: #353544;
      }

      //Selected Axis
      .el-menu-item.is-active {
        color: #fff;
        background: var(--el-color-primary);
      }

      //Mouse over the color
      .el-menu-item:hover {
        color: #d8d8ee;
      }
    }
  }
}
</style>