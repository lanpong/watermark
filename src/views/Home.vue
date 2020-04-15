<template>
  <div class="home">
    <img :src="imageUrl" />
    <div>保存</div>
    <button @click="onPickFile">选择图片</button>
    <input type="file" ref="fileInput" accept="image/*" @change="getFile" style="display: none" />
  </div>
</template>

<script>
import defaultpng from "../assets/default.png";
import Watermark from "watermarkjs";

export default {
  name: "home",
  data() {
    return {
      imageUrl: defaultpng,
      markedImg: "",
      markedAlpha: 50,
      markedColor: "#fff",
      markedSize: 16,
      markedText: "这是一个小水印",
      rawImg: "",
      controlDisabled: true
    };
  },
  methods: {
    onPickFile() {
      this.$refs.fileInput.click();
    },
    getFile(event) {
      const files = event.target.files;
      let filename = files[0].name; //只有一个文件
      if (filename.lastIndexOf(".") <= 0) {
        return alert("Please add a valid image!"); //判断图片是否有效
      }
      const fileReader = new FileReader(); //内置方法new FileReader()   读取文件
      fileReader.addEventListener("load", () => {
        this.imageUrl = fileReader.result;
      });
      fileReader.readAsDataURL(files[0]);
      this.image = files[0];
      //到这里后, 选择图片就可以显示出来了
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
