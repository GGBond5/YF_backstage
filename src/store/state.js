import { loadData } from '@/assets/js/cache.js'
import util from '@/plugins/util.js'
let menuList = /*util.getCookie('accessToken')?JSON.parse(window.sessionStorage.getItem('menuList')) : */[
  {index:101, id: 'overhaulSupervision', unit:'检修督办', path:'/overhaulSupervision', children:[
    {index:10101, id: 'supervisionHome', name:'督办单首页', path:'/overhaulSupervision/supervisionHome'},
    {index:10102, id: 'supervisionInitiate', name:'督办单发起', path:'/overhaulSupervision/supervisionInitiate'},
    {index:10103, id: 'supervisionPermission', name:'督办单开工许可', path:'/overhaulSupervision/supervisionPermission'},
    {index:10104, id: 'supervisionDispose', name:'督办单处理', path:'/overhaulSupervision/supervisionDispose'},
    {index:10105, id: 'supervisionLookOver', name:'督办单查看', path:'/overhaulSupervision/supervisionLookOver'},
    {index:10106, id: 'supervisionStatistics', name:'督办单统计', path:'/overhaulSupervision/supervisionStatistics'},
    {index:10107, id: 'supervisionPlan', name:'督办单计划策略', path:'/overhaulSupervision/supervisionPlan'},
    {index:10108, id: 'supervisionTaskManage', name:'计划任务管理', path:'/overhaulSupervision/supervisionTaskManage'}
  ]},
  {index:102, id: 'haltRecord', unit:'停机记录', path:'/haltRecord', children:[
    {index:10201, id: 'list', name:'停机记录列表', path:'/haltRecord/list'},
    {index:10202, id: 'haltStatistics', name:'停机记录统计', path:'/haltRecord/haltStatistics'},
    {index:10203, id: 'malfunctionStatistics', name:'风机故障统计', path:'/haltRecord/malfunctionStatistics'}
  ]},
  {index:104, id: 'productionIndex', unit:'生产运营指标', path:'/productionIndex', children:[
    {index:10401, id: 'windPowerDataQuery', name:'风电指标查询', path:'/productionIndex/windPowerDataQuery', parameters: [
      {index: 0, name: '风资源指标'},
      {index: 1, name: '电量指标'},
      {index: 2, name: '能耗指标'},
      {index: 3, name: '可靠性指标'},
      {index: 4, name: '设备维护指标'},
      {index: 5, name: '运行维护指标'},
    ]},
    {index:10402, id: 'customReports', name:'定制报表', path:'/productionIndex/customReports', parameters: [
      {index: 0, name: '日报'},
      {index: 1, name: '周报'},
      {index: 2, name: '月报'},
      {index: 3, name: '季报'},
      {index: 4, name: '自定义'},
    ]},
  ]},
  {index:103, id: 'operatingIndex', unit:'运行指标', path:'/operatingIndex', children:[
    {index:10301, id: 'overheatMonitor', name:'风机超温监视', path:'/operatingIndex/overheatMonitor'},
    {index:10302, id: 'overpressure', name:'风机超压监视', path:'/operatingIndex/overpressure'},
    {index:10303, id: 'overspeed', name:'风机超速监视', path:'/operatingIndex/overspeed'},
    {index:10304, id: 'yawStatistics', name:'偏航次数统计', path:'/operatingIndex/yawStatistics'},
    {index:10305, id: 'malfunctionStatistics', name:'可复位故障统计', path:'/operatingIndex/malfunctionStatistics'},
    {index:10306, id: 'reliabilityStatistics', name:'可靠性指标统计', path:'/operatingIndex/reliabilityStatistics'},
    {index:10307, id: 'earlyWarning', name:'风机预警统计', path:'/operatingIndex/earlyWarning'},
    {index:10308, id: 'malfunctionDiagnose', name:'风机故障诊断', path:'/operatingIndex/malfunctionDiagnose'},
    {index:10309, id: 'limitedPowerQuery', name:'调度限电查询', path:'/operatingIndex/limitedPowerQuery'},
    {index:10310, id: 'tryPowerLimitation', name:'试运行限功率查询', path:'/operatingIndex/tryPowerLimitation'},
    {index:10311, id: 'initiativePowerLimitation', name:'主动限功率查询', path:'/operatingIndex/initiativePowerLimitation'},
    {index:10312, id: 'communicationOutage', name:'通讯中断查询', path:'/operatingIndex/communicationOutage'},
  ]},
  {index:105, id: 'dataManagement', unit:'数据管理', path:'/dataManagement', children:[
    {index:10501, id: 'dayData', name:'日数据修正', path:'/dataManagement/dayData'},
    {index:10502, id: 'monthData', name:'月/年数据修正', path:'/dataManagement/monthData'},
  ]},
  {index:106, id: 'deviceManagement', unit:'设备管理', path:'/deviceManagement', children:[
    {index:10601, id: 'deviceType', name:'设备类型管理', path:'/deviceManagement/deviceType'},
    {index:10602, id: 'deviceLocaltion', name:'设备位置管理', path:'/deviceManagement/deviceLocaltion'},
    {index:10603, id: 'deviceLedger', name:'设备台账', path:'/deviceManagement/deviceLedger'},
    {index:10604, id: 'deviceDocument', name:'设备文档', path:'/deviceManagement/deviceDocument'},
    {index:10605, id: 'faultKnowledgeBase', name:'故障知识库', path:'/deviceManagement/faultKnowledgeBase'},
    {index:10606, id: 'partSuject', name:'部件科目管理', path:'/deviceManagement/partSuject'},
  ]},
  {index:107, id: 'expendManagement', unit:'项目管理', path:'/expendManagement', children:[
    {index:10701, id: 'overview', name:'预算总览', path:'/expendManagement/overview'},
    {index:10702, id: 'authorizedStrength', name:'预算编制', path:'/expendManagement/authorizedStrength'},
    {index:10703, id: 'management', name:'项目管理', path:'/expendManagement/management'},
    {index:10704, id: 'adminManagement', name:'项目管理(Admin)', path:'/expendManagement/adminManagement'},
    {index:10705, id: 'monthlyIncome', name:'月度入账计划', path:'/expendManagement/monthlyIncome'},
    {index:10706, id: 'adminMonthlyIncome', name:'月度入账计划(Admin)', path:'/expendManagement/adminMonthlyIncome'},
    {index:10707, id: 'monthlyPayment', name:'月度付款计划', path:'/expendManagement/monthlyPayment'},
    {index:10708, id: 'adminMonthlyPayment', name:'月度付款计划(Admin)', path:'/expendManagement/adminMonthlyPayment'},
    {index:10709, id: 'purchase', name:'采购计划管理', path:'/expendManagement/purchase'},
    {index:10710, id: 'adminPurchase', name:'采购计划管理(Admin)', path:'/expendManagement/adminPurchase'},
  ]},
  {index:108, id: 'systemConfiguration', unit:'系统设置', path:'/systemConfiguration', children:[
    {index:10801, id: 'organization', name:'组织机构管理', path:'/systemConfiguration/organization'},
    {index:10802, id: 'rolePermissions', name:'角色权限管理', path:'/systemConfiguration/rolePermissions'},
    {index:10803, id: 'user', name:'用户账号管理', path:'/systemConfiguration/user'}
  ]},
]
export default {
  storage: loadData(),
  menu: menuList,
  actionMapping: [
    {
      progress: '项目立项',
      auditStatus : [
        {
          state: '待审核',
          operation: ['编辑', '删除'],
          checkOperation: ['查看详情'],
        },
        {
          state: '审核中',
          operation: ['查看详情'],
          checkOperation: ['立即审核'],
        },
        {
          state: '审核不通过',
          operation: ['编辑', '删除'],
          checkOperation: ['查看详情'],
        },
        {
          state: '审核通过',
          operation: ['编制采购文件'],
          checkOperation: ['统一采购'],
        },
      ],

    },
    {
      progress: '编制采购文件',
      auditStatus : [
        {
          state: '待审核',
          operation: ['编辑'],
          checkOperation: ['查看详情'],
        },
        {
          state: '审核中',
          operation: ['查看详情'],
          checkOperation: ['立即审核'],
        },
        {
          state: '审核不通过',
          operation: ['编辑'],
          checkOperation: ['查看详情'],
        },
        {
          state: '审核通过',
          operation: ['合同拟稿'],
          checkOperation: ['查看详情'],
        },
      ]
    },
    {
      progress: '合同拟稿',
      auditStatus : [
        {
          state: '待审核',
          operation: ['编辑'],
          checkOperation: ['查看详情'],
        },
        {
          state: '审核中',
          operation: ['查看详情'],
          checkOperation: ['立即审核'],
        },
        {
          state: '审核不通过',
          operation: ['编辑'],
          checkOperation: ['查看详情'],
        },
        {
          state: '审核通过',
          operation: ['项目实施'],
          checkOperation: ['查看详情'],
        },
      ]
    },
    {
      progress: '项目实施',
      auditStatus : [
        {
          state: '待审核',
          operation: ['编辑'],
          checkOperation: ['查看详情'],
        },
        {
          state: '审核中',
          operation: ['查看详情'],
          checkOperation: ['立即审核'],
        },
        {
          state: '审核不通过',
          operation: ['编辑'],
          checkOperation: ['查看详情'],
        },
        {
          state: '审核通过',
          operation: ['完工总结'],
          checkOperation: ['查看详情'],
        },
      ]
    },
    {
      progress: '完工总结',
      auditStatus : [
        {
          state: '待审核',
          operation: ['编辑'],
          checkOperation: ['查看详情'],
        },
        {
          state: '审核中',
          operation: ['查看详情'],
          checkOperation: ['立即审核'],
        },
        {
          state: '审核不通过',
          operation: ['编辑'],
          checkOperation: ['查看详情'],
        },
        {
          state: '审核通过',
          operation: ['供应商评价'],
          checkOperation: ['查看详情'],
        },
      ]
    },
    {
      progress: '供应商评价',
      auditStatus : [
        {
          state: '待审核',
          operation: ['编辑'],
          checkOperation: ['查看详情'],
        },
        {
          state: '审核中',
          operation: ['查看详情'],
          checkOperation: ['立即审核'],
        },
        {
          state: '审核不通过',
          operation: ['编辑'],
          checkOperation: ['查看详情'],
        },
        {
          state: '项目完结',
          operation: ['查看详情'],
          checkOperation: ['查看详情'],
        },
      ]
    },
    {
      progress: '年度入账计划',
      auditStatus : [
        {
          state: '待审核',
          operation: ['编辑'],
          checkOperation: ['查看详情'],
        },
        {
          state: '审核中',
          operation: ['查看详情'],
          checkOperation: ['立即审核'],
        },
        {
          state: '审核不通过',
          operation: ['编辑'],
          checkOperation: ['查看详情'],
        },
        {
          state: '审核通过',
          operation: ['实际入账'],
          checkOperation: ['查看详情'],
        },
      ]
    },
    {
      progress: '年度付款计划',
      auditStatus : [
        {
          state: '待审核',
          operation: ['编辑'],
          checkOperation: ['查看详情'],
        },
        {
          state: '审核中',
          operation: ['查看详情'],
          checkOperation: ['立即审核'],
        },
        {
          state: '审核不通过',
          operation: ['编辑'],
          checkOperation: ['查看详情'],
        },
        {
          state: '审核通过',
          operation: ['实际付款'],
          checkOperation: ['查看详情'],
        },
      ]
    }
  ],
  currentMenuIndex: 'overhaulSupervision',
  leftNavIndex: 'supervisionInitiate',
  formRoute: '/overhaulSupervision/supervisionHome'
}