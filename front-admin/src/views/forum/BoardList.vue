<template>
  <div>
    <el-button type="primary" @click="showEdit('add', 0)">create board</el-button>
    <el-row :gutter="10" :style="{ 'margin-top': '10px' }">
      <el-col :span="14">
        <el-card class="box-card">
          <template #header>
            <div class="card-header">
              <span>first board</span>
            </div>
          </template>
          <Table
              :columns="columns"
              :showPagination="false"
              :dataSource="tableData"
              :fetch="loadDataList"
              :options="tableOptions"
              ref="dataTableRef"
              @rowClick="rowClick"
          >
            <template #cover="{ index, row }">
              <Cover :cover="row.cover"></Cover>
            </template>
            <!--borad info-->
            <template #boardInfo="{ index, row }">
              <div>board name：{{ row.boardName }}</div>
              <div>Posting permission：{{ postTypeMap[row.postType] }}</div>
            </template>

            <template #op="{ index, row }">
              <div class="op">
                <a
                    href="javascript:void(0)"
                    class="a-link"
                    @click="showEdit('update', 0, row)"
                >modify</a
                >
                <el-divider direction="vertical" />
                <a href="javascript:void(0)" class="a-link" @click="del(row)"
                >delete</a
                >
                <el-divider direction="vertical" />
                <a
                    href="javascript:void(0)"
                    :class="[index == 0 ? 'not-allow' : 'a-link']"
                    @click="changeSort(index, 'up', 0)"
                >move up</a
                >
                <el-divider direction="vertical" />
                <a
                    href="javascript:void(0)"
                    :class="[
                    index == tableData.list.length - 1 ? 'not-allow' : 'a-link',
                  ]"
                    @click="changeSort(index, 'down', 0)"
                >move down</a
                >
              </div>
            </template>
          </Table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: "BoardList"
}
</script>

<style scoped>

</style>