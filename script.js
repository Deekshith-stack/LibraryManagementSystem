const books = [
  { id: 'book-1', title: 'Clean Code', author: 'Robert C. Martin', isbn: '978-0132350884', category: 'Software Engineering', price: 49.99, copiesAvailable: 3, totalCopies: 4, location: 'Shelf A-3' },
  { id: 'book-2', title: 'Design Patterns', author: 'Erich Gamma, Richard Helm', isbn: '978-0201633610', category: 'Computer Science', price: 54.95, copiesAvailable: 1, totalCopies: 2, location: 'Shelf B-1' },
  { id: 'book-3', title: 'Introduction to Algorithms', author: 'Thomas H. Cormen', isbn: '978-0262033848', category: 'Computer Science', price: 89.99, copiesAvailable: 2, totalCopies: 2, location: 'Shelf B-4' },
  { id: 'book-4', title: 'The Pragmatic Programmer', author: 'David Thomas, Andrew Hunt', isbn: '978-0135957059', category: 'Software Engineering', price: 42.5, copiesAvailable: 5, totalCopies: 5, location: 'Shelf A-1' },
  { id: 'book-5', title: "You Don't Know JS Yet", author: 'Kyle Simpson', isbn: '978-1933988696', category: 'JavaScript', price: 29.99, copiesAvailable: 0, totalCopies: 2, location: 'Shelf C-2' },
  { id: 'book-6', title: 'Artificial Intelligence: A Modern Approach', author: 'Stuart Russell, Peter Norvig', isbn: '978-0136042594', category: 'Artificial Intelligence', price: 119.99, copiesAvailable: 1, totalCopies: 1, location: 'Shelf D-1' },
  { id: 'book-7', title: 'Atomic Habits', author: 'James Clear', isbn: '978-0735211292', category: 'Self-Help', price: 16.2, copiesAvailable: 4, totalCopies: 4, location: 'Shelf E-2' },
  { id: 'book-8', title: 'Zero to One', author: 'Peter Thiel', isbn: '978-0804139298', category: 'Business', price: 21, copiesAvailable: 3, totalCopies: 3, location: 'Shelf E-5' }
];

const users = [
  { id: 'user-student-1', name: 'Alex Mercer', email: 'alex.mercer@library.edu', role: 'student', status: 'active', enrollmentId: 'STU-2026-001' },
  { id: 'user-student-2', name: 'Emma Watson', email: 'emma.watson@library.edu', role: 'student', status: 'active', enrollmentId: 'STU-2026-002' },
  { id: 'user-student-3', name: 'Bruce Wayne', email: 'bruce.wayne@library.edu', role: 'student', status: 'suspended', enrollmentId: 'STU-2026-003' },
  { id: 'user-lib-1', name: 'Sarah Connor', email: 'sarah.connor@library.gov', role: 'librarian', status: 'active', employeeId: 'LIB-2026-101' },
  { id: 'user-admin-1', name: 'Tony Stark', email: 'tony.stark@stark.com', role: 'admin', status: 'active', employeeId: 'ADM-2026-501' }
];

const transactions = [
  { id: 'tx-1', bookTitle: 'Clean Code', studentName: 'Alex Mercer', issueDate: '2026-08-12', dueDate: '2026-08-26', returnDate: '2026-08-26', fineAmount: 0, status: 'returned' },
  { id: 'tx-2', bookTitle: "You Don't Know JS Yet", studentName: 'Alex Mercer', issueDate: '2026-08-07', dueDate: '2026-08-21', returnDate: null, fineAmount: 16.5, status: 'overdue' },
  { id: 'tx-3', bookTitle: 'Design Patterns', studentName: 'Emma Watson', issueDate: '2026-08-27', dueDate: '2026-09-10', returnDate: null, fineAmount: 0, status: 'issued' },
  { id: 'tx-4', bookTitle: "You Don't Know JS Yet", studentName: 'Bruce Wayne', issueDate: '2026-08-02', dueDate: '2026-08-16', returnDate: null, fineAmount: 24, status: 'overdue' }
];

const reservations = [
  { id: 'res-1', bookTitle: 'Artificial Intelligence: A Modern Approach', studentName: 'Alex Mercer', requestDate: '2026-08-30', status: 'pending' },
  { id: 'res-2', bookTitle: 'Introduction to Algorithms', studentName: 'Emma Watson', requestDate: '2026-08-31', status: 'approved' }
];

const settings = {
  fineRatePerDay: 1.5,
  maxBooksAllowed: 4,
  borrowPeriodDays: 14
};

