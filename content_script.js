
// alert($("#main-image-container .selected img").attr("src"));

// chrome.extension.onMessage.addListener(
//     function (request, sender, sendResponse) {
//         alert(request.action);
//     }
// );

  
chrome.extension.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.action === "extract") {
            var ctrl = $("#main-image-container .selected img");
            if (ctrl.length > 0) {
                if (sendResponse) sendResponse(ctrl.attr("src"));
            } else {
                alert("No data");
            }
        }
    }
);