// Complete Lifeguard Audit System with DATA PERSISTENCE
let app; // Global app reference

class LifeguardAuditApp {
    constructor() {
        console.log('Initializing LifeguardAuditApp with Data Persistence');
        
        // Load system data (with localStorage persistence)
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

        // Editing state
        this.editingItem = null;
        this.editingType = null;

        // Charts
        this.monthlyChart = null;

        this.init();
    }

    // =======================================
    // DATA PERSISTENCE METHODS
    // =======================================

    saveToLocalStorage(key, data) {
        try {
            localStorage.setItem(`treasureCove_${key}`, JSON.stringify(data));
            console.log(`Saved ${key} to localStorage`);
        } catch (error) {
            console.error(`Error saving ${key} to localStorage:`, error);
        }
    }

    loadFromLocalStorage(key, defaultData = null) {
        try {
            const stored = localStorage.getItem(`treasureCove_${key}`);
            if (stored) {
                const data = JSON.parse(stored);
                console.log(`Loaded ${key} from localStorage`);
                return data;
            }
        } catch (error) {
            console.error(`Error loading ${key} from localStorage:`, error);
        }
        return defaultData;
    }

    loadSystemData() {
        console.log('Loading system data with persistence...');
        
        // Try to load from localStorage first, otherwise use defaults
        this.users = this.loadFromLocalStorage('users', this.getDefaultUsers());
        this.lifeguards = this.loadFromLocalStorage('lifeguards', this.getDefaultLifeguards());
        this.audits = this.loadFromLocalStorage('audits', this.getDefaultAudits());
        this.activityLog = this.loadFromLocalStorage('activityLog', this.getDefaultActivityLog());

        console.log('System data loaded:', {
            users: this.users.length,
            lifeguards: this.lifeguards.length,
            audits: this.audits.length,
            activities: this.activityLog.length
        });
    }

