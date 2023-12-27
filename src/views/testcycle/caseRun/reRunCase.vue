<template>
  <div class="project-container app-container">
    
    <el-button  style="width: 80px" type="primary" @click="goBack"> 用例列表</el-button>
        <el-button @click="prevCase" style="width: 60px" type="primary">上个</el-button>
        <el-button @click="nextCase" style="width: 60px" type="primary">下个</el-button>

        <el-button @click="handleCaseAction('1')" class='custom-button pass'>通过</el-button>
        <el-button @click="handleCaseAction('2')" class='custom-button fail'>失败</el-button>
        <el-button @click="handleCaseAction('2')" class='custom-button fail'>失败&缺陷（自动）</el-button>
        <el-button @click="handleCaseAction('2')" class='custom-button fail'>失败&缺陷</el-button>        
        <el-button @click="handleCaseAction('4')" class='custom-button block' >停滞</el-button>
        <el-button @click="handleCaseAction('3')" class='custom-button skip' >跳过</el-button>
        <el-button @click="handleCaseAction('0')" class='custom-button NA'>无效</el-button>
      
  <div>dataList.title</div>
  <el-table :data="dataList">          
  <el-table-column prop="testStep" label="步骤">  </el-table-column>
  <el-table-column prop="teststepCondition" label="执行条件">  </el-table-column>
  <el-table-column prop="testData" label="测试数据">  </el-table-column>
  <el-table-column prop="expectedResult" label="期待结果">  </el-table-column>
  <el-table-column label="实际结果">
      <template slot-scope="textarea">
            <el-input type="textarea" :rows="2" placeholder="请输入运行结果" v-model="textarea.row.actualResult"></el-input>
      </template>
  </el-table-column>
  <el-table-column label="执行">
     <template  slot-scope="scope">
        <el-button @click="handleOperate(scope.$index, scope.row, $event)"  class="custom-button pass">通过</el-button> |
        <el-button @click="handleOperate(scope.$index, scope.row, $event)" class="custom-button fail">失败</el-button> |
        <el-button @click="handleOperate(scope.$index, scope.row, $event, DrawerList[Drawerindex])" class="custom-button fail">失败&缺陷（自动）</el-button> |
        <el-button @click="handleOperate(scope.$index, scope.row, $event)"  class="custom-button fail">失败&缺陷</el-button> |
          <el-drawer title="缺陷" :visible.sync="drawer" :with-header="false" size="50%" show-close="true"> <issue></issue>
            </el-drawer>
         <el-button @click="handleOperate(scope.$index, scope.row, $event)"  class="custom-button block">停滞</el-button> |
         <el-button @click="handleOperate(scope.$index, scope.row, $event)"  class="custom-button NA">无效</el-button> |
         <el-button @click="handleOperate(scope.$index, scope.row, $event)"  class="custom-button skip">跳过</el-button>
      </template>
   </el-table-column>  

</el-table>

</div>

</template>


<script>


export default {

  methods: {
    goBack() {
      this.$router.go(-1); // Navigates back to the previous page
    }
  },

  props: {
    dataList: {
      type: Array,
      default: () => []
    }
  },
  mounted() {
      console.log('Received dataList:', this.dataList);
    }
};
</script>


<style scoped lang="scss">
@import "../index.scss";
.container {
   display: flex; /* Use flexbox */
   justify-content: flex-start; /* Align items at the start of the container */
   gap: 5px; /* Gap between buttons */
   flex-wrap: wrap; /* Allow buttons to wrap when container width is insufficient */
   margin-bottom: 10px; /* Optional margin to separate from the table */
}
  .custom-button {
    color: #000; /* Default text color */
    border: none; /* Remove button border */
    margin-right: 0px; /* Add some margin between buttons */
    padding: 0; /* Remove default padding */
    font-size: 12px; /* Adjust font size */
    cursor: pointer; /* Show pointer on hover */
    display: inline;
  }
  .custom-button.pass {
    color: #54BF34; /* Color for '通过' button */
  }
  .custom-button.fail {
    color: #ED1C24; /* Color for '失败&缺陷（自动）' button */
  }
  .custom-button.skip {
    color: #EA3FF7; /* Color for '失败&缺陷（自动）' button */
  }
  .custom-button.NA {
    color: #774342; /* Color for '失败&缺陷（自动）' button */
  }

  .custom-button.block {
    color:#3A083E; /* Color for '失败&缺陷（自动）' button */
  }
</style>
