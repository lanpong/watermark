(function(e){function t(t){for(var n,i,l=t[0],c=t[1],s=t[2],u=0,f=[];u<l.length;u++)i=l[u],Object.prototype.hasOwnProperty.call(r,i)&&r[i]&&f.push(r[i][0]),r[i]=0;for(n in c)Object.prototype.hasOwnProperty.call(c,n)&&(e[n]=c[n]);d&&d(t);while(f.length)f.shift()();return o.push.apply(o,s||[]),a()}function a(){for(var e,t=0;t<o.length;t++){for(var a=o[t],n=!0,l=1;l<a.length;l++){var c=a[l];0!==r[c]&&(n=!1)}n&&(o.splice(t--,1),e=i(i.s=a[0]))}return e}var n={},r={app:0},o=[];function i(t){if(n[t])return n[t].exports;var a=n[t]={i:t,l:!1,exports:{}};return e[t].call(a.exports,a,a.exports,i),a.l=!0,a.exports}i.m=e,i.c=n,i.d=function(e,t,a){i.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:a})},i.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},i.t=function(e,t){if(1&t&&(e=i(e)),8&t)return e;if(4&t&&"object"===typeof e&&e&&e.__esModule)return e;var a=Object.create(null);if(i.r(a),Object.defineProperty(a,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var n in e)i.d(a,n,function(t){return e[t]}.bind(null,n));return a},i.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return i.d(t,"a",t),t},i.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},i.p="/watermark/";var l=window["webpackJsonp"]=window["webpackJsonp"]||[],c=l.push.bind(l);l.push=t,l=l.slice();for(var s=0;s<l.length;s++)t(l[s]);var d=c;o.push([0,"chunk-vendors"]),a()})({0:function(e,t,a){e.exports=a("56d7")},"113c":function(e,t,a){e.exports=a.p+"img/default.52e9d59c.png"},"41d2":function(e,t,a){},"56d7":function(e,t,a){"use strict";a.r(t);a("e260"),a("e6cf"),a("cca6"),a("a79d");var n=a("2b0e"),r=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{attrs:{id:"app"}},[a("router-view")],1)},o=[],i=(a("5c0b"),a("2877")),l={},c=Object(i["a"])(l,r,o,!1,null,null,null),s=c.exports,d=a("9483");Object(d["a"])("".concat("/watermark/","service-worker.js"),{ready:function(){console.log("App is being served from cache by a service worker.\nFor more details, visit https://goo.gl/AFskqB")},registered:function(){console.log("Service worker has been registered.")},cached:function(){console.log("Content has been cached for offline use.")},updatefound:function(){console.log("New content is downloading.")},updated:function(){console.log("New content is available; please refresh.")},offline:function(){console.log("No internet connection found. App is running in offline mode.")},error:function(e){console.error("Error during service worker registration:",e)}});var u,f=a("8c4f"),m=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"home"},[a("div",{staticClass:"imgcontent"},[a("img",{attrs:{src:e.markedImg}}),a("el-button",{on:{click:e.onPickFile}},[e._v("选择图片")]),a("input",{ref:"fileInput",staticStyle:{display:"none"},attrs:{type:"file",accept:"image/*"},on:{change:e.handleImgChange}})],1),a("div",{staticClass:"text"},[a("el-input",{attrs:{placeholder:"请输入内容"},on:{input:e.__marked},model:{value:e.markedText,callback:function(t){e.markedText=t},expression:"markedText"}})],1),a("div",{staticClass:"fontstyle"},[a("span",[e._v("字体 / 颜色：")]),a("el-select",{attrs:{placeholder:"请选择"},model:{value:e.markedFont,callback:function(t){e.markedFont=t},expression:"markedFont"}},e._l(e.options,(function(e){return a("el-option",{key:e.markedFont,attrs:{label:e.label,value:e.markedFont}})})),1),a("el-color-picker",{attrs:{predefine:e.predefineColors},on:{change:e.__marked},model:{value:e.markedColor,callback:function(t){e.markedColor=t},expression:"markedColor"}})],1),a("div",{staticClass:"other"},[a("div",{staticClass:"block"},[a("span",{staticClass:"demonstration"},[e._v("透明度")]),a("el-slider",{on:{change:e.__marked},model:{value:e.markedAlpha,callback:function(t){e.markedAlpha=t},expression:"markedAlpha"}})],1),a("div",{staticClass:"block"},[a("span",{staticClass:"demonstration"},[e._v("字体大小")]),a("el-slider",{on:{change:e.__marked},model:{value:e.markedSize,callback:function(t){e.markedSize=t},expression:"markedSize"}})],1),a("div",{staticClass:"block"},[a("span",{staticClass:"demonstration"},[e._v("角度")]),a("el-slider",{attrs:{min:0,max:90},on:{change:e.__marked},model:{value:e.markedRotate,callback:function(t){e.markedRotate=t},expression:"markedRotate"}})],1),a("div",{staticClass:"block"},[a("span",{staticClass:"demonstration"},[e._v("间隔")]),a("el-slider",{attrs:{min:32,max:100},on:{change:e.__marked},model:{value:e.markedGap,callback:function(t){e.markedGap=t},expression:"markedGap"}})],1),a("div",{staticClass:"block"},[a("span",{staticClass:"demonstration"},[e._v("保存类型")]),a("div",{staticClass:"el-slider",staticStyle:{"text-align":"left"}},[a("el-select",{attrs:{placeholder:"请选择"},model:{value:e.downloadExtType,callback:function(t){e.downloadExtType=t},expression:"downloadExtType"}},e._l(e.downloadExtTypeList,(function(e){return a("el-option",{key:e,attrs:{label:e,value:e}})})),1)],1)])]),a("div",{staticClass:"save"},[a("el-button",{on:{click:e.__download}},[e._v("保存图片")])],1)])},p=[],b=(a("99af"),a("c975"),a("ace4"),a("b0c0"),a("d3b7"),a("ac1f"),a("466d"),a("38cf"),a("1276"),a("5cc6"),a("9a8c"),a("a975"),a("735e"),a("c1ac"),a("d139"),a("3a7b"),a("d5d6"),a("82f8"),a("e91f"),a("60bd"),a("5f96"),a("3280"),a("3fcc"),a("ca91"),a("25a1"),a("cd26"),a("3c5d"),a("2954"),a("649e"),a("219c"),a("170b"),a("b39a"),a("72f7"),a("ade3")),v=(a("1951"),a("450d"),a("eedf")),h=a.n(v),k=(a("a586"),a("7464")),g=a.n(k),w=(a("b5c2"),a("20cf")),y=a.n(w),_=(a("10cb"),a("f3ad")),x=a.n(_),C=(a("6611"),a("e772")),O=a.n(C),S=(a("1f1a"),a("4e4b")),j=a.n(S),T=(a("0fb7"),a("f529")),A=a.n(T),R=(a("96cf"),a("1da1")),F=a("113c"),E=a.n(F),I=a("16a6"),U=a.n(I);a("3ca3"),a("5319"),a("ddb0"),a("2b3d");function B(e,t,a){var n,r,o=window,i="application/octet-stream",l=a||i,c=e,s=!t&&!a&&c,d=document.createElement("a"),u=function(e){return String(e)},f=o.Blob||o.MozBlob||o.WebKitBlob||u,m=t||"download";if(f=f.call?f.bind(o):Blob,"true"===String(this)&&(c=[c,l],l=c[0],c=c[1]),s&&s.length<2048&&(m=s.split("/").pop().split("?")[0],d.href=s,-1!==d.href.indexOf(s))){var p=new XMLHttpRequest;return p.open("GET",s,!0),p.responseType="blob",p.onload=function(e){B(e.target.response,m,i)},setTimeout((function(){p.send()}),0),p}if(/^data\:[\w+\-]+\/[\w+\-]+[,;]/.test(c)){if(!(c.length>2096103.424&&f!==u))return navigator.msSaveBlob?navigator.msSaveBlob(b(c),m):v(c);c=b(c),l=c.type||i}function b(e){var t=e.split(/[:;,]/),a=t[1],n="base64"==t[2]?atob:decodeURIComponent,r=n(t.pop()),o=r.length,i=0,l=new Uint8Array(o);for(i;i<o;++i)l[i]=r.charCodeAt(i);return new f([l],{type:a})}function v(e,t){if("download"in d)return d.href=e,d.setAttribute("download",m),d.className="download-js-link",d.innerHTML="downloading...",d.style.display="none",document.body.appendChild(d),setTimeout((function(){d.click(),document.body.removeChild(d),!0===t&&setTimeout((function(){o.URL.revokeObjectURL(d.href)}),250)}),66),!0;if(/(Version)\/(\d+)\.(\d+)(?:\.(\d+))?.*Safari\//.test(navigator.userAgent))return e=e.replace(/^data:([\w\/\-\+]+)/,i),window.open(e)||confirm("Displaying New Document\n\nUse Save As... to download, then click back to return to this page.")&&(location.href=e),!0;var a=document.createElement("iframe");document.body.appendChild(a),t||(e="data:"+e.replace(/^data:([\w\/\-\+]+)/,i)),a.src=e,setTimeout((function(){document.body.removeChild(a)}),333)}if(n=c instanceof f?c:new f([c],{type:l}),navigator.msSaveBlob)return navigator.msSaveBlob(n,m);if(o.URL)v(o.URL.createObjectURL(n),!0);else{if("string"===typeof n||n.constructor===u)try{return v("data:"+l+";base64,"+o.btoa(n))}catch(h){return v("data:"+l+","+encodeURIComponent(n))}r=new FileReader,r.onload=function(e){v(this.result)},r.readAsDataURL(n)}return!0}var L={name:"home",data:function(){return{markedImg:E.a,orginImg:E.a,markedAlpha:50,markedColor:"#ffffff",markedSize:24,markedText:"仅用于xxxxx使用",markedRotate:45,markedGap:32,downloadExtType:"png",downloadExtTypeList:["png","jpg"],predefineColors:["#000000","#ffffff","#ff4500","#ff8c00","#ffd700","#1e90ff","#c71585"],options:[{markedFont:"Arial",label:"默认"},{markedFont:"仿宋",label:"仿宋"},{markedFont:"楷体",label:"楷体"},{markedFont:"宋体",label:"宋体"},{markedFont:"黑体",label:"黑体"}],markedFont:"Arial"}},methods:{onPickFile:function(){this.$refs.fileInput.click()},handleImgChange:function(e){var t=this,a=e.target.files[0],n=new FileReader;n.readAsDataURL(a),n.onload=function(e){t.markedImg=e.target.result,t.orginImg=e.target.result,t.__markWater()}},__marked:function(){this.__markWater()},__markWater:function(){var e=this;return Object(R["a"])(regeneratorRuntime.mark((function t(){var a;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return t.prev=0,t.next=3,U()([e.orginImg]).image(e.__handleText).render();case 3:a=t.sent,e.markedImg=a[0].src,t.next=10;break;case 7:throw t.prev=7,t.t0=t["catch"](0),new Error(t.t0);case 10:case"end":return t.stop()}}),t,null,[[0,7]])})))()},__handleText:function(e){var t=e.getContext("2d"),a=this.markedSize,n=this.markedText,r=this.markedRotate,o=this.markedFont;n="".concat(n,"   "),n=n.repeat(50);var i=0,l=e.height;t.globalAlpha=this.markedAlpha/100,t.fillStyle=this.markedColor,t.font="".concat(a,"px ").concat(o),t.rotate(r*Math.PI/180);for(var c=0;c<200;c++)l-=3*this.markedGap,t.fillText(n,i,l);return e},__download:function(){var e=this.markedImg,t=navigator.userAgent,a=!!t.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),n=t.indexOf("Android")>-1||t.indexOf("Adr")>-1;if(a||n)return A.a.info("长按图片保存到手机相册！"),!1;if(window.navigator.msSaveOrOpenBlob){var r=atob(e.split(",")[1]),o=r.length,i=new Uint8Array(o);while(o--)i[o]=r.charCodeAt(o);var l=new Blob([i]),c="download.jpg";window.navigator.msSaveOrOpenBlob(l,c)}else try{var s=this.downloadExtType;B(e,"download.".concat(s),"image/".concat(s))}catch(d){throw new Error(d)}}},watch:{},created:function(){this.__markWater()},components:(u={},Object(b["a"])(u,j.a.name,j.a),Object(b["a"])(u,O.a.name,O.a),Object(b["a"])(u,x.a.name,x.a),Object(b["a"])(u,y.a.name,y.a),Object(b["a"])(u,g.a.name,g.a),Object(b["a"])(u,h.a.name,h.a),u)},P=L,M=(a("d22b"),Object(i["a"])(P,m,p,!1,null,"dc36a800",null)),z=M.exports;n["default"].use(f["a"]);var G=[{path:"/",name:"home",component:z}],N=new f["a"]({mode:"history",base:"/watermark/",routes:G}),W=N,D=a("2f62");n["default"].use(D["a"]);var $=new D["a"].Store({state:{},mutations:{},actions:{},modules:{}});n["default"].config.productionTip=!1,new n["default"]({router:W,store:$,render:function(e){return e(s)}}).$mount("#app")},"5c0b":function(e,t,a){"use strict";var n=a("9c0c"),r=a.n(n);r.a},"9c0c":function(e,t,a){},d22b:function(e,t,a){"use strict";var n=a("41d2"),r=a.n(n);r.a}});
//# sourceMappingURL=app.af24fee2.js.map