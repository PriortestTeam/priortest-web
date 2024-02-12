<template>
	<div>
		<el-row class="Instance">
			<!-- 左侧列表 -->
			<el-col :span="show ? 5 : 0">
				<div class="InstanceList">
					<div class="listHeader">
						添加测试用例
					</div>
					<div class="listContent">
						<div class="btns">						
							<el-button type="primary" @click="addCaseIntoTestCycle" :loading="loading">添加到周期</el-button>
						</div>
						<div class="search">
							<el-input v-model="searchValue" size="mini" prefix-icon="el-icon-search" placeholder="用例UUID 或标题" clearable
								@input="handleChange"></el-input>
						</div>
						<div class="list">
							<el-tree :data="setTree" :props="defaultProps" node-key="id" default-expand-all
								:expand-on-click-node="false" class="list-L">
								<span slot-scope="{ node }" class="custom-tree-node">
									<span @click="getList(node.data, node.label)">{{ node.label }}</span>
								</span>
							</el-tree>
							<div class="list-R">
								<el-checkbox :indeterminate="isIndeterminate" v-model="checkAll"
									@change="handleCheckAllChange">全选</el-checkbox>
								<el-checkbox-group v-model="checkedlLists" @change="listItemClick" class="list_R_D">
									<el-checkbox v-for="item in fillerInstanceListData" :key="item.id" :label="item.id">{{ item.title
									}}</el-checkbox>
								</el-checkbox-group>
							</div>

						</div>

					</div>
				</div>
			</el-col>
			<!-- 右侧表单 -->
			<el-col class="InstanceTable" :span="show ? 19 : 24">
				<div class="btns">
					<el-button type="primary" @click="showInstanceList">添加用例</el-button>
					<el-button type="primary" @click="removeTestCase">移除用例</el-button>
					<el-button type="primary" @click="reloadTable">加载用例</el-button>
					<el-button type="primary">批量运行</el-button>
					<el-button type="primary">字段调整</el-button>
				</div>

				<el-table ref="InstanceTable" :data="InstanceTableData" :header-cell-style="tableHeader" stripe
					style="width: 100%">

					<el-table-column type="selection">
					</el-table-column>
					<el-table-column label="运行">
						<template slot-scope="scope">
							<el-button type="primary" class="run-btn" @click="handelRun(scope.row.testCase.id)"></el-button>
						</template>
					</el-table-column>		
					<el-table-column label="再运行">
  <template slot-scope="scope">
    <el-button v-if="[2,4,6].includes(scope.row.testCaseRun.runStatus)" type="primary" class="run-btn"
      @click="handelReRun(scope.row.testCase.id, scope.row.testCase.title)"></el-button>
  </template>
</el-table-column>					
					<el-table-column label="UUID" prop="testCase.id" width="180px">
					</el-table-column>
					<el-table-column label="标题" prop="testCase.title" width="160px">
					</el-table-column>
					<el-table-column label="发布版本" prop="testCase.version" width="120px">
					</el-table-column>
					<el-table-column label="缺陷" width="120px">
					</el-table-column>
					<el-table-column label="故事" prop="feature">
					</el-table-column>
					<el-table-column label="测试方法" prop="testCase.testMethod" width="160px">
					</el-table-column>
					<el-table-column label="运行状态" prop="testCaseRun.runStatus" width="120px">
						<template slot-scope="scope">
							{{ interpretRunStatus(scope.row.testCaseRun.runStatus) }}
						</template>
					</el-table-column>
					<el-table-column label="运行时长" prop="testCaseRun.caseRunDuration">		
					  <template slot-scope="{ row }">						
  					 {{ ((row.testCaseRun.caseRunDuration) / 60000).toFixed(4) }} mins
					</template>

					</el-table-column>
					<el-table-column label="共计" prop="testCaseRun.caseTotalPeriod">
						<template slot-scope="{ row }">
    {{ formatTotalPeriod(row.testCaseRun.caseTotalPeriod, row.testCaseRun.runCount) }}
  </template>
					</el-table-column>

					<el-table-column label="运行时间" prop="testCaseRun.updateTime">
					</el-table-column>
					<el-table-column label="执行者" prop="testCaseRun.updateUserId">
					</el-table-column>
					<el-table-column label="操作" width="58" fixed="right">
						<template slot-scope="scope">
							<el-button type="primary" @click="removeRowTestCase(scope.row.testCase.id)">移徐</el-button>
						</template>
					</el-table-column>
				</el-table>

			</el-col>
		</el-row>

	</div>
</template>

<script>
import { message } from '@/utils/common'
import {
	getListBytestCycle,
	saveInstance,
	deleteInstance,
	testCycleListByClick
} from '@/api/testcycle'

