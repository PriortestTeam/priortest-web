<!-- 折线图 -->
<template>
  <div class="border">
    <div ref="LineChart" id="LineChart"></div> 
  </div>
</template>

<script>
  export default {
    name: 'LineChart',
    props: ['option'],
    data(){
      return{
        
      }
    },
    mounted(){
      // 绘制图表
      this.draw()
    },
    methods:{
      // 绘制图表
      draw(){
        let myChart = this.$echarts.getInstanceByDom(this.$refs.LineChart);
        if (myChart == null || myChart == undefined) {
          // 如果没有被实例化，就重新初始化
          myChart = this.$echarts.init(this.$refs.LineChart);
        }
        myChart.setOption(this.option);
        window.addEventListener("resize", () => {
          myChart.resize();
        });
      }
    }
  }
</script>

<style lang="scss" scoped>
  .border{
    padding-top: 15px;
    margin-bottom: 55px;
    // height: 388px;
    border: 1px solid #F0F0F0;
    #LineChart{
      // height: 320px;
      height: 370px;
    }
  }
</style>