    getDefaultUsers() {
        return [
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
    }

    getDefaultLifeguards() {
        return [
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
    }

    getDefaultAudits() {
        return [
            {"id":1,"lifeguard_name":"MIA FIGUEROA","date":"2025-07-15","time":"10:30:00","audit_type":"Visual","skill_detail":"","auditor_name":"Asael Gomez","result":"EXCEEDS","notes":"Excellent awareness","follow_up":"","created_by":"Asael Gomez","created_date":"2025-07-15 10:30:00","last_edited_by":null,"last_edited_date":null},
            {"id":2,"lifeguard_name":"NATHAN RAMLAKHAN","date":"2025-08-01","time":"14:15:00","audit_type":"VAT","skill_detail":"","auditor_name":"Matthew Hills","result":"MEETS","notes":"Good technique","follow_up":"","created_by":"Demetrius Lopez","created_date":"2025-08-01 14:15:00","last_edited_by":null,"last_edited_date":null},
            {"id":3,"lifeguard_name":"JASON MOLL","date":"2025-09-10","time":"11:45:00","audit_type":"Skill","skill_detail":"CPR","auditor_name":"Xavier Butler Lee","result":"EXCEEDS","notes":"Perfect execution","follow_up":"","created_by":"Xavier Butler Lee","created_date":"2025-09-10 11:45:00","last_edited_by":null,"last_edited_date":null},
            {"id":4,"lifeguard_name":"JAVIAN QUIÑONES","date":"2025-09-20","time":"09:30:00","audit_type":"Visual","skill_detail":"","auditor_name":"Kyarra Cruz","result":"EXCEEDS","notes":"Outstanding performance","follow_up":"","created_by":"Kyarra Cruz","created_date":"2025-09-20 09:30:00","last_edited_by":null,"last_edited_date":null},
            {"id":5,"lifeguard_name":"LUCCA CONCEICAO","date":"2025-10-01","time":"16:00:00","audit_type":"Skill","skill_detail":"First Aid","auditor_name":"Vi'Andre Butts","result":"MEETS","notes":"Good knowledge","follow_up":"Practice bandaging","created_by":"Vi'Andre Butts","created_date":"2025-10-01 16:00:00","last_edited_by":null,"last_edited_date":null},
            {"id":6,"lifeguard_name":"MIA FIGUEROA","date":"2025-08-15","time":"14:30:00","audit_type":"VAT","skill_detail":"","auditor_name":"Matthew Hills","result":"EXCEEDS","notes":"Excellent positioning","follow_up":"","created_by":"Matthew Hills","created_date":"2025-08-15 14:30:00","last_edited_by":null,"last_edited_date":null},
            {"id":7,"lifeguard_name":"SAMUEL TORRES","date":"2025-09-05","time":"10:15:00","audit_type":"Visual","skill_detail":"","auditor_name":"Asael Gomez","result":"MEETS","notes":"Good scanning technique","follow_up":"","created_by":"Asael Gomez","created_date":"2025-09-05 10:15:00","last_edited_by":null,"last_edited_date":null},
            {"id":8,"lifeguard_name":"ISABELLA MARTINEZ","date":"2025-09-25","time":"13:45:00","audit_type":"Skill","skill_detail":"Rescue Tube","auditor_name":"Xavier Butler Lee","result":"EXCEEDS","notes":"Flawless rescue technique","follow_up":"","created_by":"Xavier Butler Lee","created_date":"2025-09-25 13:45:00","last_edited_by":null,"last_edited_date":null},
            {"id":9,"lifeguard_name":"CARLOS RODRIGUEZ","date":"2025-10-03","time":"11:00:00","audit_type":"Visual","skill_detail":"","auditor_name":"Kyarra Cruz","result":"MEETS","notes":"Adequate performance","follow_up":"","created_by":"Kyarra Cruz","created_date":"2025-10-03 11:00:00","last_edited_by":null,"last_edited_date":null},
            {"id":10,"lifeguard_name":"SOFIA GARCIA","date":"2025-10-05","time":"15:30:00","audit_type":"VAT","skill_detail":"","auditor_name":"Vi'Andre Butts","result":"EXCEEDS","notes":"Perfect vigilance","follow_up":"","created_by":"Vi'Andre Butts","created_date":"2025-10-05 15:30:00","last_edited_by":null,"last_edited_date":null}
        ];
    }

    getDefaultActivityLog() {
        return [
            { id: 1, timestamp: '2025-10-06 12:00:00', user: 'Demetrius Lopez', action: 'LOGIN', details: 'User logged in' },
            { id: 2, timestamp: '2025-10-05 18:45:00', user: 'Asael Gomez', action: 'CREATE_AUDIT', details: 'Created audit for MIA FIGUEROA' },
            { id: 3, timestamp: '2025-10-05 18:30:00', user: 'Matthew Hills', action: 'EDIT_AUDIT', details: 'Edited audit #2' },
            { id: 4, timestamp: '2025-10-05 18:15:00', user: 'Xavier Butler Lee', action: 'CREATE_LIFEGUARD', details: 'Added new lifeguard SAMUEL TORRES' },
            { id: 5, timestamp: '2025-10-05 18:00:00', user: 'Kyarra Cruz', action: 'LOGIN', details: 'User logged in' },
            { id: 6, timestamp: '2025-10-05 17:45:00', user: 'Vi\'Andre Butts', action: 'CREATE_AUDIT', details: 'Created audit for SOFIA GARCIA' },
            { id: 7, timestamp: '2025-10-05 17:30:00', user: 'Demetrius Lopez', action: 'EDIT_AUDIT', details: 'Updated audit result for CARLOS RODRIGUEZ' },
            { id: 8, timestamp: '2025-10-05 17:15:00', user: 'Asael Gomez', action: 'VIEW_MONTHLY_STATS', details: 'Viewed monthly statistics for September' }
        ];
    }

    // Save data whenever changes are made
    saveAllData() {
        this.saveToLocalStorage('users', this.users);
        this.saveToLocalStorage('lifeguards', this.lifeguards);
        this.saveToLocalStorage('audits', this.audits);
        this.saveToLocalStorage('activityLog', this.activityLog);
    }

    // =======================================
    // EXISTING APPLICATION CODE
    // =======================================

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
            
            // Setup modal close functionality
            this.setupModalHandlers();
            
            // Show login screen initially
            this.showLoginScreen();
            
            console.log('Application setup complete');
        } catch (error) {
            console.error('Error during application setup:', error);
        }
    }

