/**
 * Contact form: client-side validation + AJAX submit.
 *
 * Mirrors src/utils/validation.js exactly (name/email/phone/message rules) and
 * the CV constraints (pdf/doc/docx, max 5 MB). Posts to the WordPress
 * `md_contact_submit` action with the localized MD_CONTACT data. Vanilla JS.
 */
(function () {
  'use strict';

  var form = document.getElementById('md-contact-form');
  if (!form) return; // Not the contact page.

  var submitBtn = document.getElementById('md-submit');
  var messageBox = document.getElementById('md-form-message');
  var cfg = window.MD_CONTACT || {};
  var i18n = cfg.i18n || { nl: {}, en: {} };

  // Remember the bilingual button markup so we can restore it after submit.
  var originalSubmitHTML = submitBtn ? submitBtn.innerHTML : '';

  // Localized field-error messages (mirrors translations.contact.errors).
  var errors = {
    nl: {
      firstNameRequired: 'Voer uw voornaam in.',
      firstNameInvalid: 'De voornaam mag alleen letters bevatten (min. 2 tekens).',
      lastNameRequired: 'Voer uw achternaam in.',
      lastNameInvalid: 'De achternaam mag alleen letters bevatten (min. 2 tekens).',
      emailRequired: 'Voer uw e-mailadres in.',
      emailInvalid: 'Voer een geldig e-mailadres in.',
      phoneRequired: 'Voer uw telefoonnummer in.',
      phoneInvalid: 'Voer een geldig telefoonnummer in.',
      messageRequired: 'Schrijf een bericht.',
      messageInvalid: 'Het bericht moet minstens 10 tekens bevatten.',
      cvType: 'Alleen PDF-, DOC- of DOCX-bestanden zijn toegestaan.',
      cvSize: 'Het bestand mag niet groter zijn dan 5 MB.'
    },
    en: {
      firstNameRequired: 'Please enter your first name.',
      firstNameInvalid: 'First name must contain only letters (min. 2 characters).',
      lastNameRequired: 'Please enter your last name.',
      lastNameInvalid: 'Last name must contain only letters (min. 2 characters).',
      emailRequired: 'Please enter your email address.',
      emailInvalid: 'Please enter a valid email address.',
      phoneRequired: 'Please enter your phone number.',
      phoneInvalid: 'Please enter a valid phone number.',
      messageRequired: 'Please write a message.',
      messageInvalid: 'Your message must be at least 10 characters.',
      cvType: 'Only PDF, DOC or DOCX files are allowed.',
      cvSize: 'The file must not be larger than 5 MB.'
    }
  };

  // Validation primitives — copied verbatim from src/utils/validation.js.
  var NAME_REGEX = /^[\p{L}][\p{L}\s'-]{1,}$/u;
  var EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  function lang() {
    return document.body.classList.contains('lang-en') ? 'en' : 'nl';
  }

  function t(key) {
    var l = lang();
    return (i18n[l] && i18n[l][key]) || (i18n.nl && i18n.nl[key]) || '';
  }

  function err(key) {
    var l = lang();
    return (errors[l] && errors[l][key]) || errors.nl[key] || '';
  }

  // Field references.
  var fields = {
    first_name: form.querySelector('[name="first_name"]'),
    last_name: form.querySelector('[name="last_name"]'),
    email: form.querySelector('[name="email"]'),
    phone: form.querySelector('[name="phone"]'),
    message: form.querySelector('[name="message"]'),
    cv: form.querySelector('[name="cv"]')
  };

  // ---- validators returning an error KEY or '' ---------------------------- //

  function validateName(value, prefix) {
    var v = (value || '').trim();
    if (!v) return prefix + 'Required';
    if (!NAME_REGEX.test(v)) return prefix + 'Invalid';
    return '';
  }

  function validateEmail(value) {
    var v = (value || '').trim();
    if (!v) return 'emailRequired';
    if (!EMAIL_REGEX.test(v)) return 'emailInvalid';
    return '';
  }

  function validatePhone(value) {
    var v = (value || '').trim();
    if (!v) return 'phoneRequired';
    if (!/^[+]?[\d\s()-]+$/.test(v)) return 'phoneInvalid';
    var digits = v.replace(/\D/g, '');
    if (digits.length < 7 || digits.length > 15) return 'phoneInvalid';
    return '';
  }

  function validateMessage(value) {
    var v = (value || '').trim();
    if (!v) return 'messageRequired';
    if (v.length < 10) return 'messageInvalid';
    return '';
  }

  function validateCv(input) {
    if (!input || !input.files || !input.files.length) return ''; // optional
    var file = input.files[0];
    var name = (file.name || '').toLowerCase();
    var allowed = ['pdf', 'doc', 'docx'];
    var ext = name.indexOf('.') >= 0 ? name.split('.').pop() : '';
    if (allowed.indexOf(ext) === -1) return 'cvType';
    if (file.size > 5 * 1024 * 1024) return 'cvSize';
    return '';
  }

  // Build a {fieldName: errorKey} map of current errors.
  function validate() {
    var map = {};
    var k;
    k = validateName(fields.first_name.value, 'firstName');
    if (k) map.first_name = k;
    k = validateName(fields.last_name.value, 'lastName');
    if (k) map.last_name = k;
    k = validateEmail(fields.email.value);
    if (k) map.email = k;
    k = validatePhone(fields.phone.value);
    if (k) map.phone = k;
    k = validateMessage(fields.message.value);
    if (k) map.message = k;
    k = validateCv(fields.cv);
    if (k) map.cv = k;
    return map;
  }

  // ---- error display ------------------------------------------------------ //

  function errorSpan(name) {
    return form.querySelector('.field-error[data-error-for="' + name + '"]');
  }

  function setFieldError(name, errorKey) {
    var input = fields[name];
    if (!input) return;
    var group = input.closest('.form-group');
    var span = errorSpan(name);
    if (errorKey) {
      if (group) group.classList.add('has-error');
      if (span) span.textContent = err(errorKey);
    } else {
      if (group) group.classList.remove('has-error');
      if (span) span.textContent = '';
    }
  }

  function clearAllErrors() {
    Object.keys(fields).forEach(function (name) {
      setFieldError(name, '');
    });
  }

  function showMessage(text, type) {
    if (!messageBox) return;
    messageBox.textContent = text;
    messageBox.className = 'form-message ' + type;
  }

  function clearMessage() {
    if (!messageBox) return;
    messageBox.textContent = '';
    messageBox.className = 'form-message';
  }

  // ---- placeholders / language -------------------------------------------- //

  function applyPlaceholders() {
    var l = lang();
    var inputs = form.querySelectorAll('[data-ph-nl],[data-ph-en]');
    for (var i = 0; i < inputs.length; i++) {
      var ph = inputs[i].getAttribute('data-ph-' + l);
      if (ph !== null) inputs[i].placeholder = ph;
    }
  }

  function restoreSubmitLabel() {
    if (submitBtn) submitBtn.innerHTML = originalSubmitHTML;
  }

  document.addEventListener('md:langchange', function () {
    applyPlaceholders();
    restoreSubmitLabel();
    clearMessage();
    // Refresh any visible error text to the active language.
    var groups = form.querySelectorAll('.form-group.has-error');
    for (var i = 0; i < groups.length; i++) {
      var span = groups[i].querySelector('.field-error');
      if (span) span.textContent = ''; // cleared; re-validated on next submit
    }
    clearAllErrors();
  });

  // Clear a field's error as the user fixes it.
  Object.keys(fields).forEach(function (name) {
    var input = fields[name];
    if (!input) return;
    var evt = name === 'cv' ? 'change' : 'input';
    input.addEventListener(evt, function () {
      setFieldError(name, '');
    });
  });

  // ---- submit ------------------------------------------------------------- //

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    clearMessage();
    clearAllErrors();

    var problems = validate();
    var keys = Object.keys(problems);
    if (keys.length) {
      keys.forEach(function (name) {
        setFieldError(name, problems[name]);
      });
      // Focus the first invalid field.
      var first = fields[keys[0]];
      if (first && typeof first.focus === 'function') first.focus();
      return;
    }

    var data = new FormData(form);
    data.append('action', 'md_contact_submit');
    data.append('nonce', cfg.nonce || '');
    data.append('lang', lang());

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = t('submitting');
    }

    fetch(cfg.ajaxUrl, { method: 'POST', body: data })
      .then(function (res) {
        return res.json();
      })
      .then(function (json) {
        if (json && json.success) {
          var msg = (json.data && json.data.message) || t('success');
          showMessage(msg, 'success');
          form.reset();
          applyPlaceholders();
        } else {
          var emsg = (json && json.data && json.data.message) || t('serverError');
          showMessage(emsg, 'error');
          if (json && json.data && json.data.field && fields[json.data.field]) {
            var group = fields[json.data.field].closest('.form-group');
            var span = errorSpan(json.data.field);
            if (group) group.classList.add('has-error');
            if (span) span.textContent = emsg;
          }
        }
      })
      .catch(function () {
        showMessage(t('serverError'), 'error');
      })
      .then(function () {
        if (submitBtn) {
          submitBtn.disabled = false;
          restoreSubmitLabel();
        }
      });
  });

  // Initial placeholder pass.
  applyPlaceholders();
})();
