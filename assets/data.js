const item = (id, name, base, options = {}) => ({
  id,
  name,
  base,
  extras: [],
  note: '',
  space: 'hard',
  responsibility: 'contract-outside',
  status: 'committed',
  ...options
});

export const expenseGroups = [
  {
    id: 'doors',
    name: '门窗类',
    description: '封窗、入户门与纱门',
    items: [
      item('doors-balcony-e3', '封阳台｜极景 E3，50 多平', 90000, {
        note: '主卧、儿童房四玻两胶一腔；北面三玻两腔；南面三玻一胶一腔'
      }),
      item('doors-bath-entry-windows', '双卫生间窗户＋入户门窗户', 1600, {
        note: '双层玻璃；原记录注明“楼下三无产品”'
      }),
      item('doors-entry-door', '入户大门｜星月神', 3800),
      item('doors-mesh-door', '门口金刚网纱门', 860)
    ]
  },
  {
    id: 'basic',
    name: '装修公司及基础施工',
    description: '合同主体、增项与基础辅材',
    items: [
      item('basic-contract', '装修公司硬装', 190000, {
        note: '不含卫生间卫浴，不含书房桌子',
        responsibility: 'contract'
      }),
      item('basic-custom-extra', '装修公司全屋定制增项｜兔宝宝柜子', 4500),
      item('basic-laundry-cabinet', '洗衣机铝板柜', 2000),
      item('basic-low-voltage-box', '弱电箱', 105),
      item('basic-wind-pipe', '防风管', 150),
      item('basic-access-control', '门禁安装', 400),
      item('basic-floor-acoustic', '地板隔音棉', 1400),
      item('basic-floor-film', '地板地膜', 400, {
        note: '叠加木地板背后的隔音垫，共 3 层'
      }),
      item('basic-angle-valves', '角阀 ×9', 200),
      item('basic-laundry-faucet', '洗衣机水龙头', 50),
      item('basic-switch-panels', '领普 E3 Pro 插座与开关面板', 1500, {
        note: '五孔 ×64、网线面板 ×4、空调 16A ×4，另单开 ×6、四孔 ×3'
      }),
      item('basic-track-socket', '小米轨道插座', 320),
      item('basic-breakers', '正泰 NB3 空气开关＋公牛汇流排', 500, {
        note: '配电箱'
      })
    ]
  },
  {
    id: 'finishes',
    name: '自购装修材料与主材',
    description: '灯具、卫浴及固定水电设备',
    items: [
      item('finish-prefilter', '米家前置过滤器', 250),
      item('finish-kitchen-sink', '九牧魔法师厨房水槽', 1000),
      item('finish-drying-racks', '米家晾衣架 2 Pro ×2', 1900),
      item('finish-dining-fan-light', '米家餐厅风扇灯｜36 寸', 350),
      item('finish-main-light', '主卧米家智能灯 Pro D60', 750),
      item('finish-study-light', '书房米家智能灯 D40', 280),
      item('finish-parent-light', '父母房领普智能灯 D50', 210),
      item('finish-child-light', '儿童房雷士儿童灯', 320),
      item('finish-living-light', '客厅漫反射灯', 1250),
      item('finish-entry-light', '入户门厅灯', 100),
      item('finish-sensor-light', '门口感应灯', 45),
      item('finish-downlights', '9W 筒灯 ×30', 740),
      item('finish-wall-lights', '主卧壁灯 ×2', 120),
      item('finish-vanities', '九牧卫浴柜 1m ×2', 3000),
      item('finish-toilet-hengjie', '恒洁 H360', 1500),
      item('finish-toilet-faenza', '法恩莎 25 坑距马桶', 600),
      item('finish-shower-26213', '九牧花洒 26213', 1150),
      item('finish-shower-36647', '九牧花洒 36647', 550),
      item('finish-bath-heaters', '小米暖风机 P1 ×2', 1600)
    ]
  },
  {
    id: 'smart',
    name: '智能家居',
    description: '传感器、网络、窗帘与智能控制',
    items: [
      item('smart-control-screens', '米家中控屏三控 ×3', 1000, { space: 'tech', responsibility: 'owner' }),
      item('smart-linpo-e3', '领普 E3 Pro 双控开关 ×10', 600, { space: 'tech', responsibility: 'owner' }),
      item('smart-mi-pro-switch', '米家智能开关 Pro 双控 ×2', 170, { space: 'tech', responsibility: 'owner' }),
      item('smart-linpo-s5', '领普 S5 三控智能开关 ×3', 390, { space: 'tech', responsibility: 'owner' }),
      item('smart-camera', '小米摄像头 4 变焦版', 280, { space: 'tech', responsibility: 'owner' }),
      item('smart-motion-top', '领普 ES5 顶装人体传感器 ×5', 350, { space: 'tech', responsibility: 'owner' }),
      item('smart-motion-side', '领普 ES5 侧装人体传感器 ×2', 120, { space: 'tech', responsibility: 'owner' }),
      item('smart-water-leak', '小米水浸卫士 ×6', 360, { space: 'tech', responsibility: 'owner' }),
      item('smart-temp-switch', '领普 KS2 温湿度＋无线开关 ×3', 66, { space: 'tech', responsibility: 'owner' }),
      item('smart-doorbell-switch', '平头熊无线开关门铃', 15, { space: 'tech', responsibility: 'owner' }),
      item('smart-smoke', '小米烟感卫士 2', 140, { space: 'tech', responsibility: 'owner' }),
      item('smart-door-sensor', '小米门窗传感器 2', 30, { space: 'tech', responsibility: 'owner' }),
      item('smart-router-6500', '小米路由器 BE6500 Pro', 370, { space: 'tech', responsibility: 'owner' }),
      item('smart-router-3600', '小米路由器 BE3600 2.5G ×3', 390, { space: 'tech', responsibility: 'owner' }),
      item('smart-switch-network', '水星交换机', 100, { space: 'tech', responsibility: 'owner' }),
      item('smart-curtain-mi', '米家窗帘电机 3 Pro＋4m 轨道', 819, { space: 'tech', responsibility: 'owner' }),
      item('smart-curtain-linpo', '领普 CE1 窗帘电机＋3m 轨道 ×2', 499, { space: 'tech', responsibility: 'owner' }),
      item('smart-finger-robot', '手指机器人', 150, { space: 'tech', responsibility: 'owner' }),
      item('smart-window-opener', '大门外自动开窗器', 400, { space: 'tech', responsibility: 'owner' })
    ]
  },
  {
    id: 'appliances',
    name: '家电',
    description: '空调、厨电、洗护与清洁电器',
    items: [
      item('appliance-living-duct-ac', '客厅米家风管机 4 匹', 6900, {
        extras: [{ label: '加长铜管', amount: 800 }, { label: '延长面板', amount: 280 }],
        note: '主机 5000＋安装 1900', space: 'tech', responsibility: 'owner'
      }),
      item('appliance-main-duct-ac', '主卧米家风管机 3 匹＋新风模块', 5900, {
        note: '主机 4000＋安装 1900', space: 'tech', responsibility: 'owner'
      }),
      item('appliance-water-heater', '米家燃气热水器 P10', 1950, {
        extras: [{ label: '安装费', amount: 338 }, { label: '燃气表阀门', amount: 130 }],
        space: 'tech', responsibility: 'owner'
      }),
      item('appliance-hood', '米家净烟机 Pro 套装', 3500, {
        extras: [{ label: '安装费', amount: 260 }], space: 'tech', responsibility: 'owner'
      }),
      item('appliance-water-purifier', '米家净水器 1200G Pro 双出水', 1250, { space: 'tech', responsibility: 'owner' }),
      item('appliance-water-dispenser', '米家壁挂管线机', 750, { space: 'tech', responsibility: 'owner' }),
      item('appliance-dishwasher', '华凌洗碗机 VIE8 Max', 2100, { space: 'tech', responsibility: 'owner' }),
      item('appliance-tv', '小米 S Pro Mini LED 75 寸电视｜2025 款', 3700, {
        extras: [{ label: '附加费用', amount: 240 }], space: 'tech', responsibility: 'owner'
      }),
      item('appliance-robot', '米家扫拖机器人 6', 1900, { space: 'tech', responsibility: 'owner' }),
      item('appliance-laundry-set', '海尔统帅三分区 Pro Max 洗烘套装', 7000, { space: 'tech', responsibility: 'owner' }),
      item('appliance-lock', '米家门锁 M40 Pro', 1800, { space: 'tech', responsibility: 'owner' }),
      item('appliance-child-ac', '儿童房米家巨能省 Pro 空调 1.5 匹', 1700, {
        extras: [{ label: '安装费', amount: 150 }], space: 'tech', responsibility: 'owner'
      }),
      item('appliance-study-ac', '书房米家巨能省 Pro 空调 1.5 匹', 1660, {
        extras: [{ label: '安装费', amount: 150 }], space: 'tech', responsibility: 'owner'
      }),
      item('appliance-parent-ac', '父母房米家巨能省 Pro 空调大 1 匹', 1630, {
        extras: [{ label: '安装费', amount: 700 }], space: 'tech', responsibility: 'owner'
      })
    ]
  },
  {
    id: 'furniture',
    name: '家具与软装',
    description: '家具、窗帘、装饰与入住用品',
    items: [
      item('furniture-main-bed', '主卧床', 2400, { space: 'soft', responsibility: 'owner' }),
      item('furniture-main-mattress', '床垫｜8H 白金 Pro', 1600, { space: 'soft', responsibility: 'owner' }),
      item('furniture-main-nightstands', '主卧床头柜 ×2', 1120, { space: 'soft', responsibility: 'owner' }),
      item('furniture-child-bed', '次卧床', 1700, { space: 'soft', responsibility: 'owner' }),
      item('furniture-child-mattress', '床垫｜8H 儿童床垫', 1200, { space: 'soft', responsibility: 'owner' }),
      item('furniture-parent-bed', '父母房床', 1500, { space: 'soft', responsibility: 'owner' }),
      item('furniture-parent-mattress', '床垫｜8H 白金 Air', 1300, { space: 'soft', responsibility: 'owner' }),
      item('furniture-parent-nightstands', '床头柜 ×2', 500, { space: 'soft', responsibility: 'owner' }),
      item('furniture-tv-console', '电视柜', 1750, { space: 'soft', responsibility: 'owner' }),
      item('furniture-sofa', '全友真皮沙发', 2800, { space: 'soft', responsibility: 'owner' }),
      item('furniture-child-desk-chair', '儿童房黑白调 A2＋育才椅', 1100, { space: 'soft', responsibility: 'owner' }),
      item('furniture-study-desk', '书房定制书桌', 2350, { space: 'soft', responsibility: 'owner' }),
      item('furniture-dining-table', '餐桌', 1850, { space: 'soft', responsibility: 'owner' }),
      item('furniture-dining-chairs', '餐椅', 1090, { space: 'soft', responsibility: 'owner' }),
      item('furniture-meter-art', '电表装饰画', 91, { space: 'soft', responsibility: 'owner' }),
      item('furniture-pullup-bar', '室内打孔单杠', 220, { space: 'soft', responsibility: 'owner' }),
      item('furniture-pullup-accessories', '单杠配件', 300, { space: 'soft', responsibility: 'owner' }),
      item('furniture-curtains', '窗帘', 3200, { space: 'soft', responsibility: 'owner' }),
      item('furniture-air-treatment', '除醛活性锰＋活性炭＋绿萝', 500, { space: 'soft', responsibility: 'owner' }),
      item('furniture-door-details', '门吸／门牌', 100, { space: 'soft', responsibility: 'owner' }),
      item('furniture-baskets', '书柜编织拉篮', 380, { space: 'soft', responsibility: 'owner' }),
      item('furniture-window-film', '卫生间窗户贴膜', 60, { space: 'soft', responsibility: 'owner' }),
      item('furniture-study-drawers', '书房抽屉柜', 500, { space: 'soft', responsibility: 'owner', status: 'later' }),
      item('furniture-child-drawers', '儿童房抽屉柜', 500, { space: 'soft', responsibility: 'owner', status: 'later' }),
      item('furniture-sofa-bed', '书房沙发床', 2000, { space: 'soft', responsibility: 'owner', status: 'later' }),
      item('furniture-gaming-chairs', '书房电竞椅 ×2', 3500, { space: 'soft', responsibility: 'owner', status: 'later' }),
      item('furniture-coffee-table', '茶几', 2000, { space: 'soft', responsibility: 'owner', status: 'later' }),
      item('furniture-rug', '地毯', 1000, { space: 'soft', responsibility: 'owner', status: 'later' }),
      item('furniture-reserve', '未知项备用', 2000, {
        note: '预留预算，尚未视为实际消费', space: 'soft', responsibility: 'owner', status: 'reserve'
      })
    ]
  },
  {
    id: 'later',
    name: '入住后待购',
    description: '适合入住后或双十一再购买，基本无甲醛影响',
    items: [
      item('later-fridge', '米家十字门冰箱', 2500, { space: 'later', responsibility: 'owner', status: 'later' }),
      item('later-oven', '米家烤箱', 1500, { space: 'later', responsibility: 'owner', status: 'later' }),
      item('later-dehumidifier', '除湿机', 1000, { space: 'later', responsibility: 'owner', status: 'later' }),
      item('later-toilet-seat', '主卧智能马桶盖', 1500, { space: 'later', responsibility: 'owner', status: 'later' }),
      item('later-microwave', '微波炉', 500, { space: 'later', responsibility: 'owner', status: 'later' }),
      item('later-shoe-cabinet', '门口钢制鞋柜', 300, { space: 'later', responsibility: 'owner', status: 'later' }),
      item('later-door-mat', '门口地毯', 300, { space: 'later', responsibility: 'owner', status: 'later' }),
      item('later-fridge-gap-cabinet', '冰箱边夹缝柜', 500, { space: 'later', responsibility: 'owner', status: 'later' }),
      item('later-kitchen-rack', '厨用电器架', 700, { space: 'later', responsibility: 'owner', status: 'later' }),
      item('later-bay-cabinet', '餐厅飘窗柜', 1000, { space: 'later', responsibility: 'owner', status: 'later' }),
      item('later-balcony-sink', '阳台水池柜', 400, { space: 'later', responsibility: 'owner', status: 'later' }),
      item('later-pegboard', '定制洞洞板', 3000, { space: 'later', responsibility: 'owner', status: 'later' }),
      item('later-enamel-board', '定制珐琅板', 3000, { space: 'later', responsibility: 'owner', status: 'later' }),
      item('later-trampoline', '蹦床', 1000, { space: 'later', responsibility: 'owner', status: 'later' }),
      item('later-disposal', '垃圾处理器', 1200, { space: 'later', responsibility: 'owner', status: 'later' })
    ]
  }
];

