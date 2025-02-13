<template>
  <BaseDialog title="识别记录详情" :close-on-click-modal="false" :visible.sync="visible" width="800px">
    <div>
      <div class="title">基础信息</div>
      <el-form label-width="100px" :model="formData" ref="formRule">
        <el-row>
          <el-col :span="16">
            <el-form-item label="识别时间：">
              <span>{{ formData.date }}</span>
            </el-form-item>
            <el-form-item label="关联模型：">
              <span>{{ formData.linkModelName }}</span>
            </el-form-item>
            <el-form-item label="来源：">
              <span>{{ formData.sourceUrl }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">

            <el-form-item label="场景：">
              <span>{{ formData.sceneName }}</span>
            </el-form-item>
            <el-form-item label="标签：">
              <span>{{ formData.label }}</span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="mt10 mb10">
        <div class="title">识别画面</div>
        <div>
          <div class="pictureBox">
            <div class="pictureBox-left">
              <img :src="formData.sourceImage" alt="暂无" />
            </div>
            <div class="pictureBox-left">
              <img :src="formData.targetImage" alt="暂无" />
            </div>

          </div>
        </div>
      </div>
      <div class="bottom-info">
        <el-row>
          <el-col :span="12">
            <div class="mini-title">原始数据:</div>
<!--            <div>紧急避险空地数量：{{ formData.airGround || 0 }}</div>-->
<!--            <div>取水水域数量：{{ formData.water || 0 }}</div>-->
<!--            <div>电塔数量：{{ formData.signal || 0 }}</div>-->
            <div>纬度：{{ formData.latitude }}</div>
            <div>经度：{{ formData.longitude }}</div>
            <div v-if="formData.pitchAngle">俯仰角：{{ formData.pitchAngle }}</div>
            <div v-if="formData.yawAngle">偏航角：{{ formData.yawAngle }}</div>
            <div v-if="formData.rollAngle">翻滚角：{{ formData.rollAngle }}</div>
            <div>高度：{{ formData.high }}</div>
          </el-col>
          <el-col :span="12">
<!--            <div class="mini-title">标注数据:</div>-->
<!--            <div class="people-info">-->
<!--              <div class="people-info-item"  style="margin-right: 40px"><img src="./people.png" alt=""><span>人员:2</span></div>-->
<!--&lt;!&ndash;              <div class="people-info-item">状态:1</div>&ndash;&gt;-->
<!--            </div>-->
          </el-col>
        </el-row>
      </div>
    </div>
<!--    <template slot="footer">-->
<!--      <el-button type="primary" icon="el-icon-circle-close" @click="visible = false">关闭</el-button>-->
<!--    </template>-->
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
.el-form-item {
  margin-bottom: 0px;
}
.title {
  margin-bottom: 5px;
  color: #409EFF;
  font-family: "PingFang SC";
  font-size: 18px;
  font-style: normal;
  font-weight: 400;
  line-height: 32px; /* 177.778% */
}

.pictureBox {
  display: flex;
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
.bottom-info {
  font-size: 16px;
  line-height: 22px; /* 157.143% */
  .mini-title {
    margin-bottom: 7px;
    font-size: 14px;

  }
  .people-info {
    display: flex;
  }
}
</style>
