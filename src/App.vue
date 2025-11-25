<script setup>
import defaultpng from './assets/default.png';
import github from './assets/github.svg';
import Watermark from 'watermarkjs';
import download from './utils/download';
import { onMounted, reactive, ref } from 'vue';
import 'element-plus/es/components/message/style/css';
import { ElMessage } from 'element-plus';
import project from '../package.json';
import { WATERMARK_CONFIG } from './constants.js';

const version = project.version;



const markedImg = ref(defaultpng);
const originImg = ref(defaultpng);

const markedAlpha = ref(WATERMARK_CONFIG.DEFAULT_ALPHA);
const markedColor = ref(WATERMARK_CONFIG.DEFAULT_COLOR);
const markedCount = ref(WATERMARK_CONFIG.DEFAULT_COUNT);
const markedSize = ref(WATERMARK_CONFIG.DEFAULT_SIZE);
const markedText = ref(WATERMARK_CONFIG.DEFAULT_TEXT);
const markedRotate = ref(WATERMARK_CONFIG.DEFAULT_ROTATE);
const markedGap = ref(WATERMARK_CONFIG.DEFAULT_GAP);
const downloadExtType = ref('png');
const downloadExtTypeList = reactive(['png', 'jpg']);
const predefineColors = reactive([
  '#000000',
  '#ffffff',
  '#c3c3c3',
  '#ff4500',
  '#ff8c00',
  '#ffd700',
  '#1e90ff',
  '#c71585',
]);
const options = reactive([
  {
    markedFont: 'Arial',
    label: '默认',
  },
  {
    markedFont: '仿宋',
    label: '仿宋',
  },
  {
    markedFont: '楷体',
    label: '楷体',
  },
  {
    markedFont: '宋体',
    label: '宋体',
  },
  {
    markedFont: '黑体',
    label: '黑体',
  },
]);
let markedFont = ref('Arial'); // 水印字体
const fileInput = ref(); // 需要添加水印的图片

function onGithub() {
  window.open(project.homepage, '_blank');
}

function onPickFile() {
  fileInput.value.click();
}

async function handleImgChange(e) {
  const imgFile = e.target.files[0];
  if (!imgFile) return;

  const reader = new FileReader();
  reader.readAsDataURL(imgFile);
  reader.onload = async (arg) => {
    originImg.value = arg.target.result;
    originImageObj = null; // Reset original image object
    await renderWatermark();
  };
}

// Debounce function
function debounce(func, delay) {
  let timeout;
  return function(...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), delay);
  };
}

function applyWatermark() {
  renderWatermark();
}

const applyWatermarkDebounced = debounce(applyWatermark, 300); // Debounce for sliders and input

let lastParams = null;
let originImageObj = null;

async function renderWatermark() {
  // Debounce already handled in applyWatermarkDebounced
  const currentParams = {
    text: markedText.value,
    color: markedColor.value,
    alpha: markedAlpha.value,
    size: markedSize.value,
    rotate: markedRotate.value,
    gap: markedGap.value,
    count: markedCount.value,
    font: markedFont.value,
    src: originImg.value,
  };
  if (JSON.stringify(currentParams) === JSON.stringify(lastParams)) {
    return; // No changes, skip rendering
  }
  lastParams = currentParams;

  // Lazy load original image object
  if (!originImageObj || originImageObj.src !== originImg.value) {
    originImageObj = new Image();
    originImageObj.src = originImg.value;
    await new Promise((resolve, reject) => {
      originImageObj.onload = resolve;
      originImageObj.onerror = reject;
    });
  }

  requestAnimationFrame(async () => {
    try {
      const imgs = await Watermark([originImageObj]).image(drawWatermarkText).render();
      markedImg.value = imgs[0].src;
    } catch (error) {
      console.error('水印渲染失败:', error);
      ElMessage.error('水印添加失败，请重试');
      markedImg.value = originImg.value;
    }
  });
}