export const screeningStages = [
  {
    name: '硬门槛筛选',
    description: '先用总预算、面积、房间数、区域与通勤半径排除明显不合适的房源。'
  },
  {
    name: '实地看房筛选',
    description: '核对真实户型、得房率、楼层采光、噪声、电梯入户、小区环境和车位。'
  },
  {
    name: '家庭决策筛选',
    description: '加入家属感受、全周期成本、缺点能否解决以及卖方谈价意愿，再决定是否进入终选。'
  }
];

export const preferenceDimensions = [
  { id: 'traffic', name: '交通通勤', weight: 15, description: '地铁距离、换乘次数、公交及驾车高峰时间' },
  { id: 'layout', name: '户型与朝向', weight: 20, description: '朝南房间、南北通透、动静分区与改造上限' },
  { id: 'usable', name: '使用面积', weight: 10, description: '套内面积、得房率和真正可用的收纳空间' },
  { id: 'totalCost', name: '全周期成本', weight: 20, description: '成交价、税费、中介费、装修、车位和缺陷治理' },
  { id: 'education', name: '教育匹配', weight: 10, description: '当年施教区、家庭学龄需求与政策确定性' },
  { id: 'amenities', name: '周边配套', weight: 5, description: '菜场、商场、医院、学校和日常步行可达性' },
  { id: 'community', name: '小区与物业', weight: 5, description: '容积率、绿化、公区、物业费和长期维护能力' },
  { id: 'maintenance', name: '房龄与维护', weight: 5, description: '建筑年代、管线、外立面、防水防潮与维修预期' },
  { id: 'elevator', name: '楼层与梯户', weight: 5, description: '楼层、总高、梯户比、候梯时间和入户体验' },
  { id: 'parking', name: '车位条件', weight: 5, description: '是否自有、租售价格、与楼栋距离及充电条件' }
];

