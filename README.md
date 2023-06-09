# 警告
- 此擴充功能僅適用於電腦版 Google Chrome ，無法在其他裝置上使用
- 此擴充功能為教育用途，請勿用於商業用途
- 請勿利用擴充功能之漏洞，做出對答案資料庫有害的攻擊

# 安裝方式
1. 點擊 " Code "
2. 點擊 " Download ZIP "
3. 解壓縮 `pagamo-ext-main`
5. 於 Google Chrome 中輸入 chrome://extensions/
6. 開啟右上角的開發人員模式
7. 點擊 " 載入未封裝項目 "
8. 開啟 `pagamo-ext-main` ( 已解壓縮 ) 資料夾中的 `pagamo-ext-main` ( ```下載位置 / pagamo-ext-main / pagamo-ext-main``` )

# 示例

下載位置 : ```C:/Users/User/Downloads```

檔案位置 : ```C:/Users/User/Downloads/pagamo-ext-main.zip```

解壓縮後位置 : ```C:/Users/User/Downloads/pagamo-ext-main/```

則在步驟 6 時，需開啟已解壓縮的資料夾 ```C:/Users/User/Downloads/pagamo-ext-main/pagamo-ext-main/```

# 使用方式

1. 開啟 Develop Tool ( 按下 `F12` )

2. 輸入 ( 警告:變更此代碼可能導致錯誤 )
```js 
var globalWindow=window,originalXhrOpen=XMLHttpRequest.prototype.open;XMLHttpRequest.prototype.open=function(c,a){this._url=a;return originalXhrOpen.apply(this,arguments)};var originalXhrSend=XMLHttpRequest.prototype.send;
XMLHttpRequest.prototype.send=function(c){var a=this,b=a.onreadystatechange;a.onreadystatechange=function(){4===this.readyState&&("/rooms/train.json"==a._url||"/rooms/attack.json"==a._url?window.postMessage({type:"question",data:a.response,url:a._url},window.location.origin):"/rooms/submit.json"==a._url&&window.postMessage({type:"answer",data:a.response,url:a._url,give:decodeURI(c)},window.location.origin));b&&b.apply(this,arguments)};return originalXhrSend.apply(this,arguments)};
var originalFetch=globalWindow.fetch;globalWindow.fetch=function(c,a){return originalFetch.apply(this,arguments).then(function(b){console.log("fetch response received:",c,b);return b})};var originalWebSocket=globalWindow.WebSocket;
globalWindow.WebSocket=function(c,a){console.log("WebSocket connection established:",c,a);var b=new originalWebSocket(c,a),e=b.send;b.send=function(d){console.log("WebSocket message sent:",d);return e.apply(this,arguments)};b.addEventListener("message",function(d){console.log("WebSocket message received:",d.data)});return b};document.cookie="pgo-ext-ud="+JSON.stringify(window.currentGc);
```