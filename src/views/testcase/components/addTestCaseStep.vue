<template>
  <div>
    <div class="mb-2">
      <el-button type="primary" @click="createRow">添加</el-button>
      <el-button type="primary" @click="addTestCaseStep">保存</el-button>
      <el-button type="danger" @click="clear">清空</el-button>
    </div>
    <el-table
      :data="testCaseStepTableData"
      border
      style="width: 100%"
    >
      <el-table-column fixed="left" label="操作" width="100">
        <template v-slot="scope">
          <el-button
            type="text"
            size="small"
            @click.native.prevent="deleteRow(scope.$index, testCaseStepTableData)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
      <el-table-column
        v-for="field in sysCustomFields"
        :key="field.id"
        :prop="field.fieldNameEn"
        :label="field.fieldNameCn"
        width="200"
      >
        <template v-slot="scope">
          <el-input
            v-if="field.fieldType === 'text'"
            v-model="scope.row[field.fieldNameEn]"
            type="text"
          />
          <el-input
            v-if="field.fieldType === 'memo'"
            v-model="scope.row[field.fieldNameEn]"
            type="textarea"
            :rows="2"
            :placeholder="`请输入${field.fieldNameCn}`"
          />
          <el-radio-group v-if="field.fieldType === 'radio'" v-model="scope.row[field.fieldNameEn]">
            <el-radio label="1">是</el-radio>
            <el-radio label="0">否</el-radio>
          </el-radio-group>
          <el-checkbox-group
            v-if="field.fieldType === 'checkbox'"
            v-model="scope.row[field.fieldNameEn]"
          >
            <el-checkbox label="1">是</el-checkbox>
            <el-checkbox label="0">否</el-checkbox>
          </el-checkbox-group>
          <el-select
            v-if="['number', 'dropDown', 'multiList', 'userList'].includes(field.fieldType)"
            v-model="scope.row[field.fieldNameEn]"
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
          <el-link v-if="field.fieldType === 'link'" :href="field.defaultValue" target="_blank">
            {{ field.defaultValue }}
          </el-link>
          <el-input v-if="field.fieldType === 'link'" v-model="scope.row[field.fieldNameEn]" type="text" />
          <el-date-picker
            v-if="field.fieldType === 'Date'"
            v-model="scope.row[field.fieldNameEn]"
            type="date"
            placeholder="选择日期"
          />
        </template>
      </el-table-column>
      <el-table-column label="自定义字段" prop="customField">
        <template v-slot="scope">
          <el-form>
            <el-row :gutter="20">
              <el-col
                v-for="field in scope.row.customFieldDatas"
                :key="field.customFieldId"
                span="8"
              >
                <el-form-item
                  size="small"
                  :label="field.fieldNameCn"
                  label-width="80px"
                  :prop="'custom' + field.fieldNameEn"
                >
                  <el-input
                    v-if="field.fieldType === 'text'"
                    v-model="field.valueData"
                    type="text"
                    :length="field.length"
                  />
                  <el-input
                    v-if="field.fieldType === 'memo'"
                    v-model="field.valueData"
                    type="textarea"
                    :rows="2"
                    placeholder="请输入内容"
                    :length="field.length"
                  />
                  <el-radio-group v-if="field.fieldType === 'radio'" v-model="field.valueData">
                    <el-radio label="1">是</el-radio>
                    <el-radio label="0">否</el-radio>
                  </el-radio-group>
                  <el-checkbox
                    v-if="field.fieldType === 'checkbox'"
                    :checked="field.valueData === 'checked'"
                    @change="field.valueData = field.valueData === 'checked' ? 'un-checked' : 'checked'"
                  />
                  <el-select
                    v-if="['number', 'dropDown', 'multiList', 'userList'].includes(field.fieldType)"
                    v-model="field.valueData"
                    :multiple="['multiList'].includes(field.fieldType)"
                    :placeholder="`请选择${field.fieldNameCn}`"
                    :value="field.id"
                  >
                    <el-option
                      v-for="item in handleOptions(field.possibleValue)"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                    <el-option label="添加新值" value="999" @click.native="handleAddPossibleValue(field)" />
                    <el-link v-if="field.fieldType === 'link'" :href="field.defaultValue" target="_blank">
                      {{ field.defaultValue }}
                    </el-link>
                    <el-input v-if="field.fieldType === 'link'" v-model="field.valueData" type="text" />
                    <el-date-picker
                      v-if="field.fieldType === 'Date'"
                      v-model="field.valueData"
                      type="date"
                      placeholder="选择日期"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <addPossibleValue :field="currentField" :visible.sync="addPossibleValueVisible" @refresh="getData" />
          </el-form>
        </template>
      </el-table-column>
    </el-table>
  </div>

