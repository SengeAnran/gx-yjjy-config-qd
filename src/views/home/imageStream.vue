<template>
  <div class="contain">
    <div class="btn-list">
      <div
        class="btn-list-item"
        :class="{active: activeName === item.id}"
        v-for="item in imgTabs" :key="item.id"
        @click="changeActive(item.id)">
        {{item.name}}
      </div>
    </div>
    <!-- 接收历史 -->
    <div class="card" v-loading="loading">
      <card-item
        v-for="(item, index) in historyData"
        :item="item" :key="'img' + index"
        @onView="onView"
        :class="{'card-item-first': index === 0}"
      />
<!--      <div class="pictureBox" v-for="(item, index) in historyData" :key="'img' + index">-->
<!--        <div class="pictureBox-left">-->
<!--          <img :src="item.targetImage" alt="暂无" />-->
<!--        </div>-->
<!--        <div class="pictureBox-right">-->
<!--          <div class="name">{{ item.name }}</div>-->
<!--          <div>紧急避险空地数量：{{ item.airGround || 0 }}</div>-->
<!--          <div>取水水域数量：{{ item.water || 0 }}</div>-->
<!--          <div>电塔数量：{{ item.signal || 0 }}</div>-->
<!--          <div>latitude（纬度）：{{ item.latitude }}</div>-->
<!--          <div>longitude（经度）：{{ item.longitude }}</div>-->
<!--          <div>high（高度）：{{ item.high }}</div>-->
<!--          <div>来源：{{ item.sourceUrl }}</div>-->
<!--          <el-button type="text" @click="onView(item)">详情</el-button>-->
<!--        </div>-->
<!--      </div>-->
    </div>
    <!-- 图片流详情 -->
    <imgViewDialog ref="imgViewDialog"></imgViewDialog>
  </div>
</template>

<script>
import { imgSourceDetailApi, imgSourceListApi } from "@/api/system/data_source";
import { alarmListApi } from "@/api/system/alarm";
import imgViewDialog from "../components/imgViewDialog";
import CardItem from "@/views/home/components/cardItem.vue";

export default {
  components: {
    CardItem,
    imgViewDialog,
  },

  data() {
    return {
      activeName: '0',
      timer: null,
      historyData: [],
      imgTabs: [],
      defaultImgTabs: [
        {
          name: '全部',
          id: '0',
        }
      ],
      loading: false,
      tableData: [],
      pagination: {
        current: 1,
        size: 10,
        total: 0,
      },
      columns: [
        { prop: "alertTime", label: "时间", width: "", align: "center" },
        { prop: "content", label: "内容", width: "", align: "center" },
        { prop: "sceneName", label: "场景", width: "", align: "center" },
        // { slot: "action" }, //操作
      ],
    };
  },

  mounted() {
    this.getImgData();
    // this.getData();
    //定时5s拉取信息
    this.timer = setInterval(() => {
      this.getDetail();
      // this.getData();
    }, 10000);
  },

  beforeDestroy() {
    this.clearTimer();
  },

  methods: {
    changeActive(id) {
      this.activeName = id;
      this.clearTimer();
      // this.getData();
      this.$emit('changeClick');
      this.getDetail();
      //定时5s拉取信息
      this.timer = setInterval(() => {
        this.getDetail();
        // this.getData();
      }, 5000);
    },
    //图片流列表
    async getImgData() {
      const res = await imgSourceListApi(2);
      this.imgTabs = this.defaultImgTabs.concat(...res.data.map(i => { return{ ...i, id: i.id + ''}}));
      this.getDetail();
    },

    //首页图片流详情
    getDetail() {
      this.loading = true;
      this.historyData= [];
      imgSourceDetailApi(this.activeName)
        .then((res) => {
          this.loading = false;
          this.historyData = res.data || [];
        })
        .catch(() => {
          this.loading = false;
        });
    },



    onView(item) {
      this.$refs.imgViewDialog.init(item);
    },

    //清除定时器
    clearTimer() {
      window.clearInterval(this.timer);
      this.timer = null;
    },
  },
};
</script>

<style lang="scss" scoped>
.contain {
  width: 100%;
  //height: calc(100vh - 190px);
  height: 100%;
  padding: 36px 0 36px 30px;
  .btn-list {
    display: flex;
    margin-bottom: 12px;
    .btn-list-item {
      cursor: pointer;
      width: 88px;
      height: 32px;
      margin-right: 5.5px;
      text-align: center;
      background: url("./imgs/btn_bg.png") left top no-repeat;
      background-size: 100% 100%;
      color: #90B6ED;
      text-shadow: 3px 3px 0px rgba(2, 12, 23, 0.19);
      font-family: YouSheBiaoTiHei;
      font-size: 18px;
      font-style: normal;
      font-weight: 400;
      line-height: 32px;
    }
    .active {
      color: #F8FBFF;
    }
  }
  .card {
    height: calc(100% - 40px);
    overflow-y: auto;
    //margin-right: 10px;
    padding: 20px 30px 20px 0;
    box-sizing: border-box;
    .card-item {
      border-top: 1px solid rgba(255, 255, 255, 0.10);
      padding-top: 25px ;
      padding-bottom: 31px;

    }
     .card-item-first  {
      border-top: none;
      padding-top: 0 ;

    }

  }

  .pictureBox {
    display: flex;
    margin-bottom: 10px;
    box-sizing: border-box;
    &-left {
      width: 400px;
      height: 250px;
    }
    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
    &-right {
      margin-left: 10px;
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
  }
}
</style>
