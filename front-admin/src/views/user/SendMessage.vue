<template>
  <div>
    <Dialog
        :show="dialogConfig.show"
        :title="dialogConfig.title"
        :buttons="dialogConfig.buttons"
        width="500px"
        @close="dialogConfig.show = false"
    >
      <el-form
          :model="formData"
          :rules="rules"
          ref="formDataRef"
          label-width="80px"
      >
        <el-form-item label="Message content" prop="message">
          <el-input
              clearable
              placeholder="Please enter a message"
              type="textarea"
              :rows="5"
              :maxlength="200"
              resize="none"
              show-word-limit
              v-model="formData.message"
          ></el-input>
        </el-form-item>

        <el-form-item label="credit" prop="integral">
          <el-input
              clearable
              placeholder="The integral, it's empty or zero doesn't add or subtract, it can be negative"
              v-model="formData.integral"
          ></el-input>
        </el-form-item>
      </el-form>
    </Dialog>
  </div>
</template>

<script>
export default {
  name: "SendMessage"
}
</script>

<style scoped>

</style>