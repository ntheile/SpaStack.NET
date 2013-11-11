// JayData 1.3.4
// Dual licensed under MIT and GPL v2
// Copyright JayStack Technologies (http://jaydata.org/licensing)
//
// JayData is a standards-based, cross-platform Javascript library and a set of
// practices to access and manipulate data from various online and offline sources.
//
// Credits:
//     Hajnalka Battancs, D�niel J�zsef, J�nos Roden, L�szl� Horv�th, P�ter Nochta
//     P�ter Zentai, R�bert B�nay, Szabolcs Czinege, Viktor Borza, Viktor L�z�r,
//     Zolt�n Gyebrovszki, G�bor Dolla
//
// More info: http://jaydata.org
(function(){
	window.onerror = function(msg, url, line){
		alert('Error' + (line ? ' in line ' + line : '') + '\n' + (url || '') + '\n' + msg);
	};

	/*window.onerror = function(msg, url, line){
		var html = '<div class="error"><span class="url">{url}</span><p class="msg">{msg}</p><span class="line">{line}</span></div>';
		html = html.replace('{url}', url || '');
		html = html.replace('{msg}', msg || '');
		html = html.replace('{line}', line || '');

		var container = document.querySelector ? document.querySelector('.jaydata-errorhandler') : document.getElementsByClassName('jaydata-errorhandler')[0];
		if (!container){
			container = document.createElement('DIV');
			container.innerHTML = '';
			container.className = 'jaydata-errorhandler';
			document.body.appendChild(container);
		}
		
		container.innerHTML += html;
	};*/
})();