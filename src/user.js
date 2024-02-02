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

  signup(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const error = form.querySelector('.error');
    if (error) error.remove();
    const submitButton = form.querySelector('[type="submit"]');
    submitButton?.setAttribute('loading', '');

    fetch(window.config.endpoint + '/users/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({
        email: formData.get('email'),
        clientURL: location.origin + '/activate-account',
      })
    })
    .then(res => {
      // Handle the response from the server
      if (res.ok) {
        // TODO: show a modal that asking users to check their inbox
      } else {
        const p = document.createElement('p');
        p.style.color = 'red';
        p.className = 'error';
        if (res.status === 400) {
          const modal = document.createElement('cc-dialog');
          modal.setAttribute('label', 'User already exists with this email address.');
          modal.innerHTML = `
            <p>There is an user account under this email address already. Redirect you to signin form?</p>
            <cc-button slot="footer-actions-right" theme="primary" onclick="ROUTER.redirect('/signin'); this.parentElement.close()">Ok</cc-button>
          `;
          document.body.appendChild(modal);
          customElements.whenDefined('cc-dialog').then(() => modal.show())
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

  signout(button) {
    button.setAttribute('loading', '');
    fetch(window.config.endpoint + '/users/signout', {
      method: 'POST',
      credentials: 'include'
    }).then((res) => {
      if (res.ok) {
        location.href = '/';
      }
    }).catch((err) => {
      console.log(err);
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
}
