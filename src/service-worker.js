// 设置相应缓存的名字的前缀和后缀
workbox.core.setCacheNameDetails({
  prefix: "watermark",
  suffix: "v1.0.0"
});

workbox.core.skipWaiting(); // 强制等待中的 Service Worker 被激活
workbox.core.clientsClaim(); // Service Worker 被激活后使其立即获得页面控制权

/*
 * vue-cli3.0通过workbox-webpack-plagin 来实现相关功能，我们需要加入
 * 以下语句来获取预缓存列表和预缓存他们，也就是打包项目后生产的html，js，css等* 静态文件
 */
workbox.precaching.precacheAndRoute(self.__precacheManifest || []);

// 对我们请求的数据进行缓存，这里采用 networkFirst 策略
workbox.routing.registerRoute(
  new RegExp(".*experiments?.*"),
  workbox.strategies.networkFirst()
);
workbox.routing.registerRoute(
  new RegExp(".*experiments/\\d"),
  workbox.strategies.networkFirst()
);
workbox.routing.registerRoute(
  new RegExp(".*experiment_types.*"),
  workbox.strategies.networkFirst()
);
