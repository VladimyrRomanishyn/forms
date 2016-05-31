/*****************************************************************
* Here I use mediatior pattern. Object 'handler' is  a mediator  *
* other objects are a сolleagues.							     *
******************************************************************/
(function() {

'use strict'

var reglog = document.getElementById('reglog'),
	 forms = document.getElementById('forms'),
	 regform = document.getElementById('regform'),
	 logform = document.getElementById('logform');

// the repository of forms handler methods
var formsVisibility = {
	
	makeRegVisible: function() {

		if ( regform.style.display == ''|| regform.style.display == 'none') {
			logform.style.display = 'none';
			regform.style.display = 'block';
		} else {
			regform.style.display = 'none';
		}
	},
	
	makeLogVisible: function() {

		if (logform.style.display == ''|| logform.style.display == 'none') {
			regform.style.display = 'none';
			logform.style.display = 'block';
		} else {
			logform.style.display = 'none';
		}
	},
	
	closeforms: function() {

		regform.style.display = 'none';
		logform.style.display = 'none';
		handler.values = {};
	},
	
	cleanForms: function(id) {
		
		if (id =='regform') {
			var fields = regform.getElementsByTagName('input');
		} else {
			var fields = logform.getElementsByTagName('input');
		}
		
		for (var i = 0, max = fields.length; i < max; i += 1) {
			fields[i].value = null; 
		}
	},
};
//the checker
var validator = {
	
	templates: {
		login: /[a-z]+.{3,11}/i,
		password: /.{3,11}/,
		mail: /[^\s]+?@.+/i,
	},
	
	errors:{
		login: 'English only, length from 4 to 10',
		password:'Pass should be from 4 to 10 symbols',
		mail:'Write correct mail with \'@\'',
		empty_lines: 'Fill the all lines',
	},
	
	regChecker: function(data, fieldsNumber) {
		var key,
			result,
			counter = 0,
			checkedData = {},
			fieldsNumber = fieldsNumber,
			errors = [];

		for( key in data) {
			counter++;
			result = data[key].search(this.templates[key]);
			
			if(result == 0) {
				checkedData[key] = data[key];
			}else{
				errors.push(key);
			}
		}
		
		if(counter !== fieldsNumber){
			errors.push('empty_lines');
		}
		if(errors.length > 0){
			this.warnings(errors);
			return false;
		}else{
			return checkedData;
		}
	},
	
	warnings: function(data) {
		var i = 0, 
			max,
			arr = data;
		
		for ( max = arr.length; i < max; i += 1) {
			alert(this.errors[arr[i]]);
		}
	},
};

//ajax object
var Ajax = {
	
	getRequest: function() {
		try {
			var request = new XMLHttpRequest();
		}
		catch (e1) {
			try {
			request = new ActiveXObject('Msxml2.XMLHTTP');
			}
			catch (e2) {
				try {//IE 5
					request = new ActiveXObject('Microsoft.XMLHTTP')
				}
				catch (e3) {
					request = false;
				}
			}
		}
		return request;
	},

	sendData:function(data , url) {
		
		var body = 'user='+JSON.stringify(data),
			request = new XMLHttpRequest(),
			url = url;

		request.open('POST', url, true);
		request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		request.setRequestHeader("X-Requested-With", "XMLHttpRequest");
		
		request.onreadystatechange = function() {
			if (this.readyState == 4) {
				if (this.status == 200) {
					if (this.responseText != null) {
						if (this.responseText === "OK"){
							window.location.href = 'php/user_page.php';
						} else {
							document.getElementById('info').innerHTML =  request.responseText;
						}
					}
					else {
						alert('Ошибка Ajax: Данные не получены!');
					}
				} else {
					alert('Ошибка Ajax: '+ this.statusText);
				}
			}
		}
		request.send(body);
	},
}


//handler of a forms
var handler = {
	
	filter: function(event) {
		
		var type = event.type,
			e = event.target.id,
			Value = event.target.value,
			Name = event.target.name;

		if (type == 'click') {
			switch (e) {
				case 'reg': formsVisibility.makeRegVisible();
					break;
				case 'log': formsVisibility.makeLogVisible();
					break;
				case 'regButton':handler.prepareRequestData(handler.values, handler.url[0], 3);
					break;
				case 'logButton': handler.prepareRequestData(handler.values, handler.url[1], 2);
					break;
				case 'closer':
				case 'closer2': formsVisibility.closeforms();
					break;
				default: break;
				}
		} else {
			handler.values[Name] = Value;
		}
	},

	prepareRequestData: function(data , url, fieldsNumber){
		
		var result = validator.regChecker(data, fieldsNumber),
			url = url;
		
		if (result == false) {
			return;
		}
		if (fieldsNumber == 3){
			formsVisibility.cleanForms('regform');
		} else {
			formsVisibility.cleanForms('logform');
		}
		
		formsVisibility.closeforms();
		handler.values = {};
		Ajax.sendData(result, url);

	},

	values: {},

	url:['php/registration.php', 'php/login.php'],
};

reglog.addEventListener("click", handler.filter);
forms.addEventListener("click", handler.filter);
forms.addEventListener("change", handler.filter);
window.addEventListener("load", handler.cookieHandler);

}());