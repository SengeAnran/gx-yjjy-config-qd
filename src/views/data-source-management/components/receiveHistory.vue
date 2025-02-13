<template>
  <BaseDialog title="详情" :close-on-click-modal="false" :visible.sync="visible" width="1000px">
    <div>
      <div class="title">基础信息</div>
      <el-form label-width="100px" :model="formData" ref="formRule">
        <el-row>
          <el-col :span="12">
            <el-form-item label="图片流名称：">
              <span>{{ formData.name }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="标签：">
              <span>{{ formData.boardCardConfTag }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="接收地址：" prop="name">
              <span>{{ formData.targetUri }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="说明：" prop="name">
              <span>{{ formData.description }}</span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="title">
        <div>接收历史</div>
        <el-date-picker
          v-model="dataTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择日期"
          @change="getHistory"
        ></el-date-picker>
      </div>
      <div class="photo" v-loading="loading">
        <div class="box" v-for="item in historyData" :key="item.id">
          <div>
            <img :src="item.sourceImage" alt="" />
          </div>
          <div>{{ item.name }}</div>
          <div>{{ item.longitude }},{{ item.latitude }}</div>
          <div>{{ item.date }}</div>
        </div>
      </div>
    </div>
    <template slot="footer">
      <el-button type="primary" icon="el-icon-circle-close" @click="visible = false">关闭</el-button>
    </template>
  </BaseDialog>
</template>

<script>
import { dataStreamLogApi } from "@/api/system/data_source";
export default {
  data() {
    return {
      visible: false,
      loading: false,
      formData: {},
      dataTime: "",
      historyData: [],
    };
  },
  methods: {
    init(row) {
      this.formData = { ...row };
      this.visible = true;
      this.dataTime = "";
      this.getHistory();
    },

    //图片接收历史详情
    getHistory() {
      this.loading = true;
      const params = {
        boardCardConfId: this.formData.boardCardConfId,
        date: this.dataTime,
      };
      dataStreamLogApi(params)
        .then((res) => {
          this.loading = false;
          this.historyData = res.data || [];
        })
        .catch(() => {
          this.loading = false;
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}
.photo {
  display: flex;
  flex-wrap: wrap;
  .box {
    width: 280px;
    height: 240px;
    margin: 0 20px 20px 20px;
    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }
}
</style>
