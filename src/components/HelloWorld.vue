<template>
  <div class="hello">
    <button @click="getHello" value="我是按钮">我是按钮</button>
    <br/>
    <span>{{result}}</span>
  </div>
</template>

<script>
  import { hello } from "@/api/hello";
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  data() {
    return {
      result: ""
    }
  },
  methods: {
    getHello() {

      hello().then((res) => {
        this.result = res.data;
        console.log(res)
      })



    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
