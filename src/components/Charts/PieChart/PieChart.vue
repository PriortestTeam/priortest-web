<!-- 饼状图 -->
<template>
  <div class="border">
    <div ref="PieChart" id="PieChart"></div> 
  </div>
</template>

<script>
  export default {
    name: 'PieChart',
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
        let myChart = this.$echarts.getInstanceByDom(this.$refs.PieChart);
        if (myChart == null || myChart == undefined) {
          // 如果没有被实例化，就重新初始化
          myChart = this.$echarts.init(this.$refs.PieChart);
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
    border: 1px solid #F0F0F0;
    #PieChart{
      height: 370px;
    }
  }
</style>