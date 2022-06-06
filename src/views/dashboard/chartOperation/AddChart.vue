<template>
  <div class="content">
    <el-button class="redcolor">在线图表管理</el-button>
    <!-- save按钮 -->
    <div class="buttons">
      <el-button class="redcolor">新建图表</el-button>
      <el-button class="bluecolor" @click="onclick('Save And New')"
        >保存并新建</el-button
      >
      <el-button class="bluecolor" @click="onclick('Save And Back')"
        >保存返回</el-button
      >
      <el-button class="greycolor" @click="onclick('Back To Dashboard')"
        >返回在线报表</el-button
      >
    </div>
    <!-- options配置项 -->
    <div class="options">
      <el-row>
        <!-- 左 -->
        <el-col :span="6">
          <el-select class="main" size="mini" v-model="DashboardValue">
            <el-option
              v-for="item in DashboardOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <el-form label-width="80px" label-position="left">
            <el-form-item label="图表名称">
              <el-input
                size="mini"
                class="TiemTitle"
                v-model="options.TiemTitle"
              ></el-input>
            </el-form-item>
            <el-form-item label="范围">
              <el-select
                size="mini"
                v-model="ScopeValue"
                @change="handleScopeChange"
              >
                <el-option
                  v-for="item in ScopeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="视图查询">
              <el-select size="mini" v-model="FilterValue">
                <el-option
                  v-for="item in FilterOptions"
                  :key="item.id"
                  :label="item._title"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="图表类型">
              <el-select size="mini" v-model="ChartValue">
                <el-option
                  v-for="item in ChartOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="X轴">
              <el-select size="mini" v-model="XValue">
                <el-option
                  v-for="item in XOptions"
                  :key="item.fieldNameCn"
                  :label="item.fieldNameCn"
                  :value="item.fieldNameCn"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="Y轴">
              <el-select size="mini" v-model="YValue">
                <el-option
                  v-for="item in YOptions"
                  :key="item.fieldNameCn"
                  :label="item.fieldNameCn"
                  :value="item.fieldNameCn"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </el-col>
        <!-- 中 -->
        <el-col :span="7">
          <el-form class="options-center" label-position="left">
            <el-form-item label="图例位置">
              <el-select size="mini" v-model="LegendLocationValue">
                <el-option
                  v-for="item in LegendLocationOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <div class="color">
                <div class="color-title">色彩配置</div>
                <div class="color-options">
                  <el-form label-width="80px" label-position="left">
                    <el-form-item label="Open">
                      <el-input
                        class="color-input"
                        v-model="colorOptions.Open"
                        size="mini"
                        placeholder="#000000"
                      ></el-input>
                    </el-form-item>
                    <el-form-item label="Fix">
                      <el-input
                        class="color-input"
                        v-model="colorOptions.Fix"
                        size="mini"
                        placeholder="#000001"
                      ></el-input>
                    </el-form-item>
                    <el-form-item label="Close">
                      <el-input
                        class="color-input"
                        v-model="colorOptions.Close"
                        size="mini"
                        placeholder="#002001"
                      ></el-input>
                    </el-form-item>
                    <el-form-item label="Assign">
                      <el-input
                        class="color-input"
                        v-model="colorOptions.Assign"
                        size="mini"
                        placeholder="#000101"
                      ></el-input>
                    </el-form-item>
                  </el-form>
                </div>
              </div>
            </el-form-item>
            <el-form-item>
              <div class="宽度">
                <div class="width-title">宽度</div>
                <div class="width-options">
                  <el-radio v-model="Width" label="Regular">单个</el-radio>
                  <el-radio v-model="Width" label="Dobule">双</el-radio>
                  <el-radio v-model="Width" label="Full">全屏</el-radio>
                </div>
              </div>
            </el-form-item>
          </el-form>
        </el-col>
        <!-- 右 -->
        <el-col :span="11">
          <div class="options-right">
            <div class="options-right-title">当前图表记录数: 200</div>
            <div class="options-right-chart">
              <div id="myChart"></div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <!-- table -->
    <div class="table">
      <div class="table-heart">
        <div class="table-heart-left">批量册除</div>
        <div class="table-heart-right">
          <el-radio-group v-model="tableRadioUp">
            <el-radio label="1">{{ "" }}</el-radio>
            <el-radio label="2">{{ "" }}</el-radio>
            <el-radio label="3">{{ "" }}</el-radio>
            <el-radio label="4">{{ "" }}</el-radio>
            <el-radio label="5">{{ "" }}</el-radio>
          </el-radio-group>
        </div>
      </div>
      <div class="chart-table">
        <el-table
          ref="table"
          :data="tableData"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="44"> </el-table-column>
          <el-table-column label="ID" prop="ID" min-width="110">
          </el-table-column>
          <el-table-column label="图表标题" prop="ItemTitle" width="500">
          </el-table-column>
          <el-table-column label="范围" prop="Scope" width="200">
          </el-table-column>
          <el-table-column label="图标类型" prop="Project" width="200">
          </el-table-column>
          <el-table-column width="200" label="顺序">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                style="color: #000000"
                @click="handleUp(scope.$index, scope.row)"
                >Up</el-button
              >|<el-button
                size="mini"
                type="text"
                style="color: #000000"
                @click="handleDown(scope.$index, scope.row)"
                >Down</el-button
              >
            </template>
          </el-table-column>
          <el-table-column width="200" label="Action">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="table-foot">
        <div class="table-foot-left">批量删除</div>
        <div class="table-foot-right">
          <el-radio-group v-model="tableRadioDown">
            <el-radio label="1">{{ "" }}</el-radio>
            <el-radio label="2">{{ "" }}</el-radio>
            <el-radio label="3">{{ "" }}</el-radio>
            <el-radio label="4">{{ "" }}</el-radio>
            <el-radio label="5">{{ "" }}</el-radio>
          </el-radio-group>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { getViewAllScopeParams, queryViewTrees } from "@/api/project";
