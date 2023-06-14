<template>
  <template>
    <div>
      <el-table
          ref="dataTable"
          :data="dataSource.list || []"
          :height="tableHeight"
          :stripe="options.stripe"
          :border="options.border"
          header-row-class-name="table-header-row"
          highlight-current-row
          @row-click="handleRowClick"
          @selection-change="handleSelectionChange"
      >
        <!--selection frame-->
        <el-table-column
            v-if="options.selectType && options.selectType == 'checkbox'"
            type="selection"
            width="50"
            align="center"
        ></el-table-column>
        <!--serial number-->
        <el-table-column
            v-if="options.showIndex"
            label="serial"
            type="index"
            width="60"
            align="center"
        ></el-table-column>
      </el-table>
    </div>
  </template>
  <script setup>
    import { ref } from "vue";

    const emit = defineEmits(["rowSelected", "rowClick"]);
    const props = defineProps({
      dataSource: Object,
      showPagination: {
        type: Boolean,
        default: true,
      },
      options: {
        type: Object,
        default: {
          extHeight: 0,
          showIndex: false,
        },
      },
      columns: Array,
      fetch: Function, // A function to get data
      initFetch: {
        type: Boolean,
        default: true,
      },
    });

    //Top 60, content area from the top 20, content above and below the inner spacing 15*2 paging area height 46
    const topHeight = 60 + 20 + 30 + 46;

    const tableHeight = ref(
        props.options.tableHeight
            ? props.options.tableHeight
            : window.innerHeight - topHeight - props.options.extHeight
    );

    //initialize
    const init = () => {
      if (props.initFetch && props.fetch) {
        props.fetch();
      }
    };
    init();

    const dataTable = ref();
    //Clear check
    const clearSelection = () => {
      dataTable.value.clearSelection();
    };

    //Set line check
    const setCurrentRow = (rowKey, rowValue) => {
      let row = props.dataSource.list.find((item) => {
        return item[rowKey] === rowValue;
      });
      dataTable.value.setCurrentRow(row);
    };
    //Expose the child component, otherwise the parent component cannot be called
    defineExpose({ setCurrentRow, clearSelection });

    //Line click
    const handleRowClick = (row) => {
      emit("rowClick", row);
    };

    //multiple choice
    const handleSelectionChange = (row) => {
      emit("rowSelected", row);
    };


  </script>
  <style lang="scss">
    .pagination {
      padding-top: 10px;
    }
    .el-pagination {
      justify-content: right;
    }

    .el-table__body tr.current-row > td.el-table__cell {
      background-color: #e6f0f9;
    }

    .el-table__body tr:hover > td.el-table__cell {
      background-color: #e6f0f9 !important;
    }
  </style>
