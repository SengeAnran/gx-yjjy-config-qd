<template>
  <div class="container">
    <div class="box">
      <div class="box-left">
        <div class="box-line">
          <div class="btn-list">
            <div
              class="btn-list-item"
              :class="{active: activeName === item.id}"
              v-for="item in cardData"
              :key="item.id"
              @click="changeActive(item.id)">
              {{item.name}}
            </div>
          </div>
<!--          <el-tabs v-model="activeName" @tab-click="handleClick">-->
<!--            <el-tab-pane-->
<!--              v-for="(item, index) in cardData"-->
<!--              :label="item.name"-->
<!--              :name="String(item.id)"-->
<!--              :key="item.id"-->
<!--            ></el-tab-pane>-->
<!--          </el-tabs>-->
          <div class="live" v-loading="videoLoad">
            <div v-for="(item, index) in cardConf" :key="item.id" class="mr20 mb20 live-item">
              <div class="live-pos">
                <video
                  class="player"
                  ref="LivePlayer"
                  :id="'LivePlayer' + index"
                  muted
                  autoplay
                  preload="auto"
                  loop
                  @dblclick="dblclick(item)"
                  aria-disabled="disabled"
                ></video>
                <!-- <div class="overlay" v-show="showOverlay" style="opacity: 0.5"></div> -->
<!--                <div class="live-full">-->
<!--                  <span class="el-icon-full-screen" title="放大" @click="handleFull(item)"></span>-->
<!--                </div>-->
                <div class="play-icon"  @click="handleFull(item)">
                  <img src="./imgs/play.png" title="放大播放" alt="">
                </div>

                <!--<div class="live-btm">
                  <el-tag size="mini" effect="dark">{{item.tag}}</el-tag>
                  <template v-if="deviceState=='在线'?true:false">
                    <span>状态：{{deviceState}}</span>
                    <span class="el-icon-circle-check" style="color:#67C23A"></span>
                  </template>
                  <template v-else>
                    <span>状态：{{deviceState}}</span>
                    <span class="el-icon-warning-outline" style="color:#F56C6C"></span>
                  </template>
                </div>-->
              </div>
              <!--<div class="wrap">{{item.sourceUri}}</div>-->
              <div class="wrap">{{ item.targetUri }}</div>
            </div>
          </div>
        </div>
      </div>
      <!--      <div class="box-right">-->
      <!--        <div class="all">-->
      <!--          <div class="box-warm">识别记录</div>-->
      <!--          <div class="box-all">-->
      <!--            <el-button type="primary" size="mini" @click="handleAll">-->
      <!--              查看全部-->
      <!--              <i class="el-icon-arrow-right el-icon&#45;&#45;right"></i>-->
      <!--            </el-button>-->
      <!--          </div>-->
      <!--        </div>-->
      <!--        <BaseTable-->
      <!--          style="height: calc(100% - 94px);"-->
      <!--          v-loading="loading"-->
      <!--          :tableDate="tableData"-->
      <!--          rowKeyId="id"-->
      <!--          :pagination="pagination"-->
      <!--          :columns="columns"-->
      <!--          :boder="false"-->
      <!--          layout="total"-->
      <!--          @getData="getData"-->
      <!--        >-->
      <!--          <el-table-column slot="action" label="操作" align="center">-->
      <!--            <template slot-scope="scope">-->
      <!--              <el-tooltip content="详情" placement="top">-->
      <!--                <img-->
      <!--                  src="@/assets/button/threshold.png"-->
      <!--                  @click="details(scope.row,scope.$index)"-->
      <!--                  class="myButton"-->
      <!--                >-->
      <!--              </el-tooltip>-->
      <!--            </template>-->
      <!--          </el-table-column>-->
      <!--        </BaseTable>-->
      <!--      </div>-->
    </div>

    <!-- 详情 -->
    <add-update ref="AddUpdate"></add-update>
    <!-- 全部 -->
    <all-list ref="AllList"></all-list>
    <!-- 放大 -->
    <VideoFull ref="VideoFull"></VideoFull>
  </div>
</template>

<script>
import AddUpdate from "@/views/alarm-log/components/add-update";
import AllList from "./components/all-list";
import VideoFull from "@/views/components/videoViewDialog";

import { dataSourceListApi, dataSourceConfListApi } from "@/api/system/data_source";

