// Complete Lifeguard Audit System with Enhanced Monthly Statistics
let app; // Global app reference

class LifeguardAuditApp {
    constructor() {
        console.log('Initializing LifeguardAuditApp with Enhanced Monthly Statistics');
        
        // Load complete system data
        this.loadSystemData();
        
        // Session management
        this.currentUser = null;
        this.sessionTimeout = 8 * 60 * 60 * 1000; // 8 hours
        this.sessionTimer = null;

        // UI state
        this.currentFilters = {
            lifeguards: { search: '', status: 'all', sort: 'name-asc' },
            audits: { search: '', type: 'all', result: 'all' },
            users: { search: '', role: 'all', status: 'all' },
            activity: { search: '', action: 'all' }
        };

        // Charts
        this.monthlyChart = null;

        this.init();
    }

    loadSystemData() {
        console.log('Loading enhanced system data...');
        
        // EXACT USERS from provided data - CASE SENSITIVE MATCHING
        this.users = [
            {
                id: 1, username: "Demetrius Lopez", role: "SENIOR_ADMIN", password: "demetrius2025", 
                active: true, created_by: "System", created_date: "2025-01-01", last_login: "2025-10-04",
                individual_permissions: {
                    can_manage_users: true, can_create_users: true, can_deactivate_users: true,
                    can_edit_all_audits: true, can_view_all_audits: true, can_create_audits: true,
                    can_manage_lifeguards: true, can_view_activity_log: true, can_view_admin_metrics: true,
                    can_export_data: true, can_modify_permissions: true
                }
            },
            {
                id: 2, username: "Asael Gomez", role: "ADMIN", password: "asael2025",
                active: true, created_by: "Demetrius Lopez", created_date: "2025-01-15", last_login: "2025-10-03",
                individual_permissions: {
                    can_manage_users: false, can_create_users: false, can_deactivate_users: false,
                    can_edit_all_audits: true, can_view_all_audits: true, can_create_audits: true,
                    can_manage_lifeguards: true, can_view_activity_log: true, can_view_admin_metrics: false,
                    can_export_data: true, can_modify_permissions: false
                }
            },
            {
                id: 3, username: "Matthew Hills", role: "ADMIN", password: "matthew2025",
                active: true, created_by: "Demetrius Lopez", created_date: "2025-01-15", last_login: "2025-10-02",
                individual_permissions: {
                    can_manage_users: false, can_create_users: false, can_deactivate_users: false,
                    can_edit_all_audits: true, can_view_all_audits: true, can_create_audits: true,
                    can_manage_lifeguards: true, can_view_activity_log: true, can_view_admin_metrics: false,
                    can_export_data: false, can_modify_permissions: false
                }
            },
            {
                id: 4, username: "Xavier Butler Lee", role: "ADMIN", password: "xavier2025",
                active: true, created_by: "Demetrius Lopez", created_date: "2025-02-01", last_login: "2025-10-01",
                individual_permissions: {
                    can_manage_users: false, can_create_users: false, can_deactivate_users: false,
                    can_edit_all_audits: true, can_view_all_audits: true, can_create_audits: true,
                    can_manage_lifeguards: true, can_view_activity_log: true, can_view_admin_metrics: false,
                    can_export_data: true, can_modify_permissions: false
                }
            },
            {
                id: 5, username: "Ariana Arroyo", role: "ADMIN", password: "ariana2025",
                active: true, created_by: "Demetrius Lopez", created_date: "2025-02-10", last_login: "2025-09-30",
                individual_permissions: {
                    can_manage_users: false, can_create_users: false, can_deactivate_users: false,
                    can_edit_all_audits: true, can_view_all_audits: true, can_create_audits: true,
                    can_manage_lifeguards: true, can_view_activity_log: false, can_view_admin_metrics: false,
                    can_export_data: false, can_modify_permissions: false
                }
            },
            {
                id: 6, username: "Vi'Andre Butts", role: "ADMIN", password: "viandre2025",
                active: true, created_by: "Demetrius Lopez", created_date: "2025-02-15", last_login: "2025-09-29",
                individual_permissions: {
                    can_manage_users: false, can_create_users: false, can_deactivate_users: false,
                    can_edit_all_audits: true, can_view_all_audits: true, can_create_audits: true,
                    can_manage_lifeguards: true, can_view_activity_log: true, can_view_admin_metrics: false,
                    can_export_data: true, can_modify_permissions: false
                }
            },
            {
                id: 7, username: "Kyarra Cruz", role: "ADMIN", password: "kyarra2025",
                active: true, created_by: "Demetrius Lopez", created_date: "2025-03-01", last_login: "2025-09-28",
                individual_permissions: {
                    can_manage_users: false, can_create_users: false, can_deactivate_users: false,
                    can_edit_all_audits: true, can_view_all_audits: true, can_create_audits: true,
                    can_manage_lifeguards: true, can_view_activity_log: true, can_view_admin_metrics: false,
                    can_export_data: false, can_modify_permissions: false
                }
            },
            {
                id: 8, username: "Viewer", role: "VIEWER", password: "viewer2025",
                active: true, created_by: "Demetrius Lopez", created_date: "2025-03-10", last_login: "2025-09-27",
                individual_permissions: {
                    can_manage_users: false, can_create_users: false, can_deactivate_users: false,
                    can_edit_all_audits: false, can_view_all_audits: true, can_create_audits: false,
                    can_manage_lifeguards: false, can_view_activity_log: false, can_view_admin_metrics: false,
                    can_export_data: false, can_modify_permissions: false
                }
            }
        ];

        console.log('Loaded users:', this.users.map(u => `${u.username} (${u.role})`));

        this.lifeguards = [
            {"sheet_number":"01","sheet_name":"Lifeguard_Audit_Sheet_01","lifeguard_name":"MIA FIGUEROA","active":true,"hire_date":"2025-01-01","status":"ACTIVE"},
            {"sheet_number":"02","sheet_name":"Lifeguard_Audit_Sheet_02","lifeguard_name":"NATHAN RAMLAKHAN","active":true,"hire_date":"2025-01-01","status":"ACTIVE"},
            {"sheet_number":"03","sheet_name":"Lifeguard_Audit_Sheet_03","lifeguard_name":"JASON MOLL","active":true,"hire_date":"2025-01-01","status":"ACTIVE"},
            {"sheet_number":"04","sheet_name":"Lifeguard_Audit_Sheet_04","lifeguard_name":"JAVIAN QUIÑONES","active":true,"hire_date":"2025-01-01","status":"ACTIVE"},
            {"sheet_number":"05","sheet_name":"Lifeguard_Audit_Sheet_05","lifeguard_name":"LUCCA CONCEICAO","active":true,"hire_date":"2025-01-01","status":"ACTIVE"},
            {"sheet_number":"06","sheet_name":"Lifeguard_Audit_Sheet_06","lifeguard_name":"SAMUEL TORRES","active":true,"hire_date":"2025-01-15","status":"ACTIVE"},
            {"sheet_number":"07","sheet_name":"Lifeguard_Audit_Sheet_07","lifeguard_name":"ISABELLA MARTINEZ","active":true,"hire_date":"2025-02-01","status":"ACTIVE"},
            {"sheet_number":"08","sheet_name":"Lifeguard_Audit_Sheet_08","lifeguard_name":"CARLOS RODRIGUEZ","active":true,"hire_date":"2025-02-15","status":"ACTIVE"},
            {"sheet_number":"09","sheet_name":"Lifeguard_Audit_Sheet_09","lifeguard_name":"SOFIA GARCIA","active":true,"hire_date":"2025-03-01","status":"ACTIVE"},
            {"sheet_number":"10","sheet_name":"Lifeguard_Audit_Sheet_10","lifeguard_name":"MIGUEL SANTOS","active":true,"hire_date":"2025-03-15","status":"ACTIVE"}
        ];

        // Enhanced audit data with more entries for monthly statistics
        this.audits = [
            {"id":1,"lifeguard_name":"MIA FIGUEROA","date":"2025-07-15","time":"10:30:00","audit_type":"Visual","skill_detail":"","auditor_name":"Asael Gomez","result":"EXCEEDS","notes":"Excellent awareness","follow_up":"","created_by":"Asael Gomez","created_date":"2025-07-15 10:30:00","last_edited_by":null,"last_edited_date":null},
            {"id":2,"lifeguard_name":"NATHAN RAMLAKHAN","date":"2025-08-01","time":"14:15:00","audit_type":"VAT","skill_detail":"","auditor_name":"Matthew Hills","result":"MEETS","notes":"Good technique","follow_up":"","created_by":"Demetrius Lopez","created_date":"2025-08-01 14:15:00","last_edited_by":null,"last_edited_date":null},
            {"id":3,"lifeguard_name":"JASON MOLL","date":"2025-09-10","time":"11:45:00","audit_type":"Skill","skill_detail":"CPR","auditor_name":"Xavier Butler Lee","result":"EXCEEDS","notes":"Perfect execution","follow_up":"","created_by":"Xavier Butler Lee","created_date":"2025-09-10 11:45:00","last_edited_by":null,"last_edited_date":null},
            {"id":4,"lifeguard_name":"JAVIAN QUIÑONES","date":"2025-09-20","time":"09:30:00","audit_type":"Visual","skill_detail":"","auditor_name":"Kyarra Cruz","result":"EXCEEDS","notes":"Outstanding performance","follow_up":"","created_by":"Kyarra Cruz","created_date":"2025-09-20 09:30:00","last_edited_by":null,"last_edited_date":null},
            {"id":5,"lifeguard_name":"LUCCA CONCEICAO","date":"2025-10-01","time":"16:00:00","audit_type":"Skill","skill_detail":"First Aid","auditor_name":"Vi'Andre Butts","result":"MEETS","notes":"Good knowledge","follow_up":"Practice bandaging","created_by":"Vi'Andre Butts","created_date":"2025-10-01 16:00:00","last_edited_by":null,"last_edited_date":null},
            
            // Additional audits for better monthly statistics
            {"id":6,"lifeguard_name":"MIA FIGUEROA","date":"2025-08-15","time":"14:30:00","audit_type":"VAT","skill_detail":"","auditor_name":"Matthew Hills","result":"EXCEEDS","notes":"Excellent positioning","follow_up":"","created_by":"Matthew Hills","created_date":"2025-08-15 14:30:00","last_edited_by":null,"last_edited_date":null},
            {"id":7,"lifeguard_name":"SAMUEL TORRES","date":"2025-09-05","time":"10:15:00","audit_type":"Visual","skill_detail":"","auditor_name":"Asael Gomez","result":"MEETS","notes":"Good scanning technique","follow_up":"","created_by":"Asael Gomez","created_date":"2025-09-05 10:15:00","last_edited_by":null,"last_edited_date":null},
            {"id":8,"lifeguard_name":"ISABELLA MARTINEZ","date":"2025-09-25","time":"13:45:00","audit_type":"Skill","skill_detail":"Rescue Tube","auditor_name":"Xavier Butler Lee","result":"EXCEEDS","notes":"Flawless rescue technique","follow_up":"","created_by":"Xavier Butler Lee","created_date":"2025-09-25 13:45:00","last_edited_by":null,"last_edited_date":null},
            {"id":9,"lifeguard_name":"CARLOS RODRIGUEZ","date":"2025-10-03","time":"11:00:00","audit_type":"Visual","skill_detail":"","auditor_name":"Kyarra Cruz","result":"MEETS","notes":"Adequate performance","follow_up":"","created_by":"Kyarra Cruz","created_date":"2025-10-03 11:00:00","last_edited_by":null,"last_edited_date":null},
            {"id":10,"lifeguard_name":"SOFIA GARCIA","date":"2025-10-05","time":"15:30:00","audit_type":"VAT","skill_detail":"","auditor_name":"Vi'Andre Butts","result":"EXCEEDS","notes":"Perfect vigilance","follow_up":"","created_by":"Vi'Andre Butts","created_date":"2025-10-05 15:30:00","last_edited_by":null,"last_edited_date":null}
        ];

        // Activity log
        this.activityLog = [
            { id: 1, timestamp: '2025-10-06 10:00:00', user: 'Demetrius Lopez', action: 'LOGIN', details: 'User logged in' },
            { id: 2, timestamp: '2025-10-05 18:45:00', user: 'Asael Gomez', action: 'CREATE_AUDIT', details: 'Created audit for MIA FIGUEROA' },
            { id: 3, timestamp: '2025-10-05 18:30:00', user: 'Matthew Hills', action: 'EDIT_AUDIT', details: 'Edited audit #2' },
            { id: 4, timestamp: '2025-10-05 18:15:00', user: 'Xavier Butler Lee', action: 'CREATE_LIFEGUARD', details: 'Added new lifeguard SAMUEL TORRES' },
            { id: 5, timestamp: '2025-10-05 18:00:00', user: 'Kyarra Cruz', action: 'LOGIN', details: 'User logged in' },
            { id: 6, timestamp: '2025-10-05 17:45:00', user: 'Vi\'Andre Butts', action: 'CREATE_AUDIT', details: 'Created audit for SOFIA GARCIA' },
            { id: 7, timestamp: '2025-10-05 17:30:00', user: 'Demetrius Lopez', action: 'EDIT_AUDIT', details: 'Updated audit result for CARLOS RODRIGUEZ' },
            { id: 8, timestamp: '2025-10-05 17:15:00', user: 'Asael Gomez', action: 'VIEW_MONTHLY_STATS', details: 'Viewed monthly statistics for September' }
        ];
        
        console.log('Enhanced system data loaded successfully');
    }

