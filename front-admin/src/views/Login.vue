<template>
  <div class="login-body">
    <div class="login-panel">
      <el-form :model="formData" :rules="rules" ref="formDataRef">
        <el-form-item prop="account">
          <el-input
              placeholder="Please input username"
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
                placeholder="请输入验证码"
                v-model="formData.checkCode"
                class="input-panel"
                size="large"
                @keyup.enter.native="login"
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
          >Login</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>

import { getCurrentInstance, reactive, ref } from "vue";
import { useRouter, useRoute} from "vue-router";

const { proxy } = getCurrentInstance();
const router = useRouter();
const route = useRoute();


//relation with forms
const formDataRef = ref();
const formData = reactive({});
const rules = {
  title:[{required: true,message: "please enter text here"}],
};

const checkCodeUrl = ref(api.checkCode);

</script>

<style >

</style>