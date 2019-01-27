$('.error-msg').hide();

$('.message a').click(function(){
    $('form').animate({height: "toggle", opacity: "toggle"}, "slow");
});

var video;
$('input[type=file]').on('change', function(event){
  video = event.target.files[0];
});

$('.register-form button').click(function(){
     var username = $('.register-form .name').val();
     var password = $('.register-form .password').val();
     var email_address = $('.register-form .email').val();

     var data = new FormData();
     data.append("video", video);
     data.append('username', username);
     data.append('password', password);
     data.append('email', email_address);

     // send to server
     $.ajax({
        url: 'http://104.196.17.160:8000/logon/',
        type: 'POST',
        data: data,

        cache: false,
        dataType: 'json',
        processData: false, // Don't process the files
        contentType: false, // Set content type to false as jQuery will tell the server its a query string request
        
        success: function(data, textStatus){
            alert("success");
            Cookies.set('email', username, {expire: 1});
            $('.page').animate({height: "toggle", opacity: "toggle"}, "slow");
        },

        error: function(data, textStatus){
            alert(textStatus);
            $('.register-form .error-msg').show();
        }
     })
 });

var bp_port = chrome.extension.connect({
    name: "Sample Communication"
});

 $('.login-form button').click(function(){
    var username = $('.login-form .username').val();
    var password = $('.login-form .password').val();

    bp_port.postMessage(JSON.stringify({'action': 'login', 'usrname': username, 'password': password}));
 });

 chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.data.subject === "login" && request.data.content == 'success') {
            Cookies.set('usrname', request.data.usrname, {expire: 1});
            $('.page').animate({height: "toggle", opacity: "toggle"}, "slow");

            extract_show_image();
        }

        if (request.data.subject == "convert" && request.data.content == "success") {
            $("#origin-img").attr("src", "data:image/jpg;base64, " + request.data.file_data);
        }
    }
);

function extract_show_image() {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { action: "extract" }, function (response) {
            $("#origin-img").attr("src", response);
        });
    }); 
}
// chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
//     chrome.tabs.sendMessage(tabs[0].id, { action: "extract" }, function (response) {
//         $("#origin-img").attr("src", response);
//     });
// }); 
//  $('.login-page').hide();
//  $('.generate-page').show(); 

 if (Cookies.get('usrname') === undefined) {
    $('.login-page').show();
    $('.generate-page').hide(); 
} else {
    $('.login-page').hide();
    $('.generate-page').show(); 
    extract_show_image();
}

// send image
$(".generate-page button").click(function() {
    bp_port.postMessage(JSON.stringify({'action': 'convert', 'usrname': Cookies.get('usrname'), 'image': $("#origin-img").attr('src')}));
});
