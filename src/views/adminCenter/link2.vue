<template>
  <el-row class="fd-row" :gutter="20">
    <el-col
      :span="8"
    >
      <div class="grid-content bg-purple"/>
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
            @click="submitfdForm('fieldsfrom')"
          >保存
          </el-button>
          <el-button
            type="primary"
          >放弃
          </el-button>
        </div>
        <el-form-item label="字段名称" prop="fieldName" class="form-small">
          <el-input v-model="fieldsfrom.fieldName" size="small"/>
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
        <el-form-item label="链接字段" prop="linkedFileId" class="form-small">
          <el-select
            v-model="fieldsfrom.linkedFileId"
            size="small"
            placeholder="请选择链接"
            @change="PleaseLink"
          >
            <el-option
              v-for="item in fieldsOptions2"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

            <el-form-item v-show="fieldsfrom.linkedFileId">
                  <el-row class="sen-row" :gutter="20">
                    <el-col :span="4">
                      <el-checkbox v-model="checkedAll"/>
                    </el-col>
                    <el-col :span="8" class="blob">范围</el-col>
                    <el-col :span="8" class="blob">必填</el-col>
                  </el-row>
                  <el-row v-for="(item, index) in checkList" :key="index" class="sen-row" :gutter="20">
                    <el-col :span="4">
                      <el-checkbox v-model="item.checked" @change="checkChange"/>
                    </el-col>
                    <el-col :span="4">{{ item.scope }}</el-col>
                    <el-col :span="4" class="ml20">
                      <div class="ng-red">
                        <el-checkbox v-model="item.mandatory" />
                      </div>
                    </el-col>

                  </el-row>

                </el-form-item>

        <!--<el-form-item-->
        <!--label="长度"-->
        <!--prop="length"-->
        <!--class="form-small"-->
        <!--&gt;-->
        <!--<el-input v-model="fieldsfrom.length" size="small" @blur="setLimitLen" />-->
        <!--</el-form-item> -->
      </el-form>
    </el-col>

    <el-col v-if="fieldsfrom.linkedFileId" :span="6">
     <!--<el-row class="sen-row" :gutter="20" style="margin-bottom: 20px;" >-->
            <!--<div>当用户选项添加时：显示输入框，允许用户输入并添加新值</div>-->
            <!--<div>当用户选择其他列表时：后台返回系统中属于列表的字段标题</div>-->
          <!--</el-row>-->

      <el-row class="sen-row" :gutter="20" style="margin-bottom: 20px;" >
        <div  class="linkData" v-for="item in linkData">
          <div class="linkData_label">{{item.label}}</div>
          <div class="linkData_value">
            <div class="linkData_top">
              <el-button type="primary" size="small" @click="add(item)">添加</el-button>
              <el-button type="primary" size="small" @click="remove(item)">删除</el-button>
            </div>
            <el-input v-model="item.input"></el-input>
            <div class="arrayBox">
              <div
                class="arrayList"
                :class="{'active':item.current===index2}"
                v-for="(item2,index2) in item.array"
                @click="item.current=index2">
                <div>{{item2}}</div>
              </div>
            </div>
          </div>
        </div>
      </el-row>
    </el-col>
    <el-col v-if="false" :span="6">
      <div class="grid-content bg-purple"/>
      <el-row class="sen-row" :gutter="20">
        <el-col :span="4">
          <el-checkbox v-model="checked1"/>
        </el-col>
        <el-col :span="4">范围</el-col>
        <el-col :span="4">是否必填</el-col>
        <el-col :span="4">初始值</el-col>
      </el-row>
      <el-row v-for="(item, index) in scopeList" :key="index" class="sen-row" :gutter="20">
        <el-col :span="4">
          <el-checkbox v-model="fieldsfrom.scope[index]"/>
        </el-col>
        <el-col :span="4">{{ item }}</el-col>
        <el-col :span="4">
          <div class="ng-red">
            <el-checkbox v-model="fieldsfrom.mandatory[index]"/>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="ng-input">
            <el-input v-model="fieldsfrom.defaultValues[index]" maxlength="50"/>
          </div>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
  import {message} from '@/utils/common'
  import {addCustomText, updateCustomText} from '@/api/customField'

  export default {
    name: 'Link',
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
        fieldsOptions2:[
          {value:1,label:'链接1'},
          {value:2,label:'链接1'},
          {value:3,label:'链接3'},
        ],
        linkData: [
          {label: 'STD', input: '',current:"", array: ['link1', 'link2', 'link3']},
          {label: 'PRD', input: '',current:"", array: ['link1', 'link2', 'link3']},
        ],
         checkedAll:false,
                checkList:[
                  {check:false,scope:'Project',mandatory:false},
                  {check:false,scope:'Feature',mandatory:false},
                  {check:false,scope:'TestCase',mandatory:false},
                  {check:false,scope:'TestCycle',mandatory:false},
                  {check:false,scope:'Issue',mandatory:false},
                ],

        tableHeader: {
          color: '#d4dce3',
          background: '#4286CD'
        },
        cloneFieldsForm: {},
        // 自定义字段
        fieldsfrom: {
          type: this.customType,
          linkedFileId:'',
          concat: '',
          scope: [],
          mandatory: [],
          projectId: '',
          fieldName: this.fieldName
        },
        fieldsrules: {
          fieldName: [{required: true, message: '请输入字段名称', trigger: 'blur'}],
          type: [{required: true, message: '请选择类型', trigger: 'change'}]
        },
        checked1: true,
        inputvalue: '',
        // 类型选择（单选 or 复选）
        singleorType: false,
        // 字符长度 （文本 or 备注）
        showLength: false,
        dropValue: false,
        dropData: [
          {name: '01'},
          {name: '02'}
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
      'customname': function (val) {
        this.setForm()
       },
           checkedAll(val){
             if(val==true){
               this.checkList.forEach(item=>item.checked=true)
             }
             }
    },
    created() {
      /* eslint-disable */
      this.cloneFieldsForm = _.cloneDeep(this.fieldsfrom)
      this.fieldsfrom.projectId = this.projectInfo.userUseOpenProject.projectId
      this.initScopeValue()
      this.setForm()
    },
    methods: {
      setForm() {
        const that = this
        for (const key in that.fieldsfrom) {
          if (that.customname[key]) {
            this.fieldsfrom[key] = that.customname[key]
          }
        }
      },
      // 初始化范围值、是否必填、初始值
      initScopeValue() {
        const that = this
        that.scopeList.forEach((item, index) => {
          that.fieldsfrom.scope[index] = false
          that.fieldsfrom.defaultValues[index] = ''
          that.fieldsfrom.mandatory[index] = false
        })
      },
      // 长度文本框失焦
      setLimitLen() {
        if (Number(this.fieldsfrom.length) > 50) {
          message('warning', '长度最大值为50')
          return true
        }
      },
      // 字段表单提交
      submitfdForm(formName) {
        if (this.setLimitLen()) {
          return
        }
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
              addCustomText(radio).then(res => {
                if (res.code === '200') {
                  message('success', res.msg)
                  this.fieldsfrom = _.cloneDeep(this.cloneFieldsForm)
                  this.$emit('executeQueryCustomList')
                }
              })
            } else {
              updateCustomText(radio).then(res => {
                if (res.code === '200') {
                  message('success', res.msg)
                  this.fieldsfrom = _.cloneDeep(this.cloneFieldsForm)
                  this.$emit('executeQueryCustomList')
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
      //链接
      PleaseLink(val){

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
      },
      add(item){
        if(!item.input)return;
        item.array.push(item.input)

      },
      remove(item){
        let current=item.current;
        if(!current&&current!==0)return;
        item.array.splice(current,1)
        item.current=""
      },
    /**
       * checkBox改变事件
       * */
      checkChange(value){
        this.$forceUpdate()
      }
    }
  }

</script>

<style lang="scss" scoped>
  @import "index.scss";
  @import "@/views/project/index.scss";
  .fd-row{
    align-items: flex-start !important;
  }
  .linkData {
    display: flex;
    column-gap: 30px;
    margin-right: 40px;
  }

  .linkData_label {
    font-size: 26px;
  }

  .linkData_top {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
  }
  .arrayBox{
    width: 280px;
    height: 200px;
    margin-top: 10px;
    padding: 10px 0;
    overflow: auto;
    font-size: 20px;
    border: 1px solid #999999;
  }
  .arrayList{
    padding: 0px 20px;
    cursor: pointer;
  }
  .active{
    color: #fff;
    background: #4286CD;
  }
  .ml20{
      margin-left: 20px;
    }
    .blob{
      font-weight: bold;
    }
    </style>
