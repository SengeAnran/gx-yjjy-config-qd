
<template>
<div class="card-item">
  <div class="card-item-top">
    <div class="no-time">
      {{ item.name }} {{item.date}}
    </div>
    <div>
      <span class="come">来源：{{ item.sourceUrl }}</span>
      <el-button type="text" @click="$emit('onView', item)">详情</el-button>
    </div>
  </div>
  <div class="card-item-bottom">
    <div class="img1">
      <img :src="item.sourceImage" alt="暂无" >
    </div>
    <div class="img2">
      <img v-if="item.targetImage" :src="item.targetImage" alt="暂无" >
      <img v-else class="no-img" src="../imgs/no-img.png" alt="" >
    </div>
    <div class="base-info">
      <div class="tip">原始数据:</div>
     <div class="info-box">
       <div class="base-info-item">纬度：{{ (item.latitude* 1).toFixed(2) }}</div>
       <div class="base-info-item">经度：{{ (item.longitude*1).toFixed(2) }}</div>
       <div v-if="item.pitchAngle" class="base-info-item">俯仰角：{{ (item.pitchAngle*1).toFixed(2) }}</div>
       <div v-if="item.yawAngle" class="base-info-item">偏航角：{{ (item.yawAngle*1).toFixed(2) }}</div>
       <div v-if="item.rollAngle" class="base-info-item">翻滚角：{{ (item.rollAngle*1).toFixed(2) }}</div>
       <div class="base-info-item">高度：{{ item.high }}</div>
       <div v-if="item.sceneName" class="base-info-item">场景名称：{{item.sceneName }}</div>
     </div>
      <div class="tip">标注数据:</div>
      <div class="people-info">
<!--        <div class="people-info-item"><img src="../imgs/peole.png" alt=""><span>人员:2</span></div>-->
        <div class="people-info-item" v-for="(item, index) in item.contentList" :key="index">{{item.numName}}:{{item.num}}</div>
<!--        <div class="people-info-item">水域:1</div>-->
      </div>
    </div>
  </div>
</div>
</template>
<script>
export default {
  name: "cardItem",
  props: {
    item: Object,
  }
}
</script>


<style scoped lang="scss">
.card-item {
  .card-item-top {
    //height: 35px;
    line-height: 35px;
    display: flex;
    justify-content: space-between;
  }
  .card-item-bottom {
    display: flex;
    .img1,.img2 {
      position: relative;
      //flex: none;
      width: 326.061px;
      height: 259px;
      background: url("../imgs/img_bg.png") left top no-repeat;
      background-size: 100% 100%;
      padding: 4px;
      img {

        //z-index: -1;
        width: 100%;
        height: 100%;
        object-fit: fill;
      }
      .no-img {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        width: 72px;
        height: 72px;
        object-fit: fill;
      }
    }
    .img1 {
      margin-right: 12px;
    }
    .base-info {
      margin-left: 26px;
      width: 203px;
      height: 257px;
      padding: 17px 21px;
      border-radius: 6px;
      background: #0D3261;
      overflow-y: visible;
      overflow-x: auto;
      .tip {
        color: #FFF;
        font-family: "PingFang SC";
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: 22px; /* 157.143% */
        margin-bottom: 5px;
      }
      .info-box {
        margin-bottom: 13px;
        color: #FFF;
        font-family: "PingFang SC";
        font-size: 16px;
        font-style: normal;
        font-weight: 400;
        line-height: 22px; /* 137.5% */
        white-space: nowrap;
      }
      .people-info {
        display: flex;
        //justify-content: space-between;
        //align-items: center;
        flex-wrap: wrap;
        .people-info-item {
          width: 100%;
          display: flex;
          align-items: center;
          white-space: nowrap;
          img {
            margin-right: 4px;
          }
          //span {
          //  vertical-align: center;
          //}
        }
      }
    }

  }
}
</style>
