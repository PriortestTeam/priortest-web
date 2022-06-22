<template>
  <div class="app-container manage-view view">
    <div>
      <el-button type="primary" plain @click="viewjectRefresh">新建报表</el-button>
      <el-button type="primary" plain @click="viewjectRefresh">保存</el-button>
      <el-button type="primary" plain @click="back">返回报表</el-button>
    </div>
    <div class="form-box">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="新建报表">
          <el-input v-model="form.tittle" class="input-form"></el-input>
        </el-form-item>
        <el-form-item label="类型">
          <el-radio-group v-model="form.type">
            <el-radio label="公开"></el-radio>
            <el-radio label="私有"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="外部链接">
          <el-button type="primary" plain @click="linkChange">{{linkVal}}</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table">
      <el-button type="text">删除</el-button>
      <el-button type="text" @click="newChart">新建图表</el-button>

      <el-table
        ref="viewData"
        :data="viewData"
        :header-cell-style="tableHeader"
        stripe
        style="width: 100%"
        @row-click="toEdit"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"/>
        <el-table-column prop="id" label="ID"/>
        <el-table-column
          prop="tittle"
          label="标题"
          align="left">
        </el-table-column>
        <el-table-column prop="type" label="类型"/>
        <el-table-column prop="link" label="链接">
        </el-table-column>
        <el-table-column prop="parentTitle" label="数量"/>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              type="text"
              class="table-btn"
              @click.stop="delview(scope.row.id)"
            >删除
            </el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="viewTotal > 0"
        :total="viewTotal"
        :page.sync="viewQuery.pageNum"
        :limit.sync="viewQuery.pageSize"
        @pagination="getqueryViews"
      />
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      viewData: [
        {
          id: 1,
          tittle: 'project 1 release',
          type: '公共',
          link: 'https://www.oneclick.com',
          parentTitle: '5'
        },
        {
          id: 2,
          tittle: "project 2 release",
          type: "私有",
          link: "https://www.oneclick.com",
          parentTitle: "6"
        },
        {
          id: 3,
          tittle: "project 3 release",
          type: "公共",
          link: "https://www.oneclick.com",
          parentTitle: "7"
        },
      ], // 表格数据
      linkVal: '点击生成',
      form: {
        tittle: '',
        type: '公开'
      },
      tableHeader: {
        color: "#d4dce3",
        background: "#4286CD",
      },
      viewTotal: 0,
      viewQuery: {
        pageNum: 1,
        pageSize: 10,
      },
    }
  },
  async created() {
    await this.getqueryViews() // 获取视图
  },
  methods: {
    newChart() {
      this.$router.push('/addChart')
    },
    back() {
      // this.$router.push('/dashboard')
    },
    linkChange() {
      this.linkVal = 'https://www.oneclick.com'
    },
    // 删除view
    delview(id) {
      console.log(id);
    },
    viewjectRefresh() {
    },
    toEdit(row) {
    },
    handleSelectionChange(val) {
    },
    getqueryViews() {
    }
  }
}
</script>
<style lang="scss" scoped>
  @import "index.scss";
</style>
<style lang="scss">
  .view {
    .form-box {
      margin-top: 20px;

      .input-form {
        width: 40%;
      }
    }

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
  }
</style>
