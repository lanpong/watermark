module.exports = {
  pwa: {
    name: "watermark",
    themeColor: "#4DBA87",
    msTileColor: "#000000",
    appleMobileWebAppCapable: "yes",
    appleMobileWebAppStatusBarStyle: "black",

    workboxPluginMode: "InjectManifest",
    workboxOptions: {
      // 自定义的service worker文件的位置
      swSrc: "src/service-worker.js"
      // ...other Workbox options...
    }
  }
};