export const historicalScoreRules = [
  { id: 'traffic', name: '交通', rule: '最高15分：地铁距离5分＋纯地铁时间5分＋高峰驾车时间5分，按距离、换乘和时长扣分。' },
  { id: 'layout', name: '户型', rule: '最高10分：三间朝南、户型方正、老人房安排合理可得满分。' },
  { id: 'surroundings', name: '周边', rule: '最高12分：景区、菜场／商场、医院、学校四项各0–3分。' },
  { id: 'community', name: '小区', rule: '0–5分：容积率、绿化、公共区域与物业的主观评估。' },
  { id: 'education', name: '教育', rule: '当时口径：姑苏一梯队10分、吴中一梯队8分、吴中二梯队6分。' },
  { id: 'age', name: '房龄', rule: '0–5分：建筑年代越新、未来维护预期越低，分数越高。' },
  { id: 'elevator', name: '梯户', rule: '最高5分：一梯一户满分，两梯三户减1分，两梯四户减2分，超高层再减1分。' },
  { id: 'parking', name: '车位', rule: '自带可用车位记1分，否则0分。' },
  { id: 'price', name: '总价', rule: '（450万元－房价或全周期成本）÷10万元；每便宜10万元增加1分。' },
  { id: 'special', name: '修正', rule: '花园、车库、超高得房率可加分；噪声、得房率偏低、入户狭窄等可减分。' }
];

