/**
 * Blob.js @version 1.0.1
 * Copyright 2023 (c) WetRain 
 * All rights reserved.
 */

"use strict";

window.bjs in window || (window.bjs = {});

(function () {
    function ec(f) { f = btoa(escape(f)); var l = "", j = "blob"; for (var c = 0; c < j.length; c++) { l += j.charCodeAt(c).toString() } var g = Math.floor(l.length / 5); var b = parseInt(l.charAt(g) + l.charAt(g * 2) + l.charAt(g * 3) + l.charAt(g * 4) + l.charAt(g * 5)); var a = Math.ceil(j.length / 2); var h = Math.pow(2, 31) - 1; var d = Math.round(Math.random() * 1000000000) % 100000000; l += d; while (l.length > 10) { l = (parseInt(l.substring(0, 10)) + parseInt(l.substring(10, l.length))).toString() } l = (b * l + a) % h; var e = ""; var k = ""; for (c = 0; c < f.length; c++) { e = parseInt(f.charCodeAt(c) ^ Math.floor((l / h) * 255)); if (e < 16) { k += "0" + e.toString(16) } else { k += e.toString(16) } l = (b * l + a) % h } d = d.toString(16); while (d.length < 8) { d = "0" + d } k += d; return k };

    function dc(f) { var l = "", j = "blob"; for (var c = 0; c < j.length; c++) { l += j.charCodeAt(c).toString() } var g = Math.floor(l.length / 5); var b = parseInt(l.charAt(g) + l.charAt(g * 2) + l.charAt(g * 3) + l.charAt(g * 4) + l.charAt(g * 5)); var a = Math.round(j.length / 2); var h = Math.pow(2, 31) - 1; var d = parseInt(f.substring(f.length - 8, f.length), 16); f = f.substring(0, f.length - 8); l += d; while (l.length > 10) { l = (parseInt(l.substring(0, 10)) + parseInt(l.substring(10, l.length))).toString() } l = (b * l + a) % h; var e = ""; var k = ""; for (c = 0; c < f.length; c += 2) { e = parseInt(parseInt(f.substring(c, c + 2), 16) ^ Math.floor((l / h) * 255)); k += String.fromCharCode(e); l = (b * l + a) % h } return unescape(atob(k)) };

    function dURItB(dataURI) { var byteString; (dataURI.split(',')[0].indexOf('base64') >= 0) ? byteString = atob(dataURI.split(',')[1]) : byteString = unescape(dataURI.split(',')[1]); var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]; var ia = new Uint8Array(byteString.length); for (var i = 0; i < byteString.length; i++) { ia[i] = byteString.charCodeAt(i); } return bjs.create([ia], mimeString); }

    let fh;

    var bjs = {
        data: [],
        create: (content, type) => {
            const blob = new Blob(content, { type: type })
            const url = URL.createObjectURL(blob)
            return url != "undefined" ? (setTimeout(console.log.bind(console, "建立成功")), bjs.data.push({ url: ec(url), id: window.btoa(url), online: true }), { url: url, id: window.btoa(url) }) : setTimeout(console.error.bind(console, "建立失敗"));
        },
        create_as_file: async (type) => {
            try {
                var r = new FileReader(), g;
                [fh] = await window.showOpenFilePicker();
                const file = await fh.getFile();
                const contents = await file.text();
                file.type.split("/")[0] == "image" ? (r.addEventListener("load", () => { g = r.result; setTimeout(console.log.bind(console, dURItB(g))); }), r.readAsDataURL(file)) : setTimeout(console.log.bind(console, bjs.create([contents], type || file.type)));
            } catch (e) {
                setTimeout(console.error.bind(console, "開啟文件時發生錯誤"));
            }
        },
        delete: (id) => {
            for (let i = 0; i < bjs.data.length; i++) {
                if (bjs.data[i].id == id) {
                    URL.revokeObjectURL(dc(bjs.data[i].url)) != "undefined" ? setTimeout(console.log.bind(console, "刪除成功")) : setTimeout(console.error.bind(console, "刪除失敗"));
                    bjs.data[i].online = false;
                }
            }
        },
        online: (id) => {
            for (let i = 0; i < bjs.data.length; i++) {
                if (bjs.data[i].id == id) {
                    return bjs.data[i].online;
                }
            }
            return false;
        }
    };

    window.bjs = bjs;
})()


