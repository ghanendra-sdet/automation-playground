import './style.css';

console.log('Diagnostic: Main.ts loaded and executing!');

// ==========================================================================
// Sidebar Navigation Setup & Scroll Spying
// ==========================================================================
const sections = [
  { id: 'section-1', name: 'Basic Form Elements' },
  { id: 'section-2', name: 'Button Interactions' },
  { id: 'section-3', name: 'Checkboxes & Radio Buttons' },
  { id: 'section-4', name: 'Dropdowns' },
  { id: 'section-5', name: 'Locator Practice' },
  { id: 'section-6', name: 'Dynamic Content' },
  { id: 'section-7', name: 'Waits & Synchronisation' },
  { id: 'section-8', name: 'Table Automation' },
  { id: 'section-9', name: 'Alerts' },
  { id: 'section-10', name: 'Modals' },
  { id: 'section-11', name: 'iFrame' },
  { id: 'section-12', name: 'Shadow DOM' },
  { id: 'section-13', name: 'Drag & Drop' },
  { id: 'section-14', name: 'Hover Menu' },
  { id: 'section-15', name: 'Tooltip' },
  { id: 'section-16', name: 'File Upload' },
  { id: 'section-17', name: 'Download' },
  { id: 'section-18', name: 'Hidden Elements' },
  { id: 'section-19', name: 'Scroll Testing' },
  { id: 'section-20', name: 'Multiple Windows' },
  { id: 'section-21', name: 'Authentication Simulation' },
  { id: 'section-22', name: 'Stale Element Simulation' },
  { id: 'section-23', name: 'Dynamic List' },
  { id: 'section-24', name: 'Network Delay Simulation' },
  { id: 'section-25', name: 'Random Fail (Flaky) Elements' },
  { id: 'section-26', name: 'Keyboard Actions' },
  { id: 'section-27', name: 'Slider' },
  { id: 'section-28', name: 'Date Picker' },
  { id: 'section-29', name: 'Resizable Element' },
  { id: 'section-30', name: 'Complex DOM Structure' },
  { id: 'section-31', name: 'Autocomplete / Typeahead' },
  { id: 'section-32', name: 'Context Menu (Right-Click)' },
  { id: 'section-33', name: 'Clipboard / Copy Text' },
  { id: 'section-34', name: 'Multi-Step Wizard' },
  { id: 'section-35', name: 'Color Picker' },
  { id: 'section-36', name: 'Nested iFrames' },
  { id: 'section-37', name: 'Nested Tables' },
  { id: 'section-38', name: 'Page Operations' },
  { id: 'section-39', name: 'Bulk Links Scraper' },
  { id: 'section-40', name: 'Infinite Scroll' },
  { id: 'section-41', name: 'Search with Debounce' },
  { id: 'section-42', name: 'Character API Simulation' },
];

const sidebarList = document.getElementById('sidebar-list');
if (sidebarList) {
  sections.forEach((sec, idx) => {
    const li = document.createElement('li');
    li.setAttribute('data-target', sec.id);
    const num = (idx + 1).toString().padStart(2, '0');
    li.innerHTML = `<a href="#${sec.id}"><span class="nav-num">${num}</span> <span class="nav-name">${sec.name}</span></a>`;
    sidebarList.appendChild(li);
  });
}

// Scroll spy logic to highlight active section in sidebar
let lastActiveSec = '';
const sidebarNavEl = document.querySelector('.sidebar-nav') as HTMLElement;

window.addEventListener('scroll', () => {
  let activeSec = '';
  let minDistance = Infinity;

  sections.forEach((sec) => {
    const el = document.getElementById(sec.id);
    if (el) {
      const rect = el.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight - 150 && rect.bottom > 100;
      if (isVisible) {
        const distance = Math.abs(rect.top - 94);
        if (distance < minDistance) {
          minDistance = distance;
          activeSec = sec.id;
        }
      }
    }
  });

  if (activeSec && activeSec !== lastActiveSec) {
    lastActiveSec = activeSec;
    const listItems = sidebarList?.querySelectorAll('li');
    listItems?.forEach((li) => {
      if (li.getAttribute('data-target') === activeSec) {
        li.classList.add('active');
        // Scroll the active item into view within the sidebar
        if (sidebarNavEl) {
          const liTop = li.offsetTop;
          const liBottom = liTop + li.offsetHeight;
          const navScrollTop = sidebarNavEl.scrollTop;
          const navHeight = sidebarNavEl.clientHeight;
          if (liTop < navScrollTop) {
            sidebarNavEl.scrollTo({ top: liTop - 8, behavior: 'smooth' });
          } else if (liBottom > navScrollTop + navHeight) {
            sidebarNavEl.scrollTo({ top: liBottom - navHeight + 8, behavior: 'smooth' });
          }
        }
      } else {
        li.classList.remove('active');
      }
    });
  }
}, { passive: true });

// ==========================================================================
// Theme Toggle (Light / Dark Theme)
// ==========================================================================
const themeToggle = document.getElementById('theme-toggle');
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  });
}

// Set initial theme
const savedTheme = localStorage.getItem('theme') || 'dark';
document.documentElement.setAttribute('data-theme', savedTheme);

// ==========================================================================
// Challenge 01: Basic Form Elements
// ==========================================================================
const basicForm = document.getElementById('basic-form') as HTMLFormElement;
const formStatus = document.getElementById('form-status');
if (basicForm && formStatus) {
  basicForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const nameInput = document.getElementById('form-name') as HTMLInputElement;
    const emailInput = document.getElementById('form-email') as HTMLInputElement;
    const passwordInput = document.getElementById('form-password') as HTMLInputElement;
    const phoneInput = document.getElementById('form-phone') as HTMLInputElement;
    const bioInput = document.getElementById('form-bio') as HTMLTextAreaElement;

    if (!nameInput.value || !emailInput.value || !passwordInput.value || !phoneInput.value || !bioInput.value) {
      formStatus.textContent = 'Submission failed: Please fill all fields!';
      formStatus.className = 'status-value error';
      return;
    }

    formStatus.textContent = `Submitted successfully! Name: "${nameInput.value}", Email: "${emailInput.value}"`;
    formStatus.className = 'status-value success';
  });

  basicForm.addEventListener('reset', () => {
    formStatus.textContent = 'Not submitted';
    formStatus.className = 'status-value pending';
  });
}

// ==========================================================================
// Challenge 02: Button Interactions
// ==========================================================================
const btnClick = document.getElementById('btn-click');
const btnDoubleClick = document.getElementById('btn-double-click');
const btnRightClick = document.getElementById('btn-right-click');
const btnDelayed = document.getElementById('btn-delayed') as HTMLButtonElement;
const btnSelfRelabel = document.getElementById('btn-self-relabel') as HTMLButtonElement;

const statusClick = document.getElementById('status-click');
const statusDoubleClick = document.getElementById('status-double-click');
const statusRightClick = document.getElementById('status-right-click');

if (btnClick && statusClick) {
  btnClick.addEventListener('click', () => {
    statusClick.textContent = 'Clicked';
    statusClick.className = 'status-value success';
  });
}

if (btnDoubleClick && statusDoubleClick) {
  btnDoubleClick.addEventListener('dblclick', () => {
    statusDoubleClick.textContent = 'Double-clicked';
    statusDoubleClick.className = 'status-value success';
  });
}

if (btnRightClick && statusRightClick) {
  btnRightClick.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    statusRightClick.textContent = 'Right-clicked';
    statusRightClick.className = 'status-value success';
  });
}

// Delayed enable button after 3 seconds on load
setTimeout(() => {
  if (btnDelayed) {
    btnDelayed.removeAttribute('disabled');
    btnDelayed.textContent = 'Click Me!';
    btnDelayed.addEventListener('click', () => {
      btnDelayed.textContent = 'Enabled & Clicked!';
      btnDelayed.style.background = 'var(--success)';
    });
  }
}, 3000);

let clickCount = 0;
if (btnSelfRelabel) {
  btnSelfRelabel.addEventListener('click', () => {
    clickCount++;
    btnSelfRelabel.textContent = `Click count: ${clickCount}`;
  });
}

// ==========================================================================
// Challenge 03: Checkboxes & Radio Buttons
// ==========================================================================
const selectAllCheckbox = document.getElementById('checkbox-select-all') as HTMLInputElement;
const colorCheckboxes = document.querySelectorAll('.color-checkbox') as NodeListOf<HTMLInputElement>;
const radioOptions = document.getElementsByName('preference') as NodeListOf<HTMLInputElement>;
const statusRadio = document.getElementById('status-radio');
const revealCheckbox = document.getElementById('checkbox-reveal') as HTMLInputElement;
const hiddenText = document.getElementById('checkbox-hidden-text');

if (selectAllCheckbox) {
  selectAllCheckbox.addEventListener('change', () => {
    colorCheckboxes.forEach((cb) => {
      cb.checked = selectAllCheckbox.checked;
    });
  });
}

colorCheckboxes.forEach((cb) => {
  cb.addEventListener('change', () => {
    const allChecked = Array.from(colorCheckboxes).every((item) => item.checked);
    const someChecked = Array.from(colorCheckboxes).some((item) => item.checked);
    if (selectAllCheckbox) {
      selectAllCheckbox.checked = allChecked;
      selectAllCheckbox.indeterminate = someChecked && !allChecked;
    }
  });
});

radioOptions.forEach((radio) => {
  radio.addEventListener('change', () => {
    if (statusRadio && radio.checked) {
      statusRadio.textContent = `Selected: ${radio.value}`;
      statusRadio.className = 'status-value success';
    }
  });
});

if (revealCheckbox && hiddenText) {
  revealCheckbox.addEventListener('change', () => {
    hiddenText.style.display = revealCheckbox.checked ? 'block' : 'none';
  });
}

// ==========================================================================
// Challenge 04: Dropdowns
// ==========================================================================
const dropdownStandard = document.getElementById('dropdown-standard') as HTMLSelectElement;
const statusDropdownStandard = document.getElementById('status-dropdown-standard');
const dropdownMulti = document.getElementById('dropdown-multi') as HTMLSelectElement;
const statusDropdownMulti = document.getElementById('status-dropdown-multi');

const customSelectContainer = document.getElementById('custom-select-container');
const customSelectTrigger = document.getElementById('custom-select-trigger');
const customOptions = document.querySelectorAll('.custom-option');
const statusDropdownCustom = document.getElementById('status-dropdown-custom');

const dropdownState = document.getElementById('dropdown-state') as HTMLSelectElement;
const statusDropdownState = document.getElementById('status-dropdown-state');

if (dropdownStandard && statusDropdownStandard) {
  dropdownStandard.addEventListener('change', () => {
    statusDropdownStandard.textContent = dropdownStandard.value ? `Selected: ${dropdownStandard.value}` : 'Selected: none';
    statusDropdownStandard.className = dropdownStandard.value ? 'status-value success' : 'status-value pending';
  });
}

