export default class User {
  signin(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const error = form.querySelector('.error');
    if (error) error.remove();
    const submitButton = form.querySelector('[type="submit"]');
    submitButton?.setAttribute('loading', '');

    fetch(window.config.endpoint + '/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({
        username: formData.get('username'),
        password: formData.get('password'),
      })
    })
    .then(async res => {
      // Handle the response from the server
      if (res.ok) {
        // ROUTER.redirect('/jobs');
        location.href = "/jobs/add";
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

    fetch(window.config.endpoint + '/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({
        username: formData.get('username'),
        password: formData.get('password'),
      })
    })
    .then(res => {
      // Handle the response from the server
      if (res.ok) {
        // ROUTER.redirect('/jobs');
        location.href = "/jobs/add";
      } else {
        const p = document.createElement('p');
        p.style.color = 'red';
        p.className = 'error';
        if (res.status === 409) {
          p.textContent = 'Username already exists.';
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
    fetch(window.config.endpoint + '/signout', {
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