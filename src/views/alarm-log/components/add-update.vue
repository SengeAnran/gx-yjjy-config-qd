<template>
  <BaseDialog
    append-to-body
    :title="title"
    custom-class="export-dialog"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="800px"
  >
    <template #default>
      <div class="bottom">告警信息</div>
      <el-form label-width="120px" :model="formData" ref="formRule">
        <el-row>
          <el-col :span="12">
            <el-form-item label="识别时间：">
              <span>{{ formData.alertTime }}</span>
            </el-form-item>
            <el-form-item label="关联模型：">
              <span>{{ formData.linkModelName }}</span>
            </el-form-item>
            <el-form-item label="来源：">
              <span>{{ formData.sourceUrl }}</span>
            </el-form-item>

          </el-col>
          <el-col :span="12">
            <el-form-item label="场景：">
              <span>{{ formData.sceneName }}</span>
            </el-form-item>
            <el-form-item label="标签：">
              <span>{{ formData.dataStreamName }}</span>
            </el-form-item>

            <el-form-item label="帧数：">
              <span>{{ formData.frameId }}</span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
<!--      <div class="bottom">实时画面</div>-->
      <div class="photo">
        <img :src="formData.actualPicBase64" alt="图片" />
      </div>
      <el-form label-width="120px" style="margin-top: 28px" :model="formData" ref="formRule">
        <el-row>
          <el-col :span="12">
            <el-form-item label="目标种类：">
              <span>{{ formData.content }}</span>
            </el-form-item>

          </el-col>
          <el-col :span="12">
            <el-form-item label="目标像素坐标：">
              <span>{{ formData.bbox }}</span>
            </el-form-item>

          </el-col>
        </el-row>
      </el-form>
    </template>
    <template #footer>
      <el-button type="primary" icon="el-icon-circle-close" @click="visible = false">关闭</el-button>
    </template>
  </BaseDialog>
</template>

<script>
import { detailsApi } from "@/api/system/alarm";
export default {
  data() {
    return {
      visible: false,
      title: "识别记录详情",
      formData: {},
    };
  },
  methods: {
    init(row) {
      console.log(row);
      this.visible = true;
      this.formData = row;
    },
  },
};
</script>

<style lang="scss" scoped>
.bottom {
  color: rgb(0, 143, 224);
  font-weight: bold;
  margin-bottom: 15px;
}
.photo {
  width: 700px;
  height: 400px;
  margin: 0 auto;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
.el-form-item {
  margin-bottom: 0px;
}
</style>
