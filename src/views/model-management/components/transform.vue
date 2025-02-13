<template>
  <BaseDialog
    append-to-body
    custom-class="export-dialog"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="600px"
  >
    <template #default>
      <div class="content">
        <div v-if="loadingType === 1" class="loading-box">
          <div class="bottom-img">
            <img src="./img/loading_bottom.svg" alt="">
          </div>
          <div class="top-img">
            <img src="./img/loading-top.svg" alt="">
          </div>
        </div>
        <div v-if="loadingType === 2" class="loading-box">
          <img src="./img/loading_end.svg" alt="">
        </div>
        <div v-if="loadingType === 3" class="loading-box">
          <img src="./img/loading_err.svg" alt="">
        </div>
        <div class="text">{{text}}</div>
      </div>

    </template>
  </BaseDialog>
</template>

<script>
import ValueAddUpdate from "./value-add-update";
import {addModelApi, detailsApi, modelConvert, updateModelApi} from "@/api/system/model";
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
      textList: [
        '模型转换中，请稍后',
        '模型转换成功',
        '模型转换失败',
      ],
      loadingType: 1, // 1:转换中 2.转换成功 3：转换失败
      formData: {
      },
    };
  },
  computed: {
    text() {
      return this.textList[this.loadingType - 1];
    }
  },
  methods: {
    setValue() {
      // console.log(this.$refs);
      this.$refs.valueAddUpdate.init();
    },
    init(row) {
      this.loadingType = 1;
      this.visible = true;
      this.formData = { ...row };
      this.onSure()
    },
    //确认
    onSure() {
      modelConvert({id: this.formData.id}).then((res) => {
        if (res.code === 200) {
          this.$emit("getData");
          this.loadingType = 2;
        } else if (res.code === 500) {
          this.loadingType = 3;
        }
      }).catch(() => {
        this.loadingType = 3;
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.content {
  margin-top: 65px;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 300px;
  text-align: center;
  .loading-box {
    width: 185px;
    height: 146px;
    position: relative;
    margin-bottom: 46px;
    .bottom-img {
      position: absolute;
      bottom: 0;
    }
    .top-img {
      top: 0;
      transform-origin: center center;
      //animation: circle infinite 2s linear;
    }
  }
}
@keyframes circle {
  100% {
    //transform: rotate3d(0 ,0,1,360deg);
    transform: rotate(360deg);
  }
}
</style>
