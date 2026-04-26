const riskTree = {
  id: 'root',
  title: '抽水蓄能电站风险管控处理演示系统',
  type: 'root',
  children: [
    {
      id: 'construction-prep',
      title: '施工准备环节',
      type: 'module',
      summary: '临建布置、施工供能、道路桥梁、生产系统与水保工程风险管控。',
      children: [
        {
          id: 'living-production-layout',
          title: '生产生活设施布置',
          type: 'scene',
          summary: '营地、仓库、设备堆场等临时设施选址与运行安全。',
          children: [
            {
              id: 'camp-location',
              title: '营选地址',
              type: 'activity',
              summary: '核查营地位置与水文、地质、爆破及疏散条件的匹配性。',
              children: [
                {
                  id: 'extreme-flood',
                  title: '超标准洪水',
                  type: 'risk',
                  level: '重大风险因素',
                  summary: '营地处于河谷、沟口、库岸或低洼地带时，极端降雨及上游来水可能导致快速漫淹。',
                  accidents: ['淹水', '溺水', '爆炸'],
                  requirements: [
                    '营地、炸药库、油料库、材料库不得布置在洪水、泥石流、滑坡等灾害高风险区域。',
                    '选址前应收集气象、水文、地形、地质及周边排洪条件资料，形成选址安全论证记录。',
                    '防汛责任、监测预警、撤离路线、应急物资和夜间值守要求应落实到责任岗位。'
                  ],
                  controls: [
                    '按防洪标准复核营地高程，设置截排水沟、挡水坎、排涝泵和应急照明。',
                    '在低洼通道、沟谷入口、库岸边坡设置水位警戒线、警示标识和封控设施。',
                    '汛期开展每日巡查，强降雨、上游泄洪、库水位异常时立即启动预警响应。',
                    '火工品、油料、气瓶等危险物品实行独立库区管理，与住宿区、办公区保持安全距离。',
                    '组织防汛撤离演练，确保人员熟悉集合点、撤离路线和清点流程。'
                  ],
                  emergency: [
                    '接到红色预警或发现漫水迹象时，立即停止作业，切断非必要电源，组织人员按路线撤离。',
                    '优先转移火工品、油料、气瓶等危险物品；无法转移时封控现场并设置警戒区。',
                    '对被困人员实施救援时应配备救生绳、救生衣、照明和通信设备，严禁无防护涉水施救。',
                    '险情解除后，由安全、技术、设备管理人员联合检查，确认无坍塌、漏电、污染和爆炸风险后恢复使用。'
                  ]
                },
                {
                  id: 'unsafe-camp-location',
                  title: '营选地址',
                  type: 'risk',
                  level: '较大风险因素',
                  summary: '营地与边坡、施工道路、爆破区域、材料仓库距离不足，可能诱发坍塌、火灾和交通伤害。',
                  accidents: ['坍塌', '物体打击', '火灾'],
                  requirements: ['营地选址应避开高边坡、危岩体、行洪通道和爆破警戒范围。', '住宿、办公、仓储、停车和加工区域应分区布置。'],
                  controls: ['开展选址复核和现场踏勘。', '完善排水、照明、消防、安防和疏散标识。', '建立营地日常巡查与隐患闭环记录。'],
                  emergency: ['发现边坡变形、落石、积水或火情时立即撤离并封控。', '组织人员清点，报告项目应急值班室。']
                }
              ]
            },
            {
              id: 'explosives-storehouse',
              title: '火工品仓库',
              type: 'activity',
              summary: '爆破器材库区的距离、消防、防雷、防静电和治安管控。',
              children: [risk('explosives-fire', '火工品仓储火灾爆炸', '重大风险因素', ['爆炸', '火灾', '灼烫'])]
            },
            {
              id: 'material-equipment-warehouse',
              title: '其他材料设备仓库',
              type: 'activity',
              summary: '材料堆放、设备停放、危险化学品分类和消防通道管理。',
              children: [risk('warehouse-collapse', '材料堆码失稳', '一般风险因素', ['物体打击', '坍塌'])]
            }
          ]
        },
        scene('temporary-power', '施工供电工程', '临时用电、变电站、配电线路与检修作业。', [
          risk('power-shock', '临时用电触电', '较大风险因素', ['触电', '火灾'])
        ]),
        scene('construction-water', '施工供水工程', '供水管线、泵站、蓄水池和压力试验。', [
          risk('water-pipeline-burst', '压力管线爆裂', '较大风险因素', ['物体打击', '淹水'])
        ]),
        scene('air-ventilation', '施工供风/通风工程', '空压站、通风机、风管和受限空间供风。', [
          risk('ventilation-failure', '通风失效', '较大风险因素', ['窒息', '中毒'])
        ]),
        scene('road-work', '道路工程', '施工道路开挖、边坡防护、运输通行和临边防护。', [
          risk('road-slope-collapse', '道路边坡失稳', '较大风险因素', ['坍塌', '车辆伤害'])
        ]),
        scene('bridge-work', '桥梁工程', '桥梁基础、支架、吊装、临边和高处作业。', [
          risk('bridge-fall', '桥面临边坠落', '较大风险因素', ['高处坠落', '物体打击'])
        ]),
        scene('aggregate-system', '砂石骨料生产系统', '破碎、筛分、输送、除尘和设备检修。', [
          risk('belt-conveyor-injury', '带式输送机卷入', '较大风险因素', ['机械伤害'])
        ]),
        scene('concrete-system', '混凝土生产系统', '拌合楼、料仓、皮带机、粉料罐和车辆通行。', [
          risk('silo-dust', '粉料罐扬尘与坠落', '一般风险因素', ['高处坠落', '粉尘伤害'])
        ]),
        scene('building-work', '房建工程', '办公生活用房、模板支撑、脚手架、消防和临边洞口。', [
          risk('scaffold-instability', '脚手架失稳', '较大风险因素', ['坍塌', '高处坠落'])
        ]),
        scene('soil-water-conservation', '水保工程', '弃渣场、截排水、植被恢复和汛期防护。', [
          risk('spoil-yard-slide', '弃渣场滑塌', '较大风险因素', ['坍塌', '淹埋'])
        ])
      ]
    },
    module('reservoir', '水库工程', '围堰、坝肩、库岸、边坡与防洪度汛。', [
      scene('cofferdam', '围堰施工', '围堰填筑、防渗、拆除和汛期巡查。', [risk('cofferdam-overtop', '围堰漫顶', '重大风险因素', ['淹水', '溺水'])]),
      scene('bank-slope', '库岸边坡', '库岸开挖、支护、监测和排水。', [risk('bank-slide', '库岸滑坡', '较大风险因素', ['坍塌', '物体打击'])])
    ]),
    module('water-conveyance', '输水系统工程', '引水隧洞、压力管道、竖井和调压室施工。', [
      scene('tunnel-excavation', '隧洞开挖', '钻爆、支护、排水、通风和有害气体监测。', [risk('tunnel-collapse', '隧洞塌方', '重大风险因素', ['坍塌', '窒息'])]),
      scene('shaft-work', '竖井施工', '提升系统、临边防护、坠物控制和通信联络。', [risk('shaft-fall', '竖井坠落', '重大风险因素', ['高处坠落', '物体打击'])])
    ]),
    module('underground-powerhouse', '地下厂房工程', '洞室群开挖、支护、交叉作业和大型吊装。', [
      scene('cavern-excavation', '主厂房洞室', '大跨度洞室开挖支护和围岩监测。', [risk('cavern-rockfall', '洞室掉块', '较大风险因素', ['物体打击', '坍塌'])])
    ]),
    module('surface-powerhouse', '地面厂房工程', '基坑、主体结构、脚手架、模板和交叉作业。', [
      scene('foundation-pit', '厂房基坑', '深基坑开挖、支护、降排水和临边防护。', [risk('pit-instability', '基坑支护失稳', '较大风险因素', ['坍塌', '高处坠落'])])
    ]),
    module('electromechanical', '机电安装', '水泵水轮机、发电电动机、起重与电气试验。', [
      scene('unit-installation', '机组安装', '大件吊装、盘车、找正和受限空间作业。', [risk('heavy-lifting', '大型设备吊装失控', '重大风险因素', ['起重伤害', '物体打击'])])
    ]),
    module('metal-structure', '金属结构设备安装', '闸门、启闭机、压力钢管和焊接防腐。', [
      scene('gate-installation', '闸门安装', '吊装、焊接、临边、高处和水下作业。', [risk('gate-lifting', '闸门吊装偏载', '较大风险因素', ['起重伤害', '物体打击'])])
    ]),
    module('tbm', 'TBM作业', 'TBM进场运输、组装、掘进、换刀和退场。', [
      scene('tbm-driving', 'TBM掘进', '设备运行、皮带出渣、通风排水和超前地质预报。', [risk('tbm-inrush', '突水突泥', '重大风险因素', ['淹水', '坍塌', '窒息'])]),
      scene('tbm-cutter-change', '换刀作业', '刀盘检修、能量隔离、受限空间和高压风险。', [risk('cutter-head-energy', '刀盘能量未隔离', '较大风险因素', ['机械伤害', '挤压伤害'])])
    ])
  ]
};

function module(id, title, summary, children) {
  return { id, title, type: 'module', summary, children };
}

function scene(id, title, summary, children) {
  return { id, title, type: 'scene', summary, children };
}

function risk(id, title, level, accidents) {
  return {
    id,
    title,
    type: 'risk',
    level,
    summary: '作业条件变化、现场组织不到位或防护措施缺失时，可能造成安全事故。',
    accidents,
    requirements: ['作业前完成风险辨识和安全技术交底。', '关键工序落实专人监护，异常情况立即停工处置。'],
    controls: ['完善专项方案、验收记录和现场巡查。', '设置警戒、隔离、防护、监测和明显标识。', '将隐患整改纳入闭环台账。'],
    emergency: ['立即停止相关作业并组织人员撤离。', '报告项目应急值班室，按预案开展警戒、救援和复查。']
  };
}

window.riskTree = riskTree;
