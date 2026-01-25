// Job Application Tracker - Pure JavaScript with localStorage

const STORAGE_KEY = 'jobApplications';
const STATUSES = ['Applied', 'Responded', 'Ghosted', 'Interview', 'Offer', 'Rejected'];

// DOM Elements
const elements = {
    modal: document.getElementById('modal'),
    deleteModal: document.getElementById('deleteModal'),
    form: document.getElementById('applicationForm'),
    applicationsBody: document.getElementById('applicationsBody'),
    applicationsTable: document.getElementById('applicationsTable'),
    emptyState: document.getElementById('emptyState'),
    modalTitle: document.getElementById('modalTitle'),
    deleteCompany: document.getElementById('deleteCompany'),
    // Form fields
    appId: document.getElementById('appId'),
    company: document.getElementById('company'),
    role: document.getElementById('role'),
    applicationDate: document.getElementById('applicationDate'),
    jobPostDate: document.getElementById('jobPostDate'),
    jobUrl: document.getElementById('jobUrl'),
    status: document.getElementById('status'),
    notes: document.getElementById('notes'),
    // Stats
    statTotal: document.getElementById('statTotal'),
    statRate: document.getElementById('statRate'),
    statWeek: document.getElementById('statWeek'),
    statInterview: document.getElementById('statInterview')
};

let applications = [];
let currentFilter = 'all';
let deleteTargetId = null;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadApplications();
    render();
    bindEvents();
    setDefaultDate();
});

// Data Management
function loadApplications() {
    const stored = localStorage.getItem(STORAGE_KEY);
    applications = stored ? JSON.parse(stored) : [];
}

function saveApplications() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(applications));
}

function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Event Binding
function bindEvents() {
    // Open modal buttons
    document.getElementById('addBtn').addEventListener('click', () => openModal());
    document.getElementById('emptyAddBtn').addEventListener('click', () => openModal());

    // Close modal buttons
    document.getElementById('modalClose').addEventListener('click', closeModal);
    document.getElementById('cancelBtn').addEventListener('click', closeModal);
    elements.modal.addEventListener('click', (e) => {
        if (e.target === elements.modal) closeModal();
    });

    // Delete modal
    document.getElementById('deleteModalClose').addEventListener('click', closeDeleteModal);
    document.getElementById('deleteCancelBtn').addEventListener('click', closeDeleteModal);
    document.getElementById('deleteConfirmBtn').addEventListener('click', confirmDelete);
    elements.deleteModal.addEventListener('click', (e) => {
        if (e.target === elements.deleteModal) closeDeleteModal();
    });

    // Form submission
    elements.form.addEventListener('submit', handleSubmit);

    // Filter chips
    document.querySelectorAll('.filter-chip').forEach(chip => {
        chip.addEventListener('click', () => {
            document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            currentFilter = chip.dataset.status;
            render();
        });
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
            closeDeleteModal();
        }
    });
}

// Modal Management
function openModal(app = null) {
    elements.modalTitle.textContent = app ? 'Edit Application' : 'Add Application';
    elements.form.reset();

    if (app) {
        elements.appId.value = app.id;
        elements.company.value = app.company;
        elements.role.value = app.role;
        elements.applicationDate.value = app.applicationDate;
        elements.jobPostDate.value = app.jobPostDate || '';
        elements.jobUrl.value = app.jobUrl || '';
        elements.status.value = app.status;
        elements.notes.value = app.notes || '';
    } else {
        elements.appId.value = '';
        setDefaultDate();
    }

    elements.modal.classList.add('active');
    elements.company.focus();
}

function closeModal() {
    elements.modal.classList.remove('active');
}

function openDeleteModal(app) {
    deleteTargetId = app.id;
    elements.deleteCompany.textContent = app.company;
    elements.deleteModal.classList.add('active');
}

function closeDeleteModal() {
    elements.deleteModal.classList.remove('active');
    deleteTargetId = null;
}

function confirmDelete() {
    if (deleteTargetId) {
        applications = applications.filter(a => a.id !== deleteTargetId);
        saveApplications();
        render();
    }
    closeDeleteModal();
}

