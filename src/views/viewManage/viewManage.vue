<template>
  <div class="app-container manage-view view">
    {{ form }}
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      label-width="100px"
      class="demo-ruleForm"
    >
      <div class="btns">
        <!-- 表单标题form.title为空时，新增按钮禁止点击 -->
        <el-button
          v-if="!form.id"
          type="primary"
          :disabled="!form.title"
          @click.stop="submitForm('add')"
          >新增-from</el-button
        >
        <el-button v-if="!form.id" type="primary" @click.stop="waiveForm"
          >取消</el-button
        >
        <el-button
          v-if="form.id"
          type="primary"
          @click.stop="submitForm('edit')"
          >确定修改</el-button
        >
        <el-button v-if="form.id" type="primary" @click.stop="cancelUpdate"
          >取消修改</el-button
        >
      </div>
      <div class="scopeView form-line-3">
        <el-form-item label="视图标题：" prop="title" class="form-small">
          <el-input v-model="form.title" size="small" />
        </el-form-item>

        <!-- 范围选择框 -->
        <el-form-item label="范围：" class="form-small">
          <el-select
            v-model="scopeSelvalue"
            value-key="label"
            size="small"
            :disabled="scopeDis"
            ref="select"
            placeholder="请选择适用范围"
            @change="viewScopeChildParams"
          >
            <el-option
              v-for="item in scopeOptions"
              :key="item.scopeId"
              :label="item.label"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <!-- 范围选择框 -->

        <el-form-item label="父级视图：" prop="parentId" class="form-small">
          <el-select
            :disabled="form.isAuto == 1"
            v-model="form.parentId"
            clearable
            size="small"
            filterable
            placeholder="请选择父级视图"
            @change="parentViewChange"
            @clear="clearParentView"
          >
            <el-option
              v-for="i in viewParents"
              :key="i.id"
              :label="i.title"
              :value="i.id"
            />
          </el-select>
        </el-form-item>
      </div>
      <div class="form-line-1">
        <el-form-item
          label="自动创建子视图基于选项值:"
          prop="isAuto"
          class="form-small"
        >
          <el-checkbox
            :disabled="form.parentId !== ''"
            v-model="form.isAuto"
            true-label="1"
            false-label="0"
            @change="autoCreateChange"
          />
        </el-form-item>
      </div>
      <div class="form-line-1">
        <el-form-item label="查询条件：">
          <div class="filter-item">
            <!-- 添加条件 -->
            <span v-if="!addfilter" @click="addFilter">
              <i class="el-icon-circle-plus circle" />
            </span>
            <!-- 没有选择自动创建时 选择条件 -->
            <div class="oneFilters" v-if="addfilter && form.isAuto == 0">
              <div v-for="(item, index) in form.oneFilters" :key="index">
                <el-row v-if="index !== 0">
                  <el-col :span="1">~</el-col>
                  <el-col :span="2">
                    <el-radio-group v-model="item.andOr">
                      <el-radio label="and">并且</el-radio>
                      <el-radio label="or">或者</el-radio>
                    </el-radio-group>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="1">
                    <span>
                      <i
                        class="el-icon-circle-plus circle"
                        @click="addCondition"
                      />
                    </span>
                    <span>
                      <i
                        class="el-icon-remove circle remove"
                        @click="removeCondition(index)"
                      />
                    </span>
                  </el-col>
                  <el-col :span="4">
                    <el-select
                      v-model="filterSelValue[index]"
                      value-key="fieldNameEn"
                      size="small"
                      placeholder="请选择字段"
                      @change="filterChange($event, index)"
                    >
                      <el-option
                        v-for="i in scopeDownChildParams"
                        :key="i.fieldNameEn"
                        :label="i.fieldNameCn"
                        :value="i"
                      />
                    </el-select>
                    <!-- <el-select v-model="filterSelValue[index]" value-key="fieldNameEn" size="small" placeholder="请选择字段"
										@change="filterChange($event, index)" v-if="!resolveView">
										<el-option v-for=" i  in  scopeDownChildParams " :key="i.fieldNameEn" :label="i.fieldNameCn"
											:value="computedValue(i)" />
									</el-select> -->
                  </el-col>
                  <!-- 选择了字段后出现 第二个条件-->
                  <el-col :span="4" v-show="item.type">
                    <el-select
                      v-model="item.condition"
                      size="small"
                      placeholder="请选择条件"
                    >
                      <el-option
                        v-for="i in conditionList"
                        :key="i.value"
                        :label="i.nameCn"
                        :value="i.scopeName"
                      />
                    </el-select>
                  </el-col>
                  <!-- 选择了条件后且条件部位空或不为空时 -->
                  <el-col :span="4" v-show="item.condition !== 'ey'">
                    <!-- 下拉框 -->
                    <el-select
                      v-if="
                        item.fieldType === 'number' ||
                        item.fieldType === 'dropDown' ||
                        item.fieldType === 'multiList' ||
                        item.fieldType === 'linkedMoudue' ||
                        item.fieldType === 'userList'
                      "
                      v-model="item.sourceVal"
                      clearable
                      size="small"
                      placeholder="请选择状态"
                    >
                      <el-option
                        v-for="i in filterSelValue[index].possibleValue"
                        :key="i.optionValue"
                        :label="i"
                        :value="i"
                      />
                    </el-select>
                    <!-- 链式下拉框 -->
                    <el-cascader
                      v-else-if="item.fieldType === 'linkedDropDown'"
                      v-model="item.sourceVal"
                      :options="filterSelValue[index].possibleValue"
                    />
                    <!-- 当选择的类型为日期时,第3个查询条件框出现日期选择框 -->
                    <el-date-picker
                      v-else-if="item.fieldType === 'Date'"
                      v-model="item.sourceVal"
                      type="date"
                      placeholder="选择日期"
                      placement="bottom-start"
                    >
                    </el-date-picker>
                    <!-- 其他出现输入框 -->
                    <el-input
                      v-else
                      v-model="item.sourceVal"
                      size="small"
                      v-show="item.condition !== ''"
                    />
                  </el-col>
                </el-row>
              </div>
            </div>
            <!-- 自动创建子视图下拉框 -->

            <el-select
              v-if="addfilter && form.isAuto == 1"
              v-model="filterSelValue"
              value-key="fieldNameEn"
              size="small"
              placeholder="请选择字段"
              @change="filterChange"
            >
              <el-option
                v-for="i in scopeDownChildParams"
                :key="i.fieldNameEn"
                :label="i.fieldNameCn"
                :value="i"
              />
            </el-select>
          </div>
        </el-form-item>
      </div>
      <div class="form-line-1">
        <el-form-item label="视图状态:" prop="isPrivate" class="form-small">
          <el-radio v-model="form.isPrivate" label="1">仅自己</el-radio>
          <el-radio v-model="form.isPrivate" label="0">公开</el-radio>
        </el-form-item>
      </div>
    </el-form>

    <div class="table">
      <!-- 刷新&批量删除 -->
      <el-button type="text" @click="viewjectRefresh">刷新</el-button>
      <el-button type="text" :disabled="multiple" @click="delview('all')"
        >批量删除</el-button
      >
      <!-- 刷新&批量删除 -->

      <!-- 查询条件表格 -->
      <el-table
        ref="viewData"
        :data="viewData"
        :header-cell-style="tableHeader"
        stripe
        style="width: 100%"
        @row-click="toEdit"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />

        <el-table-column
          prop="title"
          :show-overflow-tooltip="true"
          align="left"
          width="155"
          :label="$t('lang.CommonFiled.Title')"
        >
          <template slot-scope="scope">
            <span class="title">
              {{ scope.row.title }}
            </span>
          </template>
        </el-table-column>

        <el-table-column prop="scope" label="范围">
          <template slot-scope="scope">
            {{ scope.row.scopeName }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="视图状态">
          <template slot-scope="scope">
            {{ scope.row.isPrivate ? "仅自己" : "公开" }}
          </template>
        </el-table-column>
        <el-table-column prop="parentTitle" label="父级视图" />
        <el-table-column prop="creater" label="创建者" />
        <el-table-column prop="createTime" label="创建日期" />
        <el-table-column prop="updateUser" label="修改者" />
        <el-table-column prop="updateTime" label="修改日期" />
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              type="text"
              class="table-btn"
              @click.stop="delview(scope.row.id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- 查询条件表格 -->

      <!-- 分页 -->
      <pagination
        v-show="viewTotal > 0"
        :total="viewTotal"
        :page.sync="viewQuery.pageNum"
        :limit.sync="viewQuery.pageSize"
        @pagination="getqueryViews"
      />
      <!-- 分页 -->
    </div>
  </div>
</template>
<script>
import { message, returntomenu, formatChangedPara } from "@/utils/common";

import { getFilterCondition } from "@/api/customFFields";
import {
  getQueryViewParents,
  queryViews,
  lookView,
  addViewRE,
  updateView,
  deleteView,
  getViewScopeChildParams,
  getViewAllScopeParams,
  queryViewParents,
} from "@/api/view.js";

import { mapState } from "vuex";

export default {
  name: "viewManage",
  data() {
    return {
      aaa: "",
      // 范围 选项
      scopeOptions: [
        {
          label: "项目",
          scopeId: "1000001",
          scopeName: "项目",
        },
        {
          label: "故事",
          scopeId: "2000001",
          scopeName: "故事",
        },
        {
          label: "测试用例",
          scopeId: "3000001",
          scopeName: "测试用例",
        },
        {
          label: "测试周期",
          scopeId: "5000001",
          scopeName: "测试周期",
        },
        {
          label: "缺陷",
          scopeId: "7000001",
          scopeName: "缺陷",
        },
        {
          label: "迭代",
          scopeId: "8000001",
          scopeName: "迭代",
        },
      ],
      // 当前页面的scope
      scope: "",
      scopeDownChildParams: [],
      statusDownChildParams: [],
      savedisabled: true,
      //添加,修改表单
      form: {
        isPrivate: "1",
        level: 0,
        parentId: "",
        isAuto: 0,
        oneFilters: [],
        auto_filter: "",
        scopeId: "",
        scopeName: "",
        title: "",
      },
      scopeSelvalue: "",
      filterSelValue: "",
      filterConditionList: [],
      //是否显示选择条件下拉框
      addfilter: false,
      formTemp: {},
      scopeDis: false,
      rules: {
        title: [
          {
            required: true,
            message: "请输入视图名称",
            trigger: "blur",
          },
        ],
      },
      tableHeader: {
        color: "#d4dce3",
        background: "#4286CD",
      },

      viewQuery: {
        pageNum: 1,
        pageSize: 20,
      },
      viewBody: {
        scopeName: "",
        projectId: "",
      },
      viewParents: [],
      viewTotal: 0,
      viewData: [], // 表格数据
      multipleSelection: [], // 选择的表格
      multiple: true, // 非多个禁用
      viewId: "",
      conditionList: [],
      filter: false,
      isClick: false,
      resolveView: true,
    };
  },
  mounted: function () {
    this.$nextTick(function () {
      // 仅在整个视图都被渲染之后才会运行的代码
      let id = this.scopeOptions.findIndex(
        (item) => item.scopeId === this.nvaName
      );
      this.form.scopeName = this.scopeOptions[id].label;
      this.form.scopeId = this.scopeOptions[id].scopeId;
      this.scopeSelvalue = this.scopeOptions[id];
      this.scopeSelvalue.selected = true;
      this.viewScopeChildParams(this.scopeOptions[id]);
    });
  },

  watch: {
    filterConditionList: function (val) {
      console.log("list", val);
    },
    conditionList: function (val) {
      console.log("conlist", val);
    },
    filterSelValue: function (val) {
      console.log("selvalue", val);
    },
    isClick: function (val) {
      console.log("isClick", val);
    },
  },
  computed: {
    ...mapState({
      nvaName: (state) => state.common.nvaName,
    }),

    projectInfo() {
      return this.$store.state.user.userinfo;
    },

    //条件下拉框 选项
    filedChildParams() {
      if (this.form.isAuto == 1) {
        return this.scopeDownChildParams.filter(
          (item) =>
            item.fieldType === "dropDown" ||
            item.fieldType === "userList" ||
            item.fieldType === "number"
        );
      } else {
        return this.scopeDownChildParams;
      }
    },
  },

  async created() {
    // this.viewBody.scope = this.$route.query.scope
    this.viewBody.projectId = this.projectInfo.userUseOpenProject.projectId;
    await this.initScope();
    await this.getqueryViews(); // 获取视图
    // this.getViewFilter()
  },
  methods: {
    computedValue(i) {
      // 在这里根据 i 计算 value 的值
      // 例如，如果你想要 value 是 i.fieldNameEn 和 i.fieldNameCn 的拼接，你可以这样写：
      if (this.isClick) return i.fieldNameCn;
      {
        return i;
      }
    },
    // 新增视图
    submitForm(action) {
      if (this.form.isAuto == 0 && this.form.oneFilters !== "") {
        this.form.oneFilters.forEach((item, index) => {
          item.id = index;
        });
      }
      if (action === "add") {
        this.$refs["form"].validate((valid) => {
          addViewRE(this.form).then((res) => {
            if (res.code === "200") {
              this.resetForm();
              message("success", res.msg);
              this.getqueryViews();
              this.filter = false;
              console.log(11111, this.res);
            }
          });
        });
      } else if (action === "edit") {
        updateView(this.form).then((res) => {
          if (res.code === "200") {
            this.resetForm();
            message("success", res.msg);
            this.getqueryViews();
            this.filter = false;
          } else {
            message("success", res.msg);
          }
        });
      }
    },
    // 取消
    waiveForm() {
      returntomenu(this, 1000);
    },
    // 取消修改
    cancelUpdate() {
      this.$refs.viewData.clearSelection();
      this.resetForm();
      this.form = {
        isPrivate: "1",
        level: 0,
        parentId: "",
        isAuto: 0,
        oneFilters: [],
        auto_filter: "",
        scopeId: "",
        scopeName: "",
        title: "",
      };
    },
    // 重置表单
    resetForm() {
      this.scopeDis = false;
      this.filterConditionList = [];
      this.scopeSelvalue = [];
      this.viewParents = [];
      this.filterSelValue = [];
      this.addfilter = false;
      this.$refs["form"].resetFields();
    },
    // 初始化scope
    initScope() {
      this.scopeObj = this.scopeOptions.filter((item) => {
        return item.scopeId === this.nvaName;
      });
      if (this.scopeObj) {
        this.viewBody.scopeName = this.scopeObj[0].scopeName;
      } else {
        this.viewBody.scopeName = "project";
      }
    },
    // view视图列表
    getqueryViews() {
      // initScopeName()
      return new Promise((resolve, reject) => {
        queryViews(this.viewBody, this.viewQuery).then((res) => {
          if (res.code === "200") {
            console.log("res: ", res);
            this.viewData = res.data.list;
            this.viewTotal = res.data.total;
            console.log("viewData: ", this.viewData);
            resolve(res);
          }
        });
      });
    },

    //范围修改时获取参数
    async viewScopeChildParams(selVal) {
      console.log("执行修改范围...");

      this.form.oneFilters.splice(0, 1);

      if (this.filterSelValue.length > 1) {
        await this.$confirm("重新选择可能会丢失页面内容请确认？", {
          title: "提示",
          showCancelButton: true,
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).catch((e) => {
          return;
        });
      }

      this.form.scopeId = selVal.scopeId;
      this.form.scopeName = selVal.scopeName;
      this.addfilter = false;
      const scope = {
        scopeId: this.form.scopeId,
      };
      const params = {
        scope: this.form.scopeName,
        projectId: this.projectInfo.userUseOpenProject.projectId,
      };
      //获取
      getViewAllScopeParams(
        scope,
        this.projectInfo.userUseOpenProject.projectId
      ).then((res) => {
        this.scopeDownChildParams = res.data;
        console.log("scopeDownChildParams :", params.projectId);
      });
      //过滤条件参数
      getFilterCondition(scope).then((res) => {
        this.conditionList = res.data;
        console.log("conditionList", this.conditionList);
      });
      //获取父视图参数
      await getQueryViewParents(params).then((response) => {
        this.viewParents = response.data || [];
      });
    },

    //父视图下拉框被选择时
    parentViewChange() {
      this.form.level = 1;
      this.form.isAuto = 0;
    },

    //清空父视图
    clearParentView() {
      this.form.level = 0;
      this.form.isAuto = 0;
      this.addfilter = false;
    },

    //自动创建子视图改变时
    autoCreateChange() {
      if (this.form.isAuto) {
        if (this.form.scopeId === "") {
          message("warning", "请选择范围");
          return;
        }
        this.form.level = 0;
        this.addfilter = false;
      }
    },

    //添加条件
    addFilter() {
      if (this.form.scopeId === "") {
        message("warning", "请选择范围");
        return;
      }
      this.addfilter = true;
      this.filterSelVal = "";
      if (this.form.isAuto == 0) {
        const form = {
          id: "",
          andOr: "",
          type: "",
          customFieldId: "",
          fieldNameEn: "",
          fieldType: "",
          condition: "",
          sourceVal: "",
        };
        this.form.oneFilters.push(form);
        this.filterSelValue = [{}];
        this.filterConditionList = [[]];
        this.form.auto_filter = "";
      } else {
        this.form.oneFilters = [];
        this.filterSelValue = [];
        this.filterConditionList = [];
        this.form.auto_filter = [];
      }
    },

    // 格式化链式下拉框数据
    convertData(data) {
      return data.flatMap((item) => {
        const { others, ...categories } = item;
        return Object.entries(categories).map(([key, values]) => {
          return {
            value: key,
            label: key,
            children: Array.isArray(values)
              ? values.map((value) => ({
                  value,
                  label: value,
                  ...others,
                }))
              : [],
          };
        });
      });
    },

    //条件字段下拉框被选择
    filterChange(selVal, index) {
      this.isClick = false;
      this.resolveView = false;
      console.log("条件: ", selVal, index, this.filterSelValue);
      if (selVal.fieldType) {
        const form = {
          type: selVal.type,
          fieldNameEn: selVal.fieldNameEn,
          fieldNameCn: selVal.fieldNameCn,
        };

        // 如果type为custom 需要customFieldId
        if (selVal.type === "custom") {
          form.customFieldId = selVal.customFieldId;
        } else {
          form.customFieldId = "";
        }
        // 如果没有选择自动创建子视图，需要fieldType, 给form.onefilter[index]赋值
        if (this.form.isAuto == 0) {
          form.fieldType = selVal.fieldType;
          Object.assign(this.form.oneFilters[index], form);
          if (selVal.possibleValue) {
            if (typeof selVal.possibleValue === "string") {
              selVal.possibleValue = JSON.parse(selVal.possibleValue);
            }
            if (selVal.fieldType === "linkedDropDown") {
              selVal.possibleValue = this.convertData([selVal.possibleValue]);
            }
          }
          this.filterCondition(selVal.fieldType, index);
        }

        // 如果选择自动创建子视图， 给form.auto_filter赋值
        else {
          this.form.oneFilters = [];
          this.form.auto_filter = [];
          this.form.auto_filter.push(form);
        }
      }
    },
    //当条件的filedType 为 checkbox和 radio，conditon的选项只显示 为空，不等于和 等于
    filterCondition(fieldType, index) {
      console.log("07");
      if (fieldType === "radio" || fieldType === "checkbox") {
        console.log("08");
        this.conditionList.forEach((item) => {
          if (
            item.nameCn === "为空" ||
            item.nameCn === "等于" ||
            item.nameCn === "不等于"
          ) {
            this.filterConditionList[index].push(item);
          }
        });
      } else {
        console.log("09", this.filterConditionList);
        this.filterConditionList[index] = this.conditionList;
      }
    },
    //增加查询条件
    addCondition() {
      const form = {
        id: "",
        andOr: "",
        type: "",
        customFieldId: "",
        fieldNameEn: "",
        fieldType: "",
        condition: "",
        sourceVal: "",
      };
      this.form.oneFilters.push(form);
      this.filterSelValue.push({});
      this.filterConditionList.push([]);
    },

    //移除查询条件
    removeCondition(index) {
      this.form.oneFilters.splice(index, 1);
      this.filterSelValue.splice(index, 1);
      this.filterConditionList.splice(index, 1);
      if (this.filterSelValue.length === 0) {
        this.addfilter = false;
      }
    },

    // 刷新view
    async viewjectRefresh() {
      const res = await this.getqueryViews();
      if (res.code === "200") {
        message("success", "刷新成功");
      }
    },
    // 删除view
    delview(id) {
      if (id === "all") {
        message("error", "暂未开发");
        return;
      }
      deleteView(id).then((res) => {
        message("success", res.msg);
        this.getqueryViews();
        this.cancelUpdate();
      });
    },
    // 表格多选
    async handleSelectionChange(val) {
      val.length == 1 && val[0].oneFilters.length
        ? val[0].oneFilters[0].fieldNameEn
          ? (this.form.oneFilters = JSON.parse(val[0].filter))
          : (this.form.oneFilters = [
              {
                id: "",
                andOr: "",
                type: "",
                customFieldId: "",
                fieldNameEn: "",
                fieldType: "",
                condition: "",
                sourceVal: "",
              },
            ])
        : "";
      if (val.length == 1) {
        this.form.oneFilters.forEach((item) => {
          delete item.fieldNameEnCamelCase;
        });
        this.form.isPrivate = val[0].isPrivate.toString();
        this.addfilter = true;
        this.filterSelValue = [{}];
        this.form.auto_filter = "";
        let id = this.scopeOptions.findIndex(
          (item) => item.scopeName === val[0].scopeName
        );
        this.form.scopeName = this.scopeOptions[id].scopeName;
        this.form.scopeId = this.scopeOptions[id].scopeId;
        this.scopeSelvalue = this.scopeOptions[id];
        this.scopeSelvalue.selected = true;
        this.form.title = val[0].title;
        //表格单击选中时查询条件渲染

        this.isClick = true;
      }

      this.multipleSelection = val;
      this.multiple = !val.length;
    },

    //视图修改
    async toEdit(row) {
      console.log("修改查询条件数据...");
      console.log("row", row);
      
      this.isClick = true;
      this.resetForm();
      this.form.id = row.id;
      this.form.isPrivate = row.isPrivate.toString();
      this.$refs.viewData.clearSelection();
      this.form.scopeName = row.scopeName;
      this.$refs.viewData.toggleRowSelection(row);
      console.log(row, "filter");
      this.form.title = row.title;
      row.filter.length
        ? (this.form.oneFilters = JSON.parse(row.filter))
        : (this.form.oneFilters = [
            {
              id: "",
              andOr: "",
              type: "",
              customFieldId: "",
              fieldNameEn: "",
              fieldType: "",
              condition: "",
              sourceVal: "",
            },
          ]);
      this.form.oneFilters.forEach((item) => {
        delete item.fieldNameEnCamelCase;
      });
      this.scopeSelvalue = this.scopeObj[0];
      await this.viewScopeChildParams(this.scopeObj[0]);
      if (row.parentId !== "") {
        this.parentViewChange();
        this.form.parentId = row.parentId;
      }
      this.addfilter = true;
      this.filterSelValue = [{}];
      this.form.auto_filter = "";
    },
  },
};
</script>

<style lang="scss">
.view {
  .wd200 {
    .el-form-item__label {
      width: 200px !important;
    }
  }

  .el-checkbox__input {
    .el-checkbox__inner {
      border-radius: 100%;

      &:after {
        width: 4px;
        height: 4px;
        border-radius: 100%;
        background-color: #fff;
        content: "";
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%) scale(1);
        transform: translate(-50%, -50%) scale(1);
      }
    }
  }

  .el-checkbox__input.is-checked {
    .el-checkbox__inner {
      border-color: #4286cd;
      background: #4286cd;
    }
  }

  .el-form-item {
    .el-form-item__label {
      padding-right: 8px;
    }
  }

  .table {
    width: 100%;
  }
}

/*表单行样式 */
.form-line-3 {
  display: flex;
  margin-top: 20px;
  .el-form-item {
    display: flex;
    margin-right: 5%;
    label {
      padding-right: 0;
      width: auto !important;
    }
    .el-form-item__content {
      margin-left: 0 !important;
    }
  }
}

.form-line-1 {
  .el-form-item {
    label {
      width: auto !important;
    }
  }
}

/*查询条件表单 */
.el-col-4 {
  margin-right: 20px;
}
</style>
