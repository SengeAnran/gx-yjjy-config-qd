<template>
  <div>
    <BaseDialog
      append-to-body
      :title="title"
      custom-class="export-dialog"
      :close-on-click-modal="false"
      :visible.sync="visible"
      width="700px"
    >
      <template #default>
        <el-form label-width="120px" :model="formData" ref="formRule" :rules="rules">
          <el-row>
            <el-col :span="12">
              <el-form-item label="视频流名称：" prop="name">
                <el-input v-model="formData.name" placeholder="请输入" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="标签：" prop="boardCardConfTag">
                <el-input v-model="formData.boardCardConfTag" placeholder="请输入" clearable></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="说明：">
                <el-input v-model="formData.description" type="textarea" placeholder="请输入" clearable></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="配置：">
                <div>
                  <div class="flex">
                    <div>
                      <div class="gap group">
                        <div class="flex">
                          <div style="margin-right: 10px; margin-left: 14px">输入地址</div>
                          <div>
                            <div style="margin-bottom: 10px; display: flex">
                              <el-form-item>
                                <el-input
                                  v-model="formData.sourceUri"
                                  placeholder="请输入rtsp地址"
                                  clearable
                                  style="width: 300px"
                                ></el-input>
                                <el-button
                                  style="margin-left: 10px"
                                  plain
                                  type="primary"
                                  size="small"
                                  icon="el-icon-view"
                                  @click="handelView(formData.sourceUri)"
                                  >预览</el-button
                                >
                              </el-form-item>
                            </div>
                          </div>
                        </div>
                        <div class="flex">
                          <div style="margin-right: 10px; margin-left: 14px">输出地址</div>
                          <div>
                            <div style="margin-bottom: 10px; display: flex">
                              <el-form-item>
                                <el-input
                                  v-model="formData.targetUri"
                                  placeholder="请输入输出地址"
                                  clearable
                                  style="width: 300px"
                                ></el-input>
                              </el-form-item>
                              <!-- <el-button
                                style="margin-left: 10px"
                                plain
                                type="primary"
                                size="small"
                                icon="el-icon-view"
                                @click="handelView(formData.targetUri)"
                                >预览</el-button
                              > -->
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </template>
      <template #footer>
        <el-button type="info" icon="el-icon-circle-close" @click="visible = false">取消</el-button>
        <el-button type="primary" icon="el-icon-circle-check" @click="onSure">确定</el-button>
      </template>
    </BaseDialog>
<!--    <VideoView ref="VideoView"></VideoView>-->
  </div>
</template>

<script>
// import VideoView from "@/views/components/videoViewDialog";
import { addSourceApi, editSourceApi } from "@/api/system/data_source";
export default {
  // components: {
  //   VideoView,
  // },
  data() {
    return {
      visible: false,
      title: "新增数据源分组信息",
      formData: {},
      rules: {
        name: [
          { required: true, message: "请输入", trigger: "blur" },
          { min: 1, max: 20, message: "长度在 1 到 20 个字符", trigger: "blur" },
        ],
        deviceType: [
          { required: true, message: "请输入", trigger: "blur" },
          { min: 1, max: 20, message: "长度在 1 到 20 个字符", trigger: "blur" },
        ],
        boardCardConfTag: [
          { required: true, message: "请输入", trigger: "blur" },
          // {
          //   pattern: /^((25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))$/,
          //   message: "请输入正确的IP地址",
          //   trigger: "blur",
          // },
          // { min: 7, max: 15, message: "长度在 7 到 15 个字符", trigger: "blur" },
        ],
      },
    };
  },

  methods: {
    init(row) {
      this.visible = true;
      if (row && row.id) {
        this.formData = { ...row };
        this.title = "修改视频流信息";
      } else {
        this.formData = {};
        this.title = "新增视频流信息";
      }
    },

    onSure() {
      this.$refs.formRule.validate((valid) => {
        if (valid) {
          if (this.formData.id) {
            editSourceApi({ ...this.formData, type: 1 }).then((res) => {
              if (res.code == 200) {
                this.$message.success("操作成功!");
                this.visible = false;
                this.$emit("getData");
              }
            });
          } else {
            addSourceApi({ ...this.formData, type: 1 }).then((res) => {
              if (res.code == 200) {
                this.$message.success("操作成功!");
                this.visible = false;
                this.$emit("getData");
              }
            });
          }
        } else {
          return false;
        }
      });
    },
    //预览
    handelView(url) {
      // this.$refs.VideoView.init(url);
      this.$emit('showDetail',url)
    },
  },
};
</script>

<style lang="scss" scoped>
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
