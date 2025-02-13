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
            <el-form-item label="接收地址：">
              <span>{{ formData.targetUri }}</span>
            </el-form-item>
            <el-form-item label="说明：">
              <span>{{ formData.remark }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <div class="process" v-for="(item, index) in formData.sceneCardConfs" :key="item.boardCardConfId">
              <div class="mb10">数据流{{ index + 1 }}</div>
              <div class="process-mark">
                <div
                  v-for="(modelItem, ind) in item.sceneCardConfModels"
                  :key="modelItem.modelId"
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
          </el-col>
        </el-row>
      </el-form>
      <div class="title">
        <div>接收历史</div>
        <el-date-picker v-model="dataTime" type="date" placeholder="选择日期" @change="getHistory"></el-date-picker>
      </div>
      <div v-loading="loading">
        <div class="pictureBox" v-for="item in historyData" :key="item.id">
          <div class="pictureBox-left">
            <img :src="item.targetImage" alt="暂无" />
          </div>
          <div class="pictureBox-right">
            <div class="name">{{ item.name }}</div>
            <div>紧急避险空地数量：{{ item.airGround || 0 }}</div>
            <div>取水水域数量：{{ item.water || 0 }}</div>
            <div>电塔数量：{{ item.signal || 0 }}</div>
            <div>latitude（纬度）：{{ item.latitude }}</div>
            <div>longitude（经度）：{{ item.longitude }}</div>
            <div>high（高度）：{{ item.high }}</div>
            <div>来源：{{ item.sourceUrl }}</div>
            <el-button type="text">详情</el-button>
          </div>
        </div>
      </div>
    </div>
    <template slot="footer">
      <el-button type="primary" icon="el-icon-circle-close" @click="visible = false">关闭</el-button>
    </template>
  </BaseDialog>
</template>

<script>
import { detailsApi, dataStreamLogApi } from "@/api/system/scene";
export default {
  data() {
    return {
      visible: false,
      loading: false,
      formData: {},
      dataTime: "",
      historyData: [],
      boardCardConfIds: [],
    };
  },
  methods: {
    async init(row) {
      this.visible = true;
      this.boardCardConfIds = row.boardCardConfIds;
      // 获取详情
      const res = await detailsApi(row.id);
      this.formData = res.data;
      this.getHistory();
    },

    //图片接收历史详情
    getHistory() {
      this.loading = true;
      const params = {
        boardCardConfIds: this.boardCardConfIds,
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
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.pictureBox {
  display: flex;
  margin-bottom: 20px;
  &-left {
    width: 440px;
    height: 250px;
  }
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
  &-right {
    margin-left: 20px;
    .name {
      font-weight: 600;
    }
    div {
      line-height: 28px;
    }
    .flexmsg {
      display: flex;
      justify-content: space-between;
    }
  }
}

.process {
  margin-bottom: 10px;
  // margin-right: 10px;
  // border: 2px solid rgb(223, 227, 238);
  // border-radius: 8px;
  // padding: 0 10px;
  // height: 220px;
  // box-sizing: border-box;
  &-mark {
    // width: 360px;
    // height: 168px;
    width: 100%;
    height: 100%;
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

.el-form {
  margin-bottom: 20px;
  .el-form-item {
    margin-bottom: 10px;
  }
}
.el-row {
  display: flex;
  align-items: center;
}
</style>
