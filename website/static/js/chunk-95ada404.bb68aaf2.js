(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-95ada404"],{1772:function(e,t,r){"use strict";var o=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",{staticClass:"comp-tree"},[r("div",{staticClass:"new_project"},[r("el-button",{attrs:{type:"primary",round:""}},[r("div",{on:{click:e.toViewManage}},[e._v(" 新建/管理视图 ")])]),r("span",{staticClass:"icon-box"},[r("i",{staticClass:"el-icon-d-arrow-left",attrs:{title:"折叠"},on:{click:e.hadleShow}})])],1),r("div",{staticClass:"comp-data"},[r("div",{staticClass:"big-width"},[r("el-tree",{attrs:{data:e.setTree,props:e.defaultProps,"node-key":"id","default-expand-all":"","expand-on-click-node":!1},scopedSlots:e._u([{key:"default",fn:function(t){var o=t.node;return r("span",{staticClass:"custom-tree-node"},[r("span",{on:{click:function(t){return e.getList(o.data)}}},[e._v(e._s(o.label))])])}}])})],1)])])},n=[],a=r("24d2"),c={name:"ViewTree",props:{childScope:{type:String,required:!0}},data:function(){return{setTree:[],defaultProps:{children:"childViews",label:"title"},viewUrl:"/project/projectview?scope="+this.childScope,projectQuery:{pageNum:1,pageSize:10}}},computed:{projectInfo:function(){return this.$store.state.user.userinfo}},created:function(){this.queryViewTree()},methods:{toViewManage:function(){this.$store.commit("common/setNavName",this.childScope),this.$router.push("/project/projectview")},hadleShow:function(){this.$emit("hadleTree")},getList:function(e){console.log(e);var t={projectId:this.projectInfo.userUseOpenProject.projectId,viewTreeDto:{id:e.id}};this.$emit("childByValue",t)},queryViewTree:function(){var e=this,t={scope:this.childScope};Object(a["q"])(t).then((function(t){e.setTree=t.data}))}}},i=c,l=(r("55a0"),r("2877")),s=Object(l["a"])(i,o,n,!1,null,"2c2e417a",null);t["a"]=s.exports},"24d2":function(e,t,r){"use strict";r.d(t,"o",(function(){return n})),r.d(t,"a",(function(){return a})),r.d(t,"d",(function(){return c})),r.d(t,"f",(function(){return i})),r.d(t,"c",(function(){return l})),r.d(t,"r",(function(){return s})),r.d(t,"m",(function(){return u})),r.d(t,"b",(function(){return d})),r.d(t,"s",(function(){return p})),r.d(t,"e",(function(){return h})),r.d(t,"k",(function(){return f})),r.d(t,"n",(function(){return j})),r.d(t,"j",(function(){return m})),r.d(t,"i",(function(){return b})),r.d(t,"l",(function(){return g})),r.d(t,"p",(function(){return w})),r.d(t,"q",(function(){return v})),r.d(t,"h",(function(){return y})),r.d(t,"g",(function(){return C}));var o=r("b775");function n(e,t){return Object(o["a"])({url:"/project/queryForProjects",method:"post",params:e,data:t})}function a(e){return Object(o["a"])({url:"/project/addProject",method:"post",data:e})}function c(e){return Object(o["a"])({url:"/project/deleteProject/"+e,method:"delete"})}function i(e){return Object(o["a"])({url:"/project/updateProject",method:"post",data:e})}function l(e){return Object(o["a"])({url:"/project/checkProject/"+e,method:"get"})}function s(e,t){return Object(o["a"])({url:"/view/queryViews",method:"post",params:t,data:e})}function u(e){return Object(o["a"])({url:"/view/queryById/"+e,method:"get"})}function d(e){return Object(o["a"])({url:"/view/addViewRE",method:"post",data:e})}function p(e){return Object(o["a"])({url:"/view/updateView",method:"post",data:e})}function h(e){return Object(o["a"])({url:"/view/deleteView/"+e,method:"delete"})}function f(){return Object(o["a"])({url:"/view/getViewFilter",method:"post"})}function j(e){return Object(o["a"])({url:"/user/queryByNameSubUsers",method:"post",params:e})}function m(e){return Object(o["a"])({url:"/project/queryById/"+e,method:"get"})}function b(e){return Object(o["a"])({url:"/project/getCloseProject",method:"get",params:e})}function g(e){return Object(o["a"])({url:"/view/getViewScopeChildParams",method:"get",params:e})}function w(e){return Object(o["a"])({url:"/view/queryViewParents",method:"get",params:e})}function v(e){return Object(o["a"])({url:"/view/queryViewTrees",method:"get",params:e})}function y(){return Object(o["a"])({url:"/project/getAllSysCustomField",method:"get"})}function C(e){return Object(o["a"])({url:"/project/getAllCustomField",method:"post",data:e})}},"35f4":function(e,t,r){},"55a0":function(e,t,r){"use strict";r("e29b")},"707c":function(e,t,r){"use strict";r.r(t);var o=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",{staticClass:"project-container app-container"},[0==e.treeCol?r("div",{staticClass:"showBtn",on:{click:e.hadleTreeshow}},[r("i",{staticClass:"el-icon-d-arrow-right"})]):e._e(),r("el-row",[r("el-col",{attrs:{span:e.treeCol}},[r("view-tree",{key:e.timer,attrs:{"child-scope":e.currentScope},on:{hadleTree:e.hadleTreeshow,childByValue:e.childByValue}})],1),r("el-col",{attrs:{span:24-e.treeCol}},[r("el-card",[r("div",{staticClass:"project_table"},[r("div",{staticClass:"new_project"},[r("el-button",{attrs:{type:"primary",round:""},on:{click:e.newproject}},[e._v(" 新建项目 ")])],1),r("div",{staticClass:"oprate_btn"},[r("el-button",{attrs:{type:"text"},on:{click:e.projectRefresh}},[e._v("刷新")]),r("el-button",{attrs:{type:"text",disabled:e.isAllowChangePro},on:{click:e.projectChange}},[e._v("切换项目")]),r("el-button",{attrs:{type:"text",disabled:e.single},on:{click:e.projectClone}},[e._v("克隆")]),r("el-button",{attrs:{type:"text",disabled:e.multiple},on:{click:function(t){return e.delproject("all")}}},[e._v("批量删除")])],1),r("div",{directives:[{name:"loading",rawName:"v-loading",value:e.isLoading,expression:"isLoading"}],staticClass:"protable table"},[r("el-table",{ref:"projecttableData",staticStyle:{width:"100%"},attrs:{data:e.projecttableData,"header-cell-style":e.tableHeader,stripe:""},on:{"row-click":e.switcproject,"selection-change":e.handleSelectionChange}},[r("el-table-column",{attrs:{type:"selection",width:"40"}}),r("el-table-column",{attrs:{type:"index",align:"left",label:e.$t("lang.CommonFiled.ID")},scopedSlots:e._u([{key:"default",fn:function(t){return[e._v(" "+e._s(t.$index+1)+" ")]}}])}),r("el-table-column",{attrs:{prop:"title","show-overflow-tooltip":!0,align:"left",width:"155",label:e.$t("lang.CommonFiled.Title")},scopedSlots:e._u([{key:"default",fn:function(t){return[t.row.id===e.userUseOpenProject.projectId?r("span",{staticClass:"title",on:{click:function(r){return e.openEdit(t.row)}}},[e._v(" "+e._s(t.row.title)+" ")]):r("span",[e._v(" "+e._s(t.row.title)+" ")])]}}])}),r("el-table-column",{attrs:{prop:"reportToName",align:"left",label:e.$t("lang.CommonFiled.ReportTo")}}),r("el-table-column",{attrs:{prop:"customer",align:"left",label:e.$t("lang.Project.Customer")}}),r("el-table-column",{attrs:{prop:"testFrame",align:"left",label:e.$t("lang.Project.TestFrame"),width:"200"}}),r("el-table-column",{attrs:{prop:"projectCategory",align:"left",label:e.$t("lang.Project.ProjectCategory")}}),r("el-table-column",{attrs:{prop:"status",align:"left",label:e.$t("lang.Project.Status")}}),r("el-table-column",{attrs:{prop:"planReleaseDate",align:"left",label:e.$t("lang.Project.planReleaseDate"),"min-width":"120","show-overflow-tooltip":!0},scopedSlots:e._u([{key:"default",fn:function(t){return[r("span",[e._v(e._s(t.row.planReleaseDate||"-"))])]}}])}),r("el-table-column",{attrs:{prop:"closeDate",align:"left",label:e.$t("lang.CommonFiled.ClosedDate"),"min-width":"120","show-overflow-tooltip":!0},scopedSlots:e._u([{key:"default",fn:function(t){return[r("span",[e._v(e._s(t.row.closeDate||"-"))])]}}])}),r("el-table-column",{attrs:{prop:"createTime",align:"left",label:e.$t("lang.CommonFiled.CreatedDate"),"min-width":"120","show-overflow-tooltip":!0}}),r("el-table-column",{attrs:{label:"操作","min-width":"120",align:"center"},scopedSlots:e._u([{key:"default",fn:function(t){return["关闭"!==t.row.status&&t.row.id===e.userUseOpenProject.projectId?r("el-button",{staticClass:"table-btn",attrs:{type:"text"},on:{click:function(r){return r.stopPropagation(),e.closeAction(t.row)}}},[e._v("关闭")]):e._e(),t.row.id!==e.userUseOpenProject.projectId?r("el-button",{staticClass:"table-btn",attrs:{type:"text"},on:{click:function(r){return r.stopPropagation(),e.delproject(t.row.id)}}},[e._v("删除")]):e._e()]}}])})],1),r("pagination",{directives:[{name:"show",rawName:"v-show",value:e.projectTotal>0,expression:"projectTotal > 0"}],attrs:{total:e.projectTotal,page:e.projectQuery.pageNum,limit:e.projectQuery.pageSize},on:{"update:page":function(t){return e.$set(e.projectQuery,"pageNum",t)},"update:limit":function(t){return e.$set(e.projectQuery,"pageSize",t)},pagination:e.getqueryForProjects}})],1)])])],1)],1)],1)},n=[],a=r("1da1"),c=r("5530"),i=(r("96cf"),r("e9c4"),r("d3b7"),r("fb6a"),r("4de4"),r("1772")),l=r("cf45"),s=r("4360"),u=r("24d2"),d=r("2f62"),p={name:"Project",components:{viewTree:i["a"]},data:function(){return{treeCol:5,currentScope:"Project",tableHeader:{color:"#d4dce3",background:"#4286CD"},isLoading:!1,activeNames:["1"],projectQuery:{pageNum:1,pageSize:10},projectTotal:0,projecttableData:[],multipleSelection:[],isAllowChangePro:!0,single:!0,multiple:!0,projectIds:"",setTree:[],projectBody:{scope:"",projectId:""},viewSearchQueryId:"",timer:""}},computed:Object(c["a"])(Object(c["a"])({},Object(d["b"])(["name"])),{},{userUseOpenProject:function(){return this.$store.state.user.userinfo.userUseOpenProject}}),created:function(){this.getqueryForProjects()},methods:{hadleTreeshow:function(){this.treeCol=5===this.treeCol?0:5},newproject:function(){var e=JSON.stringify({});this.$router.push({name:"Addproject",query:{info:e}})},getqueryForProjects:function(){var e=this;this.isLoading=!0;var t={viewTreeDto:{id:this.viewSearchQueryId}};return new Promise((function(r,o){Object(u["o"])(e.projectQuery,t).then(function(){var t=Object(a["a"])(regeneratorRuntime.mark((function t(o){return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:"200"===o.code&&(o.total>0&&(e.projectBody.scope=o.data[0].scope,e.projectBody.projectId=o.data[0].id),e.isLoading=!1,e.projecttableData=o.data,e.projectTotal=o.total,r(o));case 1:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}())}))},projectRefresh:function(){var e=this;return Object(a["a"])(regeneratorRuntime.mark((function t(){var r;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return t.next=2,e.getqueryForProjects();case 2:r=t.sent,"200"===r.code&&(Object(l["e"])("success","刷新成功"),e.viewSearchQueryId="");case 4:case"end":return t.stop()}}),t)})))()},projectChange:function(){var e=this;Object(u["c"])(this.multipleSelection[0].id).then((function(t){"200"===t.code&&(e.$refs.projecttableData.clearSelection(),s["a"].dispatch("user/getInfo"),e.timer=(new Date).getTime(),Object(l["e"])("success","切换项目成功"))}))},projectClone:function(){Object(l["e"])("error","暂未开发")},delproject:function(e){var t=this;"all"!==e?Object(u["d"])(e).then((function(e){"200"===e.code&&(Object(l["e"])("success",e.msg),t.getqueryForProjects())})):Object(l["e"])("error","暂未开发")},handleSelectionChange:function(e){var t=this;this.multipleSelection=e,this.projectIds="";for(var r=0;r<e.length;r++)this.projectIds+=e[r].id+",";this.projectIds=this.projectIds.slice(0,this.projectIds.length-1),this.multiple=!e.length,this.single=1!==e.length;var o=this.multipleSelection.filter((function(e){return e.id===t.userUseOpenProject.projectId}));1!==e.length||o.length>0?this.isAllowChangePro=!0:this.isAllowChangePro=!1},openEdit:function(e){this.$router.push({name:"Addproject",query:{id:e.id}})},switcproject:function(e){this.projectBody.scope=e.scope,this.projectBody.projectId=e.id},closeAction:function(e){var t=this;this.$prompt("请输入关闭理由：","提示",{confirmButtonText:"确定",showCancelButton:!1}).then((function(r){var o=r.value;o&&Object(u["i"])({id:e.id,closeDesc:o}).then((function(e){t.getqueryForProjects()}))})).catch({})},childByValue:function(e){var t=this;console.log("query--",e),this.isLoading=!0,this.viewSearchQueryId=e.viewTreeDto.id,Object(u["o"])(this.projectQuery,e).then((function(e){t.projecttableData=e.data,t.projectTotal=e.total,t.isLoading=!1}))}}},h=p,f=(r("a87a"),r("2877")),j=Object(f["a"])(h,o,n,!1,null,"364052b4",null);t["default"]=j.exports},a87a:function(e,t,r){"use strict";r("35f4")},e29b:function(e,t,r){}}]);