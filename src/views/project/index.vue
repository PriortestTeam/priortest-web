<template>
  <div class="project-container app-container">
    <div class="showBtn" v-if="treeCol==0" @click="hadleTreeshow"><i class="el-icon-d-arrow-right"></i></div>
    <el-row>
      <el-col :span="treeCol">
     
        <view-tree @hadleTree="hadleTreeshow"
          :key="timer"
          :childScope="currentScope"
          v-on:childByValue="childByValue"
        ></view-tree>
      </el-col>

      <el-col :span="24-treeCol"
        ><div class="project_table">
          <div class="new_project">
            <el-button type="primary" round @click="newproject">
              新建项目
            </el-button>
          </div>
          <div class="oprate_btn">
            <el-button type="text" @click="projectRefresh">刷新</el-button>
            <el-button type="text" :disabled="single" @click="projectChange"
              >切换项目</el-button
            >
            <el-button type="text" :disabled="single" @click="projectClone"
              >克隆</el-button
            >
            <el-button
              type="text"
              :disabled="multiple"
              @click="delproject('all')"
              >批量删除</el-button
            >
            <!-- <el-button type="text" :disabled="multiple">批量编辑</el-button> -->
          </div>
          <div v-loading="isLoading" class="protable table">
            <el-table
              ref="projecttableData"
              :data="projecttableData"
              :header-cell-style="tableHeader"
              stripe
              style="width: 100%"
              @row-click="switcproject"
              @selection-change="handleSelectionChange"
            >
              <el-table-column type="selection" width="40" />
              <el-table-column
                type="index"
                align="left"
                :label="$t('lang.CommonFiled.ID')"
              >
                <template slot-scope="scope">
                  {{ scope.$index + 1 }}
                </template>
              </el-table-column>
              <el-table-column
                prop="title"
                :show-overflow-tooltip="true"
                align="left"
                width="155"
                :label="$t('lang.CommonFiled.Title')"
              >
                <template slot-scope="scope">
                  <span class="title" @click="openEdit(scope.row)">
                    {{ scope.row.title }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column
                prop="reportToName"
                align="left"
                :label="$t('lang.CommonFiled.ReportTo')"
              />
              <el-table-column
                prop="customer"
                align="left"
                :label="$t('lang.Project.Customer')"
              />

              <el-table-column
                prop="testFrame"
                align="left"
                :label="$t('lang.Project.TestFrame')"
                width="200"
              />
              <el-table-column
                prop="projectCategory"
                align="left"
                :label="$t('lang.Project.ProjectCategory')"
              />

              <el-table-column
                prop="status"
                align="left"
                :label="$t('lang.Project.Status')"
              >
                <template slot-scope="scope">
                  <span>{{
                    scope.row.status === 3
                      ? "开发中"
                      : scope.row.status === 2
                      ? "计划中"
                      : scope.row.status === 1
                      ? "关闭"
                      : ""
                  }}</span>
                </template>
              </el-table-column>

              <el-table-column
                prop="planReleaseDate"
                align="left"
                :label="$t('lang.Project.PlanReleaseDate')"
                min-width="120"
                :show-overflow-tooltip="true"
              >
                <template slot-scope="scope">
                  <span>{{ scope.row.planReleaseDate || "-" }}</span>
                </template>
              </el-table-column>

              <el-table-column
                prop="closeDate"
                align="left"
                :label="$t('lang.CommonFiled.ClosedDate')"
                min-width="120"
                :show-overflow-tooltip="true"
              >
                <template slot-scope="scope">
                  <span>{{ scope.row.closeDate || "-" }}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="createTime"
                align="left"
                :label="$t('lang.CommonFiled.CreatedDate')"
                min-width="120"
                :show-overflow-tooltip="true"
              />
              <el-table-column label="操作" min-width="120" align="center">
                <template slot-scope="scope">
                  <!-- <el-button type="text" class="table-btn">克隆</el-button>
                <span class="line">|</span> -->
                  <el-button
                    v-if="scope.row.status !== 1"
                    type="text"
                    class="table-btn"
                    @click.stop="closeAction(scope.row)"
                    >关闭</el-button
                  >
                  <el-button
                    type="text"
                    class="table-btn"
                    @click.stop="delproject(scope.row.id)"
                    >删除</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
            <pagination
              v-show="projectTotal > 0"
              :total="projectTotal"
              :page.sync="projectQuery.pageNum"
              :limit.sync="projectQuery.pageSize"
              @pagination="getqueryForProjects"
            />
          </div></div
      ></el-col>
    </el-row>
  </div>
</template>

<script>
import viewTree from "./viewTree.vue";
import { message } from "@/utils/common";
import store from "@/store";
import {
  queryForProjects,
  delProjects,
  checkProject,
  getCloseProject,
} from "@/api/project";
import { mapGetters } from "vuex";
export default {
  name: "Project",

  data() {
    return {
      treeCol:5,
      currentScope: "Project",
      tableHeader: {
        color: "#d4dce3",
        background: "#4286CD",
      }, // 表头颜色加粗设置
      isLoading: false, // 是否加载
      activeNames: ["1"],

      projectQuery: {
        pageNum: 1,
        pageSize: 10,
      },
      projectTotal: 0,
      projecttableData: [],
      multipleSelection: [], // 多选
      single: true, // 非单个禁用
      multiple: true, // 非多个禁用
      projectIds: "",

      setTree: [], // tree数据
      projectBody: {
        scope: "",
        projectId: "",
      },
      viewSearchQueryId: "",
      timer: "",
    };
  },
  components: { viewTree },
  computed: {
    ...mapGetters(["name"]),
  },
  created() {
    // 初始值
    this.getqueryForProjects(); // 获取管理项目列表
  },
  methods: {
    hadleTreeshow(){
      this.treeCol=this.treeCol==5?0:5
    },
    // 新建项目
    newproject() {
      const data = JSON.stringify({});
      this.$router.push({ name: "Addproject", query: { info: data } });
    },

    /** 项目列表表格开始 */
    getqueryForProjects() {
      this.isLoading = true;
      const query = {
        viewTreeDto: {
          id: this.viewSearchQueryId,
        },
      };
      return new Promise((resolve, reject) => {
        queryForProjects(this.projectQuery, query).then(async (res) => {
          if (res.code === "200") {
            // 默认取第一条
            if (res.total > 0) {
              this.projectBody.scope = res.data[0].scope;
              this.projectBody.projectId = res.data[0].id;
            }

            this.isLoading = false;
            this.projecttableData = res.data;
            this.projectTotal = res.total;

            resolve(res);
          }
        });
      });
    },
    // 刷新
    async projectRefresh() {
      const res = await this.getqueryForProjects();
      if (res.code === "200") {
        message("success", "刷新成功");
        this.viewSearchQueryId = "";
      }
    },
    // 切换项目
    projectChange() {
      checkProject(this.multipleSelection[0].id).then((res) => {
        if (res.code === "200") {
          this.$refs.projecttableData.clearSelection();
          store.dispatch("user/getInfo");
          this.timer = new Date().getTime();
          message("success", "切换项目成功");
        }
      });
    },
    // 克隆
    projectClone() {
      message("error", "暂未开发");
    },
    // 删除项目
    delproject(id) {
      if (id === "all") {
        message("error", "暂未开发");
        return;
      }
      delProjects(id).then((res) => {
        if (res.code === "200") {
          message("success", res.msg);
          this.getqueryForProjects();
        }
      });
    },
    // 表格多选
    handleSelectionChange(val) {
      this.multipleSelection = val;
      // 暂时不实现批量删除
      this.projectIds = "";
      for (let i = 0; i < val.length; i++) {
        this.projectIds += val[i].id + ",";
      }
      this.projectIds = this.projectIds.slice(0, this.projectIds.length - 1);
      this.multiple = !val.length;
      this.single = val.length !== 1;
    },
    // 表格行点击去编辑
    openEdit(row) {
      this.$router.push({ name: "Addproject", query: { id: row.id } });
    },
    // 表格行点击
    switcproject(row) {
      this.projectBody.scope = row.scope;
      this.projectBody.projectId = row.id;
      // this.getqueryViews()
    },
    closeAction(row) {
      this.$prompt("请输入关闭理由：", "提示", {
        confirmButtonText: "确定",
        showCancelButton: false,
      })
        .then(({ value }) => {
          if (value) {
            getCloseProject({ id: row.id, closeDesc: value }).then((res) => {
              this.getqueryForProjects();
            });
          } else {
          }

          // TO DO DO ...
        })
        .catch({});
    },
    childByValue: function (query) {
      this.isLoading = true;
      this.viewSearchQueryId = query.viewTreeDto.id;
      queryForProjects(this.projectQuery, query).then((res) => {
        this.projecttableData = res.data;
        this.projectTotal = res.total;
        this.isLoading = false;
      });
    },
  },
};
</script>
<style lang="scss" scoped>
@import "index.scss";
</style>
