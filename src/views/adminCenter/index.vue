<template>
  <div class="admin-center">
    <el-tabs
      v-model="activeName"
      :before-leave="handleClick"
      class="admin-Control"
      @tab-click="clickTab"
    >
      <el-tab-pane label="用户管理" name="0">
        <user-page
          ref="UserPage"
          :tableHeader="tableHeader"
          @jurisdictionChange="jurisdictionChange"
        ></user-page>
      </el-tab-pane>

      <el-tab-pane v-if="activeName === '1'" label="权限管理" name="1">
        <Jurisdiction
          v-if="jurisdictionAccount"
          :jurisdiction-account="jurisdictionAccount"
          :user-infos="userinfo"
          @userChange="userChange"
        />
      </el-tab-pane>
      <el-tab-pane label="项目管理" name="2">项目管理</el-tab-pane>
      <el-tab-pane label="自定义字段" name="3">
        <div class="manage-view">
          <!-- 自定义字段 -->
          <CustomFFields :row-data="rowData" :getquery-custom-list="getqueryCustomList" />
          <!-- <Userindex
            v-if="customType === '用户'"
            :scope-list="scopeList"
            :custom-type="customType"
            :customname="fieldsfrom"
            :fields-options="fieldsOptions"
            :field-name="fieldName"
            @PleaseType="chType"
            @executeQueryCustomList="getqueryCustomList"
            @setFieldName="setFieldName"
          />
          <Dateindex
            v-if="customType === '日期'"
            :scope-list="scopeList"
            :custom-type="customType"
            :customname="fieldsfrom"
            :fields-options="fieldsOptions"
            :field-name="fieldName"
            @PleaseType="chType"
            @executeQueryCustomList="getqueryCustomList"
            @setFieldName="setFieldName"
          />
          <Radioindex
            v-if="customType === 'radio'"
            :scope-list="scopeList"
            :custom-type="customType"
            :customname="fieldsfrom"
            :fields-options="fieldsOptions"
            :field-name="fieldName"
            @PleaseType="chType"
            @executeQueryCustomList="getqueryCustomList"
            @setFieldName="setFieldName"
          />

          <Textindex
            v-else-if="customType === 'text'"
            :scope-list="scopeList"
            :custom-type="customType"
            :customname="fieldsfrom"
            :fields-options="fieldsOptions"
            :field-name="fieldName"
            @PleaseType="chType"
            @executeQueryCustomList="getqueryCustomList"
            @setFieldName="setFieldName"
          />

          <Memoindex
            v-else-if="customType === 'RichText'"
            :scope-list="scopeList"
            :custom-type="customType"
            :customname="fieldsfrom"
            :fields-options="fieldsOptions"
            :field-name="fieldName"
            @PleaseType="chType"
            @executeQueryCustomList="getqueryCustomList"
            @setFieldName="setFieldName"
          />

          <Link
            v-else-if="customType === '链接'"
            :scope-list="scopeList"
            :custom-type="customType"
            :customname="fieldsfrom"
            :fields-options="fieldsOptions"
            :field-name="fieldName"
            @PleaseType="chType"
            @executeQueryCustomList="getqueryCustomList"
            @setFieldName="setFieldName"
          />
          <Link2
            v-else-if="customType === '链接下拉框'"
            :scope-list="scopeList"
            :custom-type="customType"
            :customname="fieldsfrom"
            :fields-options="fieldsOptions"
            :field-name="fieldName"
            @PleaseType="chType"
            @executeQueryCustomList="getqueryCustomList"
            @setFieldName="setFieldName"
          />

          <Checkbox
            v-else-if="customType === 'Checkbox'"
            :scope-list="scopeList"
            :custom-type="customType"
            :customname="fieldsfrom"
            :fields-options="fieldsOptions"
            :field-name="fieldName"
            @PleaseType="chType"
            @executeQueryCustomList="getqueryCustomList"
            @setFieldName="setFieldName"
          />

          <Dropdown
            v-else-if="customType === 'DropDown' || customType === '多选项'"
            :scope-list="scopeList"
            :custom-type="customType"
            :customname="fieldsfrom"
            :fields-options="fieldsOptions"
            :field-name="fieldName"
            @PleaseType="chType"
            @executeQueryCustomList="getqueryCustomList"
            @setFieldName="setFieldName"
          /> -->
          <div class="table">
            <el-button
              :loading="delLoad"
              type="text"
              :disabled="dbfields"
              @click="deleteAll()"
            >删除</el-button>
            <el-table
              :data="fieldsData"
              :header-cell-style="tableHeader"
              :cell-style="{padding: '0'}"
              align="left"

              style="width: 100%"
              @row-click="showfield"
              @selection-change="fieldsSelectionChange"
            >
              <el-table-column type="selection" width="35" />

              <!-- <el-table-column prop="fieldName"  /> -->
              <el-table-column label="字段名称">
                <template scope="scope">
                  <span>{{ scope.row.attributes.fieldNameCn }}</span>
                </template>
              </el-table-column>
              <!-- <el-table-column prop="type" label="类型" /> -->
              <el-table-column label="类型">
                <template scope="scope">
                  <span>{{ scope.row.attributes.fieldTypeCn }}</span>
                </template>
              </el-table-column>
              <!-- <el-table-column prop="scope" label="范围">
                <template slot-scope="scope">
                  <span>{{
                    translator($staticEnums.getBoolean(), scope.row.scope, true)
                  }}</span>
                </template>
              </el-table-column> -->
              <el-table-column label="范围">
                <template scope="scope">
                  <span
                    v-for="(item, index) in scope.row.componentAttributes"
                    :key="index"
                  >{{ item.scopeNameCn }}&#40;
                    {{ item.mandatory == true ? "必填" : "无" }} &#41;，</span>
                </template>
              </el-table-column>
              <!-- <el-table-column prop="mandatory" label="是否必填">
                <template slot-scope="scope">
                  <span>{{
                    translator(
                      $staticEnums.getBoolean(),
                      scope.row.mandatory,
                      true
                    )
                  }}</span>
                </template>
              </el-table-column> -->
              <!-- <el-table-column label="是否必填">
                <template scope="scope">
                  <span
                    v-for="(item, index) in scope.row.componentAttributes"
                    :key="index"
                    >{{ item.mandatory }}</span
                  >
                </template>
              </el-table-column> -->
              <el-table-column label="操作" height=20>
                <template slot-scope="scope">
                  <el-button
                    :loading="delLoad"
                    type="text"
                    class="table-btn"
                    @click.stop="delfield(scope.row)"
                  >删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <pagination
              v-show="fieldsTotal > 0"
              :total="fieldsTotal"
              :page.sync="fieldsQuery.pageNum"
              :limit.sync="fieldsQuery.pageSize"
              @pagination="getqueryCustomList"
            />
            <!-- <el-pagination
              background
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="fieldsQuery.pageNum"
              :page-sizes="[5, 10, 20, 50]"
              :page-size="fieldsQuery.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="fieldsTotal"
            >
            </el-pagination> -->
          </div>
        </div>
        <!-- 自定义字段 -->
      </el-tab-pane>
      <el-tab-pane label="系统字段" name="4">
        <System :param-value="propSystem" />
      </el-tab-pane>
      <el-tab-pane label="视图管理" name="5">
        <ViewPage v-if="activeName === '5'" />
      </el-tab-pane>
      <el-tab-pane label="在线报表" name="6">
        <Dashboard v-if="activeName === '6'" />
      </el-tab-pane>
      <el-tab-pane label="我的账户" name="7">
        <MyAccount v-if="activeName === '7'" />
      </el-tab-pane>
      <el-tab-pane label="服务计划" name="8">
        <ServicePlan v-if="activeName === '8'" />
      </el-tab-pane>

       <el-tab-pane label="自定义字段设置" name="9">
              <add-custom-field-value> </add-custom-field-value>
            </el-tab-pane>

    </el-tabs>
  </div>
