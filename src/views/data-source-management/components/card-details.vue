<template>
  <div>
    <BaseDialog
      append-to-body
      :title="title"
      custom-class="export-dialog"
      :close-on-click-modal="false"
      :visible.sync="visible"
      width="1000px"
    >
      <template #default>
        <el-form label-width="120px" :model="formData" ref="formRule">
          <el-row>
            <el-col :span="12">
              <el-form-item label="分组名称：" prop="name">
                <span>{{ formData.name }}</span>
              </el-form-item>
              <el-form-item label="分组说明：">
                <span>{{ formData.remark }}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="数据源配置：">
                <div>
                  <span>（最多只能配置5个）</span>
                </div>
                <div style="max-height: 330px; overflow: auto">
                  <div class="flex" v-for="(item, index) in formData.boardCardConfs">
                    <div style="margin: 36px 10px 0 0"></div>
                    <div>
                      <div>配置{{ index + 1 }}</div>
                      <div class="gap group">
                        <div class="flex">
                          <div style="margin-right: 10px; margin-left: 14px">输入源</div>
                          <div>
                            <div style="margin-bottom: 10px">
                              <el-input
                                disabled
                                v-model="item.sourceUri"
                                placeholder="请输入rtsp地址"
                                clearable
                                style="width: 300px"
                              ></el-input>
                              <el-input
                                disabled
                                v-model="item.tag"
                                placeholder="标签（20字符内）"
                                clearable
                                style="width: 200px; margin: 0 10px"
                              ></el-input>
                              <el-button
                                plain
                                type="primary"
                                size="small"
                                icon="el-icon-view"
                                @click="handelView(item.sourceUri)"
                                >预览</el-button
                              >
                            </div>
                          </div>
                        </div>
                        <div class="flex" style="margin-top: 5px">
                          <div style="margin-right: 10px">输出地址</div>
                          <el-input
                            disabled
                            v-model="item.targetUri"
                            placeholder="请输入输出地址"
                            clearable
                            style="width: 300px"
                          ></el-input>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </el-form-item>
            </el-col>
          </el-row>

          <el-form-item label="关联模型：">
            <div class="line">
              <el-tag style="margin: 0 10px 10px 0" v-for="item in formData.models" :key="item.id" size="medium">{{
                item.name
              }}</el-tag>
            </div>
          </el-form-item>
        </el-form>
      </template>
      <template #footer>
        <el-button type="primary" icon="el-icon-circle-close" @click="visible = false">关闭</el-button>
      </template>
    </BaseDialog>
    <video-view ref="VideoView"></video-view>
  </div>
</template>

<script>
import VideoView from "@/views/components/videoViewDialog";
import { detailsApi } from "@/api/system/data_source";
export default {
  components: {
    VideoView,
  },
  data() {
    return {
      visible: false,
      title: "查看数据源分组信息",
      formData: {
        boardCardConfs: [{}], //板卡配置
        models: [{}], //模型配置
      },
    };
  },

  methods: {
    init(row) {
      this.visible = true;
      detailsApi(row.id).then((res) => {
        this.formData = res.data;
      });
    },
    //预览
    handelView(url) {
      console.log(url);
      this.$refs.VideoView.init(url);
    },
  },
};
</script>

<style lang="scss" scoped>
.gap {
  //   margin: 15px 0;
}
.group {
  padding: 12px;
  margin-bottom: 10px;
  border: 2px dashed rgb(223, 227, 238);
}
.btn {
  margin-left: 10px;
}
.line {
  margin-bottom: 10px;
  height: 135px;
  overflow: auto;
}
::v-deep .el-dialog__body {
  padding: 30px 20px 0 20px;
}
</style>
