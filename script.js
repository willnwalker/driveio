/*
	Commands:
	new [file]
	share [email] [file]
	open [file]
	remove [file]
	emptytrash
*/
chrome.omnibox.onInputEntered.addListener(function (text) {
	var parsed = text.split(' ');
	console.log(parsed);
	if (parsed[0].toLowerCase() == "new"){
		if (parsed[1].toLowerCase() == "doc"){
			chrome.tabs.update({ url: 'https://docs.google.com/create' });
		} 
		else if (parsed[1].toLowerCase() == "sheet") {
			chrome.tabs.update({ url: 'https://sheets.google.com/create' });
		} 
		else if (parsed[1].toLowerCase() == "slide") {
			chrome.tabs.update({ url: 'https://slides.google.com/create' });
		} 
		else if (parsed[1].toLowerCase() == "drawing") {
			chrome.tabs.update({ url: 'https://drawings.google.com/create' });
		} 
		else if (parsed[1].toLowerCase() == "form") {
			chrome.tabs.update({ url: 'https://forms.google.com/create' });
		}
		else if (parsed[1].toLowerCase() == "folder") {
			chrome.identity.getAuthToken({'interactive': false}, function(token){
			if (!token){
				token = chrome.identity.getAuthToken({'interactive': true});
				console.log(token);
				var requestobject = new XMLHttpRequest();
				requestobject.open('POST', 'https://www.googleapis.com/drive/v2/files');
				requestobject.setRequestHeader('Authorization', 'Bearer ' + token);
				requestobject.setRequestHeader("Content-Type", "application/json");
				requestobject.responseType = 'json';
				console.log(text.substr(11));
				requestobject.send(JSON.stringify({"title": text.substr(11), "mimeType": "application/vnd.google-apps.folder"}));
				console.log(requestobject);
				/*requestobject.onloadend = function () {
					chrome.tabs.update({url: requestobject.response.alternateLink});
				}
				*/
			}
			else {
				console.log(token);
				var requestobject = new XMLHttpRequest();
				requestobject.open('POST', 'https://www.googleapis.com/drive/v2/files');
				requestobject.setRequestHeader('Authorization', 'Bearer ' + token);
				requestobject.setRequestHeader("Content-Type", "application/json");
				requestobject.responseType = 'json';
				console.log(text.substr(11));
				requestobject.send(JSON.stringify({"title": text.substr(11), "mimeType": "application/vnd.google-apps.folder"}));
				console.log(requestobject);
				/*requestobject.onloadend = function () {
					chrome.tabs.update({url: requestobject.response.alternateLink});
				}
				*/
			}
			});
		}
	}
	
	if (parsed[0].toLowerCase() == "share"){
		console.log(parsed[0].length);
		var name = text.substr(6+parsed[1].length);
		console.log(name);
		
		chrome.identity.getAuthToken({'interactive': false}, function(token){
			if (!token){
				token = chrome.identity.getAuthToken({'interactive': true});
				console.log(token);
				var requestobject = new XMLHttpRequest();
				requestobject.open('GET', 'https://www.googleapis.com/drive/v2/files?q=title+contains+"'+text.substr(6+parsed[1].length)+'"');
				requestobject.setRequestHeader('Authorization', 'Bearer ' + token);
				requestobject.responseType = 'json';
				console.log(text.substr(6+parsed[1].length));
				requestobject.send();
				console.log(requestobject);
				
				requestobject.onloadend = function () {
					var sharerequestobject = new XMLHttpRequest();
					sharerequestobject.open('POST', 'https://www.googleapis.com/drive/v2/files/'+requestobject.response.items[0].id+'/permissions');
					sharerequestobject.setRequestHeader('Authorization', 'Bearer ' + token);
					sharerequestobject.setRequestHeader("Content-Type", "application/json");
					sharerequestobject.send(JSON.stringify({"role": "writer", "type": "user", "value": parsed[1]}));
				};
			}
			else {
			console.log(token);
			var requestobject = new XMLHttpRequest();
				requestobject.open('GET', 'https://www.googleapis.com/drive/v2/files?q=title+contains+"'+text.substr(6+parsed[1].length)+'"');
				requestobject.setRequestHeader('Authorization', 'Bearer ' + token);
				requestobject.responseType = 'json';
				console.log(text.substr(6+parsed[1].length));
				requestobject.send();
				console.log(requestobject);
				
				requestobject.onloadend = function () {
					var sharerequestobject = new XMLHttpRequest();
					sharerequestobject.open('POST', 'https://www.googleapis.com/drive/v2/files/'+requestobject.response.items[0].id+'/permissions');
					sharerequestobject.setRequestHeader('Authorization', 'Bearer ' + token);
					sharerequestobject.setRequestHeader("Content-Type", "application/json");
					sharerequestobject.send(JSON.stringify({"role": "writer", "type": "user", "value": parsed[1]}));
					
				};
			}
		});
	}
	
/*	if (parsed[0].toLowerCase() == "get"){
		console.log(parsed[0].length);
		var name = text.substr(4);
		console.log(name);
		
		chrome.identity.getAuthToken({'interactive': false}, function(token){
			if (!token){
				token = chrome.identity.getAuthToken({'interactive': true});
				console.log(token);
				var requestobject = new XMLHttpRequest();
				requestobject.open('GET', 'https://www.googleapis.com/drive/v2/files?q=title+contains+"'+text.substr(4)+'"');
				requestobject.setRequestHeader('Authorization', 'Bearer ' + token);
				requestobject.responseType = 'json';
				console.log(text.substr(4));
				requestobject.send();
				console.log(requestobject);
				
				requestobject.onloadend = function () {
					//chrome.tabs.update({url: requestobject.response.items[0].id});
					var getrequestobject = new XMLHttpRequest();
					getrequestobject.open('GET', 'https://www.googleapis.com/drive/v2/files/'+requestobject.response.items[0].id+'?alt=media');
					getrequestobject.setRequestHeader('Authorization', 'Bearer ' + token);
					getrequestobject.send();
				};
			}
			else {
				console.log(token);
				var requestobject = new XMLHttpRequest();
				requestobject.open('GET', 'https://www.googleapis.com/drive/v2/files?q=title+contains+"'+text.substr(4)+'"');
				requestobject.setRequestHeader('Authorization', 'Bearer ' + token);
				requestobject.responseType = 'json';
				console.log(text.substr(4));
				requestobject.send();
				console.log(requestobject);
				
				requestobject.onloadend = function () {
					//chrome.tabs.update({url: requestobject.response.items[0].id});
					var getrequestobject = new XMLHttpRequest();
					getrequestobject.open('GET', requestobject.response.items[0].downloadUrl);
					getrequestobject.setRequestHeader('Authorization', 'Bearer ' + token);
					getrequestobject.send();
					chrome.downloads.download({url: requestobject.response.items[0].downloadUrl, method: "GET"})
				};
			}
		});
		
	}*/
	
	if (parsed[0].toLowerCase() == "open"){
		console.log(parsed[0].length);
		var name = text.substr(5);
		console.log(name);
		
		chrome.identity.getAuthToken({'interactive': false}, function(token){
			if (!token){
				token = chrome.identity.getAuthToken({'interactive': true});
				console.log(token);
				var requestobject = new XMLHttpRequest();
				requestobject.open('GET', 'https://www.googleapis.com/drive/v2/files?q=title+contains+"'+text.substr(5)+'"');
				requestobject.setRequestHeader('Authorization', 'Bearer ' + token);
				requestobject.responseType = 'json';
				console.log(text.substr(5));
				requestobject.send();
				console.log(requestobject);
				
				requestobject.onloadend = function () {
					chrome.tabs.update({url: requestobject.response.items[0].alternateLink});
				};
			}
			else {
				console.log(token);
				var requestobject = new XMLHttpRequest();
				requestobject.open('GET', 'https://www.googleapis.com/drive/v2/files?q=title+contains+"'+text.substr(5)+'"');
				requestobject.setRequestHeader('Authorization', 'Bearer ' + token);
				requestobject.responseType = 'json';
				console.log(text.substr(5));
				requestobject.send();
				console.log(requestobject);
				
				requestobject.onloadend = function () {
					chrome.tabs.update({url: requestobject.response.items[0].alternateLink});
				};
			}
		});
	}
	
	if (parsed[0].toLowerCase() == "remove"){
		console.log(parsed[0].length);
		var name = text.substr(7);
		console.log(name);
		
		chrome.identity.getAuthToken({'interactive': false}, function(token){
			if (!token){
				token = chrome.identity.getAuthToken({'interactive': true});
				console.log(token);
				var requestobject = new XMLHttpRequest();
				requestobject.open('GET', 'https://www.googleapis.com/drive/v2/files?q=title+contains+"'+text.substr(7)+'"');
				requestobject.setRequestHeader('Authorization', 'Bearer ' + token);
				requestobject.responseType = 'json';
				console.log(text.substr(7));
				requestobject.send();
				console.log(requestobject);
				
				requestobject.onloadend = function () {
					var trashrequestobject = new XMLHttpRequest();
					trashrequestobject.open('POST', 'https://www.googleapis.com/drive/v2/files/'+requestobject.response.items[0].id+'/trash');
					trashrequestobject.setRequestHeader('Authorization', 'Bearer ' + token);
					trashrequestobject.send();
				};
			}
			else {
			console.log(token);
			var requestobject = new XMLHttpRequest();
				requestobject.open('GET', 'https://www.googleapis.com/drive/v2/files?q=title+contains+"'+text.substr(7)+'"');
				requestobject.setRequestHeader('Authorization', 'Bearer ' + token);
				requestobject.responseType = 'json';
				console.log(text.substr(7));
				requestobject.send();
				console.log(requestobject);
				
				requestobject.onloadend = function () {
					var trashrequestobject = new XMLHttpRequest();
					trashrequestobject.open('POST', 'https://www.googleapis.com/drive/v2/files/'+requestobject.response.items[0].id+'/trash');
					trashrequestobject.setRequestHeader('Authorization', 'Bearer ' + token);
					trashrequestobject.send();
					
				};
			}
		});
	}

	if (parsed[0].toLowerCase() == "emptytrash"){
		chrome.identity.getAuthToken({'interactive': false}, function(token){
			if (!token){
				token = chrome.identity.getAuthToken({'interactive': true});
				console.log(token);
				var requestobject = new XMLHttpRequest();
				requestobject.open('DELETE', 'https://www.googleapis.com/drive/v2/files/trash');
				requestobject.setRequestHeader('Authorization', 'Bearer ' + token);
				requestobject.send();
				console.log(requestobject);
			}
			else {
				console.log(token);
				var requestobject = new XMLHttpRequest();
				requestobject.open('DELETE', 'https://www.googleapis.com/drive/v2/files/trash');
				requestobject.setRequestHeader('Authorization', 'Bearer ' + token);
				requestobject.send();
				console.log(requestobject);
			}
		});
	};
});
	
/*	if (parsed[0].toLowerCase() == "upload"){
		console.log(parsed[0].length);
		var name = text.substr(7);
		console.log(name);
	}
});*/