</template>
<script>
import {
  message,
  formatChangedPara,
  customradioData,
  customtextData
} from '@/utils/common'
import Jurisdiction from '@/views/adminCenter/jurisdiction'
import System from '@/views/adminCenter/system'
import Dashboard from '@/views/adminCenter/dashboard'
import ViewPage from '@/views/project/view'
import MyAccount from '@/views/adminCenter/myAccount'
import Dateindex from '@/views/adminCenter/date'
import CustomFFields from '@/views/adminCenter/customFFields'
import CustomFieldSetting from '@/views/adminCenter/customFieldSetting.vue'
// import Radioindex from '@/views/adminCenter/radio'
// import Textindex from '@/views/adminCenter/text'
// import Memoindex from '@/views/adminCenter/memo'
// import Dropdown from '@/views/adminCenter/dropDown'
// import Checkbox from '@/views/adminCenter/checkbox'
// import Userindex from '@/views/adminCenter/user'
// import Link from '@/views/adminCenter/link'
// import Link2 from '@/views/adminCenter/link2'
import ServicePlan from '@/views/servicePlan/index'


// Start - below for indenpent tabs
import UserPage from '@/views/user/index'
import AddCustomFieldValue from '@/views/settingCenter/dropDownSetting/index'
import CustomField from '@/views/adminCenter/customFFields'
//End-below for indenpent tabs

