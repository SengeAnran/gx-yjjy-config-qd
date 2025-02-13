<template>
  <div class="container">
    <el-row :gutter="26" >
      <el-col :span="14">
        <base-panel :title-arr="['图片流','视频流']" @changeActive="changeActive" box-height="calc(100Vh - 180px)">
          <image-stream v-if="activeIndex === 0" :activeTab="activeIndex" />
          <live-video v-if="activeIndex === 1" :activeTab="activeIndex" />
        </base-panel>
      </el-col>
      <el-col :span="10">
        <base-panel :title-arr="[rightTextName]"  box-height="calc(100Vh - 180px)">
          <records ref="records" :get-method="getMethod" />
        </base-panel>
      </el-col>
    </el-row>

<!--    <BaseBlock title="首页" :verticalLine="true" />-->
<!--    <el-tabs v-model="activeIndex">-->
<!--      <el-tab-pane label="图片流" name="2">-->
<!--       -->
<!--      </el-tab-pane>-->
<!--      <el-tab-pane label="视频流" name="1">-->
<!--      -->
<!--      </el-tab-pane>-->
<!--    </el-tabs>-->
  </div>
</template>
<script>
import ImageStream from "./imageStream.vue";
import LiveVideo from "./liveVideo.vue";
import Records from "@/views/home/components/records.vue";
import {alarmListApi} from "@/api/system/alarm";

export default {
  name: "index",
  components: {Records, LiveVideo, ImageStream },
  data() {
    return {
      activeIndex: 0,
      rightTextName: '图片处理记录',
      getMethod: alarmListApi,
    };
  },
  methods: {
    changeActive({item, index}) {
      this.activeIndex = index;
      this.rightTextName = index === 0 ? '图片处理记录': '视频处理记录';
      this.$refs.records.changeActive(index);
    }
  }
};
</script>
