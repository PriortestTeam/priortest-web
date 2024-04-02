<template>
  <div>
    <div class="mb-2">
      <el-button type="primary" @click="createRow">添加</el-button>
      <el-button type="primary" @click="addTestCaseStep" :disabled="!isModified">保存</el-button>
      <el-button type="danger" @click="clearAll" :disabled="testCaseStepTableData.length === 0">清空</el-button>
    </div>
    <el-table ref="table" :data="testCaseStepTableData" style="width: 100%">
      <el-table-column fixed="left" label="操作" width="80">
        <template v-slot="scope">
          <el-button type="text" size="small" @click.native.prevent="deleteRow(scope.$index, testCaseStepTableData)">
            删除
          </el-button>
        </template>
      </el-table-column>
      <el-table-column v-for="field in sysCustomFields" :key="field.id" :prop="field.fieldNameEn"
        :label="field.fieldNameCn" width="200">
        <template v-slot="scope">          
          <el-input v-if="field.fieldType === 'text'" v-model="scope.row[field.fieldNameEn]" type="text" @input="handleInput(scope.row)" />
      
          <el-input v-if="field.fieldType === 'memo'" v-model="scope.row[field.fieldNameEn]" type="textarea" :rows="2"
            :placeholder="`请输入${field.fieldNameCn}`"  @input="handleInput(scope.row)"/>
          <el-radio-group v-if="field.fieldType === 'radio'" v-model="scope.row[field.defaultValue]" @input="handleInput(scope.row)">
            <el-radio label="1">是</el-radio>
            <el-radio label="0">否</el-radio>
          </el-radio-group>
          <el-checkbox-group v-if="field.fieldType === 'checkbox'" v-model="scope.row[field.fieldNameEn]"  @input="handleInput(scope.row)">
            <el-checkbox label="1">是</el-checkbox>
            <el-checkbox label="0">否</el-checkbox>
          </el-checkbox-group>
          <el-select v-if="['number', 'dropDown', 'multiList', 'userList'].includes(field.fieldType)"
            v-model="scope.row[field.fieldNameEn]" :multiple="['multiList'].includes(field.fieldType)"
            :placeholder="`请选择${field.fieldNameCn}`"  @input="handleInput(scope.row)">
            <el-option v-for="item in handleOptions(field.possibleValue)" :key="item.value" :label="item.label"
              :value="item.value" />
            <el-option label="添加新值" value="999" @click.native="handleAddPossibleValue(field)" />
          </el-select>
          <el-link v-if="field.fieldType === 'link'" :href="field.defaultValue" target="_blank">
            {{ field.defaultValue }}
          </el-link>
          <el-input v-if="field.fieldType === 'link'" v-model="scope.row[field.fieldNameEn]" type="text" />
          <el-date-picker v-if="field.fieldType === 'Date'" v-model="scope.row[field.fieldNameEn]" type="date"
            placeholder="选择日期"  @input="handleInput(scope.row)"/>
        </template>
      </el-table-column>
      <el-table-column label="自定义字段" prop="customField" width="auto" min-width="200">
        <template v-slot="scope">
          <el-form v-model="scope.row.customFieldDatas" ref="formData">
            <el-row :gutter="20">
              <el-col v-for="field in scope.row.customFieldDatas" :key="field.customFieldId" :span="12">
                <el-form-item size="small" :label="field.fieldNameCn" label-width="80px" prop="radio"
                  :rules="field.mandatory ? [{ required: true, message: ' ', trigger: 'change' }] : []"
                  v-if="hasParentFiled(field)"
                  >
                  <el-input v-if="field.fieldType === 'text'" v-model="field.valueData" type="text"
                    :length="field.length"  @input="handleInput(scope.row)"/>
                  <el-input v-if="field.fieldType === 'memo'" v-model="field.valueData" type="textarea" :rows="2"
                    placeholder="请输入内容" :length="field.length"  @input="handleInput(scope.row)"/>

                  <el-radio-group v-if="field.fieldType === 'radio'" v-model="field.defaultValue"  @input="handleInput(scope.row)">
                    <el-radio label="1">是</el-radio>
                    <el-radio label="0">否</el-radio>
                  </el-radio-group>

                  <el-checkbox v-if="field.fieldType === 'checkbox'" :checked="field.valueData === 'checked'"
                    @change="field.valueData = field.valueData === 'checked' ? 'un-checked' : 'checked'" />

                  <el-select v-if="['number', 'dropDown', 'multiList', 'userList','linkedDropDown'].includes(field.fieldType)"
                    v-model="field.valueData" :multiple="['multiList'].includes(field.fieldType)"
                    :placeholder="`请选择${field.fieldNameCn}`">
                    <el-option v-for="item in handleOptions(field.possibleValue, field.fieldType === 'linkedDropDown',scope.row)" :key="item.value" :label="item.label"
                      :value="item.value" />
                    <el-option label="添加新值" value="999" @click.native="handleAddPossibleValue(field)" />
                  </el-select>
                  <!-- <el-link v-if="field.fieldType === 'link'" :href="field.defaultValue" target="_blank">
                    {{ field.defaultValue }}
                  </el-link> -->
                  <el-input v-if="['link', 'linkedModue'].includes(field.fieldType)" v-model="field.valueData" type="text" />
                  <el-date-picker v-if="field.fieldType === 'Date'" v-model="field.valueData" type="date"
                    placeholder="选择日期" />
                </el-form-item>
                <div  v-else class="tips"><i class="el-icon-info"></i>{{ field.fieldNameCn }}没显示是因为没有父级关联字段</div>
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
import { addTestCaseStepApi, queryTestCaseStepApi,delTestCaseStepApi,editTestCaseStepApi } from '@/api/testcaseStep'
import { formData, message } from '@/utils/common'
import { getAllCustomField } from '@/api/getFields'
import addPossibleValue from '@/views/testcase/components/addPossibleValue.vue'
import { Empty } from 'element-ui'

