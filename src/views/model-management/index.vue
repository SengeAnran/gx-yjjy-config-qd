<template>
  <div class="container">
    <base-panel
      :title-arr="['模型管理']"
      box-height="calc(100Vh - 180px)"
      contentPadding="27px 66px 10px">
      <top-search
        @add="add"
        @search="search"
        @reset="reset"
        @del="del"
        :show="isManager"
        placeholder="请输入模型名称"
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
        <el-table-column slot="action" label="操作" align="center" width="200px">
          <template slot-scope="scope">
            <el-tooltip v-if="isManager && scope.row.permissionType !== 0" content="修改" placement="top" >
              <el-link type="primary"  @click="details(scope.row, scope.$index)" style="padding: 0 5px">修改</el-link>
            </el-tooltip>
            <el-tooltip v-if="isManager &&( scope.row.modelType === '.pt' || scope.row.modelType === '.onnx')" content="模型转换" placement="top" >
              <el-link type="primary"  @click="transform(scope.row, scope.$index)" style="padding: 0 5px">模型转换</el-link>
            </el-tooltip>
            <el-tooltip v-if="isManager && scope.row.permissionType !== 0" content="删除" placement="top"  >
              <el-link type="danger"  @click="handelDelete(scope.row, scope.$index) " style="padding: 0 5px">删除</el-link>
            </el-tooltip>
            <!-- <el-tooltip content="更新模型" placement="top">
              <i
                @click="handelUpdateModel(scope.row, scope.$index)"
                class="el-icon-folder-add myButton"
                style="font-size: 20px"
              ></i>
            </el-tooltip> -->
          </template>
        </el-table-column>
      </BaseTable>
    </base-panel>

    <add-update ref="addupdate" @getData="getData"></add-update>
    <transform ref="transform" @getData="getData"></transform>
    <UpdateModel ref="updateModel" @getData="getData" />
  </div>
</template>
<script>
import AddUpdate from "./components/add-update";
import UpdateModel from "./components/updateModel";
import { modelListApi, delListApi, modelStateStopApi, modelStateStartApi } from "@/api/system/model";
import { mapGetters } from "vuex";
import Transform from "@/views/model-management/components/transform.vue";
export default {
  name: "ModelManagement",
  components: {
    Transform,
    AddUpdate,
    UpdateModel,
  },
  data() {
    return {
      loading: false,
      queryParams: "", //搜索数据
      selectList: [],
      tableData: [],
      dictList: {},
      pagination: {
        current: 1,
        size: 10,
        total: 0,
      },
      columns: [
        { prop: "name", label: "模型名称", width: "", align: "center" },
        { prop: "warnLevel", label: "预警级别", width: "", align: "center" },
        { prop: "remark", label: "说明", width: "", align: "center" },
        { prop: "modelType", label: "类型", width: "", align: "center" },
        { prop: "createBy", label: "更新人", width: "", align: "center" },
        { prop: "createTime", label: "更新时间", width: "", align: "center" },
        { slot: "state" },
        { slot: "action" }, //操作
      ],
    };
  },
  computed: {
    ...mapGetters(["isManager"]),
  },
  mounted() {
    this.getData();
  },
  methods: {
    //表格数据
    getData() {
      this.loading = true;
      let temp = {
        pageNum: this.pagination.current,
        pageSize: this.pagination.size,
        name: this.queryParams,
      };
      modelListApi(temp)
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
          delListApi(ids).then((res) => {
            if (res.code == 200) {
              this.$message.success("删除成功！");
              this.getData();
            }
          });
        }
      });
    },

    //开关
    async changeState(ev, row) {
      let params = {
          id: row.id,
          state: ev,
        },
        res;
      try {
        res = await modelStateStartApi(params);
        if (res.code === 200) {
          this.$message.success("操作成功！");
          this.getData();
        }
      } catch (e) {
        console.log(e);
      }

      // sceneStateApi(params).then(res => {
      //
      // });
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

    //跟新模型
    handelUpdateModel(row) {
      this.$refs.updateModel.init(row);
    },

    //详情
    details(row) {
      this.$refs.addupdate.init(row);
    },
    //详情
    transform(row) {
      this.$refs.transform.init(row);
    },

    add() {
      this.$refs.addupdate.init();
    },
  },
};
</script>
