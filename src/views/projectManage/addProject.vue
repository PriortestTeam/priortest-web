<template>
  <div v-loading="loading" class="app-container add-form add-project">
    <el-card>
      <el-tabs v-model="activeName" type="card" :before-leave="handBeforeLeave">
        <el-tab-pane label="新建" name="first">
          <el-form
            ref="projectForm"
            :model="projectForm"
            :rules="projectRules"
            label-width="120px"
            class="demo-ruleForm"
          >
            <div>
              <el-button
                v-if="!projectForm.id && isEdit"
                type="primary"
                @click="submitForm('projectForm', false)"
              >保存&新建
              </el-button>
              <el-button
                v-if="!projectForm.id && isEdit"
                type="primary"
                @click="submitForm('projectForm', true)"
              >保存&返回
              </el-button>
              <el-button
                v-if="!projectForm.id && isEdit"
                type="primary"
                @click="submitForm('projectForm', false)"
              >保存
              </el-button>
              <el-button v-if="projectForm.id && isEdit" type="primary" @click="submitForm('projectForm')">确认修改
              </el-button>
              <el-button type="primary" @click="giveupBack('projectForm')">放弃返回</el-button>
              <router-link v-if="!projectForm.id" to="/admincenter/admincenter">
                <el-button type="text">
                  {{ $t('lang.PublicBtn.CreateCustomField') }}
                </el-button>
              </router-link>
            </div>
            <div class="form-box">
              <el-row>
                <el-col
                  v-for="field in sysCustomFields"
                  :key="field.i1d"
                  :xs="24"
                  :sm="24"
                  :md="field.fieldNameEn === 'title' ? 24 : 12"
                  :lg="field.fieldNameEn === 'title' ? 24 : 12"
                  :xl="field.fieldNameEn === 'title' ? 24 : 8"
                >
                  <el-form-item
                    size="small"
                    :label="field.fieldNameCn"
                    label-width="150px"
                    :prop="'sField' + field.customFieldId"
                  >
                    <el-input
                      v-if="field.fieldType === 'text'"
                      v-model="field.valueData"
                      :disabled="!isEdit"
                      type="text"
                    />
                    <el-input
                      v-if="field.fieldType === 'memo'"
                      v-model="field.valueData"
                      :disabled="!isEdit"
                      type="textarea"
                      :rows="2"
                      :placeholder="`请输入${field.fieldNameCn}`"
                    />
                    <el-radio-group v-if="field.fieldType === 'radio'" v-model="field.valueData" :disabled="!isEdit">
                      <el-radio :label="1">是</el-radio>
                      <el-radio :label="0">否</el-radio>
                    </el-radio-group>
                    <el-checkbox
                      v-if="field.fieldType === 'checkbox'"
                      :disabled="!isEdit"
                      :value="field.valueData === 1"
                      @change="field.valueData = (field.valueData === 1) ? 0 : 1"
                    />
                    <!-- <el-checkbox-group
                      v-if="field.fieldType === 'checkbox'"
                      v-model="field.valueData"
                      :disabled="!isEdit"
                    >
                      <el-checkbox label="1">是</el-checkbox>
                      <el-checkbox label="0">否</el-checkbox>
                    </el-checkbox-group> -->
                    <el-select
                      v-if="['number', 'dropDown', 'multiList', 'userList'].includes(field.fieldType)"
                      v-model="field.valueData"
                      :disabled="!isEdit"
                      :multiple="['multiList'].includes(field.fieldType)"
                      :placeholder="`请选择${field.fieldNameCn}`"
                    >
                      <el-option
                        v-for="item in handleOptions(field.possibleValue)"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                      <el-option label="添加新值" value="999" @click.native="handleAddPossibleValue(field)" />
                    </el-select>
                    <el-link v-if="field.fieldType === 'link' && !isEdit" :href="field.defaultValue" target="_blank">
                      {{ field.defaultValue }}
                    </el-link>
                    <el-input v-if="field.fieldType === 'link' && isEdit" v-model="field.valueData" type="text" />
                    <el-date-picker
                      v-if="field.fieldType === 'Date'"
                      v-model="field.valueData"
                      :disabled="!isEdit"
                      value-format ="yyyy-MM-dd HH:mm:ss"
                      type="date"
                      placeholder="选择日期"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-divider />
                </el-col>
                <el-col
                  v-for="(field, index) in customFields"
                  :key="field.id"
                  :xs="24"
                  :sm="24"
                  :md="12"
                  :lg="12"
                  :xl="8"
                >
                  <el-form-item
                    size="small"
                    :label="field.fieldNameCn"
                    label-width="150px"
                    :prop="'custom' + field.customFieldId"
                    v-if="hasParentFiled(field)"
                  >
                    <el-input
                      v-if="field.fieldType === 'text'"
                      v-model="field.valueData"
                      :disabled="!isEdit"
                      type="text"
                      :length="field.length"
                    />
                    <el-input
                      v-if="field.fieldType === 'memo'"
                      v-model="field.valueData"
                      :disabled="!isEdit"
                      type="textarea"
                      :rows="2"
                      placeholder="请输入内容"
                      :length="field.length"
                    />
                    <el-radio-group v-if="field.fieldType === 'radio'" v-model="field.valueData" :disabled="!isEdit">
                      <el-radio :label="1">是</el-radio>
                      <el-radio :label="0">否</el-radio>
                    </el-radio-group>
                    <el-checkbox
                      v-if="field.fieldType === 'checkbox'"
                      :disabled="!isEdit"
                      :value="field.valueData === 1"
                      @change="field.valueData = (field.valueData === 1) ? 0 : 1"
                    />
                    <el-select
                      v-if="['number', 'dropDown', 'multiList', 'userList', 'linkedDropDown'].includes(field.fieldType)"
                      v-model="field.valueData"
                      :disabled="!isEdit"
                      :multiple="['multiList'].includes(field.fieldType)"
                      :placeholder="`请选择${field.fieldNameCn}`"
                    >
                      <el-option
                        v-for="item in handleOptions(field.possibleValue, field.fieldType === 'linkedDropDown')"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                      <!-- <router-link :to="`/admincenter/admincenter?par=${field.fieldNameEn}`"> -->
                      <el-option label="添加新值" value="0" @click.native="handleAddPossibleValue(field)" />
                      <!-- </router-link> -->
                    </el-select>
                    <el-link v-if="field.fieldType === 'link' && !isEdit" :href="field.defaultValue" target="_blank">
                      {{ field.defaultValue }}
                    </el-link>
                    <el-input v-if="field.fieldType === 'link' && isEdit" v-model="field.valueData" type="text" />
                    <el-date-picker
                      v-if="field.fieldType === 'Date'"
                      v-model="field.valueData"
                      :disabled="!isEdit"
                      type="date"
                      placeholder="选择日期"
                    />
                  </el-form-item>
                </el-col>
                <!-- <el-col v-for="field in customFields" :key="field.id" :xs="8" :sm="6" :md="6" :lg="6" :xl="6">
                <el-form-item v-if="field.fieldType === 'text'" :label="field.fieldName" size="small" :prop="field.fieldName">
                  <el-input v-model="field.valueData" type="text" />
                </el-form-item>
                <el-form-item v-if="field.fieldType === 'memo'" :label="field.fieldName" size="small" :prop="field.fieldName">
                  <el-input v-model="field.valueData" type="textarea" :rows="2" placeholder="请输入内容" />
                </el-form-item>
                <el-form-item v-if="field.fieldType === 'radio'" :label="field.fieldName" size="small"
                  :prop="field.fieldName">
                  <el-select v-model="field.valueData" :placeholder="`请选择${field.fieldName}`">
                    <el-option v-for="(item, index) in field.defaultValues" :key="index" :label="field.mergeValues[index]"
                      :value="field.mergeValues[index]" />
                    <router-link :to="`/admincenter/admincenter?par=${field.fieldName}`">
                      <el-option
                        label="添加新值"
                        value
                      />
                    </router-link>
                  </el-select>
                </el-form-item>
                <el-form-item v-if="field.fieldType === 'DropDown'" :label="field.fieldName" size="small" filterable
                  :prop="field.fieldName">
                  <el-select v-model="field.valueData" :placeholder="`请选择${field.fieldName}`">
                    <el-option v-for="(item, index) in field.defaultValues" :key="index" :label="field.mergeValues[index]"
                      :value="field.mergeValues[index]" />
                    <router-link v-if="field.fieldName !== 'schedule_run_frequency'"
                      :to="`/admincenter/admincenter?par=${field.fieldName}`">
                      <el-option label="添加新值" value />
                    </router-link>
                  </el-select>
                </el-form-item> -->
              </el-row>
            </div>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="步骤" name="second">
          <!-- <add-test-case-step v-if="!verification(id)" :case-id="id" /> -->
        </el-tab-pane>
        <el-tab-pane label="运行记录" name="third">运行记录</el-tab-pane>
      </el-tabs>
    </el-card>
    <addPossibleValue :field="currentField" :visible.sync="addPossibleValueVisible" @refresh="getData" />
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { getAllCustomField } from '@/api/getFields'
import addPossibleValue from './components/addPossibleValue.vue'

