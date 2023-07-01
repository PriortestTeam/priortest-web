<template>
  <div>
    <el-form
      :model="ruleForm"
      status-icon
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
	  <!-- <el-button @click="showMsg()">msg</el-button> -->
	  <el-button
	    :loading="subLoad"
	    type="primary"
	    @click="submitForm('ruleForm')"
	    >保存</el-button
	  >
	  <el-button @click="resetForm('ruleForm')">放弃</el-button>
      <div class="formBox">
        <div class="attributes">
          <el-form-item label="字段名称：" prop="fieldNameCn">
            <el-input
              :disabled="isEdit"
              v-model.trim="ruleForm.fieldNameCn"
            ></el-input>
          </el-form-item>
          <el-form-item label="类型：" prop="fieldType">
            <el-select
              :disabled="isEdit"
              clearable
              v-model="ruleForm.fieldType"
              placeholder="请选择"
              @change="changeFn"
            >
              <el-option
                v-for="item in fieldTypeOptions"
                :key="item.id"
                :label="item.nameCn"
                :value="item.nameCn"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item v-if="ReTeLin" label="长度：" prop="length">
            <el-input
              min="0"
              type="number"
              v-model="ruleForm.length"
              @change="maxChange"
            ></el-input>
          </el-form-item>
          <el-form-item v-if="linkDownShow" label="链接字段：">
            <el-select
              clearable
              v-model="systemData"
              placeholder="请选择"
              @change="linkDownChange"
            >
              <el-option
                v-for="(item, index) in systemList"
                :key="index"
                :label="item.fieldNameCn"
                :value="item.customFieldId"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item v-if="valueSource" label="值来源：">
            <el-radio v-model="radioData" label="1">新值</el-radio> <br />
            <el-radio v-model="radioData" label="2">系统列表</el-radio> <br />
            <div class="attributesItem">
              值：<el-input
                v-model.trim="newVal"
                :type="numType ? 'text' : numData ? 'number' : 'text'"
                :min="numType ? '' : '0'"
              ></el-input>
              <el-button
                style="width: 40px; height: 30px; margin: 2% 0 0 5px"
                type="primary"
                @click="addNewVal()"
                >添加</el-button
              >
            </div>
            <div class="systemList">
              <el-select
                v-if="radioData == 2"
                clearable
                v-model="systemData"
                placeholder="请选择"
                @change="systemChange"
              >
                <el-option
                  v-for="(item, index) in systemList"
                  :key="index"
                  :label="item.fieldNameCn"
                  :value="item.customFieldId"
                >
                </el-option>
              </el-select>
            </div>
          </el-form-item>
        </div>

        <div v-if="valueSource" class="newValue">
          <div>
            <p>value</p>
            <p
              v-for="(item, index) in newValList"
              :key="index"
              @click="
                () => {
                  delect = true;
                  deleceValueSource = index;
                }
              "
            >
              <span>{{ item }}</span>
            </p>
          </div>
          <el-button
            @click="delectNewVal()"
            :disabled="!delect"
            style="height: 30px; background-color: gray; color: #fff"
            >删除</el-button
          >
        </div>

        <!-- 链接下拉框 -->
        <div v-if="linkDownShow" class="linkDown">
          <div
            v-for="(item, index) in linkDownList"
            :key="index"
            class="STGData"
          >
            <div class="info">
              <div class="header">
                <p>{{ item.order }}</p>
                <div>
                  <el-button type="primary" @click="STGAddFn(item.order)"
                    >添加</el-button
                  >
                  <el-button
                    type="danger"
                    :disabled="!item.orderDelect"
                    @click="
                      () => {
                        item.orderList.splice(deleceSTG, 1);
                        item.orderDelect = false;
                      }
                    "
                    >删除</el-button
                  >
                </div>
              </div>
              <div class="infodata">
                <el-input v-model.trim="item.orderInd" placeholder="link" />
                <p
                  v-for="(subitem, subindex) in item.orderList"
                  :key="subindex"
                  @click="
                    () => {
                      item.orderDelect = true;
                      deleceSTG = subindex;
                    }
                  "
                >
                  {{ subitem }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div class="componentAttributes">
          <div class="RangeTitle">
            <span class="rangeNeed" style="width: 88px">范围</span>
            <span style="width: 65px">是否必填</span>
            <span style="width: 173px" v-if="!linkDownShow">初始值</span>
            <span style="width: 173px" v-else> </span>
          </div>
          <el-form-item
            class="formItem"
            v-for="(item, index) in RangeList"
            :key="index"
			label-width="0px"
          >
            <el-checkbox
              @change="changeRange"
              class="Range"
              v-model="item.range"
              >{{ item.nameCn }}</el-checkbox
            >
            <el-checkbox
              style="width: 50px"
              :disabled="!item.range"
              v-model="item.must"
            ></el-checkbox>
            <el-checkbox
              style="width: 50px"
              v-if="!linkDownShow"
              :disabled="!item.range"
              v-model="item.initial"
            ></el-checkbox>
            <el-input
              v-if="
                item.initial &&
                !valueSource &&
                !downMenu &&
                !dateShow &&
                !oneInputs &&
                !linkDownShow
              "
              v-model.trim="item.defaultValue"
            ></el-input>
            <el-select
              v-if="
                item.initial &&
                valueSource &&
                !downMenu &&
                !dateShow &&
                !oneInputs &&
                !linkDownShow
              "
              clearable
              placeholder="请选择"
              v-model="item.defaultValue"
            >
              <el-option
                v-for="(item, index) in newValList"
                :key="index"
                :label="item"
                :value="item"
              >
              </el-option>
            </el-select>
            <el-select
              v-if="
                item.initial &&
                !valueSource &&
                downMenu &&
                !dateShow &&
                !oneInputs &&
                !linkDownShow
              "
              clearable
              placeholder="请选择"
              v-model="item.defaultValue"
            >
              <el-option
                v-for="item in menuList"
                :key="item.id"
                :label="item.userName"
                :value="item.userName"
              >
              </el-option>
            </el-select>
            <el-date-picker
              v-if="
                item.initial &&
                !valueSource &&
                !downMenu &&
                dateShow &&
                !oneInputs &&
                !linkDownShow
              "
              v-model="item.defaultValue"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"
            >
            </el-date-picker>
          </el-form-item>
          <div style="margin-left: 100px; color: red" v-show="rangeCheck">
            请选择范围
          </div>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script>
import {
  fieldTypeAPI,
  RangeS,
  fieldList,
  getInfo,
  add,
  systemListAPI,
  downMenuAPI,
  unDataApi,
} from "@/api/customFFields";
export default {
  props: {
    rowData: Object,
    getqueryCustomList: Function,
  },
  data() {
    return {
      ruleForm: {
        fieldNameCn: "",
        fieldType: "",
        fieldRange: [],
        length: 0,
        type: [],
      },
      rules: {
        fieldNameCn: [
          { required: true, message: "请输入字段名称", trigger: "blur" },
        ],
        fieldRange: [
          {
            required: true,
            type: "array",
            message: "请选择范围",
            trigger: "change",
          },
        ],
        type: [
          {
            type: "array",
            required: true,
            message: "请至少选择一个活动性质",
            trigger: "change",
          },
        ],
        fieldType: [{ required: true, message: "请选择类型", trigger: "blur" }],
        length: [{ required: true, message: "请输入长度", trigger: "blur" }],
      },
      fieldTypeOptions: [],
      RangeList: [],
      projectId: "",
      fieldsList: [],
      radioData: "1",
      valueSource: false,
      newVal: "",
      newValList: [],
      possibleValue: {},
      systemList: [],
      systemData: "",
      menuList: [],
      downMenu: false,
      menuData: "",
      numType: false,
      numData: false,
      ReTeLin: false,
      ReTeLinData: "",
      dateShow: false,
      isEdit: false,
      idData: "",
      STGList: [],
      PRDList: [],
      STGData: "",
      PRDData: "",
      linkDownShow: false,
      oneInputs: false,
      valueSourceStyle: "",
      deleceValueSource: "",
      deleceSTG: "",
      STGStyle: "",
      delecePRD: "",
      PRDStyle: "",
      delect: false,
      stgDelect: false,
      prdDelect: false,
      linkDownpossible: {},
      subLoad: false,
      dataType: false,
      linkDownList: [],
      rangeCheck: false,
    };
  },
  mounted() {
    this.RangeSFn();
    // 类型接口
    fieldTypeAPI().then((res) => {
      this.fieldTypeOptions = res.data;
    });

    // 系统列表接口
    systemListAPI({ projectId: sessionStorage.getItem("projectId") }).then(
      (res) => {
        this.systemList = res.data;
      }
    );
    // 下拉菜单接口
    downMenuAPI(sessionStorage.getItem("projectId")).then((res) => {
      this.menuList = res.data;
    });
    this.projectId = sessionStorage.getItem("projectId");
  },
  methods: {
    //range
    changeRange() {
      const rangeCopy = [...this.RangeList];
      let isNull = true;
      rangeCopy.forEach((item) => {
        if (item.range) {
          isNull = false;
        }
      });
      this.rangeCheck = isNull;
      console.log("the null:", isNull);
    },
    // debug
    showMsg() {
      console.log("the range:", this.RangeList);
    },
    // 范围接口
    RangeSFn() {
      RangeS().then((res) => {
        res.data.forEach((item) => {
          item.range = false;
          item.must = false;
          item.initial = false;
          item.defaultValue = "";
        });
        this.RangeList = res.data;
      });
    },
    // 切换类型 下拉框 多选项联动
    changeFn(val) {
      this.ReTeLinData = val;
      if (val == "下拉框" || val == "多选项") {
        this.numType = true;
        this.numData = false;
        this.valueSource = true;
      } else if (val == "数值") {
        this.numData = true;
        this.numType = false;
        this.valueSource = true;
      } else {
        this.numData = false;
        this.numType = false;
        this.valueSource = false;
      }
      if (val == "用户列表") {
        this.downMenu = true;
      } else {
        this.downMenu = false;
      }
      if (val == "单选框" || val == "复选框") {
        this.oneInputs = true;
      } else {
        this.oneInputs = false;
      }
      if (val == "备注" || val == "文本" || val == "链接") {
        this.ReTeLin = true;
      } else {
        this.ReTeLin = false;
      }
      if (val == "日期") {
        this.dateShow = true;
      } else {
        this.dateShow = false;
      }
      if (val == "链接下拉框") {
        this.linkDownShow = true;
      } else {
        this.linkDownShow = false;
      }
      this.newValList = [];
      this.systemData = "";
    },
    // 长度监听
    maxChange(val) {
      if (this.ReTeLinData == "文本" || this.ReTeLinData == "链接") {
        if (this.ruleForm.length > 100) {
          // this.ruleForm.length = 100;
          this.$message({
            message: "最大值不能超过100,系统为您的输入重新设置为100",
            type: "warning",
          });
        }
      } else if (this.ReTeLinData == "备注") {
        if (this.ruleForm.length > 1000) {
          this.ruleForm.length = 1000;
          this.$message({
            message: "最大值不能超过1000,系统为您的输入重新设置为1000",
            type: "warning",
          });
        }
      }
    },
    // 添加新值
    addNewVal() {
      if (this.newVal.length == 0) return false;
      this.newValList.push(this.newVal);
      this.newVal = "";
    },
    // 删除新值
    delectNewVal() {
      this.newValList.splice(this.deleceValueSource, 1);
      this.delect = false;
    },
    // 系统列表
    systemChange(val) {
      let arr = [];
      // this.newValList = [];
      this.systemList.forEach((item) => {
        if (item.customFieldId == val) {
          item.possibleValue = JSON.parse(item.possibleValue);
          if (item.possibleValue.order_1) {
            for (var key in item.possibleValue) {
              arr.push(item.possibleValue[key]);
            }
            // arr.forEach((item) => {
            //   this.newValList.push(item);
            // });
            this.newValList = arr;
          } else {
            for (var key in item.possibleValue) {
              if (item.possibleValue[key].length > 0) {
                if (item.possibleValue[key] instanceof Array) {
                  item.possibleValue &&
                    item.possibleValue[key].forEach((item) => {
                      arr.push(item);
                    });
                } else {
                  arr.push(item.possibleValue[key]);
                }
              }
            }
            // arr.forEach((item) => {
            //   this.newValList.push(item);
            // });
            this.newValList = arr;
          }
        }
      });
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 范围判定
          const rangeCopy = [...this.RangeList];
          this.rangeCheck = true;
          rangeCopy.forEach((item) => {
            if (item.range) {
              this.rangeCheck = false;
            }
          });
          if (this.rangeCheck) {
            console.log("debug cant allow-----------");
            return false;
          }

          this.subLoad = true;
          let obj = {};
          this.fieldTypeOptions.forEach((item) => {
            if (item.nameCn == this.ruleForm.fieldType) {
              obj.fieldTypeCn = item.nameCn;
              obj.fieldType = item.scopeName;
            }
          });
          obj.fieldNameCn = this.ruleForm.fieldNameCn;
          obj.length = this.ruleForm.length;
          obj.projectId = sessionStorage.getItem("projectId");
          //---------------------------------

          //----------------------------------
          let list = [];
          this.RangeList.forEach((item) => {
            if (item.range == true) {
              if (item.initial == false) item.defaultValue = "";
              if(this.ReTeLinData == "单选框" || this.ReTeLinData == "复选框"){
                item.defaultValue = item.initial?'1':'0';
              }
              list.push({
                defaultValue: item.defaultValue,
                mandatory: item.must,
                scope: item.scopeName,
                scopeNameCn: item.nameCn,
                scopeId: item.id,
              });
            }
          });

          //----------------------------------
          if (this.valueSource) {
            // 新值
            this.newValList.map((item, index) => {
              this.possibleValue["order_" + Number(index + 1)] = item;
            });
            console.log("新值");
          } else if (this.linkDownShow) {
            // 链接下拉框
            let keys = [];
            let values = [];
            let list = {};
            for (const key in this.linkDownList) {
              keys.push(this.linkDownList[key].order);
              values.push(this.linkDownList[key].orderList);
            }
            keys.forEach((item, index) => {
              list[item] = values[index];
            });
            list.others = { parentListId: this.systemData };
            this.possibleValue = list;
            console.log("链接下拉框");
          } else if (this.downMenu) {
            // 用户下拉
            this.menuList.map((item, index) => {
              this.possibleValue["order_" + Number(index + 1)] = item.userName;
            });
            console.log("用户下拉");
          } else {
            this.possibleValue = null;
            console.log("空");
          }

          let objData = {
            attributes: obj,
            componentAttributes: list,
            customFieldId: 0,
            possibleValue: JSON.stringify(this.possibleValue),
            type: "custom",
          };
          if (this.isEdit) {
            objData.type = this.dataType;
            objData.customFieldId = this.idData;
            unDataApi(objData).then((res) => {
              if (res.code == 200) {
                this.$message({
                  message: res.msg,
                  type: "success",
                });
                this.isEdit = false;
                this.ruleForm = {
                  fieldNameCn: "",
                  fieldType: "",
                  length: "",
                };
                this.RangeList.forEach((item) => {
                  item.range = false;
                  item.must = false;
                  item.initial = false;
                  item.defaultValue = "";
                });
                this.newValList = [];
                this.systemData = "";
                this.valueSource = false;
                this.ReTeLin = false;
                this.linkDownShow = false;
                this.STGList = [];
                this.PRDList = [];
                this.numData = false;
                this.dateShow = false;
                this.downMenu = false;
                this.numType = false;
                this.oneInputs = false;
                this.subLoad = false;
                this.linkDownList = [];
                this.possibleValue = {};
                if (this.getqueryCustomList) {
                  this.getqueryCustomList();
                }
              } else {
                this.$message({
                  message: res.msg,
                  type: "error",
                });
              }
            });
          } else {
            add(objData).then((res, err) => {
              if (res.code == 200) {
                this.$message({
                  message: res.msg,
                  type: "success",
                });
                this.ruleForm = {
                  fieldNameCn: "",
                  fieldType: "",
                  length: "",
                };
                this.RangeList.forEach((item) => {
                  item.range = false;
                  item.must = false;
                  item.initial = false;
                  item.defaultValue = "";
                });
                this.newValList = [];
                this.systemData = "";
                this.valueSource = false;
                this.ReTeLin = false;
                this.linkDownShow = false;
                this.STGList = [];
                this.PRDList = [];
                this.numData = false;
                this.dateShow = false;
                this.downMenu = false;
                this.numType = false;
                this.oneInputs = false;
                this.subLoad = false;
                this.linkDownList = [];
                this.possibleValue = {};
                if (this.getqueryCustomList) {
                  this.getqueryCustomList();
                }
              } else {
                this.$message({
                  message: res.msg,
                  type: "error",
                });
              }
            });
          }
        } else {
          const rangeCopy = [...this.RangeList];
          this.rangeCheck = true;
          rangeCopy.forEach((item) => {
            if (item.range) {
              this.rangeCheck = false;
            }
          });
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.rangeCheck = false;
      this.RangeList.forEach((item) => {
        item.range = false;
        item.must = false;
        item.initial = false;
        item.defaultValue = "";
      });
      this.newValList = [];
      this.systemData = "";
      this.valueSource = false;
      this.ReTeLin = false;
      this.linkDownShow = false;
      this.STGList = [];
      this.PRDList = [];
      this.numData = false;
      this.dateShow = false;
      this.downMenu = false;
      this.numType = false;
      this.isEdit = false;
    },
    // 新增链接下拉框
    STGAddFn(val) {
      this.linkDownList.forEach((item, index) => {
        if (val == item.order) {
          if (item.orderInd.length == 0) return false;
          item.orderList.push(item.orderInd);
          item.orderInd = "";
        }
      });
    },
    // 下拉链接方法
    linkDownChange(val) {
      this.linkDownList = [];
      this.systemList.forEach((item) => {
        if (item.customFieldId == val) {
          this.linkDownpossible = JSON.parse(item.possibleValue);
        }
      });
      for (const key in this.linkDownpossible) {
        this.linkDownList.push({
          order: this.linkDownpossible[key],
          orderInd: "",
          orderList: [],
          orderDelect: false,
        });
      }
      if (val == "" || val == null || val == undefined) {
        this.linkDownList = [];
      }
    },
  },
  watch: {
    rowData(newval, oldval) {
      if (newval) {
        this.isEdit = true;
        // this.RangeSFn()
        this.dataType = newval.type;
        this.idData = newval.customFieldId;
        this.RangeList.forEach((item) => {
          item.range = false;
          item.must = false;
          item.initial = false;
          item.defaultValue = "";
        });
        console.log(newval, "newvall");
        this.ReTeLinData = newval.attributes.fieldTypeCn;
        if (newval.attributes.fieldTypeCn == "日期") {
          this.ReTeLin = false; // 长度显隐
          this.dateShow = true; // 日期
          this.valueSource = false; // 值来源
          this.downMenu = false; // 用户列表
          this.numType = false; // 值类型
          this.linkDownShow = false; // 链接下拉框
          this.oneInputs = false; // 单复选框
        } else if (
          newval.attributes.fieldTypeCn == "文本" ||
          newval.attributes.fieldTypeCn == "链接" ||
          newval.attributes.fieldTypeCn == "备注"
        ) {
          this.ReTeLin = true; // 长度显隐
          this.dateShow = false; // 日期
          this.valueSource = false; // 值来源
          this.downMenu = false; // 用户列表
          this.numType = false; // 值类型
          this.linkDownShow = false; // 链接下拉框
          this.oneInputs = false; // 单复选框
        } else if (
          newval.attributes.fieldTypeCn == "单选框" ||
          newval.attributes.fieldTypeCn == "复选框"
        ) {
          this.ReTeLin = false; // 长度显隐
          this.dateShow = false; // 日期
          this.valueSource = false; // 值来源
          this.downMenu = false; // 用户列表
          this.numType = false; // 值类型
          this.linkDownShow = false; // 链接下拉框
          this.oneInputs = true; // 单复选框
        } else if (
          newval.attributes.fieldTypeCn == "下拉框" ||
          newval.attributes.fieldTypeCn == "多选项"
        ) {
          console.log("xiala duoxuan");
          this.ReTeLin = false; // 长度显隐
          this.dateShow = false; // 日期
          this.valueSource = true; // 值来源
          this.downMenu = false; // 用户列表
          this.numType = true; // 值类型
          this.linkDownShow = false; // 链接下拉框
          this.oneInputs = false; // 单复选框
          this.numData = false;
          let arr = [];
          let obj = JSON.parse(newval.possibleValue);
          for (const key in obj) {
            arr.push(obj[key]);
          }
          // systemList
          this.newValList = arr;
        } else if (newval.attributes.fieldTypeCn == "数值") {
          this.ReTeLin = false; // 长度显隐
          this.dateShow = false; // 日期
          this.valueSource = true; // 值来源
          this.downMenu = false; // 用户列表
          this.numType = false; // 值类型
          this.linkDownShow = false; // 链接下拉框
          this.oneInputs = false; // 单复选框
          this.numData = true;
          let arr = [];
          let obj = JSON.parse(newval.possibleValue);
          // this.systemData = obj.others.parentListId;
          for (const key in obj) {
            arr.push(obj[key]);
          }
          // systemList
          this.newValList = arr;
        } else if (newval.attributes.fieldTypeCn == "用户列表") {
          this.ReTeLin = false; // 长度显隐
          this.dateShow = false; // 日期
          this.valueSource = false; // 值来源
          this.downMenu = true; // 用户列表
          this.numType = false; // 值类型
          this.linkDownShow = false; // 链接下拉框
          this.oneInputs = false; // 单复选框
        } else if (newval.attributes.fieldTypeCn == "链接下拉框") {
          this.ReTeLin = false; // 长度显隐
          this.dateShow = false; // 日期
          this.valueSource = false; // 值来源
          this.downMenu = false; // 用户列表
          this.numType = false; // 值类型
          this.linkDownShow = true; // 链接下拉框
          this.oneInputs = false; // 单复选框
          this.linkDownList = [];
          let obj = JSON.parse(newval.possibleValue);
          this.systemData = obj.others.parentListId;
          delete obj.others;
          for (const key in obj) {
            this.linkDownList.push({
              order: key,
              orderDelect: false,
              orderInd: "",
              orderList: obj[key],
            });
          }
        }
        this.ruleForm.fieldNameCn = newval.attributes.fieldNameCn;
        this.ruleForm.fieldType = newval.attributes.fieldTypeCn;
        this.ruleForm.length = newval.attributes.length;

        newval.componentAttributes.forEach((item) => {
          this.RangeList.forEach((subItem) => {
            if (item.scopeNameCn == subItem.nameCn) {
              if (item.mandatory) {
                subItem.must = true;
              }
              if (item.scopeNameCn) {
                subItem.range = true;
              }
              if (item.defaultValue) {
                subItem.initial = true; // 初始值按钮回显
                subItem.defaultValue = item.defaultValue;
              } else if (
                newval.attributes.fieldTypeCn == "单选框" ||
                newval.attributes.fieldTypeCn == "复选框"
              ) {
                subItem.initial = false; // 初始值按钮回显
                subItem.defaultValue = item.defaultValue;
              }

              if(this.ReTeLinData == "单选框" || this.ReTeLinData == "复选框"){
                subItem.initial = item.defaultValue === '1'?true:false;
              }
            }
          });
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.formBox {
  display: flex;
  margin-top: 20px;
  .rangeNeed::before {
    content: "*";
    color: #f56c6c;
    margin-right: 4px;
  }
  .attributes {
    margin: 0 20px 0 20px;
    .attributesItem {
      display: flex;
      flex-direction: row;
      ::v-deep .el-input {
        width: 100px;
      }
      ::v-deep .el-input__inner {
        width: 100px;
      }
    }
    .systemList {
      padding-left: 28px;
      ::v-deep .el-select {
        width: 100px;
      }
    }
  }
  .newValue {
    display: flex;
    flex-direction: row;
    width: 180px;
    height: 330px;
    margin-left: 50px;
    overflow: auto;
    p {
      width: 100px;
      height: 46px;
      background-color: #fff;
      margin: 0;
      padding: 0;
      text-align: center;
      line-height: 46px;
      border-bottom: 1px rgb(236, 234, 234) solid;
      cursor: pointer;
    }
  }
  .linkDown {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    // width: 600px;
    // height: 330px;
    margin-left: 30px;

    .STGData {
      display: flex;
      flex-direction: row;
      width: 48%;
      border: 1px #ccc solid;
      .info {
        display: flex;
        flex-direction: column;
        width: 100%;
        .header {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          height: 40px;
          line-height: 7px;
          padding: 5px;
        }
        .infodata {
          height: 100%;
          padding: 0 5px 0 20px;
          overflow: auto;
          ::v-deep .el-input {
            height: 40px;
          }
          p {
            margin: 2px 0;
            padding: 0 0 0 10px;
            height: 40px;
            width: 100%;
            border: 1px #ccc solid;
            font-size: 16px;
            line-height: 40px;
          }
        }
      }
    }
  }
  .componentAttributes {
    width: 400px;
	margin-left: 50px;
    .RangeTitle {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      font-size: 16px;
    }
    .formItem {
      ::v-deep .el-input__suffix {
        left: 5px;
      }
      ::v-deep .el-input__inner {
        padding-left: 28px;
      }
    }
    ::v-deep .el-form-item {
      margin: 0;
      .Range {
        width: 120px;
      }
    }
    ::v-deep .el-input {
      width: 18px;
    }
    ::v-deep .el-input__inner {
      width: 140px;
    }
    ::v-deep .el-select {
      width: 120px;
    }

    // ::v-deep .el-input__inner {
    //   width: 120px;
    // }
    // el-select
  }
}
</style>
