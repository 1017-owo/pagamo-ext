/**
 * PaGamO Answer Database @version 1.0
 * Copyright 2023 (c) WetRain 
 * All rights reserved.
 */

"use strict";

function setcookie(name, value, daysTolive) { let cookie = name + "=" + encodeURIComponent(value); if (typeof daysTolive === "number") cookie += "; max-age =" + (daysTolive * 60 * 60 * 24); document.cookie = cookie; }; function getCookie(cname) { let name = cname + "="; let decodedCookie = decodeURIComponent(document.cookie); let ca = decodedCookie.split(';'); for (let i = 0; i < ca.length; i++) { let c = ca[i]; while (c.charAt(0) == ' ') { c = c.substring(1); } if (c.indexOf(name) == 0) { return c.substring(name.length, c.length); } } return ""; };

var globalWindow = window.top.window;

function monitorRequests() {
    // 監聽 XMLHttpRequest
    const originalXhrOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (method, url) {
        this._url = url;
        return originalXhrOpen.apply(this, arguments);
    };

    const originalXhrSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = function () {
        const xhr = this;
        const originalOnReadyStateChange = xhr.onreadystatechange;
        xhr.onreadystatechange = function () {
            if (this.readyState === 4) {
                if (xhr._url == "/rooms/attack.json") {
                    console.log("Question Datas :", xhr.responseText);
                } else {
                    console.log("XMLHttpRequest response received:", xhr._url, xhr.responseText);
                }
            }
            if (originalOnReadyStateChange) {
                originalOnReadyStateChange.apply(this, arguments);
            }
        };
        return originalXhrSend.apply(this, arguments);
    };

    // 監聽 fetch
    const originalFetch = globalWindow.fetch;
    globalWindow.fetch = function (url, options) {
        return originalFetch.apply(this, arguments).then(response => {
            console.log("fetch response received:", url, response);
            return response;
        });
    };

    // 監聽 WebSocket
    const originalWebSocket = globalWindow.WebSocket;
    globalWindow.WebSocket = function (url, protocols) {
        console.log("WebSocket connection established:", url, protocols);
        const socket = new originalWebSocket(url, protocols);
        const originalSend = socket.send;
        socket.send = function (data) {
            console.log("WebSocket message sent:", data);
            return originalSend.apply(this, arguments);
        };
        socket.addEventListener("message", function (event) {
            console.log("WebSocket message received:", event.data);
        });
        return socket;
    };
}

monitorRequests();

document.cookie = 'pgo-ext-mode=false';

