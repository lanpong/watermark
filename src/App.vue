<script setup>
import defaultpng from './assets/default.png';
import github from './assets/github.svg';
import Watermark from 'watermarkjs';
import download from './utils/download';
import { onMounted, onBeforeUnmount, ref } from 'vue';
import 'element-plus/es/components/message/style/css';
import { ElMessage } from 'element-plus';
import project from '../package.json';
import {
  WATERMARK_CONFIG,
  FONT_OPTIONS,
  PREDEFINE_COLORS,
} from './constants.js';

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
const downloadExtTypeList = ['png', 'jpg'];
const markedFont = ref('Arial');
const fileInput = ref();

let lastParams = null;
let originImageObj = null;
let objectUrl = null;
let debounceTimer = null;

function debounce(func, delay) {
  return function (...args) {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => func.apply(this, args), delay);
  };
}

const renderWatermarkDebounced = debounce(
  renderWatermark,
  WATERMARK_CONFIG.DEBOUNCE_DELAY_MS
);

function onPickFile() {
  fileInput.value.click();
}

function handleImgChange(e) {
  const imgFile = e.target.files[0];
  if (!imgFile) return;

  if (!imgFile.type.startsWith('image/')) {
    ElMessage.error('请选择图片文件');
    return;
  }

  if (imgFile.size > WATERMARK_CONFIG.MAX_FILE_SIZE_MB * 1024 * 1024) {
    ElMessage.error(`图片大小不能超过 ${WATERMARK_CONFIG.MAX_FILE_SIZE_MB}MB`);
    return;
  }

  if (objectUrl) {
    URL.revokeObjectURL(objectUrl);
  }

  objectUrl = URL.createObjectURL(imgFile);
  originImg.value = objectUrl;
  originImageObj = null;
  renderWatermark();
}

function hasParamsChanged(current) {
  if (!lastParams) return true;
  return (
    current.text !== lastParams.text ||
    current.color !== lastParams.color ||
    current.alpha !== lastParams.alpha ||
    current.size !== lastParams.size ||
    current.rotate !== lastParams.rotate ||
    current.gap !== lastParams.gap ||
    current.count !== lastParams.count ||
    current.font !== lastParams.font ||
    current.src !== lastParams.src
  );
}

async function renderWatermark() {
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

  if (!hasParamsChanged(currentParams)) return;
  lastParams = currentParams;

  if (!originImageObj || originImageObj._src !== originImg.value) {
    originImageObj = new Image();
    originImageObj._src = originImg.value;
    originImageObj.src = originImg.value;
    try {
      await new Promise((resolve, reject) => {
        originImageObj.onload = resolve;
        originImageObj.onerror = reject;
      });
    } catch {
      ElMessage.error('图片加载失败');
      return;
    }
  }

  try {
    const imgs = await Watermark([originImageObj])
      .image(drawWatermarkText)
      .render();
    markedImg.value = imgs[0].src;
  } catch (error) {
    console.error('水印渲染失败:', error);
    ElMessage.error('水印添加失败，请重试');
    markedImg.value = originImg.value;
  }
}

function drawWatermarkText(target) {
  const context = target.getContext('2d');
  const size = markedSize.value;
  const text = markedText.value;
  const rotate = markedRotate.value;
  const fontStyle = markedFont.value;
  const count = markedCount.value;

  context.globalAlpha = markedAlpha.value / 100;
  context.fillStyle = markedColor.value;
  context.font = `${size}px ${fontStyle}`;

  const gap = markedGap.value * WATERMARK_CONFIG.ROW_MULTIPLIER;
  const rotateRad = (rotate * Math.PI) / 180;
  const countMultiplier = count / WATERMARK_CONFIG.DEFAULT_COUNT;

  const corners = [
    { x: 0, y: 0 },
    { x: target.width, y: 0 },
    { x: 0, y: target.height },
    { x: target.width, y: target.height },
  ];

  const cos = Math.cos(-rotateRad);
  const sin = Math.sin(-rotateRad);

  const rotatedCorners = corners.map((corner) => ({
    x: corner.x * cos - corner.y * sin,
    y: corner.x * sin + corner.y * cos,
  }));

  const minX = Math.min(...rotatedCorners.map((c) => c.x));
  const maxX = Math.max(...rotatedCorners.map((c) => c.x));
  const minY = Math.min(...rotatedCorners.map((c) => c.y));
  const maxY = Math.max(...rotatedCorners.map((c) => c.y));

  const coverWidth = maxX - minX;
  const coverHeight = maxY - minY;

  const separator = WATERMARK_CONFIG.TEXT_SEPARATOR;
  const singleTextWidth = context.measureText(text + separator).width;

  const repeatCount =
    Math.ceil((coverWidth + Math.abs(minX) * 2) / singleTextWidth) +
    WATERMARK_CONFIG.EXTRA_COLUMNS;

  const watermarkText = (text + separator).repeat(repeatCount);

  context.rotate(rotateRad);

  const startX = minX - Math.abs(minX) * 0.5;
  const startY = maxY + gap * 2;

  const rows =
    Math.ceil(((coverHeight + gap * 4) / gap) * countMultiplier) +
    WATERMARK_CONFIG.EXTRA_ROWS;

  let y = startY;
  for (let i = 0; i < rows; i++) {
    y = y - gap;
    context.fillText(watermarkText, startX, y);
  }
  return target;
}