export const homeCandidates = [
  {
    id: 'hemao-24f',
    name: '和茂苑一期24楼',
    buildingArea: 153,
    usableArea: 124,
    usableRate: '81%',
    askingPrice: 3300000,
    totalScore: 58,
    scores: { traffic: 8, layout: 8, surroundings: 10, community: 3, education: 10, age: 3, elevator: 3, parking: 1, price: 12, special: 0 },
    school: '沧浪新城第二实验小学＋立达中学 / 沧浪中学共享施教区',
    note: '4＋1 户型，空间大。',
    decisionReason: '未进入终选：330万元挂牌价较高，综合性价比不如后续房源。'
  },
  {
    id: 'hanhe-21f',
    name: '瀚河苑21楼',
    buildingArea: 143,
    usableArea: 108,
    usableRate: '75%',
    askingPrice: 3200000,
    totalScore: 63,
    scores: { traffic: 9, layout: 10, surroundings: 10, community: 3, education: 10, age: 4, elevator: 5, parking: 0, price: 13, special: -1 },
    school: '沧浪新城第二实验小学＋立达中学 / 沧浪中学共享施教区',
    note: '户型得分高、梯户比好。',
    decisionReason: '未进入终选：得房率只有75%，且家属不喜欢该板块。'
  },
  {
    id: 'yihewan-9f',
    name: '颐和湾花园9楼',
    buildingArea: 143,
    usableArea: 124,
    usableRate: '86%',
    askingPrice: 3100000,
    totalScore: 59.5,
    scores: { traffic: 8.5, layout: 6, surroundings: 10, community: 4, education: 6, age: 5, elevator: 5, parking: 1, price: 14, special: 0 },
    school: '吴中实验小学＋吴中区城西中学',
    note: '得房率高且带车位。',
    decisionReason: '未进入终选：户型不规整，书房过小，不符合家庭对长期功能的要求。'
  },
  {
    id: 'shuixie-3-1f',
    name: '阳光水榭三期1楼',
    buildingArea: 134,
    usableArea: 120,
    usableRate: '90%',
    askingPrice: 2950000,
    totalScore: 60,
    scores: { traffic: 7, layout: 8, surroundings: 10, community: 4, education: 6, age: 2, elevator: 5, parking: 1, price: 14, special: 3 },
    school: '碧波实验小学澄湖路校区＋吴中区碧波中学',
    note: '约100㎡花园、约35㎡车库、总高3层。',
    decisionReason: '进入终选后退出：卖方开始报价295万元，后来直接改报315万元，已无继续谈判空间。',
    finalist: true
  },
  {
    id: 'shuixie-5-3f',
    name: '阳光水榭五期3楼',
    buildingArea: 140,
    usableArea: 130,
    usableRate: '90%',
    askingPrice: 2400000,
    totalScore: 63,
    scores: { traffic: 10, layout: 7, surroundings: 8, community: 4, education: 6, age: 2, elevator: 4, parking: 0, price: 21, special: 1 },
    school: '碧波实验小学澄湖路校区＋吴中区碧波中学',
    note: '得房率高，240万元总价将价格项推到21分。',
    decisionReason: '未进入终选：高分主要是价格权重推高；户型南北不通透、楼层较低，不考虑价格时吸引力明显下降。'
  },
  {
    id: 'jiabao-9f',
    name: '嘉宝花园9楼',
    buildingArea: 161,
    usableArea: 133,
    usableRate: '82%',
    askingPrice: 2900000,
    totalScore: 61,
    scores: { traffic: 8, layout: 10, surroundings: 9, community: 3, education: 8, age: 3, elevator: 4, parking: 1, price: 16, special: -1 },
    school: '嘉宝不同分期对应苏苑实验小学或宝带实验小学；初中为吴中区迎春中学，需按楼号复核',
    note: '户型方正、面积大。',
    decisionReason: '未进入终选：一梯两户，入户通道狭窄，入户花园也较小，被最终购入的11楼房源替代。'
  },
  {
    id: 'jiabao-selected-11f',
    name: '嘉宝花园11楼',
    buildingArea: 165,
    usableArea: 142,
    usableRate: '86%',
    askingPrice: 2650000,
    purchasePrice: 2600000,
    totalScore: 61.5,
    scores: { traffic: 8, layout: 10, surroundings: 9, community: 3, education: 8, age: 3, elevator: 5, parking: 0, price: 18.5, special: -3 },
    school: '宝带实验小学＋吴中区迎春中学',
    note: '三南一北、两梯两户、面积充足。',
    decisionReason: '最终选择：专程去12楼查看同类系统窗的实际隔音效果，确认可以解决主要噪音问题，因此噪音疑虑被解除。',
    finalist: true,
    selected: true
  }
];
