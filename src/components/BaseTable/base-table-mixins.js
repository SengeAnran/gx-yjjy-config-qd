export default {
  props: {
    //表格数据
    tableData: {
      type: Array,
      default: () => [],
    },
    tableMaxHeight: {
      type: String,
    },
    //斑马纹
    stripe: {
      type: Boolean,
      default: true,
    },

    //边框
    border: {
      type: Boolean,
      default: false,
    },

    //尺寸
    size: {
      type: String,
      default: "samll",
    },

    //复选框
    showSelection: {
      type: Boolean,
      default: false,
    },

    //序号
    showIndex: {
      type: Boolean,
      default: true,
    },

    //分页组件距离底部的距离
    bottom: {
      type: Number,
      default: 52,
    },

    //表头相关配置
    columns: {
      type: Array,
      default: () => [],
    },

    // otherConfig: {
    //   type: Object,
    //   default: () => { }
    // },

    //是否有分页，默认为true
    isPagintionShow: {
      type: Boolean,
      default: true,
    },

    //分页基本数据
    pagination: {
      type: Object,
      default: () => ({
        total: 10,
        current: 1,
        size: 10,
      }),
    },

    //选择器的选项设置
    pageSizes: {
      type: Array,
      default: () => [10, 15, 20, 50, 100],
    },

    //  组件布局
    // layout: {
    //   type: String,
    //   default: "total, sizes, prev, pager, next",
    // },

    // 是否展开，默认全部折叠
    isExpandAll: {
      type: Boolean,
      default: false,
    },
    rowKey: {
      type: String,
      default: "id",
    },
    //默认排序
    defaultSort: {
      type: Object,
      default: () => {},
    },
  },
};
