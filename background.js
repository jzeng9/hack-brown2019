// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

chrome.runtime.onInstalled.addListener(function() {
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([{
      conditions: [new chrome.declarativeContent.PageStateMatcher({
        pageUrl: {hostEquals: 'www.amazon.com'},
      })],
      actions: [new chrome.declarativeContent.ShowPageAction()]
    }]);
  });
});

chrome.extension.onConnect.addListener(function(port) {
    port.onMessage.addListener(function(msg) {
        msg = JSON.parse(msg);
        if (msg['action'] == 'login') {
            $.ajax({
                url: "http://34.73.80.211:8000/login/", 
                type: "POST",
                data: JSON.stringify({'usrname': msg['usrname'], 'password': msg['password']}),
                crossDomain: true,
                contentType: "application/json",
                dataType: "json",
    
                success: function(data, status) {
                    chrome.runtime.sendMessage({
                        message: "login success", 
                        data: {
                            subject: "login",
                            content: "success",
                            usrname: msg['usrname']
                        }
                    });
                },
                error: function(data, status) {
                    chrome.runtime.sendMessage({
                        message: "login finished", 
                        data: {
                            subject: "login",
                            content: "fail"
                        }
                    });
                }
            });
        }

        if (msg['action'] == 'convert') {
            $.ajax({
                url: "http://34.73.80.211:8000/convert/",
                type: "POST",
                data: JSON.stringify({'usrname': msg['usrname'], 'image': msg['image']}),
                crossDomain: true,
                contentType: "application/json",
                dataType: "json",

                success: function(data, status) {
                    chrome.runtime.sendMessage({
                        message: "convert success", 
                        data: {
                            subject: "convert",
                            content: "success",
                            file_data: data['file']
                        }
                    });
                },
                error: function(data, status) {
                    chrome.runtime.sendMessage({
                        message: "convert finished", 
                        data: {
                            subject: "convert",
                            content: "fail"
                        }
                    });
                }
            })
        }
    });
});