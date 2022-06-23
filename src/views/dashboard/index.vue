<template>
  <div class="dashboard-container">
    <!-- 顶部上方两个按钮 -->
    <el-row :gutter="24">
      <el-col :span="3">
        <el-button type="danger"  @click="handleChart" >在线图表管理</el-button>
      </el-col>
      <el-col :span="3">
        <el-button type="warning" effect="dark">视图对比</el-button>
      </el-col>

    </el-row>
    <!-- 数据图区域 -->
    <div class="card">
      <OneTags :tagData="tagData" @add="addTag"/>
      <div class="conter">
        <div class="setup">
          <el-row :gutter="24">
            <!-- 新建 -->
            <el-col :span="2">
              <el-button @click="addChart" type="danger">新建图表</el-button>
            </el-col>
            <el-col :span="4">
              <div class="text">历史版本</div>
              <el-select class="select" v-model="selected" size="mini">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-col>
            <el-col class="radio" :span="3">
              <el-radio v-model="radio" label="STG">STG</el-radio>
              <el-radio v-model="radio" label="PRD">PRD</el-radio>
            </el-col>
          </el-row>
        </div>
        <div class="chart">
          <el-row :gutter="24">
            <el-col :span="24">
              <LineChart :option="line"/>
            </el-col>
            <el-col :span="8">
              <PieChart :option="pie"/>
            </el-col>
            <el-col :span="8">
              <BarChart :option="bar"/>
            </el-col>
            <el-col :span="8">
              <LineChart :option="line2"/>
            </el-col>
            <el-col :span="16">
              <DoubleBarChart :option="DoubleBarChart"/>
            </el-col>
          </el-row>
        </div>
        <div class="tags">
          <div>Manage Dashboard 管理看板</div>
          <div>Project Level 项目对比</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import OneTags from '@/components/OneTags/OneTags.vue'
import LineChart from '@/components/Charts/LineChart/LineChart.vue'
import PieChart from '@/components/Charts/PieChart/PieChart.vue'
import BarChart from '@/components/Charts/BarChart/BarChart.vue'
import DoubleBarChart from '@/components/Charts/DoubleBarChart/DoubleBarChart.vue'

export default {
  name: 'Dashboard',
  components:{ OneTags,LineChart,PieChart,BarChart,DoubleBarChart},
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  data(){
    return {
      // OneTags数据
      tagData: [{
        title: 'imj yaa ptk yne',
        meta: '第一个'
      },
      {
        title: '最新版本',
        meta: '第二个'
      },
       {
              title: '当前版本',
              meta: '第三个'
            },

      {
        title: '新增在线图表',
        meta: 'add'
      }],
      // 下拉框选项
      options: [{
        value: 0,
        label: 'V1.0'
      },{
        value: 1,
        label: 'V1.1'
      },{
        value: 2,
        label: 'V2.0'
      }],
      selected: 0,
      radio: 'STG',
      // 柱状图
      bar: {
        tooltip: {
          trigger: 'axis',
        },
        title: {
          text: '柱状图-缺陷',
          textStyle: {
            fontSize: 14,
          },
          left: 'center'
        },
        xAxis: {
          type: 'category',
          data: ['已修改','关闭','新建','已分配','拒绝','验证成功','验证失败']
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            type: 'bar',
            data: [120, 200, 150, 80, 20, 10, 20],
            colorBy: 'data'
          }
        ]
      },
      // 饼状图
      pie: {
        title: {
          text: '饼状图 - 测试用例自动化执行',
          textStyle: {
            fontSize: 14,
          },
          left: 'center'
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'vertical',
          left: 'left'
        },
        series: [
          {
            name: 'Access From',
            type: 'pie',
            radius: '50%',
            data: [
              { value: 1048, name: '自动化' },
              { value: 735, name: '手动' },
              { value: 580, name: '待自动化' },
              { value: 484, name: '无效的' },
              { value: 300, name: '无归类的' }
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      },
      // 折线图
      line: {
        title: {
          text: '折线图 - 执行进行',
          textStyle: {
            fontSize: 14,
          },
          // left: 'center'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['Email', 'Union Ads'],
          left: "center",
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ['1/2/2022', '2/2/2022', '3/2/2022', '4/2/2022', '5/2/2022', '6/2/2022', '7/2/2022']
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '失败',
            type: 'line',
            stack: 'Total',
            data: [120, 132, 101, 134, 90, 230, 210]
          },
          {
            name: '成功',
            type: 'line',
            stack: 'Total',
            data: [220, 182, 191, 234, 290, 330, 310]
          },

          {
                      name: '未运行',
                      type: 'line',
                      stack: 'Total',
                      data: [230, 162, 191, 284, 210, 300, 210]
          }
        ]
      },
      line2: {
        title: {
          text: '折线图2',
          textStyle: {
            fontSize: 14,
          },
          // left: 'center'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['测试'],
          left: "center",
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '测试',
            type: 'line',
            stack: 'Total',
            data: [220, 182, 191, 234, 290, 330, 310]
          }
        ]
      },
      // 双列柱状图
      DoubleBarChart: {
       title: {
                text: '测试周期运行状态',
                textStyle: {
                  fontSize: 14,
                },
                // left: 'center'
              },
        tooltip: {
          trigger: 'axis',
        },
        legend: {
          data: ['通过', '失败']
        },
        xAxis: [
          {
            type: 'category',
            data: ['V2.0', 'V2.1', 'V2.3', 'V2.3', 'V2.5', 'V2.6', 'V2.7'],
            axisPointer: {
              type: 'shadow'
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '测试周期数',
            min: 0,
            max: 30,
            interval: 5,
            axisLabel: {
              formatter: '{value} '
            }
          }
        ],
        series: [
          {
            name: '通过',
            type: 'bar',
            color: 'green',
            tooltip: {
              valueFormatter: function (value) {
                return value + '测试周期数';
              }
            },
            data: [
              3, 4, 7, 23, 25, 76, 135, 162, 32, 20, 6, 3
            ]
          },
          {
            name: '失败',
            color: 'red',
            type: 'bar',
            tooltip: {
              valueFormatter: function (value) {
                return value + '测试周期数';
              }
            },
            data: [
              2, 5, 7, 5, 28, 10, 10, 12, 4, 13, 7, 3
            ]
          }
        ]
      }
    }
  },
  methods: {
    handleChart(){
      this.$router.push('/admincenter/admincenter')
      // this.$router.push('/AddNew')
    },
    // 新增tag
    addTag(data){
      console.log(data);
      this.tagData.splice(this.tagData.length -1 ,0,data)
    },
    // 新增chart
    addChart(){
      this.$router.push('/addChart')
    }
  },
  mounted(){
    // 请求接口获取图表数据

  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 24px 13px 0 13px;
    width: 100%;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
.card{
  margin-top: 13px;
  .conter{
    background-color: #fff;
    padding: 20px 48px 30px;
    .setup{
      margin-bottom: 20px;
      .text{
        display: inline-block;
        height: 28px;
        line-height: 30px;
        width: 95px;
      }
      .select{
        width: 80px;
      }
      .radio{
        height: 28px;
        line-height: 30px;
      }
    }
    .tags{
      margin-top: 15px;
    }
  }
}
</style>