function drawWatermarkText(target) {
  let context = target.getContext('2d');
  let size = markedSize.value;
  let text = markedText.value;
  let rotate = markedRotate.value;
  let fontStyle = markedFont.value;
  
  context.globalAlpha = markedAlpha.value / 100;
  context.fillStyle = markedColor.value;
  context.font = `${size}px ${fontStyle}`;
  
  const gap = markedGap.value * WATERMARK_CONFIG.ROW_MULTIPLIER;
  const rotateRad = (rotate * Math.PI) / 180;
  
  // 计算画布四个角的坐标
  const corners = [
    { x: 0, y: 0 },           // 左上
    { x: target.width, y: 0 }, // 右上
    { x: 0, y: target.height }, // 左下
    { x: target.width, y: target.height } // 右下
  ];
  
  // 计算旋转后四个角在旋转坐标系中的位置
  const cos = Math.cos(-rotateRad); // 注意：逆向旋转
  const sin = Math.sin(-rotateRad);
  
  const rotatedCorners = corners.map(corner => ({
    x: corner.x * cos - corner.y * sin,
    y: corner.x * sin + corner.y * cos
  }));
  
  // 找出旋转后的边界框
  const minX = Math.min(...rotatedCorners.map(c => c.x));
  const maxX = Math.max(...rotatedCorners.map(c => c.x));
  const minY = Math.min(...rotatedCorners.map(c => c.y));
  const maxY = Math.max(...rotatedCorners.map(c => c.y));
  
  // 计算需要覆盖的宽度和高度
  const coverWidth = maxX - minX;
  const coverHeight = maxY - minY;
  
  // 测量单个水印文本的宽度
  const singleTextWidth = context.measureText(text + '   ').width;
  
  // 计算需要重复的次数，添加额外的边距
  const repeatCount = Math.ceil((coverWidth + Math.abs(minX) * 2) / singleTextWidth) + 5;
  
  // 生成足够长的水印文本
  const watermarkText = (text + '   ').repeat(repeatCount);
  
  // 应用旋转
  context.rotate(rotateRad);
  
  // 从边界框外部开始绘制，添加额外边距
  const startX = minX - Math.abs(minX) * 0.5;
  const startY = maxY + gap * 2;
  
  // 计算需要的行数，添加额外行确保完全覆盖
  const rows = Math.ceil((coverHeight + gap * 4) / gap) + 10;

  let y = startY;
  for (let i = 0; i < rows; i++) {
    y = y - gap;
    context.fillText(watermarkText, startX, y);
  }
  return target;
}

const showMobileSaveHint = () => {
  ElMessage('长按图片保存到手机相册！');
};