if (dropdownMulti && statusDropdownMulti) {
  dropdownMulti.addEventListener('change', () => {
    const selected = Array.from(dropdownMulti.selectedOptions).map((opt) => opt.value);
    statusDropdownMulti.textContent = selected.length > 0 ? `Selected: ${selected.join(', ')}` : 'Selected: none';
    statusDropdownMulti.className = selected.length > 0 ? 'status-value success' : 'status-value pending';
  });
}

// Custom Select UI toggle
if (customSelectTrigger && customSelectContainer) {
  customSelectTrigger.addEventListener('click', (e) => {
    e.stopPropagation();
    customSelectContainer.classList.toggle('open');
  });

  document.addEventListener('click', () => {
    customSelectContainer.classList.remove('open');
  });
}

customOptions.forEach((opt) => {
  opt.addEventListener('click', (e) => {
    e.stopPropagation();
    const value = opt.getAttribute('data-value') || '';
    if (customSelectTrigger && statusDropdownCustom && customSelectContainer) {
      customSelectTrigger.textContent = value;
      statusDropdownCustom.textContent = value;
      statusDropdownCustom.className = 'status-value success';
      customSelectContainer.classList.remove('open');
    }
  });
});

// Load state-populated dropdown dynamically after 500ms
setTimeout(() => {
  if (dropdownState) {
    dropdownState.innerHTML = `
      <option value="">Choose an option...</option>
      <option value="Dynamic A">Dynamic Item A</option>
      <option value="Dynamic B">Dynamic Item B</option>
      <option value="Dynamic C">Dynamic Item C</option>
    `;
    dropdownState.addEventListener('change', () => {
      if (statusDropdownState) {
        statusDropdownState.textContent = dropdownState.value ? `Selected: ${dropdownState.value}` : 'Selected: none';
        statusDropdownState.className = dropdownState.value ? 'status-value success' : 'status-value pending';
      }
    });
  }
}, 500);

// ==========================================================================
// Challenge 05: Locator Practice
// ==========================================================================
const locatorStatus = document.getElementById('locator-status');
const idInput = document.getElementById('locator-by-id');
const classInput = document.getElementById('locator-class-input');
const nameInput = document.getElementById('locator-name-input');
const testidInput = document.getElementById('locator-testid-input');
const ariaInput = document.getElementById('locator-aria-input');
const placeholderInput = document.getElementById('locator-placeholder-input');

const btnExact = document.getElementById('btn-exact-text');
const btnPartial = document.getElementById('btn-partial-text');
const btnCssAttr = document.getElementById('btn-css-attribute');
const btnXpath = document.getElementById('btn-xpath-action');

const updateLocatorStatus = (msg: string) => {
  if (locatorStatus) {
    locatorStatus.textContent = msg;
    locatorStatus.className = 'status-value success';
  }
};

idInput?.addEventListener('input', () => updateLocatorStatus('Typed by ID'));
classInput?.addEventListener('input', () => updateLocatorStatus('Typed by Class'));
nameInput?.addEventListener('input', () => updateLocatorStatus('Typed by Name'));
testidInput?.addEventListener('input', () => updateLocatorStatus('Typed by TestID'));
ariaInput?.addEventListener('input', () => updateLocatorStatus('Typed by Aria-label'));
placeholderInput?.addEventListener('input', () => updateLocatorStatus('Typed by Placeholder'));

btnExact?.addEventListener('click', () => updateLocatorStatus('Clicked Exact Text Button'));
btnPartial?.addEventListener('click', () => updateLocatorStatus('Clicked Partial Text Button'));
btnCssAttr?.addEventListener('click', () => updateLocatorStatus('Clicked CSS Attribute Button'));
btnXpath?.addEventListener('click', () => updateLocatorStatus('Clicked XPath Sibling 2 Button'));

// ==========================================================================
// Challenge 06: Dynamic Content
// ==========================================================================
const btnTriggerDynamic = document.getElementById('btn-trigger-dynamic');
const btnTriggerText = document.getElementById('btn-trigger-text');
const dynamicContainer = document.getElementById('dynamic-element-container');
const dynamicLabel = document.getElementById('dynamic-label');
const dynamicCounter = document.getElementById('dynamic-counter');

if (btnTriggerDynamic && dynamicContainer) {
  btnTriggerDynamic.addEventListener('click', () => {
    const loadingText = document.getElementById('dynamic-loading-text');
    if (loadingText) loadingText.style.display = 'none';

    const p = document.createElement('div');
    p.className = 'dynamic-paragraph';
    p.innerHTML = `Dynamic Item spawned at: <strong>${new Date().toLocaleTimeString()}</strong>`;
    dynamicContainer.appendChild(p);
  });
}

if (btnTriggerText && dynamicLabel) {
  btnTriggerText.addEventListener('click', () => {
    dynamicLabel.textContent = 'Updating...';
    setTimeout(() => {
      dynamicLabel.textContent = `Text Updated to code: "${Math.floor(Math.random() * 90000) + 10000}"`;
      dynamicLabel.style.color = 'var(--secondary)';
    }, 1000);
  });
}

// Running counter
let countVal = 0;
setInterval(() => {
  if (dynamicCounter) {
    countVal++;
    dynamicCounter.textContent = countVal.toString();
  }
}, 1000);

// ==========================================================================
// Challenge 07: Waits & Synchronisation
// ==========================================================================
const spinner = document.getElementById('wait-spinner');
const statusSpinner = document.getElementById('status-spinner');
const waitProgress = document.getElementById('wait-progress');
const statusProgress = document.getElementById('status-progress');
const btnStartProgress = document.getElementById('btn-start-progress');
const btnTriggerAjax = document.getElementById('btn-trigger-ajax');
const statusAjax = document.getElementById('status-ajax');

// Spinner wait logic
setTimeout(() => {
  if (spinner && statusSpinner) {
    spinner.classList.add('loaded');
    statusSpinner.textContent = 'Loaded!';
    statusSpinner.className = 'status-value success';
  }
}, 4000);

// Progress bar logic
if (btnStartProgress && waitProgress && statusProgress) {
  btnStartProgress.addEventListener('click', () => {
    btnStartProgress.setAttribute('disabled', 'true');
    let width = 0;
    const interval = setInterval(() => {
      if (width >= 100) {
        clearInterval(interval);
        statusProgress.textContent = 'Completed (100%)';
        statusProgress.className = 'progress-text status-value success';
        btnStartProgress.removeAttribute('disabled');
      } else {
        width += 4;
        if (width > 100) width = 100;
        waitProgress.style.width = `${width}%`;
        statusProgress.textContent = `${width}%`;
      }
    }, 100);
  });
}

// AJAX delay simulation
if (btnTriggerAjax && statusAjax) {
  btnTriggerAjax.addEventListener('click', () => {
    btnTriggerAjax.setAttribute('disabled', 'true');
    statusAjax.textContent = 'Requesting dynamic code...';
    statusAjax.className = 'status-value pending';

    setTimeout(() => {
      statusAjax.textContent = 'AJAX Success: Data received!';
      statusAjax.className = 'status-value success';
      btnTriggerAjax.removeAttribute('disabled');
    }, 3000);
  });
}

// ==========================================================================
// Challenge 08: Table Automation
// ==========================================================================
const tableData = [
  { id: 1, name: 'Automation Playground', role: 'Automation Architect', status: 'Active' },
  { id: 2, name: 'John Doe', role: 'QA Engineer', status: 'Inactive' },
  { id: 3, name: 'Alice Smith', role: 'SDET Manager', status: 'Active' },
  { id: 4, name: 'Bob Johnson', role: 'Manual Tester', status: 'Inactive' },
  { id: 5, name: 'Charlie Brown', role: 'Developer', status: 'Active' },
  { id: 6, name: 'Diana Prince', role: 'Security Architect', status: 'Active' },
  { id: 7, name: 'Bruce Wayne', role: 'Quality Specialist', status: 'Inactive' },
  { id: 8, name: 'Clark Kent', role: 'Reporter / Auditor', status: 'Active' }
];

let currentTablePage = 1;
const tablePageSize = 3;
let sortAsc = true;
let searchQuery = '';

const tableBody = document.getElementById('table-body');
const searchInput = document.getElementById('table-search') as HTMLInputElement;
const btnPrevPage = document.getElementById('btn-prev-page');
const btnNextPage = document.getElementById('btn-next-page');
const tablePageInfo = document.getElementById('table-page-info');
const thName = document.getElementById('th-name');

function renderTable() {
  if (!tableBody) return;

  // Filter
  let filtered = tableData.filter(
    (row) =>
      row.name.toLowerCase().includes(searchQuery) ||
      row.role.toLowerCase().includes(searchQuery) ||
      row.status.toLowerCase().includes(searchQuery)
  );

  // Sort
  filtered.sort((a, b) => {
    const valA = a.name.toLowerCase();
    const valB = b.name.toLowerCase();
    if (valA < valB) return sortAsc ? -1 : 1;
    if (valA > valB) return sortAsc ? 1 : -1;
    return 0;
  });

  const totalPages = Math.ceil(filtered.length / tablePageSize) || 1;
  if (currentTablePage > totalPages) currentTablePage = totalPages;

  // Pagination bounds
  const startIdx = (currentTablePage - 1) * tablePageSize;
  const endIdx = startIdx + tablePageSize;
  const pageData = filtered.slice(startIdx, endIdx);

  // HTML render
  tableBody.innerHTML = pageData.map((row) => `
    <tr>
      <td>${row.id}</td>
      <td data-testid="table-cell-name">${row.name}</td>
      <td>${row.role}</td>
      <td><span class="badge ${row.status === 'Active' ? 'badge-active' : 'badge-inactive'}">${row.status}</span></td>
    </tr>
  `).join('');

  if (tablePageInfo) {
    tablePageInfo.textContent = `Page ${currentTablePage} of ${totalPages}`;
  }

  if (btnPrevPage) {
    (btnPrevPage as HTMLButtonElement).disabled = currentTablePage === 1;
  }
  if (btnNextPage) {
    (btnNextPage as HTMLButtonElement).disabled = currentTablePage === totalPages;
  }
}

searchInput?.addEventListener('input', () => {
  searchQuery = searchInput.value.toLowerCase();
  currentTablePage = 1;
  renderTable();
});

thName?.addEventListener('click', () => {
  sortAsc = !sortAsc;
  const icon = thName.querySelector('.sort-icon');
  if (icon) icon.textContent = sortAsc ? '▲' : '▼';
  renderTable();
});

btnPrevPage?.addEventListener('click', () => {
  if (currentTablePage > 1) {
    currentTablePage--;
    renderTable();
  }
});

btnNextPage?.addEventListener('click', () => {
  currentTablePage++;
  renderTable();
});

// Initial load table
renderTable();

// ==========================================================================
// Challenge 09: Alerts
// ==========================================================================
const btnAlert = document.getElementById('btn-alert');
const btnConfirm = document.getElementById('btn-confirm');
const btnPrompt = document.getElementById('btn-prompt');
const btnCustomAlert = document.getElementById('btn-custom-alert');
const customAlertOverlay = document.getElementById('custom-alert-box');
const btnCloseCustomAlert = document.getElementById('btn-close-custom-alert');
const alertStatus = document.getElementById('alert-status');

