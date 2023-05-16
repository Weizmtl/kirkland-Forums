<template>
    <div v-for="item in dataSource.list">
      <slot :data="item"></slot>
    </div>
  <div class="pagination">
      <el-pagination
              v-if="dataSource.pageTotal > 1"
              background
              :total="dataSource.totalCount"
              :current-page.sync="dataSource.pageNo"
              layout="prev, pager, next"
              @current-change="handlePageNoChange"
              style="text-align: right"
              :page-size="15"
      ></el-pagination>
  </div>
</template>

<script setup>
const props= defineProps({
    dataSource:{
        type:Object,
    }
});
const emit = defineEmits(["loadData"]);
const handlePageNoChange =(pageNo)=>{
    props.dataSource.pageNo = pageNo;
    emit("loadData");
}
</script>

<style lang="scss">
.pagination{
  margin: 5px 0px 5px 10px;
}
</style>
