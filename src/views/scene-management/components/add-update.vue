<template>
  <BaseDialog
    append-to-body
    :title="title"
    custom-class="export-dialog"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="1000px"
  >
    <template #default>
      <el-form label-width="120px" :model="formData" ref="formRule" :rules="rules">
        <el-row>
          <el-col :span="12">
            <el-form-item label="场景名称：" prop="name">
              <el-input v-model="formData.name" placeholder="请输入" clearable></el-input>
            </el-form-item>
            <el-form-item label="说明：">
              <el-input v-model="formData.remark" placeholder="请输入" clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- <el-row>
          <el-col :span="12">
            <el-form-item label="数据流类型：" prop="state">
              <el-select v-model="formData.type" placeholder="请选择" style="width: 100%">
                <el-option label="启动" value="启动"></el-option>
                <el-option label="停止" value="停止"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row> -->
        <el-row>
          <el-col :span="24">
            <el-form-item label="关联数据源：" prop="sceneCardConfs">
              <div>
                <el-tabs v-model="activeName" @tab-click="handleClick">
                  <el-tab-pane label="图片流" name="2"></el-tab-pane>
                  <el-tab-pane label="视频流" name="1"></el-tab-pane>
                </el-tabs>
              </div>
              <div>
                <el-button icon="el-icon-plus" circle size="mini" type="primary" @click="addGroup"></el-button>
              </div>
              <!-- <div style="max-height: 330px; overflow: auto"> -->
              <div>
                <div class="box" v-for="(item, index) in formData.sceneCardConfs" :key="`card-${index}`">
                  <div style="margin: 36px 10px 0 0">
                    <el-button
                      icon="el-icon-minus"
                      circle
                      size="mini"
                      type="danger"
                      @click="minusGroup(index)"
                    ></el-button>
                  </div>
                  <div>
                    <div>配置{{ index + 1 }}</div>
                    <div class="group">
                      <div>
                        <span v-if="activeName == 1">视频流配置</span>
                        <span v-else>图片流配置</span>
                        <el-select
                          v-model="item.boardCardConfId"
                          placeholder="请选择"
                          style="margin: 0 10px; width: 250px"
                          @change="(ev) => changeCard(ev, index)"
                        >
                          <el-option
                            v-for="itemConfig in cardData"
                            :label="itemConfig.name"
                            :value="itemConfig.boardConfId"
                            :key="itemConfig.id"
                          ></el-option>
                        </el-select>
                        <el-input v-model="item.boardCardConfTag" placeholder="自动写入" disabled style="width: 200px">
                        </el-input>
                      </div>
                      <div class="gap">
                        <div class="flex">
                          <div style="margin-left: 13px">模型配置</div>
                          <div>
                            <div v-for="(modelItem, ind) in item.sceneCardConfModels" class="mb10">
                              <el-select
                                v-model="modelItem.modelId"
                                placeholder="请选择模型"
                                style="margin-left: 10px; width: 250px"
                                @change="(ev) => changeModel(ev, index, ind)"
                              >
                                <el-option
                                  v-for="itemConfig in modelData"
                                  :label="itemConfig.name"
                                  :value="itemConfig.id"
                                  :key="itemConfig.id"
                                ></el-option>
                              </el-select>
                              <el-button
                                icon="el-icon-minus"
                                circle
                                size="mini"
                                type="danger"
                                class="btn"
                                @click="minusModel(index, ind)"
                              ></el-button>
                              <template v-if="item.sceneCardConfModels.length == ind + 1">
                                <el-button
                                  icon="el-icon-plus"
                                  circle
                                  size="mini"
                                  type="primary"
                                  class="btn"
                                  @click="addModel(index, ind)"
                                ></el-button>
                              </template>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </el-form-item>
            <!--            </el-form-item>-->
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="配置示意图：">
              <div class="outside">
                <div class="process" v-for="(item, index) in formData.sceneCardConfs">
                  <div>数据流{{ index + 1 }}</div>
                  <div class="process-mark">
                    <div
                      v-for="(modelItem, ind) in item.sceneCardConfModels"
                      :key="ind"
                      class="flex"
                      style="margin: 5px 0"
                    >
                      <div class="center" v-if="ind != 0">
                        <div class="arrow"></div>
                      </div>
                      <template v-if="!!modelItem.modelName">
                        <div class="process-box">{{ modelItem.modelName }}</div>
                      </template>
                      <template v-else>
                        <div class="process-box">模型XXXX</div>
                      </template>
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
</template>

<script>
import { cardListApi, cardConfListApi } from "@/api/system/aicard";
import { SourceListApi } from "@/api/system/data_source";
import { detailsApi, sceneModelListApi, addSceneApi, updateSceneApi, modelListApi } from "@/api/system/scene";

