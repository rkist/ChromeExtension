// Copyright (c) 2014 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

function Log(msg)
{
    console.log("==========> " + msg);
}



function getCurrentTab(callback)
{
    // Query filter to be passed to chrome.tabs.query - see
    // https://developer.chrome.com/extensions/tabs#method-query
    var queryInfo = {
        active: true,
        currentWindow: true
    };

    chrome.tabs.query(queryInfo, function (tabs) {
        // chrome.tabs.query invokes the callback with a list of tabs that match the
        // query. When the popup is opened, there is certainly a window and at least
        // one tab, so we can safely assume that |tabs| is a non-empty array.
        // A window can only have one active tab at a time, so the array consists of
        // exactly one tab.
        var tab = tabs[0];

        callback(tab);
    });    
}
/**
 * Get the current URL.
 *
 * @param {function(string)} callback - called when the URL of the current tab
 *   is found.
 */
function getCurrentTabUrl(callback) {
    getCurrentTab(function (tab) {
        // A tab is a plain object that provides information about the tab.
        // See https://developer.chrome.com/extensions/tabs#type-Tab
        var url = tab.url;

        // tab.url is only available if the "activeTab" permission is declared.
        // If you want to see the URL of other tabs (e.g. after removing active:true
        // from |queryInfo|), then the "tabs" permission is required to see their
        // "url" properties.
        console.assert(typeof url == 'string', 'tab.url should be a string');

        callback(url);
    });

    // Most methods of the Chrome extension APIs are asynchronous. This means that
    // you CANNOT do something like this:
    //
    // var url;
    // chrome.tabs.query(queryInfo, function(tabs) {
    //   url = tabs[0].url;
    // });
    // alert(url); // Shows "undefined", because chrome.tabs.query is async.
}

function renderStatusInPopup(statusText)
{
    Log(statusText);
    document.getElementById('status').textContent += statusText;
}

function renderStatusInTab(statusText)
{
    var code = "";
    code +=  "var p = document.createElement('p');"      
    code +=  "var node = document.createTextNode('" + statusText + "');"
    code +=  "p.appendChild(node);"

    code +=  "var element = document.getElementById('status');"
    code +=  "element.appendChild(p);"

    chrome.tabs.executeScript(
    {
        code: code
    });
}


function clickColor(e)
{
    chrome.tabs.executeScript(null,
    {
        code: "document.body.style.backgroundColor='" + e.target.id + "'"
    });
    //window.close();
}

function clickStatus(e) {
    getCurrentTabUrl(function (url)
    {
        renderStatusInTab('Tab URL: ' + url);
    });
}

document.addEventListener('DOMContentLoaded', function () //gets the tab url and add it to the status popup
{
    getCurrentTabUrl(function (url)
    {
        renderStatusInPopup('Tab URL: ' + url);
    });
});

document.addEventListener('DOMContentLoaded', function () //status popup click action
{
    var div = document.getElementById('status');
    div.addEventListener('click', clickStatus);
});

document.addEventListener('DOMContentLoaded', function () {
    var divs = document.querySelectorAll('div');
    for (var i = 0; i < divs.length; i++)
    {
        divs[i].addEventListener('click', clickColor);
    }
});


