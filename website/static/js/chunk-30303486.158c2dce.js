(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-30303486"],{"168f":function(t,e,r){},1772:function(t,e,r){"use strict";var n=function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("div",{staticClass:"comp-tree"},[r("div",{staticClass:"new_project"},[r("el-button",{attrs:{type:"primary",round:""}},[r("div",{on:{click:t.toViewManage}},[t._v(" 新建/管理视图 ")])]),r("span",{staticClass:"icon-box"},[r("i",{staticClass:"el-icon-d-arrow-left",attrs:{title:"折叠"},on:{click:t.hadleShow}})])],1),r("div",{staticClass:"comp-data"},[r("div",{staticClass:"big-width"},[r("el-tree",{attrs:{data:t.setTree,props:t.defaultProps,"node-key":"id","default-expand-all":"","expand-on-click-node":!1},scopedSlots:t._u([{key:"default",fn:function(e){var n=e.node;return r("span",{staticClass:"custom-tree-node"},[r("span",{on:{click:function(e){return t.getList(n.data)}}},[t._v(t._s(n.label))])])}}])})],1)])])},o=[],i=r("24d2"),a={name:"ViewTree",props:{childScope:{type:String,required:!0}},data:function(){return{setTree:[],defaultProps:{children:"childViews",label:"title"},viewUrl:"/project/projectview?scope="+this.childScope,projectQuery:{pageNum:1,pageSize:10}}},computed:{projectInfo:function(){return this.$store.state.user.userinfo}},created:function(){this.queryViewTree()},methods:{toViewManage:function(){this.$store.commit("common/setNavName",this.childScope),this.$router.push("/project/projectview")},hadleShow:function(){this.$emit("hadleTree")},getList:function(t){console.log(t);var e={projectId:this.projectInfo.userUseOpenProject.projectId,viewTreeDto:{id:t.id}};this.$emit("childByValue",e)},queryViewTree:function(){var t=this,e={scope:this.childScope};Object(i["q"])(e).then((function(e){t.setTree=e.data}))}}},c=a,s=(r("55a0"),r("2877")),u=Object(s["a"])(c,n,o,!1,null,"2c2e417a",null);e["a"]=u.exports},"24d2":function(t,e,r){"use strict";r.d(e,"o",(function(){return o})),r.d(e,"a",(function(){return i})),r.d(e,"d",(function(){return a})),r.d(e,"f",(function(){return c})),r.d(e,"c",(function(){return s})),r.d(e,"r",(function(){return u})),r.d(e,"m",(function(){return l})),r.d(e,"b",(function(){return d})),r.d(e,"s",(function(){return p})),r.d(e,"e",(function(){return f})),r.d(e,"k",(function(){return h})),r.d(e,"n",(function(){return m})),r.d(e,"j",(function(){return b})),r.d(e,"i",(function(){return j})),r.d(e,"l",(function(){return w})),r.d(e,"p",(function(){return v})),r.d(e,"q",(function(){return g})),r.d(e,"h",(function(){return y})),r.d(e,"g",(function(){return O}));var n=r("b775");function o(t,e){return Object(n["a"])({url:"/project/queryForProjects",method:"post",params:t,data:e})}function i(t){return Object(n["a"])({url:"/project/addProject",method:"post",data:t})}function a(t){return Object(n["a"])({url:"/project/deleteProject/"+t,method:"delete"})}function c(t){return Object(n["a"])({url:"/project/updateProject",method:"post",data:t})}function s(t){return Object(n["a"])({url:"/project/checkProject/"+t,method:"get"})}function u(t,e){return Object(n["a"])({url:"/view/queryViews",method:"post",params:e,data:t})}function l(t){return Object(n["a"])({url:"/view/queryById/"+t,method:"get"})}function d(t){return Object(n["a"])({url:"/view/addViewRE",method:"post",data:t})}function p(t){return Object(n["a"])({url:"/view/updateView",method:"post",data:t})}function f(t){return Object(n["a"])({url:"/view/deleteView/"+t,method:"delete"})}function h(){return Object(n["a"])({url:"/view/getViewFilter",method:"post"})}function m(t){return Object(n["a"])({url:"/user/queryByNameSubUsers",method:"post",params:t})}function b(t){return Object(n["a"])({url:"/project/queryById/"+t,method:"get"})}function j(t){return Object(n["a"])({url:"/project/getCloseProject",method:"get",params:t})}function w(t){return Object(n["a"])({url:"/view/getViewScopeChildParams",method:"get",params:t})}function v(t){return Object(n["a"])({url:"/view/queryViewParents",method:"get",params:t})}function g(t){return Object(n["a"])({url:"/view/queryViewTrees",method:"get",params:t})}function y(){return Object(n["a"])({url:"/project/getAllSysCustomField",method:"get"})}function O(t){return Object(n["a"])({url:"/project/getAllCustomField",method:"post",data:t})}},"55a0":function(t,e,r){"use strict";r("e29b")},b8aa:function(t,e,r){"use strict";r.d(e,"e",(function(){return o})),r.d(e,"a",(function(){return i})),r.d(e,"c",(function(){return a})),r.d(e,"b",(function(){return c})),r.d(e,"d",(function(){return s}));var n=r("b775");function o(t,e){return Object(n["a"])({url:"/sprint/queryList",method:"post",params:t,data:e})}function i(t){return Object(n["a"])({url:"/sprint/insert",method:"post",data:t})}function a(t){return Object(n["a"])({url:"/sprint/queryById/"+t,method:"get"})}function c(t){return Object(n["a"])({url:"/sprint/delete/"+t,method:"delete"})}function s(t){return Object(n["a"])({url:"/sprint/update",method:"post",data:t})}},d266:function(t,e,r){"use strict";r("168f")},d887:function(t,e,r){"use strict";r.r(e);var n=function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("div",{staticClass:"project-container app-container"},[0===t.treeCol?r("div",{staticClass:"showBtn",on:{click:t.hadleTreeshow}},[r("i",{staticClass:"el-icon-d-arrow-right"})]):t._e(),r("el-row",[r("el-col",{attrs:{span:t.treeCol}},[r("view-tree",{attrs:{"child-scope":t.currentScope},on:{hadleTree:t.hadleTreeshow,childByValue:t.childByValue}})],1),r("el-col",{attrs:{span:24-t.treeCol}},[r("el-card",[r("div",{staticClass:"project_table"},[r("div",{staticClass:"new_project"},[r("el-button",{attrs:{type:"primary",round:""},on:{click:t.newproject}},[t._v(" 新建迭代 ")])],1),r("div",{staticClass:"oprate_btn"},[r("el-button",{attrs:{type:"text"},on:{click:t.projectRefresh}},[t._v("刷新")]),r("el-button",{attrs:{type:"text",disabled:t.single},on:{click:t.projectClone}},[t._v("克隆")]),r("el-button",{attrs:{type:"text",disabled:t.multiple},on:{click:function(e){return t.delproject("all")}}},[t._v("批量删除")])],1),r("div",{directives:[{name:"loading",rawName:"v-loading",value:t.isLoading,expression:"isLoading"}],staticClass:"protable table"},[r("el-table",{ref:"sprinttableData",staticStyle:{width:"100%"},attrs:{data:t.sprinttableData,"header-cell-style":t.tableHeader,stripe:""},on:{"selection-change":t.handleSelectionChange}},[r("el-table-column",{attrs:{type:"selection",width:"55"}}),r("el-table-column",{attrs:{type:"index",align:"center",label:"序号"},scopedSlots:t._u([{key:"default",fn:function(e){return[t._v(" "+t._s(e.$index+1)+" ")]}}])}),r("el-table-column",{attrs:{prop:"title","show-overflow-tooltip":!0,align:"center",label:"标题"}}),r("el-table-column",{attrs:{prop:"status",align:"center",label:"状态"},scopedSlots:t._u([{key:"default",fn:function(e){return[r("span",[t._v(t._s(1===e.row.status?"开发中":2===e.row.status?"计划中":"关闭"))])]}}])}),r("el-table-column",{attrs:{prop:"startDate",align:"center",label:"开始日期","min-width":"120","show-overflow-tooltip":!0},scopedSlots:t._u([{key:"default",fn:function(e){return[r("span",[t._v(t._s(e.row.startDate||"-"))])]}}])}),r("el-table-column",{attrs:{prop:"endDate",align:"center",label:"结束日期","min-width":"120","show-overflow-tooltip":!0},scopedSlots:t._u([{key:"default",fn:function(e){return[r("span",[t._v(t._s(e.row.endDate||"-"))])]}}])},[r("el-table-column",{attrs:{prop:"createTime",align:"center",label:"创建日期","min-width":"120","show-overflow-tooltip":!0}})],1),r("el-table-column",{attrs:{label:"操作","min-width":"120",align:"center"},scopedSlots:t._u([{key:"default",fn:function(e){return[r("el-button",{staticClass:"table-btn",attrs:{type:"text"},on:{click:function(r){return r.stopPropagation(),t.openEdit(e.row)}}},[t._v("编辑")]),r("el-button",{staticClass:"table-btn",attrs:{type:"text"},on:{click:function(r){return r.stopPropagation(),t.delproject(e.row.id)}}},[t._v("删除")])]}}])})],1),r("pagination",{directives:[{name:"show",rawName:"v-show",value:t.sprintTotal>0,expression:"sprintTotal > 0"}],attrs:{total:t.sprintTotal,page:t.sprintQuery.pageNum,limit:t.sprintQuery.pageSize},on:{"update:page":function(e){return t.$set(t.sprintQuery,"pageNum",e)},"update:limit":function(e){return t.$set(t.sprintQuery,"pageSize",e)},pagination:t.getqueryForSprint}})],1)])])],1)],1)],1)},o=[],i=r("1da1"),a=(r("96cf"),r("d3b7"),r("fb6a"),r("1772")),c=r("cf45"),s=r("b8aa"),u={name:"Sprint",components:{viewTree:a["a"]},data:function(){return{treeCol:5,currentScope:"Sprint",tableHeader:{color:"#d4dce3",background:"#4286CD"},isLoading:!1,activeNames:["1"],sprintQuery:{pageNum:1,pageSize:10},sprintTotal:0,sprinttableData:[],multipleSelection:[],single:!0,multiple:!0,projectIds:"",setTree:[],sprintBody:{scope:"",projectId:""},viewSearchQueryId:""}},computed:{projectInfo:function(){return this.$store.state.user.userinfo}},created:function(){this.getqueryForSprint()},methods:{newproject:function(){this.$router.push({name:"Addsprint"}),this.viewSearchQueryId=""},getqueryForSprint:function(){var t=this;this.isLoading=!0;var e={projectId:this.projectInfo.userUseOpenProject.projectId,viewTreeDto:{id:this.viewSearchQueryId}};return new Promise((function(r,n){Object(s["e"])(t.sprintQuery,e).then(function(){var e=Object(i["a"])(regeneratorRuntime.mark((function e(n){return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:"200"===n.code&&(n.total>0&&(t.sprintBody.scope=n.data[0].scope,t.sprintBody.projectId=t.projectInfo.userUseOpenProject.projectId),t.isLoading=!1,t.sprinttableData=n.data,t.sprintTotal=n.total,r(n));case 1:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}())}))},projectRefresh:function(){var t=this;return Object(i["a"])(regeneratorRuntime.mark((function e(){var r;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,t.getqueryForSprint();case 2:r=e.sent,"200"===r.code&&Object(c["e"])("success","刷新成功");case 4:case"end":return e.stop()}}),e)})))()},projectClone:function(){Object(c["e"])("error","暂未开发")},delproject:function(t){var e=this;"all"!==t?Object(s["b"])(t).then((function(t){"200"===t.code&&(Object(c["e"])("success",t.msg),e.getqueryForSprint())})):Object(c["e"])("error","暂未开发")},handleSelectionChange:function(t){this.multipleSelection=t,this.projectIds="";for(var e=0;e<t.length;e++)this.projectIds+=t[e].id+",";this.projectIds=this.projectIds.slice(0,this.projectIds.length-1),this.multiple=!t.length,this.single=1!==t.length},openEdit:function(t){this.$router.push({name:"Addsprint",query:{id:t.id}})},childByValue:function(t){var e=this;this.isLoading=!0,this.viewSearchQueryId=t.viewTreeDto.id,Object(s["e"])(this.sprintQuery,t).then((function(t){e.sprinttableData=t.data,e.sprintTotal=t.total,e.isLoading=!1}))},hadleTreeshow:function(){this.treeCol=5===this.treeCol?0:5}}},l=u,d=(r("d266"),r("2877")),p=Object(d["a"])(l,n,o,!1,null,"4b6ee74c",null);e["default"]=p.exports},e29b:function(t,e,r){}}]);