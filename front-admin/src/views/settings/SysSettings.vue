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
      </el-form>
    </div>
</template>

<script>

</script>

<style scoped>

</style>