import { axios } from '@/utils/request'

import { queryViewTrees } from '@/api/view'

export default {
	data() {
		return {
			projectId: '',
			cycleId: '',
			show: false,
			active: '',
			checkedlLists: [],
			InstanceListData: [],
			fillerInstanceListData: [],
			searchValue: '',
			selectCaseIds: [],
			InstanceTableData: [],
			isIndeterminate: true,
			checkAll: false,

			cycleId: '',
			tableHeader: {
				color: '#d4dce3',
				background: '#4286CD'
			}, // 表头颜色加粗设置,
			setTree: [], // tree数据,
			defaultProps: {
				children: 'childViews',
				label: 'title'
			},
	
		
      // Other 添加用例到周期时
      loading: false, // Add loading property to control loading state
		}
	},

	created() {
		// 仅在整个视图都被渲染之后才会运行的代码
		this.projectId = this.$store.state.user.userinfo.userUseOpenProject.projectId
		this.cycleId = this.$route.query.id
		this.getInstanceTableData()
	},
	methods: {

 	
		formatTotalPeriod(totalPeriod, runCount) {
    if (totalPeriod === 0) {
      return `0 mins (${runCount})`;
    } else if (totalPeriod > 60 * 60 * 1000) {
      // Convert to hours if total period exceeds 60 minutes
      const hours = (totalPeriod / (60 * 60 * 1000)).toFixed(4);
      return `${hours} hours (${runCount})`;
    } else {
      // Convert to minutes if total period is less or equal to 60 minutes
      const minutes = (totalPeriod / (60 * 1000)).toFixed(4);
      return `${minutes} mins (${runCount})`;
    }
		},




		// 获取左侧列表数据
		getList: function (data, labels) {
    const query = {
        labels: labels,
        projectId: JSON.parse(localStorage.getItem('projectId')),
        viewTreeDto: {
            id: data.id
        }
    };
    const p = {
        scope: 'testCase',
        viewId: data.id,
    };

    testCycleListByClick(p, {}).then(res => {
     //   console.log('viewClick: ', res.data.total, p);
     //   const pageSize = res.data.total;
     //   return testCycleListByClick(p, {
     //       pageNum: 1,
     //       pageSize: pageSize
     //   });
   // }).then(res => {
        console.log('viewClick: ', res.data.total, p);
        this.InstanceListData = res.data.list;
        this.fillerInstanceListData = this.InstanceListData;
    }).catch(() => {
        this.InstanceListData = [];
        this.fillerInstanceListData = [];
    });
},
		getInstanceListData() {
			queryViewTrees({
				"scope": "3000001"
			}).then((res) => {
				this.setTree = res.data				
			})
		},
		// 搜索框过滤数据
		handleChange(value) {
			let timer = null
			if (timer !== null) {
				clearTimeout(timer)
			}
			timer = setTimeout(() => {
				this.fillerInstanceListData = this.InstanceListData.filter(item => {
					if (item.title.includes(value)) {
						return item
					}
				})
			}, 300)
		},
		// 全选
		handleCheckAllChange(val) {
			this.selectCaseIds = this.checkedlLists = val ? this.fillerInstanceListData.map(item => {
				return item.id
			}) : []
			this.isIndeterminate = false
		},
		// 获取表格数据
		getInstanceTableData() {
			if (!this.cycleId) return
			const params = {
				testCycleId: this.cycleId
			}
		
			getListBytestCycle(params, { pageNum: 1, pageSize: 10 }).then(res => {
		    this.InstanceTableData = res.data.list;
			});		

		},

		interpretRunStatus(runStatus) {
			switch (runStatus) {
				case 0:
					return '无效';
				case 1:
					return '通过';
				case 2:
					return '失败';
				case 3:
					return '跳过';
				case 4:
					return '停滞';
				case 5:
					return '未运行';
				case 6:
					return '未完成';

			}
		},
		//点击列表，选择case，高亮
		listItemClick(val) {
			console.log(val);
			this.selectCaseIds = val
			this.checkedlLists = val
			let checkedCount = val.length;
			this.checkAll = checkedCount === this.fillerInstanceListData.length;
			this.isIndeterminate = checkedCount > 0 && checkedCount < this.fillerInstanceListData.length;

		},
		
		// 添加用例到周期
		addCaseIntoTestCycle(){
      if (this.selectCaseIds.length === 0) return message('error', '请选择case');
      
      // Set loading to true to lock the page
      this.loading = true;
      const data = {
        projectId: this.projectId,
        testCycleId: this.cycleId,
        testCaseIds: this.selectCaseIds,
      };

      saveInstance(data)
        .then((res) => {
          if (res.code === '200') {
            message('success', '添加成功');
            this.checkedlLists = [];
            this.isIndeterminate = true;
            this.checkAll = false;
            this.reloadTable();
          }
        })
        .catch((error) => {
          console.error('Error adding case:', error);
          // Handle error if needed
        })
        .finally(() => {
          // Toggle loading back to false after the API call completes
          this.loading = false;
        });
    },
		// 展示左侧列表
		showInstanceList() {
			this.show = !this.show
			this.show ? this.getInstanceListData() : ""
		},

		//运行
		handelRun(tcId) {
			const data = {
				projectId: this.projectId,
				testCycleId: this.cycleId,
				testCaseId: tcId,
				runCountIndicator: true
			};
			console.log('Data to be sent:', data);
			// Perform the API call
			//axios.post('/testCycle/instance/listByTestCycle', data)
			axios.post('/testCycle/caseRun/execute', data)
				.then(response => {
					console.log('API call successful:', response);
					// Once the API call is completed, navigate to the desired route
					this.$router.push({ name: 'runCase', query: { id: this.cycleId, tableid: tcId } });
				})
				.catch(error => {
					console.error('Error executing test case or navigating:', error);
				});
		},

		//再运行
		async handelReRun(tcId, testCaseTitle) {
			const data = {
				projectId: this.projectId,
				testCycleId: this.cycleId,
				testCaseId: tcId,
				runCountIndicator: false
			};
			try {
				//const response = await fetch('re-run.api');
				const response = await axios.post('/testCycle/caseRun/execute', data)
				const data1 = response.data;

				// Assuming Vue Router is used for navigation
				if (response.code === '200') {
					console.error('reRun data', data1,testCaseTitle);
					this.$router.push({ name: 'reRunCase', params: { dataList: data1.list, testCaseTitle: testCaseTitle } });
				} else {
					console.error('Invalid API response');
				}
			} catch (error) {
				console.error('Error occurred while fetching data:', error);
			}

		},


		//删除案例
		deleteCase(ids) {
			const data = {
				projectId: this.projectId,
				testCycleId: this.cycleId,
				testCaseIds: ids
			}
			deleteInstance(data).then(res => {
				console.log(res)
				if (res.code === '200') {
					message('success', '删除成功')
					this.reloadTable()
				}
			})
		},
		// 表格顶部移除测试案例按钮 - 批量移除
		removeTestCase() {
		

		// Check if the table component reference exists
			if (!this.$refs['InstanceTable']) {
        console.error("InstanceTable ref not found.");
        return;
    }
	 // Retrieve the selection from the table component
	 const selection = this.$refs['InstanceTable'].selection;
	 // Check if any cases are selected
	 if (!selection || selection.length === 0) {
        console.error("No cases selected.");
        message('error', '请选择 移除用例');
        return;
    }
	// Extract IDs from the selected cases
    const ids = selection.map(item => item.testCase.id);
    // Call deleteCase method with the extracted IDs
    this.deleteCase(ids);	

		},

		// 表格中移除测试案例按钮
		removeRowTestCase(id) {
			this.deleteCase([id])
		},
		//刷新表单
		reloadTable() {
			console.log('刷新')
			this.getInstanceTableData()
		}
	}
}
</script>

