<template>
  <div class="container">
<!--    <BaseBlock title="告警日志" :verticalLine="true" />-->
    <base-panel
      :title-arr="['信息日志']"
      box-height="calc(100Vh - 180px)"
      contentPadding="27px 66px 10px">
      <div class="switch-list">
        <div
          class="switch-list-item"
          v-for="item in switchList"
          :key="item.key"
          :class="{active: activeName === item.key}"
          @click="handleClick(item.key) "
        >
          {{item.name}}
        </div>
      </div>
<!--      <el-tabs v-model="activeName" @tab-click="handleClick">-->
<!--        <el-tab-pane label="图片识别记录" name="2"></el-tab-pane>-->
<!--        <el-tab-pane label="视频日志" name="1"></el-tab-pane>-->
<!--      </el-tabs>-->
      <my-search :formData="formData" :formConfig="formConfig" @search="search" @reset="reset"></my-search>
      <div class="mb10">
        <el-button v-if="isManager" type="danger" icon="el-icon-delete" @click="del" :disabled="!selectList.length > 0"
        >删除</el-button
        >
        <el-button v-if="isManager" type="danger" icon="el-icon-delete" @click="delAll"
        >全部删除</el-button
        >
      </div>
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
            <el-tooltip v-if="isManager" content="删除" placement="top"  >
              <el-link type="danger"  @click="handelDelete(scope.row, scope.$index) " style="padding: 0 5px">删除</el-link>
            </el-tooltip>
            <el-tooltip content="详情" placement="top">
              <el-link type="warning"  @click="details(scope.row, scope.$index)" style="padding: 0 5px">详情</el-link>
            </el-tooltip>
<!--            <el-tooltip v-if="isManager" content="删除" placement="top">-->
<!--              <img src="@/assets/button/del.png" @click="handelDelete(scope.row, scope.$index)" class="myButton" />-->
<!--            </el-tooltip>-->
<!--            <el-tooltip content="详情" placement="top">-->
<!--              <img src="@/assets/button/threshold.png" @click="details(scope.row, scope.$index)" class="myButton" />-->
<!--            </el-tooltip>-->
          </template>
        </el-table-column>
      </BaseTable>
    </base-panel>

    <add-update ref="addupdate"></add-update>

    <!-- 图片日志 -->
    <imgViewDialog ref="imgViewDialog"></imgViewDialog>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { FORM_CONFIG, formData } from "./config";
import {alarmListApi, delAllApi, delListApi, detailsApi} from "@/api/system/alarm";
import AddUpdate from "./components/add-update";
import imgViewDialog from "./components/imgViewDialog.vue";
import Records from "@/views/home/components/records.vue";

export default {
  name: "AlarmLog",
  components: {
    Records,
    AddUpdate,
    imgViewDialog,
  },
  data() {
    return {
      switchList: [
        {
          name: '图片信息日志',
          key: '2',
        },
        {
          name: '视频信息日志',
          key: '1',
        },
      ],
      formData,
      activeName: "2",
      formConfig: FORM_CONFIG,
      loading: false,
      selectList: [],
      tableData: [],
      dictList: {},
      pagination: {
        current: 1,
        size: 10,
        total: 0,
      },
      columns: [
        { prop: "alertTime", label: "接收时间" },
        { prop: "content", label: "内容" },
        { prop: "sceneName", label: "场景" },
        // { prop: "linkDeviceName", label: "关联数据源" },
        { prop: "dataStreamName", label: "关联数据源" },
        { slot: "action" }, //操作
      ],
    };
  },

  mounted() {
    this.getData();
  },
  computed: {
    ...mapGetters(["isManager"]),
  },
  methods: {
    //表格数据
    getData() {
      this.loading = true;
      this.tableData = [];
      let temp = {
        pageNum: this.pagination.current,
        pageSize: this.pagination.size,
        type: this.activeName,
        sceneName: this.formData.sceneName,
        startAlertTime: this.formData.alertTime && this.formData.alertTime[0],
        endAlertTime: this.formData.alertTime && this.formData.alertTime[1],
      };
      alarmListApi(temp)
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
    search() {
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

    //删除
    delAll() {
      this.$BConfirm({
        message: `是否确认全部删除？`,
      }).then((bool) => {
        if (bool) {
          const data = {
            sceneName: this.formData.sceneName,
            startAlertTime: this.formData.alertTime && this.formData.alertTime[0],
            endAlertTime: this.formData.alertTime && this.formData.alertTime[1],
          }
          delAllApi(data).then((res) => {
            if (res.code === 200) {
              this.$message.success("删除成功！");
              this.getData();
            }
          });
        }
      });
      // this.publicDel([row.id]);
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
      this.formData = {};
      this.getData();
    },

    handleClick(key) {
      this.activeName = key;
      this.getData();
    },

    //详情
    details(row) {
      if (row.type == 2) {

        this.$refs.imgViewDialog.init(row);
      } else {
        this.$refs.addupdate.init(row);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.col {
  display: flex;
  justify-content: space-between;
}
.head {
  margin: 25px 0 3px 0;
}
.switch-list {
  display: flex;
  margin-bottom: 10px;
  .switch-list-item {
    cursor: pointer;
    position: relative;
    color: #FFF;
    font-family: "PingFang SC";
    font-size: 24px;
    font-style: normal;
    font-weight: 400;
    line-height: 32px; /* 133.333% */
    margin: 0 20px;
    &.active {
      &::before {
        position: absolute;
        left: -12px;
        top: 6px;
        display: inline-block;
        content: '';
        width: 4px;
        height: 22px;
        background: var(--linear-line, linear-gradient(180deg, #00FFB2 0%, #00F0FF 100%));
      }
    }
  }
}
</style>