const updateAlertStatus = (msg: string, success = true) => {
  if (alertStatus) {
    alertStatus.textContent = msg;
    alertStatus.className = success ? 'status-value success' : 'status-value error';
  }
};

btnAlert?.addEventListener('click', () => {
  alert('Hello! This is a native browser alert dialog.');
  updateAlertStatus('Alert dialog acknowledged');
});

btnConfirm?.addEventListener('click', () => {
  const choice = confirm('Do you accept the automation challenge terms?');
  updateAlertStatus(choice ? 'Confirm accepted' : 'Confirm cancelled');
});

btnPrompt?.addEventListener('click', () => {
  const result = prompt('Please enter your authorization code:');
  if (result === null) {
    updateAlertStatus('Prompt cancelled', false);
  } else {
    updateAlertStatus(`Prompt submitted code: "${result}"`);
  }
});

btnCustomAlert?.addEventListener('click', () => {
  if (customAlertOverlay) {
    customAlertOverlay.style.display = 'flex';
  }
});

btnCloseCustomAlert?.addEventListener('click', () => {
  if (customAlertOverlay) {
    customAlertOverlay.style.display = 'none';
    updateAlertStatus('HTML Custom Alert acknowledged');
  }
});

// ==========================================================================
// Challenge 10: Modals
// ==========================================================================
const btnOpenModal = document.getElementById('btn-open-modal');
const modalOverlay = document.getElementById('modal-overlay');
const btnModalX = document.getElementById('btn-modal-x');
const btnModalClose = document.getElementById('btn-modal-close');
const modalStatus = document.getElementById('modal-status');

const btnOpenDialog = document.getElementById('btn-open-dialog');
const nativeModalDialog = document.getElementById('native-modal-dialog') as HTMLDialogElement;
const btnDialogClose = document.getElementById('btn-dialog-close');

const updateModalStatus = (msg: string, open = false) => {
  if (modalStatus) {
    modalStatus.textContent = msg;
    modalStatus.className = open ? 'status-value success' : 'status-value pending';
  }
};

btnOpenModal?.addEventListener('click', () => {
  if (modalOverlay) {
    modalOverlay.style.display = 'flex';
    updateModalStatus('Open', true);
  }
});

const closeModal = () => {
  if (modalOverlay) {
    modalOverlay.style.display = 'none';
    updateModalStatus('Closed', false);
  }
};

btnModalX?.addEventListener('click', closeModal);
btnModalClose?.addEventListener('click', closeModal);
modalOverlay?.addEventListener('click', (e) => {
  if (e.target === modalOverlay) {
    closeModal();
  }
});

btnOpenDialog?.addEventListener('click', () => {
  nativeModalDialog?.showModal();
  updateModalStatus('Native Dialog Open', true);
});

btnDialogClose?.addEventListener('click', () => {
  nativeModalDialog?.close();
  updateModalStatus('Closed', false);
});

// ==========================================================================
// Challenge 12: Shadow DOM
// ==========================================================================
class ShadowElement extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });
    
    // Create elements
    const wrapper = document.createElement('div');
    wrapper.style.padding = '1.25rem';
    wrapper.style.background = 'rgba(168, 85, 247, 0.05)';
    wrapper.style.border = '1px solid rgba(168, 85, 247, 0.2)';
    wrapper.style.borderRadius = '8px';

    const label = document.createElement('label');
    label.textContent = 'Pierceable Shadow Input:';
    label.setAttribute('for', 'shadow-input');
    label.style.display = 'block';
    label.style.fontSize = '0.875rem';
    label.style.color = '#94a3b8';
    label.style.marginBottom = '0.5rem';

    const input = document.createElement('input');
    input.type = 'text';
    input.id = 'shadow-input';
    input.setAttribute('data-testid', 'shadow-input-field');
    input.style.width = '100%';
    input.style.padding = '0.6rem 0.8rem';
    input.style.background = '#0f1225';
    input.style.border = '1px solid rgba(255,255,255,0.08)';
    input.style.borderRadius = '6px';
    input.style.color = '#fff';
    input.style.outline = 'none';

    const btn = document.createElement('button');
    btn.id = 'shadow-btn';
    btn.setAttribute('data-testid', 'shadow-btn-submit');
    btn.textContent = 'Submit Shadow Key';
    btn.style.marginTop = '1rem';
    btn.style.background = '#a855f7';
    btn.style.color = '#fff';
    btn.style.border = 'none';
    btn.style.padding = '0.5rem 1rem';
    btn.style.borderRadius = '6px';
    btn.style.cursor = 'pointer';
    btn.style.fontWeight = '600';

    const status = document.createElement('div');
    status.id = 'shadow-status';
    status.style.marginTop = '1rem';
    status.style.fontSize = '0.875rem';
    status.style.color = '#10b981';
    status.style.fontFamily = 'monospace';
    status.style.display = 'none';

    btn.addEventListener('click', () => {
      if (input.value) {
        status.style.display = 'block';
        status.textContent = `Shadow DOM Key Accepted: "${input.value}"`;
      }
    });

    wrapper.appendChild(label);
    wrapper.appendChild(input);
    wrapper.appendChild(btn);
    wrapper.appendChild(status);
    shadow.appendChild(wrapper);
  }
}
customElements.define('shadow-element', ShadowElement);

// ==========================================================================
// Challenge 13: Drag & Drop
// ==========================================================================
const dragSource = document.getElementById('drag-source');
const dragTarget = document.getElementById('drag-target');
const statusDrag = document.getElementById('status-drag');

if (dragSource && dragTarget) {
  dragSource.addEventListener('dragstart', (e) => {
    e.dataTransfer?.setData('text/plain', 'source-box');
  });

  dragTarget.addEventListener('dragover', (e) => {
    e.preventDefault();
    dragTarget.classList.add('dragover');
  });

  dragTarget.addEventListener('dragleave', () => {
    dragTarget.classList.remove('dragover');
  });

  dragTarget.addEventListener('drop', (e) => {
    e.preventDefault();
    dragTarget.classList.remove('dragover');
    const data = e.dataTransfer?.getData('text/plain');
    if (data === 'source-box' && statusDrag) {
      statusDrag.textContent = 'Dropped Successfully!';
      statusDrag.className = 'status-value success';
      dragTarget.textContent = 'Dropped!';
      dragTarget.style.borderColor = 'var(--success)';
      dragTarget.style.color = 'var(--success)';
    }
  });
}

// Sortable reorder list
const sortableList = document.getElementById('sortable-list');
if (sortableList) {
  let draggingItem: HTMLElement | null = null;

  sortableList.addEventListener('dragstart', (e) => {
    const target = e.target as HTMLElement;
    if (target.classList.contains('sortable-item')) {
      draggingItem = target;
      target.classList.add('dragging');
    }
  });

  sortableList.addEventListener('dragend', (e) => {
    const target = e.target as HTMLElement;
    target.classList.remove('dragging');
    draggingItem = null;
  });

  sortableList.addEventListener('dragover', (e) => {
    e.preventDefault();
    const afterElement = getDragAfterElement(sortableList, e.clientY);
    if (draggingItem) {
      if (afterElement == null) {
        sortableList.appendChild(draggingItem);
      } else {
        sortableList.insertBefore(draggingItem, afterElement);
      }
    }
  });
}

function getDragAfterElement(container: HTMLElement, y: number): HTMLElement | null {
  const draggableElements = Array.from(container.querySelectorAll('.sortable-item:not(.dragging)'));
  
  return draggableElements.reduce<{ offset: number; element: HTMLElement | null }>((closest, child) => {
    const box = child.getBoundingClientRect();
    const offset = y - box.top - box.height / 2;
    if (offset < 0 && offset > closest.offset) {
      return { offset: offset, element: child as HTMLElement };
    } else {
      return closest;
    }
  }, { offset: Number.NEGATIVE_INFINITY, element: null }).element;
}

// ==========================================================================
// Challenge 14: Hover Menu
// ==========================================================================
const hoverStatus = document.getElementById('hover-status');
const hoverItems = document.querySelectorAll('.hover-menu-item');

hoverItems.forEach((item) => {
  item.addEventListener('click', (e) => {
    e.preventDefault();
    const val = item.textContent || '';
    if (hoverStatus) {
      hoverStatus.textContent = `Selected: ${val}`;
      hoverStatus.className = 'status-value success';
    }
  });
});

// ==========================================================================
// Challenge 16: File Upload
// ==========================================================================
const dropZoneUpload = document.getElementById('drop-zone-upload');
const fileUploadInput = document.getElementById('file-upload-input') as HTMLInputElement;
const btnBrowseFile = document.getElementById('btn-browse-file');
const uploadStatus = document.getElementById('upload-status');

const updateUploadStatus = (files: FileList | null) => {
  if (!uploadStatus) return;
  if (files && files.length > 0) {
    const file = files[0];
    uploadStatus.textContent = `Uploaded: ${file.name} (${file.size} bytes)`;
    uploadStatus.className = 'status-value success';
  } else {
    uploadStatus.textContent = 'No file selected';
    uploadStatus.className = 'status-value pending';
  }
};

btnBrowseFile?.addEventListener('click', (e) => {
  e.stopPropagation();
  fileUploadInput?.click();
});

dropZoneUpload?.addEventListener('click', () => {
  fileUploadInput?.click();
});

fileUploadInput?.addEventListener('change', () => {
  updateUploadStatus(fileUploadInput.files);
});

if (dropZoneUpload) {
  dropZoneUpload.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZoneUpload.classList.add('dragover');
  });

  dropZoneUpload.addEventListener('dragleave', () => {
    dropZoneUpload.classList.remove('dragover');
  });

  dropZoneUpload.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZoneUpload.classList.remove('dragover');
    if (e.dataTransfer && e.dataTransfer.files) {
      updateUploadStatus(e.dataTransfer.files);
    }
  });
}

// ==========================================================================
// Challenge 17: Download
// ==========================================================================
const btnDownload = document.getElementById('btn-download');
const downloadStatus = document.getElementById('download-status');

btnDownload?.addEventListener('click', () => {
  const content = `Playwright UI Automation Download Challenge Successful!\nDownloaded at: ${new Date().toISOString()}`;
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = 'practice.txt';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  if (downloadStatus) {
    downloadStatus.textContent = 'Downloaded practice.txt';
    downloadStatus.className = 'status-value success';
  }
});

// ==========================================================================
// Challenge 18: Hidden Elements
// ==========================================================================
const btnCovered = document.getElementById('btn-covered');
const btnRemoveBlocker = document.getElementById('btn-remove-blocker');
const overlayBlocker = document.getElementById('overlay-blocker');
const hiddenStatus = document.getElementById('hidden-status');

