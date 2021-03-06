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
});

function inject(id){
	var province = "NULL";
	var city = "NULL";
	var district = "NULL";
	var sfzx = "NULL";
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
	setTimeout( function(){
		// wait till the callbacks of chrome.storage.sync.get are executed
		if(province == "NULL" || city == "NULL" || district == "NULL" || sfzx == "NULL")
			alert("您的浏览器无法对存储访问做出正确且即时的应答，请重新尝试打卡。如果问题持续，请卸载本拓展并联系angrypop@protonmail.com。");
		var scriptsToExecute = '\
		var script = document.createElement("script"); \
		script.setAttribute("id", "你拿得住我吗"); \
		script.text = \' \
			vm.info.sfzx = "' + sfzx + '";\
			vm.info.area = "' + province + '省 ' + city + '市 ' + district + '区";\
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
	}, 1000);
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