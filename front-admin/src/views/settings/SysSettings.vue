<template>
    <div>
      <el-form
          :model="formData"
          :rules="rules"
          ref="formDataRef"
          label-width="150px"
          :style="{ width: '800px' }"
      >
        <el-divider content-position="left">registration message</el-divider>
        <el-row>
          <el-col :span="24">
            <el-form-item label="welcome" prop="registerWelcomInfo">
              <el-input
                  v-model="formData.registerWelcomInfo"
                  placeholder="please input welcome message"
                  maxlength="250"
              >
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-divider content-position="left">mail setting</el-divider>
        <el-row>
          <el-col :span="24">
            <el-form-item label="mail title" prop="emailTitle">
              <el-input
                  v-model="formData.emailTitle"
                  placeholder="please input title"
                  maxlength="200"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="mail content" prop="emailContent">
              <el-input
                  v-model="formData.emailContent"
                  placeholder="Please enter the message content, the verification code use %s placeholder"
                  maxlength="300"
              >
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
</template>

<script>

</script>

<style scoped>

</style>