btnCovered?.addEventListener('click', () => {
  if (hiddenStatus) {
    hiddenStatus.textContent = 'Covered button clicked!';
    hiddenStatus.className = 'status-value success';
  }
});

btnRemoveBlocker?.addEventListener('click', () => {
  if (overlayBlocker) {
    overlayBlocker.style.display = 'none';
  }
  if (hiddenStatus) {
    hiddenStatus.textContent = 'Cover blocker overlay removed';
    hiddenStatus.className = 'status-value success';
  }
});

// ==========================================================================
// Challenge 19: Scroll Testing
// ==========================================================================
const scrollContainer = document.getElementById('scroll-container');
const scrollTarget = document.getElementById('scroll-target');
const scrollStatus = document.getElementById('scroll-status');

if (scrollContainer && scrollTarget) {
  scrollContainer.addEventListener('scroll', () => {
    const containerRect = scrollContainer.getBoundingClientRect();
    const targetRect = scrollTarget.getBoundingClientRect();

    // Check if target is fully within viewport of container
    const isVisible = (targetRect.top >= containerRect.top) && (targetRect.bottom <= containerRect.bottom);
    if (isVisible && scrollStatus) {
      scrollStatus.textContent = 'Scrolled to view!';
      scrollStatus.className = 'status-value success';
    }
  });
}

// Infinite Scroll List
const infiniteScrollContainer = document.getElementById('infinite-scroll-container');
const infiniteList = document.getElementById('infinite-list');
const infiniteLoading = document.getElementById('infinite-loading');
let itemCounter = 8;

if (infiniteScrollContainer && infiniteList && infiniteLoading) {
  infiniteScrollContainer.addEventListener('scroll', () => {
    if (infiniteScrollContainer.scrollHeight - infiniteScrollContainer.scrollTop <= infiniteScrollContainer.clientHeight + 10) {
      infiniteLoading.style.display = 'block';
      setTimeout(() => {
        for (let i = 0; i < 2; i++) {
          itemCounter++;
          const li = document.createElement('li');
          li.textContent = `Infinite Scroll Item ${itemCounter}`;
          infiniteList.appendChild(li);
        }
        infiniteLoading.style.display = 'none';
      }, 800);
    }
  });
}

// ==========================================================================
// Challenge 20: Multiple Windows
// ==========================================================================
const btnOpenWindow = document.getElementById('btn-open-window');
const windowStatus = document.getElementById('window-status');

btnOpenWindow?.addEventListener('click', () => {
  window.open(`${import.meta.env.BASE_URL}new-window.html`, '_blank', 'width=600,height=500');
  if (windowStatus) {
    windowStatus.textContent = 'Opened new-window.html';
    windowStatus.className = 'status-value success';
  }
});

// ==========================================================================
// Challenge 21: Authentication Simulation
// ==========================================================================
const btnLogin = document.getElementById('btn-login');
const btnLogout = document.getElementById('btn-logout');
const authLoginBox = document.getElementById('auth-login-box');
const authDashboardBox = document.getElementById('auth-dashboard-box');
const authUsername = document.getElementById('auth-username') as HTMLInputElement;
const authPassword = document.getElementById('auth-password') as HTMLInputElement;
const authStatus = document.getElementById('auth-status');

const checkAuthState = () => {
  const token = localStorage.getItem('mock-auth-token');
  if (token && authLoginBox && authDashboardBox && authStatus) {
    authLoginBox.style.display = 'none';
    authDashboardBox.style.display = 'block';
    authStatus.textContent = 'Logged In';
    authStatus.className = 'status-value success';
  } else if (authLoginBox && authDashboardBox && authStatus) {
    authLoginBox.style.display = 'block';
    authDashboardBox.style.display = 'none';
    authStatus.textContent = 'Logged Out';
    authStatus.className = 'status-value pending';
  }
};

btnLogin?.addEventListener('click', () => {
  const username = authUsername.value;
  const password = authPassword.value;

  if (username === 'admin' && password === 'admin123') {
    localStorage.setItem('mock-auth-token', 'AUTH_SUCCESS_TOKEN_998877');
    checkAuthState();
  } else {
    if (authStatus) {
      authStatus.textContent = 'Invalid Credentials';
      authStatus.className = 'status-value error';
    }
  }
});

btnLogout?.addEventListener('click', () => {
  localStorage.removeItem('mock-auth-token');
  authUsername.value = '';
  authPassword.value = '';
  checkAuthState();
});

// Run initial check
checkAuthState();

// ==========================================================================
// Challenge 22: Stale Element Simulation
// ==========================================================================
const btnTriggerStale = document.getElementById('btn-trigger-stale');
const staleContainer = document.getElementById('stale-container');
let staleNodeCount = 0;

btnTriggerStale?.addEventListener('click', () => {
  const staleTarget = document.getElementById('stale-target');
  if (staleTarget) {
    staleTarget.remove(); // Completely detach node
  }
  
  staleNodeCount++;
  const newSpan = document.createElement('span');
  newSpan.id = 'stale-target';
  newSpan.className = 'stale-target-label';
  newSpan.setAttribute('data-testid', 'stale-target');
  newSpan.textContent = `Stale target instance #${staleNodeCount}`;
  
  staleContainer?.appendChild(newSpan);
});

// ==========================================================================
// Challenge 23: Dynamic List
// ==========================================================================
const btnAddListItem = document.getElementById('btn-add-list-item');
const inputListItem = document.getElementById('input-list-item') as HTMLInputElement;
const dynamicPracticeList = document.getElementById('dynamic-practice-list');
let listIndex = 2;

const addListItem = () => {
  if (!inputListItem || !dynamicPracticeList) return;
  const val = inputListItem.value.trim();
  if (val) {
    const li = document.createElement('li');
    li.setAttribute('data-testid', `list-item-${listIndex}`);
    li.innerHTML = `${val} <button class="btn-remove-item" data-id="${listIndex}" data-testid="btn-remove-item-${listIndex}" aria-label="Remove ${val}">Remove</button>`;
    dynamicPracticeList.appendChild(li);
    
    inputListItem.value = '';
    listIndex++;
  }
};

btnAddListItem?.addEventListener('click', addListItem);
inputListItem?.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') addListItem();
});

dynamicPracticeList?.addEventListener('click', (e) => {
  const target = e.target as HTMLElement;
  if (target.classList.contains('btn-remove-item')) {
    const li = target.closest('li');
    li?.remove();
  }
});

// ==========================================================================
// Challenge 24: Network Delay Simulation
// ==========================================================================
const btnTriggerDelay = document.getElementById('btn-trigger-delay');
const delaySpinner = document.getElementById('delay-loading');
const delayStatus = document.getElementById('delay-status');

btnTriggerDelay?.addEventListener('click', () => {
  if (!btnTriggerDelay || !delaySpinner || !delayStatus) return;
  
  btnTriggerDelay.setAttribute('disabled', 'true');
  delaySpinner.style.display = 'inline-block';
  delayStatus.textContent = 'Simulating network call...';
  delayStatus.className = 'status-value pending';

  setTimeout(() => {
    delaySpinner.style.display = 'none';
    delayStatus.textContent = 'Success: Loaded data after 5s API delay!';
    delayStatus.className = 'status-value success';
    btnTriggerDelay.removeAttribute('disabled');
  }, 5000);
});

// ==========================================================================
// Challenge 25: Random Fail (Flaky) Elements
// ==========================================================================
const btnTriggerFlaky = document.getElementById('btn-trigger-flaky');
const flakyStatus = document.getElementById('flaky-status');

btnTriggerFlaky?.addEventListener('click', () => {
  if (!flakyStatus) return;

  const isSuccess = Math.random() < 0.5;
  if (isSuccess) {
    flakyStatus.textContent = 'Success: Transaction processed!';
    flakyStatus.className = 'status-value success';
  } else {
    flakyStatus.textContent = 'Error 500: Internal Server Outage';
    flakyStatus.className = 'status-value error';
  }
});

// ==========================================================================
// Challenge 26: Keyboard Actions
// ==========================================================================
const keyboardInput = document.getElementById('keyboard-input');
const statusKeyboardKey = document.getElementById('status-keyboard-key');
const statusKeyboardCounter = document.getElementById('status-keyboard-counter');
let keyboardCounter = 0;

keyboardInput?.addEventListener('keydown', (e: any) => {
  if (statusKeyboardKey) {
    statusKeyboardKey.textContent = e.key;
    statusKeyboardKey.className = 'status-value success';
  }

  if (e.key === 'ArrowUp') {
    e.preventDefault();
    keyboardCounter++;
    updateKeyboardCounter();
  } else if (e.key === 'ArrowDown') {
    e.preventDefault();
    keyboardCounter--;
    updateKeyboardCounter();
  }
});

function updateKeyboardCounter() {
  if (statusKeyboardCounter) {
    statusKeyboardCounter.textContent = keyboardCounter.toString();
    statusKeyboardCounter.className = 'status-value success';
  }
}

// ==========================================================================
// Challenge 27: Slider
// ==========================================================================
const rangeSlider = document.getElementById('range-slider') as HTMLInputElement;
const sliderVal = document.getElementById('slider-val');

if (rangeSlider && sliderVal) {
  rangeSlider.addEventListener('input', () => {
    sliderVal.textContent = rangeSlider.value;
  });
}

// ==========================================================================
// Challenge 28: Date Picker
// ==========================================================================
const datePickerStandard = document.getElementById('date-picker-standard') as HTMLInputElement;
const btnCustomDateTrigger = document.getElementById('btn-custom-date-trigger');
const customCalendarDropdown = document.getElementById('custom-calendar-dropdown');
const calendarMonthYear = document.getElementById('calendar-month-year');
const calendarDaysBody = document.getElementById('calendar-days-body');
const dateStatus = document.getElementById('date-status');

const btnCalendarPrev = document.getElementById('btn-calendar-prev');
const btnCalendarNext = document.getElementById('btn-calendar-next');

// Calendar State: July 2026
let calendarMonth = 6; // July
let calendarYear = 2026;

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

if (datePickerStandard && dateStatus) {
  datePickerStandard.addEventListener('change', () => {
    dateStatus.textContent = datePickerStandard.value;
    dateStatus.className = 'status-value success';
  });
}

btnCustomDateTrigger?.addEventListener('click', (e) => {
  e.stopPropagation();
  if (customCalendarDropdown) {
    const isHidden = customCalendarDropdown.style.display === 'none';
    customCalendarDropdown.style.display = isHidden ? 'block' : 'none';
    if (isHidden) renderCalendar();
  }
});

document.addEventListener('click', () => {
  if (customCalendarDropdown) {
    customCalendarDropdown.style.display = 'none';
  }
});

customCalendarDropdown?.addEventListener('click', (e) => {
  e.stopPropagation();
});

btnCalendarPrev?.addEventListener('click', () => {
  calendarMonth--;
  if (calendarMonth < 0) {
    calendarMonth = 11;
    calendarYear--;
  }
  renderCalendar();
});