const notifications = [
  { id: 'notif-1', text: 'System initialized with library seed catalog.', timestamp: '09:00 AM', read: false, role: 'admin' },
  { id: 'notif-2', text: 'New book reservation hold requested by Alex Mercer.', timestamp: '10:10 AM', read: false, role: 'librarian' },
  { id: 'notif-3', text: 'Your outstanding fine has been updated.', timestamp: '11:00 AM', read: false, role: 'student' }
];

const sessions = {
  'user-student-1': { login: '09:00:00 AM', logout: '05:00:00 PM' },
  'user-student-2': { login: '09:15:00 AM', logout: '05:30:00 PM' },
  'user-student-3': { login: '10:05:00 AM', logout: '04:45:00 PM' },
  'user-lib-1': { login: '08:30:00 AM', logout: '05:00:00 PM' },
  'user-admin-1': { login: '08:00:00 AM', logout: '06:00:00 PM' }
};

const tabsByRole = {
  student: [
    { id: 'student-dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'student-catalog', label: 'Library Catalog', icon: '📚' },
    { id: 'student-fines', label: 'Fines & Payments', icon: '💰' }
  ],
  librarian: [
    { id: 'lib-catalog', label: 'Book Catalog', icon: '🗂️' },
    { id: 'lib-issue-return', label: 'Issue & Return', icon: '🔄' },
    { id: 'lib-reservations', label: 'Reservations', icon: '📌' }
  ],
  admin: [
    { id: 'admin-dashboard', label: 'System Analytics', icon: '📈' },
    { id: 'admin-users', label: 'User Directory', icon: '👥' },
    { id: 'admin-settings', label: 'Library Settings', icon: '⚙️' }
  ]
};

const state = {
  currentRole: 'student',
  currentUserId: 'user-student-1',
  activeTab: 'student-dashboard',
  searchTerm: '',
  notificationsOpen: false
};

function getCurrentUser() {
  return users.find((user) => user.id === state.currentUserId) || users[0];
}

function getUsersForRole(role) {
  return users.filter((user) => user.role === role);
}

function ensureValidTab() {
  const tabs = tabsByRole[state.currentRole] || [];
  const tabExists = tabs.some((tab) => tab.id === state.activeTab);
  if (!tabExists && tabs.length) {
    state.activeTab = tabs[0].id;
  }
}

function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value || 0);
}

function getStatusClass(status) {
  if (status === 'available' || status === 'approved' || status === 'returned') return 'green';
  if (status === 'low' || status === 'issued' || status === 'pending') return 'orange';
  return 'red';
}

function renderSidebar() {
  const user = getCurrentUser();
  const menu = document.getElementById('sidebar-menu');
  const userCard = document.getElementById('user-card');

  menu.innerHTML = tabsByRole[user.role].map((tab) => `
    <li>
      <a class="sidebar-link ${state.activeTab === tab.id ? 'active' : ''}" data-tab="${tab.id}">
        <span>${tab.icon}</span>
        <span>${tab.label}</span>
      </a>
    </li>
  `).join('');

  menu.querySelectorAll('[data-tab]').forEach((link) => {
    link.addEventListener('click', () => {
      state.activeTab = link.dataset.tab;
      renderApp();
    });
  });

  const initials = user.name.split(' ').map((part) => part[0]).join('').slice(0, 2);
  userCard.innerHTML = `
    <div class="sidebar-user">
      <div class="sidebar-avatar">${initials}</div>
      <div>
        <div class="sidebar-user-name" title="${user.name}">${user.name}</div>
        <span class="sidebar-user-role">${user.role === 'admin' ? 'System Administrator' : user.role}</span>
      </div>
    </div>
  `;
}