import {
  queryForProjectTitles,
  createSubUser,
  deleteSubUser,
  updateSubUser,
  getSysCustomField
} from '@/api/admincenter'
import {
  queryCustomList,
  queryFieldRadioById,
  deleteCustomRadio,
  queryFieldTextById,
  deleteCustomText,
  queryFieldDropDownById,
  deleteCustomDropDown
} from '@/api/customField'
import { deleteApi, getInfo, fieldList } from '@/api/customFFields'
import customFieldSettingVue from './customFieldSetting.vue'
// import {
//   fieldTypeAPI,
//   RangeS,
//   fieldList,
//   getInfo,
//   add,
//   systemListAPI,
//   downMenuAPI,
// } from "@/api/customFFields";
export default {
  name: 'Admincenter',
  components: {
    Jurisdiction,
    Dateindex,
    // Radioindex,
    // Textindex,
    // Memoindex,
    // Dropdown,
    System,
    // Checkbox,
    // Userindex,
    // Link,
    // Link2,
    Dashboard,
    ViewPage,
    MyAccount,
    ServicePlan,
    CustomFFields,
    CustomFieldSetting,
    UserPage,
    AddCustomFieldValue,
    CustomField
  },
  data() {
    return {
      activeName: '0',
      propSystem: '',
      tableHeader: {
        color: '#d4dce3',
        background: '#4286CD'
      },
      accountTempForm: {},


      userinfo: {},
      // 父传子数据
      fieldsfrom: {
        type: 'radio'
      },
      textfrom: {},
      // 子传父数据
      customType: 'radio',

      // 自定义字段表格数据
      fieldsData: [],
      fieldsTotal: 0,
      fieldsSelection: [], // 选择的表格
      dbfields: true, // 非多个禁用
      fieldsQuery: {
        pageNum: 1,
        pageSize: 10
      },
      fieldsId: {
        projectId: ''
      },
      fieldName: '',
      scopeList: [],
      fieldsOptions: [
        {
          value: 'DropDown',
          label: '下拉框'
        },
        {
          value: 'text',
          label: '文本'
        },
        {
          value: 'RichText',
          label: '备注'
        },
        {
          value: 'Checkbox',
          label: '复选框'
        },
        {
          value: 'radio',
          label: '单选框'
        },
        {
          value: '链接',
          label: '链接'
        },
        {
          value: '链接下拉框',
          label: '链接下拉框'
        },
        {
          value: '多选项',
          label: '多选项'
        },
        {
          value: '用户',
          label: '用户'
        },
        {
          value: '日期',
          label: '日期'
        }
      ],

      rowData: {},
      delLoad:false

    }
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      // 新增项目到自定义字段
      if (to.query.par) {
        if (
          from.name === 'Addproject' ||
          from.name === 'Addfeature' ||
          from.name === 'Addsprint' ||
          from.name === 'Addtestcycle' ||
          from.name === 'Addissue' ||
          from.name === 'Addtestcase'
        ) {
          vm.activeName = '4'
          vm.propSystem = to.query.par
        }
      } else {
        if (
          from.name === 'Addproject' ||
          from.name === 'Addfeature' ||
          from.name === 'Addsprint' ||
          from.name === 'Addtestcycle' ||
          from.name === 'Addissue' ||
          from.name === 'Addtestcase'
        ) {
          vm.activeName = '3'
        }
      }
      if (to.params.id === '6') {
        vm.activeName = '6'
      }
    })
  },
  computed: {
    projectInfo() {
      return this.$store.state.user.userinfo
    }
  },
  watch: {
    'fieldsfrom.type': function (val) {
      this.chType(val)
      // this.PleaseType(val)
    },
    'fieldsfrom.fieldName': function (val) {
      if (val) {
        this.fielddisabled = false
      } else {
        this.fielddisabled = true
      }
    }
  },
  mounted() {
    this.fieldsId.projectId = this.projectInfo.userUseOpenProject.projectId

    //this.getProject();
    this.getqueryCustomList()
    // this.getSysCustomFieldByScope()
    // this.getSysCustomFieldByType()
    this.$refs.UserPage.init();
  },
  methods: {
    clickTab(tab, event){
      const init = tab['$children'][0].init;
      if(init){
        init();
      }
    },
    // 权限管理，左侧选择用户
    userChange(user) {},
    async getSysCustomFieldByType() {
      const params = {
        fieldName: 'type'
      }
      const res = await getSysCustomField(params)
      if (res.code === '200') {
        console.log('getSysCustomFieldByType--', res)
        /* res.data.mergeValues.forEach(item => {
          const obj = {
            value: item,
            label: item
          }
          this.fieldsOptions.push(obj)
        }) */
      }
    },
    async getSysCustomFieldByScope() {
      const params = {
        fieldName: 'scope'
      }
      const res = await getSysCustomField(params)
      if (res.code === '200') {
        console.log('getSysCustomFieldByScope---', res)
        this.scopeList = res.data.mergeValues
        /* res.data.mergeValues.forEach(item => {
          const obj = {
            value: item,
            label: item
          }
          this.fieldsOptions.push(obj)
        }) */
      }
    },
    setFieldName(data) {
      this.fieldName = data
    },
    handleClick(val) {
      if (val === '4') {
        if (!this.projectInfo.userUseOpenProject.projectId) {
          message('error', '请先选择项目')
          // throw new Error('')
        }
      }
    },

    /** 自定义字段 开始 */
    // 获取子类的传值
    chType(type) {
      this.fieldsfrom.type = type;
      this.customType = type;
    },

    // 获取自定义字段列表
    getqueryCustomList() {
        // 字段列表接口
        fieldList({
          projectId: sessionStorage.getItem('projectId'),
          pageNum: this.fieldsQuery.pageNum,
          pageSize: this.fieldsQuery.pageSize,
        }).then((res) => {
          this.fieldsData = res.data;
          // this.fieldsTotal = res.total;
          this.fieldsTotal = res.total;
          // this.$emit("fieldsList", this.fieldsList);
        });
      // queryCustomList(this.fieldsId, this.fieldsQuery).then((res) => {
      //   console.log(res,'ssssssssssss');
      //   if (res.code === "200") {
      //     // this.fieldsData = res.data;
      //     this.fieldsTotal = res.total;
      //   }
      // });
    },
    handleSizeChange(val) {
      this.fieldsQuery.pageSize = val;
      this.fieldsQuery.pageNum = 1;
      // 这里的方法是切换每页数据条数或者切换页码后对table数据的更新

      // 方法里面是赋值给tableData的后台接口数据
      this.getqueryCustomList();
    },
    // 切换页码
    handleCurrentChange(val) {
      this.fieldsQuery.pageNum = val;
      // 这里的方法是切换每页数据条数或者切换页码后对table数据的更新

      // 方法里面是赋值给tableData的后台接口数据
      this.getqueryCustomList();
    },

    // 删除radio类型
    delradio(id) {
      deleteCustomRadio(id).then((res) => {
        if (res.code === "200") {
          message("success", res.msg);
          this.getqueryCustomList();
        }
      });
    },
    // 删除text，Remarks备注类型
    deltext(id) {
      deleteCustomText(id).then((res) => {
        if (res.code === "200") {
          message("success", res.msg);
          this.getqueryCustomList();
        }
      });
    },
    // 删除dropDown备注类型
    deldropDown(id) {
      deleteCustomDropDown(id).then((res) => {
        if (res.code === "200") {
          message("success", res.msg);
          this.getqueryCustomList();
          console.log("删除dropDown备注类型");
        }
      });
    },
    // 查看字段详情
    showfield(row) {
      console.log(row, "rowrow");
      this.rowData = row;
      // 类型不同，查询接口不同
      // if (row.type === "text" || row.type === "memo") {
      //   this.gettextInfo(row.id);
      // } else if (row.type === "radio") {
      //   this.getradioInfo(row.id);
      // } else if (row.type === "DropDown") {
      //   this.getdropdownInfo(row.id);
      // }
    },
    // 获取radio详情
    getradioInfo(id) {
      queryFieldRadioById(id).then((res) => {
        if (res.code === "200") {
          const data = customradioData(res.data);
          this.fieldsfrom = data;
        }
      });
    },
    // 获取text，Remarks详情
    gettextInfo(id) {
      queryFieldTextById(id).then((res) => {
        const data = customtextData(res.data);
        this.fieldsfrom = data;
      });
    },

    // 获取dropdown详情
    getdropdownInfo(id) {
      queryFieldDropDownById(id).then((res) => {
        const data = customtextData(res.data);
        this.fieldsfrom = data;
        console.log("获取dropdown详情");
      });
    },
    // 批量选取字段
    fieldsSelectionChange(val) {
      this.fieldsSelection = [];
      val.forEach((item) => {
        this.fieldsSelection.push(item.customFieldId.toString());
      });
      console.log(this.fieldsSelection, "批量字段");
      this.dbfields = !val.length;
    },
    // 单独删除自定义字段
    delfield(row) {
      this.delLoad = true
      let arr = [];
      arr.push(row.customFieldId.toString());
      deleteApi(arr).then((res) => {
        console.log(res);
        if (res.code == 200) {
          console.log(res);
          this.$message({
            message: res.msg,
            type: "success",
          });
          this.getqueryCustomList()
          // this.$refs.APIFn.APIFn();
          this.delLoad = false
        } else {
          this.$message({
            message: res.msg,
            type: "error",
          });
        }
      });
      // if (row.type === "text" || row.type === "memo") {
      //   this.deltext(row.id);
      // } else if (row.type === "radio") {
      //   this.delradio(row.id);
      // } else if (row.type === "DropDown") {
      //   this.deldropDown(row.id);
      // }
    },
    // 批量删除字段
    deleteAll() {
      this.delLoad = true
      deleteApi(this.fieldsSelection).then((res) => {
        if (res.code == 200) {
          this.$message({
            message: res.msg,
            type: "success",
          });
          this.getqueryCustomList()
          // this.$refs.APIFn.APIFn();
          this.delLoad = false
        } else {
          this.$message({
            message: res.msg,
            type: "error",
          });
        }
      });
    },
    PleaseType(val) {
      this.customType = val;
    },
    // 自定义字段 结束
    //--------
    // 显示权限tab
    jurisdictionChange(jurisdiction){
      this.activeName = "1"
      this.jurisdictionAccount = jurisdiction
    }
  },
};
</script>
<style lang="scss">
@import "@/styles/mixin.scss"; //颜色
@import "@/styles/color.scss"; //按钮
//标签页切换样式
.el-tabs {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  .el-tabs__item.is-active,
  .el-tabs__item:hover {
    color: $btnbgcolor;
  }
  .el-tabs__active-bar {
    background-color: $btnbgcolor;
  }
  .el-tabs__item {
    height: 25px;
    line-height: 14px;
  }
  .el-tabs__content {
    flex: 1;
    width: 100%;
    overflow: hidden;
    .el-tab-pane {
      width: 100%;
      height: 100%;
      overflow: hidden;
    }
  }
}
</style>
<style lang="scss" scoped>
@import "index.scss";
// @import "field.scss";
</style>
<style lang="scss">
.admin-center {
  width: 100%;
  height: calc(100vh - 61px);
  box-sizing: border-box;
  padding: 20px;
  overflow: hidden;
  .el-form-item .el-form-item__label {
    padding-right: 8px;
  }
  .demo-ruleForm {
    .el-form-item__label {
      //width: 110px!important;
    }
    .el-form-item__content {
      //margin-left: 110px!important;
    }
  }
}
</style>
