(function () {
	var s = document.createElement('script');
	s.src = 'https://cdn-prod.securiti.ai/consent/cookie-consent-sdk.js';
	s.setAttribute('data-tenant-uuid', 'fc7a1c8b-281a-461f-8245-d27a7164f69b');
	s.setAttribute('data-domain-uuid', '58627d55-d641-4fc2-b6c4-8cf13ea442ea');
	s.setAttribute('data-backend-url', 'https://app.securiti.ai');
	s.defer = true;
	var parent_node = document.head || document.body;
	parent_node.appendChild(s);
	s.addEventListener('load', function() { window.initCmp(); });
})()