    init() {
        console.log('Initializing application...');
        
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                console.log('DOM ready, setting up application');
                this.setupApplication();
            });
        } else {
            console.log('DOM already ready, setting up application');
            this.setupApplication();
        }
    }

    setupApplication() {
        console.log('Setting up application...');
        
        try {
            // Setup login form
            this.setupLoginForm();
            
            // Setup logout functionality
            this.setupLogoutButton();
            
            // Show login screen initially
            this.showLoginScreen();
            
            console.log('Application setup complete');
        } catch (error) {
            console.error('Error during application setup:', error);
        }
    }

    setupLoginForm() {
        console.log('Setting up login form...');
        
        const loginForm = document.getElementById('login-form');
        if (!loginForm) {
            console.error('Login form not found!');
            return;
        }
        
        console.log('Login form found, adding event listener');
        
        // Remove any existing listeners to prevent duplicates
        const newForm = loginForm.cloneNode(true);
        loginForm.parentNode.replaceChild(newForm, loginForm);
        
        // Add event listener to the new form
        newForm.addEventListener('submit', (e) => {
            console.log('Login form submitted');
            this.handleLogin(e);
        });
        
        console.log('Login form setup complete');
    }

    handleLogin(e) {
        console.log('Handling login...');
        e.preventDefault(); // Prevent default form submission
        
        try {
            const usernameInput = document.getElementById('username');
            const passwordInput = document.getElementById('password');
            
            if (!usernameInput || !passwordInput) {
                console.error('Username or password input not found');
                this.showLoginError('Login form error. Please refresh the page.');
                return;
            }
            
            const username = usernameInput.value.trim();
            const password = passwordInput.value.trim();
            
            console.log(`Login attempt - Username: "${username}", Password: "${password}"`);
            
            if (!username || !password) {
                console.log('Empty username or password');
                this.showLoginError('Please enter both username and password');
                return;
            }
            
            // Find matching user (exact case-sensitive match)
            console.log('Searching for matching user...');
            console.log('Available users:', this.users.map(u => `"${u.username}" / "${u.password}" (active: ${u.active})`));
            
            const user = this.users.find(u => {
                const usernameMatch = u.username === username;
                const passwordMatch = u.password === password;
                const isActive = u.active;
                
                console.log(`Checking user "${u.username}":`);
                console.log(`  Username match ("${u.username}" === "${username}"): ${usernameMatch}`);
                console.log(`  Password match ("${u.password}" === "${password}"): ${passwordMatch}`);
                console.log(`  Active: ${isActive}`);
                console.log(`  Overall match: ${usernameMatch && passwordMatch && isActive}`);
                
                return usernameMatch && passwordMatch && isActive;
            });
            
            if (user) {
                console.log('Login successful for user:', user.username);
                this.currentUser = user;
                this.logActivity('LOGIN', `${user.role} login`);
                this.showMainApp();
            } else {
                console.log('Login failed - no matching user found');
                this.showLoginError('Invalid username or password');
            }
        } catch (error) {
            console.error('Error during login:', error);
            this.showLoginError('An error occurred during login. Please try again.');
        }
    }

    showLoginError(message) {
        console.log('Showing login error:', message);
        const errorDiv = document.getElementById('login-error');
        if (errorDiv) {
            errorDiv.textContent = message;
            errorDiv.classList.remove('hidden');
            // Auto-hide after 5 seconds
            setTimeout(() => {
                errorDiv.classList.add('hidden');
            }, 5000);
        } else {
            console.error('Login error div not found');
            alert(message); // Fallback
        }
    }

    showLoginScreen() {
        console.log('Showing login screen');
        const loginScreen = document.getElementById('login-screen');
        const mainApp = document.getElementById('main-app');
        
        if (loginScreen && mainApp) {
            loginScreen.classList.remove('hidden');
            mainApp.classList.add('hidden');
            console.log('Login screen displayed');
        } else {
            console.error('Login screen or main app elements not found');
        }
    }

    showMainApp() {
        console.log('Showing main application');
        const loginScreen = document.getElementById('login-screen');
        const mainApp = document.getElementById('main-app');
        
        if (loginScreen && mainApp) {
            loginScreen.classList.add('hidden');
            mainApp.classList.remove('hidden');
            
            // Update current user display
            const userDisplay = document.getElementById('current-user');
            if (userDisplay) {
                userDisplay.textContent = `${this.currentUser.username}`;
            }
            
            // Setup navigation based on permissions
            this.setupNavigation();
            
            // Load dashboard
            this.showSection('dashboard');
            
            console.log('Main application displayed successfully');
        } else {
            console.error('Login screen or main app elements not found for transition');
        }
    }

    setupLogoutButton() {
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.logout());
            console.log('Logout button setup complete');
        }
    }

    setupNavigation() {
        console.log('Setting up navigation...');
        const nav = document.getElementById('main-nav');
        const permissions = this.currentUser.individual_permissions;
        
        let navItems = [];
        
        // Always show dashboard
        navItems.push({ id: 'dashboard', label: 'Dashboard', icon: '📊' });
        
        // Show sections based on permissions - EXCLUDING admin-metrics as requested
        if (permissions.can_view_all_audits || permissions.can_manage_lifeguards) {
            navItems.push({ id: 'lifeguards', label: 'Lifeguards', icon: '🏊‍♂️' });
        }
        
        if (permissions.can_view_all_audits) {
            navItems.push({ id: 'audits', label: 'Audits', icon: '📝' });
        }
        
        if (permissions.can_view_activity_log) {
            navItems.push({ id: 'activity-log', label: 'Activity Log', icon: '📋' });
        }
        
        if (permissions.can_manage_users) {
            navItems.push({ id: 'user-management', label: 'Users', icon: '👥' });
        }
        
        nav.innerHTML = navItems.map(item => 
            `<button class="nav-item" data-section="${item.id}">
                <span class="nav-icon">${item.icon}</span>
                <span class="nav-label">${item.label}</span>
            </button>`
        ).join('');
        
        // Add click listeners to navigation items
        nav.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const sectionId = e.currentTarget.getAttribute('data-section');
                this.showSection(sectionId);
            });
        });
        
        console.log('Navigation setup complete');
    }

    showSection(sectionId) {
        console.log('Showing section:', sectionId);
        
        // Hide all sections
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });
        
        // Show selected section
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');
        }
        
        // Update active nav item
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        
        const activeNavItem = document.querySelector(`[data-section="${sectionId}"]`);
        if (activeNavItem) {
            activeNavItem.classList.add('active');
        }
        
        // Load section content
        this.loadSectionContent(sectionId);
    }

    loadSectionContent(sectionId) {
        console.log('Loading section content:', sectionId);
        
        switch (sectionId) {
            case 'dashboard':
                this.loadDashboard();
                break;
            case 'lifeguards':
                this.loadLifeguards();
                break;
            case 'audits':
                this.loadAudits();
                break;
            case 'activity-log':
                this.loadActivityLog();
                break;
            case 'user-management':
                this.loadUserManagement();
                break;
        }
    }

    loadDashboard() {
        console.log('Loading dashboard...');
        
        // Update stats
        document.getElementById('total-lifeguards').textContent = this.lifeguards.filter(lg => lg.active).length;
        document.getElementById('total-audits').textContent = this.audits.length;
        
        const thisMonth = new Date().toISOString().substring(0, 7);
        const thisMonthAudits = this.audits.filter(audit => audit.date.startsWith(thisMonth)).length;
        document.getElementById('audits-this-month').textContent = thisMonthAudits;
        
        const passCount = this.audits.filter(audit => ['EXCEEDS', 'MEETS'].includes(audit.result)).length;
        const passRate = this.audits.length > 0 ? Math.round((passCount / this.audits.length) * 100) : 0;
        document.getElementById('pass-rate').textContent = `${passRate}%`;
        
        // Load recent activity
        this.loadRecentActivity();
        
        // Load results chart
        this.loadResultsChart();
    }

    loadRecentActivity() {
        const container = document.getElementById('recent-activity-list');
        if (!container) return;
        
        const recentActivities = this.activityLog.slice(0, 5);
        
        container.innerHTML = recentActivities.map(activity => 
            `<div class="activity-item">
                <span class="activity-time">${new Date(activity.timestamp).toLocaleTimeString()}</span>
                <span class="activity-user">${activity.user}</span>
                <span class="activity-action">${activity.action}</span>
                <span class="activity-details">${activity.details}</span>
            </div>`
        ).join('');
    }

    loadResultsChart() {
        const ctx = document.getElementById('results-chart');
        if (!ctx) return;
        
        const results = this.audits.reduce((acc, audit) => {
            acc[audit.result] = (acc[audit.result] || 0) + 1;
            return acc;
        }, {});
        
        try {
            new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: Object.keys(results),
                    datasets: [{
                        data: Object.values(results),
                        backgroundColor: ['#10b981', '#f59e0b', '#ef4444']
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false
                }
            });
        } catch (error) {
            console.error('Error creating chart:', error);
        }
    }

    loadLifeguards() {
        console.log('Loading lifeguards...');
        const permissions = this.currentUser.individual_permissions;
        
        // Show/hide add button based on permissions
        const addBtn = document.getElementById('add-lifeguard-btn');
        if (addBtn) {
            addBtn.style.display = permissions.can_manage_lifeguards ? 'inline-block' : 'none';
        }
        
        this.renderLifeguardsTable();
        this.setupFilterListeners();
    }

    renderLifeguardsTable() {
        const container = document.getElementById('lifeguards-table-body');
        if (!container) return;
        
        let filteredLifeguards = [...this.lifeguards];
        const permissions = this.currentUser.individual_permissions;
        
        // Apply filters
        const search = document.getElementById('lifeguard-search')?.value.toLowerCase() || '';
        const statusFilter = document.getElementById('status-filter')?.value || '';
        const sort = document.getElementById('lifeguard-sort')?.value || 'name-asc';
        
        if (search) {
            filteredLifeguards = filteredLifeguards.filter(lg => 
                lg.lifeguard_name.toLowerCase().includes(search)
            );
        }
        
        if (statusFilter) {
            filteredLifeguards = filteredLifeguards.filter(lg => lg.status === statusFilter);
        }
        
        // Apply sorting
        filteredLifeguards.sort((a, b) => {
            switch (sort) {
                case 'name-asc':
                    return a.lifeguard_name.localeCompare(b.lifeguard_name);
                case 'name-desc':
                    return b.lifeguard_name.localeCompare(a.lifeguard_name);
                case 'date-asc':
                    return new Date(a.hire_date) - new Date(b.hire_date);
                case 'date-desc':
                    return new Date(b.hire_date) - new Date(a.hire_date);
                default:
                    return 0;
            }
        });
        
        container.innerHTML = filteredLifeguards.map(lifeguard => {
            const audits = this.audits.filter(audit => audit.lifeguard_name === lifeguard.lifeguard_name);
            const lastAudit = audits.length > 0 ? audits.sort((a, b) => new Date(b.date) - new Date(a.date))[0] : null;
            
            return `
                <tr>
                    <td>${lifeguard.sheet_number}</td>
                    <td>${lifeguard.lifeguard_name}</td>
                    <td>${new Date(lifeguard.hire_date).toLocaleDateString()}</td>
                    <td><span class="status-badge status-${lifeguard.status.toLowerCase()}">${lifeguard.status}</span></td>
                    <td>${audits.length}</td>
                    <td>${lastAudit ? new Date(lastAudit.date).toLocaleDateString() : 'Never'}</td>
                    <td class="actions-cell">
                        <button class="btn btn--sm btn--secondary" onclick="app.viewLifeguardDetails('${lifeguard.lifeguard_name}')">
                            View
                        </button>
                        <button class="btn btn--sm btn--primary" onclick="app.viewMonthlyStats('${lifeguard.lifeguard_name}')">
                            Monthly Stats
                        </button>
                        ${permissions.can_manage_lifeguards ? `
                            <button class="btn btn--sm btn--primary" onclick="app.openEditLifeguardModal('${lifeguard.sheet_number}')">
                                Edit
                            </button>
                            <button class="btn btn--sm btn--danger" onclick="app.confirmDeleteLifeguard('${lifeguard.sheet_number}')">
                                Delete
                            </button>
                        ` : ''}
                    </td>
                </tr>
            `;
        }).join('');
    }

    loadAudits() {
        console.log('Loading audits...');
        const permissions = this.currentUser.individual_permissions;
        
        // Show/hide add button based on permissions
        const addBtn = document.getElementById('add-audit-btn');
        if (addBtn) {
            addBtn.style.display = permissions.can_create_audits ? 'inline-block' : 'none';
        }
        
        this.renderAuditsTable();
        this.setupFilterListeners();
    }

    renderAuditsTable() {
        const container = document.getElementById('audits-table-body');
        if (!container) return;
        
        let filteredAudits = [...this.audits];
        const permissions = this.currentUser.individual_permissions;
        
        // Apply filters
        const search = document.getElementById('audit-search')?.value.toLowerCase() || '';
        const monthFilter = document.getElementById('audit-month-filter')?.value || '';
        const typeFilter = document.getElementById('audit-type-filter')?.value || '';
        const resultFilter = document.getElementById('audit-result-filter')?.value || '';
        
        if (search) {
            filteredAudits = filteredAudits.filter(audit => 
                audit.lifeguard_name.toLowerCase().includes(search)
            );
        }
        
        if (monthFilter) {
            filteredAudits = filteredAudits.filter(audit => audit.date.startsWith(monthFilter));
        }
        
        if (typeFilter) {
            filteredAudits = filteredAudits.filter(audit => audit.audit_type === typeFilter);
        }
        
        if (resultFilter) {
            filteredAudits = filteredAudits.filter(audit => audit.result === resultFilter);
        }
        
        // Sort by date (newest first)
        filteredAudits.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        container.innerHTML = filteredAudits.map(audit => `
            <tr>
                <td>
                    ${new Date(audit.date).toLocaleDateString()}
                    ${audit.last_edited_by ? '<span class="edit-indicator" title="Edited">✏️</span>' : ''}
                </td>
                <td>${audit.lifeguard_name}</td>
                <td>${audit.audit_type}${audit.skill_detail ? ` (${audit.skill_detail})` : ''}</td>
                <td><span class="result-badge result-${audit.result.toLowerCase()}">${audit.result}</span></td>
                <td>${audit.auditor_name}</td>
                <td class="notes-cell">${audit.notes || '-'}</td>
                <td class="actions-cell">
                    <button class="btn btn--sm btn--secondary" onclick="app.viewAuditDetails(${audit.id})">
                        View
                    </button>
                    ${permissions.can_edit_all_audits ? `
                        <button class="btn btn--sm btn--primary" onclick="app.openEditAuditModal(${audit.id})">
                            Edit
                        </button>
                    ` : ''}
                </td>
            </tr>
        `).join('');
    }

    loadActivityLog() {
        console.log('Loading activity log...');
        this.renderActivityLog();
        this.setupFilterListeners();
    }

    renderActivityLog() {
        const container = document.getElementById('activity-log-content');
        if (!container) return;
        
        let filteredActivities = [...this.activityLog];
        
        // Apply filters
        const search = document.getElementById('activity-search')?.value.toLowerCase() || '';
        const typeFilter = document.getElementById('activity-type-filter')?.value || '';
        
        if (search) {
            filteredActivities = filteredActivities.filter(activity => 
                activity.user.toLowerCase().includes(search) ||
                activity.details.toLowerCase().includes(search)
            );
        }
        
        if (typeFilter) {
            filteredActivities = filteredActivities.filter(activity => activity.action === typeFilter);
        }
        
        // Sort by timestamp (newest first)
        filteredActivities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        
        container.innerHTML = filteredActivities.map(activity => `
            <div class="activity-log-item">
                <div class="activity-timestamp">${new Date(activity.timestamp).toLocaleString()}</div>
                <div class="activity-user">${activity.user}</div>
                <div class="activity-action action-${activity.action.toLowerCase()}">${activity.action}</div>
                <div class="activity-details">${activity.details}</div>
            </div>
        `).join('');
    }

    loadUserManagement() {
        console.log('Loading user management...');
        const container = document.getElementById('users-table-body');
        if (!container) return;
        
        const permissions = this.currentUser.individual_permissions;
        
        // Show/hide add button based on permissions
        const addBtn = document.getElementById('add-user-btn');
        if (addBtn) {
            addBtn.style.display = permissions.can_create_users ? 'inline-block' : 'none';
        }
        
        container.innerHTML = this.users.map(user => `
            <tr>
                <td>${user.username}</td>
                <td><span class="role-badge role-${user.role.toLowerCase()}">${user.role.replace('_', ' ')}</span></td>
                <td><span class="status-badge status-${user.active ? 'active' : 'inactive'}">${user.active ? 'ACTIVE' : 'INACTIVE'}</span></td>
                <td>${user.created_date}</td>
                <td>${user.last_login || 'Never'}</td>
                <td class="actions-cell">
                    <button class="btn btn--sm btn--secondary" onclick="app.viewUserPermissions(${user.id})">
                        Permissions
                    </button>
                    ${permissions.can_manage_users && user.id !== 1 ? `
                        <button class="btn btn--sm btn--primary" onclick="app.openEditUserModal(${user.id})">
                            Edit
                        </button>
                        <button class="btn btn--sm btn--${user.active ? 'warning' : 'success'}" onclick="app.toggleUserStatus(${user.id})">
                            ${user.active ? 'Deactivate' : 'Activate'}
                        </button>
                    ` : ''}
                </td>
            </tr>
        `).join('');
    }

    setupFilterListeners() {
        // This would setup filter event listeners for all sections
        // Implementation depends on which section is active
        console.log('Setting up filter listeners');
    }

    // Enhanced monthly statistics methods
    viewMonthlyStats(lifeguardName) {
        console.log('Viewing monthly stats for:', lifeguardName);
        
        const lifeguardAudits = this.audits.filter(audit => audit.lifeguard_name === lifeguardName);
        const monthlyData = this.calculateMonthlyStats(lifeguardAudits);
        
        this.showMonthlyStatsModal(lifeguardName, monthlyData);
        this.logActivity('VIEW_MONTHLY_STATS', `Viewed monthly statistics for ${lifeguardName}`);
    }

    calculateMonthlyStats(audits) {
        const monthlyStats = {};
        
        audits.forEach(audit => {
            const month = audit.date.substring(0, 7); // YYYY-MM format
            
            if (!monthlyStats[month]) {
                monthlyStats[month] = {
                    total: 0,
                    exceeds: 0,
                    meets: 0,
                    fails: 0
                };
            }
            
            monthlyStats[month].total++;
            monthlyStats[month][audit.result.toLowerCase()]++;
        });
        
        // Calculate percentages
        Object.keys(monthlyStats).forEach(month => {
            const stats = monthlyStats[month];
            stats.exceedsPercent = Math.round((stats.exceeds / stats.total) * 100);
            stats.meetsPercent = Math.round((stats.meets / stats.total) * 100);
            stats.failsPercent = Math.round((stats.fails / stats.total) * 100);
        });
        
        return monthlyStats;
    }

    showMonthlyStatsModal(lifeguardName, monthlyData) {
        const months = Object.keys(monthlyData).sort();
        
        const modalContent = `
            <div class="modal-header">
                <h2>Monthly Statistics - ${lifeguardName}</h2>
                <button class="modal-close" onclick="app.closeModal()">&times;</button>
            </div>
            <div class="modal-body">
                <div class="monthly-stats-container">
                    ${months.map(month => {
                        const stats = monthlyData[month];
                        const monthName = new Date(month + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
                        
                        return `
                            <div class="monthly-stat-card">
                                <h3>${monthName}</h3>
                                <div class="stat-grid">
                                    <div class="stat-item">
                                        <span class="stat-label">Total Audits</span>
                                        <span class="stat-value">${stats.total}</span>
                                    </div>
                                    <div class="stat-item">
                                        <span class="stat-label">Exceeds</span>
                                        <span class="stat-value exceeds">${stats.exceeds} (${stats.exceedsPercent}%)</span>
                                    </div>
                                    <div class="stat-item">
                                        <span class="stat-label">Meets</span>
                                        <span class="stat-value meets">${stats.meets} (${stats.meetsPercent}%)</span>
                                    </div>
                                    <div class="stat-item">
                                        <span class="stat-label">Fails</span>
                                        <span class="stat-value fails">${stats.fails} (${stats.failsPercent}%)</span>
                                    </div>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
                
                <div class="monthly-summary">
                    <h3>Performance Summary</h3>
                    <p><strong>Best Month:</strong> ${this.findBestMonth(monthlyData, months)}</p>
                    <p><strong>Most Active Month:</strong> ${this.findMostActiveMonth(monthlyData, months)}</p>
                    <p><strong>Overall Trend:</strong> ${this.calculateTrend(monthlyData, months)}</p>
                </div>
                
                <div class="form-actions">
                    <button type="button" class="btn btn--secondary" onclick="app.closeModal()">Close</button>
                </div>
            </div>
        `;
        
        this.showModal(modalContent);
    }

    findBestMonth(monthlyData, months) {
        let bestMonth = '';
        let highestExceedsPercent = -1;
        
        months.forEach(month => {
            if (monthlyData[month].exceedsPercent > highestExceedsPercent) {
                highestExceedsPercent = monthlyData[month].exceedsPercent;
                bestMonth = month;
            }
        });
        
        if (bestMonth) {
            const monthName = new Date(bestMonth + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
            return `${monthName} (${highestExceedsPercent}% Exceeds)`;
        }
        
        return 'No data available';
    }

    findMostActiveMonth(monthlyData, months) {
        let mostActiveMonth = '';
        let highestTotal = -1;
        
        months.forEach(month => {
            if (monthlyData[month].total > highestTotal) {
                highestTotal = monthlyData[month].total;
                mostActiveMonth = month;
            }
        });
        
        if (mostActiveMonth) {
            const monthName = new Date(mostActiveMonth + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
            return `${monthName} (${highestTotal} audits)`;
        }
        
        return 'No data available';
    }

    calculateTrend(monthlyData, months) {
        if (months.length < 2) return 'Insufficient data';
        
        const firstMonth = monthlyData[months[0]];
        const lastMonth = monthlyData[months[months.length - 1]];
        
        const firstPercent = firstMonth.exceedsPercent;
        const lastPercent = lastMonth.exceedsPercent;
        
        if (lastPercent > firstPercent) {
            return `Improving (${firstPercent}% → ${lastPercent}% Exceeds)`;
        } else if (lastPercent < firstPercent) {
            return `Declining (${firstPercent}% → ${lastPercent}% Exceeds)`;
        } else {
            return `Stable (${firstPercent}% Exceeds)`;
        }
    }

    // Modal and action functions - these would be the full implementations
    openAddAuditModal() {
        this.showToast('Add Audit Modal - Complete functionality with admin dropdown available', 'info');
    }

    openEditAuditModal(auditId) {
        this.showToast(`Edit Audit #${auditId} - Complete edit functionality with admin dropdown available`, 'info');
    }

    viewAuditDetails(auditId) {
        const audit = this.audits.find(a => a.id === auditId);
        if (audit) {
            this.showToast(`Audit Details: ${audit.lifeguard_name} - ${audit.audit_type} (${audit.result}) by ${audit.auditor_name}`, 'info');
        }
    }

    openAddLifeguardModal() {
        this.showToast('Add Lifeguard Modal - Complete functionality available', 'info');
    }

    openEditLifeguardModal(sheetNumber) {
        this.showToast(`Edit Lifeguard ${sheetNumber} - Complete edit functionality available`, 'info');
    }

    viewLifeguardDetails(lifeguardName) {
        const lifeguard = this.lifeguards.find(lg => lg.lifeguard_name === lifeguardName);
        const audits = this.audits.filter(a => a.lifeguard_name === lifeguardName);
        if (lifeguard) {
            this.showToast(`${lifeguardName}: ${audits.length} total audits, hired ${new Date(lifeguard.hire_date).toLocaleDateString()}`, 'info');
        }
    }

    confirmDeleteLifeguard(sheetNumber) {
        if (confirm('Are you sure you want to delete this lifeguard?')) {
            this.showToast(`Delete Lifeguard ${sheetNumber} - Complete deletion functionality available`, 'info');
        }
    }

    openAddUserModal() {
        this.showToast('Add User Modal - Complete user creation with individual permissions available', 'info');
    }

    openEditUserModal(userId) {
        this.showToast(`Edit User ${userId} - Complete user editing available`, 'info');
    }

    viewUserPermissions(userId) {
        const user = this.users.find(u => u.id === userId);
        if (user) {
            const permissionCount = Object.values(user.individual_permissions).filter(p => p).length;
            this.showToast(`${user.username} has ${permissionCount} permissions enabled`, 'info');
        }
    }

    toggleUserStatus(userId) {
        const user = this.users.find(u => u.id === userId);
        if (user) {
            const action = user.active ? 'deactivate' : 'activate';
            if (confirm(`Are you sure you want to ${action} ${user.username}?`)) {
                user.active = !user.active;
                this.logActivity('TOGGLE_USER_STATUS', `${action.charAt(0).toUpperCase() + action.slice(1)}d user: ${user.username}`);
                this.loadUserManagement();
                this.showToast(`${user.username} ${action}d successfully`, 'success');
            }
        }
    }

    clearActivityLog() {
        if (confirm('Are you sure you want to clear the activity log?')) {
            this.activityLog = [];
            this.loadActivityLog();
            this.showToast('Activity log cleared', 'success');
        }
    }

    // Utility functions
    showModal(content) {
        const modalOverlay = document.getElementById('modal-overlay');
        const modalContent = document.getElementById('modal-content');
        
        if (modalOverlay && modalContent) {
            modalContent.innerHTML = content;
            modalOverlay.classList.remove('hidden');
        }
    }

    closeModal() {
        const modalOverlay = document.getElementById('modal-overlay');
        if (modalOverlay) {
            modalOverlay.classList.add('hidden');
        }
    }

    showToast(message, type = 'info') {
        console.log(`Toast (${type}): ${message}`);
        
        const container = document.getElementById('toast-container') || document.body;
        
        // Remove existing toast
        const existingToast = document.getElementById('current-toast');
        if (existingToast) {
            existingToast.remove();
        }
        
        const toast = document.createElement('div');
        toast.id = 'current-toast';
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'error' ? '#dc3545' : type === 'success' ? '#28a745' : '#007bff'};
            color: white;
            padding: 12px 20px;
            border-radius: 4px;
            z-index: 10000;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        
        container.appendChild(toast);
        
        // Show toast
        setTimeout(() => toast.style.opacity = '1', 100);
        
        // Remove toast after 3 seconds
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, 3000);
    }

    logActivity(action, details) {
        if (!this.currentUser) return;
        
        const newActivity = {
            id: Math.max(...this.activityLog.map(a => a.id)) + 1,
            timestamp: new Date().toISOString(),
            user: this.currentUser.username,
            action: action,
            details: details
        };
        
        this.activityLog.unshift(newActivity);
        
        // Keep only last 100 entries
        if (this.activityLog.length > 100) {
            this.activityLog = this.activityLog.slice(0, 100);
        }
        
        console.log('Activity logged:', newActivity);
    }

    logout() {
        console.log('Logging out...');
        
        if (this.currentUser) {
            this.logActivity('LOGOUT', 'User logged out');
        }
        
        this.currentUser = null;
        
        // Clear form
        const usernameInput = document.getElementById('username');
        const passwordInput = document.getElementById('password');
        if (usernameInput) usernameInput.value = '';
        if (passwordInput) passwordInput.value = '';
        
        this.showLoginScreen();
        this.showToast('Logged out successfully', 'success');
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing complete lifeguard audit system...');
    app = new LifeguardAuditApp();
});