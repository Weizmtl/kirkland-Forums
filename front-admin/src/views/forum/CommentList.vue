<template>
  <div class="top-panel">
    <el-form :model="searchFormData" label-width="50px">
      <el-row>
        <el-col :span="4">
          <el-form-item label="Content" prop="contentFuzzy">
            <el-input
                placeholder="Support fuzzy search"
                v-model="searchFormData.contentFuzzy"
                clearable
                @keyup.enter.native="loadDataList"
            >
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="Nickname" prop="nickNameFuzzy">
            <el-input
                placeholder="Please enter a nickname"
                v-model="searchFormData.nickNameFuzzy"
                clearable
                @keyup.enter.native="loadDataList"
            >
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="Status" prop="status">
            <el-select
                v-model="searchFormData.status"
                clearable
                placeholder="Please select status"
                :style="{ width: '100%' }"
            >
              <el-option :value="-1" label="Deleted"></el-option>
              <el-option :value="0" label="To be Review"></el-option>
              <el-option :value="1" label="Reviewed"></el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="4" :style="{ 'padding-left': '10px' }">
          <el-button-group>
            <el-button type="primary" @click="loadDataList">Search</el-button>
            <el-button type="success" @click="auditBatch">Batch Review</el-button>
            <el-button type="danger" @click="delBatch">Batch delete</el-button>
          </el-button-group>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>

</script>

<style scoped>

</style>