btnCalendarNext?.addEventListener('click', () => {
  calendarMonth++;
  if (calendarMonth > 11) {
    calendarMonth = 0;
    calendarYear++;
  }
  renderCalendar();
});

function renderCalendar() {
  if (!calendarMonthYear || !calendarDaysBody) return;

  calendarMonthYear.textContent = `${monthNames[calendarMonth]} ${calendarYear}`;

  const firstDay = new Date(calendarYear, calendarMonth, 1).getDay();
  const totalDays = new Date(calendarYear, calendarMonth + 1, 0).getDate();

  let daysHtml = '';
  let row = '<tr>';
  const pad = (n: number) => String(n).padStart(2, '0');

  // Fill initial empty cells
  for (let i = 0; i < firstDay; i++) {
    row += '<td><span class="calendar-day empty-day"></span></td>';
  }

  let currentCol = firstDay;
  for (let day = 1; day <= totalDays; day++) {
    if (currentCol === 7) {
      row += '</tr>';
      daysHtml += row;
      row = '<tr>';
      currentCol = 0;
    }

    const isoDate = `${calendarYear}-${pad(calendarMonth + 1)}-${pad(day)}`;
    row += `<td><span class="calendar-day" data-day="${day}" data-date="${isoDate}">${day}</span></td>`;
    currentCol++;
  }

  // Fill remaining empty cells
  if (currentCol > 0 && currentCol < 7) {
    for (let i = currentCol; i < 7; i++) {
      row += '<td><span class="calendar-day empty-day"></span></td>';
    }
  }
  row += '</tr>';
  daysHtml += row;

  calendarDaysBody.innerHTML = daysHtml;

  // Bind day clicks
  const days = calendarDaysBody.querySelectorAll('.calendar-day:not(.empty-day)');
  days.forEach((dayEl) => {
    dayEl.addEventListener('click', () => {
      const selectedDay = dayEl.getAttribute('data-day');
      const dayNum = Number(selectedDay);
      const formattedDate = `${calendarYear}-${(calendarMonth + 1).toString().padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
      const calDisplay = document.getElementById('cal-selected-display');
      
      // Update displays
      if (dateStatus && customCalendarDropdown) {
        dateStatus.textContent = formattedDate;
        dateStatus.className = 'status-value success';
        customCalendarDropdown.style.display = 'none';
      }

      if (calDisplay) {
        calDisplay.textContent = `📅 ${dayNum} ${monthNames[calendarMonth]} ${calendarYear}`;
        calDisplay.style.display = 'inline-block';
      }

      days.forEach((d) => d.classList.remove('selected'));
      dayEl.classList.add('selected');
    });
  });
}

// ==========================================================================
// Challenge 29: Resizable Element
// ==========================================================================
const resizableBox = document.getElementById('resizable-box');
const resizableStats = document.getElementById('resizable-stats');

if (resizableBox && resizableStats && window.ResizeObserver) {
  const resizeObserver = new ResizeObserver((entries) => {
    for (let entry of entries) {
      const { width, height } = entry.contentRect;
      resizableStats.textContent = `${Math.round(width)}px x ${Math.round(height)}px`;
    }
  });
  resizeObserver.observe(resizableBox);
}

// ==========================================================================
// Challenge 30: Complex DOM Structure
// ==========================================================================
const complexStatus = document.getElementById('complex-status');
const complexActions = document.querySelectorAll('.btn-complex-action');

complexActions.forEach((btn) => {
  btn.addEventListener('click', () => {
    const rowId = btn.getAttribute('data-row-id') || '';
    if (complexStatus) {
      complexStatus.textContent = `Clicked button: "${rowId}"`;
      complexStatus.className = 'status-value success';
    }
  });
});

// ==========================================================================
// Scroll to Top Button
// ==========================================================================
const scrollToTopBtn = document.getElementById('scroll-to-top');
window.addEventListener('scroll', () => {
  if (window.scrollY > 400) {
    scrollToTopBtn?.classList.add('visible');
  } else {
    scrollToTopBtn?.classList.remove('visible');
  }
}, { passive: true });
scrollToTopBtn?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ==========================================================================
// Challenge 31: Autocomplete / Typeahead
// ==========================================================================
const languages = [
  'JavaScript', 'TypeScript', 'Python', 'Java', 'C#', 'C++', 'Go', 'Rust',
  'Ruby', 'PHP', 'Swift', 'Kotlin', 'Scala', 'Dart', 'Elixir', 'Haskell',
  'Playwright', 'Selenium', 'Cypress', 'WebdriverIO', 'Puppeteer'
];

const acInput = document.getElementById('autocomplete-input') as HTMLInputElement;
const acList = document.getElementById('autocomplete-list');
const acStatus = document.getElementById('autocomplete-status');

if (acInput && acList) {
  acInput.addEventListener('input', () => {
    const val = acInput.value.trim().toLowerCase();
    acList.innerHTML = '';
    if (!val) { acList.classList.remove('open'); return; }
    const matches = languages.filter(l => l.toLowerCase().includes(val));
    if (matches.length === 0) { acList.classList.remove('open'); return; }
    matches.slice(0, 8).forEach(match => {
      const li = document.createElement('li');
      li.className = 'autocomplete-item';
      li.textContent = match;
      li.setAttribute('role', 'option');
      li.setAttribute('data-testid', `ac-option-${match.toLowerCase().replace(/\s+/g, '-')}`);
      li.addEventListener('click', () => {
        acInput.value = match;
        acList.classList.remove('open');
        if (acStatus) {
          acStatus.textContent = match;
          acStatus.className = 'status-value success';
        }
      });
      acList.appendChild(li);
    });
    acList.classList.add('open');
  });
  document.addEventListener('click', (e) => {
    if (!acInput.contains(e.target as Node) && !acList.contains(e.target as Node)) {
      acList.classList.remove('open');
    }
  });
}

// ==========================================================================
// Challenge 32: Context Menu (Right-Click)
// ==========================================================================
const contextTarget = document.getElementById('context-target');
const contextMenu = document.getElementById('context-menu') as HTMLElement;
const contextStatus = document.getElementById('context-status');

if (contextTarget && contextMenu) {
  contextTarget.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    contextMenu.style.display = 'block';
    contextMenu.style.left = `${e.clientX}px`;
    contextMenu.style.top = `${e.clientY}px`;
  });

  document.addEventListener('click', () => {
    contextMenu.style.display = 'none';
  });

  contextMenu.querySelectorAll('li').forEach(item => {
    item.addEventListener('click', () => {
      const action = item.textContent?.trim() || '';
      if (contextStatus) {
        contextStatus.textContent = `Action: ${action}`;
        contextStatus.className = 'status-value success';
      }
      contextMenu.style.display = 'none';
    });
  });
}

// ==========================================================================
// Challenge 33: Clipboard / Copy to Clipboard
// ==========================================================================
const btnCopyClipboard = document.getElementById('btn-copy-clipboard');
const clipboardText = document.getElementById('clipboard-text');
const clipboardStatus = document.getElementById('clipboard-status');

if (btnCopyClipboard && clipboardText && clipboardStatus) {
  btnCopyClipboard.addEventListener('click', async () => {
    const text = clipboardText.textContent || '';
    try {
      await navigator.clipboard.writeText(text);
      clipboardStatus.textContent = '✓ Copied to clipboard!';
      clipboardStatus.className = 'status-value success';
      btnCopyClipboard.textContent = '✓ Copied!';
      setTimeout(() => {
        btnCopyClipboard.textContent = 'Copy';
        clipboardStatus.textContent = '✓ Copied to clipboard!';
      }, 2500);
    } catch {
      clipboardStatus.textContent = 'Copy failed (clipboard permission denied)';
      clipboardStatus.className = 'status-value error';
    }
  });
}

// ==========================================================================
// Challenge 34: Multi-Step Wizard
// ==========================================================================
let wizardStep = 1;
const totalWizSteps = 3;

const wizNext = document.getElementById('wiz-next');
const wizBack = document.getElementById('wiz-back');
const wizSubmit = document.getElementById('wiz-submit');
const wizStatus = document.getElementById('wizard-status');

function updateWizard() {
  for (let i = 1; i <= totalWizSteps; i++) {
    const panel = document.getElementById(`wizard-panel-${i}`);
    const dot = document.getElementById(`wiz-step-dot-${i}`);
    const connector = document.querySelector(`.wizard-connector:nth-child(${i * 2})`) as HTMLElement;
    if (panel) panel.style.display = i === wizardStep ? '' : 'none';
    if (dot) {
      dot.className = 'wizard-step' + (i < wizardStep ? ' done' : i === wizardStep ? ' active' : '');
      dot.textContent = i < wizardStep ? '✓' : String(i);
    }
    if (connector && i < totalWizSteps) {
      connector.className = 'wizard-connector' + (i < wizardStep ? ' done' : '');
    }
  }
  if (wizBack) wizBack.style.display = wizardStep > 1 ? '' : 'none';
  if (wizNext) wizNext.style.display = wizardStep < totalWizSteps ? '' : 'none';
  if (wizSubmit) wizSubmit.style.display = wizardStep === totalWizSteps ? '' : 'none';
  if (wizStatus) wizStatus.textContent = `Step ${wizardStep} of ${totalWizSteps}`;

  if (wizardStep === 3) {
    const review = document.getElementById('wizard-review');
    const fname = (document.getElementById('wiz-fname') as HTMLInputElement)?.value || '—';
    const lname = (document.getElementById('wiz-lname') as HTMLInputElement)?.value || '—';
    const username = (document.getElementById('wiz-username') as HTMLInputElement)?.value || '—';
    const role = (document.getElementById('wiz-role') as HTMLSelectElement)?.value || '—';
    if (review) review.innerHTML = `<b>Name:</b> ${fname} ${lname}<br><b>Username:</b> ${username}<br><b>Role:</b> ${role}`;
  }
}

wizNext?.addEventListener('click', () => { if (wizardStep < totalWizSteps) { wizardStep++; updateWizard(); } });
wizBack?.addEventListener('click', () => { if (wizardStep > 1) { wizardStep--; updateWizard(); } });
wizSubmit?.addEventListener('click', () => {
  if (wizStatus) {
    wizStatus.textContent = '✓ Wizard submitted successfully!';
    wizStatus.className = 'status-value success';
  }
  wizardStep = 1;
  setTimeout(updateWizard, 1500);
});

// ==========================================================================
// Challenge 35: Color Picker
// ==========================================================================
const colorInput = document.getElementById('color-input') as HTMLInputElement;
const colorPreview = document.getElementById('color-preview');
const colorHex = document.getElementById('color-hex');
const colorStatus = document.getElementById('color-status');
const btnApplyColor = document.getElementById('btn-apply-color');

if (colorInput && colorPreview && colorHex) {
  colorInput.addEventListener('input', () => {
    colorHex.textContent = colorInput.value;
  });
  btnApplyColor?.addEventListener('click', () => {
    const hex = colorInput.value;
    if (colorPreview) colorPreview.style.background = hex;
    if (colorStatus) {
      colorStatus.textContent = `Applied: ${hex}`;
      colorStatus.className = 'status-value success';
    }
  });
}

// ==========================================================================
// Calendar Enhancement: Today & Clear buttons
// ==========================================================================
const btnCalToday = document.getElementById('btn-cal-today');
const btnCalClear = document.getElementById('btn-cal-clear');

if (btnCalToday) {
  btnCalToday.addEventListener('click', () => {
    const today = new Date();
    const calDisplay = document.getElementById('cal-selected-display');
    const dateStatus = document.getElementById('date-status');
    const pad = (n: number) => String(n).padStart(2, '0');
    const formatted = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;
    const displayStr = today.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
    if (calDisplay) { calDisplay.textContent = `📅 ${displayStr}`; calDisplay.style.display = ''; }
    if (dateStatus) { dateStatus.textContent = formatted; dateStatus.className = 'status-value success'; }
    const dropdown = document.getElementById('custom-calendar-dropdown');
    if (dropdown) dropdown.style.display = 'none';
    // Mark today in calendar
    document.querySelectorAll('.calendar-day').forEach(d => d.classList.remove('selected'));
    document.querySelectorAll('.calendar-day').forEach(d => {
      if ((d as HTMLElement).dataset.date === formatted) d.classList.add('selected');
    });
  });
}

if (btnCalClear) {
  btnCalClear.addEventListener('click', () => {
    const calDisplay = document.getElementById('cal-selected-display');
    const dateStatus = document.getElementById('date-status');
    if (calDisplay) { calDisplay.textContent = ''; calDisplay.style.display = 'none'; }
    if (dateStatus) { dateStatus.textContent = 'none'; dateStatus.className = 'status-value pending'; }
    document.querySelectorAll('.calendar-day').forEach(d => d.classList.remove('selected'));
    const dropdown = document.getElementById('custom-calendar-dropdown');
    if (dropdown) dropdown.style.display = 'none';
  });
}

// ==========================================================================
// Challenge 37: Nested Tables (expand/collapse rows)
// ==========================================================================
const nestedExpandBtns = document.querySelectorAll('.nested-expand-btn');
const nestedTableStatus = document.getElementById('nested-table-status');

nestedExpandBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const row = (btn as HTMLElement).dataset.row;
    const detailRow = document.getElementById(`nested-detail-${row}`);
    const isOpen = detailRow?.style.display !== 'none';
    // Collapse all
    document.querySelectorAll('.nested-detail-row').forEach(r => ((r as HTMLElement).style.display = 'none'));
    document.querySelectorAll('.nested-expand-btn').forEach(b => (b.textContent = '▶ Expand'));
    if (!isOpen && detailRow) {
      detailRow.style.display = '';
      btn.textContent = '▼ Collapse';
      if (nestedTableStatus) {
        nestedTableStatus.textContent = `Order #ORD-00${row} expanded`;
        nestedTableStatus.className = 'status-value success';
      }
    } else {
      if (nestedTableStatus) {
        nestedTableStatus.textContent = 'No row expanded';
        nestedTableStatus.className = 'status-value pending';
      }
    }
  });
});

