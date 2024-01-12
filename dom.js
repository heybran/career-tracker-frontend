export function renderTable(jobs) {
  let html = '';
  jobs.forEach(job => {
    html += `
      <tr data-job-id="${job.ID}">
        <td>${job.Website}</td>
        <td>${job.Position}</td>
        <td>${job.Source ?? ''}</td>
        <td>${job.DateApplied}</td>
        <td>${job.ApplyChannel}</td>
        <td><cc-badge theme="primary">${job.Status}</cc-badge></td>
        <td>${job.VolunteerPosition ? `<cc-badge theme="success">Yes</cc-badge>` : ''}</td>
        <td>${job.Notes}</td>
        <td>
          <cc-button theme="primary" href="/jobs/edit?id=${job.ID}">Edit</cc-button>
          <cc-button theme="danger" onclick="window.jobController.showDeleteDialog('${job.ID}', '${job.Website}')">Delete</cc-button>
        </td>
      </tr>
    `;
  });

  return html;
}

export function renderFormElements(job, layout) {
  layout.innerHTML = `
    <cc-text-field label="Website" name="website" required value="${job.Website}"></cc-text-field>
    <cc-text-field label="Position" name="position" required value="${job.Position}"></cc-text-field>
    <cc-text-field label="Source" name="source" value="${job.Source}"></cc-text-field>
    <cc-date-picker label="Date Applied" required name="date-applied" value="${job.DateApplied}"></cc-date-picker>
    <cc-radio-group label="Apply channel" name="apply-channel" colspan="2">
      <cc-radio label="Email" value="email" ${job.ApplyChannel === 'email' ? 'checked' : ''}></cc-radio>
      <cc-radio label="Job application form" value="job-application-form" ${job.ApplyChannel === 'job-application-form' ? 'checked' : ''}></cc-radio>
      <cc-radio label="LinkedIn" value="linkedin" ${job.ApplyChannel === 'linkedin' ? 'checked' : ''}></cc-radio>
    </cc-radio-group>
    <cc-select name="status" label="Status" colspan="2">
      <cc-option value="pending" aria-selected="${job.status === 'pending' ? 'true' : 'false'}">Pending</cc-option>
      <cc-option value="rejected" aria-selected="${job.status === 'rejected' ? 'true' : 'false'}">Rejected</cc-option>
      <cc-option value="not-applied" aria-selected="${job.status === 'not-applied' ? 'true' : 'false'}">Not Applied</cc-option>
    </cc-select>
    <cc-checkbox name="volunteer-position" label="Volunteer position" ${job.VolunteerPosition ? 'checked' : ''}></cc-checkbox>
    <cc-textarea label="Notes" name="notes" colspan="2" helper-text="Maximum characters allowed: 3000"></cc-textarea>
  `;

  layout.querySelector('cc-textarea').value = job.Notes;
}