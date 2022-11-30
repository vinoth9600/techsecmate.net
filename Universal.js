 window.addEventListener('load', function() {
                    var codeGenMetadata = {
                        // todo: put form id here
                        formPropertyId: 5,
                        formSelector: '[id*="145"]',
                        subjectIdentifiers: [{"name":"name","selector":"[name = \"name\"]","isPrimary":true},{"name":"Enter Email","selector":"[name = \"email\"]","isPrimary":false},{"name":"submit","selector":"[name = \"submit\"]","isPrimary":false}],
                        consentIdentifiers: [{"type":"checkbox","name":"Agree","selector":"[name = \"Agree\"]","propertyId":1372,"consentValue":"checked"}],
                        consentTrigger: {
                            action: 'click',
                            selector: '[name = "submit"]'
                        }
                    };

                    var form, forms = document.querySelectorAll(codeGenMetadata.formSelector);
                    if (forms.length > 1) {
                        for (var i = 0; i < forms.length; i++) {
                            if (forms[i].querySelector(codeGenMetadata.consentTrigger.selector)) {
                                form = forms[i]
                                break;
                            }
                        }
                    } else {
                        form = forms[0];
                    }

                    if (!form) {
                        return;
                    }

                    var browserFingerPrint = ''
                    var s = document.createElement('script');
                    s.async = 1;
                    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/fingerprintjs2/2.1.0/fingerprint2.js';
                    var parent_node = document.head || document.body;
                    parent_node.appendChild(s);
                    s.addEventListener('load', function() {
                        Fingerprint2.get(function(components) {
                            browserFingerPrint = Fingerprint2.x64hash128(components.map(function(pair) {
                                return pair.value
                            }).join(), 31)
                        })
                    });

                    var isConsentTaken = false
                    var prepareConsentPayload = function(formEle) {
                        if (!isConsentTaken) {
                            isConsentTaken = true
                            var payload = {
                                form_info: {
                                    subject_info: {}
                                },
                                consent_info: [],
                                browser_finger_print: browserFingerPrint,
                                policy_version: 1,
                                form_property_id: codeGenMetadata.formPropertyId,
                                uuid: '',
                                uuids: {}
                            }

                            if (codeGenMetadata.consentIdentifiers.length === 1 && codeGenMetadata.consentIdentifiers[0].name === 'DefaultElementId') {
                                payload.consent_info.push({
                                    granted: true,
                                    timestamp: parseInt(new Date().getTime() / 1000),
                                    property_id: parseInt(codeGenMetadata.consentIdentifiers[0].propertyId)
                                })
                            } else {
                                codeGenMetadata.consentIdentifiers.forEach(function(identifier) {
                                    payload.consent_info.push({
                                        granted: getGranted(identifier, formEle),
                                        timestamp: parseInt(new Date().getTime() / 1000),
                                        property_id: parseInt(identifier.propertyId)
                                    })
                                })
                            }

                            codeGenMetadata.subjectIdentifiers.forEach(function(identifier) {
                                payload.form_info.subject_info[identifier.name] = formEle.querySelector(identifier.selector) && formEle.querySelector(identifier.selector).value || ''
                                if (identifier.isPrimary) {
                                    payload.uuid = payload.form_info.subject_info[identifier.name] || ''
                                    payload.uuids[identifier.name] = payload.form_info.subject_info[identifier.name] || ''
                                }
                            })
                            return payload
                        }
                    }

                    function getGranted(identifier, formEle) {
                        if (identifier.type == 'checkbox') {
                            var checkboxElement = formEle.querySelector(identifier.selector);
                            var parent = checkboxElement && checkboxElement.parentNode;
                            if (parent && parent.tagName === 'LABEL' && parent.offsetHeight === 0) {
                                parent = parent.parentNode
                            }
                            if (parent && parent.offsetHeight > 0) {
                                return identifier.consentValue === 'checked' ? checkboxElement.checked : !checkboxElement.checked;
                            }
                            return false;
                        } else {
                            var radioElements = formEle.querySelectorAll(identifier.selector);
                            var parent = radioElements[0] && radioElements[0].parentNode;
                            if (parent && parent.tagName === 'LABEL' && parent.offsetHeight === 0) {
                                parent = parent.parentNode
                            }
                            if (parent && parent.offsetHeight > 0) {
                                return identifier.consentValue === Array.prototype.slice.call(radioElements).filter(function(r) { return r.checked })[0].value;
                            }
                            return false;
                        }
                    }

                    function postConsentedItems(consentedItem) {
                        var xhr = new XMLHttpRequest();
                        xhr.open('POST', 'https://app.securiti.ai/privaci/v1/consent/form/singleupload', false);
                        xhr.setRequestHeader('Content-type', 'application/json');
                        xhr.setRequestHeader('X-Auth-Token', 'eb250dbe-3781-4f87-b031-b802f5125913');
                        xhr.setRequestHeader('X-ORG-ID', '1');

                        xhr.onload = function () {
                            if (this.status >= 200 && this.status < 300) {
                                var resp = JSON.parse(xhr.response)
                                if (resp.status === 0) {
                                    console.log('consent uploaded successfully');
                                }
                            } else {
                                console.log('consent upload failed', this.status, xhr.statusText);
                            }
                            setTimeout(function () { isConsentTaken = false }, 0)
                        };
                        xhr.onerror = function () {
                            console.log('consent upload failed', this.status, xhr.statusText);
                            setTimeout(function () { isConsentTaken = false }, 0)
                        };
                        xhr.send(JSON.stringify(consentedItem));
                    }

                    var uploadConsent = function () {
                        var payload = prepareConsentPayload(form)
                        if(payload) {
                            return postConsentedItems(payload);
                        }
                    }

                    form.addEventListener('submit', function () {
                        uploadConsent()
                    })

                    if (codeGenMetadata.consentTrigger.action === 'click') {
                        var trigger = form.querySelector(codeGenMetadata.consentTrigger.selector)
                            if (trigger) {
                                trigger.addEventListener(codeGenMetadata.consentTrigger.action, function () {
                                    uploadConsent()
                                })
                            }
                        }
                    })