// ==========================================================================
// Challenge 38: Page Operations (Title, Refresh, New Page)
// ==========================================================================
const btnChangeTitle = document.getElementById('btn-change-title');
const btnSimulateRefresh = document.getElementById('btn-simulate-refresh');
const btnOpenNewPage = document.getElementById('btn-open-newpage');
const currentTitleVal = document.getElementById('current-title-val');
const lastLoadVal = document.getElementById('last-load-val');
const pageOpsStatus = document.getElementById('page-ops-status');

if (lastLoadVal) {
  const lastLoad = sessionStorage.getItem('last-refresh-time') || new Date().toLocaleTimeString();
  lastLoadVal.textContent = lastLoad;
  sessionStorage.setItem('last-refresh-time', new Date().toLocaleTimeString());
}

btnChangeTitle?.addEventListener('click', () => {
  const newTitle = 'Title Changed - Automation Playground';
  document.title = newTitle;
  if (currentTitleVal) currentTitleVal.textContent = newTitle;
  if (pageOpsStatus) {
    pageOpsStatus.textContent = 'Title changed!';
    pageOpsStatus.className = 'status-value success';
  }
});

btnSimulateRefresh?.addEventListener('click', () => {
  if (pageOpsStatus) {
    pageOpsStatus.textContent = 'Simulating page refresh...';
    pageOpsStatus.className = 'status-value pending';
  }
  setTimeout(() => {
    window.location.reload();
  }, 800);
});

btnOpenNewPage?.addEventListener('click', () => {
  window.open(`${import.meta.env.BASE_URL}new-window.html`, '_blank', 'width=600,height=400');
  if (pageOpsStatus) {
    pageOpsStatus.textContent = 'Opened new page/window';
    pageOpsStatus.className = 'status-value success';
  }
});

// ==========================================================================
// Challenge 39: Bulk Links Scraper (100+ Links)
// ==========================================================================
const linksGrid = document.getElementById('links-grid');
const scrapeStatus = document.getElementById('scrape-status');

if (linksGrid) {
  // Generate 100 links
  for (let i = 1; i <= 100; i++) {
    const a = document.createElement('a');
    a.href = `#bulk-link-${i}`;
    a.setAttribute('data-testid', `bulk-link-${i}`);
    a.textContent = `Link #${i}`;
    a.addEventListener('click', (e) => {
      e.preventDefault();
      if (scrapeStatus) {
        scrapeStatus.textContent = `Clicked Link #${i}`;
        scrapeStatus.className = 'status-value success';
      }
    });
    linksGrid.appendChild(a);
  }
}

// ==========================================================================
// Challenge 40: Infinite Scroll
// ==========================================================================
const infScrollContainer = document.getElementById('inf-scroll-container');
const infScrollList = document.getElementById('inf-scroll-list');
const infScrollLoader = document.getElementById('inf-scroll-loader');
const infScrollStatus = document.getElementById('inf-scroll-status');

let loadedItemCount = 0;
let isListLoading = false;

function loadInfiniteItems(count: number) {
  if (!infScrollList) return;
  isListLoading = true;
  if (infScrollLoader) infScrollLoader.style.display = 'block';

  // Simulate loading delay
  setTimeout(() => {
    for (let i = 0; i < count; i++) {
      loadedItemCount++;
      const li = document.createElement('li');
      li.style.padding = '0.5rem';
      li.style.borderBottom = '1px solid var(--border-color)';
      li.style.fontSize = '0.875rem';
      li.setAttribute('data-testid', `infinite-item-${loadedItemCount}`);
      li.textContent = `⚡ Scroll Item #${loadedItemCount}`;
      infScrollList.appendChild(li);
    }
    if (infScrollStatus) {
      infScrollStatus.textContent = `${loadedItemCount} items loaded`;
      infScrollStatus.className = 'status-value success';
    }
    if (infScrollLoader) infScrollLoader.style.display = 'none';
    isListLoading = false;
  }, 300);
}

if (infScrollContainer) {
  // Initial load
  loadInfiniteItems(10);

  infScrollContainer.addEventListener('scroll', () => {
    if (isListLoading) return;
    const scrollTop = infScrollContainer.scrollTop;
    const scrollHeight = infScrollContainer.scrollHeight;
    const clientHeight = infScrollContainer.clientHeight;
    
    // Check if close to bottom (within 15px)
    if (scrollHeight - scrollTop - clientHeight < 15) {
      loadInfiniteItems(5);
    }
  });
}

// ==========================================================================
// Challenge 41: Search with Debounce (500ms)
// ==========================================================================
const debounceSearchInput = document.getElementById('debounce-search-input') as HTMLInputElement;
const searchSpinner = document.getElementById('search-spinner');
const debounceSearchResults = document.getElementById('debounce-search-results');
const debounceSearchStatus = document.getElementById('debounce-search-status');

let debounceTimeout: ReturnType<typeof setTimeout> | null = null;
const searchItems = [
  'Playwright', 'Selenium', 'Cypress', 'Puppeteer', 'TypeScript', 'JavaScript',
  'Vite', 'React', 'Vue', 'Angular', 'HTML5', 'CSS3', 'Next.js', 'Node.js'
];

if (debounceSearchInput && debounceSearchResults) {
  debounceSearchInput.addEventListener('input', () => {
    // Clear active timeout
    if (debounceTimeout) clearTimeout(debounceTimeout);
    
    const query = debounceSearchInput.value.trim().toLowerCase();
    if (!query) {
      debounceSearchResults.innerHTML = '';
      if (searchSpinner) searchSpinner.style.display = 'none';
      if (debounceSearchStatus) {
        debounceSearchStatus.textContent = 'Idle';
        debounceSearchStatus.className = 'status-value pending';
      }
      return;
    }

    if (searchSpinner) searchSpinner.style.display = 'inline';
    if (debounceSearchStatus) {
      debounceSearchStatus.textContent = 'Typing...';
      debounceSearchStatus.className = 'status-value pending';
    }

    debounceTimeout = setTimeout(() => {
      // Simulate Search
      const matches = searchItems.filter(item => item.toLowerCase().includes(query));
      debounceSearchResults.innerHTML = '';
      if (searchSpinner) searchSpinner.style.display = 'none';

      if (matches.length > 0) {
        matches.forEach(match => {
          const li = document.createElement('li');
          li.className = 'autocomplete-item';
          li.textContent = match;
          li.setAttribute('data-testid', `search-result-${match.toLowerCase()}`);
          debounceSearchResults.appendChild(li);
        });
        if (debounceSearchStatus) {
          debounceSearchStatus.textContent = `Found ${matches.length} results`;
          debounceSearchStatus.className = 'status-value success';
        }
      } else {
        const li = document.createElement('li');
        li.className = 'autocomplete-item';
        li.style.color = 'var(--text-muted)';
        li.textContent = 'No matches found';
        debounceSearchResults.appendChild(li);
        if (debounceSearchStatus) {
          debounceSearchStatus.textContent = 'No results';
          debounceSearchStatus.className = 'status-value error';
        }
      }
    }, 500); // 500ms debounce
  });
}

// ==========================================================================
// Challenge 42: Character API Call Simulation
// ==========================================================================
const apiSimInput = document.getElementById('api-sim-input') as HTMLInputElement;
const apiLogList = document.getElementById('api-log-list');
const apiSimStatus = document.getElementById('api-sim-status');

let requestCounter = 0;

if (apiSimInput && apiLogList) {
  apiSimInput.addEventListener('input', () => {
    const val = apiSimInput.value;
    requestCounter++;

    // Add entry to log list
    const logItem = document.createElement('div');
    logItem.style.padding = '0.2rem 0';
    logItem.style.borderBottom = '1px solid rgba(255,255,255,0.05)';
    logItem.style.color = 'var(--success)';
    logItem.textContent = `[${new Date().toLocaleTimeString()}] GET /api/search?q=${encodeURIComponent(val)} (Status: 200 OK)`;
    apiLogList.appendChild(logItem);

    // Scroll to bottom of log
    const logBox = apiLogList.parentElement;
    if (logBox) logBox.scrollTop = logBox.scrollHeight;

    if (apiSimStatus) {
      apiSimStatus.textContent = `${requestCounter} requests triggered`;
      apiSimStatus.className = 'status-value success';
    }
  });
}