function downloadImage() {
  const imgUrl = markedImg.value;
  const userAgent = navigator.userAgent;
  const isMobile =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      userAgent
    );

  if (isMobile) {
    ElMessage('长按图片保存到手机相册！');
    return;
  }

  try {
    const type = downloadExtType.value;
    const fileName = `${WATERMARK_CONFIG.DEFAULT_DOWNLOAD_FILENAME}.${type}`;
    download(imgUrl, fileName);
    ElMessage.success('图片保存成功');
  } catch (error) {
    console.error('图片下载失败:', error);
    ElMessage.error('图片保存失败，请重试');
  }
}

onMounted(() => {
  renderWatermark();
});

onBeforeUnmount(() => {
  clearTimeout(debounceTimer);
  if (objectUrl) {
    URL.revokeObjectURL(objectUrl);
  }
});
</script>

<template>
  <div class="home">
    <div class="imgcontent">
      <img
        :src="markedImg"
        alt="带水印的图片预览"
        @click="onPickFile"
      />
      <input
        ref="fileInput"
        type="file"
        accept="image/*"
        aria-label="上传图片"
        style="display: none"
        @change="handleImgChange"
      />
    </div>
    <div class="tool">
      <a
        :href="project.homepage"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="在 GitHub 上查看项目"
      >
        <img class="github" :src="github" alt="GitHub" />
      </a>
      <h2>
        证件水印 <span>v{{ version }}</span>
      </h2>
      <div class="tool-item">
        <label class="item-label">图片</label>
        <el-button plain type="primary" @click="onPickFile">
          更换图片
        </el-button>
      </div>
      <div class="tool-item">
        <label class="item-label" for="watermark-text">水印内容</label>
        <el-input
          id="watermark-text"
          v-model="markedText"
          type="textarea"
          class="item-value"
          placeholder="请输入内容"
          @input="renderWatermarkDebounced"
        ></el-input>
      </div>
      <div class="tool-item">
        <label class="item-label" for="watermark-font">字体</label>
        <div class="item-value">
          <el-select
            id="watermark-font"
            v-model="markedFont"
            placeholder="请选择"
            @change="renderWatermarkDebounced"
          >
            <el-option
              v-for="item in FONT_OPTIONS"
              :key="item.markedFont"
              :label="item.label"
              :value="item.markedFont"
            ></el-option>
          </el-select>
        </div>
      </div>
      <div class="tool-item">
        <label class="item-label">颜色</label>
        <el-color-picker
          v-model="markedColor"
          class="item-value"
          :predefine="PREDEFINE_COLORS"
          @change="renderWatermark"
        ></el-color-picker>
      </div>
      <div class="tool-item">
        <label class="item-label">水印数量</label>
        <el-slider
          v-model="markedCount"
          class="item-value"
          :min="WATERMARK_CONFIG.COUNT_MIN"
          :max="WATERMARK_CONFIG.COUNT_MAX"
          @input="renderWatermarkDebounced"
        ></el-slider>
      </div>
      <div class="tool-item">
        <label class="item-label">透明度</label>
        <el-slider
          v-model="markedAlpha"
          class="item-value"
          :min="WATERMARK_CONFIG.ALPHA_MIN"
          :max="WATERMARK_CONFIG.ALPHA_MAX"
          @input="renderWatermarkDebounced"
        ></el-slider>
      </div>
      <div class="tool-item">
        <label class="item-label">字体大小</label>
        <el-slider
          v-model="markedSize"
          class="item-value"
          :min="WATERMARK_CONFIG.SIZE_MIN"
          :max="WATERMARK_CONFIG.SIZE_MAX"
          @input="renderWatermarkDebounced"
        ></el-slider>
      </div>
      <div class="tool-item">
        <label class="item-label">角度</label>
        <el-slider
          v-model="markedRotate"
          class="item-value"
          :min="WATERMARK_CONFIG.ROTATE_MIN"
          :max="WATERMARK_CONFIG.ROTATE_MAX"
          @input="renderWatermarkDebounced"
        ></el-slider>
      </div>
      <div class="tool-item">
        <label class="item-label">间隔</label>
        <el-slider
          v-model="markedGap"
          class="item-value"
          :min="WATERMARK_CONFIG.GAP_MIN"
          :max="WATERMARK_CONFIG.GAP_MAX"
          @input="renderWatermarkDebounced"
        ></el-slider>
      </div>
      <div class="tool-item">
        <label class="item-label" for="download-type">保存类型</label>
        <div class="item-value">
          <el-select
            id="download-type"
            v-model="downloadExtType"
            placeholder="请选择"
          >
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
$mobile-breakpoint: 750px;

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
      cursor: pointer;
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
      width: 30px;
      height: 30px;
    }
    a {
      position: absolute;
      right: 10px;
      top: 10px;
      display: flex;
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
@media screen and (max-width: $mobile-breakpoint) {
  .home {
    height: 100%;
    flex-direction: column;
    overflow: hidden;
    .imgcontent {
      width: 100%;
      height: 60%;
      flex: 0;
      border-right: 0;
      img {
        cursor: default;
      }
    }
    .tool {
      width: 100%;
      flex: 1;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
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