import { featureListAll } from '@/api/feature'
import {
  projectSave,
  projectUpdate,
  projectInfo
} from '@/api/projectManage'

import { message, returntomenu, formatChangedPara, verification } from '@/utils/common'
import { fieldTypeAPI } from '@/api/customFFields'

export default {
  name: 'Addproject',
  data() {
    return {
      //openDia: false,
      sysCustomFields: [],  //sField即上半部分
      customFields: [],     //custom即下半部分
      oldSysCustomFields: [],
      oldCustomFields: [],
      id: '',
      isEdit: false,
      loading: false,
      currentField: {},
      addPossibleValueVisible: false,
      activeName: 'first',
    }
  },
  components: {
    addPossibleValue
  },
  computed: {
    projectForm() {
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
    projectRules() {
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
      },
      deep: true
    },
    customFields: {
      handler(newVal) {
        this.oldCustomFields = newVal
      },
      deep: true
    }
  },
  created() {
    this.id = this.$route.query.id
    this.isEdit = !!this.$route.query.isEdit
    // 获取自定义字段
    this.getData()
  },
  methods: {
    verification,
    getData() {
      const that = this;
      getAllCustomField({
        projectId: this.projectInfo.userUseOpenProject.projectId,
        scopeId: '1000001'
      }).then((res) => {
        if (res.code === '200') {
          const arr = ['number', 'dropDown', 'link', 'multiList', 'Date', 'rad', 'linkedDropDown', 'userList', 'memo', 'text', 'checkbox']
          const data = res.data;
          this.sysCustomFields = data.filter(item => item.type === 'sField').map((item, index) => {
            let valueData = item.defaultValue;
            if(['multiList'].includes(item.fieldType)){
              valueData = item.defaultValue || [];
            }else if(['checkbox', 'radio'].includes(item.fieldType)){
              if(item.defaultValue === 1 || item.defaultValue === '1'){
                valueData = 1;
              }else{
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
              if(['multiList'].includes(item.fieldType)){
                valueData = item.defaultValue || [];
              }else if(['checkbox', 'radio'].includes(item.fieldType)){
                if(item.defaultValue === 1 || item.defaultValue === '1'){
                  valueData = 1;
                }else{
                  valueData = 0;
                }
              }
              return {
                label: 'custom' + item.customFieldId,
                ...item,
                valueData: valueData
              }
            })
          if (this.id) {
            projectInfo({ id: this.id }).then((res) => {
              const projectExpand = JSON.parse(res.data.projectExpand)
			  const fields = [...this.sysCustomFields, ...this.customFields]
			  console.log(this.customFields)
              fields.forEach((item, index) => {
                if(item.fieldNameEn && res.data[item.fieldNameEn]){
                  item.valueData = res.data[item.fieldNameEn];
                }

                if (Object.keys(projectExpand).length && projectExpand.attributes.find(o => o.customFieldLinkId === item.customFieldLinkId)) {
                  item.valueData = projectExpand.attributes.find(o => o.customFieldLinkId === item.customFieldLinkId).valueData;
				  consoole.log(item.valueData)
                }
              })
            })
          }
          this.handleDefaultForm();
        }
      })
    },
    handleDefaultForm() {
      this.sysCustomFields.forEach(el => {
        this.oldSysCustomFields.forEach(old => {
          if (el.customFieldLinkId == old.customFieldLinkId) {
            el.valueData = old.valueData
          }
        })
      })
      this.customFields.forEach(el => {
        this.oldCustomFields.forEach(old => {
          if (el.customFieldLinkId == old.customFieldLinkId) {
            el.valueData = old.valueData
          }
        })
      })
    },
    handleOptions(obj, flag) {
      const that = this;
      try {
        obj = JSON.parse(obj)
        if (flag) {
          const list = []
          const parent = [...that.sysCustomFields, ...that.customFields].find(item => item.customFieldId === obj.others.parentListId);

          Object.keys(obj).forEach(key => {
            if (key === parent.valueData && obj[key] instanceof Array) {
              obj[key].forEach((value) => {
                list.push({ value, label: value + '(' + key + ')' })
              })
            }
          })
          return list
        } else {
          return Object.values(obj).map(item => {
            return {
              label: item,
              value: item
            }
          })
        }
      } catch (error) {
        return []
      }
    },
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
      } else if (['linkedDropDown'].includes(fieldType)) {
        Object.keys(obj).forEach(key => {
          // if (obj[key] instanceof Array){
          //   list.push(...obj[key])
          // }
          if (obj[key] instanceof Array) {
            obj[key].forEach((value) => {
              list.push({ value, type: key })
            })
          }
        })
        return list
      } else {
        return []
      }
    },
    handlegetAllCustomField() {
      // 获取自定义字段
      getAllCustomField({
        projectId: this.projectInfo.userUseOpenProject.projectId,
        scopeId: '1000001'
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
      this.$refs['projectForm'].resetFields()
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
          //console.log(params);
          if (this.id) {
            projectUpdate({ id: this.id, ...params })
              .then((res) => {
                if (res.code === '200') {
                  message('success', res.msg)
                  if (type) {
                    returntomenu(this, 1000)
                  }
                }
                this.loading = false
              })
              .catch((error) => {
                this.loading = false
                console.log(error)
              })
          } else {
            projectSave(params)
              .then((res) => {
                if (res.code === '200') {
                  message('success', res.msg)
                  this.resetFields()
                  if (type) {
                    returntomenu(this, 1000)
                  }
                  this.id = res.data.id
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
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 放弃并且返回
    giveupBack() {
      if (!this.projectForm.id) {
        this.resetFields()
      }
      this.returntomenu(this)
    },
    // 新建步骤
    resetStepFrom() {
      this.stepFrom = {
        projectId: undefined,
        step: undefined,
        stepData: undefined,
        expectedResult: undefined
      }
      this.$refs['stepFrom'].resetFields()
    },
    // 处理 tab 切换逻辑
    handBeforeLeave(activeName, oldActiveName) {
      if (activeName === 'second' && !this.id) {
        message(200, '请先保存测试用例再添加测试用例')
        return false
      }
      if (activeName === 'third') {
        message(200, '正在开发中')
        return false
      }
    },
    hasParentFiled(filed){
      if(filed.fieldType === 'linkedDropDown'){
        const possibleValue = JSON.parse(filed.possibleValue);
        const index = [...this.sysCustomFields, ...this.customFields].findIndex(item => item.customFieldId === possibleValue.others.parentListId);
        return index > -1;
      }
      return true;
    }
  }
}
</script>
<style lang="scss" scoped>
@import 'index.scss';

.el-select {
  width: 100%;
}

.el-date-editor {
  width: 100%;
}
</style>
