var listCookies=[];
var currentCookie="";
var currentUid = "";
var _data = "";
var cuser = "";
var xs = "";
var fr = "";
var datr = "";
var imei = "";

function loadCookie() {
    chrome.tabs.getSelected(null, function (tab) { // null defaults to current window
		var currentUrl=tab.url;
		if(currentUrl.indexOf('chrome://newtab')>-1){
			currentUrl="https://www.facebook.com";
		}
		var listCookieZalo = [];
		if (currentUrl.includes('chat.zalo.me')) {
			chrome.cookies.getAll({}, function (cookie) {
				for (var i = 0; i < cookie.length; i++) {
					if (cookie[i].domain.includes('zalo')) {
				    listCookieZalo.push(cookie[i]);
					}
				}

				
				chrome.tabs.getSelected(null, function(tab) {
					chrome.tabs.executeScript(tab.id,{
					code: 'localStorage["z_uuid"]',}, function (imei){ 
						  if(imei!=undefined && imei!=null && imei!=''){
							result = "imei="+imei+";";
							var jsonCookie = JSON.stringify(listCookieZalo);
			             	currentCookie = jsonCookie + '|' + result + '|' + navigator.userAgent;
			             	document.getElementById('cookieResult').value = currentCookie;
						  }
					  });
				});
				

				// chrome.tabs.getSelected(null, function(tab) {
				//   chrome.tabs.executeScript(tab.id,{
				//   code: 'localStorage["Uuid"]',}, function (results){ 
				// 		if(results!=undefined && results!=null && results!=''){
				// 		currentCookie+= "Uuid="+results+"; ";
				// 		document.getElementById('cookieResult').value = currentCookie;}
				// 	});
				// });
			});
		} else {
		$('#UrlCookieCurrent').html(extractHostname(currentUrl));
        chrome.cookies.getAll({ "url": currentUrl }, function (cookie) {
            var result = "";
            for (var i = 0; i < cookie.length; i++) {
                result += cookie[i].name + "=" + cookie[i].value + ";";
                if (cookie[i].name == "c_user") {
                    currentUid = cookie[i].value;
                }
			}
			

			chrome.tabs.getSelected(null, function(tab) {
				chrome.tabs.executeScript(tab.id,{
				code: 'localStorage["z_uuid"]',}, function (imei){ 
					  if(imei!=undefined && imei!=null && imei!=''){
						result += "imei="+imei+"; ";
					  }
					  document.getElementById('cookieResult').value = result + '|' + navigator.userAgent;
				  });
			});
            
            // document.getElementById('cookieResult').value = result + '|' + navigator.userAgent;
            currentCookie = result + '|' + navigator.userAgent;
			// chrome.tabs.getSelected(null, function(tab) {
			//   chrome.tabs.executeScript(tab.id,{
			//   code: 'localStorage["Uuid"]',}, function (results){ 
			// 		if(results!=undefined && results!=null && results!=''){
			// 		currentCookie+= "Uuid="+results+"; ";
			// 		document.getElementById('cookieResult').value = currentCookie;}
			// 	});
			// });
		});
	}
		if(currentUrl.indexOf('facebook')>-1){
			document.getElementById('DivFbIdCurrent').style.display = "block";
			chrome.tabs.executeScript(tab.id,{
			  code: 'var fid= "";function getuid(){'+
				  'try{var arr= document.getElementById("entity_sidebar").getElementsByTagName("a"); for(var i=0; i<arr.length;i++){ var href = arr[i].getAttribute("href")+" ";if(href.indexOf("photos")>-1){ return href.split("/")[1]; }}}catch(ex){}'+
				  'try{var arr= document.getElementById("headerArea").getElementsByTagName("div"); for(var i=0; i<arr.length;i++){ var href = arr[i].getAttribute("id")+" ";if(href.indexOf("headerAction_")>-1){ return href.split("_")[1]; }}}catch(ex){}'+
				  'try{return JSON.parse(document.getElementById("pagelet_timeline_main_column").getAttribute("data-gt")).profile_owner;}catch(ex){}'+
				  'try{return document.getElementsByName("ft_ent_identifier")[0].value;}catch(ex){}'+
				  '}   getuid();' //argument here is a string but function.toString() returns function's code
				}, function (results){
				  document.getElementById('CurrentFbId').value = results[0];
				});
		}else{
			document.getElementById('DivFbIdCurrent').style.display = "none";
		}
    });
}

