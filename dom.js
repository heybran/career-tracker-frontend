export function renderTable(jobs) {
  let html = '';
  jobs.forEach(job => {
    html += `
      <tr data-job-id="${job.id}">
        <td>${decodeURIComponent(job.website)}</td>
        <td>${job.position}</td>
        <td>${job.source ?? ''}</td>
        <td>${job.date_applied}</td>
        <td>${job.apply_channel}</td>
        <td><cc-badge theme="primary">${job.status}</cc-badge></td>
        <td>${Number(job.volunteer_position) !== 0 ? `<cc-badge theme="success">Yes</cc-badge>` : ''}</td>
        <td>${Number(job.four_day_week) !== 0 ? `<cc-badge theme="success">Yes</cc-badge>` : '<cc-badge theme="neutral">No</cc-badge>'}</td>
        <td>${job.notes}</td>
        <td>
          <cc-button theme="primary" href="/jobs/edit?id=${job.id}">Edit</cc-button>
          <cc-button theme="danger" onclick="window.jobController.showDeleteDialog('${job.id}', '${job.website}')">Delete</cc-button>
        </td>
      </tr>
    `;
  });

  return html;
}

export function renderFormElements(job, layout) {
  layout.innerHTML = `
    <cc-text-field label="Website" name="website" required value="${decodeURIComponent(job.website)}"></cc-text-field>
    <cc-text-field label="Position" name="position" required value="${job.position}"></cc-text-field>
    <cc-text-field label="Source" name="source" value="${job.source}"></cc-text-field>
    <cc-date-picker label="Date Applied" required name="date_applied" value="${job.date_applied}"></cc-date-picker>
    <cc-select name="status" label="Status" colspan="2">
      <cc-option value="pending" aria-selected="${job.status === 'pending' ? 'true' : 'false'}">Pending</cc-option>
      <cc-option value="rejected" aria-selected="${job.status === 'rejected' ? 'true' : 'false'}">Rejected</cc-option>
      <cc-option value="not-applied" aria-selected="${job.status === 'not-applied' ? 'true' : 'false'}">Not Applied</cc-option>
    </cc-select>
    <cc-textarea label="Notes" name="notes" colspan="2" helper-text="Maximum characters allowed: 3000"></cc-textarea>
    <cc-radio-group label="Apply channel" name="apply_channel" colspan="2">
      <cc-radio label="Email" value="email" ${job.apply_channel === 'email' ? 'checked' : ''}></cc-radio>
      <cc-radio label="Job application form" value="job-application-form" ${job.apply_channel === 'job-application-form' ? 'checked' : ''}></cc-radio>
      <cc-radio label="LinkedIn" value="linkedin" ${job.apply_channel === 'linkedin' ? 'checked' : ''}></cc-radio>
    </cc-radio-group>
    <cc-checkbox name="volunteer_position" label="Volunteer position" ${Number(job.volunteer_position) !== 0 ? 'checked' : ''}></cc-checkbox>
    <cc-checkbox name="four_day_week" label="4 day week" ${Number(job.four_day_week) !== 0 ? 'checked' : ''}></cc-checkbox>
  `;

  layout.querySelector('cc-textarea').value = job.notes;
}
