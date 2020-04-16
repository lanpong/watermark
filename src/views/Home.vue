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
  </div>
</template>

<script>
import defaultpng from "../assets/default.png";
// import Watermark from "watermarkjs";

export default {
  name: "home",
  data() {
    return {
      markedImg: defaultpng,
      markedAlpha: 50, //
      markedColor: "#fff", // 颜色
      markedSize: 16, // 字号
      markedText: "这是一个小水印", // 内容
      rawImg: "",
      controlDisabled: true
    };
  },
  methods: {
    onPickFile() {
      this.$refs.fileInput.click();
    },
    handleImgChange(e) {
      const imgFile = e.target.files[0];
      this.rawImg = imgFile;

      const reader = new FileReader();
      reader.readAsDataURL(imgFile);
      reader.onload = arg => {
        this.markedImg = arg.target.result;
        this.controlDisabled = false;
      };
    }
  }
};
</script>

<style lang="scss" scoped>
.home {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  img {
    width: 500px;
    display: block;
  }
}
</style>