loadCookie();


document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('cookieResult').onclick = function(){
		document.getElementById('cookieResult').select();
	};
	 document.getElementById('CurrentFbId').onclick = function(){
		document.getElementById('CurrentFbId').select();
	};
	document.getElementById('btnImportCookie').onclick = function(){
		var cookie = document.getElementById('cookieResult').value;
		if(cookie==''){
			chrome.tabs.getSelected(null, function(tab) {
			  var code = 'alert("Please enter cookie to import!");';
			  chrome.tabs.executeScript(tab.id, {code: code});
			});
			return;
		}
		importCookie(cookie);
	};

	if (localStorage.getItem("listCookies") === null) {
        //...
    } else {
        listCookies = JSON.parse(localStorage.listCookies);
    }
	for(var i=0; i<listCookies.length;i++) {
        addNewCookie(listCookies[i]);
    }

	$('#btnSaveCookie').click(function(){
		var cookieList= document.getElementById('cookieResult').value.split('\n');
		if(cookieList.length>1){
			for (var i = 0; i < cookieList.length; i++) {
				var cookie=cookieList[i];
				var arr = cookie.split("|");
				if(arr.length>1){
					 for (var k = 0; k < arr.length; k++) {
						try {
							if(arr[k].indexOf('c_user')>-1){
							cookie=arr[k];
							}
						} catch (ex) {
						   
						}
					}
				}
				const regex = /c_user=(\d+)/g;
				var m;
				var uid = '';
				while ((m = regex.exec(cookie)) !== null) {
					uid=m[1]
				}
				if(uid!=''){
					var cc={
						uid:uid,
						name:uid,
						cookie:cookie,
						token:''
					};
					var isExist = false;
					for (var j = 0; j < listCookies.length; j++) {
						  if (listCookies[j].uid == cc.uid) {
							  listCookies[j] = cc;
							  isExist = true;
						  }
					}
					if (!isExist) {
						listCookies.push(cc);
						addNewCookie(cc)
					}
				}
			}
			localStorage.listCookies = JSON.stringify(listCookies);
		}else{
			chrome.tabs.getSelected(null, function(tab) {
			  chrome.tabs.executeScript(tab.id,{
			  code: 'var name= "";try{name=document.getElementById("userNav").getElementsByTagName("a")[1].getAttribute("title");}catch(ex){}'+
			  'if(name==undefined || name==""){const regex = /"NAME":"(.*?)"/g;const str = document.documentElement.innerHTML;var m=regex.exec(str); name=m[1];} name' //argument here is a string but function.toString() returns function's code
				}, function (results){ 
					var name = results[0];
					var x=name;
					var r = /\\u([\d\w]{4})/gi;
					x = x.replace(r, function (match, grp) {
						return String.fromCharCode(parseInt(grp, 16)); } );
					x = unescape(x);
					name=x;
					var cc={
						uid:currentUid,
						name:name,
						cookie:currentCookie,
						token:''
					};
					var isExist = false;
					for (var j = 0; j < listCookies.length; j++) {
						  if (listCookies[j].uid == cc.uid) {
							  listCookies[j] = cc;
							  isExist = true;
						  }
					}
					if (!isExist) {
						listCookies.push(cc);
						addNewCookie(cc)
					}
					localStorage.listCookies = JSON.stringify(listCookies);
				});
			});
		}
		
	})

	$("#btncookielogout").click(function(){
		clearAllCookies(function () {
			 chrome.tabs.getSelected(null, function (tab) {
				var code = 'window.location.reload();';
				chrome.tabs.executeScript(tab.id, { code: code });
			});
		});
	});
		
	$("#btnAutoAddFriendFb").click(function(){
		chrome.tabs.getSelected(null, function (tab) {
			// for the current tab, inject the "diep.js" file & execute it
			chrome.tabs.executeScript(tab.id, {
				file: 'add-friends-in-list-group-members-or-in-another-list-friends.js'
			});
		});
	});
	
	$("#btnUnfriendAllFriends").click(function(){
		chrome.tabs.getSelected(null, function (tab) {
			// for the current tab, inject the "diep.js" file & execute it
			chrome.tabs.executeScript(tab.id, {
				file: 'unfriend-all-friends.js'
			});
		});
	});
	
	$('#btnGetQRCode').click(function(){
		$('#QRCode').attr("src","https://chart.googleapis.com/chart?chs=256x256&cht=qr&chl="+encodeURI($('#cookieResult').val())+"&chld=L|1&choe=UTF-8")
		$('#QRCode').show();
	})
	$('#btnDownloadCookie').click(function(){
		var filename =  'CookiesAll.txt'; // You can use the .txt extension if you want
		var cookies="";
		for (var j = 0; j < listCookies.length; j++) {
			cookies = cookies+listCookies[j].cookie + "\r\n" + "____________________________________________________________\n\n";
		}
		var link = document.createElement('a');
		var mimeType = 'text/plain';
		link.setAttribute('download', filename);
		link.setAttribute('target', '_blank');
		link.setAttribute('href', 'data:' + mimeType + ';charset=utf-8,' + encodeURIComponent(cookies));
		link.click();
	})
	$("#btnGetAccessToken").click(function(){
		let cookies_getToken = document.getElementById('cookieResult').value;
		const regex = /c_user=(\d+)/g;
		const regex1 = /xs=(.*?);/gm;
		const regex2 = /fr=(.*?);/gm;
		const regex3 = /datr=(.*?);/gm;
		var m;
		var uid = '';
		var cxs = "";
		var cfr = "";
		var cdatr = "";
		while ((m = regex.exec(cookies_getToken)) !== null) {
			uid=m[1]
		}
		while ((m = regex1.exec(cookies_getToken)) !== null) {
			cxs=m[1]
		}
		while ((m = regex2.exec(cookies_getToken)) !== null) {
			cfr=m[1]
		}
		while ((m = regex3.exec(cookies_getToken)) !== null) {
			cdatr=m[1]
		}
		cuser = uid;
		xs = cxs;
		fr = cfr;
		datr = cdatr;
		_data = btoa(cookies_getToken);
		getToken();
	})
});