<style lang="scss" scoped>
.InstanceList {
	flex: 1;
	margin-right: 10px;
	border: 1px solid rgb(210, 210, 210);
	background-color: white;

	.listHeader {
		background-color: rgb(66, 134, 205);
		font-size: 14px;
		height: 30px;
		color: rgb(227, 221, 242);
		line-height: 30px;
	}

	.listContent {
		padding: 15px;
		overflow-x: scroll !important;
		overflow-y: scroll !important;

		.list {

			display: flex;
			justify-content: start;
			flex-wrap: nowrap !important;
			// overflow: hidden;

			.list-R {

				height: 60vh;
				display: flex;
				flex-direction: column;

				.list_R_D {
					flex: 1;


					// background-color: aqua;
					display: flex;
					flex-direction: column;
					flex-wrap: nowrap !important;
				}
			}

		}


		.btns {
			margin-bottom: 10px;

			.el-button {
				padding: 6px 17px;
			}
		}

		.search {
			margin-bottom: 10px;
		}
	}
}

.InstanceTable {
	.btns {
		margin-bottom: 10px;
	}

	.run-btn {
		width: 22px;
		height: 22px;
		background-image: url("../../../icons/img/runIcon.png");
		background-size: cover;
		/* 控制背景图片的大小，cover 表示尽可能填充整个元素 */
		background-repeat: no-repeat;
		/* 禁止背景图片重复 */
		border: none;
		/* 去掉按钮的边框 */
		background-color: (#00ff00);
		border-radius: 50%;


	}

	.runIcon {
		width: 20px;
	}
}
</style>
