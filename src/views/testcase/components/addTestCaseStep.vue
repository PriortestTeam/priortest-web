<template>
  <div>
    <div class="mb-2">
      <el-button type="primary" @click="createRow">添加</el-button>
      <el-button type="primary" @click="addTestCaseStep">保存</el-button>
      <el-button type="danger" @click="clear">清空</el-button>
    </div>
    <!--    <div>{{ testCaseStepTableData }}}</div>-->
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
      <!--      <el-table-column prop="testStep" label="步骤" width="200">-->
      <!--        <template v-slot="scope">-->
      <!--          <el-input v-model="scope.row.testStep" />-->
      <!--        </template>-->
      <!--      </el-table-column>-->
      <!--      <el-table-column prop="teststepCondition" label="测试条件" width="200">-->
      <!--        <template v-slot="scope">-->
      <!--          <el-input v-model="scope.row.teststepCondition" />-->
      <!--        </template>-->
      <!--      </el-table-column>-->
      <!--      <el-table-column prop="testData" label="测试数据" width="200">-->
      <!--        <template v-slot="scope">-->
      <!--          <el-input v-model="scope.row.testData" />-->
      <!--        </template>-->
      <!--      </el-table-column>-->
      <!--      <el-table-column prop="expectedResult" label="期待结果" width="200">-->
      <!--        <template v-slot="scope">-->
      <!--          <el-input v-model="scope.row.expectedResult" />-->
      <!--        </template>-->
      <!--      </el-table-column>-->
      <!--      <el-table-column prop="remarks" label="备注" width="200">-->
      <!--        <template v-slot="scope">-->
      <!--          <el-input v-model="scope.row.remarks" />-->
      <!--        </template>-->
      <!--      </el-table-column>-->
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
      <el-table-column label="自定义字段">
        <!--        <div>{{customFields}}</div>-->
        <div
          v-for="field in customFields"
          :key="field.id"
        >
          <el-select
            v-if="['number', 'dropDown', 'multiList', 'userList'].includes(field.fieldType)"
            v-model="field.valueData"
            :multiple="['multiList'].includes(field.fieldType)"
            :placeholder="`请选择${field.fieldNameCn}`"
          >
            <el-option
              v-for="item in handleOptions(field.possibleValue)"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
            <el-option label="添加新值" value="999" @click.native="handleAddPossibleValue(field)"/>
          </el-select>
        </div>
        <div
          v-for="field in customFields"
          :key="field.id"
        >
          <el-select
            v-if="['number', 'dropDown', 'multiList', 'userList'].includes(field.fieldType)"
            v-model="field.valueData"
            :multiple="['multiList'].includes(field.fieldType)"
            :placeholder="`请选择${field.fieldNameCn}`"
          >
            <el-option
              v-for="item in handleOptions(field.possibleValue)"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
            <el-option label="添加新值" value="999" @click.native="handleAddPossibleValue(field)"/>
          </el-select>
        </div>
        <div>2</div>
        <!--        <div-->
        <!--          v-for="field in customFields"-->
        <!--          :key="field.id">-->
