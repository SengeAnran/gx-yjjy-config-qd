<template>
  <div class="container">
<!--    <BaseBlock title="场景管理" :verticalLine="true" />-->
    <base-panel
      :title-arr="['场景管理']"
      box-height="calc(100Vh - 180px)"
      contentPadding="27px 66px 10px">

      <top-search
        @add="add"
        @search="search"
        @reset="reset"
        @del="del"
        :show="isManager"
        placeholder="请输入场景名称"
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
        <el-table-column slot="type" label="类型" align="center">
          <template #default="{ row }">
            <span>{{ row.type === 2 ? "图片流" : "视频流" }}</span>
          </template>
        </el-table-column>
        <el-table-column slot="state" label="启动/停止" align="center">
          <template #default="{ row }">
<!--            :active-text="'启动'"-->
<!--            :inactive-text="'停止'"-->
            <el-switch
              v-model="row.state"
              active-color="#0A9FFD"
              inactive-color="#FFFFFF80"
              @change="(ev) => changeSwitch(row, ev)"
            />
          </template>
        </el-table-column>
        <el-table-column slot="action" label="操作" align="center" width="200px">
          <template #default="{ row }">
            <el-tooltip v-if="isManager" content="修改" placement="top" >
              <el-link type="primary"  @click="update(row)" style="padding: 0 5px">修改</el-link>
            </el-tooltip>
            <el-tooltip v-if="isManager" content="删除" placement="top"  >
              <el-link type="danger"  @click="handelDelete(row) " style="padding: 0 5px">删除</el-link>
            </el-tooltip>
            <el-tooltip content="详情" placement="top">
              <el-link type="warning"  @click="details(row)" style="padding: 0 5px">详情</el-link>
            </el-tooltip>
<!--            <el-tooltip v-if="isManager" content="修改" placement="top">-->
<!--              <img src="@/assets/button/edit.png" @click="update(row)" class="myButton" />-->
<!--            </el-tooltip>-->
<!--            <el-tooltip v-if="isManager" content="删除" placement="top">-->
<!--              <img src="@/assets/button/del.png" @click="handelDelete(row)" class="myButton" />-->
<!--            </el-tooltip>-->
<!--            <el-tooltip content="详情" placement="top">-->
<!--              <img src="@/assets/button/threshold.png" @click="details(row)" class="myButton" />-->
<!--            </el-tooltip>-->
          </template>
        </el-table-column>
      </BaseTable>
    </base-panel>
    <add-update ref="addupdate" @getData="getData"></add-update>
    <my-details ref="details" @getData="getData"></my-details>

    <!-- 图片流详情 -->
    <PictureStream ref="PictureStream"></PictureStream>

    <!-- 视频流详情 -->
    <VideoFull ref="VideoFull"></VideoFull>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import AddUpdate from "./components/add-update";
import MyDetails from "./components/details";
import VideoFull from "@/views/components/videoViewDialog";
import {
  sceneListApi,
  delListApi,
  sceneStateApi,
  sceneStateStartApi,
  sceneStateStopApi,
  sceneEnableApi,
} from "@/api/system/scene";
import PictureStream from "./components/pictureStream.vue";

export default {
  name: "SceneManagement",
  components: {
    AddUpdate,
    MyDetails,
    PictureStream,
    VideoFull,
  },
  data() {
    return {
      value: true,
      loading: false,
      tableData: [],
      selectList: [], //选择数据
      queryParams: "",
      dictList: {},
      pagination: {
        current: 1,
        size: 10,
        total: 0,
      },
      columns: [
        { prop: "name", label: "场景名称", align: "center" },
        { prop: "type", label: "类型", align: "center", slot: "type" },
        { prop: "linkDatasourceName", label: "关联数据源", align: "center" },
        { prop: "linkModelName", label: "关联模型", align: "center" },
        { prop: "remark", label: "备注", width: "", align: "center" },
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
      sceneListApi(temp)
        .then((res) => {
          if (res.code == 200) {
            this.tableData = res.rows.map((item) => {
              return {
                ...item,
                state: item.state == "1" ? true : false,
              };
            });

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
    async changeSwitch(row, ev) {
      const params = {
        id: row.id,
        state: ev === true ? "1" : "0",
      };
      const res = await sceneEnableApi(params);
      if (res.code == 200) {
        this.$message.success("操作成功！");
      }
      this.getData();
    },

    async changeState(ev, row) {
      let params = {
          id: row.id,
          state: ev === true ? "启动" : "停止",
        },
        res;
      const { id } = row;
      try {
        res = ev === true ? await sceneStateStartApi(id) : await sceneStateStopApi(id);
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

    //修改
    update(row) {
      this.$refs.addupdate.init(row);
    },
    //详情
    details(row) {
      // this.$refs.details.init(row);
      if (row.type == 2) {
        this.$refs.PictureStream.init(row);
      } else {
        this.$refs.VideoFull.init(row);
      }
    },

    add() {
      this.$refs.addupdate.init();
    },
  },
};
</script>
