<template>
  <div class="app-container custom-filed">
    <el-form
      ref="from"
      :model="from"
      :rules="rules"
      label-width="120px"
      class="demo-ruleForm"
    >
      <div>
        <div class="set_btn" @click="submitForm('from')">保存并新建</div>
        <div class="set_btn">保存</div>
      </div>
      <div class="form-box">
        <el-form-item label="Filed Name" prop="name">
          <el-input v-model="from.name" size="small" />
        </el-form-item>
        <el-form-item label="Type" prop="type">
          <el-select
            v-model="from.type"
            placeholder="请选择"
            clearable
            size="small"
          >
            <el-option label="Progerss" value="Progerss" />
            <el-option label="Closed" value="Closed" />
            <el-option label="Plan" value="Plan" />
          </el-select>
        </el-form-item>
        <div class="scope-box">
          <el-row class="title">
            <el-col :span="4"> <span class="item">Scope</span></el-col>
            <el-col :span="4"> <span class="item">Mandatory</span></el-col>
            <el-col :span="4"> <span class="item">Default Value</span></el-col>
          </el-row>
          <el-row v-for="(item, index) in scopeData" :key="index" class="item">
            <el-col :span="4">
              <el-checkbox v-model="checked1">{{ item }}</el-checkbox>
            </el-col>
            <el-col :span="4" class="radiu">
              <el-checkbox v-model="checked2" />
            </el-col>
            <el-col :span="4">
              <el-input
                v-model="from.name"
                size="mini"
                placeholder="默认值"
              /></el-col>
          </el-row>
        </div>
      </div>
    </el-form>
    <div class="table">
      <el-button type="text" :disabled="multiple">批量删除</el-button>
      <el-table
        :data="viewData"
        :header-cell-style="tableHeader"
        stripe
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column align="center" prop="title" label="Filed Name" />
        <el-table-column align="center" prop="scope" label="Type" />
        <el-table-column align="center" prop="parent" label="Scope" />
        <el-table-column align="center" prop="owner" label="Mandatory" />
        <el-table-column align="center" prop="craeted" label="Default Value" />
        <el-table-column align="center" label="Action">
          <template>
            <span class="table-btn">Delete</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Customfiled',
  data() {
    return {
      from: {
      },
      rules: {
        name: [
          { required: true, message: '请输入字段名称', trigger: 'blur' },
          { max: 10, message: '应小于10字符', trigger: 'blur' }
        ]
      },
      checked1: false,
      checked2: true,
      checked4: false,
      checked3: true,
      scopeData: ['Project', 'Feature', 'Sprint', 'TestCase', 'TestCycle', 'Issue', 'SignOff'],
      viewData: [
        {
          title: 'view2',
          scope: 'sprint',
          parent: 'view1',
          owner: 'Jun',
          craeted: '2020-12-23'
        },
        {
          title: 'view2',
          scope: 'sprint',
          parent: 'view1',
          owner: 'Jun',
          craeted: '2020-12-23'
        }
      ],
      tableHeader: {
        color: '#d4dce3',
        background: '#003d79'
      },
      multipleSelection: [], // 选择的表格
      multiple: true // 非多个禁用

    }
  },
  methods: {
    // 提交
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
      this.multiple = !val.length
    }
  }
}
</script>
<style lang="scss" scoped>
@import "@/styles/mixin.scss"; //颜色
@import "@/styles/color.scss"; //按钮
.custom-filed {
  .set_btn {
    display: inline-block;
    @include setBtn($btnbgcolor, false);
    margin: 0 $spacing $spacing 0;
  }
  .scope-box {
    .el-col-4 {
      text-align: center;
      line-height: 32px;
    }
    .item {
      .el-col-4:nth-child(1) {
        text-align: left;
        padding-left: 30px;
      }
    }
    .radiu {
      ::v-deep .el-checkbox__inner {
        border-radius: 50%;
      }
      ::v-deep .el-checkbox__inner::after {
        content: "";
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: #fff;
        border: none;
        line-height: 14px;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        margin: auto;
      }
    }
  }
  .table {
    .table-btn {
      color: $btnbgcolor;
      cursor: pointer;
    }
  }
}
</style>
