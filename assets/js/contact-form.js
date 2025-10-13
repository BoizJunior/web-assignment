// Contact Form JavaScript - Enquiry Form

// Elements
const form = document.getElementById('contactForm')
const submitBtn = document.getElementById('submitBtn')
const cancelBtn = document.getElementById('cancelBtn')

const fullname = document.getElementById('fullname')
const email = document.getElementById('email')
const contact = document.getElementById('contact')
const category = document.getElementById('category')
const message = document.getElementById('message')

// Error boxes
const eFullname = document.getElementById('error-fullname')
const eEmail = document.getElementById('error-email')
const eContact = document.getElementById('error-contact')
const eCategory = document.getElementById('error-category')
const eContactMethod = document.getElementById('error-contact-method')
const eMessage = document.getElementById('error-message')

// Groups
const gFullname = document.getElementById('group-fullname')
const gEmail = document.getElementById('group-email')
const gContact = document.getElementById('group-contact')
const gCategory = document.getElementById('group-category')
const gContactMethod = document.getElementById('group-contact-method')
const gMessage = document.getElementById('group-message')

// Utils: error
function setError(groupEl, errorEl, message, inputEl) {
  groupEl.classList.add('has-error')
  errorEl.textContent = message
  if (inputEl) inputEl.setAttribute('aria-invalid', 'true')
}

function clearError(groupEl, errorEl, inputEl) {
  groupEl.classList.remove('has-error')
  errorEl.textContent = ''
  if (inputEl) inputEl.setAttribute('aria-invalid', 'false')
}

// Value helpers
function notEmpty(value) {
  return value && value.trim() !== ''
}

function validEmail(value) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(value.trim())
}

function getSelectedContactMethod() {
  const radios = document.getElementsByName('contactMethod')
  for (let radio of radios) {
    if (radio.checked) {
      return radio.value
    }
  }
  return null
}

// Numeric-only contact number (giống main.js)
contact.addEventListener('input', function () {
  const digitsOnly = this.value.replace(/\D/g, '')
  if (this.value !== digitsOnly) this.value = digitsOnly
})

// Cancel button handler
cancelBtn.addEventListener('click', function() {
  if (confirm('Are you sure you want to cancel? All entered data will be lost.')) {
    form.reset()
    // Clear has-value classes
    document.querySelectorAll('.input-group').forEach(group => {
      group.classList.remove('has-value')
      group.classList.remove('has-error')
    })
    // Clear error messages
    document.querySelectorAll('.error-text').forEach(error => {
      error.textContent = ''
    })
  }
})

// Floating label for non-placeholder-shown fields (select/textarea)
function syncHasValueClass(el) {
  const group = el.closest('.input-group')
  if (!group) return
  if (el.value && el.value !== '') group.classList.add('has-value')
  else group.classList.remove('has-value')
}

// Initial sync
;[fullname, email, contact, category, message].forEach((el) => {
  syncHasValueClass(el)
  el.addEventListener('change', () => syncHasValueClass(el))
  el.addEventListener('input', () => syncHasValueClass(el))
  el.addEventListener('blur', () => syncHasValueClass(el))
})

// On-blur validations (early feedback)
fullname.addEventListener('blur', () => {
  if (!notEmpty(fullname.value))
    setError(gFullname, eFullname, 'Full Name is required', fullname)
  else clearError(gFullname, eFullname, fullname)
})

email.addEventListener('blur', () => {
  if (!notEmpty(email.value))
    setError(gEmail, eEmail, 'Email is required', email)
  else if (!validEmail(email.value))
    setError(gEmail, eEmail, 'Please enter a valid email address', email)
  else clearError(gEmail, eEmail, email)
})

contact.addEventListener('blur', () => {
  if (!notEmpty(contact.value))
    setError(gContact, eContact, 'Contact Number is required', contact)
  else clearError(gContact, eContact, contact)
})

category.addEventListener('change', () => {
  if (!notEmpty(category.value))
    setError(gCategory, eCategory, 'Please select a category', category)
  else clearError(gCategory, eCategory, category)
})

