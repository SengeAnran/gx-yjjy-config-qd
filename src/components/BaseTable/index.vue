<template>
  <div>
    <el-table
      ref="elTable"
      :border="border"
      :data="tableData"
      :stripe="stripe"
      :size="size"
      :max-height="maxHeight"
      header-cell-name="table-list-header"
      row-class-name="table-list-row"
      @selection-change="handleSeletionChange"
      @current-change="tableCurrentChange"
      @row-click="handleRowClick"
      @select="handleSelect"
      v-bind="$attrs"
      :default-sort="defaultSort"
      :row-key="rowKey"
      :default-expand-all="isExpandAll"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      :header-row-style="{
            fontSize: '14px',
            fontFamily: 'PingFangSC-Medium, PingFang SC',
            fontWeight: 500,
            color: ' #333333',
            lineHeight: '22px',
          }"
    >
      <!-- 复选框 -->
      <el-table-column v-if="showSelection" type="selection" width="50" align="center"></el-table-column>
      <!-- 序号 -->
      <el-table-column v-if="showIndex" type="index" label="序号" width="50" align="center"></el-table-column>
      <!-- 基本列 -->
      <template v-for="item in columns">
        <!-- 插槽列 -->
        <slot v-if="item.slot" :name="item.slot" />
        <!-- 多级表头 -->
        <el-table-column
          :key="'multi_' + item.label"
          v-else-if="item.children"
          :label="item.label"
          :width="item.width"
          :min-width="item.minWidth"
          :align="item.align || 'center'"
          :header-align="item.headerAlign ? item.headerAlign : item.align || 'center'"
          show-overflow-tooltip
        >
          <el-table-column
            v-for="(child, childIndex) in item.children"
            :key="'child' + '_' + childIndex"
            :prop="child.prop"
            :label="child.label"
            :width="child.width"
            :min-width="item.minWidth"
            v-bind="child"
            :align="child.align || 'center'"
            :header-align="child.headerAlign ? child.headerAlign : child.align || 'center'"
            show-overflow-tooltip
          ></el-table-column>
        </el-table-column>
        <!-- 非插槽列 -->
        <el-table-column
          v-else
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
          :min-width="item.minWidth"
          :fixed="item.fixed"
          v-bind="item"
          :align="item.align || 'center'"
          :header-align="item.headerAlign ? item.headerAlign : item.align || 'center'"
          show-overflow-tooltip
        ></el-table-column>
      </template>
      <template #empty>
        <el-empty :image-size="100"></el-empty>
      </template>
    </el-table>
    <!-- 分页 -->
    <div class="pagination" v-if="isPagintionShow && pagination.total">
      <el-pagination
        background
        :pager-count="5"
        layout="total, sizes, prev, pager, next"
        :page-sizes="pageSizes"
        :current-page.sync="pagination.current"
        :page-size="pagination.size"
        :total="pagination.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
import baseTableMixins from "./base-table-mixins";
export default {
  name: "BaseTable",
  inheritAttrs: false,
  mixins: [baseTableMixins],
  data() {
    return {
      maxHeight: null,
    };
  },
  mounted() {
    this.extendMethod();
    this.$nextTick(() => {
      this.getTableHeight();
    });
    window.addEventListener("resize", this.getTableHeight);
  },

  beforeDestroy() {
    window.removeEventListener("resize", this.getTableHeight);
  },

  methods: {
    //将所有的方法暴露出来，供父组件通过 ref 调用
    extendMethod() {
      const refMethod = Object.entries(this.$refs["elTable"]);
      for (const [key, value] of refMethod) {
        if (!(key.includes("$") || key.includes("_"))) {
          this[key] = value;
        }
      }
    },

    //获取表格的高度
    getTableHeight() {
      this.$nextTick(() => {
        let tableDom = this.$refs.elTable.$el;
        let top = tableDom.getBoundingClientRect().top;
        // let bottom = 52; //分页组件的高度
        let bottom = this.bottom; //分页组件的高度
        this.maxHeight = this.tableMaxHeight || window.innerHeight - top - bottom;
      });
    },

    /**
     * @description  复选框选中的数组
     * @param {Array} data  参数
     */
    handleSeletionChange(data) {
      this.$emit("selectionChange", data);
    },
    //单选
    tableCurrentChange(row) {
      this.$emit("currentChange", row);
    },
    //点击行
    handleRowClick(row) {
      this.$emit("rowClick", row);
    },

    //手动选择checkbox
    handleSelect(select, row) {
      this.$emit("select", select, row);
    },

    //切换页码
    handleCurrentChange(value) {
      this.pagination.current = value;
      this.$emit("getData");
    },
    //切换每页条数
    handleSizeChange(value) {
      this.pagination.size = value;
      this.$emit("getData");
    },
  },
};
</script>

<style lang="scss" scoped>
.pagination {
  height: 32px;
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
}
.el-table {
  color: white;
  background: none;
  box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.05);
  //border: 1px solid rgba(208, 230, 255, 1);
  ::v-deep tr th {
    color: #BFE7F9;
    background: none;
    //color: #222;
    //border-left: 1px solid rgba(208, 230, 255, 1);
    //border-bottom: 1px solid rgba(208, 230, 255, 1) !important;
    //&:nth-child(1) {
    //  border-left: none;
    //}
  }
  ::v-deep tr {
    background: none;
  }
  ::v-deep .el-table__cell {
    padding: 8px 0;
  }

}
.el-table  ::v-deep th.el-table__cell.is-leaf, .el-table  ::v-deep td.el-table__cell {
  border-color: rgba(255, 255, 255, 0.15);
}
.el-table::before {
  height: 0;
}
::v-deep .el-table--enable-row-hover .el-table__body tr:hover > td.el-table__cell {
  background-color: #0e428f;
}
::v-deep .el-pagination{
  &.is-background .btn-prev,&.is-background .btn-next,&.is-background .el-pager li {
    //margin: 0 5px;
    background-color: #00539F;
    color: rgba(255, 255, 255, 0.75);
    //min-width: 30px;
    //border-radius: 2px;
  }
  .el-pagination__total {
    color: white;
  }
}
</style>
