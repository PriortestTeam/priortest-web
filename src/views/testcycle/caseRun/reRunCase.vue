<template>
  <div>
   <div class="container">
        <button @click="getCaseList" class='custom-button pass'>运行用例列表</button>
        <button @click="prevCase">上个</button>
        <button @click="nextCase">下个</button>

        <button @click="handleCaseAction('0')" class='custom-button NA'>无效</button>
        <button @click="handleCaseAction('1')" class='custom-button pass'>通过</button>
        <button @click="handleCaseAction('2')" class='custom-button fail'>失败</button>
        <button @click="handleCaseAction('3')"class='custom-button skip' >跳过</button>
        <button @click="handleCaseAction('4')"class='custom-button block' >停滞</button>
      </div>


 <table v-if="dataList && dataList.length">
      <thead>
        <tr>
          <th>Test Step</th>
          <th>Expected Result</th>
          <th>Run Count</th>
          <th>Test Data</th>
          <th>Test Condition</th>
          <th>Remarks</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in dataList" :key="index">
        console.log("ljljljljlj", dataList);
          <td>{{ item.testStep }}</td>
          <td>{{ item.expectedResult }}</td>
          <td>{{ item.runCount }}</td>
          <td>{{ item.testData }}</td>
          <td>{{ item.teststepCondition }}</td>
          <td>{{ item.remarks }}</td>
        </tr>
      </tbody>
    </table>


  </div>




</template>


<script>
export default {
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


<style scoped>
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