</template>

<script>
import { addTestCaseStepApi, queryTestCaseStepApi } from '@/api/testcaseStep'
import { message } from '@/utils/common'
import { getAllCustomField } from '@/api/getFields'
import addPossibleValue from '@/views/testcase/components/addPossibleValue.vue'

export default {
  components: { addPossibleValue },
  props: ['caseId'],
  data() {
    return {
      // 选择框
      checkedDetail: [],
      // 自定义字段
      sysCustomFields: [],
      customFields: [],
      currentField: {},
      addPossibleValueVisible: false,
      // 表格数据
      testCaseStepTableData: []
    }
  },
  computed: {
    projectInfo() {
      return this.$store.state.user.userinfo
    }
  },
  created() {
    // 初始化自定义字段
    this.getData()
  },
  methods: {
    deleteRow(index, rows) {
      rows.splice(index, 1)
    },
    clear() {
      this.testCaseStepTableData = []
    },
    createRow() {
      // 创建行
      var obj = {
        id: '',
        testCaseId: this.caseId,
        testStep: '',
        teststepCondition: '',
        testData: '',
        expectedResult: '',
        remarks: '',
        testStepId: 1,
        teststepExpand: {},
        customFieldDatas: []
      }
      obj.customFieldDatas = this.customFields.map(item => {
        return {
          ...item
        }
      })
      this.testCaseStepTableData.push(obj)
    },
    getData() {
      getAllCustomField({
        projectId: this.projectInfo.userUseOpenProject.projectId,
        scopeId: '4000001'
      }).then((res) => {
        if (res.code === '200') {
          const arr = ['number', 'dropDown', 'link', 'multiList', 'Date', 'rad', 'linkedDropDown', 'userList', 'memo', 'text', 'checkbox']
          this.sysCustomFields = res.data.filter(item => item.type === 'sField').map((item, index) => {
            return {
              label: 'sField' + item.fieldNameEn,
              ...item,
              valueData: ['multiList'].includes(item.fieldType) ? item.defaultValue || [] : item.defaultValue
            }
          })
          this.customFields = res.data.filter(item => item.type === 'custom')
            .sort((a, b) => arr.indexOf(a.fieldType) - arr.indexOf(b.fieldType))
            .map((item, index) => {
              return {
                label: 'custom' + item.fieldNameEn,
                ...item,
                valueData: ['multiList'].includes(item.fieldType) ? item.defaultValue || [] : item.defaultValue
              }
            })
          // 初始化表格数据
          this.queryTestCaseStep()
        }
      })
    },
    // 获取步骤列表
    queryTestCaseStep() {
      queryTestCaseStepApi(this.caseId).then((res) => {
        if (res !== null) {
          this.testCaseStepTableData = res.data
          // 转换自定义字段
          this.testCaseStepTableData.forEach(obj => {
            const cc = this.customFields.map(item => {
              return {
                ...item
              }
            })
            // obj.customFieldDatas = cc
            this.$set(obj, 'customFieldDatas', cc)
          })
          // 自定义字段赋值
          this.testCaseStepTableData.forEach(obj => {
            const teststepExpand = JSON.parse(obj.teststepExpand)
            obj.customFieldDatas.forEach(o => {
              teststepExpand.forEach(tt => {
                if (o.customFieldId === tt.customFieldId) {
                  o.valueData = tt.valueData
                }
              })
            })
          })
        }
      })
    },
    handleOptions(obj, flag) {
      try {
        if (flag) {
          obj = JSON.parse(obj)
          const list = []
          Object.keys(obj).forEach(key => {
            if (obj[key] instanceof Array) {
              obj[key].forEach((value) => {
                list.push({ value, label: value + '(' + key + ')' })
              })
            }
          })
          return list
        } else {
          return Object.values(JSON.parse(obj)).map(item => {
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
    // 添加下拉框值
    handleAddPossibleValue(field) {
      this.currentField = { ...field }
      this.addPossibleValueVisible = true
    },
    // 保存步骤
    addTestCaseStep() {
      const caseStepList = {
        testCaseId: this.caseId,
        steps: this.testCaseStepTableData
      }
      addTestCaseStepApi(caseStepList).then((res) => {
        if (res.code === '200') {
          message('success', '保存成功')
        }
      })
    }
  }
}
</script>