; (() => {
    var req = async (m, u, t, h, d, f) => { try { var aj = new XMLHttpRequest(); aj.open(m, u, t); Array.isArray(h) == true && h.forEach(e => { aj.setRequestHeader(e[0], e[1]); }); aj.send(d); f && {}.toString.call(f) === '[object Function]' ? aj.onreadystatechange = f(aj) : null; return aj; } catch (e) { return console.log("An error occurred while executing : ", e); }; };

    var $ = (s, t) => { return t == true ? document.querySelectorAll(s) : document.querySelector(s); };

    var pkg = {};

    var mode = {
        contests: location.pathname.split("/")[1] == "contests" ? true : false,
        collect: false,
        auto_complete: false
    };

    pkg.ansTypes = ["alphabet", "trueFalse"]; // alphabet 選擇題
    pkg.Types = ["choice", "true_or_false"]; // choice 選擇題

    /**
     * ansTypes ? alphabet => get(answer_button_count) => get(answers_count) => getAnswer("alphabet", abc, ac); set("options", selections);
     * ansTypes ? alphabet => get(answer_button_count) => get(answers_count) => getAnswer("alphabet", abc, ac); set("options", selections);
     */
    pkg.window = {};
    pkg.msg = (_pjs_m_func_v_1$ad_sa, _pjs_t_func_v_1$ad_sa) => { return _pjs_t_func_v_1$ad_sa == "error" ? setTimeout(console.error.bind(console, _pjs_m_func_v_1$ad_sa)) : _pjs_t_func_v_1$ad_sa == "warn" ? setTimeout(console.warn.bind(console, _pjs_m_func_v_1$ad_sa)) : setTimeout(console.log.bind(console, _pjs_m_func_v_1$ad_sa)); };

    window.setWindowObject = (g) => {
        !g ? null : pkg.window = g;
    }

    window.addEventListener('ajaxReadyStateChange', function (e) {
        console.log(e.detail); // XMLHttpRequest Object
    });

    // window.addEventListener("load", () => {
    var answer = [];
    var order = ["A", "B", "C", "D", "E", "F", "G", "H"];
    var question = null;
    var quetype = 0;
    var option = [];
    var que_exist = false;
    var question_temp_data = {};
    const getAnswer = function () {
        var qd = JSON.parse(question_temp_data.data).data.question_data.question;
        if (pkg.ansTypes.indexOf(qd.answer_type) < 0 || pkg.Types.indexOf(qd.type) < 0) {
            return console.log(`不支援題目類型 ( ${qd.type} ), 答案類型 ( ${qd.answer_type} )`);
        }
        if (qd.answer_type == pkg.ansTypes[0] && qd.type == pkg.Types[0]) { // 選擇題
            console.log(`答案總數 : ${qd.render_info.answers_count}`);
        }
        /* 原始版
        req("GET", `https://pagamo.codepaimon.repl.co/get?que=${question}`, null, null, null, xhr => {
            if (xhr.status == 200) {
                if (JSON.parse(xhr.response)["answer"]) {
                    for (let i = 0; i < $(".pgo-style-selection-13WO94", true).length; i++) {
                        if ($(`.pgo-style-selection-13WO94 > .pgo-style-selection-content-1JGhEL`, true)[i].children[0].innerHTML == JSON.parse(xhr.response)["answer"]) {
                            index = i;
                        }
                    }
                    $(".input-group-area.pgo-style-inputs-area-2w2qDZ").children[index].click();
                    $("#answer-panel-submit-button").click();
                    return console.log("Answer is", JSON.parse(xhr.response)["answer"]);
                } else {
                    return console.log("Not found.");
                }
            }
        }) */
        req("POST", "https://pagamo.codepaimon.repl.co/v2/g", false, [["Content-Type", "application/json;charset=UTF-8"]], JSON.stringify({
            qid: qd.render_info.q_info_id,
            qt: qd.render_info.content.replace(/<\/?.+?>/g, ""),
            qo: qd.render_info.content.replace(/<\/?.+?>/g, "") == "" && qd.render_info.selections
        }), xhr => {
            if (xhr.readyState === 4 && xhr.status === 200) {
                mode.collect = getCookie("pgo-ext-mode") == "true" ? true : false;
                var abs = JSON.parse(JSON.parse(xhr.response)["correct"]);
                if (JSON.parse(JSON.parse(xhr.response)["type"] == "has_id")) {
                    que_exist = true
                } else if (JSON.parse(JSON.parse(xhr.response)["type"] == "id_not_found")) {
                    que_exist = false;
                }
                if (qd.answer_type == pkg.ansTypes[0] && qd.type == pkg.Types[0] && abs.length > 0) {
                    for (let i = 0; i < abs.length; i++) {
                        for (let j = 0; j < qd.render_info.selections.length; j++) {
                            if (abs[i] == order.indexOf(qd.render_info.selections[j]["position"])) {
                                abs[i] = order.indexOf(qd.render_info.selections[j]["position"]);
                            }
                        }
                    }
                    console.log(abs)
                    for (let i = 0; i < abs.length; i++) {
                        var t = $('[data-org-position]', true);
                        for (let u = 0; u < t.length; u++) {
                            if (t[u].getAttribute("data-org-position") == order[abs[i]]) {
                                $(".btn_4a1.pgo-style-input-answer-2o3iYm", true)[u].click();
                            }
                        }
                    }
                    if (mode.auto_complete == true && mode.contests == false || mode.collect == true && mode.contests == false) $("#answer-panel-submit-button").click();
                } else if (abs.length > 0) {
                    for (let i = 0; i < abs.length; i++) {
                        $(".c1A2.pgo-style-input-answer-2o3iYm", true)[abs[i]].click();
                    }
                    if (mode.auto_complete == true && mode.contests == false || mode.collect == true && mode.contests == false) $("#answer-panel-submit-button").click();
                } else {
                    if (mode.collect == true && mode.contests == false) {
                        if (qd.answer_type == pkg.ansTypes[0] && qd.type == pkg.Types[0]) {
                            $(".btn_4a1.pgo-style-input-answer-2o3iYm", true)[Math.floor(Math.random() * $(".btn_4a1.pgo-style-input-answer-2o3iYm", true).length)].click();
                        } else if (qd.answer_type == pkg.ansTypes[1] && qd.type == pkg.Types[1]) {
                            $(".c1A2.pgo-style-input-answer-2o3iYm", true)[Math.floor(Math.random() * $(".c1A2.pgo-style-input-answer-2o3iYm", true).length)].click();
                        }
                        return $("#answer-panel-submit-button").click();
                    } else {
                        return console.log("Not found.");
                    }
                }
            }
        })
    };
    const sendAnswer = function (a) {
        if (!Array.isArray(a) || que_exist == true) return console.log();
        var qd = JSON.parse(question_temp_data.data).data.question_data.question;
        req("POST", "https://pagamo.codepaimon.repl.co/v2/a", false, [["Content-Type", "application/json;charset=UTF-8"]], JSON.stringify({
            question_id: qd.render_info.q_info_id,
            question_content: qd.render_info.content.replace(/<\/?.+?>/g, ""),
            question_options: qd.render_info.selections,
            question_answers: a
        }), xhr => {
            if (xhr.readyState === 4 && xhr.status === 200) {
                if (xhr.response == "Success") {
                    return console.log("Success");
                }
            }
        })
    }
    const callback = async () => {
        if ($(".pgo-style-question-container-2zGpR1[data-question-id]") !== null) {
            // 顯示答案
            answer = [];
            var qd = JSON.parse(question_temp_data.data).data.question_data.question;
            if (qd.answer_type == pkg.ansTypes[0] && qd.type == pkg.Types[0]) {
                if (document.querySelector('[data-correct="true"]') !== null) {
                    var ga = document.querySelectorAll('[data-correct="true"]');
                    for (let i = 0; i < ga.length; i++) {
                        answer.push(order.indexOf(ga[i].getAttribute("data-org-position")));
                    }
                }
            } else if (qd.answer_type == pkg.ansTypes[1] && qd.type == pkg.Types[1]) {
                if (document.querySelector(".pgo-style-question-detail-info-l7L8qm") !== null) {
                    document.querySelector(".pgo-style-question-detail-info-l7L8qm").innerHTML == "O" ? answer = [0] : answer = [1]
                }
            }
            answer !== null && (pkg.msg(`Question：${question}\nOptions：${option}\nAnswer：${answer}`), sendAnswer(answer));
        }
    }
    const ob = new MutationObserver(callback);
    ob.observe(document.body, {
        childList: true
    });

    var style = document.createElement("style");
    style.innerHTML = `*{user-select: auto !important;}.ext-setting{position: fixed; bottom: 30px; right: 30px; width: 50px; height: 50px; z-index: 99999999; background: rgba(101, 101, 101, .9); background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke-width='1.5' stroke='%23fff' class='w-6 h-6' style='width: 30px;height: 30px'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z' /%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M15 12a3 3 0 11-6 0 3 3 0 016 0z' /%3E%3C/svg%3E%0A"); background-size: 40px; background-repeat: space; background-position: center; border-radius: 50%; padding: 10px; cursor: pointer;}.switch{position: relative; display: inline-block; width: 70px; height: 34px; scale: .7; display: flex; align-items: center; margin-left: 15px;}/* Hide default HTML checkbox */.switch input{opacity: 0; width: 0; height: 0;}/* The slider */.slider{position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ccc; -webkit-transition: .4s; transition: .4s;}.slider:before{position: absolute; content: ""; height: 26px; width: 26px; left: 4px; bottom: 4px; background-color: white; -webkit-transition: .4s; transition: .4s;}input:checked+.slider{background-color: #2196F3;}input:focus+.slider{box-shadow: 0 0 1px #2196F3;}input:checked+.slider:before{-webkit-transform: translateX(36px); -ms-transform: translateX(36px); transform: translateX(36px);}/* Rounded sliders */.slider.round{border-radius: 34px;}.slider.round:before{border-radius: 50%;}.switch-description{-webkit-transform: translateX(81px); -ms-transform: translateX(81px); transform: translateX(81px); font-size: 142%; white-space: nowrap; position: absolute;}section.title{text-align: center; margin-top: 30px; margin-bottom: 15px; font-size: 18px;}.ext-modal.ext-modal-hide{display: none;}.ext-modal{display: flex;}.ext-mode-modal{z-index: 9999; background: #fff; padding: 10px;width: 50vw; max-width: 450px; border-radius: 5px; display: flex; justify-content: space-between; align-items: center;}.close{float: right; width: 30px; height: 30px; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke-width='1.5' stroke='%23000' class='w-6 h-6'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M6 18L18 6M6 6l12 12' /%3E%3C/svg%3E%0A"); text-align: right; position: relative; right: 5px;}.ext-mode{display: flex; align-items: center; align-content: space-around;}label.switch{margin: auto 0;}.ext-modal{width: 100vw; height: 100vh; position: fixed; z-index: 9999; align-items: center; justify-content: center; background: rgba(0, 0, 0, .4); backdrop-filter: blur(2px);}`;
    document.head.appendChild(style);

    window.top.window.addEventListener('ajaxReadyStateChange', function (e) {
        console.log(e.detail);
    })

    pkg.msg("PaGamO Answer Database Loaded.");

    window.addEventListener("message", (e) => {
        console.log(e)
        if (e.data.type === "question" && JSON.parse(e.data.data).status == "ok") {
            question_temp_data = e.data;
            getAnswer();
        } else if (e.data.type === "answer" && mode.contests == true && question_temp_data.data !== "undefined" && JSON.parse(e.data.data).status == "ok") {
            var qd = JSON.parse(question_temp_data.data).data.question_data.question;
            console.log(JSON.parse(e.data.give));
            var t = [];
            if (qd.answer_type == pkg.ansTypes[0] && qd.type == pkg.Types[0]) {
                JSON.parse(e.data.give).ans.forEach(i => {
                    t.push(order.indexOf(i));
                })
            } else if (qd.answer_type == pkg.ansTypes[1] && qd.type == pkg.Types[1]) {
                t.push(JSON.parse(e.data.give).ans == "O" ? 0 : 1);
            }
            JSON.parse(e.data.data).data.correct == 1 && sendAnswer(t);
        }
    })

    window.addEventListener("load", () => {
        var setting = document.createElement("div");
        setting.classList.add("ext-setting");
        setting.setAttribute("onclick", 'document.querySelector(".ext-modal").classList.remove("ext-modal-hide")')
        document.body.appendChild(setting);
        var modal = document.createElement("div");
        modal.innerHTML = `<div class="ext-mode-modal"><div class="ext-mode"><label class="switch" data-btn="collect" ${mode.contests == true && 'style="cursor: not-allowed"'}><input type="checkbox" onchange="var g = false;if (this.checked == true) g=true;document.cookie = 'pgo-ext-mode=' + g" ${mode.contests == true && "disabled"}><span class="slider round"></span><span class="switch-description">Collect Mode</span></label></div><div class="close" onclick="this.parentNode.parentNode.classList.add('ext-modal-hide')"></div></div>`;
        modal.className = "ext-modal ext-modal-hide";
        document.body.appendChild(modal);
    })
    //})
})()