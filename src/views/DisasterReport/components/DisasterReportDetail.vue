
<template>
<div class="disaster-report-detail">
  <div class="btns">
    <el-button type="primary" round >生成报告</el-button>
    <el-button type="danger" round plain>删除</el-button>
  </div>
  <div class="top-img">
    <img :src="detailInfo.topImg" alt="">
  </div>
  <div class="bottom-img">
    <div class="img-item" v-for="(item, index) in detailInfo.imgList" :key="index">
      <img :src="item" alt="">
    </div>
  </div>
  <div class="content">{{detailInfo.content}}</div>
</div>
</template>
<script>
export default {
  name: "DisasterReportDetail",
  data() {
    return {
      detailInfo: {
        topImg: require('../img/img.png'),
        imgList: [require('../img/img_1.png'),require('../img/img_2.png'),require('../img/img_3.png'),require('../img/img_4.png'),],
        content: '国家应急教援中心联合灾害现场某教援队于2024年11月18日利用无人机针对xx的森林火灾开展侦测。侦测发现:在约(火场范国)的火场范围内，在起火点附近经纬度(102.324365°24.4138339和24.412696%)处有两处空地，其中空地A(上面红框的空地)面积为106m?，平均坡度为5.5”，空地B(下面红框的空地)面积为115m2平均坡度为7.3°满足消防员紧急避险空地选取条件。消防员可通过图中绿色部分为紧急避险路线，消防员可前往空地A进行紧急避险前往空地A进行紧急避险，道路最小宽度为3.4m。\n' +
          '在经纬度(102,323934°24,404136°)、(102.336353°24.4165447.(102.321109°24,4046387(102.323136°,24.404040°)处侦测到8处信号塔。国家应急教援中心将联合灾害现场某救援队利用无人机持续开展侦测并报送有关情况。'
      }
    }
  }
}
</script>


<style scoped lang="scss">
.disaster-report-detail {
  padding: 28px 35px;
  .btns {
    margin-bottom: 20px;
  }
  .top-img {
    height: 431px;
    border-radius: 6px;
    overflow: hidden;
    margin-bottom: 25px;
  }
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .bottom-img {
    display: flex;
    justify-content: space-between;
    margin-bottom: 25px;
    .img-item {
      border-radius: 6px;
      overflow: hidden;
      width: 218px;
      height: 218px;
    }
  }
  .content {
    white-space: pre-wrap;
  }
}
</style>