function renderNavbar() {
  const user = getCurrentUser();
  const roleSelect = document.getElementById('role-select');
  const userSelect = document.getElementById('user-select');
  const searchInput = document.getElementById('search-input');
  const notificationButton = document.getElementById('notification-button');
  const notificationCount = document.getElementById('notification-count');
  const notifDropdown = document.getElementById('notif-dropdown');

  roleSelect.innerHTML = ['student', 'librarian', 'admin'].map((role) => `
    <option value="${role}" ${user.role === role ? 'selected' : ''}>${role === 'admin' ? 'System Admin' : role.charAt(0).toUpperCase() + role.slice(1)}</option>
  `).join('');

  const usersForRole = getUsersForRole(user.role);
  userSelect.innerHTML = usersForRole.map((item) => `
    <option value="${item.id}" ${state.currentUserId === item.id ? 'selected' : ''}>${item.name}${item.status === 'suspended' ? ' (Suspended)' : ''}</option>
  `).join('');

  searchInput.value = state.searchTerm;

  const roleNotifications = notifications.filter((n) => n.role === user.role);
  const unreadCount = roleNotifications.filter((n) => !n.read).length;
  notificationCount.textContent = unreadCount > 0 ? unreadCount : '';
  notificationButton.style.display = 'inline-flex';

  if (state.notificationsOpen) {
    notifDropdown.innerHTML = `
      <div class="notif-header">
        <span>Notifications (${roleNotifications.length})</span>
        ${roleNotifications.length ? '<button class="notif-clear" data-clear="notifications">Clear All</button>' : ''}
      </div>
      <div class="notif-list">
        ${roleNotifications.length ? roleNotifications.map((n) => `
          <div class="notif-item ${n.read ? '' : 'unread'}" data-notif-id="${n.id}">
            <span class="notif-item-text">${n.text}</span>
            <span class="notif-item-time">${n.timestamp}</span>
          </div>
        `).join('') : '<p class="muted">No notifications for this role.</p>'}
      </div>
    `;
    notifDropdown.style.display = 'block';
  } else {
    notifDropdown.style.display = 'none';
  }

  notifDropdown.querySelectorAll('[data-notif-id]').forEach((item) => {
    item.addEventListener('click', () => {
      const id = item.dataset.notifId;
      const target = notifications.find((n) => n.id === id);
      if (target) target.read = true;
      renderApp();
    });
  });

  const clearButton = notifDropdown.querySelector('[data-clear="notifications"]');
  if (clearButton) {
    clearButton.addEventListener('click', (event) => {
      event.stopPropagation();
      notifications.splice(0, notifications.length, ...notifications.filter((n) => n.role !== user.role));
      state.notificationsOpen = false;
      renderApp();
    });
  }

  roleSelect.onchange = (event) => {
    const role = event.target.value;
    const newUser = users.find((u) => u.role === role);
    if (newUser) {
      state.currentRole = role;
      state.currentUserId = newUser.id;
      state.activeTab = tabsByRole[role][0].id;
      state.notificationsOpen = false;
      renderApp();
    }
  };

  userSelect.onchange = (event) => {
    const selectedId = event.target.value;
    const selectedUser = users.find((u) => u.id === selectedId);
    if (selectedUser) {
      state.currentUserId = selectedId;
      state.currentRole = selectedUser.role;
      state.notificationsOpen = false;
      renderApp();
    }
  };

  searchInput.oninput = (event) => {
    state.searchTerm = event.target.value;
    renderApp();
  };

  notificationButton.onclick = () => {
    state.notificationsOpen = !state.notificationsOpen;
    renderApp();
  };
}

function getVisibleBooks() {
  const term = state.searchTerm.trim().toLowerCase();
  if (!term) return books;
  return books.filter((book) => [book.title, book.author, book.category, book.location].some((value) => String(value).toLowerCase().includes(term)));
}

