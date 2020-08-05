chrome.storage.sync.get('lastDate', function(data) {
	var t = new Date();
	var date = (t.getMonth() + 1) + '月' + t.getDate() + '日';
	msgBoard.innerHTML = '上次打卡: ' + data.lastDate;
	if(date == data.lastDate)
		todayDone.innerHTML = '今日打卡成功😊';
	else
		todayDone.innerHTML = '今日未打卡😰';
});

chrome.storage.sync.get('province', function(data) {
	province.value = data.province;
});
chrome.storage.sync.get('city', function(data) {
	city.value = data.city;
});
chrome.storage.sync.get('district', function(data) {
	district.value = data.district;
});
chrome.storage.sync.get('sfzx', function(data) {
	sfzx.checked = data.sfzx;
});

saveInfo.onclick = function(){
	chrome.storage.sync.set({
		'province': province.value,
		'city': city.value,
		'district': district.value,
		'sfzx': sfzx.checked
	});
	msgBoard.innerHTML = "已保存";
}

report.style.backgroundColor = "#30E080";
report.onclick = function(){
	chrome.tabs.create({url: "https://healthreport.zju.edu.cn/ncov/wap/default/index?from=history}"});
	chrome.tabs.query({active: true}, function(tabs) {
		chrome.runtime.sendMessage({msg:tabs[0].id}, function(response) {});
	});
};

/*
vm.info.sfzx = "0";
vm.info.area = "广东省 深圳市 南山区";
vm.info.address = "广东省深圳市南山区南山街道龙坤居";
vm.info.city = "深圳市";
vm.info.province = "广东省";
vm.info.jrdqtlqk = ["0"];
vm.info.sfymqjczrj = 0;
vm.info.sfqrxxss = 1;
*/