<!--                  <el-select-->
        <!--                    v-if="['number', 'dropDown', 'multiList', 'userList'].includes(field.fieldType)"-->
        <!--                    v-model="field.valueData"-->
        <!--                    :multiple="['multiList'].includes(field.fieldType)"-->
        <!--                    :placeholder="`请选择${field.fieldNameCn}`"-->
        <!--                  >-->
        <!--                    <el-option-->
        <!--                      v-for="item in handleOptions(field.possibleValue)"-->
        <!--                      :key="item.value"-->
        <!--                      :label="item.label"-->
        <!--                      :value="item.value"-->
        <!--                    />-->
        <!--                    <el-option label="添加新值" value="999" @click.native="handleAddPossibleValue(field)"/>-->
        <!--                  </el-select>-->
        <!--        </div>-->
        <!--        <el-col-->
        <!--          v-for="(field) in customFields"-->
        <!--          :key="field.id"-->
        <!--          :xs="24"-->
        <!--          :sm="24"-->
        <!--          :md="12"-->
        <!--          :lg="12"-->
        <!--          :xl="8"-->
        <!--        >-->
        <!--          <el-form-item-->
        <!--            size="small"-->
        <!--            :label="field.fieldNameCn"-->
        <!--            label-width="80px"-->
        <!--            :prop="'custom' + field.fieldNameEn"-->
        <!--          >-->
        <!--            <el-input-->
        <!--              v-if="field.fieldType === 'text'"-->
        <!--              v-model="field.valueData"-->
        <!--              type="text"-->
        <!--              :length="field.length"-->
        <!--            />-->
        <!--            <el-input-->
        <!--              v-if="field.fieldType === 'memo'"-->
        <!--              v-model="field.valueData"-->
        <!--              type="textarea"-->
        <!--              :rows="2"-->
        <!--              placeholder="请输入内容"-->
        <!--              :length="field.length"-->
        <!--            />-->
        <!--            <el-radio-group v-if="field.fieldType === 'radio'" v-model="field.valueData">-->
        <!--              <el-radio label="1">是</el-radio>-->
        <!--              <el-radio label="0">否</el-radio>-->
        <!--            </el-radio-group>-->
        <!--            <el-checkbox-->
        <!--              v-if="field.fieldType === 'checkbox'"-->
        <!--              :checked="field.valueData === 'checked'"-->
        <!--              @change="field.valueData = field.valueData === 'checked' ? 'un-checked' : 'checked'"-->
        <!--            />-->
        <!--            <el-select-->
        <!--              v-if="['number', 'dropDown', 'multiList', 'userList', 'linkedDropDown'].includes(field.fieldType)"-->
        <!--              v-model="field.valueData"-->
        <!--              :multiple="['multiList'].includes(field.fieldType)"-->
        <!--              :placeholder="`请选择${field.fieldNameCn}`"-->
        <!--            >-->
        <!--              <el-option-->
        <!--                v-for="item in handleOptions(field.possibleValue, field.fieldType === 'linkedDropDown')"-->
        <!--                :key="item.value"-->
        <!--                :label="item.label"-->
        <!--                :value="item.value"-->
        <!--              />-->
        <!--              &lt;!&ndash; <router-link :to="`/admincenter/admincenter?par=${field.fieldNameEn}`"> &ndash;&gt;-->
        <!--              <el-option label="添加新值" value="0" @click.native="handleAddPossibleValue(field)" />-->
        <!--              &lt;!&ndash; </router-link> &ndash;&gt;-->
        <!--            </el-select>-->
        <!--            <el-link v-if="field.fieldType === 'link'" :href="field.defaultValue" target="_blank">-->
        <!--              {{ field.defaultValue }}-->
        <!--            </el-link>-->
        <!--            <el-input v-if="field.fieldType === 'link'" v-model="field.valueData" type="text" />-->
        <!--            <el-date-picker-->
        <!--              v-if="field.fieldType === 'Date'"-->
        <!--              v-model="field.valueData"-->
        <!--              type="date"-->
        <!--              placeholder="选择日期"-->
        <!--            />-->
        <!--          </el-form-item>-->
        <!--        </el-col>-->
      </el-table-column>
    </el-table>
  </div>

</template>

<script>
import { addTestCaseStepApi, queryTestCaseStepApi } from '@/api/testcaseStep'
import { message } from '@/utils/common'
import { getAllCustomField } from '@/api/getFields'

export default {
  props: ['caseId'],
  data() {
    return {
      // 选择框
      checkedDetail: [],
      // 自定义字段
      sysCustomFields: [],
      customFields: [],
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
        testStep: 'Step 1 description',
        teststepCondition: 'testStepCondition updtae ith id',
        testData: 'testData',
        expectedResult: 'result',
        remarks: 'testing tesxt',
        testStepId: 1,
        teststepExpand: {}
      }
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
          console.log('系统字段==>')
          console.log(this.sysCustomFields)
          console.log('自定义字段==>')
          console.log(this.customFields)
          // 初始化表格数据
          this.queryTestCaseStep()
        }
      })
    },
    // 获取步骤列表
    queryTestCaseStep() {
      // console.log('测试用例ID' + this.caseId);
      queryTestCaseStepApi(this.caseId).then((res) => {
        if (res !== null) {
          this.testCaseStepTableData = res.data
          // 转换自定义字段
          this.testCaseStepTableData.forEach(obj => {
            console.log(obj)
            console.log(obj.teststepExpand)
            console.log(JSON.parse(obj.teststepExpand))
            obj.customFieldDatas = JSON.parse(obj.teststepExpand)
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
