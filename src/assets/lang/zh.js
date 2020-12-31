export const lang = {
    menuTitle:{
        Project:'项目' ,
        Feature:'故事' ,
        Sprint:'迭代' ,
        TestCase:'测试用例' ,
        TestCycle:'测试周期' ,
        Issue:'缺陷' ,
        SignOff:'验收' ,
    },
    //项目 
    Project: {
        ManageProject:'管理项目',
        // 新建项目
        NewProject:'新建项目',
        ProjectTitle:'项目标题',
        Description: '描述',
        Status: '状态',
        Attachment:'附件',
        ReportTo:'负责人',
        Customer:'客户',
        Closed :'关闭',
        Plan :'计划',
        Progress: '开发中',
        
        title: [
            { required: true, message: '请输入活动名称', trigger: 'blur' },
            { max: 15, message: '应小于15字符', trigger: 'blur' }
          ],
        // 克隆项目
        ProjectTable:{
            ID :'序号',
            FileName :'文件名',
            UploadDate :'上传日期',
            Uploader :'上传者',
            ModifyDate: '修改日期',
            Modifier :'修改者',
            Action :'操作',
        }
    },
    // 故事{
    Feature: {

    },
    // 迭代
    Sprint: {

    },
    // 测试用例
    TestCase: {

    },
    // 测试周期
    TestCycle: {

    },
    // 缺陷
    Issue: {

    },
    // 验收
    SignOff:{
        Generate:'生成'
    },
    // 公共按钮
    PublicBtn:{
        NewView:'新建视图',
        AllItem:'所有记录',
        ManageView :'管理视图',
        Clone:'克隆',
        Delete:'删除',
        BatchEdit:'批量编辑',
        // 
        Save: '保存',
        GiveUp : '放弃',
        SaveAndNew : '保存并新建',
        SaveAndBack : '保存并返回',
        CreateCustomField : '新建字段',
        // 
        CreateAsTestCycle: '新建测试周期',
        ExportTestCase:'导出用例',
        PutIntoaTestCycle:"添加到测试周期",
        CreateAsView:'新建视图'
    },
    chinese: '中文',
    engLish: '英文',
    custom:{
        name:'中文'
    }
  }