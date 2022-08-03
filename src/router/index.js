import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  { 
    path: '/login', name: 'login', component: () => import('@/login/Login.vue') 
  },
  { //检查督办
    path: '/overhaulSupervision', 
    component: () => import('@/overhaulSupervision/index.vue'), 
    redirect:'/overhaulSupervision/supervisionHome',
    children: [
      { //检查督办 -- 督办单首页
        path: 'supervisionHome', component: () => import('@/overhaulSupervision/home/home.vue'), 
      },
      { //检查督办 -- 督办单发起
        path: 'supervisionInitiate', component: () => import('@/overhaulSupervision/supervisionInitiate/supervisionInitiate.vue'),
        redirect: '/overhaulSupervision/supervisionInitiate/supervisionInitiateCurrent',
        children: [
          {path: 'supervisionInitiateCurrent', component: () => import('@/overhaulSupervision/supervisionInitiate/current.vue') },
          {path: 'supervisionInitiateAll', component: () => import('@/overhaulSupervision/supervisionInitiate/All.vue') },
          {path: 'supervisionInitiateInit', component: () => import('@/overhaulSupervision/supervisionInitiate/init.vue') },
          {path: 'supervisionInitiateDetail', component: () => import('@/overhaulSupervision/supervisionInitiate/detail.vue') }
        ]
      },
      { //检查督办 -- 督办单开工许可
        path: 'supervisionPermission', component: () => import('@/overhaulSupervision/supervisionPermission/supervisionPermission.vue'),
        redirect: '/overhaulSupervision/supervisionPermission/supervisionPermissionCurrent',
        children: [
          {path: 'supervisionPermissionCurrent', component: () => import('@/overhaulSupervision/supervisionPermission/current.vue') },
          {path: 'supervisionPermissionAll', component: () => import('@/overhaulSupervision/supervisionPermission/All.vue') },
          {path: 'supervisionPermissionDetail', component: () => import('@/overhaulSupervision/supervisionPermission/detail.vue') }
        ]
      },
      { //检查督办 -- 督办单处理
        path: 'supervisionDispose', component: () => import('@/overhaulSupervision/supervisionDispose/supervisionDispose.vue'), 
        redirect: '/overhaulSupervision/supervisionDispose/supervisionDisposeCurrent',
        children: [
          {path: 'supervisionDisposeCurrent', component: () => import('@/overhaulSupervision/supervisionDispose/current.vue') },
          {path: 'supervisionDisposeAll', component: () => import('@/overhaulSupervision/supervisionDispose/All.vue') },
          {path: 'supervisionDisposeDetail', component: () => import('@/overhaulSupervision/supervisionDispose/detail.vue') }
        ]
      },
      { //检查督办 -- 督办单查看
        path: 'supervisionLookOver', component: () => import('@/overhaulSupervision/supervisionLookOver/supervisionLookOver.vue'),
        redirect: '/overhaulSupervision/supervisionLookOver/supervisionLookOverAll',
        children: [
          {path: 'supervisionLookOverAll', component: () => import('@/overhaulSupervision/supervisionLookOver/All.vue') },
          {path: 'supervisionLookOverDetail', component: () => import('@/overhaulSupervision/supervisionLookOver/detail.vue') }
        ] 
      },
      { //检查督办 -- 督办单统计
        path: 'supervisionStatistics', component: () => import('@/overhaulSupervision/supervisionStatistics/supervisionStatistics.vue'), 
        redirect: '/overhaulSupervision/supervisionStatistics/All',
        children: [
          {path: 'All', component: () => import('@/overhaulSupervision/supervisionStatistics/All.vue') },
          {path: 'byPlant', component: () => import('@/overhaulSupervision/supervisionStatistics/byPlant.vue') },
          {path: 'byFan', component: () => import('@/overhaulSupervision/supervisionStatistics/byFan.vue') }
        ]
      },
      { //检查督办 -- 定检计划策略
        path: 'supervisionPlan', component: () => import('@/overhaulSupervision/supervisionPlan/supervisionPlan.vue'), 
        redirect: '/overhaulSupervision/supervisionPlan/supervisionPlanAll',
        children: [
          {path: 'supervisionPlanAll', component: () => import('@/overhaulSupervision/supervisionPlan/All.vue') },
          {path: 'supervisionPlanDetail', component: () => import('@/overhaulSupervision/supervisionPlan/detail.vue') }
        ]
      },
      { //检查督办 -- 计划任务管理
        path: 'supervisionTaskManage', component: () => import('@/overhaulSupervision/supervisionTaskManage/supervisionTaskManage.vue'), 
      },
      // { //检查督办 -- 部件科目管理
      //   path: 'partManage', component: () => import('@/overhaulSupervision/partManage/partManage.vue'), 
      // },
    ]
  },
  { //停机记录
    path: '/haltRecord', 
    component: () => import('@/haltRecord/index.vue'), 
    redirect:'/haltRecord/list',
    children: [
      { // 列表
        path: 'list', component: () => import('@/haltRecord/list/index.vue'),
        redirect: '/haltRecord/list/current',
        children: [
          {path: 'current', component: () => import('@/haltRecord/list/current.vue') },
          {path: 'all', component: () => import('@/haltRecord/list/all.vue') },
          {path: 'detail', component: () => import('@/haltRecord/list/detail.vue') }
        ]
      },
      { //停机记录 -- 停机记录统计
        path: 'haltStatistics', component: () => import('@/haltRecord/haltStatistics/HaltStatistics.vue'), 
        redirect: '/haltRecord/haltStatistics/All',
        children: [
          {path: 'All', component: () => import('@/haltRecord/haltStatistics/All.vue') },
          {path: 'byPlant', component: () => import('@/haltRecord/haltStatistics/byPlant.vue') },
          {path: 'byFan', component: () => import('@/haltRecord/haltStatistics/byFan.vue') }
        ]
      },
      { //停机记录 -- 风机故障统计
        path: 'malfunctionStatistics', component: () => import('@/haltRecord/malfunctionStatistics/MalfunctionStatistics.vue')
      }
    ]
  },
  { //生产运营指标
    path: '/productionIndex', 
    component: () => import('@/productionIndex/index.vue'), 
    redirect:'/productionIndex/windPowerDataQuery',
    children: [
      { //生产运营指标 -- 风电指标查询
        path: 'windPowerDataQuery', component: () => import('@/productionIndex/windPowerDataQuery/WindPowerDataQuery.vue')
      },
      { //生产运营指标 -- 定制报表
        path: 'customReports', component: () => import('@/productionIndex/customReports/CustomReports.vue'), 
      },
    ]
  },
  { //运行指标
    path: '/operatingIndex', 
    component: () => import('@/operatingIndex/index.vue'), 
    redirect:'/operatingIndex/overheatMonitor',
    children: [
      { //运行指标 -- 风机超温监视
        path: 'overheatMonitor', component: () => import('@/operatingIndex/overheatMonitor/OverheatMonitor.vue'), 
        redirect:'/operatingIndex/overheatMonitor/home',
        children: [
         { path: 'home', component: () => import('@/operatingIndex/overheatMonitor/Home.vue') }, 
         { path: 'plant', component: () => import('@/operatingIndex/overheatMonitor/Plant.vue') }, 
         { path: 'apparatus', component: () => import('@/operatingIndex/overheatMonitor/Apparatus.vue') }, 
        ]
      },
      { //运行指标 -- 风机超压监视
        path: 'overpressure', component: () => import('@/operatingIndex/overpressure/Overpressure.vue'), 
        redirect:'/operatingIndex/overpressure/home',
        children: [ 
         { path: 'home', component: () => import('@/operatingIndex/overpressure/Home.vue') }, 
         { path: 'plant', component: () => import('@/operatingIndex/overpressure/Plant.vue') },  
         { path: 'apparatus', component: () => import('@/operatingIndex/overpressure/Apparatus.vue') }, 
        ]   
      },
      { //运行指标 -- 风机超速监视
        path: 'overspeed', component: () => import('@/operatingIndex/overspeed/Overspeed.vue'), 
        redirect:'/operatingIndex/overspeed/home',
        children: [
         { path: 'home', component: () => import('@/operatingIndex/overspeed/Home.vue') }, 
         { path: 'plant', component: () => import('@/operatingIndex/overspeed/Plant.vue') },  
         { path: 'apparatus', component: () => import('@/operatingIndex/overspeed/Apparatus.vue') }, 
        ]   
      },
      { //运行指标 -- 偏航次数统计
        path: 'yawStatistics', component: () => import('@/operatingIndex/yawStatistics/YawStatistics.vue'), 
        redirect:'/operatingIndex/yawStatistics/home',
        children: [
         { path: 'home', component: () => import('../operatingIndex/yawStatistics/Home.vue') }, 
         { path: 'plant', component: () => import('@/operatingIndex/yawStatistics/Plant.vue') },  
         { path: 'apparatus', component: () => import('@/operatingIndex/yawStatistics/Apparatus.vue') }, 
        ]   
      },
      { //运行指标 -- 可复位故障统计
        path: 'malfunctionStatistics', component: () => import('@/operatingIndex/malfunctionStatistics/MalfunctionStatistics.vue'), 
        redirect:'/operatingIndex/malfunctionStatistics/home',
        children: [
         { path: 'home', component: () => import('../operatingIndex/malfunctionStatistics/Home.vue') }, 
         { path: 'plant', component: () => import('@/operatingIndex/malfunctionStatistics/Plant.vue') },  
         { path: 'apparatus', component: () => import('@/operatingIndex/malfunctionStatistics/Apparatus.vue') }, 
        ] 
      },
      { //运行指标 -- 可靠性指标统计
        path: 'reliabilityStatistics', component: () => import('@/operatingIndex/reliabilityStatistics/ReliabilityStatistics.vue'), 
        redirect:'/operatingIndex/reliabilityStatistics/home',
        children: [
         { path: 'home', component: () => import('../operatingIndex/reliabilityStatistics/Home.vue') }, 
         { path: 'plant', component: () => import('@/operatingIndex/reliabilityStatistics/Plant.vue') },  
         { path: 'apparatus', component: () => import('@/operatingIndex/reliabilityStatistics/Apparatus.vue') }, 
        ] 
      },
      { //运行指标 -- 风机预警统计
        path: 'earlyWarning', component: () => import('@/operatingIndex/earlyWarning/EarlyWarning.vue'), 
        redirect:'/operatingIndex/earlyWarning/home',
        children: [
         { path: 'home', component: () => import('../operatingIndex/earlyWarning/Home.vue') }, 
         { path: 'plant', component: () => import('@/operatingIndex/earlyWarning/Plant.vue') },  
         { path: 'apparatus', component: () => import('@/operatingIndex/earlyWarning/Apparatus.vue') }, 
        ] 
      },
      { //运行指标 -- 风机故障诊断
        path: 'malfunctionDiagnose', component: () => import('@/operatingIndex/malfunctionDiagnose/MalfunctionDiagnose.vue'), 
      },
      { //运行指标 -- 调度限电查询
        path: 'limitedPowerQuery', component: () => import('@/operatingIndex/limitedPowerQuery/LimitedPowerQuery.vue'), 
      },
      { //运行指标 -- 试运行限功率查询
        path: 'tryPowerLimitation', component: () => import('@/operatingIndex/tryPowerLimitation/TryPowerLimitation.vue'), 
      },
      { //运行指标 -- 主动限功率查询
        path: 'initiativePowerLimitation', component: () => import('@/operatingIndex/initiativePowerLimitation/InitiativePowerLimitation.vue'), 
      },
      { //运行指标 -- 通讯中断查询
        path: 'communicationOutage', component: () => import('@/operatingIndex/communicationOutage/CommunicationOutage.vue'), 
      },
    ]
  },
  { // 数据管理
    path: '/dataManagement', 
    component: () => import('@/dataManagement/index.vue'), 
  },
  { //设备管理
    path: '/deviceManagement', 
    component: () => import('@/deviceManagement/index.vue'), 
    redirect:'/deviceManagement/deviceType',
    children: [
      // { //设备管理 -- 设备类型管理
      //   path: 'deviceType', component: () => import('@/deviceManagement/deviceType/deviceType.vue')
      // },
      // { //设备管理 -- 设备位置管理
      //   path: 'deviceLocaltion', component: () => import('@/deviceManagement/deviceLocaltion/deviceLocaltion.vue'), 
      //   redirect: '/deviceManagement/deviceLocaltion/list',
      //   children: [
      //     {path: 'list', component: () => import('@/deviceManagement/deviceLocaltion/list.vue') },
      //     {path: 'detail', component: () => import('@/deviceManagement/deviceLocaltion/detail.vue') }
      //   ]
      // },
      { //设备管理 -- 设备台账
        path: 'deviceLedger', component: () => import('@/deviceManagement/deviceLedger/deviceLedger.vue'), 
        redirect: '/deviceManagement/deviceLedger/list',
        children: [
          {path: 'list', component: () => import('@/deviceManagement/deviceLedger/list.vue') },
          {path: 'detail', component: () => import('@/deviceManagement/deviceLedger/detail.vue') }
        ]
      },
      { //设备管理 -- 设备文档
        path: 'deviceDocument', component: () => import('@/deviceManagement/deviceDocument/deviceDocument.vue'), 
        redirect: '/deviceManagement/deviceDocument/list',
        children: [
          {path: 'list', component: () => import('@/deviceManagement/deviceDocument/list.vue') },
          {path: 'detail', component: () => import('@/deviceManagement/deviceDocument/detail.vue') }
        ]
      },
      { //设备管理 -- 故障知识库
        path: 'faultKnowledgeBase', component: () => import('@/deviceManagement/faultKnowledgeBase/faultKnowledgeBase.vue')
      },
      { //设备管理 -- 部件科目管理
        path: 'partSuject', component: () => import('@/deviceManagement/partSuject/partSuject.vue')
      },
    ]
  },
  { //项目管理
    path: '/expendManagement', 
    component: () => import('@/expendManagement/index.vue'), 
    redirect:'/expendManagement/overview',
    children: [
      { //项目管理 -- 预算总览
        path: 'overview', component: () => import('@/expendManagement/overview/Overview.vue'), 
      },
      { //项目管理 -- 预算编制
        path: 'authorizedStrength', component: () => import('@/expendManagement/authorizedStrength/AuthorizedStrength.vue'), 
      },
      { //项目管理 -- 项目管理
        path: 'management', component: () => import('@/expendManagement/management/Management.vue'),
        redirect:'/expendManagement/management/home',
        children: [
          { //项目管理 -- 项目管理 -- 首页
            path: 'home', component: () => import('@/expendManagement/management/Home.vue'), 
          },
          { //项目管理 -- 项目管理 -- 项目详情
            path: 'managementDetails', component: () => import('@/expendManagement/management/ManagementDetails.vue'), 
          },
        ]
      },
      { //项目管理 -- 项目管理（管理员）
        path: 'adminManagement', component: () => import('@/expendManagement/management/Management.vue'),
        redirect:'/expendManagement/adminManagement/home',
        children: [
          {//项目管理 -- 项目管理（管理员）-- 首页
            path: 'home', component: () => import('@/expendManagement/management/adminHome.vue'), 
          },
          {//项目管理 -- 项目管理（管理员）-- 项目审批
            path: 'adminManagementCheck', component: () => import('@/expendManagement/management/adminManagementCheck.vue'), 
          },
        ]
      },
      { //项目管理 -- 月度入账计划
        path: 'monthlyIncome', component: () => import('@/expendManagement/monthlyIncome/MonthlyIncome.vue'), 
        redirect:'/expendManagement/monthlyIncome/home',
        children: [
          {//项目管理 -- 月度入账计划 -- 首页
            path: 'home', component: () => import('@/expendManagement/monthlyIncome/IncomeHome.vue'), 
          },
          {//项目管理 -- 月度入账计划 -- 新建入账计划
            path: 'monthlyIncomeNewPlan', component: () => import('@/expendManagement/monthlyIncome/MonthlyIncomeNewPlan.vue'), 
          },
          {//项目管理 -- 月度入账计划 -- 添加入账记录
            path: 'monthlyIncomeNewRecord', component: () => import('@/expendManagement/monthlyIncome/MonthlyIncomeNewRecord.vue'), 
          },
        ]
      },
      { //项目管理 -- 月度入账计划审核
        path: 'adminMonthlyIncome', component: () => import('@/expendManagement/monthlyIncome/MonthlyIncome.vue'), 
        redirect:'/expendManagement/adminMonthlyIncome/home',
        children: [
          {//项目管理 -- 月度入账计划审核 -- 首页
            path: 'home', component: () => import('@/expendManagement/monthlyIncome/AdminIncomeHome.vue'), 
          },
          {//项目管理 -- 月度入账计划审核 -- 审核入账计划
            path: 'adminMonthlyIncomeNewPlan', component: () => import('@/expendManagement/monthlyIncome/AdminMonthlyIncomeNewPlan.vue'), 
          },
        ]
      },
      { //项目管理 -- 月度付款计划
        path: 'monthlyPayment', component: () => import('@/expendManagement/monthlyPayment/MonthlyPayment.vue'), 
        redirect:'/expendManagement/monthlyPayment/home',
        children: [
          {//项目管理 -- 月度付款计划审核 -- 首页
            path: 'home', component: () => import('@/expendManagement/monthlyPayment/PaymentHome.vue'), 
          },
          {//项目管理 -- 月度付款计划 -- 新建付款计划
            path: 'monthlyPaymentNewPlan', component: () => import('@/expendManagement/monthlyPayment/MonthlyPaymentNewPlan.vue'), 
          },
          {//项目管理 -- 月度付款计划审核 -- 添加付款记录
            path: 'monthlyPaymentNewRecord', component: () => import('@/expendManagement/monthlyPayment/MonthlyPaymentNewRecord.vue'), 
          },
        ]
      },
      { //项目管理 -- 月度付款计划审核
        path: 'adminMonthlyPayment', component: () => import('@/expendManagement/monthlyPayment/MonthlyPayment.vue'), 
        redirect:'/expendManagement/adminMonthlyPayment/home',
        children: [
          {//项目管理 -- 月度付款计划审核 -- 首页
            path: 'home', component: () => import('@/expendManagement/monthlyPayment/AdminPaymentHome.vue'), 
          },
          {//项目管理 -- 月度付款计划审核 -- 审核付款计划
            path: 'adminMonthlyPaymentNewPlan', component: () => import('@/expendManagement/monthlyPayment/AdminMonthlyPaymentNewPlan.vue'), 
          },
        ]
      },
      { //项目管理 -- 采购计划管理
        path: 'purchase', component: () => import('@/expendManagement/purchase/Purchase.vue'), 
        redirect:'/expendManagement/purchase/home',
        children: [
          { //项目管理 -- 采购计划管理 -- 首页
            path: 'home', component: () => import('@/expendManagement/purchase/PurchaseHome.vue'), 
          },
          { //项目管理 -- 采购计划管理 -- 采购计划立项
            path: 'PurchaseNewPlan', component: () => import('@/expendManagement/purchase/PurchaseNewPlan.vue'), 
          },
        ]
      },
      { //项目管理 -- 采购计划审核
        path: 'adminPurchase', component: () => import('@/expendManagement/purchase/Purchase.vue'), 
        redirect:'/expendManagement/adminPurchase/home',
        children: [
          {//项目管理 -- 采购计划审核 -- 首页
            path: 'home', component: () => import('@/expendManagement/purchase/AdminPurchaseHome.vue'), 
          },
          {//项目管理 -- 采购计划审核 -- 采购计划立项
            path: 'AdminPurchaseCheck', component: () => import('@/expendManagement/purchase/AdminPurchaseCheck.vue'), 
          },
        ]
      },
      { //项目管理 -- 采购计划审核 -- 采购计划立项
        path: 'adminPurchaseCheck', component: () => import('../expendManagement/purchase/AdminPurchaseCheck.vue'), 
      },
    ]
  },
  { //系统设置
    path: '/systemConfiguration', component: () => import('@/systemConfiguration/index.vue'), 
    redirect:'/systemConfiguration/organization',
    children: [
      { path: 'organization', component: () => import('@/systemConfiguration/organization/organization.vue')},
      { path: 'rolePermissions', component: () => import('@/systemConfiguration/rolePermissions/rolePermissions.vue')},
      { path: 'user', component: () => import('@/systemConfiguration/user/user.vue')},
    ]
  },
  { //帮助
    path: '/help', component: () => import('@/views/help/search.vue'), 
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
