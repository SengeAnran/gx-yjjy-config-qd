<template>
  <div class="">
    <top-search
      @add="add"
      @search="search"
      @reset="reset"
      @del="del"
      :show="isManager"
      placeholder="请输入名称搜索"
      :delShow="!selectList.length > 0"
    ></top-search>
    <BaseTable
      v-loading="loading"
      :tableData="tableData"
      :pagination="pagination"
      :columns="columns"
      :showIndex="false"
      :showSelection="true"
      :stripe="false"
      @getData="getData"
      @selectionChange="changeSelection"
    >
      <el-table-column slot="status" label="状态" align="center">
        <template #default="{ row }">
          <template v-if="row.deviceState == '在线'">
            <span class="circle online"></span>
            <span>在线</span>
          </template>
          <template v-if="row.deviceState == '离线'">
            <span class="circle leave"></span>
            <span>离线</span>
          </template>
        </template>
      </el-table-column>
      <el-table-column slot="action" label="操作" align="center" width="200px">
        <template slot-scope="scope">
          <el-tooltip v-if="isManager" content="修改" placement="top" >
            <el-link type="primary"  @click="update(scope.row, scope.$index)" style="padding: 0 5px">修改</el-link>
          </el-tooltip>
          <el-tooltip v-if="isManager" content="删除" placement="top"  >
            <el-link type="danger"  @click="handelDelete(scope.row, scope.$index) " style="padding: 0 5px">删除</el-link>
          </el-tooltip>
          <el-tooltip content="详情" placement="top">
            <el-link type="warning"  @click="details(scope.row, scope.$index)" style="padding: 0 5px">详情</el-link>
          </el-tooltip>
        </template>
      </el-table-column>
    </BaseTable>
    <!-- 修改 -->
    <add-update ref="addupdate" @getData="getData"></add-update>
    <!-- 详情 -->
    <!-- <card-details ref="details"></card-details> -->
    <!-- 接收历史 -->
    <ReceiveHistory ref="ReceiveHistory"></ReceiveHistory>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import AddUpdate from "./components/image-add-update.vue";
import CardDetails from "./components/card-details";
import ReceiveHistory from "./components/receiveHistory.vue";
// import { cardListApi, delListApi } from "@/api/system/aicard";

import { dataSourcePageApi, delSourcePaegApi } from "@/api/system/data_source";
export default {
  name: "AiCardManagement",
  components: {
    AddUpdate,
    CardDetails,
    ReceiveHistory,
  },
  data() {
    return {
      loading: false,
      selectList: [],
      queryParams: "",
      tableData: [],
      dictList: {},
      pagination: {
        current: 1,
        size: 10,
        total: 0,
      },
      columns: [
        { prop: "name", label: "图片流名称", width: "", align: "center" },
        { prop: "boardCardConfTag", label: "标签", width: "", align: "center" },
        // { prop: "boardCardIp", label: "IP", width: "", align: "center" },
        // { prop: "boardCardPort", label: "板卡端口", width: "", align: "center" },
        // { prop: "sshUser", label: "用户", width: "", align: "center" },
        // { prop: "deviceType", label: "类型", width: "", align: "center" },
        { prop: "description", label: "说明", width: "", align: "center" },
        { prop: "targetUri", label: "接收地址", width: "", align: "center" },
        // { slot: "status" }, //状态
        { slot: "action" }, //操作
      ],
      timer: null,
    };
  },
  computed: {
    ...mapGetters(["isManager"]),
  },
  mounted() {
    this.getData();
    // this.timer = window.setInterval(() => {
    //   this.getData();
    // }, 5000);
  },
  // beforeDestroy() {
  //   window.clearInterval(this.timer);
  // },
  methods: {
    //表格数据
    getData() {
      this.loading = true;
      let temp = {
        pageNum: this.pagination.current,
        pageSize: this.pagination.size,
        name: this.queryParams,
        type: 2, //图片流
      };
      dataSourcePageApi(temp)
        .then((res) => {
          if (res.code == 200) {
            this.tableData = res.rows;
            this.pagination.total = res.total;
            this.loading = false;
          }
        })
        .catch(() => {
          this.loading = false;
        });
    },

    //搜索
    search(data) {
      this.pagination.current = 1;
      this.queryParams = data;
      this.getData();
    },

    //公共删除
    publicDel(ids) {
      this.$BConfirm({
        message: `是否确认删除？`,
      }).then((bool) => {
        if (bool) {
          delSourcePaegApi(ids).then((res) => {
            if (res.code == 200) {
              this.$message.success("删除成功！");
              this.getData();
            }
          });
        }
      });
    },
    //删除
    handelDelete(row) {
      this.publicDel([row.id]);
    },

    //选择
    changeSelection(data) {
      this.selectList = data;
    },

    del() {
      let ids = this.selectList.map((item) => item.id);
      this.publicDel(ids);
    },
    //重置
    reset() {
      this.queryParams = "";
      this.getData();
    },
    //详情
    details(row) {
      // this.$refs.details.init(row);
      this.$refs.ReceiveHistory.init(row);
    },
    //修改
    update(row) {
      this.$refs.addupdate.init(row);
    },
    add() {
      this.$refs.addupdate.init();
    },
  },
};
</script>

<style lang="scss" scoped>
.circle {
  width: 7px;
  height: 7px;
  display: inline-block;
  text-align: center;
  border-radius: 50%;
  margin-right: 5px;
}
.online {
  background: #67c23a;
}
.leave {
  background: #909399;
}
</style>