// ==========================================================================
// Section Reset Logic (Centralized Handlers)
// ==========================================================================
function resetSection(id: string) {
  const card = document.getElementById(id);
  if (!card) return;

  // 1. Reset standard forms inside the card
  const forms = card.querySelectorAll('form');
  forms.forEach(f => f.reset());

  // 2. Clear inputs/textareas/selects if not in a form
  const inputs = card.querySelectorAll('input, textarea, select');
  inputs.forEach(input => {
    const el = input as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
    if (el.type === 'checkbox' || el.type === 'radio') {
      (el as HTMLInputElement).checked = false;
    } else if (el.type === 'color') {
      el.value = '#3b82f6';
    } else if (el.type !== 'submit' && el.type !== 'button' && el.type !== 'reset') {
      el.value = '';
    }
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
  });

  // 3. Reset standard status values
  const statuses = card.querySelectorAll('.status-value');
  statuses.forEach(status => {
    status.textContent = 'none';
    status.className = 'status-value pending';
  });

  // 4. Section-specific logic overrides
  if (id === 'section-1') {
    const fs = document.getElementById('form-status');
    if (fs) { fs.textContent = 'Not submitted'; fs.className = 'status-value pending'; }
  } else if (id === 'section-2') {
    const clickStatus = document.getElementById('click-status');
    if (clickStatus) { clickStatus.textContent = 'none'; clickStatus.className = 'status-value pending'; }
    const labelBtn = document.getElementById('btn-label-change');
    if (labelBtn) labelBtn.textContent = 'Click to Change My Label';
  } else if (id === 'section-6') {
    const container = document.getElementById('dynamic-container');
    if (container) container.innerHTML = '<p class="loading-placeholder">Waiting for trigger...</p>';
    const ds = document.getElementById('dynamic-status');
    if (ds) { ds.textContent = 'none'; ds.className = 'status-value pending'; }
  } else if (id === 'section-7') {
    const container = document.getElementById('waits-container');
    if (container) { container.innerHTML = ''; container.className = 'waits-target-box'; }
    const ws = document.getElementById('waits-status');
    if (ws) { ws.textContent = 'none'; ws.className = 'status-value pending'; }
  } else if (id === 'section-13') {
    const dropzone = document.getElementById('dropzone');
    if (dropzone) {
      dropzone.innerHTML = '<p class="dropzone-placeholder">Drop item here</p>';
      dropzone.classList.remove('drag-over', 'drag-success');
    }
  } else if (id === 'section-16') {
    const label = document.getElementById('file-upload-status');
    if (label) { label.textContent = 'No file selected'; label.className = 'status-value pending'; }
  } else if (id === 'section-17') {
    const progress = document.getElementById('download-progress');
    if (progress) { progress.style.width = '0%'; progress.textContent = ''; }
  } else if (id === 'section-18') {
    const h = document.getElementById('hidden-box');
    if (h) { h.style.display = 'none'; h.classList.remove('visible'); }
  } else if (id === 'section-19') {
    const list = document.getElementById('infinite-list');
    if (list) {
      list.innerHTML = '<li>Seed Item 1</li><li>Seed Item 2</li><li>Seed Item 3</li><li>Seed Item 4</li><li>Seed Item 5</li><li>Seed Item 6</li><li>Seed Item 7</li><li>Seed Item 8</li>';
    }
    itemCounter = 8;
    const status = document.getElementById('scroll-status');
    if (status) {
      status.textContent = 'Waiting for scroll...';
      status.className = 'status-value pending';
    }
  } else if (id === 'section-22') {
    const container = document.getElementById('stale-container');
    if (container) {
      container.innerHTML = '<button id="btn-stale-target" class="btn btn-primary" data-testid="btn-stale-target">Click Me (Stale Target)</button>';
      const staleStatus = document.getElementById('stale-status');
      document.getElementById('btn-stale-target')?.addEventListener('click', () => {
        if (staleStatus) { staleStatus.textContent = 'Success!'; staleStatus.className = 'status-value success'; }
      });
    }
  } else if (id === 'section-23') {
    const list = document.getElementById('dynamic-list-items');
    if (list) list.innerHTML = '';
  } else if (id === 'section-24') {
    const container = document.getElementById('network-data-container');
    if (container) container.innerHTML = '';
  } else if (id === 'section-26') {
    const keys = document.getElementById('keyboard-pressed-keys');
    if (keys) keys.innerHTML = '';
  } else if (id === 'section-27') {
    const display = document.getElementById('slider-value-display');
    if (display) display.textContent = '50';
    const slider = document.getElementById('range-slider-input') as HTMLInputElement;
    if (slider) slider.value = '50';
  } else if (id === 'section-28') {
    const calDisplay = document.getElementById('cal-selected-display');
    if (calDisplay) { calDisplay.textContent = ''; calDisplay.style.display = 'none'; }
    const stdPicker = document.getElementById('date-picker-standard') as HTMLInputElement;
    if (stdPicker) stdPicker.value = '';
    const dateStatus = document.getElementById('date-status');
    if (dateStatus) { dateStatus.textContent = 'none'; dateStatus.className = 'status-value pending'; }
    const dropdown = document.getElementById('custom-calendar-dropdown');
    if (dropdown) dropdown.style.display = 'none';
  } else if (id === 'section-29') {
    const box = document.getElementById('resizable-box');
    if (box) { box.style.width = '180px'; box.style.height = '150px'; }
    const stats = document.getElementById('resizable-stats');
    if (stats) stats.textContent = '180px x 150px';
  } else if (id === 'section-31') {
    const acList = document.getElementById('autocomplete-list');
    if (acList) acList.classList.remove('open');
  } else if (id === 'section-34') {
    // Multi-step Wizard reset
    const wizardState = document.getElementById('wizard-status');
    if (wizardState) {
      wizardState.textContent = 'Step 1 of 3';
      wizardState.className = 'status-value pending';
    }
    // Set wizardStep global back to 1
    // Since wizardStep is defined above, we can directly update it
    (window as any)._wizardStep = 1;
    // Call the original updateWizard if accessible, or trigger wizard reset event/handler
    const resetTrigger = document.getElementById('wiz-back');
    if (resetTrigger) {
      // Simulate back clicks to step 1
      resetTrigger.dispatchEvent(new Event('click'));
      resetTrigger.dispatchEvent(new Event('click'));
    }
  } else if (id === 'section-35') {
    const preview = document.getElementById('color-preview');
    if (preview) preview.style.background = '#3b82f6';
  } else if (id === 'section-36') {
    const iframe = document.getElementById('outer-iframe') as HTMLIFrameElement;
    if (iframe) iframe.src = iframe.src;
  } else if (id === 'section-37') {
    document.querySelectorAll('.nested-detail-row').forEach(r => ((r as HTMLElement).style.display = 'none'));
    document.querySelectorAll('.nested-expand-btn').forEach(b => (b.textContent = '▶ Expand'));
    const status = document.getElementById('nested-table-status');
    if (status) { status.textContent = 'No row expanded'; status.className = 'status-value pending'; }
  } else if (id === 'section-38') {
    const currentTitle = document.getElementById('current-title-val');
    if (currentTitle) currentTitle.textContent = 'Automation Playground';
    document.title = 'Automation Playground';
    const opsStatus = document.getElementById('page-ops-status');
    if (opsStatus) { opsStatus.textContent = 'Ready'; opsStatus.className = 'status-value pending'; }
  } else if (id === 'section-39') {
    const scrapeStatus = document.getElementById('scrape-status');
    if (scrapeStatus) { scrapeStatus.textContent = '0 links verified'; scrapeStatus.className = 'status-value pending'; }
  } else if (id === 'section-40') {
    const list = document.getElementById('inf-scroll-list');
    if (list) list.innerHTML = '';
    const scrollStatusEl = document.getElementById('inf-scroll-status');
    if (scrollStatusEl) { scrollStatusEl.textContent = '0 items'; scrollStatusEl.className = 'status-value pending'; }
    loadedItemCount = 0;
    loadInfiniteItems(10);
  } else if (id === 'section-41') {
    const results = document.getElementById('debounce-search-results');
    if (results) results.innerHTML = '';
    const dsStatus = document.getElementById('debounce-search-status');
    if (dsStatus) { dsStatus.textContent = 'Idle'; dsStatus.className = 'status-value pending'; }
  } else if (id === 'section-42') {
    const log = document.getElementById('api-log-list');
    if (log) log.innerHTML = '';
    const apiStatus = document.getElementById('api-sim-status');
    if (apiStatus) { apiStatus.textContent = '0 requests'; apiStatus.className = 'status-value pending'; }
    requestCounter = 0;
  }
}

// Inject Reset buttons dynamically to all card headers
document.querySelectorAll('.challenge-card').forEach((card) => {
  const header = card.querySelector('.card-header');
  const sectionId = card.getAttribute('id');
  if (header && sectionId) {
    const titleGroup = document.createElement('div');
    titleGroup.className = 'card-title-group';
    while (header.firstChild) {
      titleGroup.appendChild(header.firstChild);
    }
    header.appendChild(titleGroup);

    const resetBtn = document.createElement('button');
    resetBtn.className = 'btn-reset-section';
    resetBtn.setAttribute('data-section', sectionId);
    resetBtn.setAttribute('data-testid', `reset-${sectionId}`);
    resetBtn.innerHTML = '↺ Reset';
    resetBtn.addEventListener('click', (e) => {
      e.preventDefault();
      resetSection(sectionId);
    });
    header.appendChild(resetBtn);
  }
});

