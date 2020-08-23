<template>
  <div class="home">
    <div class="imgcontent">
      <img :src="markedImg" />
      <el-button @click="onPickFile">选择图片</el-button>
      <input
        type="file"
        ref="fileInput"
        accept="image/*"
        @change="handleImgChange"
        style="display: none"
      />
    </div>
    <div class="text">
      <el-input v-model="markedText" placeholder="请输入内容"></el-input>
    </div>
    <div class="fontstyle">
      <span>字体 / 颜色：</span>
      <el-select v-model="markedFont" placeholder="请选择">
        <el-option
          v-for="item in options"
          :key="item.markedFont"
          :label="item.label"
          :value="item.markedFont"
        ></el-option>
      </el-select>
      <el-color-picker v-model="markedColor" :predefine="predefineColors"></el-color-picker>
    </div>

    <div class="other">
      <div class="block">
        <span class="demonstration">透明度</span>
        <el-slider v-model="markedAlpha"></el-slider>
      </div>
      <div class="block">
        <span class="demonstration">字体大小</span>
        <el-slider v-model="markedSize"></el-slider>
      </div>
      <div class="block">
        <span class="demonstration">角度</span>
        <el-slider v-model="markedRotate" :min="0" :max="90"></el-slider>
      </div>
      <div class="block">
        <span class="demonstration">保存类型</span>
        <div class="el-slider" style="text-align: left;">
          <el-select v-model="downloadExtType" placeholder="请选择">
            <el-option
              v-for="item in downloadExtTypeList"
              :key="item"
              :label="item"
              :value="item">
            </el-option>
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

<script>
import defaultpng from "../assets/default.png";
import Watermark from "watermarkjs";
import download from '@/utils/download'

import {
  Select,
  Option,
  Input,
  Slider,
  ColorPicker,
  Button,
  Message,
} from "element-ui";

export default {
  name: "home",
  data() {
    return {
      markedImg: defaultpng,
      orginImg: defaultpng,
      markedAlpha: 50, // 透明度
      markedColor: "#ffffff", // 颜色
      markedSize: 24, // 字号
      markedText: "仅用于xxxxx使用", // 内容
      markedRotate: 45, // 角度
      downloadExtType: "png", // 下载的格式
      downloadExtTypeList: [
        "png",
        "jpg"
      ],
      // markedFont: "Arial",
      predefineColors: [
        "#000000",
        "#ffffff",
        "#ff4500",
        "#ff8c00",
        "#ffd700",
        "#1e90ff",
        "#c71585",
      ],
      options: [
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
      ],
      markedFont: "Arial",
    };
  },
  methods: {
    onPickFile() {
      this.$refs.fileInput.click();
    },
    handleImgChange(e) {
      const imgFile = e.target.files[0];

      const reader = new FileReader();
      reader.readAsDataURL(imgFile);
      reader.onload = (arg) => {
        this.markedImg = arg.target.result;
        this.orginImg = arg.target.result;
        this.__markWater()
      };
    },
    async __markWater() {
      try {
        // console.log("handle change", (new Date).toTimeString())
        const imgs = await Watermark([this.orginImg]).image(this.__handleText).render()
        this.markedImg = imgs[0].src
      } catch (error) {
        throw new Error(error)
      }
    },
    __handleText(target) {
      let context = target.getContext("2d");
      let size = this.markedSize;
      let text = this.markedText;
      let rotate = this.markedRotate;
      let fontStyle = this.markedFont;
      text = `${text}   `;
      text = text.repeat(50);

      let x = 0;
      let y = target.height;

      const gap = 32;

      context.globalAlpha = this.markedAlpha / 100;
      context.fillStyle = this.markedColor;
      context.font = `${size}px ${fontStyle}`;
      context.rotate((rotate * Math.PI) / 180);

      for (let i = 0; i < 200; i++) {
        y = y - gap * 3;
        context.fillText(text, x, y);
      }

      return target;
    },
    __download() {
      const imgUrl = this.markedImg;

      const u = navigator.userAgent; // 获取浏览器的 userAgent
      const isIos = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); // Android设备
      const isAndroid = u.indexOf("Android") > -1 || u.indexOf("Adr") > -1; // ios设备

      if (isIos || isAndroid) {
        Message.info("长按图片保存到手机相册！")
        return false;
      } else if (window.navigator.msSaveOrOpenBlob) {
        let bstr = atob(imgUrl.split(",")[1]);
        let n = bstr.length;
        let u8arr = new Uint8Array(n);
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }

        let blob = new Blob([u8arr]);
        const saveFileName = "download" + "." + "jpg"
        window.navigator.msSaveOrOpenBlob(blob, saveFileName);
      } else {
        try {
          const type = this.downloadExtType
          download(imgUrl, `download.${ type }`, `image/${ type }`)
        } catch (error) {
          throw new Error(error)
        }
      }
    },
  },
  watch: {
    markedRotate: function () {
      this.__markWater();
    },
    markedText: function () {
      this.__markWater();
    },
    markedColor: function () {
      this.__markWater();
    },
    markedSize: function () {
      this.__markWater();
    },
    markedAlpha: function () {
      this.__markWater();
    },
    markedFont: function () {
      this.__markWater();
    },
  },
  created() {
    this.__markWater();
  },
  components: {
    [Select.name]: Select,
    [Option.name]: Option,
    [Input.name]: Input,
    [Slider.name]: Slider,
    [ColorPicker.name]: ColorPicker,
    [Button.name]: Button,
  },
};
</script>

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
        line-height: 44px;
      }
      .demonstration + .el-slider {
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
