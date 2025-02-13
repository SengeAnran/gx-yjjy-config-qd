import request from "@/utils/request";

//板卡列表
export function dataSourceListApi(type) {
  return request({
    url: "/dataStream/list/" + type,
    method: "get",
  });
}
//列表删除
export function delListApi(id) {
  return request({
    url: "/dataSource/" + id,
    method: "delete",
  });
}

//板卡新增
export function addDataSourcedApi(data) {
  return request({
    url: "/dataSource",
    method: "post",
    data: data,
  });
}
//详情
export function detailsApi(id) {
  return request({
    url: "/dataSource/" + id,
    method: "get",
  });
}
//修改
export function updateDataSourcedApi(data) {
  return request({
    url: "/dataSource",
    method: "put",
    data: data,
  });
}
//板卡配置列表
export function dataSourceConfListApi(data) {
  return request({
    url: "/dataSource/" + data.id,
    method: "get",
  });
}

//查询数据流分页数据
export function dataSourcePageApi(data) {
  return request({
    url: "/dataStream/page",
    method: "post",
    data,
  });
}
//删除

//列表删除
export function delSourcePaegApi(id) {
  return request({
    url: "/dataStream/" + id,
    method: "delete",
  });
}

//新增
export function addSourceApi(data) {
  return request({
    url: "/dataStream/add",
    method: "post",
    data,
  });
}
//修改
export function editSourceApi(data) {
  return request({
    url: "/dataStream/edit",
    method: "post",
    data,
  });
}

//图片流接图片收历史详情
export function dataStreamLogApi(data) {
  return request({
    url: "/dataStreamLog/stream/list",
    method: "post",
    data,
  });
}

//查询数据流列表
export function SourceListApi(type) {
  return request({
    url: "/dataStream/list/" + type,
    method: "get",
  });
}

// 查询列表
export function imgSourceListApi(type) {
  return request({
    url: "/dataSource/list/" + type,
    method: "get",
  });
}

//首页图片流详情
export function imgSourceDetailApi(id) {
  return request({
    url: "/dataStreamLog/detail/" + id,
    method: "get",
  });
}
