
<template>
  <div class="records-content">
    <div class="records">
      <el-button type="primary" round @click="$router.push('/layout/alarm-log')">生成报告</el-button>
    </div>
    <div class="list">
      <div class="list-item"
           v-for="(item, index) in tableData"
           :key="item.id"
           :class="{active: activeIndex === index}"
      >
        <div class="item-left">
          <div class="time">2024-10-29 15:31</div>
          <div class="name">现场态势报告</div>
        </div>
        <div v-show="activeIndex === index" class="item-right">
          <img src="../img/download-cloud-01-active.png" alt="" style="margin-right: 44px">
          <img src="../img/trash-03-active.png" alt="" style="margin-right: 9px">
        </div>
        <div v-show="activeIndex !== index" class="item-right">
          <img src="../img/download-cloud-01.png" alt="" style="margin-right: 44px">
          <img src="../img/trash-03.png" alt="" style="margin-right: 9px">
        </div>
      </div>
    </div>
    <div class="pagination">
      <el-pagination
        background
        :pager-count="5"
        layout="total, prev, pager, next"
        :current-page.sync="pagination.current"
        :page-size="pagination.size"
        :total="pagination.total"
        @current-change="handleCurrentChange"
      />
    </div>

  </div>
</template>
<script>

export default {
  name: "records",
  // components: {AddUpdate, imgViewDialog},
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
      activeIndex: 0,
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
    // //定时5s拉取信息
    // this.timer = setInterval(() => {
    //   this.getData(this.activeName);
    // },5000);
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
    //切换页码
    handleCurrentChange(value) {
      this.pagination.current = value;
      this.$emit("getData");
      this.getData(this.activeName);
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
    justify-content: left;
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
.list {
  //padding: 0 49px;
  .list-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    //width: 468px;
    height: 100px;
    padding: 22px 24px;
    margin-bottom: 24px;
    border-radius: 6px;
    background: rgba(90, 181, 255, 0.20);
    &.active {
      background: #409EFF;
    }
    .item-left {
      color: #FFF;
      font-family: "PingFang SC";
      .time {
        font-size: 24px;
      }
      .name {
        font-size: 16px;
      }
    }
    .item-right {
      img {
        cursor: pointer;
      }
    }
  }
}
</style>
