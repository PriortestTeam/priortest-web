<template>
  <div class="project-container app-container">
    <div v-if="treeCol == 0" class="showBtn" @click="hadleTreeshow">
      <i class="el-icon-d-arrow-right" />
    </div>

    <!-- <el-button class="all-btn" type="text" @click="hadleToViewAll">所有版本</el-button> -->
    <el-row>
      <el-col :span="treeCol">
        <!-- <el-input placeholder="请输入内容" prefix-icon="el-icon-search" v-model="input2">
        </el-input> -->
        <view-tree
          :child-scope="currentScope"
          @hadleTree="hadleTreeshow"
          @childByValue="childByValue"
        />
      </el-col>
      <el-col :span="24 - treeCol">
        <el-card>
          <div class="project_table">
            <div class="new_project">
              <el-button type="text"> 版本 </el-button>
            </div>
            <!-- <el-form>
              <span class="demonstration">发布日期</span>
              <el-date-picker v-model="data" type="date" placeholder="选择日期">
              </el-date-picker>
              <el-form-item label="描述" class="describe">
                <el-input type="textarea"></el-input>
              </el-form-item>
              <div class="state">
                <span>状态</span
                ><el-select v-model="value" placeholder="请选择">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </div>
            </el-form> -->
            <el-form>
              <div class="left-block">
              <span class="demonstration">发布日期</span>
              <el-date-picker v-model="data" type="date" placeholder="选择日期">
              </el-date-picker>
              <div class="state">
                <span>状态</span
                ><el-select v-model="value" placeholder="请选择">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </div>
            </div>
              
              <el-form-item label="描述" class="describe">
                <el-input type="textarea"></el-input>
              </el-form-item>
            </el-form>

            <div class="oprate_btn">
              <span>故事</span>
              <el-button type="text" @click="projectRefresh">新建</el-button>

              <el-button type="text" @click="selectMoreCol">链接</el-button>
            </div>
            <div v-loading="isLoading" class="table protable">
              <el-table
                ref="featuretableData"
                :data="featuretableData"
                :header-cell-style="tableHeader"
                stripe
                style="width: 100%"
                @selection-change="handleSelectionChange"
              >
                <el-table-column type="selection" width="45" />
                <el-table-column type="index" label="ID">
                  <template slot-scope="scope">
                    {{ scope.$index + 1 }}
                  </template>
                </el-table-column>
                <el-table-column
                  prop="title"
                  :show-overflow-tooltip="true"
                  width="120"
                  :label="$t('lang.CommonFiled.Title')"
                >
                  <template slot-scope="scope">
                    <span class="title" @click="openEdit(scope.row, 1)">
                      {{ scope.row.title }}
                    </span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="featureStatus"
                  :show-overflow-tooltip="true"
                  label="状态"
                />

                <el-table-column
                  prop="version"
                  :show-overflow-tooltip="true"
                  label="版本"
                />

                <el-table-column
                  prop="createTime"
                  label="创建日期"
                  min-width="120"
                  :show-overflow-tooltip="true"
                />
                <el-table-column
                  prop="updateTime"
                  label="关联日期"
                  min-width="120"
                  :show-overflow-tooltip="true"
                />

                <el-table-column label="操作" min-width="148" fixed="right">
                  <template slot-scope="scope">
                    <el-button
                      type="text"
                      class="table-btn"
                      @click.stop="delproject(scope.row.id)"
                      >移除
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>

            <div class="oprate_btn">
              <span>测试用例</span>
              <el-button type="text" @click="projectRefresh">新建</el-button>

              <el-button type="text" @click="selectMoreCol">链接</el-button>
            </div>
            <div v-loading="isLoading" class="table protable">
              <el-table
                ref="testCasetableData"
                :data="testCasetableData"
                :header-cell-style="tableHeader"
                stripe
                style="width: 100%"
                @selection-change="handleSelectionChange"
              >
                <el-table-column type="selection" width="45" />
                <el-table-column type="index" label="ID">
                  <template slot-scope="scope">
                    {{ scope.$index + 1 }}
                  </template>
                </el-table-column>
                <el-table-column
                  prop="title"
                  :show-overflow-tooltip="true"
                  width="120"
                  :label="$t('lang.CommonFiled.Title')"
                >
                  <template slot-scope="scope">
                    <span class="title" @click="openEdit(scope.row, 1)">
                      {{ scope.row.title }}
                    </span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="testStatus"
                  :show-overflow-tooltip="true"
                  label="状态"
                />

                <el-table-column
                  prop="version"
                  :show-overflow-tooltip="true"
                  label="版本"
                />

                <el-table-column
                  prop="createTime"
                  label="创建日期"
                  min-width="120"
                  :show-overflow-tooltip="true"
                />
                <el-table-column
                  prop="updateTime"
                  label="关联日期"
                  min-width="120"
                  :show-overflow-tooltip="true"
                />

                <el-table-column label="操作" min-width="148" fixed="right">
                  <template slot-scope="scope">
                    <el-button
                      type="text"
                      class="table-btn"
                      @click.stop="delproject(scope.row.id)"
                      >移除
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>

            <div class="oprate_btn">
              <span>测试周期</span>
              <el-button type="text" @click="projectRefresh">新建</el-button>

              <el-button type="text" @click="selectMoreCol">链接</el-button>
            </div>
            <div v-loading="isLoading" class="table protable">
              <el-table
                ref="testCycletableData"
                :data="testCycletableData"
                :header-cell-style="tableHeader"
                stripe
                style="width: 100%"
                @selection-change="handleSelectionChange"
              >
                <el-table-column type="selection" width="45" />
                <el-table-column type="index" label="ID">
                  <template slot-scope="scope">
                    {{ scope.$index + 1 }}
                  </template>
                </el-table-column>
                <el-table-column
                  prop="title"
                  :show-overflow-tooltip="true"
                  width="120"
                  :label="$t('lang.CommonFiled.Title')"
                >
                  <template slot-scope="scope">
                    <span class="title" @click="openEdit(scope.row, 1)">
                      {{ scope.row.title }}
                    </span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="testCycleStatus"
                  :show-overflow-tooltip="true"
                  label="状态"
                />

                <el-table-column
                  prop="version"
                  :show-overflow-tooltip="true"
                  label="版本"
                />

                <el-table-column
                  prop="createTime"
                  label="创建日期"
                  min-width="120"
                  :show-overflow-tooltip="true"
                />
                <el-table-column
                  prop="updateTime"
                  label="关联日期"
                  min-width="120"
                  :show-overflow-tooltip="true"
                />

                <el-table-column label="操作" min-width="148" fixed="right">
                  <template slot-scope="scope">
                    <el-button
                      type="text"
                      class="table-btn"
                      @click.stop="delproject(scope.row.id)"
                      >移除
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div class="oprate_btn">
              <span>缺陷</span>
              <el-button type="text" @click="projectRefresh">新建</el-button>

              <el-button type="text" @click="selectMoreCol">链接</el-button>
            </div>
            <div v-loading="isLoading" class="table protable">
              <el-table
                ref="issuetableData"
                :data="issuetableData"
                :header-cell-style="tableHeader"
                stripe
                style="width: 100%"
                @selection-change="handleSelectionChange"
              >
                <el-table-column type="selection" width="45" />
                <el-table-column type="index" label="ID">
                  <template slot-scope="scope">
                    {{ scope.$index + 1 }}
                  </template>
                </el-table-column>
                <el-table-column
                  prop="title"
                  :show-overflow-tooltip="true"
                  width="120"
                  :label="$t('lang.CommonFiled.Title')"
                >
                  <template slot-scope="scope">
                    <span class="title" @click="openEdit(scope.row, 1)">
                      {{ scope.row.title }}
                    </span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="issueStatus"
                  :show-overflow-tooltip="true"
                  label="状态"
                />

                <el-table-column
                  prop="issueVersion"
                  :show-overflow-tooltip="true"
                  label="版本"
                />

                <el-table-column
                  prop="createTime"
                  label="创建日期"
                  min-width="120"
                  :show-overflow-tooltip="true"
                />
                <el-table-column
                  prop="updateTime"
                  label="关联日期"
                  min-width="120"
                  :show-overflow-tooltip="true"
                />

                <el-table-column label="操作" min-width="148" fixed="right">
                  <template slot-scope="scope">
                    <el-button
                      type="text"
                      class="table-btn"
                      @click.stop="delproject(scope.row.id)"
                      >移除
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import viewTree from "@/views/versionManagement/components/viewTree_vM";
import { message } from "@/utils/common";
import { getAllCustomList } from "@/api/customFFields";
import {
  getBeanFeatureList,
  getBeanIssueList,
  getBeanTestCaseList,
  getBeanTestCycleList,
} from "@/api/bean";

