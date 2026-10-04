// Smooth Navbar Transition on Scroll
document.addEventListener('DOMContentLoaded', () => {
    // --- Global Analytics Engine ---
    window.kavooAnalytics = {
        generateId: () => Math.random().toString(36).substring(2) + Date.now().toString(36),
        init: function() {
            if(!sessionStorage.getItem('ekavoo_session_id')) {
                sessionStorage.setItem('ekavoo_session_id', this.generateId());
            }
            if(!localStorage.getItem('ekavoo_visitor_id')) {
                localStorage.setItem('ekavoo_visitor_id', this.generateId());
            }

            if(!localStorage.getItem('ekavoo_privacy_acknowledged')) {
                this.renderPrivacyBanner();
            }

            this.trackEvent('pageview');
        },
        renderPrivacyBanner: function() {
            if(document.getElementById('kavooPrivacyBanner')) return;
            const banner = document.createElement('div');
            banner.id = 'kavooPrivacyBanner';
            banner.style.cssText = 'position: fixed; bottom: 20px; left: 20px; right: 20px; max-width: 400px; background: rgba(20,20,20,0.95); backdrop-filter: blur(10px); color: #fff; padding: 20px; border-radius: 8px; z-index: 9999; border: 1px solid rgba(212, 175, 55, 0.3); font-family: var(--font-sans); box-shadow: 0 10px 30px rgba(0,0,0,0.3);';
            banner.innerHTML = `
                <div>
                    <h4 style="margin:0 0 8px 0; color:var(--color-gold); font-family:var(--font-serif); font-size:1.1rem;"><i class="fa-solid fa-shield-halved" style="margin-right:8px;"></i> We Respect Your Privacy</h4>
                    <p style="margin:0; font-size:0.85rem; line-height:1.5; color:#ccc;">To improve your experience, we use strictly anonymous, secure session tracking. We do not collect or store your personal data.</p>
                </div>
                <button id="acceptPrivacyBtn" class="btn" style="margin-top:15px; width:100%; padding:10px; background:var(--color-gold); color:#111; font-weight:600; font-size:0.9rem;">I Understand</button>
            `;
            document.body.appendChild(banner);

            document.getElementById('acceptPrivacyBtn').addEventListener('click', () => {
                localStorage.setItem('ekavoo_privacy_acknowledged', 'true');
                banner.style.transition = 'opacity 0.3s ease';
                banner.style.opacity = '0';
                setTimeout(() => banner.remove(), 300);
            });
        },
        trackEvent: function(type) {
            let events = JSON.parse(localStorage.getItem('ekavoo_analytics_events')) || [];
            
            // Cleanup very old events (e.g. > 30 days) to prevent LS overflow
            const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
            events = events.filter(e => e.timestamp > thirtyDaysAgo);

            const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
            const isTablet = /(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk|(puffin(?!.*(IP|AP|WP))))/i.test(navigator.userAgent);
            const device = isTablet ? 'Tablet' : (isMobile ? 'Mobile' : 'Desktop');

            const eventData = {
                type: type, // 'pageview', 'quiz_started', 'quiz_completed', etc.
                path: window.location.pathname,
                hash: window.location.hash,
                timestamp: Date.now(),
                sessionId: sessionStorage.getItem('ekavoo_session_id'),
                visitorId: localStorage.getItem('ekavoo_visitor_id'),
                device: device,
                location: 'Mumbai, IN', // Mocked location as we lack a free robust IP API in the browser
                referrer: document.referrer || 'Direct'
            };

            events.push(eventData);
            localStorage.setItem('ekavoo_analytics_events', JSON.stringify(events));
        }
    };
    
    // Initialize standard pageview on every new load
    window.kavooAnalytics.init();

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
    
    // --- Mock Product Catalog ---
    const defaultCatalog = [
        { id: 'velvet-rose-absolute', title: 'Velvet Rose Absolute', price: 19600.00, images: ['https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=800&auto=format&fit=crop', 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?q=80&w=800&auto=format&fit=crop', 'https://images.unsplash.com/photo-1587017539504-67cfbddac569?q=80&w=800&auto=format&fit=crop'], category: 'fragrance', stock: 15 },
        { id: 'midnight-oud', title: 'Midnight Oud', price: 24800.00, images: ['https://images.unsplash.com/photo-1595425970377-c9703bc48b2d?q=80&w=800&auto=format&fit=crop', 'https://images.unsplash.com/photo-1547887538-e3a2f32cb1cc?q=80&w=800&auto=format&fit=crop', 'https://images.unsplash.com/photo-1615160411333-8a3c2007f353?q=80&w=800&auto=format&fit=crop'], category: 'fragrance', stock: 8 },
        { id: 'luminous-citrus', title: 'Luminous Citrus', price: 14800.00, images: ['https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?q=80&w=800&auto=format&fit=crop', 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=800&auto=format&fit=crop'], category: 'fragrance', stock: 12 },
        { id: 'cashmere-wood', title: 'Cashmere Wood', price: 17600.00, images: ['https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=800&auto=format&fit=crop', 'https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=800&auto=format&fit=crop', 'https://images.unsplash.com/photo-1615160411333-8a3c2007f353?q=80&w=800&auto=format&fit=crop'], category: 'fragrance', stock: 20 },
        { id: 'white-jasmine', title: 'White Jasmine', price: 15600.00, images: ['https://images.unsplash.com/photo-1547887538-e3a2f32cb1cc?q=80&w=800&auto=format&fit=crop', 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?q=80&w=800&auto=format&fit=crop'], category: 'fragrance', stock: 5 },
        { id: 'golden-elixir', title: 'Golden Elixir', price: 16800.00, images: ['https://images.unsplash.com/photo-1615160411333-8a3c2007f353?q=80&w=800&auto=format&fit=crop', 'https://images.unsplash.com/photo-1595425970377-c9703bc48b2d?q=80&w=800&auto=format&fit=crop', 'https://images.unsplash.com/photo-1587017539504-67cfbddac569?q=80&w=800&auto=format&fit=crop'], category: 'fragrance', stock: 10 },
        { id: 'illuminating-serum', title: 'Illuminating Serum', price: 14800.00, images: ['https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=800&auto=format&fit=crop', 'https://images.unsplash.com/photo-1556228578-8d89b6acd8ae?q=80&w=800&auto=format&fit=crop', 'https://images.unsplash.com/photo-1556228720-1c27bef96ce1?q=80&w=800&auto=format&fit=crop'], category: 'skincare', stock: 10 },
        { id: 'silk-foundation', title: 'Flawless Silk Foundation', price: 6800.00, images: ['https://images.unsplash.com/photo-1586495777744-4413f21062fa?q=80&w=800&auto=format&fit=crop', 'https://images.unsplash.com/photo-1599305090598-fe179d501227?q=80&w=800&auto=format&fit=crop'], category: 'makeup', stock: 10 },
        { id: 'hydration-cream', title: 'Deep Moisture Crème', price: 11200.00, images: ['https://images.unsplash.com/photo-1556228578-8d89b6acd8ae?q=80&w=800&auto=format&fit=crop', 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=800&auto=format&fit=crop'], category: 'skincare', stock: 10 },
        { id: 'velvet-lipstick', title: 'Matte Velvet Rouge', price: 4400.00, images: ['https://images.unsplash.com/photo-1599305090598-fe179d501227?q=80&w=800&auto=format&fit=crop', 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?q=80&w=800&auto=format&fit=crop'], category: 'makeup', stock: 10 },
        { id: 'gel-cleanser', title: 'Purifying Gel Cleanser', price: 5200.00, images: ['https://images.unsplash.com/photo-1556228720-1c27bef96ce1?q=80&w=800&auto=format&fit=crop', 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=800&auto=format&fit=crop'], category: 'skincare', stock: 10 }
    ];

    // --- Global State ---
    function getStoredProducts() {
        try {
            const savedProducts = JSON.parse(localStorage.getItem('ekavoo_products'));
            return Array.isArray(savedProducts) ? savedProducts : null;
        } catch (error) {
            return null;
        }
    }

    function getProductCatalog() {
        const savedProducts = getStoredProducts();
        const migratedProducts = savedProducts ? savedProducts.map(p => {
            if (!p.images) p.images = [p.image].filter(Boolean);
            return p;
        }) : null;
        return (migratedProducts && migratedProducts.length > 0) ? migratedProducts : defaultCatalog;
    }

    function getStoredHero() {
        try {
            const heroData = JSON.parse(localStorage.getItem('ekavoo_hero'));
            return heroData || null;
        } catch (error) {
            return null;
        }
    }

    let productCatalog = getProductCatalog();
    let cart = JSON.parse(localStorage.getItem('ekavoo_cart')) || [];
    let wishlist = JSON.parse(localStorage.getItem('ekavoo_wishlist')) || [];

    function applyHeroSettings() {
        const heroElement = document.getElementById('home');
        if (!heroElement) return;

        const heroData = getStoredHero();
        const heroImage = heroData?.image || 'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?q=80&w=2000&auto=format&fit=crop';
        const heroHeadline = document.getElementById('heroHeadline');

        heroElement.style.backgroundImage = `url('${heroImage}')`;
        heroElement.style.backgroundSize = 'cover';
        heroElement.style.backgroundPosition = 'center';
        heroElement.style.backgroundRepeat = 'no-repeat';

        if (heroHeadline) {
            heroHeadline.textContent = heroData?.headline || 'Kavoo';
        }
    }

    function refreshHomepageData() {
        productCatalog = getProductCatalog();
        applyHeroSettings();
        renderProducts('productGrid', 6);
        renderProducts('shopProductGrid');
    }

    window.addEventListener('storage', (event) => {
        if (event.key === 'ekavoo_products' || event.key === 'ekavoo_hero') {
            refreshHomepageData();
        }
    });

    window.addEventListener('kavoo:data-updated', (event) => {
        if (event.detail?.key === 'ekavoo_products' || event.detail?.key === 'ekavoo_hero') {
            refreshHomepageData();
        }
    });

    // --- Search Logic ---
    const openSearchBtn = document.getElementById('openSearchBtn');
    const closeSearchBtn = document.getElementById('closeSearchBtn');
    const searchOverlay = document.getElementById('searchOverlay');
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');
    const searchEmptyMsg = document.getElementById('searchEmptyMsg');

    function openSearch() {
        if (searchOverlay) {
            searchOverlay.classList.add('active');
            setTimeout(() => searchInput.focus(), 300);
            document.body.style.overflow = 'hidden';
        }
    }

    function closeSearch() {
        if (searchOverlay) {
            searchOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    if (openSearchBtn) openSearchBtn.addEventListener('click', (e) => {
        e.preventDefault();
        openSearch();
    });
    if (closeSearchBtn) closeSearchBtn.addEventListener('click', closeSearch);

    // Escape to close search
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && searchOverlay && searchOverlay.classList.contains('active')) {
            closeSearch();
        }
    });

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            if (query.length > 0) {
                const results = productCatalog.filter(product =>
                    product.title.toLowerCase().includes(query) ||
                    product.category.toLowerCase().includes(query)
                );
                renderSearchResults(results);
            } else {
                searchResults.innerHTML = '';
                if (searchEmptyMsg) searchEmptyMsg.style.display = 'none';
            }
        });

        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                // If there's results, maybe take some action? 
                // For now, input listener handles real-time results.
            }
        });
    }

    function renderSearchResults(results) {
        if (!searchResults) return;
        searchResults.innerHTML = '';

        if (results.length === 0) {
            if (searchEmptyMsg) searchEmptyMsg.style.display = 'block';
            return;
        }

        if (searchEmptyMsg) searchEmptyMsg.style.display = 'none';

        results.forEach(product => {
            const resultItem = document.createElement('div');
            resultItem.className = 'search-result-item';
            resultItem.innerHTML = `
                    <img src="${product.image}" alt="${product.title}" class="search-result-img">
                    <div class="search-result-info">
                        <div class="search-result-title">${product.title}</div>
                        <div class="search-result-price">₹${product.price.toLocaleString('en-IN')}</div>
                    </div>
                `;
            resultItem.addEventListener('click', () => {
                closeSearch();
                openModal(product);
            });
            searchResults.appendChild(resultItem);
        });
    }

    // --- Mobile Menu Logic ---
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = mobileMenuBtn.querySelector('i');
            if (icon.classList.contains('fa-bars')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-xmark');
            } else {
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars');
            }
        });

        // Close menu when a link is clicked
        const navLinksItems = navLinks.querySelectorAll('a');
        navLinksItems.forEach(item => {
            item.addEventListener('click', () => {
                navLinks.classList.remove('active');
                const icon = mobileMenuBtn.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-xmark');
                    icon.classList.add('fa-bars');
                }
            });
        });
    }

    // Intersection Observer for scroll animations (if elements are added below the fold)
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Optional: animate only once
            }
        });
    }, observerOptions);

    // Apply observer to any elements that need scroll animation later
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach(el => observer.observe(el));

    // --- Product Modal Logic ---
    const productModal = document.getElementById('productModal');
    // Move these outside the conditional to ensure they exist for other features
    const modalImg = document.getElementById('modalProductImage');
    const modalTitle = document.getElementById('modalProductTitle');
    const modalPrice = document.getElementById('modalProductPrice');
    const modalDesc = document.getElementById('modalProductDesc');
    const modalBtnPrice = document.getElementById('modalBtnPrice');
    const modalQtyInput = document.getElementById('modalProductQty');
    const modalNotes = document.getElementById('modalProductNotes');
    const modalSize = document.getElementById('modalProductSize');

    // Quantity Buttons
    const qtyMinus = productModal ? productModal.querySelector('.qty-btn.minus') : null;
    const qtyPlus = productModal ? productModal.querySelector('.qty-btn.plus') : null;
    const modalClose = productModal ? productModal.querySelector('.modal-close') : null;
    const modalBackdrop = productModal ? productModal.querySelector('.modal-backdrop') : null;

    let currentBasePrice = 0;
    let currentProductId = '';

    // Open Modal Function
    function openModal(productData) {
        if (!productModal) return;
        const stock = productData.stock !== undefined ? productData.stock : (productCatalog.find(p => p.id === productData.id)?.stock ?? 10);
        const isSoldOut = stock <= 0;

        // Populate Data — support both `images` array and legacy `image` field
        const productImages = productData.images || (productData.image ? [productData.image] : []);
        currentProductId = productData.id;
        modalImg.src = productImages[0] || '';

        // Render thumbnail strip
        const thumbStrip = document.getElementById('modalThumbnailStrip');
        if (thumbStrip) {
            thumbStrip.innerHTML = '';
            if (productImages.length > 1) {
                productImages.forEach((imgUrl, i) => {
                    const thumb = document.createElement('img');
                    thumb.src = imgUrl;
                    thumb.alt = `${productData.title} view ${i + 1}`;
                    thumb.className = `modal-thumb${i === 0 ? ' active' : ''}`;
                    thumb.addEventListener('click', () => {
                        modalImg.style.opacity = '0';
                        setTimeout(() => {
                            modalImg.src = imgUrl;
                            modalImg.style.opacity = '1';
                        }, 150);
                        thumbStrip.querySelectorAll('.modal-thumb').forEach(t => t.classList.remove('active'));
                        thumb.classList.add('active');
                    });
                    thumbStrip.appendChild(thumb);
                });
                thumbStrip.style.display = 'flex';
            } else {
                thumbStrip.style.display = 'none';
            }
        }
        modalTitle.textContent = productData.title;
        const priceINR = typeof productData.price === 'number' ? productData.price : parseFloat(productData.price.replace(/[^\d.-]/g, ''));
        modalPrice.textContent = `₹${priceINR.toLocaleString('en-IN')}`;
        modalBtnPrice.textContent = isSoldOut ? 'Sold Out' : `₹${priceINR.toLocaleString('en-IN')}`;

        const addToCartBtn = document.querySelector('.add-to-cart-large');
        if (addToCartBtn) {
            addToCartBtn.disabled = isSoldOut;
            addToCartBtn.style.opacity = isSoldOut ? '0.5' : '1';
            addToCartBtn.style.cursor = isSoldOut ? 'not-allowed' : 'pointer';
        }

        // Generate description based on title if not explicitly provided
        modalDesc.textContent = productData.desc || `${productData.title} is a signature creation from Kavoo, crafted with the finest ingredients to elevate your natural essence. Experience luxury with every application.`;

        // Stock Check
        if (isSoldOut) {
            modalPrice.innerHTML = `<span style="color: #ff4d4f;">OUT OF STOCK</span>`;
            modalBtnPrice.textContent = 'Sold Out';
            if (addToCartBtn) {
                addToCartBtn.disabled = true;
                addToCartBtn.style.opacity = '0.5';
                addToCartBtn.style.cursor = 'not-allowed';
            }
        } else {
            modalPrice.textContent = `₹${priceINR.toLocaleString('en-IN')}`;
            modalBtnPrice.textContent = `₹${priceINR.toLocaleString('en-IN')}`;
            if (addToCartBtn) {
                addToCartBtn.disabled = false;
                addToCartBtn.style.opacity = '1';
                addToCartBtn.style.cursor = 'pointer';
            }
        }

        // Set some dummy notes/size based on category
        if (productData.category === 'fragrance' || productData.title.toLowerCase().includes('absolute') || productData.title.toLowerCase().includes('oud') || productData.title.toLowerCase().includes('citrus')) {
            modalNotes.parentElement.style.display = 'block';
            modalNotes.textContent = 'Top: Citrus, Heart: Floral, Base: Woods & Amber';
            modalSize.textContent = '50ml / 1.7 oz Parfum';
        } else if (productData.category === 'skincare' || productData.title.toLowerCase().includes('serum') || productData.title.toLowerCase().includes('cream')) {
            modalNotes.parentElement.style.display = 'none';
            modalSize.textContent = '30ml / 1 oz';
        } else {
            modalNotes.parentElement.style.display = 'none';
            modalSize.textContent = 'Standard Size';
        }

        // Reset Quantity
        modalQtyInput.value = 1;
        currentBasePrice = typeof productData.price === 'number' ? productData.price : parseFloat(productData.price.replace(/[^\d.-]/g, ''));

        // Show Modal
        productModal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    // Close Modal Function
    function closeModal() {
        if (productModal) {
            productModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    // --- Urgency & Social Proof System ---
    function getProductBadge(product) {
        // Assign badges based on some logic (for demo, we can use ID or Category)
        if (product.id.includes('rose') || product.id.includes('serum')) return '<span class="badge badge-best">Best Seller</span>';
        if (product.id.includes('oud') || product.id.includes('foundation')) return '<span class="badge badge-trending">Trending</span>';
        if (product.id.includes('citrus') || product.id.includes('rouge')) return '<span class="badge badge-new">New Arrival</span>';
        return '';
    }

    function getStockIndicator(stock) {
        if (stock <= 0) return '';
        if (stock < 5) return `<div class="stock-indicator urgent">🔥 Selling Fast - Only ${stock} left</div>`;
        if (stock < 10) return `<div class="stock-indicator warning">⚠ Only ${stock} items left in stock</div>`;
        return '';
    }

    function renderProducts(containerId, limit = null, categoryFilter = 'all', sortBy = 'featured') {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = ''; // Clear current products

        let productsToRender = [...productCatalog];
        if (categoryFilter !== 'all') {
            productsToRender = productsToRender.filter(p => p.category === categoryFilter);
        }

        if (sortBy === 'price-asc') {
            productsToRender.sort((a, b) => a.price - b.price);
        } else if (sortBy === 'price-desc') {
            productsToRender.sort((a, b) => b.price - a.price);
        } else if (sortBy === 'newest') {
            productsToRender = productsToRender.slice().reverse();
        }

        if (limit) {
            productsToRender = productsToRender.slice(0, limit);
        }

        productsToRender.forEach((product, index) => {
            const isSoldOut = product.stock <= 0;
            const card = document.createElement('div');
            card.className = `product-card animate-on-scroll ${isSoldOut ? 'sold-out' : ''}`;
            card.style.animationDelay = `${(index % 3) * 0.2}s`;
            card.dataset.id = product.id;
            card.dataset.category = product.category;

            const cardThumb = product.images ? product.images[0] : (product.image || '');
            card.innerHTML = `
                    <div class="product-image-container">
                        ${getProductBadge(product)}
                        <img src="${cardThumb}" alt="${product.title}" class="product-image" style="${isSoldOut ? 'filter: grayscale(1); opacity: 0.5;' : ''}">
                        ${isSoldOut ? '<div class="sold-out-overlay">SOLD OUT</div>' : `
                            <div class="product-overlay">
                                <button class="btn btn-primary cart-btn">Add to Cart</button>
                            </div>
                        `}
                    </div>
                    <div class="product-info">
                        <h3 class="product-title">${product.title}</h3>
                        <p class="product-desc">${product.category.charAt(0).toUpperCase() + product.category.slice(1)} Collection</p>
                        <div class="product-price">₹${product.price.toLocaleString('en-IN')}</div>
                    </div>
                `;

            // Add to Cart / Open Modal Logic
            const clickableAreas = card.querySelectorAll('.product-image, .product-info');
            clickableAreas.forEach(area => {
                area.addEventListener('click', (e) => {
                    if (!e.target.classList.contains('cart-btn') && !e.target.classList.contains('wishlist-btn')) {
                        openModal(product);
                    }
                });
            });

            const cartBtn = card.querySelector('.cart-btn');
            if (cartBtn) {
                cartBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    openModal(product);
                });
            }

            container.appendChild(card);
            if (typeof observer !== 'undefined') observer.observe(card);
        });
    }

    function getActiveShopFilter() {
        const categoryFilters = document.getElementById('categoryFilters');
        return categoryFilters?.querySelector('.filter-btn.active')?.dataset.filter || 'all';
    }

    function getCurrentSortValue() {
        const sortSelect = document.querySelector('.custom-select');
        return sortSelect?.value || 'featured';
    }

    function updateShopGrid() {
        if (!document.body.classList.contains('shop-page')) return;
        const filterValue = getActiveShopFilter();
        const sortValue = getCurrentSortValue();
        renderProducts('shopProductGrid', null, filterValue, sortValue);
        const loadMoreBtn = document.getElementById('loadMoreBtn');
        if (loadMoreBtn) {
            loadMoreBtn.style.display = 'none';
        }
    }

    function setupShopPageControls() {
        const categoryFilters = document.getElementById('categoryFilters');
        const sortSelect = document.querySelector('.custom-select');

        if (categoryFilters) {
            categoryFilters.addEventListener('click', (e) => {
                const button = e.target.closest('.filter-btn');
                if (!button) return;
                categoryFilters.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                updateShopGrid();
            });
        }

        if (sortSelect) {
            sortSelect.addEventListener('change', updateShopGrid);
        }
    }

    // Initial Render
    refreshHomepageData();
    setupShopPageControls();
    updateShopGrid();


    // Close Modal Event Listeners
    if (modalClose) modalClose.addEventListener('click', closeModal);
    if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);

    // Escape key to close
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && productModal.classList.contains('active')) {
            closeModal();
        }
    });

    // Quantity Logic
    if (qtyMinus && qtyPlus && modalQtyInput) {
        const updateBtnPrice = () => {
            const qty = parseInt(modalQtyInput.value) || 1;
            const total = (currentBasePrice * qty).toFixed(2);
            modalBtnPrice.textContent = `₹${parseFloat(total).toLocaleString('en-IN')}`;
        };

        qtyMinus.addEventListener('click', () => {
            let val = parseInt(modalQtyInput.value) || 1;
            if (val > 1) {
                modalQtyInput.value = val - 1;
                updateBtnPrice();
            }
        });

        qtyPlus.addEventListener('click', () => {
            let val = parseInt(modalQtyInput.value) || 1;
            modalQtyInput.value = val + 1;
            updateBtnPrice();
        });

        modalQtyInput.addEventListener('change', () => {
            let val = parseInt(modalQtyInput.value);
            if (isNaN(val) || val < 1) {
                modalQtyInput.value = 1;
            }
            updateBtnPrice();
        });
    }

    // Image Zoom Logic
    if (modalImg) {
        const imgContainer = modalImg.parentElement;

        imgContainer.addEventListener('mousemove', (e) => {
            const { left, top, width, height } = imgContainer.getBoundingClientRect();
            const x = (e.clientX - left) / width;
            const y = (e.clientY - top) / height;

            modalImg.style.transformOrigin = `${x * 100}% ${y * 100}%`;
            modalImg.style.transform = 'scale(2)'; // Zoom level
        });

        imgContainer.addEventListener('mouseleave', () => {
            modalImg.style.transformOrigin = 'center center';
            modalImg.style.transform = 'scale(1)';
        });
    }

    // Modal Add to Cart Action
    const modalAddToCartBtn = productModal.querySelector('.add-to-cart-large');
    if (modalAddToCartBtn) {
        modalAddToCartBtn.addEventListener('click', () => {
            const qty = parseInt(modalQtyInput.value) || 1;

            const itemToAdd = {
                id: currentProductId,
                title: modalTitle.textContent,
                price: currentBasePrice,
                image: modalImg.src,
                quantity: qty
            };

            addToCart(itemToAdd);

            // Show success state briefly
            const originalText = modalAddToCartBtn.innerHTML;
            modalAddToCartBtn.innerHTML = '<i class="fa-solid fa-check"></i> Added';
            modalAddToCartBtn.style.backgroundColor = '#4CAF50';
            modalAddToCartBtn.style.color = 'white';

            setTimeout(() => {
                closeModal();
                openCart();
                // Reset button state
                setTimeout(() => {
                    modalAddToCartBtn.innerHTML = originalText;
                    modalAddToCartBtn.style.backgroundColor = '';
                    modalAddToCartBtn.style.color = '';
                }, 300);
            }, 600);
        });
    }

    // --- Sliding Cart Logic ---

    const cartOverlay = document.getElementById('cartOverlay');
    const cartPanel = document.getElementById('cartPanel');
    const closeCartBtn = document.getElementById('closeCartBtn');
    const cartItemsContainer = document.getElementById('cartItemsContainer');
    const emptyCartMessage = document.getElementById('emptyCartMessage');
    const cartSubtotalPrice = document.getElementById('cartSubtotalPrice') || document.getElementById('cartSubtotalValue');

    // There might be multiple cart buttons (e.g. one in Shop page, one in Nav)
    const openCartBtns = document.querySelectorAll('#openCartBtn, #openCartBtnShop');
    const cartBadges = document.querySelectorAll('#cartBadgeCount, #cartBadgeCountShop');

    function openCart() {
        if (cartOverlay && cartPanel) {
            cartOverlay.classList.add('active');
            cartPanel.classList.add('active');
            document.body.style.overflow = 'hidden';
            renderCartItems();
        }
    }

    function closeCart() {
        if (cartOverlay && cartPanel) {
            cartOverlay.classList.remove('active');
            cartPanel.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    if (openCartBtns) {
        openCartBtns.forEach(btn => btn.addEventListener('click', (e) => {
            e.preventDefault();
            openCart();
        }));
    }

    if (closeCartBtn) closeCartBtn.addEventListener('click', closeCart);
    if (cartOverlay) cartOverlay.addEventListener('click', closeCart);

    // Keep cart closing on Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && cartPanel && cartPanel.classList.contains('active')) {
            closeCart();
        }
    });

    function addToCart(item) {
        // Ensure price is always a plain number (guard against string prices)
        item.price = parseFloat(String(item.price).replace(/[^\d.]/g, '')) || 0;
        const existingItemIndex = cart.findIndex(cartItem => cartItem.id === item.id);

        if (existingItemIndex > -1) {
            cart[existingItemIndex].quantity += item.quantity;
        } else {
            cart.push(item);
        }

        updateCartUI();
        localStorage.setItem('ekavoo_cart', JSON.stringify(cart));

        // Pop animation for badge
        cartBadges.forEach(badge => {
            if (badge) {
                badge.classList.add('pop');
                setTimeout(() => badge.classList.remove('pop'), 300);
            }
        });
    }

    function removeFromCart(id) {
        cart = cart.filter(item => item.id !== id);
        updateCartUI();
        localStorage.setItem('ekavoo_cart', JSON.stringify(cart));
    }

    function updateQuantity(id, newQty) {
        const item = cart.find(i => i.id === id);
        if (item) {
            if (newQty > 0) {
                item.quantity = newQty;
            } else {
                removeFromCart(id);
                return;
            }
        }
        updateCartUI();
        localStorage.setItem('ekavoo_cart', JSON.stringify(cart));
    }

    function updateCartUI() {
        // Update Badges
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartBadges.forEach(badge => {
            if (badge) badge.textContent = totalItems;
        });

        // Update Subtotal
        const subtotal = cart.reduce((total, item) => {
            const price = parseFloat(String(item.price).replace(/[^\d.]/g, '')) || 0;
            return total + (price * item.quantity);
        }, 0);
        if (cartSubtotalPrice) {
            cartSubtotalPrice.textContent = `₹${subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        }

        // If cart is open, render items immediately
        if (cartPanel && cartPanel.classList.contains('active')) {
            renderCartItems();
        }
    }

    function renderCartItems() {
        if (!cartItemsContainer) return;

        // Clear current items (except empty message)
        const itemsToRemove = cartItemsContainer.querySelectorAll('.cart-item');
        itemsToRemove.forEach(item => item.remove());

        if (cart.length === 0) {
            if (emptyCartMessage) emptyCartMessage.classList.add('show');
        } else {
            if (emptyCartMessage) emptyCartMessage.classList.remove('show');

            cart.forEach(item => {
                const itemEl = document.createElement('div');
                itemEl.classList.add('cart-item');
                itemEl.innerHTML = `
                    <img src="${item.image}" alt="${item.title}" class="cart-item-image">
                    <div class="cart-item-details">
                        <h4 class="cart-item-title">${item.title}</h4>
                        <div class="cart-item-price">₹${item.price.toLocaleString()}</div>
                        <div class="cart-item-actions">
                            <div class="quantity-selector small">
                                <button class="qty-btn minus" data-id="${item.id}" aria-label="Decrease Quantity"><i class="fa-solid fa-minus"></i></button>
                                <input type="number" class="qty-input" value="${item.quantity}" readonly>
                                <button class="qty-btn plus" data-id="${item.id}" aria-label="Increase Quantity"><i class="fa-solid fa-plus"></i></button>
                            </div>
                            <button class="remove-item" data-id="${item.id}" aria-label="Remove Item">Remove</button>
                        </div>
                    </div>
                `;
                cartItemsContainer.appendChild(itemEl);
            });

            // Attach listeners to new elements
            const removeBtns = cartItemsContainer.querySelectorAll('.remove-item');
            removeBtns.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    removeFromCart(e.currentTarget.dataset.id);
                });
            });
            const minusBtns = cartItemsContainer.querySelectorAll('.qty-btn.minus');
            minusBtns.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const id = e.currentTarget.dataset.id;
                    const item = cart.find(i => i.id === id);
                    if (item) updateQuantity(id, item.quantity - 1);
                });
            });

            const plusBtns = cartItemsContainer.querySelectorAll('.qty-btn.plus');
            plusBtns.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const id = e.currentTarget.dataset.id;
                    const item = cart.find(i => i.id === id);
                    if (item) updateQuantity(id, item.quantity + 1);
                });
            });
        }
    }

    const continueShoppingBtn = document.getElementById('continueShoppingBtn');
    if (continueShoppingBtn) {
        continueShoppingBtn.addEventListener('click', closeCart);
    }
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            // Save cart to localStorage before redirecting
            localStorage.setItem('ekavoo_cart', JSON.stringify(cart));
            window.location.href = 'checkout.html';
        });
    }

    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => {
            // Show more products (for demo, just render all)
            renderProducts('shopProductGrid');
            loadMoreBtn.style.display = 'none';
        });
    }

    // --- Checkout Page Logic ---
    const checkoutForm = document.getElementById('checkoutForm');
    const checkoutSummaryItems = document.getElementById('checkoutSummaryItems');
    if (checkoutForm && checkoutSummaryItems) {
        // Load cart
        const cartData = JSON.parse(localStorage.getItem('ekavoo_cart')) || [];

        // If cart is empty, redirect back to shop
        if (cartData.length === 0) {
            window.location.href = 'shop.html';
        }

        // Render Summary Items
        let subtotal = 0;
        cartData.forEach(item => {
            // Ensure price is a clean number — guard against stringified prices from localStorage
            item.price = parseFloat(String(item.price).replace(/[^\d.]/g, '')) || 0;
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;

            const itemEl = document.createElement('div');
            itemEl.classList.add('summary-item');
            itemEl.innerHTML = `
                <img src="${item.image}" alt="${item.title}" class="summary-item-img">
                <div class="summary-item-info">
                    <h4 class="summary-item-title">${item.title}</h4>
                    <p class="summary-item-meta">Qty: ${item.quantity}</p>
                </div>
                <div class="summary-item-price">₹${itemTotal.toLocaleString('en-IN')}</div>
            `;
            checkoutSummaryItems.appendChild(itemEl);
        });

        // --- Dynamic Total Calculation & Shipping ---
        function updateCheckoutTotals() {
            const countryEl = document.getElementById('country');
            const subtotalEl = document.getElementById('checkoutSubtotal');
            const shippingEl = document.getElementById('checkoutShipping');
            const taxesEl = document.getElementById('checkoutTaxes');
            const totalEl = document.getElementById('checkoutTotal');
            const payNowAmountEl = document.getElementById('payNowAmount');

            if (!countryEl || !subtotalEl || !shippingEl || !taxesEl || !totalEl || !payNowAmountEl) return;

            // Recalculate Subtotal from actual cart data
            let currentSubtotal = cartData.reduce((acc, item) => acc + (item.price * item.quantity), 0);

            // Shipping Calculation
            let shippingCost = 0;
            const country = countryEl.value;

            if (country === 'IN') {
                shippingCost = 150;
                shippingEl.textContent = `₹${shippingCost.toLocaleString()}`;
                shippingEl.style.color = 'inherit';
            } else if (country === 'INT') {
                shippingCost = 1500;
                shippingEl.textContent = `₹${shippingCost.toLocaleString()}`;
                shippingEl.style.color = 'inherit';
            } else {
                shippingEl.textContent = 'Select country';
                shippingEl.style.color = '#ff4d4f';
            }

            // Tax Calculation (8%)
            const taxRate = 0.08;
            const currentTaxes = currentSubtotal * taxRate;

            // Grand Total — no shipping added if country not selected yet
            const grandTotal = country ? (currentSubtotal + shippingCost + currentTaxes) : (currentSubtotal + currentTaxes);

            // Update UI
            subtotalEl.textContent = `₹${currentSubtotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
            taxesEl.textContent = `₹${currentTaxes.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
            totalEl.textContent = `₹${grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
            payNowAmountEl.textContent = `• ₹${grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

            if (!country) {
                shippingEl.textContent = 'Select country ↑';
                shippingEl.style.color = '#ff4d4f';
            }

            // Store for submission
            checkoutForm.dataset.subtotal = currentSubtotal;
            checkoutForm.dataset.shipping = shippingCost;
            checkoutForm.dataset.taxes = currentTaxes;
            checkoutForm.dataset.total = grandTotal;
        }

        // Attach dynamic update listeners
        const countrySelect = document.getElementById('country');
        if (countrySelect) {
            countrySelect.addEventListener('change', updateCheckoutTotals);
        }

        // Initial update
        updateCheckoutTotals();

        // Payment Method Toggling
        const paymentCards = document.querySelectorAll('.payment-method-card');
        const paymentRadios = document.querySelectorAll('input[name="paymentType"]');

        paymentCards.forEach(card => {
            card.addEventListener('click', function () {
                // Remove active class from all
                paymentCards.forEach(c => {
                    c.classList.remove('active');
                    const details = c.querySelector('.payment-method-details');
                    if (details) details.style.display = 'none';
                });

                // Add active class to clicked
                this.classList.add('active');

                // Check the radio button inside
                const radio = this.querySelector('input[type="radio"]');
                if (radio) radio.checked = true;

                // Show details
                const details = this.querySelector('.payment-method-details');
                if (details) details.style.display = 'block';
            });
        });

        // Form Submission
        checkoutForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Explicit manual validation for customer details
            const requiredFields = [
                { id: 'fullName', name: 'Full Name' },
                { id: 'email', name: 'Email Address' },
                { id: 'mobile', name: 'Mobile Number' },
                { id: 'address', name: 'Full Delivery Address' },
                { id: 'city', name: 'City' },
                { id: 'state', name: 'State' },
                { id: 'pincode', name: 'PIN Code' }
            ];

            for (let field of requiredFields) {
                const el = document.getElementById(field.id);
                if (el && !el.value.trim()) {
                    alert(`Please enter your ${field.name}.`);
                    el.focus();
                    el.style.borderColor = '#ff4d4f';
                    return;
                } else if (el) {
                    el.style.borderColor = '';
                }
            }

            // Validate country is selected (required for correct total)
            const countryVal = document.getElementById('country').value;
            if (!countryVal) {
                document.getElementById('country').focus();
                document.getElementById('country').style.borderColor = '#ff4d4f';
                alert('Please select your country to calculate shipping and total.');
                return;
            }
            document.getElementById('country').style.borderColor = '';

            // Validate total is a valid number
            const finalTotal = parseFloat(checkoutForm.dataset.total);
            if (!finalTotal || finalTotal <= 0) {
                alert('Cart total is invalid. Please go back and check your cart.');
                return;
            }

            // Payment Validation
            const selectedPayment = document.querySelector('input[name="paymentType"]:checked')?.value;
            if (!selectedPayment) {
                alert('Please select a payment method.');
                return;
            }
            if (selectedPayment === 'upi') {
                const upiId = document.getElementById('upiId').value;
                if (!upiId) {
                    alert('Please enter your UPI ID (e.g. name@bank)');
                    return;
                }
            } else if (selectedPayment === 'card') {
                const cardNum = document.getElementById('cardNumber')?.value;
                const cardExp = document.getElementById('cardExpiry')?.value;
                const cardCvv = document.getElementById('cardCvv')?.value;
                const cardName = document.getElementById('cardName')?.value;
                if (!cardNum || !cardExp || !cardCvv || !cardName) {
                    alert('Please fill out all Credit/Debit Card details.');
                    return;
                }
            }

            // Simulate Payment Gateway Overlay
            const paymentGatewayOverlay = document.getElementById('paymentGatewayOverlay');
            const gatewayStatusText = document.getElementById('gatewayStatusText');
            
            if (paymentGatewayOverlay) {
                paymentGatewayOverlay.style.display = 'flex';
                let steps = [
                    { t: 0, msg: "Initializing secure connection..." },
                    { t: 1500, msg: `Connecting to ${selectedPayment === 'upi' ? 'UPI' : selectedPayment === 'card' ? 'Bank' : 'Payment Partner'}...` },
                    { t: 3000, msg: `Processing payment of ₹${finalTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}` },
                    { t: 4500, msg: "Transferring amount to Kavoo account..." },
                    { t: 6000, msg: "Payment Successful! Completing order..." }
                ];

                steps.forEach(step => {
                    setTimeout(() => {
                        if(gatewayStatusText) gatewayStatusText.innerHTML = step.msg;
                        
                        if (step.t === 6000) {
                            const spinner = paymentGatewayOverlay.querySelector('.spinner');
                            if(spinner) {
                                spinner.style.animation = 'none';
                                spinner.style.border = 'none';
                                spinner.innerHTML = '<i class="fa-solid fa-circle-check" style="color: #4CAF50; font-size: 3rem;"></i>';
                            }
                        }
                    }, step.t);
                });

                setTimeout(() => {
                    finalizeOrder();
                }, 7500); 
            } else {
                finalizeOrder();
            }

            function finalizeOrder() {
                const now = new Date();
                const formattedDate = now.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) + ' at ' + now.toLocaleTimeString('en-US', { hour: '2-digit', minute:'2-digit' });
                
                // Collect Customer Data (for demo purposes)
                const customerData = {
                    name: document.getElementById('fullName').value,
                    email: document.getElementById('email').value,
                    mobile: document.getElementById('mobile').value,
                    address: document.getElementById('address').value,
                    city: document.getElementById('city').value,
                    state: document.getElementById('state').value,
                    pincode: document.getElementById('pincode').value,
                    orderId: 'EK-' + Math.floor(10000000 + Math.random() * 90000000), // Generate random order ID
                    orderDate: formattedDate,
                    paymentMethod: selectedPayment,
                    subtotal: parseFloat(checkoutForm.dataset.subtotal).toFixed(2),
                    shipping: parseFloat(checkoutForm.dataset.shipping).toFixed(2),
                    taxes: parseFloat(checkoutForm.dataset.taxes).toFixed(2),
                    total: parseFloat(checkoutForm.dataset.total).toFixed(2),
                    items: cartData
                };

                // Save order data to local storage for confirmation page
                localStorage.setItem('ekavoo_last_order', JSON.stringify(customerData));

                // --- Automatic Stock Update ---
                let storeProducts = JSON.parse(localStorage.getItem('ekavoo_products')) || defaultCatalog;
                cartData.forEach(cartItem => {
                    const product = storeProducts.find(p => p.id === cartItem.id || p.title === cartItem.title);
                    if (product) {
                        product.stock = Math.max(0, (product.stock || 0) - cartItem.quantity);
                    }
                });
                localStorage.setItem('ekavoo_products', JSON.stringify(storeProducts));

                // Sync with Admin Dashboard Orders
                let allOrders = JSON.parse(localStorage.getItem('ekavoo_orders')) || [];
                // Build a human-readable items string for the admin table
                const itemsSummary = cartData.map(i => `${i.title} (${i.quantity})`).join(', ');
                allOrders.unshift({
                    id: customerData.orderId,
                    customer: customerData.name,
                    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                    items: itemsSummary,
                    amount: parseFloat(customerData.total),
                    status: 'Processing',
                    paymentMethod: selectedPayment || 'upi',
                    paid: true
                });
                localStorage.setItem('ekavoo_orders', JSON.stringify(allOrders));

                // Clear the cart
                localStorage.removeItem('ekavoo_cart');

                // Redirect to confirmation page
                window.location.href = 'confirmation.html';
            }
        });
    }

    // --- Confirmation Page Logic ---
    const displayOrderId = document.getElementById('displayOrderId');
    if (displayOrderId) {
        const orderData = JSON.parse(localStorage.getItem('ekavoo_last_order'));

        if (!orderData) {
            // No order data found, redirect to home
            window.location.href = 'index.html';
        } else {
            // Populate data
            displayOrderId.textContent = `#${orderData.orderId}`;

            // Handle the UI rendering of the payment method
            let payMethodText = "Online Payment";
            if(orderData.paymentMethod === 'upi') payMethodText = "UPI Payment";
            if(orderData.paymentMethod === 'card') payMethodText = "Credit/Debit Card";
            if(orderData.paymentMethod === 'netbanking') payMethodText = "Net Banking/Wallet";
            
            const statusPaidEl = document.querySelector('.status-paid');
            if (statusPaidEl) {
                statusPaidEl.innerHTML = `<i class="fa-solid fa-check"></i> Paid via ${payMethodText}`;
            }

            // Set Date/Time if element exists
            const confDateEl = document.getElementById('confDate');
            if (confDateEl && orderData.orderDate) {
                confDateEl.textContent = orderData.orderDate;
            }

            document.getElementById('confName').textContent = orderData.name;
            document.getElementById('confEmail').textContent = orderData.email;
            document.getElementById('confPhone').textContent = orderData.mobile;

            document.getElementById('confAddress').innerHTML = `${orderData.address}<br>${orderData.city}, ${orderData.state} - ${orderData.pincode}`;

            // Format amounts with commas and ₹
            const formatINR = (amt) => `₹${parseFloat(amt).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

            document.getElementById('confSubtotal').textContent = formatINR(orderData.subtotal);
            document.getElementById('confShipping').textContent = formatINR(orderData.shipping);
            document.getElementById('confTaxes').textContent = formatINR(orderData.taxes);
            document.getElementById('confTotal').textContent = formatINR(orderData.total);

            const confItemsList = document.getElementById('confItemsList');
            orderData.items.forEach(item => {
                const itemEl = document.createElement('div');
                itemEl.classList.add('conf-item');
                itemEl.innerHTML = `
                    <span>${item.quantity}x ${item.title}</span>
                    <span>₹${(item.price * item.quantity).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                `;
                confItemsList.appendChild(itemEl);
            });
            
            // Print Receipt Logic
            const printReceiptBtn = document.getElementById('printReceiptBtn');
            if (printReceiptBtn) {
                printReceiptBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    window.print();
                });
            }
        }
    }

    // --- Newsletter Subscription Logic ---
    const newsletterForm = document.getElementById('newsletterForm');
    const newsletterEmail = document.getElementById('newsletterEmail');
    const newsletterSubmitBtn = document.getElementById('newsletterSubmitBtn');
    const newsletterSuccessMsg = document.getElementById('newsletterSuccessMsg');

    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function (e) {
            e.preventDefault(); // Prevent page reload

            const email = newsletterEmail.value.trim();

            if (email) {
                // Simulate saving to a database by storing in localStorage
                // Check if we already have subscribers
                let subscribers = JSON.parse(localStorage.getItem('ekavoo_subscribers')) || [];

                // Add the new email if it doesn't already exist
                if (!subscribers.includes(email)) {
                    subscribers.push(email);
                    localStorage.setItem('ekavoo_subscribers', JSON.stringify(subscribers));
                }

                // Show success message
                newsletterForm.style.display = 'none'; // Hide the input form
                if (newsletterSuccessMsg) {
                    newsletterSuccessMsg.style.display = 'block';
                }

                console.log(`Successfully subscribed: ${email}`);
            }
        });
    }

    // --- Search Feature Logic ---

    function openSearch() {
        if (searchOverlay) {
            searchOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
            setTimeout(() => {
                if (searchInput) searchInput.focus();
            }, 100);
        }
    }

    function closeSearch() {
        if (searchOverlay) {
            searchOverlay.classList.remove('active');
            document.body.style.overflow = '';
            if (searchInput) searchInput.value = '';
            if (searchResults) searchResults.innerHTML = '';
            if (searchEmptyMsg) searchEmptyMsg.style.display = 'none';
        }
    }

    const openSearchBtns = Array.from(document.querySelectorAll('[id="openSearchBtn"], .open-search-btn'));
    openSearchBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            openSearch();
        });
    });

    if (closeSearchBtn) closeSearchBtn.addEventListener('click', closeSearch);

    // Escape key to close
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && searchOverlay && searchOverlay.classList.contains('active')) {
            closeSearch();
        }
    });

    // Real-time Search Logic
    if (searchInput && searchResults && searchEmptyMsg) {
        searchInput.addEventListener('input', function () {
            const query = this.value.trim().toLowerCase();
            searchResults.innerHTML = ''; // Clear previous

            if (query.length === 0) {
                searchEmptyMsg.style.display = 'none';
                return;
            }

            const matchedProducts = productCatalog.filter(product =>
                product.title.toLowerCase().includes(query) ||
                product.category.toLowerCase().includes(query)
            );

            if (matchedProducts.length === 0) {
                searchEmptyMsg.style.display = 'block';
            } else {
                searchEmptyMsg.style.display = 'none';

                matchedProducts.forEach(product => {
                    const resultEl = document.createElement('a');
                    resultEl.href = 'shop.html'; // Assuming shop.html is the destination
                    resultEl.className = 'search-result-item';
                    // Special: Check stock for overlay
                    const currentProduct = productCatalog.find(p => p.id === product.id);
                    if (currentProduct && currentProduct.stock <= 0) {
                        resultEl.innerHTML = `
                            <div style="position:relative;">
                                <img src="${product.image}" alt="${product.title}" class="search-result-img" style="filter: grayscale(1); opacity: 0.5;">
                                <div style="position:absolute; top:50%; left:50%; transform:translate(-50%, -50%); background:rgba(0,0,0,0.7); color:white; padding:2px 5px; font-size:0.6rem; border-radius:2px;">SOLD OUT</div>
                            </div>
                            <div class="search-result-info">
                                <h4 class="search-result-title">${product.title}</h4>
                                <div class="search-result-price">₹${product.price.toLocaleString()}</div>
                                <div class="search-result-link" style="color: #999;">Out of Stock</div>
                            </div>
                        `;
                    } else {
                        resultEl.innerHTML = `
                            <img src="${product.image}" alt="${product.title}" class="search-result-img">
                            <div class="search-result-info">
                                <h4 class="search-result-title">${product.title}</h4>
                                <div class="search-result-price">₹${product.price.toLocaleString()}</div>
                                <div class="search-result-link">
                                    View Product <i class="fa-solid fa-arrow-right" style="font-size: 0.8rem;"></i>
                                </div>
                            </div>
                        `;
                    }

                    // Optional: If they click, we can open the modal directly instead of navigating if they are already on shop.html
                    resultEl.addEventListener('click', (e) => {
                        // If we wanted to open the modal directly on the current page:
                        /*
                        e.preventDefault();
                        closeSearch();
                        openModal({
                            image: product.image,
                            title: product.title,
                            price: `₹${product.price.toLocaleString()}`,
                            category: product.category
                        });
                        */
                    });

                    searchResults.appendChild(resultEl);
                });
            }
        });
    }

    // --- User Account & Auth Logic ---
    const authView = document.getElementById('authView');
    const dashboardView = document.getElementById('dashboardView');
    const authTabs = document.querySelectorAll('.auth-tab');
    const authForms = document.querySelectorAll('.auth-form');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const profileForm = document.getElementById('profileForm');
    const addressForm = document.getElementById('addressForm');
    const logoutBtn = document.getElementById('logoutBtn');
    const dashNavBtns = document.querySelectorAll('.dash-nav-btn');
    const dashTabContents = document.querySelectorAll('.dash-tab-content');

    // Auth Tab Switching
    authTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.dataset.target;

            authTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            authForms.forEach(f => {
                f.style.display = f.id === target ? 'block' : 'none';
            });
        });
    });

    // Dashboard Tab Switching
    dashNavBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (btn.id === 'logoutBtn') return;

            const tabId = btn.dataset.tab;

            dashNavBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            dashTabContents.forEach(content => {
                content.style.display = content.id === tabId ? 'block' : 'none';
            });
        });
    });

    // Initialize User Data
    let currentUser = JSON.parse(localStorage.getItem('ekavoo_user')) || null;

    function updateAccountView() {
        if (!authView || !dashboardView) return;

        if (currentUser) {
            authView.style.display = 'none';
            dashboardView.style.display = 'block';

            // Populate Dashboard
            document.getElementById('displayUserName').textContent = currentUser.name;
            document.getElementById('profileName').value = currentUser.name;
            document.getElementById('profileEmail').value = currentUser.email;
            document.getElementById('profileMobile').value = currentUser.mobile;

            if (currentUser.address) {
                document.getElementById('profileAddress').value = currentUser.address.full || '';
                document.getElementById('profileCity').value = currentUser.address.city || '';
                document.getElementById('profileState').value = currentUser.address.state || '';
                document.getElementById('profilePincode').value = currentUser.address.pincode || '';
            }
        } else {
            authView.style.display = 'block';
            dashboardView.style.display = 'none';
        }
    }

    // Login Logic
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // Mock Login: In a real app, you'd validate against a DB
            const email = document.getElementById('loginEmail').value;

            // Check if user exists in mock DB (localStorage)
            const users = JSON.parse(localStorage.getItem('ekavoo_users_db')) || [];
            const user = users.find(u => u.email === email || u.mobile === email);

            if (user) {
                currentUser = user;
                localStorage.setItem('ekavoo_user', JSON.stringify(currentUser));
                updateAccountView();
            } else {
                // For demo purposes, if it's the first time, let's just log them in or create a default
                currentUser = {
                    name: "Alex Johnson",
                    email: email,
                    mobile: "+91 98765 43210",
                    address: {
                        full: "123 luxury Lane, Serenity Heights",
                        city: "Mumbai",
                        state: "Maharashtra",
                        pincode: "400001"
                    }
                };
                localStorage.setItem('ekavoo_user', JSON.stringify(currentUser));
                updateAccountView();
            }
        });
    }

    // Signup Logic
    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('signupName').value;
            const email = document.getElementById('signupEmail').value;
            const mobile = document.getElementById('signupMobile').value;

            currentUser = {
                name: name,
                email: email,
                mobile: mobile,
                address: {}
            };

            // Save to mock DB
            const users = JSON.parse(localStorage.getItem('ekavoo_users_db')) || [];
            users.push(currentUser);
            localStorage.setItem('ekavoo_users_db', JSON.stringify(users));

            // Set current session
            localStorage.setItem('ekavoo_user', JSON.stringify(currentUser));
            updateAccountView();
        });
    }

    // Profile Update Logic
    if (profileForm) {
        profileForm.addEventListener('submit', (e) => {
            e.preventDefault();
            currentUser.name = document.getElementById('profileName').value;
            currentUser.email = document.getElementById('profileEmail').value;
            currentUser.mobile = document.getElementById('profileMobile').value;

            localStorage.setItem('ekavoo_user', JSON.stringify(currentUser));
            document.getElementById('displayUserName').textContent = currentUser.name;

            const successMsg = document.getElementById('profileSuccessMsg');
            successMsg.style.display = 'inline';
            setTimeout(() => successMsg.style.display = 'none', 3000);
        });
    }

    // Address Update Logic
    if (addressForm) {
        addressForm.addEventListener('submit', (e) => {
            e.preventDefault();
            currentUser.address = {
                full: document.getElementById('profileAddress').value,
                city: document.getElementById('profileCity').value,
                state: document.getElementById('profileState').value,
                pincode: document.getElementById('profilePincode').value
            };

            localStorage.setItem('ekavoo_user', JSON.stringify(currentUser));

            const successMsg = document.getElementById('addressSuccessMsg');
            successMsg.style.display = 'inline';
            setTimeout(() => successMsg.style.display = 'none', 3000);
        });
    }

    // Logout Logic
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            currentUser = null;
            localStorage.removeItem('ekavoo_user');
            updateAccountView();
        });
    }

    // Run on Pageload
    updateAccountView();

    // --- Pink Bow Wishlist Logic ---

    function updateWishlistButtons() {
        const wishlistButtons = document.querySelectorAll('.wishlist-btn');
        wishlistButtons.forEach(btn => {
            const id = btn.dataset.id;
            if (wishlist.includes(id)) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }

    function toggleWishlist(id) {
        const index = wishlist.indexOf(id);
        if (index > -1) {
            wishlist.splice(index, 1);
        } else {
            wishlist.push(id);
        }
        localStorage.setItem('ekavoo_wishlist', JSON.stringify(wishlist));
        updateCartUI();
        updateWishlistButtons();
        if (document.getElementById('wishlistItems')) renderWishlist();
    }

    // Attach listeners to wishlist buttons on product cards
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('.wishlist-btn');
        if (btn) {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(btn.dataset.id);
        }
    });

    function renderWishlist() {
        const wishlistContainer = document.getElementById('wishlistItems');
        const emptyMsg = document.getElementById('wishlistEmptyMsg');
        if (!wishlistContainer) return;

        wishlistContainer.innerHTML = '';

        if (wishlist.length === 0) {
            if (emptyMsg) emptyMsg.style.display = 'block';
            return;
        }

        if (emptyMsg) emptyMsg.style.display = 'none';

        wishlist.forEach(productId => {
            const product = productCatalog.find(p => p.id === productId);
            if (!product) return;

            const itemEl = document.createElement('div');
            itemEl.classList.add('wishlist-item');
            itemEl.innerHTML = `
                <div class="wishlist-item-img-link">
                    <img src="${product.image}" alt="${product.title}" class="wishlist-item-img">
                </div>
                <div class="wishlist-item-details">
                    <h3 class="wishlist-item-title">${product.title}</h3>
                    <p class="wishlist-item-price">₹${product.price.toLocaleString()}</p>
                    <div class="wishlist-item-actions">
                        <button class="btn btn-primary wishlist-add-to-cart" data-id="${product.id}">Add to Cart</button>
                        <button class="remove-wishlist" data-id="${product.id}">Remove</button>
                    </div>
                </div>
            `;
            wishlistContainer.appendChild(itemEl);
        });

        // Add to Cart from Wishlist
        wishlistContainer.querySelectorAll('.wishlist-add-to-cart').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.dataset.id;
                const product = productCatalog.find(p => p.id === id);
                if (product) {
                    addToCart({
                        id: product.id,
                        title: product.title,
                        price: product.price,
                        image: product.image,
                        quantity: 1
                    });
                    openCart(); // Show cart after adding
                }
            });
        });

        // Remove from Wishlist
        wishlistContainer.querySelectorAll('.remove-wishlist').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.dataset.id;
                toggleWishlist(id);
            });
        });
    }

    // --- Dynamic Footer Settings ---
    function applyFooterSettings() {
        const footerData = JSON.parse(localStorage.getItem('ekavoo_footer'));
        if (!footerData) return;

        // 1. Update Contact List
        const footerHeadings = document.querySelectorAll('.footer-links h4');
        let contactList = null;
        footerHeadings.forEach(h4 => {
            if (h4.textContent.includes('Contact')) {
                contactList = h4.nextElementSibling;
            }
        });

        if (contactList) {
            // Keep the first two links (Fragrance Finder, Sustainability) if they exist
            const items = Array.from(contactList.querySelectorAll('li'));
            const firstTwo = items.slice(0, 2);
            
            contactList.innerHTML = '';
            firstTwo.forEach(li => contactList.appendChild(li));

            if (footerData.address) {
                contactList.innerHTML += `<li style="color: rgba(255,255,255,0.7); display: flex; align-items: flex-start; gap: 8px;"><i class="fa-solid fa-location-dot" style="margin-top:4px;"></i> <span>${footerData.address}</span></li>`;
            }
            if (footerData.email) {
                contactList.innerHTML += `<li><a href="mailto:${footerData.email}"><i class="fa-regular fa-envelope"></i> ${footerData.email}</a></li>`;
            }
            if (footerData.phone) {
                contactList.innerHTML += `<li><a href="tel:${footerData.phone.replace(/[\s-]/g, '')}"><i class="fa-solid fa-phone"></i> ${footerData.phone}</a></li>`;
            }
        }

        // 2. Update Social Links
        const socialLinksDiv = document.querySelector('.social-links');
        if (socialLinksDiv) {
            socialLinksDiv.innerHTML = '';
            if (footerData.insta) socialLinksDiv.innerHTML += `<a href="${footerData.insta}" target="_blank" aria-label="Instagram"><i class="fa-brands fa-instagram"></i></a>`;
            if (footerData.fb) socialLinksDiv.innerHTML += `<a href="${footerData.fb}" target="_blank" aria-label="Facebook"><i class="fa-brands fa-facebook"></i></a>`;
            if (footerData.wa) socialLinksDiv.innerHTML += `<a href="${footerData.wa}" target="_blank" aria-label="WhatsApp"><i class="fa-brands fa-whatsapp"></i></a>`;
            if (footerData.twitter) socialLinksDiv.innerHTML += `<a href="${footerData.twitter}" target="_blank" aria-label="Twitter"><i class="fa-brands fa-twitter"></i></a>`;
            if (footerData.youtube) socialLinksDiv.innerHTML += `<a href="${footerData.youtube}" target="_blank" aria-label="YouTube"><i class="fa-brands fa-youtube"></i></a>`;
        }
    }


    // Run on initialize
    updateCartUI();
    updateWishlistButtons();
    if (document.getElementById('wishlistItems')) renderWishlist();
    applyFooterSettings();
});
