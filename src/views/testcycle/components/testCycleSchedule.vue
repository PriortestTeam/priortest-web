<template>
	<div>
		<el-form ref="form" :model="form" :rules="formRule" label-width="120px">
			<el-button type="primary" @click="submit">保存</el-button>
			<el-form-item prop="jenkinsJobName" label="Jenkins Job">
				<el-input size="small" v-model="form.jenkinsJobName"></el-input>
			</el-form-item>
            <el-form-item prop="jenkinsUrl" label="Jenkins Url">
				<el-input size="small" v-model="form.jenkinsUrl"></el-input>
			</el-form-item>
            <el-form-item prop="jenkinsUserName" label="Jenkins 用户名">
				<el-input size="small" v-model="form.jenkinsUserName"></el-input>
			</el-form-item>
            <el-form-item prop="jenkinsToken" label="Jenkins token">
				<el-input size="small" v-model="form.jenkinsToken"></el-input>
			</el-form-item>
			<div class="cron">
				<el-form-item prop="cronExpression" label="cron"></el-form-item>
				<div class="crontab">				
					<vcrontab ref="crontab"></vcrontab>
				</div>
			</div>
		</el-form>
		<el-button type="primary">添加</el-button>
		<!-- 获得表单暂未完成 -->
		<el-table :header-cell-style="tableHeader" stripe style="width: 100%">
			<el-table-column label="id">
			</el-table-column>
			<el-table-column label="操作">
			</el-table-column>
			<el-table-column label="run">
				<template slot-scope="scope">
				</template>
			</el-table-column>
			<el-table-column label="运行job">
			</el-table-column>
			<el-table-column label="状态">
			</el-table-column>
		</el-table>
	</div>
</template>

<script>
	import {
		addSchedule
	} from "@/api/testcycle"
	// import vcrontab from "vcrontab"
    import vcrontab  from "@/components/Vcrontab/index"
	export default {
		components: {
			vcrontab
		},
		created() {
			this.form.testCycleId = this.$route.query.id
		},
		data() {
			return {
				tableHeader: {
					color: '#d4dce3',
					background: '#4286CD'
				}, // 表头样式

				//表单
				form: {
					testCycleId: '',
					jenkinsJobName: '',
					cronExpression: '',
				},

				formRule: {
					jenkinsJobName: [{
						required: true,
						message: '请输入活动名称',
						trigger: 'blur'
					}],
                    jenkinsUrl: [{
                        required: true,
                        message: '请输入Url地址',
                        trigger: 'blur'
                    }],
                    jenkinsUserName: [{
                        required: true,
                        message: '请输入用户名',
                        trigger: 'blur'
                    }],
                    jenkinsToken: [{
                        required: true,
                        message: '请输入Token',
                        trigger: 'blur'
                    }],
					cronExpression: [{
						required: true,
						message: '请输入活动名称'
					}]
				},

				expression: "",
				showCron: false,
			}
		},

		methods: {
			submit() {
				this.form.cronExpression = this.$refs['crontab'].contabValueString
				console.log('this.form.cronExpression: ', this.form.cronExpression);
				this.$refs['form'].validate((valid) => {
					if (valid) {
						addSchedule(this.form).then(res => {
							// console.log("res: ", res)
							this.$refs['form'].resetFields()
							this.$refs['crontab'].clearCron
						})
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.el-form {
		width: 50%;
	}

	::v-deep .popup-main {
		display: none;
	}

	::v-deep #pane-0 .el-form .el-form-item:nth-child(-n+3) {
		display: none;
	}

	::v-deep #pane-1 .el-form .el-form-item:nth-child(-n+3) {
		display: none;
	}

	::v-deep #pane-2 .el-form .el-form-item:nth-child(-n+3) {
		display: none;
	}
	
	.cron {
		display: flex;
		.crontab {
			flex: 1;
		}
	}

	.el-table {
		margin-top: 10px;
	}
</style>