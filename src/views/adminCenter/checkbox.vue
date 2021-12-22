<template>
  <el-row class="fd-row" :gutter="20">
    <el-col
      :span="8"
    ><div class="grid-content bg-purple" />
      <el-form
        ref="fieldsfrom"
        :model="fieldsfrom"
        :rules="fieldsrules"
        label-width="100px"
        class="demo-ruleForm"
      >
        <div class="fieldbtn">
          <el-button
            type="primary"
            round
            @click="submitfdForm('fieldsfrom')"
          >保存</el-button>
          <el-button
            type="primary"
            round
          >放弃</el-button>
        </div>
        <el-form-item label="字段名称" prop="fieldName" class="form-small">
          <el-input v-model="fieldsfrom.fieldName" size="small" />
        </el-form-item>
        <el-form-item label="类型" prop="type" class="form-small">
          <el-select
            v-model="fieldsfrom.type"
            size="small"
            placeholder="请选择适用范围"
            @change="PleaseType"
          >
            <el-option
              v-for="item in fieldsOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="showLength"
          label="长度"
          prop="length"
          class="form-small"
        >
          <el-input v-model="fieldsfrom.length" size="small" />
        </el-form-item>
        <el-form-item
          v-if="dropValue"
          label="值"
          prop="length"
          class="form-small"
        >
          <el-row>
            <el-col
              :span="16"
            ><el-input
              v-model="fieldsfrom.Value"
              size="small"
            /></el-col>
            <el-col :span="8">
              <div style="marginleft: 5px">
                <el-button
                  type="primary"
                  round
                  :disabled="!fieldsfrom.Value"
                  @click="addDrop"
                >添加</el-button>
              </div>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
    </el-col>
    <el-col v-if="dropValue" :span="4">
      <el-row>
        <el-col :span="16">
          <el-table
            border
            max-height="205"
            :data="dropData"
            @row-click="dropselect"
          >
            <el-table-column prop="name" align="center" label="value" />
          </el-table>
        </el-col>
        <el-col :span="8">
          <div style="marginleft: 5px">
            <el-button
              type="primary"
              round
              :disabled="!droprow"
              @click="delDrop"
            >删除</el-button>
          </div>
        </el-col>
      </el-row>
    </el-col>
    <el-col
      v-if="true"
      :span="6"
    ><div class="grid-content bg-purple" />
      <el-row class="sen-row" :gutter="20">
        <el-col :span="4">
          <el-checkbox v-model="checked1" />
        </el-col>
        <el-col :span="4">范围</el-col>
        <el-col :span="4">是否必填</el-col>
        <el-col :span="4">初始值</el-col>
      </el-row>
      <el-row v-for="(item, index) in scopeList" :key="index" class="sen-row" :gutter="20">
        <el-col :span="4">
          <el-checkbox v-model="fieldsfrom.scope[index]" />
        </el-col>
        <el-col :span="4">{{ item }}</el-col>
        <el-col :span="4">
          <div class="ng-red">
            <el-checkbox v-model="fieldsfrom.mandatory[index]" />
          </div>
        </el-col>
        <el-col :span="4">
          <div class="ng-red check-box">
            <el-checkbox v-model="fieldsfrom.defaultValue[index]" />
          </div>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
import { message } from '@/utils/common'
import { addCustomRadio, updateCustomRadio } from '@/api/customField'
export default {
  name: 'CheckBox',
  props: {
    customType: {
      type: String,
      required: true
    },
    customname: {
      type: Object,
      required: true
    },
    fieldName: {
      type: String,
      required: true
    },
    fieldsOptions: {
      type: Array,
      required: true
    },
    scopeList: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      tableHeader: {
        color: '#d4dce3',
        background: '#4286CD'
      },
      // 自定义字段
      fieldsfrom: {
        type: this.customType,
        scope: [],
        defaultValue: [],
        mandatory: [],
        projectId: '',
        fieldName: this.fieldName
      },
      fieldsrules: {
        fieldName: [{ required: true, message: '请输入字段名称', trigger: 'blur' }],
        type: [{ required: true, message: '请选择类型', trigger: 'change' }]
      },
      checked1: true,
      inputvalue: '',
      // 类型选择（单选 or 复选）
      singleorType: false,
      // 字符长度 （文本 or 备注）
      showLength: false,
      dropValue: false,
      dropData: [
        { name: '01' },
        { name: '02' }
      ],
      droprow: ''
      // 自定义字段 结束
    }
  },
  computed: {
    projectInfo() {
      return this.$store.state.user.userinfo
    }
  },
  watch: {
    'customname': function(val) {
      this.fieldsfrom = val
    }
  },
  created() {
    this.fieldsfrom.projectId = this.projectInfo.userUseOpenProject.projectId
    this.initScopeValue()
  },
  methods: {
    // 初始化范围值、是否必填、初始值
    initScopeValue() {
      const that = this
      that.scopeList.forEach((item, index) => {
        that.fieldsfrom.scope[index] = false
        that.fieldsfrom.defaultValue[index] = false
        that.fieldsfrom.mandatory[index] = false
      })
    },
    // 字段表单提交
    submitfdForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const radio = this.fieldsfrom
          for (const key in radio) {
            if (key === 'scope' || key === 'defaultValue' || key === 'mandatory') {
              for (let i = 0; i < radio[key].length; i++) {
                if (radio[key][i] === false) {
                  radio[key][i] = '0'
                } else {
                  radio[key][i] = '1'
                }
              }
            }
          }

          for (const i in radio) {
            if (i === 'scope' || i === 'defaultValue' || i === 'mandatory') {
              radio[i] = radio[i].join(',')
            }
          }
          if (!this.fieldsfrom.id) {
            addCustomRadio(radio).then(res => {
              if (res.code === '200') {
                message('success', res.msg)
              }
            })
          } else {
            updateCustomRadio(radio).then(res => {
              if (res.code === '200') {
                message('success', res.msg)
              }
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    PleaseType(val) {
      this.$emit('setFieldName', this.fieldsfrom.fieldName)
      this.$emit('PleaseType', val)
    },
    // drop表格选中
    dropselect(val) {
      this.droprow = val
    },
    // 添加drop值
    addDrop() {
      const obj = {
        name: this.fieldsfrom.Value
      }
      this.dropData.push(obj)
    },
    // 删除drop值
    delDrop() {
      const val = this.droprow
      this.dropData.filter((item, index) => {
        if (item === val) {
          this.dropData.splice(index, 1)
          this.droprow = ''
        }
      })
    }

  }
}

</script>

<style lang="scss" scoped>
@import "index.scss";
@import "@/views/project/index.scss";
</style>
<style lang="scss">
  .manage-view .fd-row .sen-row .ng-red.check-box{
    .el-checkbox__inner{
      border-radius: 0;
      &::after{
        border: 1px solid #666;
        border-top: none;
        border-left: none;
        width: 3px;
        height: 7px;
        left: 4px;
        top: 1px;
        right: inherit;
        border-radius: 0;
        bottom: 3px;
        background: #fff;
      }
    }
  }
</style>
