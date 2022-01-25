<template>
  <div class="app-container add-form add-project">
    <div class="oprate_btn">
      <el-button type="danger" @click="importFile">导入</el-button>
      <el-button type="warning" @click="selectFile">选择文件</el-button>
      <el-button type="success" @click="saveTemp">保存模板</el-button>
    </div>
    <el-row :gutter="20">
      <el-col :span="19">
        <el-form
          ref="testTemplateForm"
          :model="testTemplate"
          label-position="right"
          label-width="110px"
          size="small"
          :rules="testTemplateRules"
        >
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="模板名称">
                <el-input v-model.trim="testTemplate.templateName" :maxlength="10" placeholder="模板名称" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="选中的文件">
                <el-input v-model.trim="testTemplate.selectFile" placeholder="选中的文件" :readonly="true" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="6">
              <el-form-item label="测试用例标题" prop="testTitleCol">
                <el-input v-model.trim="testTemplate.testTitleCol" v-Alphabet placeholder="测试用例标题列" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="状态" prop="statusCol">
                <el-input v-model.trim="testTemplate.statusCol" v-Alphabet placeholder="测试用例标题列" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="描述" prop="descriptionCol">
                <el-input v-model.trim="testTemplate.descriptionCol" v-Alphabet placeholder="描述列" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="关联故事" prop="featureCol">
                <el-input v-model.trim="testTemplate.featureCol" v-Alphabet placeholder="关联故事列" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="优先级" prop="priorityCol">
                <el-input v-model.trim="testTemplate.priorityCol" v-Alphabet placeholder="优先级" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="浏览器" prop="browserCol">
                <el-input v-model.trim="testTemplate.browserCol" v-Alphabet placeholder="浏览器" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="平台" prop="platformCol">
                <el-input v-model.trim="testTemplate.platformCol" v-Alphabet placeholder="平台" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="版本" prop="versionCol">
                <el-input v-model.trim="testTemplate.versionCol" v-Alphabet placeholder="版本" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="测试分类" prop="caseCategoryCol">
                <el-input v-model.trim="testTemplate.caseCategoryCol" v-Alphabet placeholder="测试分类" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="测试类型" prop="caseTypeCol">
                <el-input v-model.trim="testTemplate.caseTypeCol" v-Alphabet placeholder="测试类型" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="ExternalID" prop="externalIdCol">
                <el-input v-model.trim="testTemplate.externalIdCol" v-Alphabet placeholder="ExternalID" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="测试环境" prop="envCol">
                <el-input v-model.trim="testTemplate.envCol" v-Alphabet placeholder="测试环境" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="测试设备" prop="deviceTypeCol">
                <el-input v-model.trim="testTemplate.deviceTypeCol" v-Alphabet placeholder="测试设备" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="模块" prop="moduleCol">
                <el-input v-model.trim="testTemplate.moduleCol" v-Alphabet placeholder="模块" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="Automation" prop="automationCol">
                <el-input v-model.trim="testTemplate.automationCol" v-Alphabet placeholder="Automation" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="测试条件" prop="preConditionCol">
                <el-input v-model.trim="testTemplate.preConditionCol" v-Alphabet placeholder="测试条件" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="测试数据" prop="preDataCol">
                <el-input v-model.trim="testTemplate.preDataCol" v-Alphabet placeholder="测试数据" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="Comments" prop="commentsCol">
                <el-input v-model.trim="testTemplate.commentsCol" v-Alphabet placeholder="Comments" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-divider content-position="left">Step</el-divider>
          <el-row :gutter="20">
            <el-col :span="6">
              <el-form-item label="步骤" prop="stepCol">
                <el-input v-model.trim="testTemplate.stepCol" v-Alphabet placeholder="步骤" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="测试数据" prop="stepTestDataCol">
                <el-input v-model.trim="testTemplate.stepTestDataCol" v-Alphabet placeholder="测试数据" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="预期结果" prop="stepExpectResultCol">
                <el-input v-model.trim="testTemplate.stepExpectResultCol" v-Alphabet placeholder="预期结果" />
              </el-form-item>
            </el-col>
            <!--            <el-col :span="6">-->
            <!--              <el-form-item label="实际结果" prop="stepActualResultCol">-->
            <!--                <el-input v-model="testTemplate.stepActualResultCol" v-Alphabet placeholder="实际结果" />-->
            <!--              </el-form-item>-->
            <!--            </el-col>-->
          </el-row>
          <el-divider content-position="left">导入规则</el-divider>
          <el-row>
            <el-col :span="6" style="display: flex">
              <el-form-item label-width="0px">
                <el-checkbox v-model.trim="testTemplate.ifSplitTestStep">步骤分隔符</el-checkbox>
              </el-form-item>
              <el-form-item v-if="testTemplate.ifSplitTestStep" label-width="10px" prop="splitTestStep">
                <el-input v-model.trim="testTemplate.splitTestStep" placeholder="分隔符只能为逗号','或者分号';'" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label-width="0px">
                <el-checkbox v-model.trim="testTemplate.ifIgnorFirstRow">第一行不导入</el-checkbox>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label-width="0px">
                <el-checkbox v-model.trim="testTemplate.ifSendEmail">导入完毕邮件通知我</el-checkbox>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label-width="0px">
                <el-checkbox v-model.trim="testTemplate.ifCreateView">创建【创建时间】新视图</el-checkbox>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24" style="display: flex">
              <el-form-item label-width="0px">
                <el-checkbox v-model.trim="testTemplate.ifUpdateCase">更新已有测试用例</el-checkbox>
              </el-form-item>
              <br>
              <!--              <el-form-item-->
              <!--                v-if="testTemplate.ifUpdateCase"-->
              <!--                label-width="50px"-->
              <!--                label="From"-->
              <!--                style="margin-left: 20px"-->
              <!--                prop="updateCaseFrom"-->
              <!--              >-->
              <!--                <el-input v-model="testTemplate.updateCaseFrom" type="number" :min="0" placeholder="From" />-->
              <!--              </el-form-item>-->
              <!--              <el-form-item-->
              <!--                v-if="testTemplate.ifUpdateCase"-->
              <!--                label-width="30px"-->
              <!--                prop="updateCaseTo"-->
              <!--                label="To"-->
              <!--                style="margin-left: 10px"-->
              <!--              >-->
              <!--                <el-input v-model="testTemplate.updateCaseTo" type="number" :min="0" placeholder="To" />-->
              <!--              </el-form-item>-->
            </el-col>
            <el-col v-if="testTemplate.ifUpdateCase">
              <span style="color: red; font-size: 10px">请确保您要更新的 外部ID 、 故事 与现有测试用例相一致。如果导入的数据没有在数据库中找到对应的记录，会依据导入规则添加测试用例。</span>
            </el-col>
          </el-row>
        </el-form>
      </el-col>
      <el-col :span="5">
        <div class="temp">
          <el-radio-group v-model="selectTemp" style="min-width: 100%">
            <div
              v-for="item in tempList"
              :key="item.id"
              class="select-item"
              :style="{marginBottom: item.ifDefault==0?0: '15px'}"
            >
              <el-radio :label="item.id" @click.native.prevent="onRadioChange(item)">
                {{ item.templateName }}
              </el-radio>
              <el-button
                v-if="item.ifDefault==0"
                type="text"
                icon="el-icon-close"
                style="padding: 0; margin-left: 20px"
                @click="delTemp(item)"
              />
            </div>
          </el-radio-group>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {
  queryListByUserId,
  addTestCaseTemplate,
  deleteTemp,
  updateTestCaseTemplate,
  importTestCase
} from '@/api/testcase'
import { selectFile } from '@/utils/file'