export default {
  data() {
    return {
      visible: false,
      activeName: "2",
      title: "新增场景信息",
      cardData: [], //板卡
      cardConfig: [], //板卡配置
      modelData: [], //模型列表
      formData: {
        sceneCardConfs: [
          {
            sceneCardConfModels: [{}], //场景板卡配置模型
          },
        ], //场景板卡配置
        type: null,
      },
      rules: {
        name: [
          { required: true, message: "请输入", trigger: "blur" },
          // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        state: [{ required: true, message: "请选择", trigger: "change" }],
        sceneCardConfs: [{ required: true, message: "请补全相关配置", trigger: "blur" }],
      },
    };
  },
  methods: {
    init(row) {
      this.visible = true;
      this.formData = {};
      if (this.$refs.formRule) {
        this.$refs.formRule.resetFields();
      }
      if (row && row.id) {
        this.title = "修改场景信息";
        detailsApi(row.id).then((res) => {
          this.formData = res.data;
          this.activeName = String(this.formData.type);
          this.getModel();
        });
      } else {
        this.formData = {
          sceneCardConfs: [
            {
              sceneCardConfModels: [{}],
            },
          ],
        };
      }
      this.getCard();
    },

    //获取数据流
    getCard() {
      SourceListApi(this.activeName).then((res) => {
        this.cardData = res.data || [];
      });
    },
    //获取板卡详细信息
    // async changeCard(id, ind) {
    //   let res = await cardConfListApi({ boardCardId: id });
    //   this.cardConfig = res.rows;
    //   this.cardData.forEach((item, index) => {
    //     if (item.id == id) {
    //       this.formData.sceneCardConfs[ind].boardCardName = item.name;
    //       this.formData.sceneCardConfs[ind].sceneCardConfModels = [{ modelId: "" }];
    //     }
    //   });
    //   this.$set(this.formData.sceneCardConfs[ind], "boardCardConfId", "");
    //   this.formData.sceneCardConfs[ind].boardCardConfTargetUri = "";
    //   this.getModel(id);
    // },

    changeCard(id, ind) {
      this.cardData.forEach((item, index) => {
        if (item.boardConfId == id) {
          this.formData.sceneCardConfs[ind].boardCardConfTag = item.boardCardConfTag;
          this.formData.sceneCardConfs[ind].boardCardConfTargetUri = item.targetUri;
          this.formData.sceneCardConfs[ind].boardCardConfSourceUri = item.sourceUri;
        }
      });
      this.getModel();
    },
    async getModel() {
      let res = await modelListApi();
      this.modelData = res.data;
    },

    //模型选择
    changeModel(id, ind1, ind2) {
      this.modelData.forEach((item) => {
        if (item.id == id) {
          this.formData.sceneCardConfs[ind1].sceneCardConfModels[ind2].modelName = item.name;
        }
      });
    },
    onSure() {
      this.$refs.formRule.validate((valid) => {
        if (valid) {
          if (this.formData.id) {
            updateSceneApi({ ...this.formData, type: this.activeName }).then((res) => {
              if (res.code == 200) {
                this.$message.success("操作成功!");
                this.visible = false;
                this.$emit("getData");
              }
            });
          } else {
            addSceneApi({ ...this.formData, type: this.activeName }).then((res) => {
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
    //新增组
    addGroup() {
      if (this.formData.sceneCardConfs.length > 0) {
        if (
          // !this.formData.sceneCardConfs[this.formData.sceneCardConfs.length - 1].boardCardId ||
          !this.formData.sceneCardConfs[this.formData.sceneCardConfs.length - 1].boardCardConfId ||
          !this.formData.sceneCardConfs[this.formData.sceneCardConfs.length - 1].sceneCardConfModels[
            this.formData.sceneCardConfs[this.formData.sceneCardConfs.length - 1].sceneCardConfModels.length - 1
          ].modelId
        ) {
          return this.$message.warning(`请先补全相关配置，再添加！`);
        }
      }

      this.formData.sceneCardConfs.push({ sceneCardConfModels: [{ modelId: "" }] });
    },

    addModel(index, ind) {
      if (!this.formData.sceneCardConfs[index].sceneCardConfModels[ind].modelId) {
        return this.$message.warning("请选择模型！");
      }
      this.formData.sceneCardConfs[index].sceneCardConfModels.push({ modelId: "" });
    },
    minusGroup(index) {
      if (this.formData.sceneCardConfs.length == 1) {
        return this.$message.warning("至少保留一项板卡配置！");
      }
      this.formData.sceneCardConfs.splice(index, 1);
    },

    minusModel(index, ind) {
      if (this.formData.sceneCardConfs[index].sceneCardConfModels.length == 1) {
        return this.$message.warning("至少保留一项模型配置！");
      }
      this.formData.sceneCardConfs[index].sceneCardConfModels.splice(ind, 1);
    },
    handleClick(ev) {
      // if (ev.name == this.activeName) return;
      this.formData = {
        ...this.formData,
        sceneCardConfs: [
          {
            sceneCardConfModels: [{}],
          },
        ],
      };
      this.getCard();
    },
  },
};
</script>

<style lang="scss" scoped>
.gap {
  margin-top: 10px;
}
.group {
  padding: 10px 10px 0 10px;
  margin-bottom: 10px;
  border: 2px dashed rgb(223, 227, 238);
  box-sizing: border-box;
}
.btn {
  margin-left: 10px;
}
.box {
  display: flex;
}
.outside {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  align-content: flex-start;
  // max-height: 230px;
  // overflow: auto;
}

.process {
  margin-bottom: 10px;
  margin-right: 10px;
  border: 2px solid rgb(223, 227, 238);
  border-radius: 8px;
  padding: 0 10px;
  height: 220px;
  box-sizing: border-box;
  &-mark {
    width: 360px;
    height: 168px;
    overflow: auto;
    border: 2px dashed rgb(223, 227, 238);
    padding: 10px;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
  }

  &-box {
    padding: 0 5px;
    height: 40px;
    color: #fff;
    background: rgb(54, 124, 208);
    line-height: 40px;
  }
}
.center {
  width: 60px;
  height: 40px;
  display: flex;
  margin-left: 10px;
  align-items: center;
}

//箭头
.arrow {
  line-height: 50px;
  display: inline-block;
  height: 10px;
  width: 30px;
  background: rgb(54, 124, 208);
  position: relative;
}
.arrow::before {
  position: absolute;
  content: "";
  width: 0;
  height: 0;
  border: 20px solid transparent;
  border-left: 20px solid rgb(54, 124, 208);
  left: 30px;
  top: -15px;
}
::v-deep .el-dialog__body {
  padding: 30px 20px 0 20px;
}

::v-deep .el-tabs__nav-wrap::after {
  background: none;
}
</style>
