<template>
  <div v-loading="loading" class="app-container add-form add-project">

    <el-card>
      <el-tabs v-model="activeName" type="card" :before-leave="handBeforeLeave">

        <el-form ref="issueForm" :model="issueForm" :rules="issueRules" label-width="120px" class="demo-ruleForm">
          <div>
            <el-button v-if="!issueForm.id && isEdit" type="primary" @click="submitForm('issueForm', false)">保存
            </el-button>
            <router-link v-if="!issueForm.id" to="/admincenter/admincenter">
              <el-button type="text">
                {{ $t('lang.PublicBtn.CreateCustomField') }}
              </el-button>
            </router-link>
          </div>
          <div class="form-box">
            <el-row>
              <el-col v-for="field in sysCustomFields" :key="field.i1d" :xs="24" :sm="24"
                :md="field.fieldNameEn === 'title' ? 24 : 12" :lg="field.fieldNameEn === 'title' ? 24 : 12"
                :xl="field.fieldNameEn === 'title' ? 24 : 8">
                <el-form-item size="small" :label="field.fieldNameCn" label-width="80px"
                  :prop="'sField' + field.fieldNameEn">
                  <el-input v-if="field.fieldType === 'text'" v-model="field.valueData" :disabled="!isEdit" type="text" />
                  <el-input v-if="field.fieldType === 'memo'" v-model="field.valueData" :disabled="!isEdit"
                    type="textarea" :rows="2" :placeholder="`请输入${field.fieldNameCn}`" />
                  <el-radio-group v-if="field.fieldType === 'radio'" v-model="field.valueData" :disabled="!isEdit">
                    <el-radio label="1">是</el-radio>
                    <el-radio label="0">否</el-radio>
                  </el-radio-group>
                  <el-checkbox v-if="field.fieldType === 'checkbox'" :disabled="!isEdit" :value="field.valueData === 1"
                    @change="field.valueData = (field.valueData === 1) ? 0 : 1" />
                  <el-select v-if="['number', 'dropDown', 'multiList', 'userList'].includes(field.fieldType)"
                    v-model="field.valueData" :disabled="!isEdit" :multiple="['multiList'].includes(field.fieldType)"
                    :placeholder="`请选择${field.fieldNameCn}`">
                    <el-option v-for="item in handleOptions(field.possibleValue)" :key="item.value" :label="item.label"
                      :value="item.value" />
                    <el-option label="添加新值" value="999" @click.native="handleAddPossibleValue(field)" />
                  </el-select>
                  <el-link v-if="field.fieldType === 'link' && !isEdit" :href="field.defaultValue" target="_blank">
                    {{ field.defaultValue }}
                  </el-link>
                  <el-input v-if="field.fieldType === 'link' && isEdit" v-model="field.valueData" type="text" />
                  <el-date-picker v-if="field.fieldType === 'Date'" value-format="yyyy-MM-dd HH:mm:ss"
                    v-model="field.valueData" :disabled="!isEdit" type="date" placeholder="选择日期" />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-divider />
              </el-col>
              <el-col v-for="(field, index) in customFields" :key="field.id" :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
                <el-form-item size="small" :label="field.fieldNameCn" label-width="80px"
                  :prop="'custom' + field.fieldNameEn">
                  <el-input v-if="field.fieldType === 'text'" v-model="field.valueData" :disabled="!isEdit" type="text"
                    :length="field.length" />
                  <el-input v-if="field.fieldType === 'memo'" v-model="field.valueData" :disabled="!isEdit"
                    type="textarea" :rows="2" placeholder="请输入内容" :length="field.length" />
                  <el-radio-group v-if="field.fieldType === 'radio'" v-model="field.valueData" :disabled="!isEdit">
                    <el-radio label="1">是</el-radio>
                    <el-radio label="0">否</el-radio>
                  </el-radio-group>
                  <el-checkbox v-if="field.fieldType === 'checkbox'" :disabled="!isEdit" :value="field.valueData === 1"
                    @change="field.valueData = (field.valueData === 1) ? 0 : 1" />
                  <el-select
                    v-if="['number', 'dropDown', 'multiList', 'userList', 'linkedDropDown'].includes(field.fieldType)"
                    v-model="field.valueData" :disabled="!isEdit" :multiple="['multiList'].includes(field.fieldType)"
                    :placeholder="`请选择${field.fieldNameCn}`">
                    <el-option v-for="item in handleOptions(field.possibleValue, field.fieldType === 'linkedDropDown')"
                      :key="item.value" :label="item.label" :value="item.value" />

                    <el-option label="添加新值" value="0" @click.native="handleAddPossibleValue(field)" />

                  </el-select>
                  <el-link v-if="field.fieldType === 'link' && !isEdit" :href="field.defaultValue" target="_blank">
                    {{ field.defaultValue }}
                  </el-link>
                  <el-input v-if="field.fieldType === 'link' && isEdit" v-model="field.valueData" type="text" />
                  <el-date-picker v-if="field.fieldType === 'Date'" v-model="field.valueData" :disabled="!isEdit"
                    type="date" placeholder="选择日期" />
                </el-form-item>
              </el-col>

            </el-row>
          </div>
        </el-form>

      </el-tabs>
    </el-card>
    <addPossibleValue :field="currentField" :visible.sync="addPossibleValueVisible" @refresh="getData" />
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { getAllCustomField } from '@/api/getFields'
import addPossibleValue from '@/views/issue/components/addPossibleValue.vue'
import { featureListAll } from '@/api/feature'
import {
  issueSave,
  issueUpdate,
  issueInfo
} from '@/api/issue.js'

