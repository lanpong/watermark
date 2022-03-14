<script setup>
import defaultpng from "./assets/default.png";
import Watermark from "watermarkjs";
import download from "./utils/download";
import { onMounted, reactive, ref } from "vue";

const markedImg = ref(defaultpng);
const orginImg = ref(defaultpng);

const markedAlpha = ref(50);
const markedColor = ref("#ffffff");
const markedSize = ref(24);
const markedText = ref("仅用于xxxxx使用");
const markedRotate = ref(45);
const markedGap = ref(32);
const downloadExtType = ref("png");
const downloadExtTypeList = reactive(["png", "jpg"]);
const predefineColors = reactive([
  "#000000",
  "#ffffff",
  "#ff4500",
  "#ff8c00",
  "#ffd700",
  "#1e90ff",
  "#c71585",
]);
const options = reactive([
  {
    markedFont: "Arial",
    label: "默认",
  },
  {
    markedFont: "仿宋",
    label: "仿宋",
  },
  {
    markedFont: "楷体",
    label: "楷体",
  },
  {
    markedFont: "宋体",
    label: "宋体",
  },
  {
    markedFont: "黑体",
    label: "黑体",
  },
]);
const markedFont = ref("Arial");
const fileInput = ref();

function onPickFile() {
  fileInput.value.click();
}

function handleImgChange(e) {
  const imgFile = e.target.files[0];
  const reader = new FileReader();
  reader.readAsDataURL(imgFile);
  reader.onload = (arg) => {
    markedImg.value = arg.target.result;
    orginImg.value = arg.target.result;
    __markedWater();
  };
}

function __marked() {
  __markedWater();
}

async function __markedWater() {
  try {
    const imgs = await Watermark([orginImg.value]).image(__handleText).render();
    markedImg.value = imgs[0].src;
  } catch (error) {
    throw new Error(error);
  }
}

function __handleText(target) {
  let context = target.getContext("2d");
  let size = markedSize.value;
  let text = markedText.value;
  let rotate = markedRotate.value;
  let fontStyle = markedFont.value;
  text = `${text}   `;
  text = text.repeat(50);
  let x = 0;
  let y = target.height;
  // const gap = 32;
  context.globalAlpha = markedAlpha.value / 100;
  context.fillStyle = markedColor.value;
  context.font = `${size}px ${fontStyle}`;
  context.rotate((rotate * Math.PI) / 180);
  for (let i = 0; i < 200; i++) {
    y = y - markedGap.value * 3;
    context.fillText(text, x, y);
  }
  return target;
}

function __download() {
  const imgUrl = markedImg.value;
  const u = navigator.userAgent; // 获取浏览器的 userAgent
  const isIos = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); // Android设备
  const isAndroid = u.indexOf("Android") > -1 || u.indexOf("Adr") > -1; // ios设备
  if (isIos || isAndroid) {
    Message.info("长按图片保存到手机相册！");
    return false;
  } else if (window.navigator.msSaveOrOpenBlob) {
    let bstr = atob(imgUrl.split(",")[1]);
    let n = bstr.length;
    let u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    let blob = new Blob([u8arr]);
    const saveFileName = "download" + "." + "jpg";
    window.navigator.msSaveOrOpenBlob(blob, saveFileName);
  } else {
    try {
      const type = downloadExtType.value;
      download(imgUrl, `download.${type}`, `image/${type}`);
    } catch (error) {
      throw new Error(error);
    }
  }
}

onMounted(() => {
  __markedWater();
});
</script>

<template>
  <div class="home">
    <div class="imgcontent">
      <img :src="markedImg" />
      <el-button @click="onPickFile">选择图片</el-button>
      <input type="file" ref="fileInput" accept="image/*" @change="handleImgChange" style="display: none" />
    </div>
    <div class="text">
      <el-input v-model="markedText" placeholder="请输入内容" @input="__marked"></el-input>
    </div>
    <div class="fontstyle">
      <span>字体 / 颜色：</span>
      <el-select v-model="markedFont" @change="__marked" placeholder="请选择">
        <el-option v-for="item in options" :key="item.markedFont" :label="item.label" :value="item.markedFont"></el-option>
      </el-select>
      <el-color-picker v-model="markedColor" :predefine="predefineColors" @change="__marked"></el-color-picker>
    </div>

    <div class="other">
      <div class="block">
        <span class="demonstration">透明度</span>
        <el-slider v-model="markedAlpha" @change="__marked"></el-slider>
      </div>
      <div class="block">
        <span class="demonstration">字体大小</span>
        <el-slider v-model="markedSize" @change="__marked"></el-slider>
      </div>
      <div class="block">
        <span class="demonstration">角度</span>
        <el-slider v-model="markedRotate" :min="0" :max="90" @change="__marked"></el-slider>
      </div>
      <div class="block">
        <span class="demonstration">间隔</span>
        <el-slider v-model="markedGap" :min="32" :max="100" @change="__marked"></el-slider>
      </div>
      <div class="block">
        <span class="demonstration">保存类型</span>
        <div class="el-slider" style="text-align: left">
          <el-select v-model="downloadExtType" placeholder="请选择">
            <el-option v-for="item in downloadExtTypeList" :key="item" :label="item" :value="item"></el-option>
          </el-select>
        </div>
      </div>
    </div>
    <div class="save">
      <!-- <el-button @click="__markWater">添加水印</el-button> -->
      <el-button @click="__download">保存图片</el-button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.home {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  .imgcontent {
    img {
      width: 500px;
      display: block;
    }
    .el-button {
      margin-top: 20px;
    }
  }
  .text {
    width: 650px;
    margin-top: 20px;
    .el-input {
      width: 80%;
    }
  }
  .fontstyle {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 650px;
    margin-top: 20px;
    span {
      font-size: 14px;
      color: #8492a6;
      line-height: 44px;
    }
    .el-select {
      width: 40%;
      margin: 0 20px;
    }
  }
  .other {
    width: 650px;
    border-top: 1px solid #eff2f6;
    border-right: 1px solid #eff2f6;
    border-left: 1px solid #eff2f6;
    margin-top: 20px;
    margin-bottom: 20px;
    .block {
      padding: 20px 10px;
      overflow: hidden;
      border-bottom: 1px solid #eff2f6;
      .demonstration {
        font-size: 14px;
        color: #8492a6;
        line-height: 42px;
      }
      .demonstration + .el-slider {
        height: 42px;
        float: right;
        width: 70%;
        margin-right: 20px;
      }
    }
  }
}
@media screen and (max-width: 750px) {
  .home {
    .imgcontent {
      img {
        width: 100%;
        display: block;
      }
    }
    .text {
      width: 100%;
    }
    .fontstyle {
      width: 100%;
    }
    .other {
      width: 100%;
    }
  }
}
</style>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
