(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-4c382d26"],{"21cb":function(t,e,r){"use strict";r.r(e);var i=function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("div",{staticClass:"app-container add-form add-project"},[r("el-form",{ref:"sprintFrom",staticClass:"demo-ruleForm",attrs:{model:t.sprintFrom,rules:t.sprintrules,"label-width":"120px"}},[r("div",[t.sprintFrom.id?t._e():r("el-button",{attrs:{type:"primary",round:""},on:{click:function(e){return t.submitForm("sprintFrom",!1)}}},[t._v("保存并新建")]),t.sprintFrom.id?t._e():r("el-button",{attrs:{type:"primary",round:""},on:{click:function(e){return t.submitForm("sprintFrom",!0)}}},[t._v("保存并返回")]),t.sprintFrom.id?r("el-button",{attrs:{type:"primary",round:""},on:{click:function(e){return t.submitForm("sprintFrom")}}},[t._v("确认修改")]):t._e(),r("el-button",{attrs:{type:"primary",round:""},on:{click:function(e){return t.giveupBack("sprintFrom")}}},[t._v("放弃")]),t.sprintFrom.id?t._e():r("router-link",{attrs:{to:"/admincenter/admincenter"}},[r("el-button",{attrs:{type:"text"}},[t._v(t._s(t.$t("lang.PublicBtn.CreateCustomField")))])],1)],1),r("div",{staticClass:"form-box"},[r("el-form-item",{attrs:{label:"迭代标题",prop:"title"}},[r("el-input",{attrs:{size:"small",maxlength:"15"},model:{value:t.sprintFrom.title,callback:function(e){t.$set(t.sprintFrom,"title",e)},expression:"sprintFrom.title"}})],1),r("el-row",[r("el-col",{attrs:{span:8}},[r("el-form-item",{attrs:{size:"small",label:"EPIC",prop:"epic"}},[r("el-select",{attrs:{placeholder:"请选择epic",clearable:""},model:{value:t.sprintFrom.epic,callback:function(e){t.$set(t.sprintFrom,"epic",e)},expression:"sprintFrom.epic"}},[t._l(t.epicArr,(function(t){return r("el-option",{key:t,attrs:{label:t,value:t}})})),r("router-link",{attrs:{to:"/admincenter/admincenter?par=epic"}},[r("el-option",{attrs:{label:"Add New Value",value:0}})],1)],2)],1)],1),r("el-col",{attrs:{span:8}},[r("el-form-item",{attrs:{label:"起止日期",size:"small",prop:"timeArr"}},[r("el-date-picker",{attrs:{format:"yyyy-MM-dd HH:mm:ss","value-format":"yyyy-MM-dd HH:mm:ss",type:"datetimerange","picker-options":t.pickerOptions,"range-separator":"至","start-placeholder":"开始日期","end-placeholder":"结束日期","unlink-panels":"","default-time":["00:00:00","23:59:00"]},model:{value:t.sprintFrom.timeArr,callback:function(e){t.$set(t.sprintFrom,"timeArr",e)},expression:"sprintFrom.timeArr"}})],1)],1)],1),r("el-form-item",{attrs:{label:t.$t("lang.Project.Description"),prop:"description",size:"small"}},[r("el-input",{attrs:{type:"textarea",maxlength:"1000","show-word-limit":"",autosize:{minRows:3,maxRows:8}},model:{value:t.sprintFrom.description,callback:function(e){t.$set(t.sprintFrom,"description",e)},expression:"sprintFrom.description"}})],1)],1)])],1)},n=[],s=r("5530"),o=r("2f62"),a=r("f5dd"),c=r("b8aa"),p=r("cf45"),l={name:"Addsprint",data:function(){return{pickerOptions:{disabledDate:function(t){return t.getTime()<Date.now()-864e5},shortcuts:[{text:"15个工作日",onClick:function(t){var e=new Date,r=new Date;e.setTime(e.getTime()+12096e5),t.$emit("pick",[r,e])}},{text:"28个工作日",onClick:function(t){var e=new Date,r=new Date;e.setTime(e.getTime()+2592e6),t.$emit("pick",[r,e])}}]},epicArr:[],sprintFrom:{},sprintFromTem:{},sprintrules:{title:[{required:!0,message:"请输入迭代标题",trigger:"blur"}],timeArr:[{required:!0,message:"请选择日期",trigger:"change"}]}}},computed:Object(s["a"])(Object(s["a"])({},Object(o["b"])({lang:function(t){return t.header.lang}})),{},{projectInfo:function(){return this.$store.state.user.userinfo}}),created:function(){var t=this;this.$route.query.id?Object(c["c"])(this.$route.query.id).then((function(e){t.sprintFrom=e.data,t.$set(t.sprintFrom,"timeArr",[t.sprintFrom.startDate,t.sprintFrom.endDate]),t.sprintFromTem=Object.assign({},t.sprintFrom)})):this.sprintFrom.projectId=this.projectInfo.userUseOpenProject.projectId,Object(a["a"])({fieldName:"epic"}).then((function(e){var r=e.data.mergeValues?e.data.mergeValues:[];t.epicArr=r}))},methods:{resetFields:function(){this.sprintFrom={id:void 0,projectId:this.projectInfo.userUseOpenProject.projectId,title:void 0,description:void 0,startDate:void 0,endDate:void 0,epic:void 0,timeArr:"",fileList:[]},this.$refs["sprintFrom"].resetFields()},submitForm:function(t,e){var r=this;this.$refs[t].validate((function(t){if(!t)return console.log("error submit!!"),!1;if(r.sprintFrom.id){var i=Object(p["d"])(r.sprintFromTem,r.sprintFrom);i.projectId=r.sprintFrom.projectId,i.startDate=r.sprintFrom.timeArr[0],i.endDate=r.sprintFrom.timeArr[1],Object(c["d"])(i).then((function(t){"200"===t.code&&(Object(p["e"])("success",t.msg),Object(p["f"])(r,1e3))})).catch((function(t){console.log(t)}))}else r.sprintFrom.startDate=r.sprintFrom.timeArr[0],r.sprintFrom.endDate=r.sprintFrom.timeArr[1],delete r.sprintFrom.timeArr,Object(c["a"])(r.sprintFrom).then((function(t){"200"===t.code&&(Object(p["e"])("success",t.msg),r.resetFields(),e&&Object(p["f"])(r,1e3))})).catch((function(t){console.log(t)}))}))},giveupBack:function(){this.sprintFrom.id||this.resetFields(),this.returntomenu(this)}}},m=l,u=(r("a23c"),r("2877")),d=Object(u["a"])(m,i,n,!1,null,"67bbeaba",null);e["default"]=d.exports},"56d8":function(t,e,r){},a23c:function(t,e,r){"use strict";r("56d8")},b8aa:function(t,e,r){"use strict";r.d(e,"e",(function(){return n})),r.d(e,"a",(function(){return s})),r.d(e,"c",(function(){return o})),r.d(e,"b",(function(){return a})),r.d(e,"d",(function(){return c}));var i=r("b775");function n(t,e){return Object(i["a"])({url:"/sprint/queryList",method:"post",params:t,data:e})}function s(t){return Object(i["a"])({url:"/sprint/insert",method:"post",data:t})}function o(t){return Object(i["a"])({url:"/sprint/queryById/"+t,method:"get"})}function a(t){return Object(i["a"])({url:"/sprint/delete/"+t,method:"delete"})}function c(t){return Object(i["a"])({url:"/sprint/update",method:"post",data:t})}},f5dd:function(t,e,r){"use strict";r.d(e,"a",(function(){return n}));var i=r("b775");function n(t){return Object(i["a"])({url:"/sysCustomField/getSysCustomField",method:"get",params:t})}}}]);