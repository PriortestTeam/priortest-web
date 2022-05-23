<!-- 传入初始化数据渲染tags 也可以再添加 -->
<template>
  <div class="tags">
    <div @click="changTag($event,index)" :data-type='item.meta' class="tag" v-for="(item,index) in tagData" :key="index">{{ item.title }}</div>
  </div> 
</template>

<script>
  export default {
    name: 'OneTags',
    props: {
      tagData: Array
    },
    data(){
      return {
        value: '',
        defaultValue: '无标题'
      }
    },
    methods: {
      changTag(e,index){
        // 改变背景
        var sibling=e.target.parentNode.childNodes;
        for(var i=0;i<sibling.length;i++){
          sibling[i].style.backgroundColor = '#E1E4EA'
        }
        e.target.style.backgroundColor = '#ffffff'
        // 添加按钮
        if(e.target.dataset.type == 'add'){
          this.value == ''?this.value = this.defaultValue : null
          this.$emit('add',{title: this.value})
        }else{
          // 普通按钮
          // 对应操作
        }
      }
    }
  }
</script>

<style scoped>
  .tags{
    height: 40px;
    display: flex;
    font-size: 16px;
  }
  .tag{
    width: 150px;
    background: #E1E4EA;
    text-align: center;
    line-height: 40px;
    border: 1px solid #d7d7d7;
    cursor: pointer;
  }
  .tag + .tag {
    border-left: 0;
  }
  .tag:first-child{
    background: #fff;
  }
  /* .tag:hover{
    background-color: #fff;
    border-bottom: 0;
  } */
</style>