// ==========================================================================
// Challenge Instructions Checklist Injection
// ==========================================================================
const challengeSteps: Record<string, string[]> = {
  'section-1': [
    'Fill the "Full Name" input field (`#form-name`)',
    'Fill the "Email Address" input field (`#form-email`)',
    'Fill the "Password" input field (`#form-password`)',
    'Fill the "Phone Number" input field (`#form-phone`)',
    'Fill the "Short Biography" textarea (`#form-bio`)',
    'Click "Submit Form" button and verify status changes to "Submitted successfully!"',
    'Click "Reset Form" button to clear all form fields'
  ],
  'section-2': [
    'Click "Click Me" button and verify Single click status changes',
    'Double-click "Double Click Me" button and verify Double click status changes',
    'Right-click "Right Click Me" button and verify Right click status changes',
    'Wait 3 seconds for the "Wait for 3s" button to enable, click it, and verify its status',
    'Click the "Click count: 0" self-relabeling button and verify the count increments'
  ],
  'section-3': [
    'Toggle individual color checkboxes ("Red", "Green", "Blue")',
    'Toggle "Select All" checkbox to select and deselect all color options at once',
    'Select a radio button option ("Option 1", "Option 2", or "Option 3") and verify status',
    'Check "Reveal Secret Text" checkbox to display the hidden secret message'
  ],
  'section-4': [
    'Select an option (e.g. "India") from the "Standard select" dropdown (`#dropdown-standard`)',
    'Select multiple options (e.g. "React", "Vue") in the "Multi-select" list box (`#dropdown-multi`)',
    'Click "Choose..." custom dropdown trigger (`#custom-select-trigger`) and click an option ("Option X", "Option Y", or "Option Z")',
    'Select an option from the "Select populated from state array" dropdown (`#dropdown-state`)'
  ],
  'section-5': [
    'Type into "By ID" input field (`#locator-by-id`)',
    'Type into "By class" input field (`.locator-by-class`)',
    'Type into "By name" input field (`[name="locator-name"]`)',
    'Type into "By data-testid" input field (`[data-testid="locator-testid"]`)',
    'Click "Submit Exact Text" button using exact text matching selector',
    'Click "Submit Partial Info Here" button using partial text matching selector',
    'Click "CSS Attribute Target" button using custom attribute selector (`[data-css="css-practice-value"]`)',
    'Click "Click Sibling 2" button inside the nested XPath tree structure'
  ],
  'section-6': [
    'Click "Trigger Dynamic Elements" button to start rendering dynamic content',
    'Wait for the dynamic element to appear and click it to confirm active state',
    'Click "Change Output Text" button and verify text changes to "Updated dynamic text!"'
  ],
  'section-7': [
    'Wait for "Spinner Wait" indicator to change to "Loaded!" state',
    'Wait for "Delayed Text Value" to display "Data loaded after 3s!"',
    'Click "Start Progress" button and wait for the progress bar to reach 100%',
    'Click "Call API Endpoint" button and wait for the 5-second AJAX response'
  ],
  'section-8': [
    'Retrieve all table cell values across rows and columns',
    'Click table header "Name" to sort the table rows alphabetically',
    'Type query into "Search table..." input (`#table-search`) and verify row filtering'
  ],
  'section-9': [
    'Click "Trigger Alert" button and accept the browser alert dialog',
    'Click "Trigger Confirm" button, cancel/accept the dialog, and verify output',
    'Click "Trigger Prompt" button, type text in prompt, accept, and verify response',
    'Click "Trigger HTML Alert" button, then click "Acknowledge" button inside the modal'
  ],
  'section-10': [
    'Click "Open Custom Modal" button, verify modal appears, then click "Close Modal" or X icon',
    'Click "Open HTML5 Dialog" button, verify dialog appears, then click "Close Dialog"'
  ],
  'section-11': [
    'Switch context inside the frame element (`#iframe-challenge`)',
    'Type text inside "Iframe Input Field" (`#iframe-input`)',
    'Click "Submit inside Iframe" button (`#iframe-submit`) and verify response text',
    'Switch back to the main page context'
  ],
  'section-12': [
    'Pierce the Shadow DOM web component (`#shadow-container`)',
    'Locate "Pierceable Shadow Input:" (`#shadow-input`) inside shadow root and type text',
    'Click "Submit Shadow Key" button (`#shadow-btn`) inside shadow root and verify status'
  ],
  'section-13': [
    'Drag "Drag Me" element (`#drag-source`) from its container',
    'Drop it onto "Drop Zone" container (`#drag-target`)',
    'Verify that the Drop Zone text changes to "Dropped!" with success styling'
  ],
  'section-14': [
    'Hover cursor over "Hover Me for Options" trigger button (`.hover-trigger`)',
    'Wait for the dropdown menu to become visible',
    'Click one of the revealed menu links ("Action 1", "Action 2", or "Option 3") and verify status'
  ],
  'section-15': [
    'Hover mouse over or focus on "Hover or Focus Me" button (`#tooltip-trigger`)',
    'Assert that the tooltip box displaying "Interactive tooltip content" is rendered'
  ],
  'section-16': [
    'Click "Browse File" button (`#btn-browse-file`) or upload a file via file input (`#file-upload-input`)',
    'Verify that the status label displays the uploaded file name and size'
  ],
  'section-17': [
    'Click "Download File" button (`#btn-download`)',
    'Wait for file download event and verify status displays "Downloaded practice.txt"'
  ],
  'section-18': [
    'Verify that "Covered Button" (`#btn-covered`) is obscured by an overlay',
    'Click "Remove Blocker Overlay" button (`#btn-remove-blocker`) to clear obstruction',
    'Click "Covered Button" and verify success status'
  ],
  'section-19': [
    'Scroll down the `#scroll-container` box until "🚩 You scrolled to me!" (`#scroll-target`) is visible',
    'Scroll down the "Infinite Scroll List" container (`#infinite-scroll-container`) to load new list items automatically'
  ],
  'section-20': [
    'Click "Open New Window" button (`#btn-open-window`) to open a child popup window',
    'Switch window context to `new-window.html` and verify page title/heading',
    'Close popup window and switch context back to main window'
  ],
  'section-21': [
    'Type invalid credentials into "Username" and "Password" inputs and click "Login"',
    'Verify "Invalid Credentials" error status',
    'Type valid credentials (`admin` / `admin123`), click "Login", and verify "Logged In" status',
    'Click "Logout" button to sign out'
  ],
  'section-22': [
    'Locate the target element "Stale target instance #0" (`#stale-target`)',
    'Click "Refresh Target Node" button (`#btn-trigger-stale`) to replace the element in the DOM',
    'Handle Stale Element Reference Exception by re-locating the newly created `#stale-target` element'
  ],
  'section-23': [
    'Type item text in "Add list item..." input (`#input-list-item`) and click "Add Item" (`#btn-add-list-item`)',
    'Verify new list item appears in the list',
    'Click "Remove" button (`.btn-remove-item`) on a list item to delete it from the list'
  ],
  'section-24': [
    'Click "Trigger 5s Delay" button (`#btn-trigger-delay`)',
    'Wait for the 5-second simulated API network request to resolve',
    'Verify status updates to "Success: Loaded data after 5s API delay!"'
  ],
  'section-25': [
    'Click "Submit Flaky Request" button (`#btn-trigger-flaky`) which randomly succeeds or fails with HTTP 500',
    'Implement a retry loop in your test code to re-click until "Success: Transaction processed!" is achieved'
  ],
  'section-26': [
    'Focus inside "Click and type keys..." input (`#keyboard-input`)',
    'Type key combinations (e.g. ArrowUp, ArrowDown, Enter)',
    'Verify pressed key and counter values update in status panel'
  ],
  'section-27': [
    'Locate range slider input (`#range-slider`)',
    'Set slider value (e.g., 75) and verify value display (`#slider-val`) updates'
  ],
  'section-28': [
    'Select a date in "Standard HTML5 Date Input" (`#date-picker-standard`)',
    'Click "📅 Open Calendar" button (`#btn-custom-date-trigger`) to open custom date picker',
    'Use "<" (`#btn-calendar-prev`) and ">" (`#btn-calendar-next`) buttons to navigate months and select a day'
  ],
  'section-29': [
    'Locate `#resizable-box` element',
    'Drag the bottom-right handle to resize the box',
    'Verify that dimension statistics (`#resizable-stats`) update to reflect new width x height'
  ],
  'section-30': [
    'Identify table rows inside complex DOM hierarchy using XPath axes',
    'Click "Action" button (`.btn-complex-action`) for a specific row and verify status output'
  ],
  'section-31': [
    'Type text (e.g., "Play") into autocomplete input (`#autocomplete-input`)',
    'Wait for suggestion list (`#autocomplete-list`) to open',
    'Click a suggestion (e.g., "Playwright") and verify status'
  ],
  'section-32': [
    'Perform a right-click on "Right-click inside this container" area (`#context-target`)',
    'Click an option ("Copy Selection", "Edit Item", or "Delete Record") from the context menu'
  ],
  'section-33': [
    'Click "Copy" button (`#btn-copy-clipboard`)',
    'Verify status changes to "✓ Copied to clipboard!" and clipboard contains "Playwright Automation Masterclass 2026"'
  ],
  'section-34': [
    'Fill Step 1 inputs ("First Name", "Last Name") and click "Next"',
    'Fill Step 2 inputs ("Username", "Role") and click "Next"',
    'Verify details summary on Step 3 and click "Submit"'
  ],
  'section-35': [
    'Select or type a color code in color input (`#color-input`)',
    'Click "Apply Color" button (`#btn-apply-color`) and verify status and preview box background'
  ],
  'section-36': [
    'Switch context to Outer Frame (`#outer-iframe`)',
    'Switch context to Inner Frame (`#inner-iframe`)',
    'Fill text into input (`#nested-input`), click "Submit" button (`#nested-btn`), and verify status text'
  ],
  'section-37': [
    'Click "▶ Expand" button (`.nested-expand-btn`) on an order row (e.g., `#ORD-001`)',
    'Verify that the nested inner details table opens with line item breakdown'
  ],
  'section-38': [
    'Click "Change Title" button (`#btn-change-title`) and verify document title changes to "Title Changed - Automation Playground"',
    'Click "Simulate Refresh" button (`#btn-simulate-refresh`) and test page reload handling',
    'Click "Open New Page" button (`#btn-open-newpage`) to open and handle a new child window'
  ],
  'section-39': [
    'Scrape all 100 links inside `#links-grid` container',
    'Verify total link count is 100 and assert target href attributes (`#bulk-link-1` to `#bulk-link-100`)'
  ],
  'section-40': [
    'Scroll down the infinite scroll box (`#inf-scroll-container`) to load new items',
    'Verify items list (`#inf-scroll-list`) grows and status updates loaded item count'
  ],
  'section-41': [
    'Type search query into `#debounce-search-input`',
    'Wait 500ms for debounce timer to resolve and verify search results (`#debounce-search-results`)'
  ],
  'section-42': [
    'Type text into `#api-sim-input`',
    'Verify simulated network log (`#api-log-list`) appends an API request log for every character typed'
  ]
};

document.querySelectorAll('.challenge-card').forEach((card) => {
  const sectionId = card.getAttribute('id');
  const desc = card.querySelector('.card-desc');
  if (sectionId && desc && challengeSteps[sectionId]) {
    const steps = challengeSteps[sectionId];
    
    // Create checklist element
    const container = document.createElement('div');
    container.className = 'challenge-instructions';
    container.setAttribute('data-testid', `instructions-${sectionId}`);
    
    const title = document.createElement('div');
    title.className = 'challenge-instructions-title';
    title.innerHTML = '🎯 Automation Checklist';
    container.appendChild(title);
    
    const list = document.createElement('ul');
    list.className = 'challenge-instructions-list';
    
    steps.forEach((step) => {
      const li = document.createElement('li');
      li.textContent = step;
      list.appendChild(li);
    });
    
    container.appendChild(list);
    
    // Insert after description paragraph
    desc.parentNode?.insertBefore(container, desc.nextSibling);
  }
});