export default {
  name: "VersionManagement",
  components: { viewTree },
  data() {
    return {
      treeCol: 3,
      currentScope: "2000001", // If need to scope name - change to 'feature'
      tableHeader: {
        color: "#d4dce3",
        background: "#4286CD",
      }, // 表头颜色加粗设置
      isLoading: false, // 是否加载
      activeNames: ["1"],
      data: "2017-01-02",
      featureQuery: {
        pageNum: 1,
        pageSize: 20,
      },
      options: [
        {
          value: "选项1",
          label: "黄金糕",
        },
        {
          value: "选项2",
          label: "双皮奶",
        },
      ],
      value: "",
      featureTotal: 0,
      featuretableData: [],
      issueTotal: 0,
      issuetableData: [],
      testCaseTotal: 0,
      testCasetableData: [],
      testCycleTotal: 0,
      testCycletableData: [],
      multipleSelection: [], // 多选
      single: true, // 非单个禁用
      multiple: true, // 非多个禁用
      projectIds: "",

      setTree: [], // tree数据

      viewSearchQueryId: "",
    };
  },
  computed: {
    projectInfo() {
      return this.$store.state.user.userinfo;
    },
  },
  created() {
    this.getqueryBeanList();
    console.log("-----------", localStorage.getItem("projectId"));
    getAllCustomList({
      projectId: localStorage.getItem("projectId"),
      scopeId: 9000001,
    }).then((res) => {
      if (res.code === "200") {
        console.log("res.data.list: ", res.data);
      }
    });
  },
  methods: {
    // 链接
    selectMoreCol() {},
    // 新建项目
    newproject() {
      this.$router.push({ name: "Addfeature", query: { isEdit: 1 } });
    },

    /** 项目列表表格开始 */
    getqueryBeanList() {
      this.isLoading = true;

      // return new Promise((resolve, reject) => {
      getBeanFeatureList()
        .then(async (res) => {
          if (res.code === "200") {
            console.log("res-bean: ", res);
          }
          this.isLoading = false;
          this.featuretableData = res.data.list;
          this.featureTotal = res.data.total;
          resolve(res);
        })
        .catch((err) => {
          this.isLoading = false;
          reject(err);
        });
      // })
      getBeanIssueList()
        .then(async (res) => {
          if (res.code === "200") {
            console.log("res-bean-I: ", res);
          }
          this.isLoading = false;
          this.issuetableData = res.data.list;
          this.issueTotal = res.data.total;
          console.log("this.issuetableData: ", this.issuetableData);
        })
        .catch((err) => {
          this.isLoading = false;
        });
      getBeanTestCaseList()
        .then(async (res) => {
          if (res.code === "200") {
            console.log("res-bean: ", res);
          }
          this.isLoading = false;
          this.testCasetableData = res.data.list;
          this.testCaseTotal = res.data.total;
        })
        .catch((err) => {
          this.isLoading = false;
        });
      getBeanTestCycleList()
        .then(async (res) => {
          if (res.code === "200") {
            console.log("res-bean: ", res);
          }
          this.isLoading = false;
          this.testCycletableData = res.data.list;
          this.testCycleTotal = res.data.total;
        })
        .catch((err) => {
          this.isLoading = false;
        });
    },
    // 刷新
    async projectRefresh() {
      const res = await this.getqueryForFeature();
      if (res.code === "200") {
        message("success", "刷新成功");
        this.viewSearchQueryId = "";
      }
    },

    // 删除项目
    delproject(id) {
      if (id === "all") {
        message("error", "暂未开发");
        return;
      }
      delFeature(id).then((res) => {
        if (res.code === "200") {
          message("success", res.msg);
          this.getqueryForFeature();
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
    openEdit(row, isEdit) {
      this.$router.push({ name: "Addfeature", query: { id: row.id, isEdit } });
    },

    childByValue: function (query) {
      this.isLoading = true;
      this.viewSearchQueryId = query.viewTreeDto.id;
      const params = {
        scope: "feature",
        viewId: this.viewSearchQueryId,
      };
      // console.log('query.viewTreeDto.id: ', query.viewTreeDto.id);
      featureListByClick(params)
        .then((res) => {
          this.featuretableData = res.data.list;
          this.featureTotal = res.total;
          this.isLoading = false;
        })
        .catch(() => {
          this.featuretableData = [];
          this.featureTotal = 0;
          this.isLoading = false;
        });
    },
    async hadleToViewAll() {
      this.viewSearchQueryId = "";
      await this.getqueryForFeature();
    },
    hadleTreeshow() {
      this.treeCol = this.treeCol === 3 ? 0 : 3;
    },
  },
};
</script>
<style lang="scss" scoped>
@import "index.scss";

.app-container {
  padding: 60px 5px;
  margin: 0;
  position: relative;

  .oprate_btn {
    margin-top: 8vh;
    margin-bottom: 3vh;
  }

  .state {
    padding: 20px;
  }

  .describe {
  }

  .all-btn {
    padding: 26px 5px;
    z-index: 999999999999;
    position: absolute;
    top: 80px;
    left: 1.75%;
    color: rgb(96, 98, 102);
    font-size: 14px;
  }
}

.el-form {
  padding-top: 10px;
  padding-left: 10px;
  display: flex;
  .left-block {
    .demonstration {
      margin-right: 10px;
    }
    .state {
      span {
        margin-right: 10px;
      }
    }
  }
  .describe {
    display: flex;
  }
}

</style>
