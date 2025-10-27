//modal functionality for admin forms
class Modal {
  constructor() {
    this.currentModal = null;
    this.init();
  }

  init() {
    //closing modal when clicking overlay
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('modal-overlay')) {
        this.close();
      }
    });

    //closing modal with escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.currentModal) {
        this.close();
      }
    });

    //handling close button clicks
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('modal-close')) {
        this.close();
      }
    });

    //handling form submissions
    document.addEventListener('submit', (e) => {
      if (e.target.classList.contains('modal-form') && !e.target.classList.contains('bypass-modal-js')) {
        this.handleSubmit(e);
      }
    });
  }

  open(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('active');
      this.currentModal = modal;
      document.body.style.overflow = 'hidden'; //preventing background scroll
    }
  }

  close() {
    if (this.currentModal) {
      this.currentModal.classList.remove('active');
      this.currentModal = null;
      document.body.style.overflow = ''; //restoring scroll
    }
  }

  async handleSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    console.log('Form submission started for:', form.action);
    
    //showing loading state
    submitBtn.disabled = true;
    submitBtn.textContent = 'Saving...';
    
    try {
      //checking if form has file inputs
      const hasFileInput = form.querySelector('input[type="file"]');
      let body;
      let headers = {};
      
      if (hasFileInput) {
        //using FormData for file uploads
        body = new FormData(form);
        console.log('Using FormData for file upload');
      } else {
        //using URLSearchParams for regular forms (better compatibility)
        const formData = new FormData(form);
        body = new URLSearchParams();
        
        for (let [key, value] of formData.entries()) {
          console.log(`${key}: ${value}`);
          body.append(key, value);
        }
        
        headers['Content-Type'] = 'application/x-www-form-urlencoded';
      }
      
      //handling file uploads and form data
      const response = await fetch(form.action, {
        method: form.method || 'POST',
        headers: headers,
        body: body
      });
      
      console.log('Response status:', response.status);
      console.log('Response headers:', [...response.headers.entries()]);
      
      if (response.ok) {
        //checking if response is JSON or redirect
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const result = await response.json();
          if (result.success) {
            this.close();
            window.location.reload();
          } else {
            this.showError(result.message || 'An error occurred');
          }
        } else {
          //assume success for non-JSON responses (like redirects)
          this.close();
          window.location.reload();
        }
      } else {
        //handling error responses
        try {
          const errorData = await response.json();
          this.showError(errorData.message || 'An error occurred');
        } catch {
          this.showError(`Error: ${response.status} ${response.statusText}`);
        }
      }
    } catch (error) {
      console.error('Form submission error:', error);
      this.showError('Network error occurred. Please try again.');
    } finally {
      //restoring button state
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  }

  showError(message) {
    //removing existing error
    const existingError = document.querySelector('.modal-error');
    if (existingError) {
      existingError.remove();
    }

    //creating and showing new error
    const errorDiv = document.createElement('div');
    errorDiv.className = 'alert alert-error modal-error';
    errorDiv.textContent = message;
    
    const modalBody = this.currentModal.querySelector('.modal-body');
    modalBody.insertBefore(errorDiv, modalBody.firstChild);
  }
}

//initializing modal when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.modal = new Modal();
});

//helper function to open modals
function openModal(modalId) {
  if (window.modal) {
    window.modal.open(modalId);
  }
}

//enhancing helper function for edit modals
function openEditModal(modalId, itemId) {
  //this function is overridden by page specific implementations
  //each page defines its own openEditModal with specific data handling
  console.log('Opening edit modal:', modalId, 'for item:', itemId);
  openModal(modalId);
}

//helper function to navigate and open modal
function navigateAndOpenModal(url, modalId) {
  window.location.href = url + '?openModal=' + modalId;
}

//helper function to clear form fields
function clearForm(formId) {
  const form = document.getElementById(formId);
  if (form) {
    form.reset();
    //clearing any error messages
    const errors = form.querySelectorAll('.modal-error');
    errors.forEach(error => error.remove());
  }
}

//helper function to populate form fields safely
function setFormValue(fieldId, value) {
  const field = document.getElementById(fieldId);
  if (field) {
    if (field.type === 'checkbox') {
      field.checked = Boolean(value);
    } else if (field.type === 'date' && value) {
      field.value = new Date(value).toISOString().split('T')[0];
    } else {
      field.value = value || '';
    }
  }
}

//checking URL parameters and open modal if specified
document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const openModalParam = urlParams.get('openModal');
  
  if (openModalParam && document.getElementById(openModalParam)) {
    setTimeout(() => {
      openModal(openModalParam);
      //cleaning up URL
      const newUrl = window.location.pathname;
      window.history.replaceState(null, '', newUrl);
    }, 100);
  }
});
