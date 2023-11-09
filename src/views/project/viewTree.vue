<template>
  <div class="comp-tree">
    <div class="new_project">
      <el-button type="primary">
        <!-- <router-link :to="viewUrl"> 新建/管理视图 </router-link> -->
        <div @click="toViewManage"> 新建/管理视图 </div>
      </el-button>
      <span class="icon-box">
        <i class="el-icon-d-arrow-left" title="折叠" @click="hadleShow" />
      </span>
    </div>
    <div class="comp-data">
      <div class="big-width">

        <el-tree :data="setTree" :props="defaultProps" node-key="id" default-expand-all :expand-on-click-node="false">
          <span slot-scope="{ node }" class="custom-tree-node">
            <span @click="getList(node.data, node.label)">{{ node.label }}</span>
          </span>
        </el-tree>
      </div>
    </div>
  </div>
</template>

<script>
import { queryViewTrees } from '@/api/project'
import { getqueryFortestCycle } from '@/api/testcycle'
export default {
  name: 'ViewTree',
  props: {
    childScope: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      setTree: [], // tree数据,
      defaultProps: {
        children: 'childViews',
        label: 'title'
      },
      viewUrl: '/project/projectview?scope=' + this.childScope,
      projectQuery: {
        pageNum: 1,
        pageSize: 20
      }
    }
  },
  computed: {
    projectInfo() {
      return this.$store.state.user.userinfo
    }
  },

  created() {
    this.queryViewTree()
  },
  methods: {
    toViewManage() {
      this.$store.commit('common/setNavName', this.childScope)
      this.$router.push({ path: '/project/projectview' })

    },
    toViewAll() {
      console.log("ts");

    }
    ,
    hadleShow() {
      this.$emit('hadleTree')
    },
    getList: function (data, labels) {
      console.log("data: ", data, labels)
      const query = {
        labels: labels,
        projectId: this.projectInfo.userUseOpenProject.projectId,
        viewTreeDto: {
          id: data.id
        }
      }

      this.$emit('childByValue', query)
    },
    queryViewTree() {
      const params = {
        scope: this.childScope
      }

      queryViewTrees(params).then((res) => {

        this.setTree = res.data;

      })

    }
  }
}
</script>
<style scoped lang="scss">
@import "index.scss";

.comp-tree {
  padding: 20px 0px;
  overflow: auto;
  background: #fff;
  // padding: $spacing;
  box-sizing: border-box;
  margin-right: 20px;
  height: calc(100vh - 100px);

  .icon-box {
    margin-left: 0;
  }
}

.comp-data {
  width: 100%;
  overflow: auto;
  position: relative;
  top: 20px;

  .big-width {
    width: 100%;
    font-size: 14px;
  }


  .el-tree-node__content {
    .custom-tree-node {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-right: 8px;
      z-index: 10;
    }
  }
}
</style>