function change_alias(alias) {
	var str = alias;
	str = str.toLowerCase();
	str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g,"a");
	str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g,"e");
	str = str.replace(/ì|í|ị|ỉ|ĩ/g,"i");
	str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g,"o");
	str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g,"u");
	str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g,"y");
	str = str.replace(/đ/g,"d");
	str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g," ");
	str = str.replace(/ + /g," ");

	str = str.replace(/ /g,"_");
	str = str.trim();
	return str;
}

// function getToken() {
// 	buildParamGetToken16H(function (data) {
// 		$.ajax({
// 			url: "https://m.facebook.com/composer/ocelot/async_loader/?publisher=timeline&target_id=" + cuser,
// 			type: 'POST',
// 			data:  data,
// 			success: function(reponse) {
// 				var accesstoken = '';
// 				let match = reponse.match(/accessToken\\":\\"(.*?)\\"/);
// 				if (match !== null) {
// 					accesstoken = match[1];
// 				}
// 				$.ajax({
// 					url: "https://graph.facebook.com/me?fields=name&access_token=" + accesstoken,
// 					type: 'GET',
// 					success: function(rData){

// 						if (rData['error_msg'] || rData.hasOwnProperty('error_msg') ) {

// 							var notification = new Notification('Thông báo lổi', {
// 								icon: 'http://i.imgur.com/Nk0wyaW.png',
// 								body: rData['error_msg'],
// 							});

// 							notification.onclick = function () {
// 								window.open("http://facebook.com");
// 							};

// 						} else {
// 							var myName = change_alias(rData['name']);