function downloadImage() {
  const imgUrl = markedImg.value;
  const userAgent = navigator.userAgent;
  const isIos = !!userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
  const isAndroid = userAgent.indexOf('Android') > -1 || userAgent.indexOf('Adr') > -1;
  
  if (isIos || isAndroid) {
    showMobileSaveHint();
    return;
  }
  
  if (window.navigator.msSaveOrOpenBlob) {
    const bstr = atob(imgUrl.split(',')[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    const blob = new Blob([u8arr]);
    const saveFileName = `download.${downloadExtType.value}`;
    window.navigator.msSaveOrOpenBlob(blob, saveFileName);
    return;
  }
  
  try {
    const type = downloadExtType.value;
    download(imgUrl, `download.${type}`, `image/${type}`);
    ElMessage.success('图片保存成功');
  } catch (error) {
    console.error('图片下载失败:', error);
    ElMessage.error('图片保存失败，请重试');
  }
}


onMounted(() => {
  renderWatermark();
});
</script>

<template>
  <div class="home">
    <!-- 图片 -->
    <div class="imgcontent">
      <img :src="markedImg" @click="onPickFile" />
      <el-button type="primary" v-if="!markedImg" @click="onPickFile">选择图片</el-button>
      <input
        type="file"
        ref="fileInput"
        accept="image/*"
        @change="handleImgChange"
        style="display: none"
      />
    </div>
    <!-- 工具箱 -->
    <div class="tool">
      <img class="github" :src="github" alt="github/Chef5" @click="onGithub" />
      <h2>
        证件水印 <span>v{{ version }}</span>
      </h2>
      <div class="tool-item">
        <span class="item-label">图片</span>
        <el-button plain type="primary" @click="onPickFile">{{
          markedImg ? '更换图片' : '选择图片'
        }}</el-button>
      </div>
      <div class="tool-item">
        <span class="item-label">水印内容</span>
        <el-input
          type="textarea"
          class="item-value"
          v-model="markedText"
          placeholder="请输入内容"
          @input="applyWatermarkDebounced"
        ></el-input>
      </div>
      <div class="tool-item">
        <span class="item-label">字体</span>
        <div class="item-value">
          <el-select v-model="markedFont" @change="applyWatermarkDebounced" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.markedFont"
              :label="item.label"
              :value="item.markedFont"
            ></el-option>
          </el-select>
        </div>
      </div>
      <div class="tool-item">
        <span class="item-label">颜色</span>
        <el-color-picker
          class="item-value"
          v-model="markedColor"
          :predefine="predefineColors"
          @change="applyWatermark"
        ></el-color-picker>
      </div>
      <div class="tool-item">
        <span class="item-label">水印数量</span>
        <el-slider
          class="item-value"
          v-model="markedCount"
          :min="40"
          :max="600"
          @change="applyWatermark"
        ></el-slider>
      </div>
      <div class="tool-item">
        <span class="item-label">透明度</span>
        <el-slider class="item-value" v-model="markedAlpha" @change="applyWatermarkDebounced"></el-slider>
      </div>
      <div class="tool-item">
        <span class="item-label">字体大小</span>
        <el-slider class="item-value" v-model="markedSize" @change="applyWatermarkDebounced"></el-slider>
      </div>
      <div class="tool-item">
        <span class="item-label">角度</span>
        <el-slider
          class="item-value"
          v-model="markedRotate"
          :min="0"
          :max="90"
          @change="applyWatermark"
        ></el-slider>
      </div>
      <div class="tool-item">
        <span class="item-label">间隔</span>
        <el-slider
          class="item-value"
          v-model="markedGap"
          :min="32"
          :max="100"
          @change="applyWatermark"
        ></el-slider>
      </div>
      <div class="tool-item">
        <span class="item-label">保存类型</span>
        <div class="item-value">
          <el-select v-model="downloadExtType" placeholder="请选择">
            <el-option
              v-for="item in downloadExtTypeList"
              :key="item"
              :label="item"
              :value="item"
            ></el-option>
          </el-select>
        </div>
      </div>

      <div class="save">
        <el-button type="primary" @click="downloadImage">保存图片</el-button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.home {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  .imgcontent {
    width: 0;
    height: 100%;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    border-right: 1px dashed #ccc;
    img {
      width: 90%;
      height: 90%;
      display: block;
      object-fit: contain;
    }
  }
  .tool {
    position: relative;
    box-sizing: border-box;
    padding: 0 20px 20px;
    width: 350px;
    height: 100%;
    .tool-item {
      display: flex;
      align-items: center;
      border-bottom: 1px solid #eff2f6;
      .item-label {
        display: inline-block;
        padding-right: 20px;
        width: 60px;
        text-align: right;
        font-size: 14px;
        color: #8492a6;
        line-height: 42px;
      }
      .item-value {
        padding: 5px 0;
        width: 70%;
        float: right;
        display: flex;
        align-items: center;

        .el-select {
          margin: 0;
        }
        .el-slider {
          padding: 0;
        }
      }
    }
    .el-select {
      width: 40%;
      margin: 0 10px;
    }
    .github {
      position: absolute;
      right: 10px;
      top: 10px;
      width: 30px;
      height: 30px;
    }
    h2 {
      span {
        font-size: 14px;
        color: #666;
      }
    }
    .save {
      margin-top: 20px;
    }
  }
}
@media screen and (max-width: 750px) {
  .home {
    height: 100%;
    flex-direction: column;
    overflow: hidden;
    .imgcontent {
      width: 100%;
      height: 60%;
      flex: 0;
      border-right: 0;
    }
    .tool {
      width: 100%;
      flex: 1;
      overflow-y: auto;
    }
  }
}
</style>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
