
chrome.webRequest.onBeforeSendHeaders.addListener(
    function(details) {
        console.log(details);
        if (details.url !== undefined && details.url.indexOf('facebook.com/composer/ocelot/async_loader') > -1) {
            console.log(details);
            //details holds all request information. 

            for (var i = 0; i < details.requestHeaders.length; ++i) {
                //Find and change the particular header.
                if (details.requestHeaders[i].name === 'Origin') {
                    details.requestHeaders[i].value ="https://www.facebook.com";
                    // break;
                }
                if (details.requestHeaders[i].name === 'Referer') {
                    details.requestHeaders[i].value ="https://www.facebook.com";
                }
            }
            details.requestHeaders.push({name: "Referer", value: "https://www.facebook.com"})
        }
        return { requestHeaders: details.requestHeaders };
    },
    {urls: ["<all_urls>"]},
    ['blocking', 'requestHeaders']
);