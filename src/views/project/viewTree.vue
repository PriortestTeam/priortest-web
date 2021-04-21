<template>
  <div>
    <el-col :span="5">
      <div class="comp-tree">
        <div class="new_project">
          <el-button type="primary" round>
            <router-link :to="viewUrl">
              新建视图
            </router-link>
          </el-button>
          <el-button type="primary" round>
            <router-link :to="viewUrl">
              管理视图
            </router-link>
          </el-button>
        </div>
        <!-- 折叠面板 -->
        <el-collapse v-model="activeNames">
          <el-collapse-item
            v-for="(item, index) in setTree"
            :key="index"
            :title="item.scope"
            :name="index"
          >
            <div
              v-for="(item1, index1) in item.oneFilters"
              :key="index1"
              class="viewtext"
            >
              {{ item1.fieldName }}
            </div>
          </el-collapse-item>
        </el-collapse>
        <div v-if="setTree.length === 0" class="nodata">暂无数据</div>
      </div>
    </el-col>
  </div>
</template>

<script>
import {queryViewTrees} from '@/api/project'
export default {
  name: 'ViewTree',
  props: {
    childScope: String
  },
  data() {
    return {
      activeNames: ['1'],
      setTree: [], // tree数据,
      viewUrl: '/project/projectview?scope=' + this.childScope
    }
  },

  created() {
    this.queryViewTree()
  },
  methods: {
    /** 左侧视图*/
    queryViewTree() {
      return new Promise((resolve, reject) => {
        const params = {
          scope: this.childScope
        }
        queryViewTrees(params).then(res => {
          this.setTree = res.data
          resolve(res)
        })
      })
    }
  }
}
</script>

<style scoped lang="sass">
  @import "index.scss"
</style>
