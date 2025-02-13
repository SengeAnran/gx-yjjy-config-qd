export const formData = {
  sceneName: "",
  alertTime: [],
};

export const FORM_CONFIG = [
  // {
  //     label: "告警等级：",
  //     type: "select",
  //     params: "level",
  //     labelWidth: "100px",
  //     span: 4,
  //     selectOptions: [
  //         {
  //             label: "高",
  //             value: "高"
  //         },
  //         {
  //             label: "中",
  //             value: "中"
  //         },
  //         {
  //             label: "低",
  //             value: "低"
  //         }
  //     ],

  // },

  {
    label: "时间：",
    type: "datetimerange",
    params: "alertTime",
    labelWidth: "60px",
    span: 6,
    valueFormat: "yyyy-MM-dd HH:mm:ss",
    startPlaceholder: "开始日期",
    endPlaceholder: "结束日期",
  },
  {
    label: "场景：",
    type: "input",
    params: "sceneName",
    labelWidth: "80px",
    placeholder: "请输入",
    span: 6,
    selectOptions: [],
  },
];