let timer = null

export default {
  name: 'ImportTestCases',
  data () {
    // 验证列是否重复出现
    const verificationDuplicate = (rule, value, callback) => {
      const _that = this
      if (value !== '' && typeof value === 'string') {
        for (const key in this.testTemplate) {
          if (key !== rule.field && value === this.testTemplate[key]) {
            console.log(rule.field, key, this.testTemplate)
            callback(new Error(`列${value}重复出现`))
            return
          }
        }
        if (timer == null) {
          timer = setTimeout(function () {
            _that.$refs.testTemplateForm.validate()
            timer = null
          }, 300)
        }
        callback()
      } else {
        callback()
      }
    }
    // const validateupdateCaseFrom = (rule, value, callback) => {
    //   if (this.testTemplate.updateCaseFrom <= 0) {
    //     callback(new Error('输入的值必须大于0'))
    //   } else {
    //     callback()
    //   }
    // }
    // const validateupdateCaseTo = (rule, value, callback) => {
    //   if (this.testTemplate.updateCaseTo <= 0) {
    //     callback(new Error('输入的值必须大于0'))
    //   } else if (this.testTemplate.updateCaseTo < this.testTemplate.updateCaseFrom) {
    //     callback(new Error('结束行必须大于或等于起始行'))
    //   } else {
    //     callback()
    //   }
    // }
    return {
      selectTempDetail: null,
      selectTemp: '',
      tempList: [], // 当前登录人的模板
      file: null,
      // 表单数据
      testTemplate: {
        selectFile: '',
        templateName: '',
        testTitleCol: '',
        statusCol: '',
        descriptionCol: '',
        featureCol: '',
        priorityCol: '',
        browserCol: '',
        platformCol: '',
        versionCol: '',
        caseCategoryCol: '',
        caseTypeCol: '',
        externalIdCol: '',
        envCol: '',
        deviceTypeCol: '',
        moduleCol: '',
        automationCol: '',
        preConditionCol: '',
        commentsCol: '',
        preDataCol: '',
        stepCol: '',
        stepTestDataCol: '',
        stepExpectResultCol: '',
        // stepActualResultCol: '',
        ifSplitTestStep: false,
        splitTestStep: '',
        ifIgnorFirstRow: false,
        ifSendEmail: false,
        ifCreateView: false,
        ifUpdateCase: false
        // updateCaseFrom: '',
        // updateCaseTo: ''
      },
      // 表单验证
      testTemplateRules: {
        testTitleCol: [
          { required: true, message: '请输入测试标题列', trigger: 'blur' },
          { validator: verificationDuplicate, trigger: 'blur' }
        ],
        statusCol: [{ validator: verificationDuplicate, trigger: 'blur' }],
        descriptionCol: [{ validator: verificationDuplicate, trigger: 'blur' }],
        featureCol: [
          { required: true, message: '请输入关联故事列', trigger: 'blur' },
          { validator: verificationDuplicate, trigger: 'blur' }
        ],
        priorityCol: [
          { required: true, message: '请输入优先级列', trigger: 'blur' },
          { validator: verificationDuplicate, trigger: 'blur' }
        ],
        browserCol: [{ validator: verificationDuplicate, trigger: 'blur' }],
        platformCol: [{ validator: verificationDuplicate, trigger: 'blur' }],
        versionCol: [{ validator: verificationDuplicate, trigger: 'blur' }],
        caseCategoryCol: [
          { required: true, message: '请输入测试分类列', trigger: 'blur' },
          { validator: verificationDuplicate, trigger: 'blur' }
        ],
        caseTypeCol: [
          { required: true, message: '请输入测试类型列', trigger: 'blur' },
          { validator: verificationDuplicate, trigger: 'blur' }
        ],
        externalIdCol: [{ validator: verificationDuplicate, trigger: 'blur' }],
        envCol: [
          { required: true, message: '请输入测试环境列', trigger: 'blur' },
          { validator: verificationDuplicate, trigger: 'blur' }
        ],
        deviceTypeCol: [{ validator: verificationDuplicate, trigger: 'blur' }],
        automationCol: [{ validator: verificationDuplicate, trigger: 'blur' }],
        preConditionCol: [{ validator: verificationDuplicate, trigger: 'blur' }],
        commentsCol: [{ validator: verificationDuplicate, trigger: 'blur' }],
        preDataCol: [{ validator: verificationDuplicate, trigger: 'blur' }],
        stepCol: [{ validator: verificationDuplicate, trigger: 'blur' }],
        stepTestDataCol: [{ validator: verificationDuplicate, trigger: 'blur' }],
        stepExpectResultCol: [{ validator: verificationDuplicate, trigger: 'blur' }],
        // stepActualResultCol: [{ validator: verificationDuplicate, trigger: 'blur' }],
        moduleCol: [
          { required: true, message: '请输入模块列', trigger: 'blur' },
          { validator: verificationDuplicate, trigger: 'blur' }
        ],
        splitTestStep: [{ required: true, message: '请输入步骤分隔符', trigger: 'blur' }]
        // updateCaseFrom: [
        //   { required: true, message: '请输入更新已有测试用例起始行', trigger: 'blur' },
        //   { validator: validateupdateCaseFrom, trigger: 'blur' }
        // ],
        // updateCaseTo: [
        //   { required: true, message: '请输入更新已有测试用例结束行', trigger: 'blur' },
        //   { validator: validateupdateCaseTo, trigger: 'blur' }
        // ]
      },
      notifyPromise: Promise.resolve()
    }
  },
  created () {
    this.queryListByUserId()
  },
  methods: {
    // 通知，解决element-ui，同时调用notify时，通知重叠的问题
    notify ({
      type = 'success',
      title,
      message,
      duration = 0,
      dangerouslyUseHTMLString = true,
      position = 'top-right'
    }) {
      this.notifyPromise = this.notifyPromise.then(this.$nextTick).then(() => {
        this.$notify({
          type, title, message, duration, dangerouslyUseHTMLString, position, customClass: 'notifyStyle'
        })
      })
    },
    // 选择文件
    selectFile () {
      selectFile({ accept: '.et,.xlsx,.xls,.csv', multiple: false }).then(file => {
        const fileFormat = file.file.name.substring(file.file.name.lastIndexOf('.') + 1)
        if (fileFormat !== 'et' && fileFormat !== 'xlsx' && fileFormat !== 'xls' && fileFormat !== 'csv') {
          this.$message.warning('要导入的文件只能是.et,.xlsx,.xls,.csv四种格式')
        } else {
          this.file = file.file
          this.testTemplate.selectFile = file.url
        }
      })
    },
    // 导入
    importFile () {
      this.$refs.testTemplateForm.validate((valid) => {
        console.log('**************')
        if (valid) {
          if (this.file === null) {
            this.$message.warning('请选择要导入的文件')
          } else {
            // const fso = new ActiveXObject('Scripting.FileSystemObject')
            // if (!fso.FileExists(this.testTemplate.selectFile, true)) {
            //   return this.$message.warning(`要导入的文件已经不存在了`)
            // }
            if (this.testTemplate.ifSplitTestStep && this.testTemplate.splitTestStep !== ',' && this.testTemplate.splitTestStep !== ';') {
              return this.$message.warning(`步骤分隔符只能是‘,’或者‘;’`)
            }
            const formData = new FormData()
            console.log(this.file)
            formData.append('file', this.file, this.file.name)
            const form = { ...this.testTemplate }
            delete form.templateName
            delete form.selectFile
            formData.append('param', JSON.stringify(form))
            const loading = this.$loading({
              lock: true,
              text: '测试用例导入中',
              spinner: 'el-icon-loading',
              background: 'rgba(0, 0, 0, 0.2)'
            })
            importTestCase(formData).then(res => {
              if (res.code === '200') {
                this.$message.success('测试用例导入，请稍后查看邮箱查询导入结果')
                // const result = res.data
                // const h = this.$createElement
                // if (result.success && result.success.length > 0) {
                //   this.$message.success(result.success.join())
                // }
                // if (result.error && result.error.length > 0) {
                //   result.error.forEach(item => {
                //     const msgDatas = []
                //     item[Object.keys(item)[0]].forEach((errMsg, index) => {
                //       msgDatas.push(h('p', null, `${index + 1}、${errMsg}`))
                //     })
                //     this.notify({
                //       type: 'error',
                //       title: '异常：' + Object.keys(item)[0],
                //       message: h('div', null, msgDatas)
                //     })
                //   })
                // }
                // if (result.warning && result.warning.length > 0) {
                //   result.warning.forEach(item => {
                //     const msgDatas = []
                //     item[Object.keys(item)[0]].forEach((warnimgMsg, index) => {
                //       msgDatas.push(h('p', null, `${index + 1}、${warnimgMsg}`))
                //     })
                //     this.notify({
                //       type: 'warning',
                //       title: '警告：' + Object.keys(item)[0],
                //       message: h('div', null, msgDatas)
                //     })
                //   })
                // }
              }
            }).catch(error => {
              if (error.message === 'Network Error') {
                this.$message.error('您选中的文件发生了变动或不存在，请重新选择文件')
              }
            }).finally(() => {
              loading.close()
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 保存模板
    saveTemp () {
      if (this.selectTempDetail && this.selectTempDetail.ifDefault === 1) {
        this.$message.warning('当前模板是默认模板，不可修改')
        return
      }
      this.$refs.testTemplateForm.validate((valid) => {
        if (valid) {
          if (this.testTemplate.templateName === '') {
            this.$message.warning('请输入模板名称')
          } else {
            if (this.testTemplate.ifSplitTestStep && this.testTemplate.splitTestStep !== ',' && this.testTemplate.splitTestStep !== ';') {
              return this.$message.warning(`步骤分隔符只能是‘,’或者‘;’`)
            }
            // 格式化模板数据
            const formData = { ...this.testTemplate }
            const data = {
              templateName: formData.templateName
            }
            delete formData.templateName
            delete formData.selectFile
            data.jsonContent = JSON.stringify(formData)
            if (this.selectTemp === '') {
              this.addTemp(data)
            } else {
              data.id = this.selectTemp
              this.updateTemp(data)
            }
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 新增模板
    addTemp (data) {
      const loading = this.$loading({
        lock: true,
        text: '模板保存中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.2)'
      })
      addTestCaseTemplate(data).then(res => {
        if (res.code === '200') {
          this.$message.success('模板保存成功')
          this.queryListByUserId()
        } else {
          this.$message.error(res.message)
        }
      }).finally(() => {
        loading.close()
      })
    },
    // 更新模板
    updateTemp (data) {
      const loading = this.$loading({
        lock: true,
        text: '模板更新中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.2)'
      })
      updateTestCaseTemplate(data).then(res => {
        if (res.code === '200') {
          this.$message.success('模板更新成功')
          this.queryListByUserId()
        } else {
          this.$message.error(res.message)
        }
      }).finally(() => {
        loading.close()
      })
    },
    // 删除模板
    delTemp (temp) {
      this.$confirm('请问是否确认删除该模板?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const loading = this.$loading({
          lock: true,
          text: '模板删除中',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.2)'
        })
        deleteTemp(temp.id).then(res => {
          if (res.code === '200') {
            this.$message.success('删除成功!')
            if (this.selectTemp === temp.id) {
              this.selectTemp = ''
              this.selectTempDetail = null
            }
            this.queryListByUserId()
          }
        }).finally(() => {
          loading.close()
        })
      }).catch(() => {
      })
    },

    // 获取当前登录人模板和默认模板
    queryListByUserId () {
      queryListByUserId().then(res => {
        if (res.code === '200') {
          const defaultTempList = res.data.filter(item => {
            return item.ifDefault === 1
          })
          const tempList = res.data.filter(item => {
            return item.ifDefault === 0
          })
          this.tempList = [...defaultTempList, ...tempList]
        }
      })
    },
    // 点击模板
    onRadioChange (e) {
      // 当点击已经选中的把 activeModel 置空，就是取消选中，并返回
      if (this.selectTemp === e.id) {
        this.selectTemp = ''
        this.selectTempDetail = null
        this.initialize()
        return
      }
      // 不是选中，选中当前点击 Radio
      this.selectTemp = e.id
      this.selectTempDetail = e
      const selectFile = this.testTemplate.selectFile
      const jsonContent = JSON.parse(e.jsonContent)
      this.testTemplate = { selectFile, templateName: e.templateName, ...jsonContent }
    },
    // 初始化表单
    initialize () {
      const selectFile = this.testTemplate.selectFile
      this.testTemplate = {
        selectFile: selectFile,
        templateName: '',
        testTitleCol: '',
        statusCol: '',
        descriptionCol: '',
        featureCol: '',
        priorityCol: '',
        browserCol: '',
        platformCol: '',
        versionCol: '',
        caseCategoryCol: '',
        caseTypeCol: '',
        externalIdCol: '',
        envCol: '',
        deviceTypeCol: '',
        moduleCol: '',
        automationCol: '',
        preConditionCol: '',
        commentsCol: '',
        preDataCol: '',
        stepCol: '',
        stepTestDataCol: '',
        stepExpectResultCol: '',
        // stepActualResultCol: '',
        ifSplitTestStep: false,
        splitTestStep: '',
        ifIgnorFirstRow: false,
        ifSendEmail: false,
        ifCreateView: false,
        ifUpdateCase: false
        // updateCaseFrom: '',
        // updateCaseTo: ''
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "index.scss";

//.oprate_btn {
//  ::v-deep .el-button--text {
//    margin-bottom: 0;
//  }
//
//  border-bottom: 1px solid #DCDFE6;
//  margin-bottom: 20px;
//}

.temp {
  overflow: auto;
  background: #fff;
  padding: $spacing;
  box-sizing: border-box;
  margin-right: 20px;
  width: 100%;

  .select-item {
    width: 100%;
    display: flex;
    justify-content: space-between;
  }
}

::v-deep .notifyStyle {
  word-wrap: break-word;
  word-break: break-all;
}

::v-deep .el-divider__text {
  background-color: #F2F2F2;
}
</style>
