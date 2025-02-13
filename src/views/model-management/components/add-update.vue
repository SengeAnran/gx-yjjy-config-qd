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
      <el-form label-width="100px" :model="formData" ref="formRule" :rules="rules">
        <el-form-item label="模型名称：" prop="name">
          <el-input v-model="formData.name" placeholder="请输入" clearable></el-input>
        </el-form-item>
        <el-form-item label="说明：" prop="remark">
          <el-input type="textarea" v-model="formData.remark" placeholder="请输入" clearable></el-input>
        </el-form-item>
        <el-form-item label="预警级别：" prop="warnLevel">
          <el-select v-model="formData.warnLevel" placeholder="请选择" style="width: 100%">
            <el-option label="高" value="高"></el-option>
            <el-option label="中" value="中"></el-option>
            <el-option label="低" value="低"></el-option>
          </el-select>
        </el-form-item>
<!--        <el-form-item label="标签：" prop="remark">-->
<!--          <el-select v-model="formData.remark" placeholder="请选择" style="width: 100%">-->
<!--            <el-option label="高" value="高"></el-option>-->
<!--          </el-select>-->
<!--        </el-form-item>-->
        <el-form-item label="阈值配置：" prop="valveConf">

          <value-add v-bind:value.sync="formData.valveConf"/>
        </el-form-item>
        <el-form-item label="模型文件：" prop="fileList">
          <file-upload
            :file-type="['pt','onnx','om']"
            v-model="formData.fileList"
            other-query="?bucketName=mode"
          />
        </el-form-item>

      </el-form>
    </template>
    <template #footer>
      <el-button type="info"  @click="visible = false">取消</el-button>
      <el-button type="primary" @click="onSure">确定</el-button>
    </template>
  </BaseDialog>
</template>

<script>
import ValueAddUpdate from "./value-add-update";
import { addModelApi, detailsApi, updateModelApi } from "@/api/system/model";
import ValueAdd from "./value-add.vue";
export default {
  components: {
    ValueAdd,
    ValueAddUpdate,
  },
  data() {
    return {
      visible: false,
      title: "新增模型信息",
      formData: {
        valveConf: "",
        file: '',
        fileList: [],
      },
      rules: {
        name: [
          { required: true, message: "请输入", trigger: "blur" },
          {
            min: 2,
            max: 20,
            message: "长度在 2 到 20 个字符",
            trigger: "blur",
          },
        ],
        warnLevel: [{ required: true, message: "请选择", trigger: "blur" }],
        valveConf: [
          {
            min: 2,
            max: 200,
            message: "长度在 2 到 200 个字符",
            trigger: "blur",
          },
        ],
        fileName: [
          // { required: true, message: "请输入", trigger: "blur" },
          {
            min: 2,
            max: 100,
            message: "长度在 2 到 100 个字符",
            trigger: "blur",
          },
        ],
        remark: [
          // { required: true, message: "请输入", trigger: "blur" },
          {
            min: 2,
            max: 100,
            message: "长度在 2 到 100 个字符",
            trigger: "blur",
          },
        ],
        fileList: [
          { required: true, message: "请上传", trigger: "blur" },
          // {
          //   min: 2,
          //   max: 100,
          //   message: "长度在 2 到 100 个字符",
          //   trigger: "blur",
          // },
        ],
      },
    };
  },
  methods: {
    setValue() {
      // console.log(this.$refs);
      this.$refs.valueAddUpdate.init();
    },
    init(row) {
      this.visible = true;
      if (row) {
        const data = row.fileSaveUri? {
            ...row,
            fileList: [
              {
                name: row.fileName,
                url: row.fileSaveUri,
              }
            ]
          } : {...row, fileList: []};
        this.formData = data;
        this.title = "修改模型信息";
      } else {
        this.formData = {};
      }
      if (this.$refs.formRule) {
        this.$refs.formRule.resetFields();
      }
    },
    //确认
    onSure() {
      this.$refs.formRule.validate((valid) => {
        if (valid) {
          const data = this.formData.fileList.length > 0? {
            ...this.formData,
            fileName: this.formData.fileList[0].name,
            fileSaveUri: this.formData.fileList[0].url,
            permissionType: 1,
          } : {
            ...this.formData,
            permissionType: 1,
          }
          if (this.formData.id) {
            updateModelApi(data).then((res) => {
              if (res.code == 200) {
                this.$message.success("操作成功!");
                this.visible = false;
                this.$emit("getData");
              }
            });
          } else {
            addModelApi(data).then((res) => {
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