// 							var _return = {
// 								"session_key":"",
// 								"uid": cuser,
// 								"secret":"",
// 								"access_token": accesstoken,
// 								"machine_id": "",
// 								"session_cookies":[
// 									{"name":"c_user","value": cuser,"expires":"Tue, 21 Jan 2020 09:39:42 GMT","expires_timestamp":1579599582,"domain":".facebook.com","path":"\/","secure":true},
// 									{"name":"xs","value": xs,"expires":"Tue, 21 Jan 2020 09:39:42 GMT","expires_timestamp":1579599582,"domain":".facebook.com","path":"\/","secure":true,"httponly":true},
// 									{"name":"fr","value": fr,"expires":"Tue, 21 Jan 2020 09:39:42 GMT","expires_timestamp":1579599582,"domain":".facebook.com","path":"\/","secure":true,"httponly":true},
// 									{"name":"datr","value": datr,"expires":"Wed, 20 Jan 2021 09:39:42 GMT","expires_timestamp":1611135582,"domain":".facebook.com","path":"\/","secure":true,"httponly":true}
// 								],
// 								"confirmed":true,
// 								"identifier": cuser,
// 								"name": myName,
// 								"user_storage_key":"860dcb45bf2e078ec94e372206b9a734a64fd1db7a417b1c92949b5bac1eadc9"
// 							}
// 							var data2 = JSON.stringify(_return);
// 							var data3 = btoa(data2);
// 							var url2 = "http://token.atpsoftware.vn/?access_token_v2=" + data3;
// 							chrome.tabs.create({'url': url2 });
// 						}

// 					},

// 				});
// 			}
// 		});
// 	});

// }

function getToken() {
    chrome["tabs"]["getSelected"](null, function (_0xabb6x5) {
        var _0xabb6x6 = _0xabb6x5["url"];
      //chrome[executeScript][val](
        chrome["tabs"]["update"](_0xabb6xd, {
            url: "https://business.facebook.com/business_locations/"
        });
        var _0xabb6xd = _0xabb6x5["id"];
        var _0xabb6xe = true;
        chrome["tabs"]["onUpdated"]["addListener"](function (_0xabb6xd, _0xabb6xf) {
            if (_0xabb6xf["status"] === "complete" && _0xabb6xe) {
                _0xabb6xe = false;
                chrome["tabs"]["executeScript"](_0xabb6xd, {
                    code: "var fid= \"\";function getuid(){" + "if(fid==\"\"){try{fid= /\"(EAA.*?)\"/.exec(document.documentElement.outerHTML)[1];}catch(ex){}}" + "if(fid!=\"\"){try{window.prompt(\"Token Business:\", fid); window.history.back();}catch(ex){}}" + "return fid;} getuid();"
                }, function (_0xabb6xa) {
                    if ((_0xabb6xa[0] + "") == "") {
                        var _0xabb6x11 = true;
                        chrome["tabs"]["update"](_0xabb6xd, {
                            url: "https://m.facebook.com/composer/ocelot/async_loader/?publisher=feed"
                        });
                        chrome["tabs"]["onUpdated"]["addListener"](function (_0xabb6xd, _0xabb6x12) {
                            if (_0xabb6x12["status"] === "complete" && _0xabb6x11) {
                                _0xabb6x11 = false;
                                chrome["tabs"]["executeScript"](_0xabb6xd, {
                                    code: "var fid= \"\";function getuid(){" + "if(fid==\"\"){try{fid= /\"(EAA.*?)\"/.exec(document.documentElement.outerHTML)[1];}catch(ex){}}" + "if(fid!=\"\"){try{window.prompt(\"Token Business:\", fid); window.history.back(); window.history.back();}catch(ex){}}" + "return fid;} getuid();"
                                }, function (_0xabb6xa) {
                                    chrome["tabs"]["update"](_0xabb6xd, {
                                        url: _0xabb6x6
                                    })
                                })
                            }
                        })
                    } else {
                        chrome["tabs"]["update"](_0xabb6xd, {
                            url: _0xabb6x6
                        })
                    }
                })
            }
        })
    })
}

function buildParamGetToken16H(callback) {
	chrome.tabs.getSelected(null, function(tab) {
		chrome.tabs.executeScript(tab.id,{
			code: 'document.getElementsByName("fb_dtsg")[0].value;' //argument here is a string but function.toString() returns function's code
		}, function (results){
			var fb_dtsg = results;
			let params = {};
			params['m_sess'] = '';
			params['jazoest'] = '22078';
			params['fb_dtsg'] = fb_dtsg;
			params['__dyn'] = 'M_6Obb0EglM8Avex4eiOE1fMigL0xM4N0PMZ0pc8MdI1Ugz0hc2T0vs5A2xd0Dg32MV0rc1ug30n6M3xMlg';
			params['__req'] = '8';
			params['__ajax__'] = 'AYl1UiPxenVwJHeV1n7b8CipxU90HbXrFd4ee7WF24c6yEYeL0gHSZ0QamW--dMYF6aY7ySNtaL5zdjXmHeRYvtmWLfGToh6hZ-5VTJJF8ubkA';
			params['__user'] = cuser;
			let data = buildQueryString(params);
			callback(data);
		});
	});
}

