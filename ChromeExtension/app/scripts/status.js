function getCurrentTab(callback) {
    var queryInfo =
    {
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



function renderStatusInTab(statusText)
{
    chrome.tabs.executeScript(
    {
        code: "var msg = '" + statusText + "'"
    });


    chrome.tabs.executeScript(
        null,
    {
        file: "scripts/injection/append.js" 
    },
    function (msg)
    {
        Log(msg);
    });
}

function clickStatus(e)
{
    getCurrentTabUrl(function (url)
    {
        renderStatusInTab('Tab URL: ' + url);
        Log(url);
    });
}




document.addEventListener('DOMContentLoaded', function () //status popup click action
{
    var div = document.getElementById('status');
    div.addEventListener('click', clickStatus);
});