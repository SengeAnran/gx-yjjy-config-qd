<template>
  <div>
    <!--   width="1000px" -->
    <BaseDialog
      append-to-body
      :title="title"
      custom-class="export-dialog"
      :close-on-click-modal="false"
      :visible.sync="visible"
      width="500px"
    >
      <template #default>
        <el-form label-width="110px" :model="formData" ref="formRule" :rules="rules">
          <el-row>
            <el-col :span="24">
              <el-form-item label="图片流名称：" prop="name">
                <el-input v-model="formData.name" placeholder="请输入" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">

              <el-form-item label="标签：" prop="boardCardConfTag">
                <el-input v-model="formData.boardCardConfTag" placeholder="请输入" clearable></el-input>
<!--                <el-select v-model="formData.boardCardConfTag" placeholder="请选择" style="width: 100%">-->
<!--                  <el-option label="水域" value="水域"></el-option>-->
<!--                  <el-option label="空地" value="空地"></el-option>-->
<!--                  <el-option label="电塔" value="电塔"></el-option>-->
<!--                </el-select>-->
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-form-item label="接收地址：" prop="targetUri">
              <el-input v-model="formData.targetUri" placeholder="请输入" clearable></el-input>
            </el-form-item>
            <el-form-item label="说明：">
              <el-input v-model="formData.description" type="textarea" placeholder="100字符内" clearable></el-input>
            </el-form-item>
          </el-row>
        </el-form>
      </template>
      <template #footer>
        <el-button type="info" icon="el-icon-circle-close" @click="visible = false">取消</el-button>
        <el-button type="primary" icon="el-icon-circle-check" @click="onSure">确定</el-button>
      </template>
    </BaseDialog>
  </div>
</template>

<script>
import { addSourceApi, editSourceApi } from "@/api/system/data_source";
export default {
  data() {
    return {
      visible: false,
      title: "",
      formData: {},
      rules: {
        name: [
          { required: true, message: "请输入", trigger: "blur" },
          { min: 1, max: 20, message: "长度在 1 到 20 个字符", trigger: "blur" },
        ],
        targetUri: [{ required: true, message: "请输入", trigger: "blur" }],
        boardCardConfTag: [{ required: true, message: "请输入", trigger: "change" }],
        // boardCardPort: [
        //   { required: true, message: "请输入", trigger: "blur" },
        //   { pattern: /\b(?:[1-9]\d{1,4}|99999)\b/, message: "请输入正确的端口", trigger: "blur" },
        // ],
      },
    };
  },

  methods: {
    init(row) {
      this.visible = true;
      if (this.$refs.formRule) {
        this.$refs.formRule.resetFields();
      }
      if (row && row.id) {
        this.formData = { ...row };
        this.title = "修改图片流信息";
      } else {
        this.formData = {};
        this.title = "新增图片流信息";
      }
    },

    onSure() {
      this.$refs.formRule.validate((valid) => {
        if (valid) {
          if (this.formData.id) {
            editSourceApi({ ...this.formData, type: 2 }).then((res) => {
              if (res.code == 200) {
                this.$message.success("操作成功!");
                this.visible = false;
                this.$emit("getData");
              }
            });
          } else {
            addSourceApi({ ...this.formData, type: 2 }).then((res) => {
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
