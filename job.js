export default class JobController {
  add(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const formDataObject = {};
  
    for (let [key, value] of formData.entries()) {
      formDataObject[key] = value;
    }

    const submitButton = form.querySelector('[type="submit"]');
    submitButton?.setAttribute('loading', '');

    fetch(config.endpoint + '/jobs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(formDataObject)
    })
    .then(res => {
      // Handle the response from the server
      if (res.ok) {
        ROUTER.redirect('/jobs');
      }
    })
    .catch(error => {
      // Handle any errors that occur during the request
    }).finally(() => {
      submitButton?.removeAttribute('loading');
    });
  }

  update(event, form) {
    event.preventDefault();
    const submitButton = form.querySelector('cc-button');
    submitButton?.setAttribute('loading', '');
    const search = new URLSearchParams(location.search);
    const id = search.get('id');

    fetch(`${window.config.endpoint}/jobs/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({
        website: form.querySelector('[name="website"]').value,
        position: form.querySelector('[name="position"]').value,
        'date-applied': form.querySelector('[name="date-applied"]').value,
        source: form.querySelector('[name="source"]').value,
        status: form.querySelector('[name="status"]').value,
        notes: form.querySelector('[name="notes"]').value,
        'apply-channel': form.querySelector('[name="apply-channel"]').value,
        'volunteer-position': form.querySelector('[name="volunteer-position"]').value,
      })
    })
    .then(res => {
      // Handle the response from the server
      if (res.ok) {
        ROUTER.redirect('/jobs');
      }
    })
    .catch(error => {
      // Handle any errors that occur during the request
    }).finally(() => {
      submitButton?.removeAttribute('loading');
    });
  }

  showDeleteDialog(id, website) {
    const dialog = document.querySelector('#delete-job-dialog');
    dialog.innerHTML = `
      <p>Are you sure you want to delete job from <b>${website}?</b></p>
      <cc-button onclick="this.parentElement.close();" slot="footer-actions-left">Cancel</cc-button>
      <cc-button theme="primary" slot="footer-actions-right" onclick="window.jobController.delete('${id}', this)">Confirm</cc-button>
    `;
    dialog.show();
  }

  delete(id, trigger) {
    trigger.setAttribute('loading', '');
    fetch(`${window.config.endpoint}/jobs/${id}`, {
      method: 'DELETE',
      credentials: 'include'
    }).then(res => {
      if (res.ok) {
        // Remove job under this id
        document.querySelector('`tr[data-job-id=${id}]`')?.remove();
        trigger.closest('dialog').close();
      }
    }).catch((error) => {
      console.log(error);
    }).finally(() => {
      trigger.removeAttribute('loading');
    });
  }
}