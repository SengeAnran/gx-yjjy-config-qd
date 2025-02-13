
<template>
  <div class="records-content">
    <div class="records">
      <el-button type="primary" round @click="$router.push('/layout/alarm-log')">查看全部</el-button>
    </div>
    <div>
      <BaseTable
        :bottom="140"
        :tableData="tableData"
        :pagination="pagination"
        :columns="columns"
        :showIndex="false"
        :showSelection="false"
        :stripe="false"
        @getData="getData(activeName)"
      >
        <el-table-column slot="action" label="操作" align="center">
          <template slot-scope="{ row }">
            <el-button type="text" @click="onView(row)">详情</el-button>
          </template>
        </el-table-column>
      </BaseTable>
    </div>
    <!-- 图片流详情 -->
    <imgViewDialog ref="imgViewDialog"></imgViewDialog>
    <add-update ref="addupdate"></add-update>
  </div>
</template>
<script>
import imgViewDialog from "@/views/alarm-log/components/imgViewDialog.vue";
import AddUpdate from "@/views/alarm-log/components/add-update.vue";

export default {
  name: "records",
  components: {AddUpdate, imgViewDialog},
  props: {
    getMethod: Function,
  },
  data(){
    return {
      tableData: [],
      pagination: {
        current: 1,
        size: 10,
        total: 0,
      },
      activeName: 2,
      columns: [
        { prop: "alertTime", label: "时间", width: "", align: "center" },
        { prop: "content", label: "内容", width: "", align: "center" },
        { prop: "sceneName", label: "场景", width: "", align: "center" },
        { slot: "action" }, //操作
      ],
    }
  },
  mounted() {
    this.getData(2);
    //定时5s拉取信息
    this.timer = setInterval(() => {
      this.getData(this.activeName);
    },5000);
  },
  beforeDestroy() {
    this.clearTimer();
  },
  methods: {
    changeActive(id) {
      this.pagination =  {
        current: 1,
        size: 10,
        total: 0,
      };
      if (id === 0) {
        this.activeName = 2;
      } else {
        this.activeName = 1;
      }

      this.clearTimer();
      this.getData(this.activeName);
      //定时10s拉取信息
      this.timer = setInterval(() => {
        this.getData(this.activeName);
      }, 10000);
    },
    getData(type) {
      let temp = {
        pageNum: this.pagination.current,
        pageSize: this.pagination.size,
        type: type,
      };
      this.getMethod(temp)
        .then((res) => {
          if (res.code == 200) {
            this.tableData = res.rows;
            this.pagination.total = res.total;
          }
        })
        .catch(() => {});
    },
    onView(item) {

      if (this.activeName === 2) {
        this.$refs.imgViewDialog.init(item);
      } else {
        this.$refs.addupdate.init(item);
      }

    },
    //清除定时器
    clearTimer() {
      window.clearInterval(this.timer);
      this.timer = null;
    },
  }
}
</script>


<style scoped lang="scss">
.records-content {
  //margin-left: 10px;
  padding: 16px 30px;
  .records {
    display: flex;
    justify-content: right;
    margin-bottom: 19px;
  }
  .name {
    font-weight: 600;
  }
  div {
    line-height: 28px;
  }
  .flexmsg {
    display: flex;
    justify-content: space-between;
  }
}
::v-deep .el-table__cell {
  padding: 1px 0 !important;
}
</style>
