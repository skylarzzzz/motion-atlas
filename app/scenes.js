// ===== Vol.2 scene list: wrap preview styles into film scenes =====
const PICK = [
 ['SATURNX', 'dark', '255,190,120', 'ECLIPSE · SUNRISE', 'BACKLIT LIMB   RING FORWARD-SCATTER   FLARE ×6'],
 ['MEMPHIS', 'light', '230,60,120', 'MEMPHIS GROUP', 'SHAPES 46   SQUIGGLE · DOT · ZIGZAG'],
 ['STAIRWELL', 'dark', '255,120,90', 'SPIRAL STAIR', 'STEPS 64   r 1.32   LOOKING DOWN'],
 ['COLORINK', 'light', '226,40,120', 'INK COLLISION', 'PIGMENTS 4   DOMAIN WARP ×5   SUBTRACTIVE MIX'],
 ['TERRACE', 'light', '200,90,80', 'TERRACED POOLS', 'LEVELS 6   STEP 0.30 m   WATER #40CCCC'],
 ['MOBIUS', 'dark', '255,120,110', 'ONE-SIDED SURFACE', 'u ∈ [0, 2π]   v ∈ [−0.5, 0.5]   χ = 0'],
 ['STAMPS', 'light', '200,69,44', 'POSTAGE COLLAGE', 'STAMPS 14   PERF 14   KRAFT GROUND'],
 ['SPLITFLAP', 'dark', '232,178,58', 'SPLIT-FLAP DISPLAY', 'FLAPS 28 × 8   37 GLYPHS   SOLARI DI UDINE'],
 ['VASE', 'light', '150,90,70', 'CERAMIC STILL LIFE', 'BISQUE 4   RAKING LIGHT   LONG SHADOW'],
 ['CANDLES', 'dark', '240,68,58', 'MARKET DATA', 'OHLC × 64   MA5 / MA20   VOL'],
 ['DOMINO', 'light', '214,70,52', 'CHAIN REACTION', 'TILES 92   SPIRAL r = 0.4 + 2.6s'],
 ['STRINGART', 'dark', '255,140,90', 'MODULAR MULTIPLICATION', 'NAILS 220   n × k  mod 220'],
 ['GLASS', 'dark', '255,190,80', 'STAINED GLASS', 'LEADED PANES   VORONOI   SUNBEAM'],
 ['NEBULA', 'dark', '255,90,110', 'EMISSION NEBULA', 'Hα 656 nm   OIII 501 nm   DUST'],
];
const PAL = { REEL: ['#0E0C0F', '#F2EFEA', '#8C8A90', '#3A383E'], SATURNX: ['#030306', '#FFC27A', '#E8D6B0', '#7A6A58'], COLORINK: ['#F6F4F0', '#E8287A', '#1E88E5', '#F2911E', '#6A3CC8'], AURORAX: ['#02060E', '#1AFF8C', '#F23BC0', '#4D99FF'], BLACKHOLE: ['#000000', '#FF5A14', '#FFE6B4', '#E6EEFF'], SPLITFLAP: ['#121214', '#1F1F23', '#F4F1E8', '#E8B23A', '#FF5A3C'], MEMPHIS: ['#F7DCD0', '#1A1A1A', '#3D5AFE', '#FF4FA0', '#FFC93C'], STAIRWELL: ['#0E0C0B', '#2A2420', '#C8452C', '#F2E6D8'], STAMPS: ['#D6BE97', '#C8452C', '#2E6B4F', '#1F3A8A', '#F3E6CC'], VASE: ['#D9D3CA', '#DCC7AD', '#F2EDE0', '#C79A80', '#66736B'], GLASS: ['#14100D', '#1F4AA8', '#C8322E', '#F2B632', '#2E8A5A'], TERRACE: ['#F6D9C8', '#F5A89E', '#40CCCC', '#CCE0F2'], WINDMAP: ['#05080E', '#2878AA', '#50DCD2', '#FFF0BE'], CANDLES: ['#0B0F1A', '#F0443A', '#22B573', '#F5C14B'], SANKEY: ['#F3EFE7', '#E9A23B', '#4E8FBF', '#B65A4A', '#5B5F97'],
  DOMINO: ['#E8E3DA', '#1A1A1E', '#D64634'], MOBIUS: ['#1A1C2A', '#FF8C5A', '#FF5A8C', '#F0ECE4'], ORBITAL: ['#05060C', '#5AAAFF', '#FF825A', '#FFFFFF'], FLIGHTS: ['#060912', '#788CC8', '#FFAA5A', '#DDEBFF'],
  STRINGART: ['#24201C', '#FF7846', '#5AAAFF', '#C9B48A'], BOOKS: ['#E9E3D8', '#C7612F', '#2A6B54', '#33509A', '#E6B24C'], SATURN: ['#020205', '#D9B884', '#F2E6C7', '#998C80'], NEBULA: ['#05040A', '#FF3850', '#1ABFD9', '#FFA050'], INKWATER: ['#F0EBDE', '#1F2838', '#08080A', '#B5322A'] };
const SCRIM = { SATURNX: '0,0,0', AURORAX: '2,6,14', COLORINK: '246,244,240', STAIRWELL: '10,8,7', NEBULA: '6,4,10', TERRACE: '232,214,204', INKWATER: '240,235,222' };
const ZOOM = { COLORINK: .1, GLASS: .07, SPLITFLAP: .06, INKWATER: .05, STAMPS: .04, CANDLES: .03, STRINGART: .05 };
// optional sound accents per scene, in scene-local time lt (0..8): [lt, type] or ['run', type, lt0, lt1, count]
const SFX = { SATURNX: [[3.5, 'boom'], [3.5, 'shimmer']], COLORINK: [[0, 'whoosh'], [.35, 'whoosh'], [.8, 'whoosh'], [1.25, 'whoosh']], MEMPHIS: [['run', 'pop', .2, 1.6, 18]],
  TERRACE: [['run', 'thud', .65, 1.75, 6]], STAMPS: [['run', 'thud', .28, 4.83, 14]], SPLITFLAP: [['run', 'flap', 0, 3.4, 140], ['run', 'flap', 4.2, 7, 120]], VASE: [['run', 'thud', .67, 1.27, 3]], DOMINO: [['run', 'click', .2, 6.7, 88]] };
const MS = {}; ST.forEach(s => MS[s.key] = s);
PICK.forEach(([key, theme, accent, tag, hud], i) => { const s = MS[key]; SCENES.push({ key, no: i + 1, cn: s.cn, en: s.en, tagline: tag, side: 'L', theme, accent, hudline: hud, pal: PAL[key], render: lt => { const z = ZOOM[key]; if (z) { const k = 1 + z * lt / 8; X.setTransform(k, 0, 0, k, 1320 * (1 - k), 540 * (1 - k)); } s.render(lt); X.setTransform(1, 0, 0, 1, 0, 0); }, scrim: SCRIM[key], pout: 0, sfx: SFX[key] || [], dur: ({ MEMPHIS: 4, STAIRWELL: 4, COLORINK: 4, NEBULA: 4 })[key] || 6 }); });
