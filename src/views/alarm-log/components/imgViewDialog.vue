<template>
  <BaseDialog title="识别记录详情" :close-on-click-modal="false" :visible.sync="visible" width="800px">
    <div>
      <div class="mb10">基础信息</div>
      <el-form label-width="100px" :model="formData" ref="formRule">
        <el-row>
          <el-col :span="12">
            <el-form-item label="识别时间：">
              <span>{{ formData.alertTime }}</span>
            </el-form-item>
            <el-form-item label="内容：">
              <span>{{ formData.content }}</span>
            </el-form-item>
            <el-form-item label="场景：">
              <span>{{ formData.sceneName }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="关联模型：">
              <span>{{ formData.linkModelName }}</span>
            </el-form-item>
            <el-form-item label="关联数据源：">
              <span>{{ formData.dataStreamName }}</span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="mt20">
        <div class="mb10">识别画面</div>
        <div>
          <div class="pictureBox">
            <div class="pictureBox-left">
              <img :src="formData.actualPicBase64" alt="暂无" />
            </div>
            <div class="pictureBox-right">
              <div class="name">{{ formData.name }}</div>
<!--              <div>紧急避险空地数量：{{ formData.airGround || 0 }}</div>-->
<!--              <div>取水水域数量：{{ formData.water || 0 }}</div>-->
<!--              <div>电塔数量：{{ formData.signal || 0 }}</div>-->
              <div>latitude（纬度）：{{ formData.latitude }}</div>
              <div>longitude（经度）：{{ formData.longitude }}</div>
              <div>high（高度）：{{ formData.high }}</div>
              <div>来源：{{ formData.sourceUrl }}</div>
            </div>
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
export default {
  data() {
    return {
      visible: false,
      formData: {},
    };
  },
  methods: {
    init(item) {
      this.visible = true;

      this.formData = item;
    },
  },
};
</script>

<style lang="scss" scoped>
.pictureBox {
  display: flex;
  // margin-bottom: 20px;
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
  &-mark {
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
</style>
