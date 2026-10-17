// ===== Vol.1 pack: the 15 styles from the first film, re-registered into the ST library =====
// The vol.1 scene files push into SCENES; move them into ST with stable, descriptive keys so films can PICK them.
(() => {
  const V1META = {
  A: ['用几十万个独立的点代替实体表面，靠疏密和明暗塑造体积，像一座没有重量的雕塑。', ['WebGL 粒子', '环面结曲线', '贝塞尔流动'], 'Nebula Knot', '星尘之结'],
  ARC: ['单点透视加上重复的拱门，把一条走廊变成无限纵深；高饱和的粉、橙、黄取自墨西哥现代建筑。', ['单点透视', '几何重复', '色块叙事'], 'Casa Infinita', '无尽之屋'],
  B: ['镜面般的液态金属映出整个摄影棚的灯光，和真实花材放在一起，冷与暖、硬与软正面相撞。', ['光线步进', '环境反射', '有向距离场'], 'Chrome Ikebana', '铬之花道'],
  STAIR: ['半透明磨砂材质配柔和粉彩，阶梯的斜线本身就是视觉引导，把视线一路带向右上方。', ['光线步进', '软阴影', '次表面散射'], 'Pastel Ascent', '粉彩登阶'],
  OPT: ['只用黑白条纹，靠线条的弯曲制造凸起和流动的错觉，眼睛会以为整个画面在呼吸。', ['GLSL 着色器', '条纹位移', '视错觉'], 'Vibrating Field', '震颤之场'],
  D: ['八万片亮片组成一块会呼吸的织物，每一片都有自己的虹彩，随角度从薄荷变到淡紫。', ['GPU 实例点', '薄膜干涉', '法线翻转'], 'Sequin Weather', '亮片天气'],
  TOM: ['高端食品广告的子弹时间：刀光一闪，番茄在半空一分为二，果汁和籽悬停在轮廓光里。', ['高速摄影感', '镜面高光', '液体丝带'], 'Crimson Hour', '绯红时刻'],
  MASS: ['用一张网格表现看不见的引力，被压出的深坑就是质量本身；克莱因蓝让画面像一张海报。', ['透视投影', '网格形变', '波动方程'], 'Gravity Well', '重力之井'],
  ZEN: ['日式庭园的耙砂纹样，用平行线和同心圆代表水流，大面积留白和斜光让画面静下来。', ['GLSL 着色器', '等值线场', '程序化纹理'], 'Stillness', '静之庭'],
  J: ['把报纸、保鲜膜、量尺和欧根纱拼成礼服，定格动画的抖动让它像一本手工剪贴的时装杂志。', ['定格动画', '路径遮罩', '拼贴合成'], 'Torn Couture', '撕裂高定'],
  P: ['低饱和的陶土色、柔和天光和软阴影，几何体温润得像手捏的，是高级中性风的常用语言。', ['光线步进', '环境光遮蔽', '柔和阴影'], 'Soft Matter', '柔软物质'],
  R: ['用等轴测视角把复杂系统缩成桌面上的微缩模型，所有线条平行，信息一目了然。', ['等轴测投影', '分层建造', '矢量绘制'], 'Micro Fab', '微缩芯片厂'],
  BURST: ['庆祝感最强的一种表达，五色纸片带着速度线朝镜头飞来，冲击力全靠透视。', ['透视粒子', '速度线', '翻转模拟'], 'Hooray', '欢呼'],
  FOLD: ['三浦折叠是一种来自航天的折纸结构，换成香槟色金属，光在折痕上像流水一样滑过。', ['三浦折叠', '三角面片', '各向异性高光'], 'Champagne Fold', '香槟之折'],
  GLOBE: ['太阳从地平线升起，晨昏线把地球切成昼夜两半，金色航线从上海飞向世界，是发布会级的全球化主视觉。', ['WebGL 线框', '晨昏线光照', '大气散射'], 'First Light', '破晓'],
};
  const KEYS = { A: 'POINTKNOT', ARC: 'ARCADE', B: 'CHROME', STAIR: 'ASCENT', OPT: 'OPTIC', D: 'SEQUIN', TOM: 'TOMATO', MASS: 'GRAVITY', ZEN: 'ZEN', J: 'COUTURE', P: 'CLAY', R: 'ISOFAB', BURST: 'CONFETTI', FOLD: 'FOLD', GLOBE: 'GLOBE' };
  const CAT = { A: 'tech', ARC: 'space', B: 'material', STAIR: 'material', OPT: 'graphic', D: 'material', TOM: 'product', MASS: 'tech', ZEN: 'nature', J: 'graphic', P: 'material', R: 'space', BURST: 'graphic', FOLD: 'material', GLOBE: 'tech' };
  const moved = SCENES.splice(0, SCENES.length);
  moved.forEach(S => { const m = V1META[S.key] || []; ST.push({ key: KEYS[S.key] || S.key, cn: S.cn, en: S.en, cat: CAT[S.key] || 'graphic', desc: m[0] || '', techs: m[1], work: m[2], workCn: m[3], vol: 1, render: lt => S.render(lt) }); });
})();
