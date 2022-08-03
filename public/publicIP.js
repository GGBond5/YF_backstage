// api合成规则
// 开发环境 url = `http://${window.publicIP.ip[0]}${window.publicIP.port[0]}/${window.publicIP.path[0]}`;
// 生产环境 url = `http://${window.publicIP.ip[1]}${window.publicIP.port[1]}/${window.publicIP.path[1]}`;

window.publicIP = { // MySQL数据
    "ip":["192.168.10.181","192.168.10.181"],
    "port":[":10002",":10002"],
    "path": ["",""]
}

window.title = '基于数据驱动的自主检修过程监管和决策支持系统'
window.duration = 5000 // 实时数据刷新间隔 ms
window.durationHis = 60000 // 历史曲线数据刷新间隔 ms
window.interval = 60000 // 历史数据取点间隔 ms