// Form Handling
function handleSubmit(e) {
    e.preventDefault();

    const appData = {
        id: elements.appId.value || generateId(),
        company: elements.company.value.trim(),
        role: elements.role.value.trim(),
        applicationDate: elements.applicationDate.value,
        jobPostDate: elements.jobPostDate.value || null,
        jobUrl: elements.jobUrl.value.trim() || null,
        status: elements.status.value,
        notes: elements.notes.value.trim() || null,
        updatedAt: new Date().toISOString()
    };

    const existingIndex = applications.findIndex(a => a.id === appData.id);
    if (existingIndex >= 0) {
        applications[existingIndex] = appData;
    } else {
        appData.createdAt = new Date().toISOString();
        applications.unshift(appData);
    }

    saveApplications();
    closeModal();
    render();
}

function setDefaultDate() {
    const today = new Date().toISOString().split('T')[0];
    elements.applicationDate.value = today;
}

// Status Update (inline)
function updateStatus(id, newStatus) {
    const app = applications.find(a => a.id === id);
    if (app) {
        app.status = newStatus;
        app.updatedAt = new Date().toISOString();
        saveApplications();
        updateStats();
    }
}

// Rendering
function render() {
    renderTable();
    updateStats();
}

function renderTable() {
    const filtered = currentFilter === 'all'
        ? applications
        : applications.filter(a => a.status === currentFilter);

    // Sort by application date (newest first)
    filtered.sort((a, b) => new Date(b.applicationDate) - new Date(a.applicationDate));

    if (applications.length === 0) {
        elements.applicationsTable.classList.add('hidden');
        elements.emptyState.classList.remove('hidden');
        return;
    }

    elements.applicationsTable.classList.remove('hidden');
    elements.emptyState.classList.add('hidden');

    if (filtered.length === 0) {
        elements.applicationsBody.innerHTML = `
            <tr>
                <td colspan="5" style="text-align: center; padding: 3rem; color: var(--text-muted);">
                    No applications with status "${currentFilter}"
                </td>
            </tr>
        `;
        return;
    }

    elements.applicationsBody.innerHTML = filtered.map(app => `
        <tr data-id="${app.id}">
            <td>
                <span class="company-name">${escapeHtml(app.company)}</span>
                ${app.jobUrl ? `<a href="${escapeHtml(app.jobUrl)}" target="_blank" rel="noopener" class="company-link" title="View job posting">&#x1F517;</a>` : ''}
                ${app.notes ? `<span class="notes-indicator" data-notes="${escapeHtml(app.notes)}">&#x1F4DD;</span>` : ''}
            </td>
            <td class="role-name">${escapeHtml(app.role)}</td>
            <td class="date-cell">${formatDate(app.applicationDate)}</td>
            <td>
                <select class="status-select" data-status="${app.status}" onchange="updateStatus('${app.id}', this.value); this.dataset.status = this.value; this.classList.add('status-updated'); setTimeout(() => this.classList.remove('status-updated'), 200);">
                    ${STATUSES.map(s => `<option value="${s}" ${s === app.status ? 'selected' : ''}>${s}</option>`).join('')}
                </select>
            </td>
            <td class="actions-cell">
                <button class="btn btn-secondary btn-small" onclick="editApplication('${app.id}')">Edit</button>
                <button class="btn btn-danger btn-small" onclick="deleteApplication('${app.id}')">Delete</button>
            </td>
        </tr>
    `).join('');
}

function updateStats() {
    const total = applications.length;

    // Response rate: (Responded + Interview + Offer + Rejected) / Total
    const responded = applications.filter(a =>
        ['Responded', 'Interview', 'Offer', 'Rejected'].includes(a.status)
    ).length;
    const rate = total > 0 ? Math.round((responded / total) * 100) : 0;

    // Applications this week
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const thisWeek = applications.filter(a =>
        new Date(a.applicationDate) >= oneWeekAgo
    ).length;

    // Interview count
    const interviews = applications.filter(a =>
        ['Interview', 'Offer'].includes(a.status)
    ).length;

    elements.statTotal.textContent = total;
    elements.statRate.textContent = rate + '%';
    elements.statWeek.textContent = thisWeek;
    elements.statInterview.textContent = interviews;
}

// Helper Functions
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
}

// Global functions for inline handlers
window.editApplication = function(id) {
    const app = applications.find(a => a.id === id);
    if (app) openModal(app);
};

window.deleteApplication = function(id) {
    const app = applications.find(a => a.id === id);
    if (app) openDeleteModal(app);
};

window.updateStatus = updateStatus;