    setupModalHandlers() {
        // Click outside modal to close
        document.addEventListener('click', (e) => {
            if (e.target.id === 'modal-overlay') {
                this.closeModal();
            }
        });

        // Escape key to close modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
            }
        });
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
                // Update last login time and save
                user.last_login = new Date().toISOString().split('T')[0];
                this.logActivity('LOGIN', `${user.role} login`);
                this.saveAllData(); // Save after login
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

    // =======================================
    // WORKING EDIT MODAL FUNCTIONS WITH PERSISTENCE
    // =======================================

    // AUDIT MODALS
    openAddAuditModal() {
        console.log('Opening Add Audit Modal');
        this.editingItem = null;
        this.editingType = 'audit';
        
        const adminUsers = this.users.filter(u => ['ADMIN', 'SENIOR_ADMIN'].includes(u.role) && u.active);
        
        const modalContent = `
            <div class="modal-header">
                <h2>Add New Audit</h2>
                <button class="modal-close" onclick="app.closeModal()">&times;</button>
            </div>
            <div class="modal-body">
                <form id="audit-form">
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label" for="audit-lifeguard">Lifeguard *</label>
                            <select id="audit-lifeguard" class="form-control" required>
                                <option value="">Select Lifeguard</option>
                                ${this.lifeguards.filter(lg => lg.active).map(lg => 
                                    `<option value="${lg.lifeguard_name}">${lg.lifeguard_name}</option>`
                                ).join('')}
                            </select>
                        </div>
                        <div class="form-group">
                            <label class="form-label" for="audit-auditor">Auditor *</label>
                            <select id="audit-auditor" class="form-control" required>
                                <option value="">Select Auditor</option>
                                ${adminUsers.map(user => 
                                    `<option value="${user.username}">${user.username}</option>`
                                ).join('')}
                            </select>
                        </div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label" for="audit-date">Date *</label>
                            <input type="date" id="audit-date" class="form-control" required value="${new Date().toISOString().split('T')[0]}">
                        </div>
                        <div class="form-group">
                            <label class="form-label" for="audit-time">Time *</label>
                            <input type="time" id="audit-time" class="form-control" required value="${new Date().toTimeString().substring(0,5)}">
                        </div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label" for="audit-type">Audit Type *</label>
                            <select id="audit-type" class="form-control" required>
                                <option value="">Select Type</option>
                                <option value="Visual">Visual</option>
                                <option value="VAT">VAT</option>
                                <option value="Skill">Skill</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label class="form-label" for="audit-skill">Skill Detail</label>
                            <input type="text" id="audit-skill" class="form-control" placeholder="e.g., CPR, First Aid">
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label" for="audit-result">Result *</label>
                        <select id="audit-result" class="form-control" required>
                            <option value="">Select Result</option>
                            <option value="EXCEEDS">Exceeds</option>
                            <option value="MEETS">Meets</option>
                            <option value="FAILS">Fails</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label" for="audit-notes">Notes</label>
                        <textarea id="audit-notes" class="form-control" rows="3" placeholder="Additional observations or comments"></textarea>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label" for="audit-followup">Follow-up Required</label>
                        <textarea id="audit-followup" class="form-control" rows="2" placeholder="Any follow-up actions needed"></textarea>
                    </div>
                </form>
                
                <div class="form-actions">
                    <button type="button" class="btn btn--secondary" onclick="app.closeModal()">Cancel</button>
                    <button type="button" class="btn btn--primary" onclick="app.saveAudit()">Save Audit</button>
                </div>
            </div>
        `;
        
        this.showModal(modalContent);
    }

    openEditAuditModal(auditId) {
        console.log('Opening Edit Audit Modal for ID:', auditId);
        const audit = this.audits.find(a => a.id === auditId);
        if (!audit) {
            this.showToast('Audit not found', 'error');
            return;
        }
        
        this.editingItem = audit;
        this.editingType = 'audit';
        
        const adminUsers = this.users.filter(u => ['ADMIN', 'SENIOR_ADMIN'].includes(u.role) && u.active);
        
        const modalContent = `
            <div class="modal-header">
                <h2>Edit Audit #${audit.id}</h2>
                <button class="modal-close" onclick="app.closeModal()">&times;</button>
            </div>
            <div class="modal-body">
                <form id="audit-form">
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label" for="audit-lifeguard">Lifeguard *</label>
                            <select id="audit-lifeguard" class="form-control" required>
                                <option value="">Select Lifeguard</option>
                                ${this.lifeguards.filter(lg => lg.active).map(lg => 
                                    `<option value="${lg.lifeguard_name}" ${audit.lifeguard_name === lg.lifeguard_name ? 'selected' : ''}>${lg.lifeguard_name}</option>`
                                ).join('')}
                            </select>
                        </div>
                        <div class="form-group">
                            <label class="form-label" for="audit-auditor">Auditor *</label>
                            <select id="audit-auditor" class="form-control" required>
                                <option value="">Select Auditor</option>
                                ${adminUsers.map(user => 
                                    `<option value="${user.username}" ${audit.auditor_name === user.username ? 'selected' : ''}>${user.username}</option>`
                                ).join('')}
                            </select>
                        </div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label" for="audit-date">Date *</label>
                            <input type="date" id="audit-date" class="form-control" required value="${audit.date}">
                        </div>
                        <div class="form-group">
                            <label class="form-label" for="audit-time">Time *</label>
                            <input type="time" id="audit-time" class="form-control" required value="${audit.time}">
                        </div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label" for="audit-type">Audit Type *</label>
                            <select id="audit-type" class="form-control" required>
                                <option value="">Select Type</option>
                                <option value="Visual" ${audit.audit_type === 'Visual' ? 'selected' : ''}>Visual</option>
                                <option value="VAT" ${audit.audit_type === 'VAT' ? 'selected' : ''}>VAT</option>
                                <option value="Skill" ${audit.audit_type === 'Skill' ? 'selected' : ''}>Skill</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label class="form-label" for="audit-skill">Skill Detail</label>
                            <input type="text" id="audit-skill" class="form-control" placeholder="e.g., CPR, First Aid" value="${audit.skill_detail || ''}">
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label" for="audit-result">Result *</label>
                        <select id="audit-result" class="form-control" required>
                            <option value="">Select Result</option>
                            <option value="EXCEEDS" ${audit.result === 'EXCEEDS' ? 'selected' : ''}>Exceeds</option>
                            <option value="MEETS" ${audit.result === 'MEETS' ? 'selected' : ''}>Meets</option>
                            <option value="FAILS" ${audit.result === 'FAILS' ? 'selected' : ''}>Fails</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label" for="audit-notes">Notes</label>
                        <textarea id="audit-notes" class="form-control" rows="3" placeholder="Additional observations or comments">${audit.notes || ''}</textarea>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label" for="audit-followup">Follow-up Required</label>
                        <textarea id="audit-followup" class="form-control" rows="2" placeholder="Any follow-up actions needed">${audit.follow_up || ''}</textarea>
                    </div>
                </form>
                
                <div class="form-actions">
                    <button type="button" class="btn btn--secondary" onclick="app.closeModal()">Cancel</button>
                    <button type="button" class="btn btn--primary" onclick="app.saveAudit()">Update Audit</button>
                </div>
            </div>
        `;
        
        this.showModal(modalContent);
    }

    saveAudit() {
        console.log('Saving audit...');
        
        // Get form data
        const lifeguardName = document.getElementById('audit-lifeguard').value;
        const auditorName = document.getElementById('audit-auditor').value;
        const date = document.getElementById('audit-date').value;
        const time = document.getElementById('audit-time').value;
        const auditType = document.getElementById('audit-type').value;
        const skillDetail = document.getElementById('audit-skill').value;
        const result = document.getElementById('audit-result').value;
        const notes = document.getElementById('audit-notes').value;
        const followUp = document.getElementById('audit-followup').value;
        
        // Validate required fields
        if (!lifeguardName || !auditorName || !date || !time || !auditType || !result) {
            this.showToast('Please fill in all required fields', 'error');
            return;
        }
        
        if (this.editingItem) {
            // Update existing audit
            const audit = this.editingItem;
            audit.lifeguard_name = lifeguardName;
            audit.auditor_name = auditorName;
            audit.date = date;
            audit.time = time;
            audit.audit_type = auditType;
            audit.skill_detail = skillDetail;
            audit.result = result;
            audit.notes = notes;
            audit.follow_up = followUp;
            audit.last_edited_by = this.currentUser.username;
            audit.last_edited_date = new Date().toISOString();
            
            this.logActivity('EDIT_AUDIT', `Updated audit #${audit.id} for ${lifeguardName}`);
            this.showToast('Audit updated successfully', 'success');
        } else {
            // Create new audit
            const newAudit = {
                id: Math.max(...this.audits.map(a => a.id), 0) + 1,
                lifeguard_name: lifeguardName,
                date: date,
                time: time,
                audit_type: auditType,
                skill_detail: skillDetail,
                auditor_name: auditorName,
                result: result,
                notes: notes,
                follow_up: followUp,
                created_by: this.currentUser.username,
                created_date: new Date().toISOString(),
                last_edited_by: null,
                last_edited_date: null
            };
            
            this.audits.push(newAudit);
            this.logActivity('CREATE_AUDIT', `Created new audit for ${lifeguardName}`);
            this.showToast('Audit created successfully', 'success');
        }
        
        // SAVE TO LOCALSTORAGE
        this.saveAllData();
        
        this.closeModal();
        this.loadAudits(); // Refresh the table
    }

    // LIFEGUARD MODALS
    openAddLifeguardModal() {
        console.log('Opening Add Lifeguard Modal');
        this.editingItem = null;
        this.editingType = 'lifeguard';
        
        // Get next sheet number
        const maxSheetNumber = Math.max(...this.lifeguards.map(lg => parseInt(lg.sheet_number)), 0);
        const nextSheetNumber = String(maxSheetNumber + 1).padStart(2, '0');
        
        const modalContent = `
            <div class="modal-header">
                <h2>Add New Lifeguard</h2>
                <button class="modal-close" onclick="app.closeModal()">&times;</button>
            </div>
            <div class="modal-body">
                <form id="lifeguard-form">
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label" for="lifeguard-sheet">Sheet Number *</label>
                            <input type="text" id="lifeguard-sheet" class="form-control" required value="${nextSheetNumber}" readonly>
                        </div>
                        <div class="form-group">
                            <label class="form-label" for="lifeguard-name">Full Name *</label>
                            <input type="text" id="lifeguard-name" class="form-control" required placeholder="Enter full name in CAPS">
                        </div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label" for="lifeguard-hire-date">Hire Date *</label>
                            <input type="date" id="lifeguard-hire-date" class="form-control" required value="${new Date().toISOString().split('T')[0]}">
                        </div>
                        <div class="form-group">
                            <label class="form-label" for="lifeguard-status">Status *</label>
                            <select id="lifeguard-status" class="form-control" required>
                                <option value="ACTIVE" selected>Active</option>
                                <option value="INACTIVE">Inactive</option>
                            </select>
                        </div>
                    </div>
                </form>
                
                <div class="form-actions">
                    <button type="button" class="btn btn--secondary" onclick="app.closeModal()">Cancel</button>
                    <button type="button" class="btn btn--primary" onclick="app.saveLifeguard()">Save Lifeguard</button>
                </div>
            </div>
        `;
        
        this.showModal(modalContent);
    }

    openEditLifeguardModal(sheetNumber) {
        console.log('Opening Edit Lifeguard Modal for sheet:', sheetNumber);
        const lifeguard = this.lifeguards.find(lg => lg.sheet_number === sheetNumber);
        if (!lifeguard) {
            this.showToast('Lifeguard not found', 'error');
            return;
        }
        
        this.editingItem = lifeguard;
        this.editingType = 'lifeguard';
        
        const modalContent = `
            <div class="modal-header">
                <h2>Edit Lifeguard - Sheet ${lifeguard.sheet_number}</h2>
                <button class="modal-close" onclick="app.closeModal()">&times;</button>
            </div>
            <div class="modal-body">
                <form id="lifeguard-form">
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label" for="lifeguard-sheet">Sheet Number *</label>
                            <input type="text" id="lifeguard-sheet" class="form-control" required value="${lifeguard.sheet_number}" readonly>
                        </div>
                        <div class="form-group">
                            <label class="form-label" for="lifeguard-name">Full Name *</label>
                            <input type="text" id="lifeguard-name" class="form-control" required placeholder="Enter full name in CAPS" value="${lifeguard.lifeguard_name}">
                        </div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label" for="lifeguard-hire-date">Hire Date *</label>
                            <input type="date" id="lifeguard-hire-date" class="form-control" required value="${lifeguard.hire_date}">
                        </div>
                        <div class="form-group">
                            <label class="form-label" for="lifeguard-status">Status *</label>
                            <select id="lifeguard-status" class="form-control" required>
                                <option value="ACTIVE" ${lifeguard.status === 'ACTIVE' ? 'selected' : ''}>Active</option>
                                <option value="INACTIVE" ${lifeguard.status === 'INACTIVE' ? 'selected' : ''}>Inactive</option>
                            </select>
                        </div>
                    </div>
                </form>
                
                <div class="form-actions">
                    <button type="button" class="btn btn--secondary" onclick="app.closeModal()">Cancel</button>
                    <button type="button" class="btn btn--primary" onclick="app.saveLifeguard()">Update Lifeguard</button>
                </div>
            </div>
        `;
        
        this.showModal(modalContent);
    }

    saveLifeguard() {
        console.log('Saving lifeguard...');
        
        // Get form data
        const sheetNumber = document.getElementById('lifeguard-sheet').value;
        const name = document.getElementById('lifeguard-name').value.trim().toUpperCase();
        const hireDate = document.getElementById('lifeguard-hire-date').value;
        const status = document.getElementById('lifeguard-status').value;
        
        // Validate required fields
        if (!sheetNumber || !name || !hireDate || !status) {
            this.showToast('Please fill in all required fields', 'error');
            return;
        }
        
        if (this.editingItem) {
            // Update existing lifeguard
            const lifeguard = this.editingItem;
            lifeguard.lifeguard_name = name;
            lifeguard.hire_date = hireDate;
            lifeguard.status = status;
            lifeguard.active = status === 'ACTIVE';
            
            this.logActivity('EDIT_LIFEGUARD', `Updated lifeguard ${name} (Sheet ${sheetNumber})`);
            this.showToast('Lifeguard updated successfully', 'success');
        } else {
            // Create new lifeguard
            const newLifeguard = {
                sheet_number: sheetNumber,
                sheet_name: `Lifeguard_Audit_Sheet_${sheetNumber}`,
                lifeguard_name: name,
                active: status === 'ACTIVE',
                hire_date: hireDate,
                status: status
            };
            
            this.lifeguards.push(newLifeguard);
            this.logActivity('CREATE_LIFEGUARD', `Added new lifeguard ${name} (Sheet ${sheetNumber})`);
            this.showToast('Lifeguard created successfully', 'success');
        }
        
        // SAVE TO LOCALSTORAGE
        this.saveAllData();
        
        this.closeModal();
        this.loadLifeguards(); // Refresh the table
    }

    // USER MODALS
    openAddUserModal() {
        console.log('Opening Add User Modal');
        this.editingItem = null;
        this.editingType = 'user';
        
        const modalContent = `
            <div class="modal-header">
                <h2>Add New User</h2>
                <button class="modal-close" onclick="app.closeModal()">&times;</button>
            </div>
            <div class="modal-body">
                <form id="user-form">
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label" for="user-username">Username *</label>
                            <input type="text" id="user-username" class="form-control" required placeholder="Enter full name">
                        </div>
                        <div class="form-group">
                            <label class="form-label" for="user-password">Password *</label>
                            <input type="password" id="user-password" class="form-control" required placeholder="Enter password">
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label" for="user-role">Role *</label>
                        <select id="user-role" class="form-control" required>
                            <option value="">Select Role</option>
                            <option value="ADMIN">Admin</option>
                            <option value="VIEWER">Viewer</option>
                        </select>
                    </div>
                    
                    <div class="permissions-section">
                        <h4>Individual Permissions</h4>
                        <div class="permissions-grid">
                            <label class="permission-item">
                                <input type="checkbox" id="perm-manage-users"> Manage Users
                            </label>
                            <label class="permission-item">
                                <input type="checkbox" id="perm-create-users"> Create Users
                            </label>
                            <label class="permission-item">
                                <input type="checkbox" id="perm-deactivate-users"> Deactivate Users
                            </label>
                            <label class="permission-item">
                                <input type="checkbox" id="perm-edit-audits"> Edit All Audits
                            </label>
                            <label class="permission-item">
                                <input type="checkbox" id="perm-view-audits"> View All Audits
                            </label>
                            <label class="permission-item">
                                <input type="checkbox" id="perm-create-audits"> Create Audits
                            </label>
                            <label class="permission-item">
                                <input type="checkbox" id="perm-manage-lifeguards"> Manage Lifeguards
                            </label>
                            <label class="permission-item">
                                <input type="checkbox" id="perm-view-activity"> View Activity Log
                            </label>
                            <label class="permission-item">
                                <input type="checkbox" id="perm-export-data"> Export Data
                            </label>
                        </div>
                    </div>
                </form>
                
                <div class="form-actions">
                    <button type="button" class="btn btn--secondary" onclick="app.closeModal()">Cancel</button>
                    <button type="button" class="btn btn--primary" onclick="app.saveUser()">Save User</button>
                </div>
            </div>
        `;
        
        this.showModal(modalContent);
        
        // Add role change handler
        document.getElementById('user-role').addEventListener('change', (e) => {
            this.setDefaultPermissions(e.target.value);
        });
    }

    openEditUserModal(userId) {
        console.log('Opening Edit User Modal for ID:', userId);
        const user = this.users.find(u => u.id === userId);
        if (!user) {
            this.showToast('User not found', 'error');
            return;
        }
        
        this.editingItem = user;
        this.editingType = 'user';
        
        const modalContent = `
            <div class="modal-header">
                <h2>Edit User - ${user.username}</h2>
                <button class="modal-close" onclick="app.closeModal()">&times;</button>
            </div>
            <div class="modal-body">
                <form id="user-form">
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label" for="user-username">Username *</label>
                            <input type="text" id="user-username" class="form-control" required placeholder="Enter full name" value="${user.username}">
                        </div>
                        <div class="form-group">
                            <label class="form-label" for="user-password">Password *</label>
                            <input type="password" id="user-password" class="form-control" required placeholder="Enter password" value="${user.password}">
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label" for="user-role">Role *</label>
                        <select id="user-role" class="form-control" required>
                            <option value="">Select Role</option>
                            <option value="ADMIN" ${user.role === 'ADMIN' ? 'selected' : ''}>Admin</option>
                            <option value="VIEWER" ${user.role === 'VIEWER' ? 'selected' : ''}>Viewer</option>
                        </select>
                    </div>
                    
                    <div class="permissions-section">
                        <h4>Individual Permissions</h4>
                        <div class="permissions-grid">
                            <label class="permission-item">
                                <input type="checkbox" id="perm-manage-users" ${user.individual_permissions.can_manage_users ? 'checked' : ''}> Manage Users
                            </label>
                            <label class="permission-item">
                                <input type="checkbox" id="perm-create-users" ${user.individual_permissions.can_create_users ? 'checked' : ''}> Create Users
                            </label>
                            <label class="permission-item">
                                <input type="checkbox" id="perm-deactivate-users" ${user.individual_permissions.can_deactivate_users ? 'checked' : ''}> Deactivate Users
                            </label>
                            <label class="permission-item">
                                <input type="checkbox" id="perm-edit-audits" ${user.individual_permissions.can_edit_all_audits ? 'checked' : ''}> Edit All Audits
                            </label>
                            <label class="permission-item">
                                <input type="checkbox" id="perm-view-audits" ${user.individual_permissions.can_view_all_audits ? 'checked' : ''}> View All Audits
                            </label>
                            <label class="permission-item">
                                <input type="checkbox" id="perm-create-audits" ${user.individual_permissions.can_create_audits ? 'checked' : ''}> Create Audits
                            </label>
                            <label class="permission-item">
                                <input type="checkbox" id="perm-manage-lifeguards" ${user.individual_permissions.can_manage_lifeguards ? 'checked' : ''}> Manage Lifeguards
                            </label>
                            <label class="permission-item">
                                <input type="checkbox" id="perm-view-activity" ${user.individual_permissions.can_view_activity_log ? 'checked' : ''}> View Activity Log
                            </label>
                            <label class="permission-item">
                                <input type="checkbox" id="perm-export-data" ${user.individual_permissions.can_export_data ? 'checked' : ''}> Export Data
                            </label>
                        </div>
                    </div>
                </form>
                
                <div class="form-actions">
                    <button type="button" class="btn btn--secondary" onclick="app.closeModal()">Cancel</button>
                    <button type="button" class="btn btn--primary" onclick="app.saveUser()">Update User</button>
                </div>
            </div>
        `;
        
        this.showModal(modalContent);
        
        // Add role change handler
        document.getElementById('user-role').addEventListener('change', (e) => {
            this.setDefaultPermissions(e.target.value);
        });
    }

    setDefaultPermissions(role) {
        const permissions = {
            'ADMIN': {
                'perm-edit-audits': true,
                'perm-view-audits': true,
                'perm-create-audits': true,
                'perm-manage-lifeguards': true,
                'perm-view-activity': true,
                'perm-export-data': true
            },
            'VIEWER': {
                'perm-view-audits': true
            }
        };
        
        // Clear all checkboxes first
        document.querySelectorAll('.permission-item input[type="checkbox"]').forEach(cb => {
            cb.checked = false;
        });
        
        // Set default permissions for role
        if (permissions[role]) {
            Object.keys(permissions[role]).forEach(permId => {
                const checkbox = document.getElementById(permId);
                if (checkbox) {
                    checkbox.checked = permissions[role][permId];
                }
            });
        }
    }

    saveUser() {
        console.log('Saving user...');
        
        // Get form data
        const username = document.getElementById('user-username').value.trim();
        const password = document.getElementById('user-password').value.trim();
        const role = document.getElementById('user-role').value;
        
        // Validate required fields
        if (!username || !password || !role) {
            this.showToast('Please fill in all required fields', 'error');
            return;
        }
        
        // Get permissions
        const permissions = {
            can_manage_users: document.getElementById('perm-manage-users').checked,
            can_create_users: document.getElementById('perm-create-users').checked,
            can_deactivate_users: document.getElementById('perm-deactivate-users').checked,
            can_edit_all_audits: document.getElementById('perm-edit-audits').checked,
            can_view_all_audits: document.getElementById('perm-view-audits').checked,
            can_create_audits: document.getElementById('perm-create-audits').checked,
            can_manage_lifeguards: document.getElementById('perm-manage-lifeguards').checked,
            can_view_activity_log: document.getElementById('perm-view-activity').checked,
            can_view_admin_metrics: false,
            can_export_data: document.getElementById('perm-export-data').checked,
            can_modify_permissions: false
        };
        
        if (this.editingItem) {
            // Update existing user
            const user = this.editingItem;
            user.username = username;
            user.password = password;
            user.role = role;
            user.individual_permissions = permissions;
            
            this.logActivity('EDIT_USER', `Updated user ${username}`);
            this.showToast('User updated successfully', 'success');
        } else {
            // Create new user
            const newUser = {
                id: Math.max(...this.users.map(u => u.id), 0) + 1,
                username: username,
                role: role,
                password: password,
                active: true,
                created_by: this.currentUser.username,
                created_date: new Date().toISOString().split('T')[0],
                last_login: null,
                individual_permissions: permissions
            };
            
            this.users.push(newUser);
            this.logActivity('CREATE_USER', `Created new user ${username}`);
            this.showToast('User created successfully', 'success');
        }
        
        // SAVE TO LOCALSTORAGE
        this.saveAllData();
        
        this.closeModal();
        this.loadUserManagement(); // Refresh the table
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

    viewAuditDetails(auditId) {
        const audit = this.audits.find(a => a.id === auditId);
        if (audit) {
            this.showToast(`Audit Details: ${audit.lifeguard_name} - ${audit.audit_type} (${audit.result}) by ${audit.auditor_name}`, 'info');
        }
    }

    viewLifeguardDetails(lifeguardName) {
        const lifeguard = this.lifeguards.find(lg => lg.lifeguard_name === lifeguardName);
        const audits = this.audits.filter(a => a.lifeguard_name === lifeguardName);
        if (lifeguard) {
            this.showToast(`${lifeguardName}: ${audits.length} total audits, hired ${new Date(lifeguard.hire_date).toLocaleDateString()}`, 'info');
        }
    }

    confirmDeleteLifeguard(sheetNumber) {
        if (confirm('Are you sure you want to delete this lifeguard? This action cannot be undone.')) {
            const lifeguardIndex = this.lifeguards.findIndex(lg => lg.sheet_number === sheetNumber);
            if (lifeguardIndex > -1) {
                const lifeguard = this.lifeguards[lifeguardIndex];
                this.lifeguards.splice(lifeguardIndex, 1);
                this.logActivity('DELETE_LIFEGUARD', `Deleted lifeguard ${lifeguard.lifeguard_name} (Sheet ${sheetNumber})`);
                
                // SAVE TO LOCALSTORAGE
                this.saveAllData();
                
                this.showToast('Lifeguard deleted successfully', 'success');
                this.loadLifeguards();
            }
        }
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
                
                // SAVE TO LOCALSTORAGE
                this.saveAllData();
                
                this.loadUserManagement();
                this.showToast(`${user.username} ${action}d successfully`, 'success');
            }
        }
    }

    clearActivityLog() {
        if (confirm('Are you sure you want to clear the activity log?')) {
            this.activityLog = [];
            
            // SAVE TO LOCALSTORAGE
            this.saveAllData();
            
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
        
        // Reset editing state
        this.editingItem = null;
        this.editingType = null;
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
            id: Math.max(...this.activityLog.map(a => a.id), 0) + 1,
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
        
        // SAVE TO LOCALSTORAGE
        this.saveAllData();
        
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
    console.log('DOM loaded, initializing complete lifeguard audit system with data persistence...');
    app = new LifeguardAuditApp();
});