message.addEventListener('blur', () => {
  if (!notEmpty(message.value))
    setError(gMessage, eMessage, 'Message is required', message)
  else clearError(gMessage, eMessage, message)
})

// Submit
form.addEventListener('submit', function (event) {
  event.preventDefault()

  // Check if ALL required fields are empty (NO input at all)
  const isFullnameEmpty = !fullname.value || fullname.value.trim() === ''
  const isEmailEmpty = !email.value || email.value.trim() === ''
  const isContactEmpty = !contact.value || contact.value.trim() === ''
  const isCategoryEmpty = !category.value || category.value.trim() === ''
  const isMethodEmpty = !getSelectedContactMethod()
  const isMessageEmpty = !message.value || message.value.trim() === ''

  // If NO input at all (all fields empty), show alert
  if (isFullnameEmpty && isEmailEmpty && isContactEmpty && isCategoryEmpty && isMethodEmpty && isMessageEmpty) {
    alert('PLEASE ENTER THE VALUES!')
    return
  }

  let ok = true

  // Validate Fullname
  if (!notEmpty(fullname.value)) {
    setError(gFullname, eFullname, 'Full Name is required', fullname)
    ok = false
  } else {
    clearError(gFullname, eFullname, fullname)
  }

  // Validate Email
  if (!notEmpty(email.value)) {
    setError(gEmail, eEmail, 'Email is required', email)
    ok = false
  } else if (!validEmail(email.value)) {
    setError(gEmail, eEmail, 'Please enter a valid email address', email)
    ok = false
  } else {
    clearError(gEmail, eEmail, email)
  }

  // Validate Contact Number
  if (!notEmpty(contact.value)) {
    setError(gContact, eContact, 'Contact Number is required', contact)
    ok = false
  } else {
    clearError(gContact, eContact, contact)
  }

  // Validate Category
  if (!notEmpty(category.value)) {
    setError(gCategory, eCategory, 'Please select a category', category)
    ok = false
  } else {
    clearError(gCategory, eCategory, category)
  }

  // Validate Preferred Contact Method
  const selectedMethod = getSelectedContactMethod()
  if (!selectedMethod) {
    setError(gContactMethod, eContactMethod, 'Please select a preferred contact method', null)
    ok = false
  } else {
    clearError(gContactMethod, eContactMethod, null)
  }

  // Validate Message
  if (!notEmpty(message.value)) {
    setError(gMessage, eMessage, 'Message is required', message)
    ok = false
  } else {
    clearError(gMessage, eMessage, message)
  }

  if (!ok) {
    // Focus on first error input
    const firstErrorInput = gFullname.classList.contains('has-error')
      ? fullname
      : gEmail.classList.contains('has-error')
      ? email
      : gContact.classList.contains('has-error')
      ? contact
      : gCategory.classList.contains('has-error')
      ? category
      : gMessage.classList.contains('has-error')
      ? message
      : null

    if (firstErrorInput) firstErrorInput.focus()
    return
  }

  // All validations passed - Show success message with data
  showSuccessMessage({
    name: fullname.value.trim(),
    email: email.value.trim(),
    contact: contact.value.trim(),
    category: category.value,
    method: selectedMethod,
    message: message.value.trim()
  })
})

// Function to display success message
function showSuccessMessage(data) {
  const message = `Congratulations...!!\n\n` +
                  `Name                : ${data.name}\n` +
                  `Email               : ${data.email}\n` +
                  `Contact Number      : ${data.contact}\n` +
                  `Category of Inquiry : ${data.category}\n` +
                  `Preferred Method    : ${data.method}\n` +
                  `Message             : ${data.message}`
  
  alert(message)
  
  // Reset form after showing success message
  form.reset()
  
  // Clear has-value classes
  document.querySelectorAll('.input-group').forEach(group => {
    group.classList.remove('has-value')
    group.classList.remove('has-error')
  })
  
  // Clear error messages
  document.querySelectorAll('.error-text').forEach(error => {
    error.textContent = ''
  })
}
