(() => {
  const ROLE_NAMES = {
    operator: 'Operator',
    storyteller: 'Storyteller',
    advocate: 'Advocate',
    builder: 'Builder',
    creative: 'Creative',
    scholar: 'Scholar'
  };

  const ROLE_ORDER = Object.keys(ROLE_NAMES);

  function showScreen(id) {
    document.querySelectorAll('.screen').forEach((el) => el.classList.remove('active'));
    document.getElementById(id).classList.add('active');
  }

  function formatTimestamp(isoLike) {
    // Server stores timestamps as UTC 'YYYY-MM-DD HH:MM:SS'.
    const date = new Date(`${isoLike.replace(' ', 'T')}Z`);
    if (Number.isNaN(date.getTime())) return isoLike;
    return date.toLocaleString(undefined, {
      year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit'
    });
  }

  function renderSummary(summary) {
    const grid = document.getElementById('summary-grid');
    grid.innerHTML = '';
    ROLE_ORDER.forEach((role) => {
      const item = document.createElement('div');
      item.className = 'summary-item';

      const label = document.createElement('p');
      label.className = 'summary-role';
      label.textContent = ROLE_NAMES[role];
      item.appendChild(label);

      const count = document.createElement('p');
      count.className = 'summary-count';
      count.textContent = String(summary[role] || 0);
      item.appendChild(count);

      grid.appendChild(item);
    });
  }

  function renderTable(submissions) {
    const body = document.getElementById('results-body');
    const emptyState = document.getElementById('empty-state');
    body.innerHTML = '';

    if (submissions.length === 0) {
      emptyState.style.display = 'block';
      return;
    }
    emptyState.style.display = 'none';

    submissions.forEach((row) => {
      const tr = document.createElement('tr');

      const name = document.createElement('td');
      name.textContent = `${row.firstName} ${row.lastName}`;
      tr.appendChild(name);

      const top = document.createElement('td');
      top.textContent = ROLE_NAMES[row.topRole] || row.topRole;
      tr.appendChild(top);

      const second = document.createElement('td');
      second.textContent = ROLE_NAMES[row.secondRole] || row.secondRole;
      tr.appendChild(second);

      const submitted = document.createElement('td');
      submitted.textContent = formatTimestamp(row.createdAt);
      tr.appendChild(submitted);

      body.appendChild(tr);
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('lock-form').addEventListener('submit', async (event) => {
      event.preventDefault();
      const password = document.getElementById('password').value;
      const errorEl = document.getElementById('lock-error');
      errorEl.classList.remove('visible');

      try {
        const res = await fetch('/api/results', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password })
        });

        if (!res.ok) {
          errorEl.textContent = res.status === 401 ? 'Incorrect password.' : 'Something went wrong. Try again.';
          errorEl.classList.add('visible');
          return;
        }

        const data = await res.json();
        renderSummary(data.summary);
        renderTable(data.submissions);
        showScreen('screen-data');
      } catch (err) {
        errorEl.textContent = 'Could not reach the server. Try again.';
        errorEl.classList.add('visible');
      }
    });
  });
})();
