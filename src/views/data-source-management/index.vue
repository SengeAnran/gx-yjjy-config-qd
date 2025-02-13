<template>
  <div class="">
<!--    <BaseBlock title="数据源管理" :verticalLine="true" />-->
    <base-panel
      :title-arr="['图片流','视频流']"
      @changeActive="changeActive"
      box-height="calc(100Vh - 180px)"
      contentPadding="27px 66px 10px">
      <image-stream v-if="activeIndex === 0" />
      <video-stream v-if="activeIndex === 1" />
    </base-panel>
<!--    <el-tabs v-model="activeName" @tab-click="handleClick">-->
<!--      <el-tab-pane label="图片流" name="first">-->
<!--       -->
<!--      </el-tab-pane>-->
<!--      <el-tab-pane label="视频流" name="second">-->
<!--       -->
<!--      </el-tab-pane>-->
<!--    </el-tabs>-->
  </div>
</template>
<script>
import ImageStream from "./imageStream.vue";
import videoStream from "./videoStream.vue";

export default {
  name: "index",
  components: { videoStream, ImageStream },
  data() {
    return {
      activeIndex: 0,
    };
  },
  methods: {
    changeActive({item, index}) {
      this.activeIndex = index;
    },
  },
};
</script>

<style scoped lang="scss">
::v-deep .el-tabs__nav-wrap::after {
  background: none;
}
</style>
