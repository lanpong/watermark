<template>
  <div class="home">
    <img :src="markedImg" />
    <div>保存</div>
    <button @click="onPickFile">选择图片</button>
    <input
      type="file"
      ref="fileInput"
      accept="image/*"
      @change="handleImgChange"
      style="display: none"
    />
    <div class="fontstyle">
      <el-select v-model="markedFont" placeholder="请选择">
        <el-option
          v-for="item in options"
          :key="item.markedFont"
          :label="item.label"
          :value="item.markedFont"
        ></el-option>
      </el-select>
    </div>
    <el-input v-model="markedText" placeholder="请输入内容"></el-input>
    <el-color-picker v-model="markedColor" :predefine="predefineColors"></el-color-picker>
    <div class="other">
      <div class="block">
        <span class="demonstration">透明度</span>
        <el-slider v-model="markedAlpha" show-input></el-slider>
      </div>
      <div class="block">
        <span class="demonstration">字体大小</span>
        <el-slider v-model="markedSize" show-input></el-slider>
      </div>
      <div class="block">
        <span class="demonstration">角度</span>
        <el-slider v-model="markedRotate" show-input :min="0" :max="90"></el-slider>
      </div>
    </div>
    <el-button @click="__markWater">添加水印</el-button>
  </div>
</template>

<script>
import defaultpng from "../assets/default.png";
import Watermark from "watermarkjs";

import { Select, Option, Input, Slider, ColorPicker, Button } from "element-ui";

export default {
  name: "home",
  data() {
    return {
      markedImg: defaultpng,
      orginImg: defaultpng,
      markedAlpha: 50, // 透明度
      markedColor: "#ffffff", // 颜色
      markedSize: 24, // 字号
      markedText: "这是一个小水印", // 内容
      markedRotate: 45, // 角度
      // markedFont: "Arial",
      predefineColors: [
        "#ffffff",
        "#ff4500",
        "#ff8c00",
        "#ffd700",
        "#90ee90",
        "#00ced1",
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
      };
    },
    __markWater() {
      Watermark([this.orginImg])
        .image(this.__handleText)
        .render()
        .then((img) => {
          this.markedImg = img[0].src;
        });
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
  width: 600px;
  // display: flex;
  // align-items: center;
  // justify-content: center;
  // flex-direction: column;
  img {
    width: 500px;
    display: block;
  }
  .other {
    width: 100%;
  }
}
</style>