function renderStudentDashboard() {
  const currentUser = getCurrentUser();
  const userTransactions = transactions.filter((tx) => tx.studentName === currentUser.name);
  const overdue = userTransactions.filter((tx) => tx.status === 'overdue').length;
  const totalFine = userTransactions.reduce((sum, tx) => sum + Number(tx.fineAmount || 0), 0);

  const stats = [
    { label: 'Books Issued', value: userTransactions.length, meta: 'Current period' },
    { label: 'Overdue', value: overdue, meta: `${overdue} alerts` },
    { label: 'Fine Due', value: formatCurrency(totalFine), meta: 'As of now' },
    { label: 'Saved Books', value: books.filter((b) => b.copiesAvailable > 1).length, meta: 'Available' }
  ];

  return `
    <div class="page-shell">
      <div class="section-header">
        <h2>Student Dashboard</h2>
        <span class="chip">Welcome ${currentUser.name}</span>
      </div>

      <div class="stats-grid">
        ${stats.map((stat) => `
          <div class="stat-card glass-card">
            <div class="label">${stat.label}</div>
            <div class="value">${stat.value}</div>
            <div class="meta">${stat.meta}</div>
          </div>
        `).join('')}
      </div>

      <div class="card-grid">
        <div class="glass-card">
          <div class="section-header">
            <h3>Recommended Reads</h3>
          </div>
          ${getVisibleBooks().slice(0, 3).map((book) => `
            <div class="book-card" style="margin-bottom:1rem;">
              <div class="book-top">
                <div>
                  <div class="book-badge">${book.category}</div>
                  <h3>${book.title}</h3>
                </div>
                <span class="status-pill ${book.copiesAvailable > 0 ? 'available' : 'unavailable'}">${book.copiesAvailable > 0 ? 'Available' : 'Out of stock'}</span>
              </div>
              <div class="book-meta">By ${book.author}<br>Location: ${book.location}</div>
              <div class="book-footer">
                <span class="price">${formatCurrency(book.price)}</span>
                <span class="muted">${book.copiesAvailable}/${book.totalCopies} copies</span>
              </div>
            </div>
          `).join('')}
        </div>

        <div class="glass-card">
          <div class="section-header">
            <h3>Recent Activity</h3>
          </div>
          <div class="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                ${userTransactions.slice(0, 5).map((tx) => `
                  <tr>
                    <td>${tx.bookTitle}</td>
                    <td><span class="tag ${getStatusClass(tx.status)}">${tx.status}</span></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderStudentCatalog() {
  const visibleBooks = getVisibleBooks();

  return `
    <div class="page-shell">
      <div class="section-header">
        <h2>Library Catalog</h2>
        <span class="chip">${visibleBooks.length} titles</span>
      </div>
      <div class="card-grid">
        ${visibleBooks.map((book) => `
          <div class="glass-card book-card">
            <div class="book-top">
              <div class="book-badge">${book.category}</div>
              <span class="status-pill ${book.copiesAvailable > 0 ? (book.copiesAvailable <= 2 ? 'low' : 'available') : 'unavailable'}">
                ${book.copiesAvailable > 0 ? (book.copiesAvailable <= 2 ? 'Low stock' : 'Available') : 'Unavailable'}
              </span>
            </div>
            <div>
              <h3>${book.title}</h3>
              <div class="book-meta">By ${book.author}<br>ISBN: ${book.isbn}<br>Location: ${book.location}</div>
            </div>
            <div class="book-footer">
              <span class="price">${formatCurrency(book.price)}</span>
              <span class="muted">${book.copiesAvailable}/${book.totalCopies} left</span>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function renderStudentFines() {
  const currentUser = getCurrentUser();
  const userTransactions = transactions.filter((tx) => tx.studentName === currentUser.name);

  return `
    <div class="page-shell">
      <div class="section-header">
        <h2>Fines & Payments</h2>
        <span class="chip">${formatCurrency(userTransactions.reduce((sum, tx) => sum + Number(tx.fineAmount || 0), 0))}</span>
      </div>
      <div class="glass-card">
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Book</th>
                <th>Issue Date</th>
                <th>Due Date</th>
                <th>Status</th>
                <th>Fine</th>
              </tr>
            </thead>
            <tbody>
              ${userTransactions.map((tx) => `
                <tr>
                  <td>${tx.bookTitle}</td>
                  <td>${tx.issueDate}</td>
                  <td>${tx.dueDate}</td>
                  <td><span class="tag ${getStatusClass(tx.status)}">${tx.status}</span></td>
                  <td>${formatCurrency(tx.fineAmount)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

function renderLibrarianCatalog() {
  return `
    <div class="page-shell">
      <div class="section-header">
        <h2>Book Catalog</h2>
        <span class="chip">${books.length} books</span>
      </div>
      <div class="glass-card">
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Category</th>
                <th>Available</th>
                <th>Location</th>
              </tr>
            </thead>
            <tbody>
              ${books.map((book) => `
                <tr>
                  <td>${book.title}</td>
                  <td>${book.author}</td>
                  <td>${book.category}</td>
                  <td>${book.copiesAvailable}/${book.totalCopies}</td>
                  <td>${book.location}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

function renderIssueReturn() {
  return `
    <div class="page-shell">
      <div class="section-header">
        <h2>Issue & Return</h2>
        <span class="chip">${transactions.length} records</span>
      </div>
      <div class="glass-card">
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Student</th>
                <th>Book</th>
                <th>Due Date</th>
                <th>Status</th>
                <th>Fine</th>
              </tr>
            </thead>
            <tbody>
              ${transactions.map((tx) => `
                <tr>
                  <td>${tx.studentName}</td>
                  <td>${tx.bookTitle}</td>
                  <td>${tx.dueDate}</td>
                  <td><span class="tag ${getStatusClass(tx.status)}">${tx.status}</span></td>
                  <td>${formatCurrency(tx.fineAmount)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

function renderReservations() {
  return `
    <div class="page-shell">
      <div class="section-header">
        <h2>Reservations</h2>
        <span class="chip">${reservations.length} requests</span>
      </div>
      <div class="glass-card">
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Student</th>
                <th>Book</th>
                <th>Request Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${reservations.map((entry) => `
                <tr>
                  <td>${entry.studentName}</td>
                  <td>${entry.bookTitle}</td>
                  <td>${entry.requestDate}</td>
                  <td><span class="tag ${getStatusClass(entry.status)}">${entry.status}</span></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

function renderAdminDashboard() {
  const totalStudents = users.filter((u) => u.role === 'student').length;
  const activeStudents = users.filter((u) => u.role === 'student' && u.status === 'active').length;
  const totalFines = transactions.reduce((sum, tx) => sum + Number(tx.fineAmount || 0), 0);

  const stats = [
    { label: 'Students', value: totalStudents, meta: `${activeStudents} active` },
    { label: 'Books', value: books.length, meta: `${books.filter((b) => b.copiesAvailable > 0).length} available` },
    { label: 'Fines Collected', value: formatCurrency(totalFines), meta: 'Current ledger' },
    { label: 'Reservations', value: reservations.length, meta: 'Pending & approved' }
  ];

  return `
    <div class="page-shell">
      <div class="section-header">
        <h2>System Analytics</h2>
        <span class="chip">Admin view</span>
      </div>

      <div class="stats-grid">
        ${stats.map((stat) => `
          <div class="stat-card glass-card">
            <div class="label">${stat.label}</div>
            <div class="value">${stat.value}</div>
            <div class="meta">${stat.meta}</div>
          </div>
        `).join('')}
      </div>

      <div class="glass-card">
        <div class="section-header">
          <h3>Recent Activity Log</h3>
        </div>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Time</th>
                <th>Action</th>
                <th>Type</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>09:00 AM</td><td>Library system initialized</td><td><span class="tag blue">info</span></td></tr>
              <tr><td>09:15 AM</td><td>Fine rate set to $1.50/day</td><td><span class="tag green">settings</span></td></tr>
              <tr><td>10:20 AM</td><td>Student account suspended</td><td><span class="tag red">security</span></td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

function renderUserManagement() {
  return `
    <div class="page-shell">
      <div class="section-header">
        <h2>User Directory</h2>
        <span class="chip">${users.length} users</span>
      </div>
      <div class="glass-card">
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Role</th>
                <th>Email</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${users.map((user) => `
                <tr>
                  <td>${user.name}</td>
                  <td>${user.role}</td>
                  <td>${user.email}</td>
                  <td><span class="tag ${user.status === 'active' ? 'green' : 'red'}">${user.status}</span></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `;
}

function renderLibrarySettings() {
  return `
    <div class="page-shell">
      <div class="section-header">
        <h2>Library Settings</h2>
        <span class="chip">Manage rules</span>
      </div>
      <div class="glass-card">
        <div class="form-grid">
          <div class="field">
            <label>Fine Rate / Day</label>
            <input type="number" value="${settings.fineRatePerDay}" />
          </div>
          <div class="field">
            <label>Max Books Allowed</label>
            <input type="number" value="${settings.maxBooksAllowed}" />
          </div>
          <div class="field">
            <label>Borrow Period (Days)</label>
            <input type="number" value="${settings.borrowPeriodDays}" />
          </div>
        </div>
        <div class="actions" style="margin-top:1rem;">
          <button class="btn primary">Save Settings</button>
          <button class="btn secondary">Reset</button>
        </div>
      </div>
    </div>
  `;
}

function renderPageContent() {
  const content = document.getElementById('page-content');
  switch (state.activeTab) {
    case 'student-dashboard':
      content.innerHTML = renderStudentDashboard();
      break;
    case 'student-catalog':
      content.innerHTML = renderStudentCatalog();
      break;
    case 'student-fines':
      content.innerHTML = renderStudentFines();
      break;
    case 'lib-catalog':
      content.innerHTML = renderLibrarianCatalog();
      break;
    case 'lib-issue-return':
      content.innerHTML = renderIssueReturn();
      break;
    case 'lib-reservations':
      content.innerHTML = renderReservations();
      break;
    case 'admin-dashboard':
      content.innerHTML = renderAdminDashboard();
      break;
    case 'admin-users':
      content.innerHTML = renderUserManagement();
      break;
    case 'admin-settings':
      content.innerHTML = renderLibrarySettings();
      break;
    default:
      content.innerHTML = '<div class="glass-card empty-state"><h3>Loading LMS Interface...</h3></div>';
      break;
  }
}

function renderApp() {
  ensureValidTab();
  renderSidebar();
  renderNavbar();
  renderPageContent();
}

document.addEventListener('DOMContentLoaded', () => {
  renderApp();
});
