<template>
  <BaseDialog
    append-to-body
    :title="title"
    custom-class="export-dialog"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="800px"
    @close="close"
  >
    <div>
      <div>视频地址：{{ rtsp }}</div>
      <div v-loading="loading">
        <video ref="LivePlayer" id="LivePlayer" autoplay muted class="player" preload="auto" loop />
      </div>
    </div>
    <template slot="footer">
      <el-button type="primary" icon="el-icon-circle-close" @click="close">关闭</el-button>
    </template>
  </BaseDialog>
</template>

<script>
import flvjs from "flv.js";

export default {
  data() {
    return {
      title: "视频信息",
      visible: false,
      rtsp: "rtsp://admin:gx123456@192.168.1.154:554/h264/ch1/main/av_stream", //视频配置
      player: null,
      loading: false,
    };
  },
  methods: {
    init(url) {
      this.visible = true;
      this.rtsp = url;
      this.$nextTick(() => {
        this.handlePlay();
      });
    },
    //视频播放
    handlePlay(item) {
      this.loading = true;
      // 记录视频加载状态
      if (flvjs.isSupported()) {
        let player = null;
        //获取播放最新视频的video标签
        let video = document.getElementById("LivePlayer");

        if (!video) return;
        //给最新视频的video标签设置资源链接
        video.src = this.rtsp;
        //实况画面是http视频地址，无需转换
        // if(videoPlayerRef === 'LivePlayer') return

        //销毁上一个与ffmpeg的socket连接
        player && player.destroy();

        // 通过socket连接ffmpeg接收ffmpeg转换的flv视频流
        player = flvjs.createPlayer({
          type: "flv", //媒体类型flv或mp4
          isLive: true, //是否为直播流
          // url: `ws://localhost:8888/rtsp/${this.id}/?url=${rtsp}`
          url: `ws://localhost:8888/rtsp/LivePlayer/?url=${this.rtsp}`, //视频流地址
        });
        player.attachMediaElement(video);
        this.player = player;

        //加载并播放视频
        try {
          player.load();
          setTimeout(() => {
            player.play();
            this.loading = false;
          }, 2000);
        } catch (error) {
          console.log(error);
          this.loading = false;
        }
      }
    },
    //关闭
    close() {
      this.visible = false;
      this.player.pause(); //暂停播放
      this.player.unload(); //取消数据流加载
      this.player.detachMediaElement(); //将播放实例从节点抽出
      this.player.destroy(); //销毁播放实例
      this.player = null;
    },
  },
};
</script>

<style lang="scss" scoped>
.player {
  width: 100%;
  height: 400px;
  border: 2px solid #ced3e0;
  margin-top: 10px;
  object-fit: contain;
}
</style>
