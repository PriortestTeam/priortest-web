(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-0a34b2a0"],{"0699":function(e,t,l){},"3f92":function(e,t,l){"use strict";l("0699")},"558e":function(e,t,l){"use strict";l.r(t);var a=function(){var e=this,t=e.$createElement,l=e._self._c||t;return l("div",{staticClass:"app-container add-form add-project"},[l("div",{staticClass:"oprate_btn"},[l("el-button",{attrs:{type:"danger"},on:{click:e.importFile}},[e._v("导入")]),l("el-button",{attrs:{type:"warning"},on:{click:e.selectFile}},[e._v("选择文件")]),l("el-button",{attrs:{type:"success"},on:{click:e.saveTemp}},[e._v("保存模板")])],1),l("el-row",{attrs:{gutter:20}},[l("el-col",{attrs:{span:19}},[l("el-form",{ref:"testTemplateForm",attrs:{model:e.testTemplate,"label-position":"right","label-width":"110px",size:"small",rules:e.testTemplateRules}},[l("el-row",{attrs:{gutter:20}},[l("el-col",{attrs:{span:12}},[l("el-form-item",{attrs:{label:"模板名称"}},[l("el-input",{attrs:{maxlength:10,placeholder:"模板名称"},model:{value:e.testTemplate.templateName,callback:function(t){e.$set(e.testTemplate,"templateName","string"===typeof t?t.trim():t)},expression:"testTemplate.templateName"}})],1)],1),l("el-col",{attrs:{span:12}},[l("el-form-item",{attrs:{label:"选中的文件"}},[l("el-input",{attrs:{placeholder:"选中的文件",readonly:!0},model:{value:e.testTemplate.selectFile,callback:function(t){e.$set(e.testTemplate,"selectFile","string"===typeof t?t.trim():t)},expression:"testTemplate.selectFile"}})],1)],1)],1),l("el-row",{attrs:{gutter:20}},[l("el-col",{attrs:{span:6}},[l("el-form-item",{attrs:{label:"测试用例标题",prop:"testTitleCol"}},[l("el-input",{directives:[{name:"Alphabet",rawName:"v-Alphabet"}],attrs:{placeholder:"测试用例标题列"},model:{value:e.testTemplate.testTitleCol,callback:function(t){e.$set(e.testTemplate,"testTitleCol","string"===typeof t?t.trim():t)},expression:"testTemplate.testTitleCol"}})],1)],1),l("el-col",{attrs:{span:6}},[l("el-form-item",{attrs:{label:"状态",prop:"statusCol"}},[l("el-input",{directives:[{name:"Alphabet",rawName:"v-Alphabet"}],attrs:{placeholder:"测试用例标题列"},model:{value:e.testTemplate.statusCol,callback:function(t){e.$set(e.testTemplate,"statusCol","string"===typeof t?t.trim():t)},expression:"testTemplate.statusCol"}})],1)],1),l("el-col",{attrs:{span:6}},[l("el-form-item",{attrs:{label:"描述",prop:"descriptionCol"}},[l("el-input",{directives:[{name:"Alphabet",rawName:"v-Alphabet"}],attrs:{placeholder:"描述列"},model:{value:e.testTemplate.descriptionCol,callback:function(t){e.$set(e.testTemplate,"descriptionCol","string"===typeof t?t.trim():t)},expression:"testTemplate.descriptionCol"}})],1)],1),l("el-col",{attrs:{span:6}},[l("el-form-item",{attrs:{label:"关联故事",prop:"featureCol"}},[l("el-input",{directives:[{name:"Alphabet",rawName:"v-Alphabet"}],attrs:{placeholder:"关联故事列"},model:{value:e.testTemplate.featureCol,callback:function(t){e.$set(e.testTemplate,"featureCol","string"===typeof t?t.trim():t)},expression:"testTemplate.featureCol"}})],1)],1),l("el-col",{attrs:{span:6}},[l("el-form-item",{attrs:{label:"优先级",prop:"priorityCol"}},[l("el-input",{directives:[{name:"Alphabet",rawName:"v-Alphabet"}],attrs:{placeholder:"优先级"},model:{value:e.testTemplate.priorityCol,callback:function(t){e.$set(e.testTemplate,"priorityCol","string"===typeof t?t.trim():t)},expression:"testTemplate.priorityCol"}})],1)],1),l("el-col",{attrs:{span:6}},[l("el-form-item",{attrs:{label:"浏览器",prop:"browserCol"}},[l("el-input",{directives:[{name:"Alphabet",rawName:"v-Alphabet"}],attrs:{placeholder:"浏览器"},model:{value:e.testTemplate.browserCol,callback:function(t){e.$set(e.testTemplate,"browserCol","string"===typeof t?t.trim():t)},expression:"testTemplate.browserCol"}})],1)],1),l("el-col",{attrs:{span:6}},[l("el-form-item",{attrs:{label:"平台",prop:"platformCol"}},[l("el-input",{directives:[{name:"Alphabet",rawName:"v-Alphabet"}],attrs:{placeholder:"平台"},model:{value:e.testTemplate.platformCol,callback:function(t){e.$set(e.testTemplate,"platformCol","string"===typeof t?t.trim():t)},expression:"testTemplate.platformCol"}})],1)],1),l("el-col",{attrs:{span:6}},[l("el-form-item",{attrs:{label:"版本",prop:"versionCol"}},[l("el-input",{directives:[{name:"Alphabet",rawName:"v-Alphabet"}],attrs:{placeholder:"版本"},model:{value:e.testTemplate.versionCol,callback:function(t){e.$set(e.testTemplate,"versionCol","string"===typeof t?t.trim():t)},expression:"testTemplate.versionCol"}})],1)],1),l("el-col",{attrs:{span:6}},[l("el-form-item",{attrs:{label:"测试分类",prop:"caseCategoryCol"}},[l("el-input",{directives:[{name:"Alphabet",rawName:"v-Alphabet"}],attrs:{placeholder:"测试分类"},model:{value:e.testTemplate.caseCategoryCol,callback:function(t){e.$set(e.testTemplate,"caseCategoryCol","string"===typeof t?t.trim():t)},expression:"testTemplate.caseCategoryCol"}})],1)],1),l("el-col",{attrs:{span:6}},[l("el-form-item",{attrs:{label:"测试类型",prop:"caseTypeCol"}},[l("el-input",{directives:[{name:"Alphabet",rawName:"v-Alphabet"}],attrs:{placeholder:"测试类型"},model:{value:e.testTemplate.caseTypeCol,callback:function(t){e.$set(e.testTemplate,"caseTypeCol","string"===typeof t?t.trim():t)},expression:"testTemplate.caseTypeCol"}})],1)],1),l("el-col",{attrs:{span:6}},[l("el-form-item",{attrs:{label:"ExternalID",prop:"externalIdCol"}},[l("el-input",{directives:[{name:"Alphabet",rawName:"v-Alphabet"}],attrs:{placeholder:"ExternalID"},model:{value:e.testTemplate.externalIdCol,callback:function(t){e.$set(e.testTemplate,"externalIdCol","string"===typeof t?t.trim():t)},expression:"testTemplate.externalIdCol"}})],1)],1),l("el-col",{attrs:{span:6}},[l("el-form-item",{attrs:{label:"测试环境",prop:"envCol"}},[l("el-input",{directives:[{name:"Alphabet",rawName:"v-Alphabet"}],attrs:{placeholder:"测试环境"},model:{value:e.testTemplate.envCol,callback:function(t){e.$set(e.testTemplate,"envCol","string"===typeof t?t.trim():t)},expression:"testTemplate.envCol"}})],1)],1),l("el-col",{attrs:{span:6}},[l("el-form-item",{attrs:{label:"测试设备",prop:"deviceTypeCol"}},[l("el-input",{directives:[{name:"Alphabet",rawName:"v-Alphabet"}],attrs:{placeholder:"测试设备"},model:{value:e.testTemplate.deviceTypeCol,callback:function(t){e.$set(e.testTemplate,"deviceTypeCol","string"===typeof t?t.trim():t)},expression:"testTemplate.deviceTypeCol"}})],1)],1),l("el-col",{attrs:{span:6}},[l("el-form-item",{attrs:{label:"模块",prop:"moduleCol"}},[l("el-input",{directives:[{name:"Alphabet",rawName:"v-Alphabet"}],attrs:{placeholder:"模块"},model:{value:e.testTemplate.moduleCol,callback:function(t){e.$set(e.testTemplate,"moduleCol","string"===typeof t?t.trim():t)},expression:"testTemplate.moduleCol"}})],1)],1),l("el-col",{attrs:{span:6}},[l("el-form-item",{attrs:{label:"Automation",prop:"automationCol"}},[l("el-input",{directives:[{name:"Alphabet",rawName:"v-Alphabet"}],attrs:{placeholder:"Automation"},model:{value:e.testTemplate.automationCol,callback:function(t){e.$set(e.testTemplate,"automationCol","string"===typeof t?t.trim():t)},expression:"testTemplate.automationCol"}})],1)],1),l("el-col",{attrs:{span:6}},[l("el-form-item",{attrs:{label:"测试条件",prop:"preConditionCol"}},[l("el-input",{directives:[{name:"Alphabet",rawName:"v-Alphabet"}],attrs:{placeholder:"测试条件"},model:{value:e.testTemplate.preConditionCol,callback:function(t){e.$set(e.testTemplate,"preConditionCol","string"===typeof t?t.trim():t)},expression:"testTemplate.preConditionCol"}})],1)],1),l("el-col",{attrs:{span:6}},[l("el-form-item",{attrs:{label:"测试数据",prop:"preDataCol"}},[l("el-input",{directives:[{name:"Alphabet",rawName:"v-Alphabet"}],attrs:{placeholder:"测试数据"},model:{value:e.testTemplate.preDataCol,callback:function(t){e.$set(e.testTemplate,"preDataCol","string"===typeof t?t.trim():t)},expression:"testTemplate.preDataCol"}})],1)],1),l("el-col",{attrs:{span:6}},[l("el-form-item",{attrs:{label:"Comments",prop:"commentsCol"}},[l("el-input",{directives:[{name:"Alphabet",rawName:"v-Alphabet"}],attrs:{placeholder:"Comments"},model:{value:e.testTemplate.commentsCol,callback:function(t){e.$set(e.testTemplate,"commentsCol","string"===typeof t?t.trim():t)},expression:"testTemplate.commentsCol"}})],1)],1)],1),l("el-divider",{attrs:{"content-position":"left"}},[e._v("Step")]),l("el-row",{attrs:{gutter:20}},[l("el-col",{attrs:{span:6}},[l("el-form-item",{attrs:{label:"步骤",prop:"stepCol"}},[l("el-input",{directives:[{name:"Alphabet",rawName:"v-Alphabet"}],attrs:{placeholder:"步骤"},model:{value:e.testTemplate.stepCol,callback:function(t){e.$set(e.testTemplate,"stepCol","string"===typeof t?t.trim():t)},expression:"testTemplate.stepCol"}})],1)],1),l("el-col",{attrs:{span:6}},[l("el-form-item",{attrs:{label:"测试数据",prop:"stepTestDataCol"}},[l("el-input",{directives:[{name:"Alphabet",rawName:"v-Alphabet"}],attrs:{placeholder:"测试数据"},model:{value:e.testTemplate.stepTestDataCol,callback:function(t){e.$set(e.testTemplate,"stepTestDataCol","string"===typeof t?t.trim():t)},expression:"testTemplate.stepTestDataCol"}})],1)],1),l("el-col",{attrs:{span:6}},[l("el-form-item",{attrs:{label:"预期结果",prop:"stepExpectResultCol"}},[l("el-input",{directives:[{name:"Alphabet",rawName:"v-Alphabet"}],attrs:{placeholder:"预期结果"},model:{value:e.testTemplate.stepExpectResultCol,callback:function(t){e.$set(e.testTemplate,"stepExpectResultCol","string"===typeof t?t.trim():t)},expression:"testTemplate.stepExpectResultCol"}})],1)],1)],1),l("el-divider",{attrs:{"content-position":"left"}},[e._v("导入规则")]),l("el-row",[l("el-col",{staticStyle:{display:"flex"},attrs:{span:6}},[l("el-form-item",{attrs:{"label-width":"0px"}},[l("el-checkbox",{model:{value:e.testTemplate.ifSplitTestStep,callback:function(t){e.$set(e.testTemplate,"ifSplitTestStep","string"===typeof t?t.trim():t)},expression:"testTemplate.ifSplitTestStep"}},[e._v("步骤分隔符")])],1),e.testTemplate.ifSplitTestStep?l("el-form-item",{attrs:{"label-width":"10px",prop:"splitTestStep"}},[l("el-input",{attrs:{placeholder:"分隔符只能为逗号','或者分号';'"},model:{value:e.testTemplate.splitTestStep,callback:function(t){e.$set(e.testTemplate,"splitTestStep","string"===typeof t?t.trim():t)},expression:"testTemplate.splitTestStep"}})],1):e._e()],1),l("el-col",{attrs:{span:6}},[l("el-form-item",{attrs:{"label-width":"0px"}},[l("el-checkbox",{model:{value:e.testTemplate.ifIgnorFirstRow,callback:function(t){e.$set(e.testTemplate,"ifIgnorFirstRow","string"===typeof t?t.trim():t)},expression:"testTemplate.ifIgnorFirstRow"}},[e._v("第一行不导入")])],1)],1),l("el-col",{attrs:{span:6}},[l("el-form-item",{attrs:{"label-width":"0px"}},[l("el-checkbox",{model:{value:e.testTemplate.ifSendEmail,callback:function(t){e.$set(e.testTemplate,"ifSendEmail","string"===typeof t?t.trim():t)},expression:"testTemplate.ifSendEmail"}},[e._v("导入完毕邮件通知我")])],1)],1),l("el-col",{attrs:{span:6}},[l("el-form-item",{attrs:{"label-width":"0px"}},[l("el-checkbox",{model:{value:e.testTemplate.ifCreateView,callback:function(t){e.$set(e.testTemplate,"ifCreateView","string"===typeof t?t.trim():t)},expression:"testTemplate.ifCreateView"}},[e._v("创建【创建时间】新视图")])],1)],1)],1),l("el-row",[l("el-col",{staticStyle:{display:"flex"},attrs:{span:24}},[l("el-form-item",{attrs:{"label-width":"0px"}},[l("el-checkbox",{model:{value:e.testTemplate.ifUpdateCase,callback:function(t){e.$set(e.testTemplate,"ifUpdateCase","string"===typeof t?t.trim():t)},expression:"testTemplate.ifUpdateCase"}},[e._v("更新已有测试用例")])],1),l("br")],1),e.testTemplate.ifUpdateCase?l("el-col",[l("span",{staticStyle:{color:"red","font-size":"10px"}},[e._v("请确保您要更新的 外部ID 、 故事 与现有测试用例相一致。如果导入的数据没有在数据库中找到对应的记录，会依据导入规则添加测试用例。")])]):e._e()],1)],1)],1),l("el-col",{attrs:{span:5}},[l("div",{staticClass:"temp"},[l("el-radio-group",{staticStyle:{"min-width":"100%"},model:{value:e.selectTemp,callback:function(t){e.selectTemp=t},expression:"selectTemp"}},e._l(e.tempList,(function(t){return l("div",{key:t.id,staticClass:"select-item",style:{marginBottom:0==t.ifDefault?0:"15px"}},[l("el-radio",{attrs:{label:t.id},nativeOn:{click:function(l){return l.preventDefault(),e.onRadioChange(t)}}},[e._v(" "+e._s(t.templateName)+" ")]),0==t.ifDefault?l("el-button",{staticStyle:{padding:"0","margin-left":"20px"},attrs:{type:"text",icon:"el-icon-close"},on:{click:function(l){return e.delTemp(t)}}}):e._e()],1)})),0)],1)])],1)],1)},r=[];function s(e,t){(null==t||t>e.length)&&(t=e.length);for(var l=0,a=new Array(t);l<t;l++)a[l]=e[l];return a}function o(e){if(Array.isArray(e))return s(e)}l("a4d3"),l("e01a"),l("d3b7"),l("d28b"),l("3ca3"),l("ddb0"),l("a630");function i(e){if("undefined"!==typeof Symbol&&null!=e[Symbol.iterator]||null!=e["@@iterator"])return Array.from(e)}l("fb6a"),l("b0c0"),l("ac1f"),l("00b4");function n(e,t){if(e){if("string"===typeof e)return s(e,t);var l=Object.prototype.toString.call(e).slice(8,-1);return"Object"===l&&e.constructor&&(l=e.constructor.name),"Map"===l||"Set"===l?Array.from(e):"Arguments"===l||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(l)?s(e,t):void 0}}function p(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function m(e){return o(e)||i(e)||n(e)||p()}var c=l("5530"),u=(l("e9c4"),l("4de4"),l("99af"),l("bb5f"));function d(e){return new Promise((function(t,l){var a={accept:"image/*",multiple:!0};e&&(a.accept=e.accept,a.multiple=e.multiple);var r=document.createElement("input");r.type="file",r.accept=a.accept,r.multiple=a.multiple,r.addEventListener("change",(function(e){a.multiple?t({file:r.files,url:r.value}):t({file:r.files[0],url:r.value})})),r.click()}))}var f=null,b={name:"ImportTestCases",data:function(){var e=this,t=function(t,l,a){var r=e;if(""!==l&&"string"===typeof l){for(var s in e.testTemplate)if(s!==t.field&&l===e.testTemplate[s])return console.log(t.field,s,e.testTemplate),void a(new Error("列".concat(l,"重复出现")));null==f&&(f=setTimeout((function(){r.$refs.testTemplateForm.validate(),f=null}),300)),a()}else a()};return{selectTempDetail:null,selectTemp:"",tempList:[],file:null,testTemplate:{selectFile:"",templateName:"",testTitleCol:"",statusCol:"",descriptionCol:"",featureCol:"",priorityCol:"",browserCol:"",platformCol:"",versionCol:"",caseCategoryCol:"",caseTypeCol:"",externalIdCol:"",envCol:"",deviceTypeCol:"",moduleCol:"",automationCol:"",preConditionCol:"",commentsCol:"",preDataCol:"",stepCol:"",stepTestDataCol:"",stepExpectResultCol:"",ifSplitTestStep:!1,splitTestStep:"",ifIgnorFirstRow:!1,ifSendEmail:!1,ifCreateView:!1,ifUpdateCase:!1},testTemplateRules:{testTitleCol:[{required:!0,message:"请输入测试标题列",trigger:"blur"},{validator:t,trigger:"blur"}],statusCol:[{validator:t,trigger:"blur"}],descriptionCol:[{validator:t,trigger:"blur"}],featureCol:[{required:!0,message:"请输入关联故事列",trigger:"blur"},{validator:t,trigger:"blur"}],priorityCol:[{required:!0,message:"请输入优先级列",trigger:"blur"},{validator:t,trigger:"blur"}],browserCol:[{validator:t,trigger:"blur"}],platformCol:[{validator:t,trigger:"blur"}],versionCol:[{validator:t,trigger:"blur"}],caseCategoryCol:[{required:!0,message:"请输入测试分类列",trigger:"blur"},{validator:t,trigger:"blur"}],caseTypeCol:[{required:!0,message:"请输入测试类型列",trigger:"blur"},{validator:t,trigger:"blur"}],externalIdCol:[{validator:t,trigger:"blur"}],envCol:[{required:!0,message:"请输入测试环境列",trigger:"blur"},{validator:t,trigger:"blur"}],deviceTypeCol:[{validator:t,trigger:"blur"}],automationCol:[{validator:t,trigger:"blur"}],preConditionCol:[{validator:t,trigger:"blur"}],commentsCol:[{validator:t,trigger:"blur"}],preDataCol:[{validator:t,trigger:"blur"}],stepCol:[{validator:t,trigger:"blur"}],stepTestDataCol:[{validator:t,trigger:"blur"}],stepExpectResultCol:[{validator:t,trigger:"blur"}],moduleCol:[{required:!0,message:"请输入模块列",trigger:"blur"},{validator:t,trigger:"blur"}],splitTestStep:[{required:!0,message:"请输入步骤分隔符",trigger:"blur"}]},notifyPromise:Promise.resolve()}},created:function(){this.queryListByUserId()},methods:{notify:function(e){var t=this,l=e.type,a=void 0===l?"success":l,r=e.title,s=e.message,o=e.duration,i=void 0===o?0:o,n=e.dangerouslyUseHTMLString,p=void 0===n||n,m=e.position,c=void 0===m?"top-right":m;this.notifyPromise=this.notifyPromise.then(this.$nextTick).then((function(){t.$notify({type:a,title:r,message:s,duration:i,dangerouslyUseHTMLString:p,position:c,customClass:"notifyStyle"})}))},selectFile:function(){var e=this;d({accept:".et,.xlsx,.xls,.csv",multiple:!1}).then((function(t){var l=t.file.name.substring(t.file.name.lastIndexOf(".")+1);"et"!==l&&"xlsx"!==l&&"xls"!==l&&"csv"!==l?e.$message.warning("要导入的文件只能是.et,.xlsx,.xls,.csv四种格式"):(e.file=t.file,e.testTemplate.selectFile=t.url)}))},importFile:function(){var e=this;this.$refs.testTemplateForm.validate((function(t){if(console.log("**************"),!t)return console.log("error submit!!"),!1;if(null===e.file)e.$message.warning("请选择要导入的文件");else{if(e.testTemplate.ifSplitTestStep&&","!==e.testTemplate.splitTestStep&&";"!==e.testTemplate.splitTestStep)return e.$message.warning("步骤分隔符只能是‘,’或者‘;’");var l=new FormData;console.log(e.file),l.append("file",e.file,e.file.name);var a=Object(c["a"])({},e.testTemplate);delete a.templateName,delete a.selectFile,l.append("param",JSON.stringify(a));var r=e.$loading({lock:!0,text:"测试用例导入中",spinner:"el-icon-loading",background:"rgba(0, 0, 0, 0.2)"});Object(u["k"])(l).then((function(t){"200"===t.code&&e.$message.success("测试用例导入，请稍后查看邮箱查询导入结果")})).catch((function(t){"Network Error"===t.message&&e.$message.error("您选中的文件发生了变动或不存在，请重新选择文件")})).finally((function(){r.close()}))}}))},saveTemp:function(){var e=this;this.selectTempDetail&&1===this.selectTempDetail.ifDefault?this.$message.warning("当前模板是默认模板，不可修改"):this.$refs.testTemplateForm.validate((function(t){if(!t)return console.log("error submit!!"),!1;if(""===e.testTemplate.templateName)e.$message.warning("请输入模板名称");else{if(e.testTemplate.ifSplitTestStep&&","!==e.testTemplate.splitTestStep&&";"!==e.testTemplate.splitTestStep)return e.$message.warning("步骤分隔符只能是‘,’或者‘;’");var l=Object(c["a"])({},e.testTemplate),a={templateName:l.templateName};delete l.templateName,delete l.selectFile,a.jsonContent=JSON.stringify(l),""===e.selectTemp?e.addTemp(a):(a.id=e.selectTemp,e.updateTemp(a))}}))},addTemp:function(e){var t=this,l=this.$loading({lock:!0,text:"模板保存中",spinner:"el-icon-loading",background:"rgba(0, 0, 0, 0.2)"});Object(u["c"])(e).then((function(e){"200"===e.code?(t.$message.success("模板保存成功"),t.queryListByUserId()):t.$message.error(e.message)})).finally((function(){l.close()}))},updateTemp:function(e){var t=this,l=this.$loading({lock:!0,text:"模板更新中",spinner:"el-icon-loading",background:"rgba(0, 0, 0, 0.2)"});Object(u["p"])(e).then((function(e){"200"===e.code?(t.$message.success("模板更新成功"),t.queryListByUserId()):t.$message.error(e.message)})).finally((function(){l.close()}))},delTemp:function(e){var t=this;this.$confirm("请问是否确认删除该模板?","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then((function(){var l=t.$loading({lock:!0,text:"模板删除中",spinner:"el-icon-loading",background:"rgba(0, 0, 0, 0.2)"});Object(u["f"])(e.id).then((function(l){"200"===l.code&&(t.$message.success("删除成功!"),t.selectTemp===e.id&&(t.selectTemp="",t.selectTempDetail=null),t.queryListByUserId())})).finally((function(){l.close()}))})).catch((function(){}))},queryListByUserId:function(){var e=this;Object(u["l"])().then((function(t){if("200"===t.code){var l=t.data.filter((function(e){return 1===e.ifDefault})),a=t.data.filter((function(e){return 0===e.ifDefault}));e.tempList=[].concat(m(l),m(a))}}))},onRadioChange:function(e){if(this.selectTemp===e.id)return this.selectTemp="",this.selectTempDetail=null,void this.initialize();this.selectTemp=e.id,this.selectTempDetail=e;var t=this.testTemplate.selectFile,l=JSON.parse(e.jsonContent);this.testTemplate=Object(c["a"])({selectFile:t,templateName:e.templateName},l)},initialize:function(){var e=this.testTemplate.selectFile;this.testTemplate={selectFile:e,templateName:"",testTitleCol:"",statusCol:"",descriptionCol:"",featureCol:"",priorityCol:"",browserCol:"",platformCol:"",versionCol:"",caseCategoryCol:"",caseTypeCol:"",externalIdCol:"",envCol:"",deviceTypeCol:"",moduleCol:"",automationCol:"",preConditionCol:"",commentsCol:"",preDataCol:"",stepCol:"",stepTestDataCol:"",stepExpectResultCol:"",ifSplitTestStep:!1,splitTestStep:"",ifIgnorFirstRow:!1,ifSendEmail:!1,ifCreateView:!1,ifUpdateCase:!1}}}},C=b,T=(l("3f92"),l("2877")),g=Object(T["a"])(C,a,r,!1,null,"39ca3e04",null);t["default"]=g.exports},bb5f:function(e,t,l){"use strict";l.d(t,"m",(function(){return r})),l.d(t,"n",(function(){return s})),l.d(t,"a",(function(){return o})),l.d(t,"g",(function(){return i})),l.d(t,"d",(function(){return n})),l.d(t,"h",(function(){return p})),l.d(t,"o",(function(){return m})),l.d(t,"b",(function(){return c})),l.d(t,"e",(function(){return u})),l.d(t,"i",(function(){return d})),l.d(t,"j",(function(){return f})),l.d(t,"l",(function(){return b})),l.d(t,"c",(function(){return C})),l.d(t,"f",(function(){return T})),l.d(t,"p",(function(){return g})),l.d(t,"k",(function(){return v}));var a=l("b775");function r(e,t){return console.log(t),Object(a["a"])({url:"/testCase/queryList",method:"post",params:e,data:t})}function s(e){return Object(a["a"])({url:"/leftJoin/queryFestCaseTitles",method:"get",params:e})}function o(e){return Object(a["a"])({url:"/testCase/insert",method:"post",data:e})}function i(e){return Object(a["a"])({url:"/testCase/queryById/"+e,method:"get"})}function n(e){return Object(a["a"])({url:"/testCase/delete/"+e,method:"delete"})}function p(e){return Object(a["a"])({url:"/testCase/update",method:"post",data:e})}function m(e,t){return Object(a["a"])({url:"/testCaseStep/queryList",method:"post",params:e,data:t})}function c(e){return Object(a["a"])({url:"/testCaseStep/insert",method:"post",data:e})}function u(e){return Object(a["a"])({url:"/testCaseStep/delete/"+e,method:"delete"})}function d(e){return Object(a["a"])({url:"/testCaseStep/update",method:"post",data:e})}function f(e){var t={featureId:e};return Object(a["a"])({url:"/testCase/queryTestNeedByFeatureId",method:"get",params:t})}function b(){return Object(a["a"])({url:"/testCaseTemplate/queryListByUserId",method:"get"})}function C(e){return Object(a["a"])({url:"/testCaseTemplate/insert",method:"post",data:e})}function T(e){return Object(a["a"])({url:"/testCaseTemplate/delete/"+e,method:"delete"})}function g(e){return Object(a["a"])({url:"/testCaseTemplate/update",method:"post",data:e})}function v(e){return Object(a["a"])({url:"/testCaseTemplate/importTestCase",method:"post",data:e})}}}]);