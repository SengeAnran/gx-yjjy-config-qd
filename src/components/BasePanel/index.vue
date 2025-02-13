
<template>
  <div class="base-panel" :style="{height:boxHeight}">
    <div v-if="titleArr.length === 1" class="title title-one">
      <div class="title-content"> {{titleArr[0]}}</div>

    </div>
    <div v-if="titleArr.length > 1" class=" title ">
      <div class="title-content title-list">
        <div
          class="title-list-item"
          v-for="(item, index) in titleArr"
          :key="index"
          :class="{active: activeIndex === index}"
          @click="changeActive(item,index)"
        >
          {{item}}
        </div>
      </div>

    </div>
    <div class="content" :style="{padding: contentPadding}">
      <slot></slot>
    </div>

  </div>
</template>

<script>
export default {
  name: "BasePanel",
  props: {
    titleArr: Array,
    // 高度
    boxHeight: {
      type: String,
      default: '100%',
    },
    contentPadding: String,
  },
  data() {
    return {
      activeIndex: 0,
    }
  },
  methods: {
    changeActive(item,index) {
      this.activeIndex = index;
      this.$emit('changeActive', {item,index})
    }
  }
}
</script>

<style scoped lang="scss">
.base-panel {
  width: 100%;
  //height: 100%;
  //height: 300px;
  border: 2px solid rgba(162, 197, 255, 0.00);
  background: linear-gradient(180deg, rgba(16, 98, 222, 0.12) 0%, rgba(17, 96, 219, 0.11) 54.88%, rgba(19, 98, 215, 0.05) 75.82%, rgba(0, 95, 223, 0.03) 100%), linear-gradient(180deg, rgba(0, 40, 96, 0.00) 0%,
    rgba(0, 42, 95, 0.09) 23.24%, rgba(0, 42, 97, 0.24) 44.61%, rgba(0, 40, 96, 0.27) 100%)
  ;
  .title {
    height: 35px;
    border-bottom: 1px solid rgba(5, 155, 255, 0.20);
    background: linear-gradient(90deg, rgba(20, 145, 255, 0.38) 0%, rgba(19, 147, 255, 0.25) 25.97%, rgba(18, 151, 255, 0.11) 44.98%, rgba(20, 145, 255, 0.00) 74.64%), rgba(21, 87, 155, 0.32);
    color: rgba(204, 238, 255, 0.50);

  }

  .title-one {
    position: relative;
    &::before {
      position: absolute;
      left: 0;
      top: 0;
      display: inline-block;
      content: '';
      width: 7px;
      height: 100%;
      background: linear-gradient(180deg, rgba(255, 255, 255, 0.45) 0%, rgba(0, 0, 0, 0.45) 100%), #0A91EF;
      //background-blend-mode: overlay, normal;
      box-shadow: 0px 0px 7px 0px rgba(26, 155, 255, 0.38);
    }

    line-height: 35px;
    color: #CEF;
    text-shadow: 0px 1px 8px rgba(0, 0, 0, 0.25);
    font-family: YouSheBiaoTiHei;
    font-size: 20px;
    .title-content {
      padding-left: 20px;
    }
  }
  .title-content {
    width: 100%;
    height: 100%;
    background: url("./title_bg.svg")  15px center no-repeat;
  }
  .title-list {
    display: flex;
    text-shadow: 0px 1px 8px rgba(0, 0, 0, 0.25);
    font-family: YouSheBiaoTiHei;
    font-size: 20px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    .title-list-item {
      cursor: pointer;
      height: 100%;
      line-height: 35px;
      padding: 0 29px;
    }
    .active {
      color: #CEF;
      background: linear-gradient(180deg, rgba(255, 255, 255, 0.45) 0%, rgba(0, 0, 0, 0.45) 100%), #0A91EF;
      background-blend-mode: overlay, normal;
      box-shadow: 0px 0px 7px 0px rgba(26, 155, 255, 0.38);
    }
  }
  .content {
    width: 100%;
    height: calc(100% - 35px);
    overflow-y: auto;
    background: url("./buttom_bg.png") 69% bottom  no-repeat;
  }
}
</style>
