<template>
  <div class="app-container custom-filed">
    <el-form
      :model="from"
      :rules="rules"
      ref="from"
      label-width="100px"
      class="demo-ruleForm"
    >
      <div>
        <div class="set_btn" @click="submitForm('from')">Save and New</div>
        <div class="set_btn">Save</div>
      </div>
      <div class="form-box">
        <el-form-item label="Filed Name" prop="name">
          <el-input size="small" v-model="from.name"></el-input>
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
          <el-row class="item">
            <el-col :span="4">
              <el-checkbox v-model="checked1">Project</el-checkbox>
            </el-col>
            <el-col :span="4" class="radiu">
              <el-checkbox v-model="checked2"></el-checkbox>
            </el-col>
            <el-col :span="4">
              <el-input
                size="mini"
                v-model="from.name"
                placeholder="默认值"
              ></el-input
            ></el-col>
          </el-row>
          <el-row class="item">
            <el-col :span="4">
              <el-checkbox v-model="checked3">Feature</el-checkbox>
            </el-col>
            <el-col :span="4" class="radiu">
              <el-checkbox v-model="checked4"></el-checkbox>
            </el-col>
            <el-col :span="4">
              <el-input
                size="mini"
                v-model="from.name"
                placeholder="默认值"
              ></el-input
            ></el-col>
          </el-row>
        </div>
      </div>
    </el-form>
    <div class="table">
      <el-button type="text" :disabled="multiple">Delete</el-button>
      <el-table
        :data="viewData"
        :header-cell-style="tableHeader"
        stripe
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"> </el-table-column>
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
        ],
      },
      checked1: false,
      checked2: true,
      checked4: false,
      checked3: true,
      viewData: [
        {
          title: 'view2',
          scope: 'sprint',
          parent: 'view1',
          owner: 'Jun',
          craeted: '2020-12-23',
        },
        {
          title: 'view2',
          scope: 'sprint',
          parent: 'view1',
          owner: 'Jun',
          craeted: '2020-12-23',
        }
      ],
      tableHeader: {
        color: '#d4dce3',
        background: '#003d79'
      },
      multipleSelection: [],//选择的表格
      multiple: true,//非多个禁用

    }
  },
  methods: {
    //提交
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!');
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
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
}
</style>