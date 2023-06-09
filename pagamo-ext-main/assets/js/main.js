"use strict";

var $ = (s) => { return document.querySelector(s); };

var mode = {
    contests: false,
    collect: false,
    auto_complete: false
};

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action == "change") {
        if (request.action == "collect") {
            if (request.success == true) {
                request.mode.forEach(i => {
                    mode[i] = mode[i] == true ? false : true;
                });
                if (request.mode.includes("auto_complete") == true) {
                    $('[data-btn="auto_complete"]').checked = true;
                    $('[data-btn="auto_complete"]').disabled = true;
                } else {
                    $('[data-btn="auto_complete"]').checked = false;
                    $('[data-btn="auto_complete"]').disabled = false;
                }
            }
        } else if (request.action == "auto_complete") {
            if (request.success == true) {
                mode[i] = mode[i] == true ? false : true;
            }
        }
    } else if (request.action == "verify") {
        div.innerHTML = request.mode;
        mode.auto_complete = request.other.auto_complete;
        mode.contests = request.other.contests;
        mode.collect = request.other.collect;
        request.other.auto_complete == true && ($('[data-btn="auto_complete"]').checked = true);
        request.other.collect == true && ($('[data-btn="collect"]').checked = true);
    }
    // 處理 links 數組
})

$('[data-btn="collect"]').addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: 'collect' });
})
$('[data-btn="auto_complete"]').addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: 'auto_complete' });
})
chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { action: 'verify' });
})