export default {
  name: "AddChart",
  data() {
    return {
      treeDatas: [],
      options: {},
      DashboardValue: "Dashboard List",
      DashboardOptions: [
        {
          value: "Dashboard List",
          label: "imj yaa ptk yne",
        },
        {
          value: "New Dashboard",
          label: "最新版本",
        },
        {
          value: "New Dashboard",
          label: "发布版本",
        },
      ],
      ScopeValue: "",
      ScopeOptions: [
        {
          value: "Project",
          label: "项目",
        },
        {
          value: "Feature",
          label: "故事",
        },
        {
          value: "Sprint",
          label: "迭代",
        },
        {
          value: "TestCase",
          label: "测试用例",
        },
        {
          value: "TestCycle",
          label: "测试周期",
        },
        {
          value: "Issue",
          label: "缺陷",
        },
        {
          value: "SignOff",
          label: "签收",
        },
      ],
      FilterValue: "",
      FilterOptions: [],
      ChartValue: "Bar Chart",
      ChartOptions: [
        {
          value: "Bar Chart",
          label: "柱状图",
        },
        {
          value: "Pie Chart",
          label: "饼状图",
        },
        {
          value: "Table",
          label: "表格",
        },
        {
          value: "Progress Graph",
          label: "运行图表",
        },
      ],

      XValue: "",
      XOptions: [],
      YValue: "",
      YOptions: [],
      LegendLocationValue: "Bottom",
      LegendLocationOptions: [
        {
          value: "Bottom",
          label: "Bottom",
        },
        {
          value: "Top",
          label: "Top",
        },
      ],
      colorOptions: {},
      Width: "Regular",
      tableRadioUp: "4",
      tableRadioDown: "4",
      tableData: [
        {
          ID: 1,
          ItemTitle: "Project by Status",
          Scope: "Project",
          Project: "All Projects",
        },
        {
          ID: 2,
          ItemTitle: "Project by Status",
          Scope: "Project",
          Project: "All Projects",
        },
        {
          ID: 3,
          ItemTitle: "Project by Status",
          Scope: "Project",
          Project: "All Projects",
        },
      ],
      // 柱状图
      chart: {
        title: {
          text: "缺陷-状态优先级图",
          textStyle: {
            fontSize: 14,
          },
          // textAlign: 'center'
          left: "center",
        },

        tooltip: {
          trigger: "axis",
        },
        legend: {
          data: ["通过", "失败"],
        },

        xAxis: {
          type: "category",
          data: ["新建", "已修改", "关闭", "已分配"],
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            type: "bar",
            data: [120, 200, 150, 80, 70, 110, 130],
            colorBy: "data",
          },
        ],
      },
    };
  },
  // created() {
  //   this.queryViewTree();
  // },
  methods: {
    queryViewTree() {
      const params = {
        scope: this.ScopeValue,
      };
      queryViewTrees(params).then((res) => {
        console.log("queryViewTrees", res);
      });
    },
    handleScopeChange(val) {
      this.XValue = "";
      this.YValue = "";
      this.FilterValue = "";
      console.log("val :>> ", val);
      let result = [];
      const scope = {
        scope: val,
      };
      getViewAllScopeParams(scope).then((res) => {
        console.log("res :>> ", res);
        const { customField, sysCustomField } = res.data || {};
        const _customField = (customField || []).map((item) => {
          return {
            ...item,
            fieldNameCn: item.fieldName,
          };
        });
        const concatData = _customField.concat(sysCustomField).filter(item => item.type === 'dropDown');
        this.XOptions = concatData;
        this.YOptions = concatData;
      });
      queryViewTrees(scope).then((res) => {
        console.log("queryViewTrees", res);
        const returnData = fn(res.data).map((item) => {
          return {
            ...item,
            _title:
              item.parentId == "" || item.parentId == undefined
                ? item.title
                : `*${item.title}`,
          };
        });
        console.log("re0000000000000 :>> ", returnData);
        this.FilterOptions = returnData;
        function fn(data = []) {
          let treesData = [];
          data.forEach((item) => {
            treesData.push(item);
            item.childViews && treesData.push(...fn(item.childViews));
          });
          return treesData;
        }
      });
    },
    // 保存等按钮
    onclick(type) {
      switch (type) {
        case "Save And New":
          console.log("保存 不跳转");
          break;
        case "Save And Back":
          console.log("保存 返回");
          this.$router.back();
          break;
        case "Back To Dashboard":
          console.log("不保存 返回");
          this.$router.back();
          break;
        default:
          break;
      }
    },
    // 表格事件
    handleSelectionChange() {
      console.log("当选择项发生变化时会触发该事件");
    },
    handleDelete(index, row) {
      console.log(index, row);
    },
    handleUp(index, row) {
      console.log(index, row);
    },
    handleDown(index, row) {
      console.log(index, row);
    },
    // 绘制图表
    draw() {
      let myChart = this.$echarts.init(document.getElementById("myChart"));
      myChart.setOption(this.chart);
      window.addEventListener("resize", () => {
        myChart.resize();
      });
    },
  },
  mounted() {
    // 绘制图表
    this.draw();
  },
};
</script>
<style lang="scss" scoped>
.el-form-item {
  margin-bottom: 0px;
}
.content {
  width: 100%;
  margin: 15px 25px;
  background-color: #f2f2f2;
}
.buttons {
  margin: 18px 0 35px;
}
// 颜色
.redcolor {
  background-color: #df3d66;
  color: #fff;
}
.bluecolor {
  background-color: #4286cd;
  color: #fff;
}
.greycolor {
  background-color: #a7b4c9;
  color: #fff;
}

