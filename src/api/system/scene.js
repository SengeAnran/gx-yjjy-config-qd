import request from "@/utils/request";

//场景列表
export function sceneListApi(data) {
  return request({
    url: "/scene/list",
    method: "get",
    params: data,
  });
}
//列表删除
export function delListApi(id) {
  return request({
    url: "/scene/" + id,
    method: "delete",
  });
}

//场景新增
export function addSceneApi(data) {
  return request({
    url: "/scene",
    method: "post",
    data: data,
  });
}
//详情
export function detailsApi(id) {
  return request({
    url: "/scene/" + id,
    method: "get",
  });
}
//修改
export function updateSceneApi(data) {
  return request({
    url: "/scene",
    method: "put",
    data: data,
  });
}
//板卡场景配置模型
export function sceneModelListApi(data) {
  return request({
    url: "/model/listByBoardCardId",
    method: "get",
    params: data,
  });
}

//模型列表
export function modelListApi(data) {
  return request({
    url: "/model/listAll",
    method: "get",
  });
}

//开关控制
export function sceneStateApi(data) {
  return request({
    url: "/scene/update",
    method: "put",
    data: data,
  });
}
//开关控制 开始
export function sceneStateStartApi(boardCardId) {
  return request({
    url: `/manage/startScene/${boardCardId}`,
    method: "get",
  });
}

//开关控制 关闭
export function sceneStateStopApi(boardCardId) {
  return request({
    url: `/manage/stopScene/${boardCardId}`,
    method: "get",
  });
}

//场景管理图片接收历史详情
export function dataStreamLogApi(data) {
  return request({
    url: "/dataStreamLog/scene/list",
    method: "post",
    data: data,
  });
}

//启动/停止【场景】
export function sceneEnableApi(data) {
  return request({
    url: "/scene/enable",
    method: "post",
    data: data,
  });
}
