<template>
  <div id="header">
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

        <div class="leftTree" v-html="leftViewChildText" />

        <div v-if="setTree.length === 0" class="nodata">暂无数据</div>
      </div>

    </el-col>
  </div>
</template>

<script>
import $ from 'jquery'
import { queryViewTrees } from '@/api/project'
export default {
  name: 'ViewTree',
  props: {
    // eslint-disable-next-line vue/require-default-prop
    childScope: String
  },
  data() {
    return {
      activeNames: ['1'],
      setTree: [], // tree数据,
      viewUrl: '/project/projectview?scope=' + this.childScope,
      leftViewChildText: '',
      childShows: false
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
          // 先找父节点
          const tree = this.setTree

          this.leftViewChildText += '<div class="viewLeftTree">'
          for (let i = 0; i < tree.length; i++) {
            this.leftViewChildText += '<div class="parentTree viewTree" id="parentTree' + i + '" onclick="showParent(this)"><span>' + tree[i].title + '</span><i class="el-collapse-item__arrow el-icon-arrow-right"></i>'
            // 存在子级则进入
            if (tree[i].childViews !== undefined && tree[i].childViews.length > 0) {
              this.leftViewChildText += this.xunzhaoChildView(tree[i].childViews, tree[i].id, 0)
            }
            this.leftViewChildText += '</div>'
          }
          this.leftViewChildText += '</div>'
          resolve(res)
        })
      })
    },
    // 查找子级
    xunzhaoChildView(childViews, id, index) {
      let str = ''
      for (let j = 0; j < childViews.length; j++) {
        if (childViews[j].parentId === id) {
          str += '<div class="childTree viewTree" id="childTree' + index + j + ' " onclick="showChild(this)"><span>' + childViews[j].title + '</span><i class="el-collapse-item__arrow el-icon-arrow-right"></i>'
          // 存在子级则进入
          if (childViews[j].childViews !== undefined && childViews[j].childViews.length > 0) {
            // 递归寻找
            str += this.xunzhaoChildView(childViews[j].childViews, childViews[j].id, j)
          }
          str += '</div>'
        }
      }
      return str
    }
  }
}
window.showParent = function(obj) {
  if (obj && obj.stopPropagation) { obj.stopPropagation() } else { window.event.cancelBubble = true }

  const idName = '#' + obj.id
  const childNode = '.childTree'
  let flag = false
  if ($(idName + ' >' + childNode).css('display') === 'none') {
    flag = true
  }

  if (idName.indexOf('parentTree') !== -1 && flag) {
    // 将所有置位none
    $(childNode).css({ display: 'none' })
    $(idName + ' >' + childNode).fadeIn(500).css({ display: 'block' })
  }
}

window.showChild = function(obj) {
  window.event ? window.event.cancelBubble = true : obj.stopPropagation()
  const idName = '#' + obj.id
  console.log($(idName).children())
  let flag = true
  // if ($(idName + ' >' + childNode).css('display') === 'none') {
  //   flag = true
  // }
  // 查找子级
  // $(idName).siblings().children().css({ display: 'none' })
  $(idName).children().fadeIn(500).css({ display: 'block' })

}
</script>
<style scoped lang="sass">
@import "index.scss"
</style>
<style lang="sass">
@import "viewTree.scss"
</style>