.options {
  margin-bottom: 20px;
  .main {
    margin-bottom: 20px;
  }
  .TiemTitle {
    width: 260px;
  }
  .options-center {
    margin-top: 44px;
    .color {
      .color-title {
        font-size: 14px;
        color: #293343;
        font-weight: bold;
      }
      .color-options {
        .color-input {
          width: 260px;
        }
        margin-left: 45px;
      }
    }
    .width {
      width: 100%;
      display: flex;
      align-items: center;
      .width-title {
        width: 88px;
      }
    }
  }
  .options-right {
    display: flex;
    flex-direction: column;
    align-items: center;
    .options-right-title {
      height: 35px;
      width: 80%;
      line-height: 35px;
      background-color: #d7d7d7;
      box-sizing: border-box;
      padding: 0 6px;
      margin-bottom: 20px;
    }
    .options-right-chart {
      background-color: #ffffff;
      width: 80%;
      height: 320px;
      box-sizing: border-box;
      padding: 15px 20px;
      #myChart {
        height: 100%;
      }
    }
  }
}

// table
.table {
  .table-heart {
    height: 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .table-heart-right {
      margin-right: 125px;
    }
  }
  .table-foot {
    height: 40px;
    display: flex;
    align-items: center;
    .table-foot-left {
      width: 70px;
    }
  }
}
</style>
>
