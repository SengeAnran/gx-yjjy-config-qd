<template>
  <div class="container">
    <el-row :gutter="26" >
      <el-col :span="16">
        <base-panel :title-arr="['灾情快报']" @changeActive="changeActive" box-height="calc(100Vh - 180px)">
<!--          <image-stream v-if="activeIndex === 0" :activeTab="activeIndex" />-->
          <disaster-report-detail>

          </disaster-report-detail>
        </base-panel>
      </el-col>
      <el-col :span="8">
        <base-panel :title-arr="['报告记录']"  box-height="calc(100Vh - 180px)">
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
// import ImageStream from "./imageStream.vue";
// import LiveVideo from "./liveVideo.vue";
import Records from "./components/records.vue";
import {alarmListApi} from "@/api/system/alarm";
import DisasterReportDetail from "@/views/DisasterReport/components/DisasterReportDetail.vue";

export default {
  name: "index",
  components: {DisasterReportDetail, Records },
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
