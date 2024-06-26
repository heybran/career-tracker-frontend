export default class User {
  signin(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const error = form.querySelector('.error');
    if (error) error.remove();
    const submitButton = form.querySelector('[type="submit"]');
    submitButton?.setAttribute('loading', '');

    fetch(window.config.endpoint + '/users/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({
        email: formData.get('email'),
        clientURL: location.origin + '/login-via-email',
      })
    })
    .then(async res => {
      // Handle the response from the server
      if (res.ok) {
        // Show a success modal here about email is sent
      } else {
        const p = document.createElement('p');
        p.style.color = 'red';
        p.className = 'error';
        if (!res.ok) {
          p.textContent = (await res.json()).message;
        }
        // p.textContent = 'Incorrect username or password.';
        form.appendChild(p);
      }
    })
    .catch(error => {
      // Handle any errors that occur during the request
    }).finally(() => {
      submitButton?.removeAttribute('loading');
    });
  }

  /**
   * Sign in with email & password if allow password login is set to true.
   * @param {SubmitEvent} event 
   */
  signinWithPassword(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const error = form.querySelector('.error');
    if (error) error.remove();
    const submitButton = form.querySelector('[type="submit"]');
    submitButton?.setAttribute('loading', '');

    fetch(window.config.endpoint + '/users/signin-with-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({
        email: formData.get('email'),
        password: formData.get('password'),
      })
    })
    .then(async res => {
      // Handle the response from the server
      if (res.ok) {
        // Show a success modal here about email is sent
        location.href = '/jobs';
      } else {
        const p = document.createElement('p');
        p.style.color = 'red';
        p.className = 'error';
        if (!res.ok) {
          p.innerHTML = (await res.json()).message;
        }
        // p.textContent = 'Incorrect username or password.';
        form.appendChild(p);
      }
    })
    .catch(error => {
      // Handle any errors that occur during the request
    }).finally(() => {
      submitButton?.removeAttribute('loading');
    });
  }

  /**
   * 
   * @param {SubmitEvent} event 
   * @param {HTMLFormElement} form 
   */
  updatePassword(event, form) {
    event.preventDefault();
    const formData = new FormData(form);
    const oldPassword = formData.get('old-password');
    const newPassword = formData.get('new-password');
    fetch(`${window.config.endpoint}` + '/change-password', {
      method: 'POST',
      body: JSON.stringify({ oldPassword, newPassword }),
      credentials: 'include'
    }).then((res) => {
      if (res.ok) {

      }
    }).catch((err) => {
      console.log(err);
    });
  }

  /**
   * Allow password login on top origin email login.
   * @param {Event} event 
   */
  updateDisplayName(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    fetch(`${window.config.endpoint}` + '/users/update', {
      method: 'POST',
      body: formData,
      credentials: 'include'
    }).then((res) => {
      if (res.ok) {
        return window.config.user.displayName = formData.get('displayName');
      }
    }).catch(err => {
      
    });
  }

  /**
   * Reset user's password by backend emailing them a password reset link
   * @param {SubmitEvent} event 
   */
  resetPassword(event) {
    event.preventDefault();
    const form = event.target;
    const button = event.submitter;
    button.classList.add('loading');
    fetch(`${window.config.endpoint}/users/send-reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({
        clientURL: location.origin + '/account/reset-password',
      })
    }).then(res => {
      if (res.ok) {
        // Show a modal here telling user that a password reset link has been emailed
        alert('Please check your email for a password reset link. You can safely close this page now.')
      }
    }).catch(err => [
      console.log(err)
    ]).finally(() => {
      button.classList.remove('loading');
    })
  }
}
