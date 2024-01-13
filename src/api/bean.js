import request from "@/utils/request";

//版本管理

//故事
export function getBeanFeatureList() {
  return request({
    url: "/bean/search/feature/1743829726021083138",
    method: "get",
    // params: data,
  });
}
//缺陷
export function getBeanIssueList() {
  return request({
    url: "/bean/search/issue/1743829726021083138",
    method: "get",
    // params: data,
  });
}

//测试周期
export function getBeanTestCycleList() {
  return request({
    url: "/bean/search/testCycle/1743829726021083138",
    method: "get",
    // params: data,
  });
}

//测试用例
export function getBeanTestCaseList() {
  return request({
    url: "/bean/search/testCase/1743829726021083138",
    method: "get",
    // params: data,
  });
}
