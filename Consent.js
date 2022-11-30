(function () {
	var s = document.createElement('script');
	s.src = 'https://cdn-prod.securiti.ai/consent/cookie-consent-sdk.js';
	s.setAttribute('data-tenant-uuid', 'fc7a1c8b-281a-461f-8245-d27a7164f69b');
	s.setAttribute('data-domain-uuid', 'f07e3b08-4ace-4d67-a9c8-d2204cb0060e');
	s.setAttribute('data-backend-url', 'https://app.securiti.ai');
	s.defer = true;
	var parent_node = document.head || document.body;
	parent_node.appendChild(s);
	s.addEventListener('load', function() { window.initCmp(); });
})()