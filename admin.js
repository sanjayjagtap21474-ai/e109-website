document.addEventListener('DOMContentLoaded', () => {
    // --- Global Theme Application ---
    function applyGlobalTheme() {
        const theme = JSON.parse(localStorage.getItem('ekavoo_theme'));
        if (theme) {
            const root = document.documentElement;
            root.style.setProperty('--theme-primary', theme.primary);
            root.style.setProperty('--theme-secondary', theme.secondary);
            root.style.setProperty('--theme-bg', theme.bg);
            root.style.setProperty('--theme-heading-font', theme.headingFont);
            root.style.setProperty('--theme-body-font', theme.bodyFont);
        }
    }
    applyGlobalTheme();

    const adminToast = document.getElementById('adminToast');
    const adminToastMsg = document.getElementById('adminToastMsg');

    function showToast(message, type = 'success') {
        if (!adminToast) return;
        adminToastMsg.textContent = message;
        adminToast.classList.add('active');
        setTimeout(() => {
            adminToast.classList.remove('active');
        }, 3000);
    }

    // --- Elements ---
    const adminLoginView = document.getElementById('adminLoginView');
    const adminOtpView = document.getElementById('adminOtpView');
    const adminDashboardView = document.getElementById('adminDashboardView');
    const adminLoginForm = document.getElementById('adminLoginForm');
    const adminOtpForm = document.getElementById('adminOtpForm');
    const adminLoginError = document.getElementById('adminLoginError');
    const adminOtpError = document.getElementById('adminOtpError');
    const adminLogoutBtn = document.getElementById('adminLogoutBtn');
    const otpCountdown = document.getElementById('otpCountdown');
    const resendOtpBtn = document.getElementById('resendOtpBtn');
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const adminSidebar = document.querySelector('.admin-sidebar');

    const navItems = document.querySelectorAll('.admin-nav-item[data-content]');
    const contentPanes = document.querySelectorAll('.admin-content-pane');
    const sectionTitle = document.getElementById('adminSectionTitle');

    // --- State Variables ---
    let products = [];
    let customers = [];
    let orders = [];

    // --- Load Data ---
    function loadData() {
        const savedProducts = JSON.parse(localStorage.getItem('ekavoo_products'));
        const defaultProducts = [
            { id: 'velvet-rose-absolute', title: 'Velvet Rose Absolute', price: 19600.00, images: ['https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=800&auto=format&fit=crop', 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?q=80&w=800&auto=format&fit=crop', 'https://images.unsplash.com/photo-1587017539504-67cfbddac569?q=80&w=800&auto=format&fit=crop'], category: 'fragrance', description: 'Deep Moroccan rose intertwined with warm amber.', stock: 15 },
            { id: 'midnight-oud', title: 'Midnight Oud', price: 24800.00, images: ['https://images.unsplash.com/photo-1595425970377-c9703bc48b2d?q=80&w=800&auto=format&fit=crop', 'https://images.unsplash.com/photo-1547887538-e3a2f32cb1cc?q=80&w=800&auto=format&fit=crop', 'https://images.unsplash.com/photo-1615160411333-8a3c2007f353?q=80&w=800&auto=format&fit=crop'], category: 'fragrance', description: 'Rich agarwood balanced with sweet vanilla.', stock: 8 },
            { id: 'luminous-citrus', title: 'Luminous Citrus', price: 14800.00, images: ['https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?q=80&w=800&auto=format&fit=crop', 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=800&auto=format&fit=crop'], category: 'fragrance', description: 'Sparkling bergamot and neroli essence.', stock: 12 },
            { id: 'cashmere-wood', title: 'Cashmere Wood', price: 17600.00, images: ['https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=800&auto=format&fit=crop', 'https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=800&auto=format&fit=crop', 'https://images.unsplash.com/photo-1615160411333-8a3c2007f353?q=80&w=800&auto=format&fit=crop'], category: 'fragrance', description: 'Soft sandalwood with hints of spicy cardamom.', stock: 20 },
            { id: 'white-jasmine', title: 'White Jasmine', price: 15600.00, images: ['https://images.unsplash.com/photo-1547887538-e3a2f32cb1cc?q=80&w=800&auto=format&fit=crop', 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?q=80&w=800&auto=format&fit=crop'], category: 'fragrance', description: 'Pure nocturnal jasmine blooms on a musky base.', stock: 5 },
            { id: 'golden-elixir', title: 'Golden Elixir', price: 16800.00, images: ['https://images.unsplash.com/photo-1615160411333-8a3c2007f353?q=80&w=800&auto=format&fit=crop', 'https://images.unsplash.com/photo-1595425970377-c9703bc48b2d?q=80&w=800&auto=format&fit=crop', 'https://images.unsplash.com/photo-1587017539504-67cfbddac569?q=80&w=800&auto=format&fit=crop'], category: 'fragrance', description: 'A royal blend of saffron and oud.', stock: 10 }
        ];
        // Backward-compatibility: migrate old `image` field to `images` array
        const rawProducts = (savedProducts && savedProducts.length > 0) ? savedProducts : defaultProducts;
        products = rawProducts.map(p => {
            if (!p.images) p.images = [p.image].filter(Boolean);
            return p;
        });

        customers = JSON.parse(localStorage.getItem('ekavoo_customers')) || [
            { name: 'Alex Johnson', email: 'alex.j@example.com', phone: '+91 98765 43210', date: 'Oct 12, 2025', orders: 5, status: 'Active' },
            { name: 'Sarah Miller', email: 'sarah.m@gmail.com', phone: '+91 87654 32109', date: 'Nov 05, 2025', orders: 2, status: 'Active' }
        ];

        orders = JSON.parse(localStorage.getItem('ekavoo_orders')) || [
            { id: 'EK-8472910', customer: 'Alex Johnson', date: 'Mar 01, 2026', items: 'Velvet Rose Absolute (1)', amount: 19600.0, status: 'Delivered' }
        ];
    }
    loadData();

    // --- Authentication & 2FA State ---
    let isAdminLoggedIn = sessionStorage.getItem('ekavoo_admin_logged') === 'true';
    let otpTimer = null;
    let secondsLeft = 120;

    function checkAuth() {
        if (isAdminLoggedIn) {
            if (adminLoginView) adminLoginView.style.display = 'none';
            if (adminOtpView) adminOtpView.style.display = 'none';
            if (adminDashboardView) adminDashboardView.style.display = 'grid';
            initDashboard();
        } else {
            if (adminLoginView) adminLoginView.style.display = 'flex';
            if (adminOtpView) adminOtpView.style.display = 'none';
            if (adminDashboardView) adminDashboardView.style.display = 'none';
        }
    }

    // --- OTP Logic ---
    function generateOTP() {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const timestamp = Date.now();
        sessionStorage.setItem('ekavoo_admin_otp', otp);
        sessionStorage.setItem('ekavoo_admin_otp_time', timestamp);

        console.log(`%c [SECURITY] OTP Generated: ${otp}`, 'color: #d4af37; font-weight: bold; font-size: 1.2rem;');
        console.log(`Sending SMS to: 9168431275...`);
        console.log(`Sending Email to: jagtapprerna03@gmail.com...`);
        alert(`Verification code sent to your mobile and email.\n(For testing, use code: ${otp})`);

        startOtpTimer();
    }

    function startOtpTimer() {
        clearInterval(otpTimer);
        secondsLeft = 120;
        if (resendOtpBtn) resendOtpBtn.style.display = 'none';
        updateTimerDisplay();

        otpTimer = setInterval(() => {
            secondsLeft--;
            updateTimerDisplay();
            if (secondsLeft <= 0) {
                clearInterval(otpTimer);
                if (resendOtpBtn) resendOtpBtn.style.display = 'inline-block';
            }
        }, 1000);
    }

    function updateTimerDisplay() {
        if (!otpCountdown) return;
        const mins = Math.floor(secondsLeft / 60);
        const secs = secondsLeft % 60;
        otpCountdown.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    const otpInputs = document.querySelectorAll('.otp-input');
    otpInputs.forEach((input, index) => {
        input.addEventListener('input', (e) => {
            if (e.target.value.length === 1 && index < otpInputs.length - 1) {
                otpInputs[index + 1].focus();
            }
        });
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace' && !e.target.value && index > 0) {
                otpInputs[index - 1].focus();
            }
        });
    });

    if (adminLoginForm) {
        adminLoginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const id = document.getElementById('adminId').value;
            const pass = document.getElementById('adminPassword').value;
            if (id === 'admin@kavoo.com' && pass === 'Admin123') {
                adminLoginView.style.display = 'none';
                adminOtpView.style.display = 'flex';
                generateOTP();
            } else {
                adminLoginError.style.display = 'block';
            }
        });
    }

    if (adminOtpForm) {
        adminOtpForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const enteredOtp = Array.from(otpInputs).map(i => i.value).join('');
            const storedOtp = sessionStorage.getItem('ekavoo_admin_otp');
            const otpTime = parseInt(sessionStorage.getItem('ekavoo_admin_otp_time'));
            const isExpired = (Date.now() - otpTime) > 120000;

            if (enteredOtp === storedOtp && !isExpired) {
                isAdminLoggedIn = true;
                sessionStorage.setItem('ekavoo_admin_logged', 'true');
                sessionStorage.removeItem('ekavoo_admin_otp');
                sessionStorage.removeItem('ekavoo_admin_otp_time');
                clearInterval(otpTimer);
                checkAuth();
            } else {
                adminOtpError.textContent = isExpired ? 'OTP has expired. Please resend.' : 'Incorrect OTP. Please try again.';
                adminOtpError.style.display = 'block';
            }
        });
    }

    if (resendOtpBtn) {
        resendOtpBtn.addEventListener('click', () => {
            adminOtpError.style.display = 'none';
            otpInputs.forEach(i => i.value = '');
            otpInputs[0].focus();
            generateOTP();
        });
    }

    if (adminLogoutBtn) {
        adminLogoutBtn.addEventListener('click', () => {
            isAdminLoggedIn = false;
            sessionStorage.removeItem('ekavoo_admin_logged');
            sessionStorage.removeItem('ekavoo_admin_otp');
            sessionStorage.removeItem('ekavoo_admin_otp_time');
            clearInterval(otpTimer);
            checkAuth();
        });
    }

    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', () => {
            adminSidebar.classList.toggle('open');
            const icon = mobileMenuToggle.querySelector('i');
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-xmark');
        });
    }

    // --- Navigation Logic ---
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const target = item.dataset.content;
            navItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            contentPanes.forEach(pane => {
                pane.style.display = pane.id === `${target}Pane` ? 'block' : 'none';
            });

            if (target === 'sales') {
                updateStats();
                initCharts();
            } else if (target === 'orders') {
                renderOrders();
            } else if (target === 'products') {
                renderProducts();
            } else if (target === 'customers') {
                renderCustomers();
            } else if (target === 'analytics') {
                renderAnalytics();
                initCharts();
            } else if (target === 'inventory') {
                renderInventory();
            }

            if (window.innerWidth <= 768) {
                adminSidebar.classList.remove('open');
                const icon = mobileMenuToggle.querySelector('i');
                icon.classList.add('fa-bars');
                icon.classList.remove('fa-xmark');
            }

            const labels = {
                sales: 'Sales Dashboard',
                products: 'Product Management',
                inventory: 'Inventory Management',
                orders: 'Order Management',
                customers: 'Customer Management',
                analytics: 'Analytics',
                prices: 'Price & Discounts',
                homepage: 'Storefront Editor',
                footer: 'Footer Settings',
                theme: 'Theme Settings'
            };
            sectionTitle.textContent = labels[target];
        });
    });

    // --- Search & Filter Listeners ---
    ['orderSearchInput', 'orderStatusFilter'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('input', renderOrders);
    });
    ['customerSearchInput'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('input', renderCustomers);
    });
    ['inventorySearchInput'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('input', renderInventory);
    });
    const productSearchInput = document.getElementById('productSearchInput');
    if (productSearchInput) {
        productSearchInput.addEventListener('input', () => {
            const term = productSearchInput.value.toLowerCase();
            const rows = document.querySelectorAll('#adminProductsTable tr');
            rows.forEach(row => {
                const text = row.textContent.toLowerCase();
                row.style.display = text.includes(term) ? '' : 'none';
            });
        });
    }

    // --- Data Management ---
    function broadcastDataChange(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
        window.dispatchEvent(new CustomEvent('kavoo:data-updated', { detail: { key, value } }));
    }

    function saveProducts() { broadcastDataChange('ekavoo_products', products); }
    function saveCustomers() { broadcastDataChange('ekavoo_customers', customers); }
    function saveOrders() { broadcastDataChange('ekavoo_orders', orders); }

    function initDashboard() {
        renderProducts();
        renderOrders();
        renderCustomers();
        renderAnalytics();
        renderInventory();
        updateStats();
        initCharts();
        if(window.loadAnalyticsData) window.loadAnalyticsData();
    }

    // --- Analytics Dashboard Logic ---
    window.loadAnalyticsData = function() {
        const events = JSON.parse(localStorage.getItem('ekavoo_analytics_events')) || [];
        
        // Compute Metrics
        const now = Date.now();
        const fiveMins = 5 * 60 * 1000;
        
        // Active sessions in the last 5 minutes (based on latest timestamp per session)
        const sessionMap = {};
        let quizStarts = 0;
        let quizCompletes = 0;

        events.forEach(e => {
            if(!sessionMap[e.sessionId] || sessionMap[e.sessionId].timestamp < e.timestamp) {
                sessionMap[e.sessionId] = e;
            }
            if(e.type === 'quiz_started') quizStarts++;
            if(e.type === 'quiz_completed') quizCompletes++;
        });

        let activeSessionsCount = 0;
        Object.values(sessionMap).forEach(sess => {
            if(now - sess.timestamp < fiveMins) activeSessionsCount++;
        });

        const totalSessions = Object.keys(sessionMap).length;
        const totalPageviews = events.filter(e => e.type === 'pageview').length;

        // UI Updates
        if(document.getElementById('liveVisitorCount')) document.getElementById('liveVisitorCount').innerText = activeSessionsCount;
        if(document.getElementById('totalSessionsCount')) document.getElementById('totalSessionsCount').innerText = totalSessions;
        if(document.getElementById('totalPageviewsCount')) document.getElementById('totalPageviewsCount').innerText = totalPageviews;
        
        const completionRate = quizStarts > 0 ? Math.round((quizCompletes / quizStarts) * 100) : 0;
        if(document.getElementById('quizCompletionRate')) document.getElementById('quizCompletionRate').innerText = completionRate + '%';
        if(document.getElementById('quizFunnelText')) document.getElementById('quizFunnelText').innerText = `${quizStarts} started / ${quizCompletes} finished`;

        // Render Table
        const table = document.getElementById('visitorLogTable');
        if(table) {
            table.innerHTML = '';
            // sort by timestamp desc, limit to last 100
            const sortedEvents = [...events].sort((a,b) => b.timestamp - a.timestamp).slice(0, 100);
            sortedEvents.forEach(e => {
                const dateStr = new Date(e.timestamp).toLocaleString();
                const typeStyle = e.type === 'pageview' ? 'color:#666' : 'color:var(--theme-primary); font-weight:bold';
                table.innerHTML += `
                    <tr>
                        <td style="font-size:0.85rem">${dateStr}</td>
                        <td style="${typeStyle}; text-transform:uppercase; font-size:0.8rem">${e.type}</td>
                        <td><a href="${e.path}" target="_blank" style="color:inherit; text-decoration:underline;">${e.path}</a></td>
                        <td>${e.device}</td>
                        <td>${e.location}</td>
                        <td style="font-size:0.8rem; max-width:120px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap" title="${e.referrer}">${e.referrer}</td>
                        <td style="font-size:0.7rem; color:#aaa">${e.sessionId}</td>
                    </tr>
                `;
            });
        }
    };

    function updateStats() {
        const totalSales = orders.reduce((sum, order) => sum + order.amount, 0);
        const todaySales = orders.filter(o => o.date.includes('Mar 06')).reduce((sum, order) => sum + order.amount, 0);

        if (document.getElementById('statSales')) document.getElementById('statSales').textContent = `₹${totalSales.toLocaleString()}`;
        if (document.getElementById('statTodaySales')) document.getElementById('statTodaySales').textContent = `₹${todaySales.toLocaleString()}`;
        if (document.getElementById('statOrders')) document.getElementById('statOrders').textContent = orders.length;
        if (document.getElementById('statUsers')) document.getElementById('statUsers').textContent = customers.filter(c => c.status === 'Active').length;

        // Inventory Stats
        const lowStockItems = products.filter(p => p.stock > 0 && p.stock < 10);
        const outOfStockItems = products.filter(p => p.stock <= 0);

        if (document.getElementById('invTotalStock')) document.getElementById('invTotalStock').textContent = products.reduce((s, p) => s + p.stock, 0);
        if (document.getElementById('invLowStock')) document.getElementById('invLowStock').textContent = lowStockItems.length;
        if (document.getElementById('invOutStock')) document.getElementById('invOutStock').textContent = outOfStockItems.length;

        // Low Stock Alert Banner
        const lowStockBanner = document.getElementById('lowStockAlert');
        if (lowStockBanner) {
            if (lowStockItems.length > 0 || outOfStockItems.length > 0) {
                lowStockBanner.style.display = 'block';
                const msg = document.getElementById('lowStockMessage');
                msg.textContent = `${lowStockItems.length} items are low on stock, and ${outOfStockItems.length} are out of stock.`;
            } else {
                lowStockBanner.style.display = 'none';
            }
        }
    }

    function renderProducts() {
        const table = document.getElementById('adminProductsTable');
        if (!table) return;
        table.innerHTML = '';
        products.forEach((product, index) => {
            const stockStatus = product.stock > 0 ? `<span style="color: #4CAF50;">In Stock</span>` : `<span style="color: #ff4d4f;">Out of Stock</span>`;
            const thumb = product.images ? product.images[0] : (product.image || '');
            table.innerHTML += `
                <tr>
                    <td><img src="${thumb}" style="width: 40px; height: 50px; object-fit: cover; border-radius: 4px;"></td>
                    <td><strong>${product.title}</strong></td>
                    <td style="text-transform: capitalize;">${product.category}</td>
                    <td>₹${product.price.toLocaleString()}</td>
                    <td>${product.stock}</td>
                    <td>${stockStatus}</td>
                    <td>
                        <button class="admin-action-btn edit" onclick="editProduct(${index})"><i class="fa-solid fa-pen"></i></button>
                        <button class="admin-action-btn delete" onclick="deleteProduct(${index})"><i class="fa-solid fa-trash"></i></button>
                    </td>
                </tr>
            `;
        });
    }

    function renderOrders() {
        const recentTable = document.getElementById('recentOrdersTable');
        const allTable = document.getElementById('allOrdersTable');
        const searchInput = document.getElementById('orderSearchInput');
        const statusFilter = document.getElementById('orderStatusFilter');

        const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
        const statusTerm = statusFilter ? statusFilter.value : 'all';

        const filteredOrders = orders.filter(order => {
            const matchesSearch = order.id.toLowerCase().includes(searchTerm) || order.customer.toLowerCase().includes(searchTerm);
            const matchesStatus = statusTerm === 'all' || order.status.toLowerCase() === statusTerm;
            return matchesSearch && matchesStatus;
        });

        if (recentTable) {
            recentTable.innerHTML = '';
            orders.slice(0, 5).forEach(order => {
                recentTable.innerHTML += `
                    <tr>
                        <td>${order.id}</td>
                        <td>${order.customer}</td>
                        <td>${order.date}</td>
                        <td>₹${order.amount.toLocaleString()}</td>
                        <td><span class="status-badge status-${order.status.toLowerCase()}">${order.status}</span></td>
                    </tr>
                `;
            });
        }

        if (allTable) {
            allTable.innerHTML = '';
            filteredOrders.forEach((order) => {
                allTable.innerHTML += `
                    <tr>
                        <td>${order.id}</td>
                        <td>${order.date}</td>
                        <td>
                            <strong>${order.customer}</strong><br>
                            <small style="color: #666;">${order.items}</small>
                        </td>
                        <td>₹${order.amount.toLocaleString()}</td>
                        <td>${order.items.split(',').length} items</td>
                        <td>
                            <select onchange="updateOrderStatus('${order.id}', this.value)" class="status-badge status-${order.status.toLowerCase()}" style="border:none; cursor:pointer;">
                                <option value="Pending" ${order.status === 'Pending' ? 'selected' : ''}>Pending</option>
                                <option value="Processing" ${order.status === 'Processing' ? 'selected' : ''}>Processing</option>
                                <option value="Shipped" ${order.status === 'Shipped' ? 'selected' : ''}>Shipped</option>
                                <option value="Delivered" ${order.status === 'Delivered' ? 'selected' : ''}>Delivered</option>
                                <option value="Cancelled" ${order.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
                            </select>
                        </td>
                        <td>
                            <button class="admin-action-btn"><i class="fa-solid fa-eye"></i></button>
                        </td>
                    </tr>
                `;
            });
        }
    }

    window.updateOrderStatus = (orderId, newStatus) => {
        const order = orders.find(o => o.id === orderId);
        if (order) {
            order.status = newStatus;
            saveOrders();
            renderOrders();
            updateStats();
        }
    };

    function renderCustomers() {
        const table = document.getElementById('adminCustomersTable');
        const searchInput = document.getElementById('customerSearchInput');
        if (!table) return;

        const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
        const filteredCustomers = customers.filter(c => c.name.toLowerCase().includes(searchTerm) || c.email.toLowerCase().includes(searchTerm) || c.phone.includes(searchTerm));

        table.innerHTML = '';
        filteredCustomers.forEach((customer, index) => {
            table.innerHTML += `
                <tr>
                    <td><strong>${customer.name}</strong></td>
                    <td>${customer.email}</td>
                    <td>${customer.phone}</td>
                    <td>${customer.date}</td>
                    <td>${customer.orders} orders</td>
                    <td><span class="status-badge" style="background: ${customer.status === 'Active' ? '#f6ffed' : '#fff1f0'}; color: ${customer.status === 'Active' ? '#52c41a' : '#f5222d'};">${customer.status}</span></td>
                    <td>
                        <div class="action-btn-group">
                            <button class="admin-action-btn" onclick="toggleCustomerStatus(${index})"><i class="fa-solid fa-${customer.status === 'Active' ? 'user-slash' : 'user-check'}"></i></button>
                            <button class="admin-action-btn delete" onclick="deleteCustomer(${index})"><i class="fa-solid fa-trash"></i></button>
                        </div>
                    </td>
                </tr>
            `;
        });
    }

    window.toggleCustomerStatus = (index) => {
        customers[index].status = customers[index].status === 'Active' ? 'Blocked' : 'Active';
        saveCustomers();
        renderCustomers();
        updateStats();
    };

    window.deleteCustomer = (index) => {
        if (confirm('Are you sure you want to remove this customer?')) {
            customers.splice(index, 1);
            saveCustomers();
            renderCustomers();
            updateStats();
        }
    };

    function renderAnalytics() {
        const reportTable = document.getElementById('monthlyReportTable');
        if (!reportTable) return;
        const reports = [
            { month: 'February 2026', orders: 142, revenue: 2624500, avg: 18482, growth: '+12%' },
            { month: 'January 2026', orders: 128, revenue: 2145800, avg: 16764, growth: '+8%' },
            { month: 'December 2025', orders: 210, revenue: 4125000, avg: 19642, growth: '+45%' }
        ];
        reportTable.innerHTML = '';
        reports.forEach(r => {
            reportTable.innerHTML += `
                <tr>
                    <td><strong>${r.month}</strong></td>
                    <td>${r.orders}</td>
                    <td>₹${r.revenue.toLocaleString()}</td>
                    <td>₹${r.avg.toLocaleString()}</td>
                    <td style="color: #4CAF50; font-weight: 600;">${r.growth}</td>
                </tr>
            `;
        });
    }

    function renderInventory() {
        const table = document.getElementById('adminInventoryTable');
        const searchInput = document.getElementById('inventorySearchInput');
        if (!table) return;

        const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
        const filteredProducts = products.filter(p => p.title.toLowerCase().includes(searchTerm));

        table.innerHTML = '';
        filteredProducts.forEach((product, index) => {
            let statusClass = 'stock-ok';
            let statusText = 'In Stock';

            if (product.stock <= 0) {
                statusClass = 'stock-out';
                statusText = 'Out of Stock';
            } else if (product.stock < 10) {
                statusClass = 'stock-low';
                statusText = 'Low Stock';
            }

            table.innerHTML += `
                <tr>
                    <td><strong>${product.title}</strong></td>
                    <td style="text-transform: capitalize;">${product.category}</td>
                    <td>₹${product.price.toLocaleString()}</td>
                    <td><strong style="font-size: 1.1rem;">${product.stock}</strong></td>
                    <td><span class="stock-badge ${statusClass}">${statusText}</span></td>
                    <td>
                        <div class="action-btn-group">
                            <button class="adjust-btn minus" onclick="adjustStock('${product.id}', -1)"><i class="fa-solid fa-minus"></i></button>
                            <button class="adjust-btn plus" onclick="adjustStock('${product.id}', 1)"><i class="fa-solid fa-plus"></i></button>
                            <button class="adjust-btn" onclick="adjustStock('${product.id}', 10)" title="Add 10">+10</button>
                        </div>
                    </td>
                </tr>
            `;
        });
    }

    window.adjustStock = (productId, amount) => {
        const product = products.find(p => p.id === productId);
        if (product) {
            product.stock = Math.max(0, (product.stock || 0) + amount);
            saveProducts();
            renderInventory();
            renderProducts();
            updateStats();
        }
    };

    window.switchPane = (paneId) => {
        const item = Array.from(navItems).find(i => i.dataset.content === paneId);
        if (item) item.click();
    };

    function initCharts() {
        if (typeof Chart === 'undefined') {
            console.warn('Chart.js not loaded.');
            return;
        }
        const salesCtx = document.getElementById('salesTrendChart')?.getContext('2d');
        const categoryCtx = document.getElementById('categoryChart')?.getContext('2d');
        const performanceCtx = document.getElementById('performanceChart')?.getContext('2d');

        if (salesCtx) {
            new Chart(salesCtx, {
                type: 'line',
                data: {
                    labels: ['Mar 01', 'Mar 02', 'Mar 03', 'Mar 04', 'Mar 05', 'Mar 06'],
                    datasets: [{
                        label: 'Sales (₹)',
                        data: [120000, 150000, 110000, 180000, 210000, 245000],
                        borderColor: '#d4af37',
                        backgroundColor: 'rgba(212, 175, 55, 0.1)',
                        fill: true,
                        tension: 0.4
                    }]
                },
                options: { responsive: true, maintainAspectRatio: false }
            });
        }

        if (categoryCtx) {
            new Chart(categoryCtx, {
                type: 'doughnut',
                data: {
                    labels: ['Fragrance', 'Skincare', 'Makeup'],
                    datasets: [{
                        data: [65, 20, 15],
                        backgroundColor: ['#1a1a1a', '#d4af37', '#888']
                    }]
                },
                options: { responsive: true, maintainAspectRatio: false }
            });
        }

        if (performanceCtx) {
            new Chart(performanceCtx, {
                type: 'bar',
                data: {
                    labels: ['Velvet Rose', 'Midnight Oud', 'Luminous Citrus', 'Cashmere Wood', 'White Jasmine'],
                    datasets: [{
                        label: 'Units Sold',
                        data: [45, 32, 28, 24, 18],
                        backgroundColor: '#d4af37'
                    }]
                },
                options: { responsive: true, maintainAspectRatio: false }
            });
        }
    }

    // --- Product CRUD ---
    window.deleteProduct = (index) => {
        if (confirm('Are you sure you want to delete this product?')) {
            products.splice(index, 1);
            saveProducts();
            renderProducts();
            updateStats();
        }
    };
    window.editProduct = (index) => {
        const product = products[index];
        const imgs = product.images || (product.image ? [product.image] : []);
        document.getElementById('productModalTitle').textContent = 'Edit Product';
        document.getElementById('editProductId').value = index;
        document.getElementById('editProductName').value = product.title;
        document.getElementById('editProductPrice').value = product.price;
        document.getElementById('editProductStock').value = product.stock || 0;
        document.getElementById('editProductCategory').value = product.category;
        document.getElementById('editProductImage1').value = imgs[0] || '';
        document.getElementById('editProductImage2').value = imgs[1] || '';
        document.getElementById('editProductImage3').value = imgs[2] || '';
        document.getElementById('editProductDesc').value = product.description || '';
        // Update previews
        ['1','2','3'].forEach(n => updateImagePreview(n));
        document.getElementById('adminProductModal').style.display = 'flex';
    };

    // Image preview helper
    window.updateImagePreview = (n) => {
        const input = document.getElementById(`editProductImage${n}`);
        const preview = document.getElementById(`imgPreview${n}`);
        if (input && preview) {
            const url = input.value.trim();
            preview.src = url || '';
            preview.style.display = url ? 'block' : 'none';
        }
    };

    const productForm = document.getElementById('adminProductForm');
    if (productForm) {
        productForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const index = parseInt(document.getElementById('editProductId').value);
            const img1 = document.getElementById('editProductImage1').value.trim();
            const img2 = document.getElementById('editProductImage2').value.trim();
            const img3 = document.getElementById('editProductImage3').value.trim();
            const images = [img1, img2, img3].filter(Boolean);
            const productData = {
                id: index === -1 ? document.getElementById('editProductName').value.toLowerCase().replace(/ /g, '-') : (products[index]?.id || document.getElementById('editProductName').value.toLowerCase().replace(/ /g, '-')),
                title: document.getElementById('editProductName').value,
                price: parseFloat(document.getElementById('editProductPrice').value),
                stock: parseInt(document.getElementById('editProductStock').value),
                category: document.getElementById('editProductCategory').value,
                images: images,
                description: document.getElementById('editProductDesc').value
            };
            if (index === -1) {
                products.push(productData);
                showToast('Product added successfully!');
            } else {
                products[index] = productData;
                showToast('Product updated successfully!');
            }
            saveProducts();
            renderProducts();
            updateStats();
            document.getElementById('adminProductModal').style.display = 'none';
        });
    }

    if (document.getElementById('addNewProductBtn')) {
        document.getElementById('addNewProductBtn').addEventListener('click', () => {
            document.getElementById('productModalTitle').textContent = 'Add New Product';
            document.getElementById('adminProductForm').reset();
            document.getElementById('editProductId').value = '-1';
            document.getElementById('adminProductModal').style.display = 'flex';
        });
    }

    if (document.getElementById('closeAdminModal')) {
        document.getElementById('closeAdminModal').addEventListener('click', () => {
            document.getElementById('adminProductModal').style.display = 'none';
        });
    }

    // --- Theme Management ---
    const themePrimary = document.getElementById('themePrimaryColor');
    const themeSecondary = document.getElementById('themeSecondaryColor');
    const themeBg = document.getElementById('themeBgColor');
    const themeHeading = document.getElementById('themeHeadingFont');
    const themeBody = document.getElementById('themeBodyFont');
    const saveThemeBtn = document.getElementById('saveThemeBtn');
    const resetThemeBtn = document.getElementById('resetThemeBtn');
    const previewBox = document.getElementById('themePreviewBox');

    const defaultTheme = {
        primary: '#d4af37',
        secondary: '#1a1a1a',
        bg: '#fcf9f4',
        headingFont: "'Playfair Display', serif",
        bodyFont: "'Inter', sans-serif"
    };

    let currentTheme = JSON.parse(localStorage.getItem('ekavoo_theme')) || defaultTheme;

    function updatePreview() {
        if (!previewBox) return;
        const primary = themePrimary.value;
        const secondary = themeSecondary.value;
        const bg = themeBg.value;
        const heading = themeHeading.value;
        const body = themeBody.value;

        previewBox.querySelector('.preview-nav').style.fontFamily = heading;
        previewBox.querySelector('.preview-hero').style.backgroundColor = bg;
        previewBox.querySelector('.preview-hero').style.color = secondary;
        previewBox.querySelector('.preview-badge').style.color = primary;
        previewBox.querySelector('.preview-title').style.fontFamily = heading;
        previewBox.querySelector('.preview-btn').style.backgroundColor = primary;
        previewBox.querySelector('.preview-btn').style.color = (parseInt(primary.replace('#', ''), 16) > 0xcccccc) ? '#000' : '#fff';
        previewBox.querySelector('.preview-card-title').style.fontFamily = body;
        previewBox.style.fontFamily = body;
    }

    function loadThemeInputs() {
        if (!themePrimary) return;
        themePrimary.value = currentTheme.primary;
        themeSecondary.value = currentTheme.secondary;
        themeBg.value = currentTheme.bg;
        themeHeading.value = currentTheme.headingFont;
        themeBody.value = currentTheme.bodyFont;
        updatePreview();
    }

    if (themePrimary) {
        [themePrimary, themeSecondary, themeBg, themeHeading, themeBody].forEach(input => input.addEventListener('input', updatePreview));
        saveThemeBtn.addEventListener('click', () => {
            currentTheme = { primary: themePrimary.value, secondary: themeSecondary.value, bg: themeBg.value, headingFont: themeHeading.value, bodyFont: themeBody.value };
            localStorage.setItem('ekavoo_theme', JSON.stringify(currentTheme));
            const root = document.documentElement;
            root.style.setProperty('--theme-primary', currentTheme.primary);
            root.style.setProperty('--theme-secondary', currentTheme.secondary);
            root.style.setProperty('--theme-bg', currentTheme.bg);
            root.style.setProperty('--theme-heading-font', currentTheme.headingFont);
            root.style.setProperty('--theme-body-font', currentTheme.bodyFont);
            alert('Theme applied successfully!');
        });
        resetThemeBtn.addEventListener('click', () => {
            if (confirm('Reset to default theme?')) {
                currentTheme = { ...defaultTheme };
                localStorage.setItem('ekavoo_theme', JSON.stringify(currentTheme));
                loadThemeInputs();
                alert('Theme reset to default.');
            }
        });
    }

    // --- Footer Management ---
    const footerPhone = document.getElementById('footerPhone');
    const footerEmail = document.getElementById('footerEmail');
    const footerAddress = document.getElementById('footerAddress');
    const footerInsta = document.getElementById('footerInsta');
    const footerFb = document.getElementById('footerFb');
    const footerWa = document.getElementById('footerWa');
    const footerTwitter = document.getElementById('footerTwitter');
    const footerYoutube = document.getElementById('footerYoutube');
    const footerPrivacy = document.getElementById('footerPrivacy');
    const footerTerms = document.getElementById('footerTerms');
    const saveFooterBtn = document.getElementById('saveFooterBtn');

    const defaultFooter = {
        phone: '+91 90000 00000',
        email: 'contact@kavoo.com',
        address: '123 Luxury Avenue, Mumbai, India',
        insta: 'https://instagram.com/kavoo',
        fb: 'https://facebook.com/kavoo',
        wa: 'https://wa.me/919000000000',
        twitter: 'https://twitter.com/kavoo',
        youtube: 'https://youtube.com/kavoo',
        privacyPolicy: '',
        termsOfService: ''
    };

    let currentFooter = JSON.parse(localStorage.getItem('ekavoo_footer')) || defaultFooter;

    function loadFooterInputs() {
        if (!footerPhone) return;
        footerPhone.value = currentFooter.phone;
        footerEmail.value = currentFooter.email;
        footerAddress.value = currentFooter.address;
        footerInsta.value = currentFooter.insta;
        footerFb.value = currentFooter.fb;
        footerWa.value = currentFooter.wa;
        footerTwitter.value = currentFooter.twitter;
        if (footerYoutube) footerYoutube.value = currentFooter.youtube || '';

        if (footerPrivacy) footerPrivacy.value = currentFooter.privacyPolicy || '';
        if (footerTerms) footerTerms.value = currentFooter.termsOfService || '';
    }


    if (saveFooterBtn) {
        saveFooterBtn.addEventListener('click', () => {
            const originalText = saveFooterBtn.textContent;
            saveFooterBtn.disabled = true;
            saveFooterBtn.textContent = 'Saving...';
            saveFooterBtn.style.opacity = '0.7';

            setTimeout(() => {
                currentFooter = {
                    phone: footerPhone.value,
                    email: footerEmail.value,
                    address: footerAddress.value,
                    insta: footerInsta.value,
                    fb: footerFb.value,
                    wa: footerWa.value,
                    twitter: footerTwitter.value,
                    youtube: footerYoutube ? footerYoutube.value : '',
                    privacyPolicy: footerPrivacy.value,
                    termsOfService: footerTerms.value
                };
                localStorage.setItem('ekavoo_footer', JSON.stringify(currentFooter));
                
                saveFooterBtn.disabled = false;
                saveFooterBtn.textContent = originalText;
                saveFooterBtn.style.opacity = '1';

                showToast('Footer settings updated successfully!');
            }, 800); // Simulate network delay
        });
    }


    // --- Additional Feature Listeners ---
    const applyDiscountBtn = document.getElementById('applyDiscountBtn');
    if (applyDiscountBtn) {
        applyDiscountBtn.addEventListener('click', () => {
            const discount = applyDiscountBtn.previousElementSibling.value;
            if (discount) {
                alert(`Global discount of ${discount}% applied to all products!`);
            } else {
                alert('Please enter a discount percentage.');
            }
        });
    }

    const generateCouponBtn = document.getElementById('generateCouponBtn');
    if (generateCouponBtn) {
        generateCouponBtn.addEventListener('click', () => {
            const code = 'EKAVOO' + Math.random().toString(36).substring(2, 7).toUpperCase();
            const input = generateCouponBtn.previousElementSibling;
            if (input) input.value = code;
        });
    }

    // --- Storefront Management ---
    const heroHeadlineInput = document.getElementById('heroHeadlineInput');
    const heroImageInput = document.getElementById('heroImageInput');
    const updateStorefrontBtn = document.getElementById('updateStorefrontBtn');
    const heroPreviewContainer = document.getElementById('heroPreviewContainer');
    const heroPreviewPlaceholder = document.getElementById('heroPreviewPlaceholder');

    const defaultHero = {
        headline: 'Unlock Your Signature Scent',
        image: 'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?q=80&w=2000&auto=format&fit=crop'
    };

    let currentHero = JSON.parse(localStorage.getItem('ekavoo_hero')) || defaultHero;

    function updateHeroPreview() {
        if (!heroPreviewContainer) return;
        const url = heroImageInput.value.trim();
        if (url) {
            heroPreviewContainer.style.backgroundImage = `url('${url}')`;
            if (heroPreviewPlaceholder) heroPreviewPlaceholder.style.display = 'none';
        } else {
            heroPreviewContainer.style.backgroundImage = 'none';
            if (heroPreviewPlaceholder) heroPreviewPlaceholder.style.display = 'block';
        }
    }

    function loadHeroInputs() {
        if (!heroHeadlineInput || !heroImageInput) return;
        heroHeadlineInput.value = currentHero.headline;
        heroImageInput.value = currentHero.image;
        updateHeroPreview();
    }

    if (updateStorefrontBtn) {
        updateStorefrontBtn.addEventListener('click', () => {
            const originalText = updateStorefrontBtn.textContent;
            updateStorefrontBtn.disabled = true;
            updateStorefrontBtn.textContent = 'Updating...';
            updateStorefrontBtn.style.opacity = '0.7';

            setTimeout(() => {
                currentHero = {
                    headline: heroHeadlineInput.value,
                    image: heroImageInput.value || defaultHero.image
                };
                broadcastDataChange('ekavoo_hero', currentHero);

                updateStorefrontBtn.disabled = false;
                updateStorefrontBtn.textContent = originalText;
                updateStorefrontBtn.style.opacity = '1';

                showToast('Storefront successfully updated!');
                loadHeroInputs(); // Refresh to ensure values are synced
            }, 800);
        });
    }

    // --- AI Quiz Management ---
    let aiQuizData = JSON.parse(localStorage.getItem('ekavoo_quiz_data')) || {
        enabled: true,
        rules: { mode: 'single' },
        content: {
            resultTitle: "Your Signature Scent",
            resultDesc: "Based on your unique profile, this is your perfect match.",
            trustMessage: "92% of users loved this recommendation."
        },
        questions: []
    };

    const quizToggleSwitch = document.getElementById('quizToggleSwitch');
    const quizResultTitle = document.getElementById('quizResultTitle');
    const quizResultDesc = document.getElementById('quizResultDesc');
    const quizTrustMessage = document.getElementById('quizTrustMessage');
    const quizMatchLogic = document.getElementById('quizMatchLogic');
    const saveQuizContentBtn = document.getElementById('saveQuizContentBtn');
    
    const quizQuestionContainer = document.getElementById('quizQuestionContainer');
    const quizAddQuestionBtn = document.getElementById('quizAddQuestionBtn');
    const saveQuizQuestionsBtn = document.getElementById('saveQuizQuestionsBtn');

    function loadQuizInputs() {
        if (!quizToggleSwitch) return;
        quizToggleSwitch.checked = aiQuizData.enabled;
        quizResultTitle.value = aiQuizData.content.resultTitle || "";
        quizResultDesc.value = aiQuizData.content.resultDesc || "";
        quizTrustMessage.value = aiQuizData.content.trustMessage || "";
        quizMatchLogic.value = aiQuizData.rules.mode || "single";
        
        renderQuizQuestions();
    }

    function renderQuizQuestions() {
        if (!quizQuestionContainer) return;
        quizQuestionContainer.innerHTML = '';
        
        aiQuizData.questions.forEach((q, qIndex) => {
            const qDiv = document.createElement('div');
            qDiv.className = 'admin-card';
            qDiv.style.borderLeft = '3px solid var(--quiz-accent, #c0a062)';
            qDiv.style.marginBottom = '15px';
            qDiv.style.position = 'relative';
            
            let optionsHtml = '';
            q.options.forEach((opt, oIndex) => {
                const weightsStr = Object.entries(opt.weights).map(([k,v]) => `${k}:${v}`).join(', ');
                optionsHtml += `
                    <div class="form-row split-2" style="margin-top:10px; padding: 10px; background: rgba(0,0,0,0.02); border-radius:4px;">
                        <div class="form-group">
                            <label>Option ${oIndex+1} Text</label>
                            <input type="text" class="form-input q-opt-text" value="${opt.text}">
                        </div>
                        <div class="form-group">
                            <label>Weights (e.g. Woody:2, Spicy:1)</label>
                            <input type="text" class="form-input q-opt-weight" value="${weightsStr}">
                        </div>
                    </div>
                `;
            });

            qDiv.innerHTML = `
                <button class="delete-q-btn" onclick="deleteQuizQuestion(${qIndex})" style="position: absolute; right: 15px; top: 15px; background: none; border: none; color: #ff4d4f; cursor: pointer;"><i class="fa-solid fa-trash"></i></button>
                <div class="form-group">
                    <label style="font-weight: 600;">Question ${qIndex+1}</label>
                    <input type="text" class="form-input q-text" value="${q.text}">
                </div>
                <div class="q-options-container" style="margin-top:15px">
                    <label style="font-size: 0.9rem; font-weight: 600; color:#555;">Answer Options & Scoring</label>
                    ${optionsHtml}
                </div>
                <button class="btn btn-outline small" onclick="addQuizOption(${qIndex})" style="margin-top: 10px;">+ Add Option</button>
            `;
            quizQuestionContainer.appendChild(qDiv);
        });
    }

    window.deleteQuizQuestion = (qIndex) => {
        aiQuizData.questions.splice(qIndex, 1);
        renderQuizQuestions();
    };

    window.addQuizOption = (qIndex) => {
        aiQuizData.questions[qIndex].options.push({ text: 'New Option', weights: { Fresh: 1 } });
        renderQuizQuestions();
    };

    if (quizAddQuestionBtn) {
        quizAddQuestionBtn.addEventListener('click', () => {
            aiQuizData.questions.push({
                id: 'q' + Date.now(),
                text: 'New Question?',
                options: [
                    { text: 'Option A', weights: { Fresh: 2 } },
                    { text: 'Option B', weights: { Woody: 2 } }
                ]
            });
            renderQuizQuestions();
        });
    }

    if (saveQuizContentBtn) {
        saveQuizContentBtn.addEventListener('click', () => {
            aiQuizData.enabled = quizToggleSwitch.checked;
            aiQuizData.rules.mode = quizMatchLogic.value;
            aiQuizData.content.resultTitle = quizResultTitle.value;
            aiQuizData.content.resultDesc = quizResultDesc.value;
            aiQuizData.content.trustMessage = quizTrustMessage.value;
            
            localStorage.setItem('ekavoo_quiz_data', JSON.stringify(aiQuizData));
            showToast('Quiz settings updated successfully!');
        });
    }

    if (saveQuizQuestionsBtn) {
        saveQuizQuestionsBtn.addEventListener('click', () => {
            const qDivs = quizQuestionContainer.querySelectorAll('.admin-card');
            const newQuestions = [];
            
            qDivs.forEach((qDiv, idx) => {
                const text = qDiv.querySelector('.q-text').value;
                const optDivs = qDiv.querySelectorAll('.q-opt-text');
                const weightDivs = qDiv.querySelectorAll('.q-opt-weight');
                
                const options = [];
                for (let i = 0; i < optDivs.length; i++) {
                    const optText = optDivs[i].value;
                    const wStr = weightDivs[i].value;
                    const weights = {};
                    wStr.split(',').forEach(pair => {
                        const [k, v] = pair.split(':');
                        if (k && v) {
                            weights[k.trim()] = parseInt(v.trim());
                        }
                    });
                    options.push({ text: optText, weights: weights });
                }
                newQuestions.push({
                    id: aiQuizData.questions[idx]?.id || 'q' + Date.now(),
                    text: text,
                    options: options
                });
            });
            
            aiQuizData.questions = newQuestions;
            // Retain config while saving questions
            aiQuizData.enabled = quizToggleSwitch.checked;
            localStorage.setItem('ekavoo_quiz_data', JSON.stringify(aiQuizData));
            showToast('Quiz questions saved successfully!');
        });
    }

    // --- Global Attachment for HTML event handlers ---
    window.switchPane = switchPane;
    window.editProduct = editProduct;
    window.deleteProduct = deleteProduct;
    window.adjustStock = adjustStock;
    window.toggleCustomerStatus = toggleCustomerStatus;
    window.updateImagePreview = updateImagePreview;
    window.updateHeroPreview = updateHeroPreview;
    window.logoutAdmin = () => {
        sessionStorage.removeItem('ekavoo_admin_logged');
        location.reload();
    };

    // Initial Dashboard Setup
    checkAuth();
    loadThemeInputs();
    loadFooterInputs();
    loadHeroInputs();
    loadQuizInputs();
});
