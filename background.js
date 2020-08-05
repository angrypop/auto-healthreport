// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

chrome.runtime.onInstalled.addListener(function() {
	chrome.storage.sync.set({'color': '#3aa757'}, function() {
		console.log("The color is green.");
	});
	chrome.storage.sync.set({'lastDate': '0月0日'}, function() {
		console.log("Default date: 0.0.");
	});
	chrome.storage.sync.set({'province': '广东'}, function() {});
	chrome.storage.sync.set({'city': '深圳'}, function() {});
	chrome.storage.sync.set({'district': '南山'}, function() {});
	chrome.storage.sync.set({'sfzx': false}, function() {});
});

function sleep(millis){
    var date = new Date();
    var curDate = null;
    do { curDate = new Date(); }
    while(curDate-date < millis);
	return true;
};

function inject(id){
	chrome.tabs.executeScript(id, {code: 'console.log("HAHA");'});	
	var province = "广东";
	var city = "深圳";
	var district = "南山";
	var sfzx = "0";
	chrome.storage.sync.get('province', function(data) {
		province = data.province;
	});
	chrome.storage.sync.get('city', function(data) {
		city = data.city;
	});
	chrome.storage.sync.get('district', function(data) {
		district = data.district;
	});
	chrome.storage.sync.get('sfzx', function(data) {
		if(data.sfzx) sfzx = "1";
		else sfzx = "0";
	});
	var scriptsToExecute = '\
		var script = document.createElement("script"); \
		script.setAttribute("id", "你拿得住我吗"); \
		script.text = \' \
			vm.info.sfzx = ' + sfzx + ';\
			vm.info.area = "' + province + '省' + city + '市' + district + '区";\
			vm.info.address = "' + province + '省' + city + '市' + district + '区";\
			vm.info.city = "' + city + '市";\
			vm.info.province = "' + province +'省";\
			vm.info.jrdqtlqk = ["0"];\
			vm.info.sfymqjczrj = 0;\
			vm.info.sfqrxxss = 1;\
			vm.confirm();\
		\'; \
		var parent = document.documentElement; \
		parent.appendChild(script);\
	';
	chrome.tabs.executeScript(id, {code: scriptsToExecute});
	var t = new Date();
	var date = (t.getMonth() + 1) + '月' + t.getDate() + '日';
	chrome.storage.sync.set({'lastDate': date});
};

chrome.runtime.onStartup.addListener(function() {
	chrome.storage.sync.get('lastDate', function(data) {
		var t = new Date();
		var date = (t.getMonth() + 1) + '月' + t.getDate() + '日';
		if(date != data.lastDate){
			chrome.tabs.create({url: "https://healthreport.zju.edu.cn/ncov/wap/default/index?from=history}"});
		}
	});
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	// alert("Msg recieved: " + request.msg);
	inject(request.msg);
	sendResponse();
});

chrome.webNavigation.onCompleted.addListener(function(details) {
	if (details.url.match("healthreport.zju.edu.cn")) {
		// alert("ID: " + details.tabId);
        inject(details.tabId);
	}
});