<template>
  <div class="login-body">
    <div class="login-panel">
      <div class="login-title">Admin Login</div>
      <el-form :model="formData" :rules="rules" ref="formDataRef">
        <el-form-item prop="account">
          <el-input
              placeholder="Please input your account"
              v-model="formData.account"
              size="large"
          >
            <template #prefix>
              <span class="iconfont icon-account"></span>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
              type="password"
              placeholder="Please input your password"
              v-model="formData.password"
              size="large"
          >
            <template #prefix>
              <span class="iconfont icon-password"></span>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="checkCode">
          <div class="check-code-panel">
            <el-input
                placeholder="Please enter your check code"
                v-model="formData.checkCode"
                class="input-panel"
                size="large"
            >
              <template #prefix>
                <span class="iconfont icon-checkcode"></span>
              </template>
            </el-input>
            <img
                :src="checkCodeUrl"
                class="check-code"
                @click="changeCheckCode"
            />
          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :style="{ width: '100%' }" @click="login"
          >Login</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import md5 from "js-md5";
import { getCurrentInstance, reactive, ref } from "vue";
import { useRouter } from "vue-router";

const { proxy } = getCurrentInstance();
const router = useRouter();
const api = {
  checkCode: "api/checkCode",
  login: "/login",
};

const checkCodeUrl = ref(api.checkCode);
const changeCheckCode = () => {
  checkCodeUrl.value = api.checkCode + "?" + new Date().getTime();
};

//form
const formDataRef = ref(null);
const formData = reactive({});

const rules = {
  account: [
    {
      required: true,
      message: "Please input username",
    },
  ],
  password: [
    {
      required: true,
      message: "Please input password",
    },
  ],
  checkCode: [
    {
      required: true,
      message: "Please input check code",
    },
  ],
};

const login = () => {
  formDataRef.value.validate(async (valid) => {
    if (!valid) {
      return;
    }
    let params = Object.assign({}, formData);
    params.password = md5(params.password);
    let result = await proxy.Request({
      url: api.login,
      params: params,
      errorCallback: () => {
        changeCheckCode();
      },
    });
    if (!result) {
      return;
    }
    proxy.Message.success("Login successful", () => {
      router.push("/");
    });
    proxy.VueCookies.set("userInfo", result.data, 0);
  });
};
</script>

<style lang="scss">

</style>