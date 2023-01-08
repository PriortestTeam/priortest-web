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
      <div class="formBox">
        <div class="attributes">
          <el-form-item label="字段名称：" prop="fieldNameCn">
            <el-input v-model="ruleForm.fieldNameCn"></el-input>
          </el-form-item>
          <el-form-item label="类型：" prop="fieldType">
            <el-select
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
                :value="item.customFieldLinkId"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item v-if="valueSource" label="值来源：">
            <el-radio v-model="radioData" label="1">新值</el-radio> <br />
            <el-radio v-model="radioData" label="2">系统列表</el-radio> <br />
            <div class="attributesItem">
              值：<el-input
                v-model="newVal"
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
                  :value="item.customFieldLinkId"
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
          <div class="STGData">
            <!--  -->
            <div class="info">
              <div class="header">
                <p>{{ linkDownpossible.order_1 }}</p>
                <div>
                  <el-button type="primary" @click="STGAddFn()"
                    >添加</el-button
                  >
                  <el-button
                    type="danger"
                    :disabled="!stgDelect"
                    @click="
                      () => {
                        STGList.splice(deleceSTG, 1);
                        stgDelect = false;
                      }
                    "
                    >删除</el-button
                  >
                </div>
              </div>
              <div class="infodata">
                <el-input v-model="STGData" placeholder="link" />
                <p
                  v-for="(item, index) in STGList"
                  :key="index"
                  @click="
                    () => {
                      stgDelect = true;
                      deleceSTG = index;
                    }
                  "
                >
                  {{ item }}
                </p>
              </div>
            </div>
          </div>
          <div class="PRDData">
            <!--  -->
            <div class="info">
              <div class="header">
                <p>{{ linkDownpossible.order_2 }}</p>
                <div>
                  <el-button type="primary" @click="PRDAddFn()"
                    >添加</el-button
                  >
                  <el-button
                    type="danger"
                    :disabled="!prdDelect"
                    @click="
                      () => {
                        PRDList.splice(delecePRD, 1);
                        prdDelect = false;
                      }
                    "
                    >删除</el-button
                  >
                </div>
              </div>
              <div class="infodata">
                <el-input v-model="PRDData" placeholder="text" />
                <p
                  v-for="(item, index) in PRDList"
                  :key="index"
                  @click="
                    () => {
                      prdDelect = true;
                      delecePRD = index;
                    }
                  "
                >
                  {{ item }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div class="componentAttributes">
          <div class="RangeTitle">
            <span style="width: 88px">范围</span>
            <span style="width: 65px">是否必填</span>
            <span style="width: 173px" v-if="!linkDownShow">初始值</span>
            <span style="width: 173px" v-else> </span>
          </div>
          <el-form-item
            class="formItem"
            v-for="(item, index) in RangeList"
            :key="index"
          >
            <el-checkbox class="Range" v-model="item.range">{{
              item.nameCn
            }}</el-checkbox>
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
              v-model="item.defaultValue"
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
          <el-form-item style="float: right">
            <el-button type="primary" @click="submitForm('ruleForm')"
              >保存</el-button
            >
            <el-button @click="resetForm('ruleForm')">放弃</el-button>
          </el-form-item>
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
        length: 0,
      },
      rules: {
        fieldNameCn: [
          { required: true, message: "请输入字段名称", trigger: "blur" },
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
      linkDownpossible: {
        order_1:'无',
        order_2:'无',
      },
    };
  },
  mounted() {
    this.RangeSFn();
    // 类型接口
    fieldTypeAPI().then((res) => {
      this.fieldTypeOptions = res.data;
    });

    setTimeout(() => {
      let arr = [];
      // 系统列表接口
      systemListAPI({ projectId: this.projectId }).then((res) => {
        res.data.forEach((item) => {
          // arr.push(item.fieldNameCn)
          // this.systemList = arr
          // item.possibleValue = JSON.parse(item.possibleValue);
          // console.log(item.possibleValue, "possibleValue");
          // if (item.possibleValue.order_1) {
          //   for (var key in item.possibleValue) {
          //     arr.push(item.possibleValue[key]);
          //   }
          //   this.systemList = arr;
          // }
        });
        // console.log(res, "系统列表");
        this.systemList = res.data;
      });
      // 下拉菜单接口
      downMenuAPI(this.projectId).then((res) => {
        console.log(res, "下拉菜单");
        this.menuList = res.data;
      });
    }, 1000);
    getInfo().then((res) => {
      this.projectId = res.data.userUseOpenProject.projectId;
    });
  },
  methods: {
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

      this.ReTeLinData = val;
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
        if (this.ruleForm.length > 50) {
          this.ruleForm.length = 50;
          this.$message({
            message: "最大值不能超过50",
            type: "warning",
          });
        }
      } else if (this.ReTeLinData == "备注") {
        if (this.ruleForm.length > 1000) {
          this.ruleForm.length = 1000;
          this.$message({
            message: "最大值不能超过1000",
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
      this.newValList = [];
      this.systemList.forEach((item) => {
        if (item.customFieldLinkId == val) {
          item.possibleValue = JSON.parse(item.possibleValue);
          if (item.possibleValue.order_1) {
            for (var key in item.possibleValue) {
              arr.push(item.possibleValue[key]);
            }
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
            this.newValList = arr;
          }
        }
      });
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let obj = {};
          this.fieldTypeOptions.forEach((item) => {
            if (item.nameCn == this.ruleForm.fieldType) {
              obj.fieldTypeCn = item.nameCn;
              obj.fieldType = item.scopeName;
            }
          });
          obj.fieldNameCn = this.ruleForm.fieldNameCn;
          obj.length = this.ruleForm.length;
          obj.projectId = this.projectId;
          //----------------------------------
          let list = [];
          this.RangeList.forEach((item) => {
            if (item.range == true) {
              list.push({
                defaultValue: item.defaultValue == "" ? "" : "ckecked",
                mandatory: item.must,
                scope: item.scopeName,
                scopeNameCn: item.nameCn,
                scopeId: item.id,
              });
            }
          });
          //----------------------------------
          // 新值
          if (this.valueSource) {
            this.newValList.forEach((item, index) => {
              this.possibleValue["order_" + Number(index + 1)] = item;
            });
          } else {
            // 系统列表
            this.possibleValue = null;
          }
          if (this.linkDownShow) {
            this.possibleValue = {
              STG: this.STGList,
              PRD: this.PRDList,
              others: {
                parentListId: this.systemData,
              },
            };
          }
          let objData = {
            attributes: obj,
            componentAttributes: list,
            customFieldId: 0,
            possibleValue: JSON.stringify(this.possibleValue),
            type: "custom",
          };
          if (this.isEdit) {
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
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
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
    STGAddFn() {
      if (this.STGData.length == 0) return false;
      this.STGList.push(this.STGData);
      this.STGData = "";
    },
    PRDAddFn() {
      if (this.PRDData.length == 0) return false;
      this.PRDList.push(this.PRDData);
      this.PRDData = "";
    },
    linkDownChange(val) {
      this.linkDownpossible = {};
      this.systemList.forEach((item) => {
        if (item.customFieldLinkId == val) {
          this.linkDownpossible = JSON.parse(item.possibleValue);
        }
      });
    },
  },
  watch: {
    rowData(newval, oldval) {
      if (newval) {
        this.isEdit = true;
        console.log(this.isEdit, "我是修改");
        // this.RangeSFn()
        this.idData = newval.customFieldId;
        this.RangeList.forEach((item) => {
          item.range = false;
          item.must = false;
          item.initial = false;
          item.defaultValue = "";
        });
        console.log(newval, "newvall");
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
          this.oneInputs = false; // 单复选框
        } else if (
          newval.attributes.fieldTypeCn == "下拉框" ||
          newval.attributes.fieldTypeCn == "多选项"
        ) {
          this.ReTeLin = false; // 长度显隐
          this.dateShow = false; // 日期
          this.valueSource = true; // 值来源
          this.downMenu = false; // 用户列表
          this.numType = true; // 值类型
          this.linkDownShow = false; // 链接下拉框
          this.oneInputs = true; // 单复选框
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
          let obj = JSON.parse(newval.possibleValue);
          this.STGList = obj.STG;
          this.PRDList = obj.PRD;
          this.systemData = obj.others.parentListId;
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
              }
            }
          });
        });

        // this.RangeList.forEach((item, index) => {
        //   if (newval.componentAttributes[index]) {
        //     if (newval.componentAttributes[index].mandatory) {
        //       item.must = true;
        //     }
        //     if (newval.componentAttributes[index].scopeNameCn) {
        //       item.range = true;
        //     }
        //     if (newval.componentAttributes[index].defaultValue) {
        //       item.initial = true; // 初始值按钮回显
        //       item.defaultValue =
        //         newval.componentAttributes[index].defaultValue;
        //     }
        //   }
        // });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.formBox {
  display: flex;
  margin-top: 20px;
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
    margin: 0px 100px 0 100px;
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
    width: 600px;
    height: 330px;
    margin-left: 30px;

    .STGData,
    .PRDData {
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
      // p {
      //   width: 20%;
      //   border: 1px red solid;
      // }
    }
  }
  .componentAttributes {
    width: 500px;
    .RangeTitle {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      font-size: 16px;
      margin-left: 100px;
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