import { message, returntomenu, formatChangedPara } from '@/utils/common'
import { fieldTypeAPI } from '@/api/customFFields'
export default {
  name: 'AddIssue',
  components: {
    addPossibleValue
  },
  data() {
    return {
      openDia: false,
      sysCustomFields: {
        "code": "200",
        "msg": "调用成功。",
        "total": "",
        "httpCode": 200,
        "data": [
          {
            "customFieldLinkId": "639313901715984388",
            "customFieldId": "625245517005197314",
            "defaultValue": "",
            "scope": "issue",
            "mandatory": 1,
            "scopeId": "7000001",
            "scopeNameCn": "缺陷",
            "projectId": "1000",
            "type": "sField",
            "fieldNameCn": "标题",
            "fieldNameEn": "title",
            "modifyUser": "",
            "length": 50,
            "possibleValue": "{}",
            "fieldType": "text",
            "fieldTypeCn": "文本"
          },
          {
            "customFieldLinkId": "671572250930974724",
            "customFieldId": "624822357260767234",
            "defaultValue": "",
            "scope": "issue",
            "mandatory": 0,
            "scopeId": "7000001",
            "scopeNameCn": "缺陷",
            "projectId": "1000",
            "type": "sField",
            "fieldNameCn": "描述",
            "fieldNameEn": "description",
            "modifyUser": "",
            "length": 1000,
            "possibleValue": "null",
            "fieldType": "memo",
            "fieldTypeCn": "备注"
          },
          {
            "customFieldLinkId": "639320156689928193",
            "customFieldId": "625243669103906818",
            "defaultValue": "",
            "scope": "issue",
            "mandatory": 1,
            "scopeId": "7000001",
            "scopeNameCn": "缺陷",
            "projectId": "1000",
            "type": "sField",
            "fieldNameCn": "分类",
            "fieldNameEn": "caseCategory",
            "modifyUser": "",
            "length": 0,
            "possibleValue": "{\"order_1\": \"功能\", \"order_2\": \"性能\", \"order_3\": \"安全\", \"order_4\": \"接口\", \"order_5\": \"界面\"}",
            "fieldType": "dropDown",
            "fieldTypeCn": "下拉框"
          },
          {
            "customFieldLinkId": "651142482838425601",
            "customFieldId": "625244927982309376",
            "defaultValue": "",
            "scope": "issue",
            "mandatory": 0,
            "scopeId": "7000001",
            "scopeNameCn": "缺陷",
            "projectId": "1000",
            "type": "sField",
            "fieldNameCn": "优先级",
            "fieldNameEn": "priority",
            "modifyUser": "",
            "length": 0,
            "possibleValue": "{\"order_1\": \"高\", \"order_2\": \"中\", \"order_3\": \"低\", \"order_4\": \"新值\"}",
            "fieldType": "dropDown",
            "fieldTypeCn": "下拉框"
          },
          {
            "customFieldLinkId": "639327763567742980",
            "customFieldId": "626620528597143554",
            "defaultValue": "",
            "scope": "issue",
            "mandatory": 0,
            "scopeId": "7000001",
            "scopeNameCn": "缺陷",
            "projectId": "1000",
            "type": "sField",
            "fieldNameCn": "负责人",
            "fieldNameEn": "reportTo",
            "modifyUser": "",
            "length": 0,
            "possibleValue": "{\"order_1\": \"新加负责人\"}",
            "fieldType": "userList",
            "fieldTypeCn": "用户列表"
          },
          {
            "customFieldLinkId": "662508836455714816",
            "customFieldId": "625244720985018370",
            "defaultValue": "新建",
            "scope": "issue",
            "mandatory": 0,
            "scopeId": "7000001",
            "scopeNameCn": "缺陷",
            "projectId": "1000",
            "type": "sField",
            "fieldNameCn": "缺陷状态",
            "fieldNameEn": "issueStatus",
            "modifyUser": "",
            "length": 0,
            "possibleValue": "{\"order_1\": \"修改中\", \"order_2\": \"关闭\", \"order_3\": \"新建\", \"order_4\": \"已分配\", \"order_5\": \"拒绝\", \"order_6\": \"验证成功\", \"order_7\": \"验证失败\", \"order_8\": \"无效\", \"order_9\": \"验证中\"}",
            "fieldType": "dropDown",
            "fieldTypeCn": "下拉框"
          },
          {
            "customFieldLinkId": "639314531654307840",
            "customFieldId": "625243319382839298",
            "defaultValue": "",
            "scope": "issue",
            "mandatory": 0,
            "scopeId": "7000001",
            "scopeNameCn": "缺陷",
            "projectId": "1000",
            "type": "sField",
            "fieldNameCn": "严重级别",
            "fieldNameEn": "severity",
            "modifyUser": "",
            "length": 0,
            "possibleValue": "{\"order_1\": \"严重\", \"order_2\": \"宕机\", \"order_3\": \"一般\", \"order_4\": \"微小\"}",
            "fieldType": "dropDown",
            "fieldTypeCn": "下拉框"
          },
          {
            "customFieldLinkId": "662508259684388864",
            "customFieldId": "662508259667611650",
            "defaultValue": "",
            "scope": "issue",
            "mandatory": 0,
            "scopeId": "7000001",
            "scopeNameCn": "缺陷",
            "projectId": "1000",
            "type": "sField",
            "fieldNameCn": "发现版本",
            "fieldNameEn": "issueVersion",
            "modifyUser": "",
            "length": 0,
            "possibleValue": "{\"order_1\": \"1.0.0.0\", \"order_2\": \"2.0.0.0\", \"order_3\": \"1.2.0.0\"}",
            "fieldType": "dropDown",
            "fieldTypeCn": "下拉框"
          },
          {
            "customFieldLinkId": "662508568213196800",
            "customFieldId": "662508568108339202",
            "defaultValue": "",
            "scope": "issue",
            "mandatory": 0,
            "scopeId": "7000001",
            "scopeNameCn": "缺陷",
            "projectId": "1000",
            "type": "sField",
            "fieldNameCn": "修改版本",
            "fieldNameEn": "fixVersion",
            "modifyUser": "",
            "length": 0,
            "possibleValue": "{\"order_1\": \"1.0.0.0\", \"order_2\": \"2.0.0.0\", \"order_3\": \"1.2.0.0\"}",
            "fieldType": "dropDown",
            "fieldTypeCn": "下拉框"
          },
          {
            "customFieldLinkId": "662551651994832896",
            "customFieldId": "662551651978055682",
            "defaultValue": "",
            "scope": "issue",
            "mandatory": 0,
            "scopeId": "7000001",
            "scopeNameCn": "缺陷",
            "projectId": "1000",
            "type": "sField",
            "fieldNameCn": "计划修改日期",
            "fieldNameEn": "planFixDate",
            "modifyUser": "",
            "length": 0,
            "possibleValue": "null",
            "fieldType": "Date",
            "fieldTypeCn": "日期"
          },
          {
            "customFieldLinkId": "667570281975386114",
            "customFieldId": "625243030701477888",
            "defaultValue": "",
            "scope": "issue",
            "mandatory": 0,
            "scopeId": "7000001",
            "scopeNameCn": "缺陷",
            "projectId": "1000",
            "type": "sField",
            "fieldNameCn": "模块",
            "fieldNameEn": "module",
            "modifyUser": "",
            "length": 0,
            "possibleValue": "{\"order_1\": \"JLJLKOO\", \"order_2\": \"LJLKJKLJ\", \"order_3\": \"新建用户模块\"}",
            "fieldType": "dropDown",
            "fieldTypeCn": "下拉框"
          },
          {
            "customFieldLinkId": "662547391039148034",
            "customFieldId": "625242171997425664",
            "defaultValue": "测试环境",
            "scope": "issue",
            "mandatory": 0,
            "scopeId": "7000001",
            "scopeNameCn": "缺陷",
            "projectId": "1000",
            "type": "sField",
            "fieldNameCn": "环境",
            "fieldNameEn": "env",
            "modifyUser": "",
            "length": 0,
            "possibleValue": "{\"order_1\": \"测试环境\", \"order_2\": \"用户验收测试\", \"order_3\": \"开发环境\", \"order_4\": \"在线环境\", \"order_5\": \"测试A\"}",
            "fieldType": "dropDown",
            "fieldTypeCn": "下拉框"
          },
          {
            "customFieldLinkId": "639320067124760577",
            "customFieldId": "625244182792900610",
            "defaultValue": "台式计算机",
            "scope": "issue",
            "mandatory": 0,
            "scopeId": "7000001",
            "scopeNameCn": "缺陷",
            "projectId": "1000",
            "type": "sField",
            "fieldNameCn": "测试设备",
            "fieldNameEn": "testDevice",
            "modifyUser": "",
            "length": 0,
            "possibleValue": "{\"order_1\": \"手机\", \"order_2\": \"台式计算机\", \"order_3\": \"ipad\", \"order_4\": \"手提电脑\"}",
            "fieldType": "dropDown",
            "fieldTypeCn": "下拉框"
          },
          {
            "customFieldLinkId": "662531652156657666",
            "customFieldId": "626622434040090626",
            "defaultValue": "",
            "scope": "issue",
            "mandatory": 0,
            "scopeId": "7000001",
            "scopeNameCn": "缺陷",
            "projectId": "1000",
            "type": "sField",
            "fieldNameCn": "浏览器",
            "fieldNameEn": "browser",
            "modifyUser": "",
            "length": 0,
            "possibleValue": "{\"order_1\": \"Chrome\", \"order_2\": \"FireFox\", \"order_3\": \"Sarfri\", \"order_4\": \"IE\"}",
            "fieldType": "dropDown",
            "fieldTypeCn": "下拉框"
          },
          {
            "customFieldLinkId": "669767155604000769",
            "customFieldId": "651167149926125570",
            "defaultValue": "MAC12.0",
            "scope": "issue",
            "mandatory": 0,
            "scopeId": "7000001",
            "scopeNameCn": "缺陷",
            "projectId": "1000",
            "type": "sField",
            "fieldNameCn": "平台",
            "fieldNameEn": "platform",
            "modifyUser": "",
            "length": 0,
            "possibleValue": "{\"order_1\": \"Window11\", \"order_2\": \"Linux8.5Red\", \"order_3\": \"MAC12.0\"}",
            "fieldType": "dropDown",
            "fieldTypeCn": "下拉框"
          },
          {
            "customFieldLinkId": "662546274704166912",
            "customFieldId": "662546274691584002",
            "defaultValue": "请输入验证结果",
            "scope": "issue",
            "mandatory": 0,
            "scopeId": "7000001",
            "scopeNameCn": "缺陷",
            "projectId": "1000",
            "type": "sField",
            "fieldNameCn": "验证结果",
            "fieldNameEn": "verifiedResult",
            "modifyUser": "",
            "length": 100,
            "possibleValue": "null",
            "fieldType": "memo",
            "fieldTypeCn": "备注"
          },
          {
            "customFieldLinkId": "671572413049212933",
            "customFieldId": "626620233368473602",
            "defaultValue": "",
            "scope": "issue",
            "mandatory": 0,
            "scopeId": "7000001",
            "scopeNameCn": "缺陷",
            "projectId": "1000",
            "type": "sField",
            "fieldNameCn": "备注",
            "fieldNameEn": "remarks",
            "modifyUser": "",
            "length": 1000,
            "possibleValue": "null",
            "fieldType": "memo",
            "fieldTypeCn": "备注"
          }
        ]
      },
      customFields: [],
      // oldSysCustomFields:[],
      // oldCustomFields:[],
      id: '',
      isEdit: true
      ,
      loading: false,
      currentField: {},
      addPossibleValueVisible: false,
      activeName: 'first'
    }
  },
  computed: {
    issueForm() {
      try {
        return [...this.sysCustomFields, ...this.customFields].reduce((a, b) => {
          return {
            ...a,
            [b.label]: b.valueData
          }
        }, {})
      } catch (error) {
        return []
      }
    },
    issueRules() {
      try {
        return [...this.sysCustomFields, ...this.customFields].reduce((a, b) => {
          if (b.mandatory) {
            return {
              ...a,
              [b.label]: [{ required: true, message: '不能为空', trigger: 'blur' }]
            }
          } else {
            return a
          }
        }, {})
      } catch (error) {
        return []
      }
    },
    ...mapGetters({
      lang: (state) => state.header.lang
    }),
    projectInfo() {
      return this.$store.state.user.userinfo
    }
  },
  watch: {
    sysCustomFields: {
      handler(newVal) {
        this.oldSysCustomFields = newVal
      }
      , deep: true
    },
    customFields: {
      handler(newVal) {
        this.oldCustomFields = newVal
      }
      , deep: true
    }
  },
  created() {
    this.id = this.$route.query.id
    // 获取自定义字段
    this.getData()
  },
  methods: {
    getData() {
      getAllCustomField({
        projectId: this.projectInfo.userUseOpenProject.projectId,
        scopeId: '7000001'
      }).then((res) => {
        if (res.code === '200') {
          const arr = ['number', 'dropDown', 'link', 'multiList', 'Date', 'rad', 'linkedDropDown', 'userList', 'memo', 'text', 'checkbox']
          const data = res.data;
          this.sysCustomFields = data.filter(item => item.type === 'sField').map((item, index) => {
            let valueData = item.defaultValue;
            if (['multiList'].includes(item.fieldType)) {
              valueData = item.defaultValue || [];
            }
            else if (['checkbox', 'radio'].includes(item.fieldType)) {
              if (item.defaultValue === 1 || item.defaultValue === '1') {
                valueData = 1;
              } else {
                valueData = 0;
              }
            }
            return {
              label: 'sField' + item.customFieldId,
              ...item,
              valueData: valueData
            }
          })
          this.customFields = data.filter(item => item.type === 'custom')
            .sort((a, b) => arr.indexOf(a.fieldType) - arr.indexOf(b.fieldType))
            .map((item, index) => {
              let valueData = item.defaultValue;
              if (['multiList'].includes(item.fieldType)) {
                valueData = item.defaultValue || [];
              }
              else if (['checkbox', 'radio'].includes(item.fieldType)) {
                if (item.defaultValue === 1 || item.defaultValue === '1') {
                  valueData = 1;
                } else {
                  valueData = 0;
                }
              }
              return {
                label: 'custom' + item.customFieldId,
                ...item,
                valueData: valueData
              }
            })
          // if (this.id) {
          //   issueInfo({ id: this.id }).then((res) => {
          //     const issueExpand = JSON.parse(res.data.issueExpand)
          //     const fields = [...this.sysCustomFields, ...this.customFields]
          //     fields.forEach((item, index) => {
          //       item.valueData = res.data[item.fieldNameEn]
          //       if (Object.keys(issueExpand).length && issueExpand.attributes.find(o => o.customFieldLinkId === item.customFieldLinkId)) {
          //         item.valueData = issueExpand.attributes.find(o => o.customFieldLinkId === item.customFieldLinkId).valueData
          //       }
          //     })
          //   })
          // }
          // this.handleDefaultForm();
        }
      })
    },
    // handleDefaultForm() {
    //   this.sysCustomFields.forEach(el => {
    //     console.log(this.oldSysCustomFields)
    //     this.oldSysCustomFields.forEach(old => {
    //       if (el.customFieldLinkId == old.customFieldLinkId) {
    //         el.valueData = old.valueData
    //       }
    //     })
    //   })
    //   this.customFields.forEach(el => {
    //     this.oldCustomFields.forEach(old => {
    //       if (el.customFieldLinkId == old.customFieldLinkId) {
    //         el.valueData = old.valueData
    //       }
    //     })
    //   })
    // },




    handleOptions(obj, flag) {
      try {
        if (flag) {
          obj = JSON.parse(obj)
          return obj[[...this.sysCustomFields, ...this.customFields].find(item => item.customFieldId === obj.others.parentListId).valueData].map(item => {
            return {
              label: item,
              value: item,
            }
          })
        } else {
          return Object.values(JSON.parse(obj)).map(item => {
            return {
              label: item,
              value: item,
            }
          })
        }
      } catch (error) {
        return []
      }
    },

    // 此处对链接字段 - 显示 parent label
    //handleOptions(obj, flag) {
    //try {
    //if (flag) {
    //obj = JSON.parse(obj)
    //const list = []
    //Object.keys(obj).forEach(key => {
    //if (obj[key] instanceof Array) {
    //obj[key].forEach((value) => {
    //list.push({ value, label: value + '(' + key + ')' })
    //})
    //}
    //})
    //return list
    //} else {
    //return Object.values(JSON.parse(obj)).map(item => {
    //return {
    //label: item,
    //value: item
    //}
    //})
    //}
    //} catch (error) {
    //  return []
    //  }
    //  },


    handleDropDownList(field) {
      const { possibleValue, fieldType } = field
      if (!possibleValue) return []
      const obj = JSON.parse(possibleValue)
      const list = []
      if (['dropDown', 'number'].includes(fieldType)) {
        Object.keys(obj).forEach(key => {
          list.push(obj[key])
        })
        return list
      }
      else if (['linkedDropDown'].includes(fieldType)) {
        Object.keys(obj).forEach(key => {
          if (obj[key] instanceof Array) {
            list.push(...obj[key])
          }
          if (obj[key] instanceof Array) {
            obj[key].forEach((value) => {
              list.push({ value, type: key })
            })
          }
        })
        return list
      }
      else {
        return []
      }
    },

    handlegetAllCustomField() {
      // 获取自定义字段
      getAllCustomField({
        projectId: this.projectInfo.userUseOpenProject.projectId,
        scopeId: '7000001'
      }).then((res) => {
        if (res.code === '200') {
          this.customFields = res.data
        }
      })
    },
    // 添加下拉框值
    handleAddPossibleValue(field) {
      this.currentField = { ...field }
      this.addPossibleValueVisible = true
    },
    // 重置表单
    resetFields() {
      this.id = ''
      this.isEdit = true
      this.$refs['issueForm'].resetFields()
    },
    // 提交
    submitForm(formName, type) {

      this.$refs[formName].validate((valid) => {
        if (valid) {
          const params = this.sysCustomFields.reduce((a, b) => {
            return {
              ...a, [b.fieldNameEn]: b.valueData
            }
          }, {})
          this.loading = true
          params.projectId = this.projectInfo.userUseOpenProject.projectId
          console.log(formName, type, params);
          const attributes = this.customFields.map(item => {
            return {
              'fieldType': item.fieldType,
              'fieldNameEn': item.fieldNameEn,
              'customFieldId': item.customFieldId,
              'customFieldLinkId': item.customFieldLinkId,
              'fieldName': item.fieldName,
              'fieldNameCn': item.fieldNameCn,
              'scopeNameCn': item.scopeNameCn,
              'scope': item.scope,
              'scopeId': item.scopeId,
              'valueData': item.valueData
            }
          })
          params.customFieldDatas = {
            attributes: attributes.length ? attributes : undefined
          }
          {
            issueSave(params)
              .then((res) => {
                if (res.code === '200') {
                  message('success', res.msg)
                  this.resetFields()
                  if (type) {
                    returntomenu(this, 1000)
                  }
                } else {
                  message('error', res.msg)
                }
                this.loading = false
              })
              .catch((error) => {
                this.loading = false
                console.log(error)
              })
          }
        }
      })
    },
    // 放弃并且返回

  }
}
</script>
<style lang="scss" scoped>
@import '../index.scss';

.el-select {
  width: 100%;
}

.el-date-editor {
  width: 100%;
}
</style>
