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

        <el-divider content-position="left">review setting</el-divider>
        <el-row>
          <el-col :span="12">
            <el-form-item label="Whether article need to be review" prop="postAudit">
              <el-radio-group v-model="formData.postAudit">
                <el-radio :label="false">no</el-radio>
                <el-radio :label="true">yes</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Whether comment need to be review" prop="commentAudit">
              <el-radio-group v-model="formData.commentAudit">
                <el-radio :label="false">no</el-radio>
                <el-radio :label="true">yes</el-radio>
              </el-radio-group>
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