import { alarmListApi } from "@/api/system/alarm";
import flvjs from "flv.js";
export default {
  name: "liveVideo",
  components: {
    AddUpdate,
    AllList,
    VideoFull,
  },
  provide() {
    return {
      getFData: this.getData,
      fShowOverlay: this.showVideo,
    };
  },
  data() {
    return {
      rtsp: "rtsp://admin:gx123456@192.168.1.154:554/h264/ch1/main/av_stream", //视频配置
      player: [],
      activeName: 0,
      loading: false,
      videoLoad: false,
      showOverlay: false,
      deviceState: "", //设备状态
      cardData: [], //板卡列表
      cardConf: [], //板卡配置
      tableData: [],
      dictList: {},
      currentTabId: null,
      timer: null,
      pagination: {
        current: 1,
        size: 10,
        total: 0,
      },
      columns: [
        {
          prop: "alertTime",
          label: "报警时间",
          align: "center",
        },
        { prop: "sceneName", label: "场景", width: "", align: "center" },
        { prop: "content", label: "内容", width: "", align: "center" },
        { slot: "action" }, //操作
      ],
    };
  },

  async mounted() {
    const res = await dataSourceListApi(1);
    this.cardData = res.data || [];
    if (this.cardData.length) {
      this.activeName = this.cardData[0].id;
      this.getCard();
    }
    //定时5s拉取信息
    // this.timer = setInterval(() => {
    //   this.getCard();
    // }, 5000);
  },

  // beforeDestroy() {
  //   this.clearTimer();
  // },

  destroyed() {
    if (this.player) {
      this.player.forEach((item, index) => {
        this.player[index].pause(); //暂停播放
        this.player[index].unload(); //取消数据流加载
        this.player[index].detachMediaElement(); //将播放实例从节点抽出
        this.player[index].destroy(); //销毁播放实例
        this.player[index] = null;
      });
    }
  },

  methods: {
    showVideo() {
      this.showOverlay = false;
    },
    //右侧表格数据
    getData(id) {
      this.loading = true;
      alarmListApi({ linkDeviceId: id })
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
    //详情
    details(item) {
      this.$refs.AddUpdate.init(item, this.currentTabId);
    },
    //放大
    handleFull(item) {
      this.$refs.VideoFull.init(item.targetUri);
      this.showOverlay = true;
    },

    handleAll() {
      this.$router.push("/layout/alarm-log");
    },

    //板卡配置信息
    getCard(id) {
      this.videoLoad = true;
      dataSourceConfListApi({ id: this.activeName })
        .then((res) => {
          if (res.code == 200) {
            this.cardConf = res.data.boardCardConfs;
            this.handlePlay();
          }
          this.videoLoad = false;
        })
        .catch(() => {
          this.videoLoad = false;
        });
    },

    //播放
    handlePlay() {
      this.videoLoad = true;
      // 记录视频加载状态
      if (flvjs.isSupported()) {
        // let arr = [1, 2, 3, 4, 5];
        this.cardConf.forEach((item, index) => {
          //获取播放最新视频的video标签
          this.$nextTick(() => {
            let video = document.getElementById("LivePlayer" + index);

            if (!video) return;
            //给最新视频的video标签设置资源链接
            // video.src = item.sourceUri;
            video.src = item.targetUri;
            //实况画面是http视频地址，无需转换
            // if(videoPlayerRef === 'LivePlayer') return

            //销毁上一个与ffmpeg的socket连接
            let player = null;

            player && player.destroy();

            // 通过socket连接ffmpeg接收ffmpeg转换的flv视频流
            player = flvjs.createPlayer({
              type: "flv", //媒体类型flv或mp4
              isLive: true, //是否为直播流
              // url: `ws://localhost:8888/rtsp/${this.id}/?url=${rtsp}`
              url: `ws://localhost:8888/rtsp/LivePlayer${index}/?url=${
                //  item.sourceUri
                item.targetUri
              }`, //视频流地址
            });
            player.attachMediaElement(video);

            this.player.push(player);

            //加载并播放视频
            try {
              player.load();
              setTimeout(() => {
                player.play();
                this.videoLoad = false;
              }, 2000);
            } catch (error) {
              this.videoLoad = false;
            }
          });
        });
      }
    },

    //双击
    dblclick(item) {
      this.$refs.VideoFull.init(item.targetUri);
    },
    changeActive(id) {
      this.activeName = id;
      this.getCard();
      //定时5s拉取信息
      // this.timer = setInterval(() => {
      //   this.getCard();
      // }, 5000);
    },

    //清除定时器
    // clearTimer() {
    //   window.clearInterval(this.timer);
    //   this.timer = null;
    // },
  },
};
</script>

<style lang="scss" scoped>
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
.box {
  display: flex;
  width: 100%;
  height: calc(100% - 40px);
  padding: 36px 0 36px 30px;
  &-left {
    //width: 64%;
    width: 100%;
    height: 100%;
  }

  &-vid {
    margin: 20px 0;
    width: 80px;
    height: 40px;
    text-align: center;
    line-height: 40px;
    border-bottom: 2px solid rgb(0, 143, 224);
    font-weight: bold;
  }
  &-line {
    //height: calc(100% - 94px);
    //border-right: 2px solid rgb(223, 227, 238);
    // padding: 10px 20px;
  }

  &-right {
    width: 36%;
    height: 100%;
    margin-left: 20px;
  }

  &-warm {
    margin: 20px 0;
    width: 80px;
    height: 40px;
    text-align: center;
    line-height: 40px;
    border-bottom: 2px solid rgb(0, 143, 224);
    font-weight: bold;
  }

  &-all {
    margin: 20px 0;
    width: 80px;
    height: 40px;
    text-align: center;
    line-height: 40px;
    margin-right: 20px;
  }
}
.live {
  width: 100%;
  //height: calc(100% - 64px);
  display: flex;
  align-content: flex-start;
  flex-wrap: wrap;
  //overflow: auto;
  font-size: 14px;
  .live-item {

  }
  &-full {
    position: absolute;
    color: #fff;
    top: 8px;
    right: 8px;
    font-size: 28px;
    cursor: pointer;

  }
  .play-icon {
    width: 57px;
    height: 57px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    cursor: pointer;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &-pos {
    position: relative;
    margin: 10px;
    background: url("./imgs/video_bg.png") left top no-repeat;
    background-size: 100% 100%;
  }
  &-btm {
    position: absolute;
    bottom: 20px;
    width: 305px;
    text-align: center;
    margin: 0 auto;
    font-size: 14px;
    .el-tag {
      margin: 0 10px;
    }
  }
}

.wrap {
  width: 305px;
  margin-left: 10px;
  // white-space: pre-wrap;
  word-break: break-all;
}
.player {
  // width: 305px;
  // height: 200px;
  width: 350px;
  height: 220px;
  //border: 2px solid #ced3e0;
  object-fit: contain;
}

.all {
  display: flex;
  justify-content: space-between;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgb(0, 0, 0, 1);
  pointer-events: none;
}
</style>