export default {
  components: { addPossibleValue },
  props: ['caseId'],
  data() {
    return {
      isModified: false ,// Flag to track modifications
      // 选择框
      checkedDetail: [],
      // 自定义字段
      sysCustomFields: [],
      customFields: [],
      currentField: {},
      addPossibleValueVisible: false,
      // 表格数据
      testCaseStepTableData: [],
      radio: [{ required: true, message: '请选择', trigger: 'change' }]
    }
  },
  computed: {
    projectInfo() {
      return this.$store.state.user.userinfo
    },

  },
  created() {
    // 初始化自定义字段
    this.getData()
  },
  methods: {
    // 删除步骤
    
    deleteRow(index,rows) {       
    const idToDelete = rows[index]?.id;     
    if (!idToDelete) {
      rows.splice(index, 1); 
    }
    else{
    delTestCaseStepApi(idToDelete).then(res => {
        if (res.code === '200') {
          message('success', res.msg)
          rows.splice(index, 1);         
        }
      })
    }
    },

    // 删除清空所有步骤
    clearAll() {
      const idsToDelete = this.testCaseStepTableData.map(row => row.id).filter(id => id.trim() !== '');      
      if (idsToDelete.length > 0){     
      delTestCaseStepApi(idsToDelete).then(res => {
        if (res.code === '200') {
          message('success', res.msg)        
         this.testCaseStepTableData = []
        }
      })
    }
    else{
      this.testCaseStepTableData = []
    }
    this.isModified =false;
    },

    // 创建行 
    createRow() {
      this.isModified = true; 
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
          const arr = ['number', 'dropDown', 'link', 'multiList', 'Date', 'radio', 'linkedDropDown', 'linkedModue','userList', 'memo', 'text', 'checkbox']
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
           
            this.$set(obj, 'customFieldDatas', cc)
          })
          // 自定义字段赋值
          this.testCaseStepTableData.forEach(obj => {
            const teststepExpand = JSON.parse(obj.teststepExpand)
            obj.customFieldDatas.forEach(o => {
              teststepExpand.forEach(tt => {
                if (o.customFieldId === tt.customFieldId) {
                  o.valueData = tt.valueData
                  o.defaultValue = tt.defaultValue
                }
              })
            })
          })
        }
      })
    },
    handleOptions(obj, flag, data) {
      const that = this;
      try {
        obj = JSON.parse(obj)
        if (flag) {
          const list = []
          const parent = [...that.sysCustomFields, ...data.customFieldDatas].find(item => item.customFieldId === obj.others.parentListId);
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
    // 如果找不到父级 就不显示 并提示用户
    hasParentFiled (filed) {
      if (filed.fieldType === 'linkedDropDown') {
        const possibleValue = JSON.parse(filed.possibleValue);
        const index = [...this.sysCustomFields, ...this.customFields].findIndex(item => item.customFieldId === possibleValue.others.parentListId);
        return index > -1;
      }
      return true;
    },
    // 添加下拉框值
    handleAddPossibleValue(field) {
      this.currentField = { ...field }
      this.addPossibleValueVisible = true
    },


    // 保存步骤
    addTestCaseStep() {
      // 步骤重新排序
      this.$refs.formData.validate((valid) => {
        
      })
      let num = 1
      this.testCaseStepTableData.forEach(obj => {
        obj.testStepId = num
        num++
      })
      const caseStepList = {
        testCaseId: this.caseId,
        steps: this.testCaseStepTableData
      }
     
      addTestCaseStepApi(caseStepList).then((res) => {
        if (res.code === '200') {
          message('success', '保存成功')
          // 刷新表格数据
          this.refresh()
        }
      })
      this.isModified = false;
    },
    // 刷新表格数据
    refresh() {
      this.getData()
      this.$refs.table.reload()
    },

    // 修改任何一个字段时，要求点击保存
    handleInput(row){
      this.isModified = true;
      row.isRowModified = true;
    }
  }

 
}
</script>
<style lang="scss" scoped>
@import '../index.scss';
::v-deep .el-table .el-table__cell{
  vertical-align: top;
}
.tips{
  font-size: 14px;
  color: #909399;
   .el-icon-info {
    margin-right: 10px;
}
}
</style>