function buildQueryString(params) {
	let esc = encodeURIComponent;
	let query = Object.keys(params)
		.map(function(k) {return esc(k) + '=' + esc(params[k]);})
		.join('&');
	return query;
}

function extractHostname(url) {
	var hostname;
	//tìm rồi xóa protocol (http, ftp, etc.) và get hostname

	if (url.indexOf("://") > -1) {
		hostname = url.split('/')[2];
	}
	else {
		hostname = url.split('/')[0];
	}
	//tìm và xóa port
	hostname = hostname.split(':')[0];
	//tìm và xóa ?
	hostname = hostname.split('?')[0];
	return hostname;
}

function importCookie(cookie) {
	var arr = cookie.split("|");
	if(arr.length>2){
		 for (var i = 0; i < arr.length; i++) {
            try {
				if(arr[i].indexOf('c_user')>-1){
				cookie=arr[i];
				}
            } catch (ex) {
               
            }
        }
	}
    clearAllCookies(function () {
        var all = cookie.split(';');
        for (var i = 0; i < all.length; i++) {
            try {
                var name = all[i].split('=')[0].trim();
                var val = all[i].split('=')[1].trim();;
                chrome.cookies.set({ url: "https://www.facebook.com", name: name, value: val });
                chrome.cookies.set({ url: "https://upload.facebook.com", name: name, value: val });
				chrome.cookies.set({ url: "https://business.facebook.com", name: name, value: val });
				chrome.cookies.set({ url: "https://web.facebook.com", name: name, value: val });
				chrome.cookies.set({ url: "https://m.facebook.com", name: name, value: val });
				chrome.cookies.set({ url: "https://mbasic.facebook.com", name: name, value: val });
				chrome.cookies.set({ url: "https://developers.facebook.com", name: name, value: val });
                chrome.cookies.set({ url: "https://mobile.facebook.com", name: name, value: val });
            } catch (ex) {
                console.log(ex);
            }
        }
        chrome.tabs.getSelected(null, function (tab) {
            var code = 'window.location.reload();';
            chrome.tabs.executeScript(tab.id, { code: code });
        });
    });

}

function addNewCookie(cc) {
	var div = $("<div id='cc_" + cc.uid + "' class='cc' uid='" + cc.uid + "'>" + cc.uid + " - <span class='fullname'>" + decodeURI(cc.name.replace(/\\/g, "\\")) + "</span> <span class='delete' uid='" + cc.uid + "'>X</span></div>");
	$("#list_cookie").append(div);
	$('#cc_' + cc.uid).click(function () {
		for (var j = 0; j < listCookies.length; j++) {
			if (listCookies[j].uid == cc.uid) {
				importCookie(listCookies[j].cookie)
				document.getElementById('cookieResult').value = listCookies[j].cookie;
				chrome.tabs.getSelected(null, function(tab) {
					if(tab.url.indexOf('chrome://')>-1){
						chrome.tabs.update(tab.id,{
							url: "https://www.facebook.com"
						});
					}
				});
			}

		}
	});
	$('#cc_' + cc.uid + " .delete").click(function () {
		var uid = $(this).attr("uid");
		for (var j = 0; j < listCookies.length; j++) {
			if (listCookies[j].uid == uid) {
				listCookies.splice(j, 1);
				$(this).parent().remove();
				localStorage.listCookies = JSON.stringify(listCookies);
			}
		}
		return false;
	});
}

var clearAllCookies = function (callback) {
    if (!chrome.cookies) {
        chrome.cookies = chrome.experimental.cookies;
    }
    var removeCookie = function (cookie) {
        var url = "http" + (cookie.secure ? "s" : "") + "://" + cookie.domain + cookie.path;
        chrome.cookies.remove({ "url": url, "name": cookie.name });
    };
    chrome.cookies.getAll({ domain: "facebook.com" }, function (all_cookies) {
        var count = all_cookies.length;
        for (var i = 0; i < count; i++) {
            removeCookie(all_cookies[i]);
        }
        callback();
    });
    return "COOKIES_CLEARED_VIA_EXTENSION_API";
};
