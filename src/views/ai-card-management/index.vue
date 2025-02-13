<template>
  <div class="container">
    <BaseBlock title="数据流管理" :verticalLine="true" />
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="图片流" name="first">
        <image-stream v-if="activeName === 'first'" />
      </el-tab-pane>
      <el-tab-pane label="视频流" name="second">
        <video-stream v-if="activeName === 'second'" />
      </el-tab-pane>
    </el-tabs>
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
      activeName: "first",
    };
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    },
  },
};
</script>

<style scoped lang="scss">
::v-deep .el-tabs__nav-wrap::after {
  background: none;
}
</style>
