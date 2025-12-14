// Sweet Treats Website JavaScript
// Using Local Storage for Simulation Purposes Only
// ---------------------------------------------------------------

/* ================================================
   PRODUCT CATALOGUE
   ================================================ */

const products = [
    {
      "name": "Chocolate Croissant",
      "description": "Flaky, buttery croissant filled with rich chocolate.",
      "category": "Pastries",
      "price": 4.00,
      "rewardPoints": 8,
      "image": "images/chocolate-croissant.jpg"
    },
    {
      "name": "Sourdough Bread",
      "description": "Classic sourdough loaf with a crispy crust and soft, tangy interior.",
      "category": "Breads",
      "price": 5.00,
      "rewardPoints": 10,
      "image": "images/sourdough-bread.jpg"
    },
    {
      "name": "Blueberry Muffin",
      "description": "Moist muffin bursting with fresh blueberries and a hint of lemon zest.",
      "category": "Muffins",
      "price": 3.50,
      "rewardPoints": 7,
      "image": "images/blueberry-muffin.jpg"
    },
    {
      "name": "Cinnamon Roll",
      "description": "Soft, sweet roll swirled with cinnamon and topped with cream cheese icing.",
      "category": "Pastries",
      "price": 6.00,
      "rewardPoints": 12,
      "image": "images/cinnamon-roll.jpg"
    },
    {
      "name": "Cheesecake Slice",
      "description": "Creamy classic cheesecake with a buttery graham cracker crust.",
      "category": "Cakes",
      "price": 6.50,
      "rewardPoints": 13,
      "image": "images/cheesecake-slice.jpg"
    },
    {
      "name": "Baguette",
      "description": "Traditional French baguette with a golden, crunchy crust and soft interior.",
      "category": "Breads",
      "price": 3.00,
      "rewardPoints": 5,
      "image": "images/baguette.jpg"
    },
    {
      "name": "Chocolate Chip Cookie",
      "description": "Crispy on the edges, chewy in the center, loaded with chocolate chips.",
      "category": "Cookies",
      "price": 2.50,
      "rewardPoints": 5,
      "image": "images/chocolate-chip-cookie.jpg"
    },
    {
      "name": "Red Velvet Cupcake",
      "description": "Moist red velvet cupcake topped with cream cheese frosting.",
      "category": "Cupcakes",
      "price": 3.50,
      "rewardPoints": 7,
      "image": "images/red-velvet-cupcake.jpg"
    },
    {
      "name": "Lemon Tart",
      "description": "Tangy lemon filling in a crisp pastry shell, dusted with powdered sugar.",
      "category": "Tarts",
      "price": 4.00,
      "rewardPoints": 8,
      "image": "images/lemon-tart.jpg"
    },
    {
      "name": "Almond Danish",
      "description": "Flaky Danish pastry filled with almond cream and topped with sliced almonds.",
      "category": "Pastries",
      "price": 5.50,
      "rewardPoints": 11,
      "image": "images/almond-danish.jpg"
    }
  ];

/* ================================================
   SECTION 1: USER REGISTRATION & AUTHENTICATION
   ================================================ */

// Register new user with validation
function registerUser() {
    const username = document.getElementById('register-username').value.trim();
    const email = document.getElementById('register-email').value.trim();
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const firstName = document.getElementById('register-firstname').value.trim();
    const lastName = document.getElementById('register-lastname').value.trim();

    // Validate all fields are filled
    if (!username || !email || !password || !confirmPassword || !firstName || !lastName) {
        showErrorNotification('Please fill out all fields.');
        return;
    }

    // Validate password meets requirements
    const passwordValidation = validatePassword(password);
    
    if (!passwordValidation.valid) {
        let missing = [];
        if (!passwordValidation.requirements.length) missing.push('at least 8 characters');
        if (!passwordValidation.requirements.uppercase) missing.push('at least 1 uppercase letter');
        if (!passwordValidation.requirements.number) missing.push('at least 1 number');
        if (!passwordValidation.requirements.specialChars) missing.push('at least 2 special characters');
        
        showErrorNotification('Password does not meet requirements:\n\n• ' + missing.join('\n• '));
        return;
    }

    // Verify passwords match
    if (password !== confirmPassword) {
        showErrorNotification('Passwords do not match.');
        return;
    }

    // Check if user already exists
    let users = JSON.parse(localStorage.getItem('users')) || [];
    const userExists = users.some(u => u.username === username || u.email === email);

    if (userExists) {
        showErrorNotification('Username or email already exists.');
        return;
    }

    // Create new user object
    const newUser = {
        username: username,
        email: email,
        password: password,
        firstName: firstName,
        lastName: lastName,
        phone: '',
        streetAddress: '',
        city: '',
        state: '',
        zipCode: '',
        profilePicture: 'images/profile-placeholder.png',
        rewards: 0,
        cart: [],
        orderHistory: [],
        rewardHistory: [],
        paymentMethods: []
    };

    // Save user to localStorage
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    showNotification('Account created successfully! Please log in.');
    window.location.href = 'LoginPage.html';
}

// Validate password meets security requirements
function validatePassword(password) {
    const requirements = {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        number: /[0-9]/.test(password),
        specialChars: (password.match(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/g) || []).length >= 2
    };
    
    const allValid = requirements.length && requirements.uppercase && requirements.number && requirements.specialChars;
    
    return {
        valid: allValid,
        requirements: requirements
    };
}

// Setup live password validation feedback
function setupPasswordValidation() {
    const passwordInput = document.getElementById('register-password');
    if (!passwordInput) return;
    
    // Update requirement indicators as user types
    passwordInput.addEventListener('input', function() {
        const password = this.value;
        const validation = validatePassword(password);
        
        // Update colors based on whether requirements are met
        document.getElementById('req-length').style.color = validation.requirements.length ? '#333' : '#e74c3c';
        document.getElementById('req-uppercase').style.color = validation.requirements.uppercase ? '#333' : '#e74c3c';
        document.getElementById('req-number').style.color = validation.requirements.number ? '#333' : '#e74c3c';
        document.getElementById('req-special').style.color = validation.requirements.specialChars ? '#333' : '#e74c3c';
    });
}

// Update individual requirement display
function updateRequirement(elementId, isMet) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    if (isMet) {
        element.style.color = '#333';
        element.style.fontWeight = 'normal';
    } else {
        element.style.color = '#e74c3c';
        element.style.fontWeight = 'normal';
    }
}

/* ================================================
   SECTION 2: USER LOGIN & SESSION MANAGEMENT
   ================================================ */

// Authenticate user login
function loginUser(username, password) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const found = users.find(u => u.username === username && u.password === password);

    if (!found) {
        return { error: true, message: 'Invalid username or password!' };
    }

    // Initialize cart if it doesn't exist
    if (!found.cart) {
        found.cart = [];
    }

    // Set active user session
    localStorage.setItem('activeUser', JSON.stringify(found));
    
    // Transfer any guest cart items to user cart
    transferGuestCartToUser();
    
    return { success: true, message: 'Login successful!' };
}

// Get currently logged in user
function getActiveUser() {
    return JSON.parse(localStorage.getItem('activeUser'));
}

// Update active user data across localStorage
function updateActiveUser(updatedUser) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const index = users.findIndex(u => u.username === updatedUser.username);

    if (index !== -1) {
        users[index] = updatedUser;
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('activeUser', JSON.stringify(updatedUser));
    }
}

// Log out current user
function logoutUser() {
    localStorage.removeItem('activeUser');
}

// Delete user account permanently
function deleteAccount() {
    const user = getActiveUser();
    if (!user) return;

    let users = JSON.parse(localStorage.getItem('users')) || [];
    users = users.filter(u => u.username !== user.username);

    localStorage.setItem('users', JSON.stringify(users));
    localStorage.removeItem('activeUser');
}

/* ================================================
   SECTION 3: SHOPPING CART MANAGEMENT
   ================================================ */

// Get cart for current user or guest
function getCart() {
    const user = getActiveUser();
    
    if (user) {
        // Return logged-in user's cart
        return user.cart || [];
    } else {
        // Return guest cart from localStorage
        return JSON.parse(localStorage.getItem('cart')) || [];
    }
}

// Save cart to appropriate location
function saveCart(cart) {
    const user = getActiveUser();
    
    if (user) {
        // Save to user's cart
        user.cart = cart;
        updateActiveUser(user);
    } else {
        // Save to guest cart in localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
    }
}

// Add item to cart
function addToCart(item) {
    const cart = getCart();
    
    // Check if item already exists in cart
    const existingItemIndex = cart.findIndex(cartItem => cartItem.name === item.name);
    
    if (existingItemIndex !== -1) {
        // Increment quantity if item exists
        cart[existingItemIndex].quantity = (cart[existingItemIndex].quantity || 1) + 1;
    } else {
        // Add new item with quantity 1
        const cartItem = {
            ...item,
            quantity: 1,
            cartId: `${Date.now()}-${Math.floor(Math.random() * 1000)}`
        };
        cart.push(cartItem);
    }
    
    saveCart(cart);
    updateCartCount();
    showNotification('Item added to cart!');
}

// Remove item from cart by cartId
function removeFromCart(cartId) {
    const cart = getCart();
    const index = cart.findIndex(item => item.cartId === cartId);
    
    if (index === -1) {
        return;
    }
    
    cart.splice(index, 1);
    saveCart(cart);
    updateCartCount();
    loadCartPage();
}

// Clear all reward discounts from cart
function clearRewardDiscountsFromCart() {
    const cart = getCart();
    
    // Remove discount from all items
    cart.forEach(item => {
        delete item.rewardDiscount;
    });
    
    saveCart(cart);
    clearAppliedReward();
}

// Update quantity of cart item
function updateCartItemQuantity(cartId, change) {
    const cart = getCart();
    const item = cart.find(item => item.cartId === cartId);
    
    if (!item) {
        return;
    }
    
    item.quantity += change;
    
    // Remove item if quantity reaches zero
    if (item.quantity <= 0) {
        const index = cart.indexOf(item);
        cart.splice(index, 1);
    }
    
    saveCart(cart);
    updateCartCount();
    loadCartPage();
}

// Setup event listeners for cart page buttons
function setupCartEventListeners() {
    // Remove old listeners by cloning and replacing buttons
    const allButtons = document.querySelectorAll('.increase-btn, .decrease-btn, .remove-btn');
    allButtons.forEach(btn => {
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);
    });
    
    // Get fresh button references
    const increaseButtons = document.querySelectorAll('.increase-btn');
    const decreaseButtons = document.querySelectorAll('.decrease-btn');
    const removeButtons = document.querySelectorAll('.remove-btn');
    
    // Attach increase quantity listeners
    increaseButtons.forEach((btn) => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const cartId = this.getAttribute('data-cart-id');
            updateCartItemQuantity(cartId, 1);
        });
    });
    
    // Attach decrease quantity listeners
    decreaseButtons.forEach((btn) => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const cartId = this.getAttribute('data-cart-id');
            updateCartItemQuantity(cartId, -1);
        });
    });
    
    // Attach remove item listeners
    removeButtons.forEach((btn) => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const cartId = this.getAttribute('data-cart-id');
            removeFromCart(cartId);
        });
    });
}

// Update cart summary totals
function updateCartSummary() {
    const cart = getCart();
    
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.08;
    const total = subtotal + tax;
    
    // Calculate total reward points
    const totalRewardPoints = cart.reduce((sum, item) => {
        return sum + ((item.rewardPoints || 0) * (item.quantity || 1));
    }, 0);
    
    // Update DOM elements
    const subtotalEl = document.getElementById('cart-subtotal');
    const taxEl = document.getElementById('cart-tax');
    const totalEl = document.getElementById('cart-total');
    
    if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    if (taxEl) taxEl.textContent = `$${tax.toFixed(2)}`;
    if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`;
    
    // Display reward points if applicable
    let rewardPointsDisplay = document.getElementById('cart-reward-points');
    
    if (totalRewardPoints > 0) {
        if (!rewardPointsDisplay) {
            // Create reward points display element
            const cartSummaryDiv = totalEl?.closest('.order-summary') || document.querySelector('.cart-summary');
            if (cartSummaryDiv) {
                rewardPointsDisplay = document.createElement('div');
                rewardPointsDisplay.id = 'cart-reward-points';
                rewardPointsDisplay.style.cssText = 'margin-top: 15px; padding: 12px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px; text-align: center; color: white;';
                cartSummaryDiv.appendChild(rewardPointsDisplay);
            }
        }
        
        if (rewardPointsDisplay) {
            rewardPointsDisplay.innerHTML = `
                <span style="font-size: 0.9rem;">🎁 You will earn </span>
                <strong style="font-size: 1.1rem;">${totalRewardPoints} points</strong>
                <span style="font-size: 0.9rem;"> for this order!</span>
            `;
        }
    } else {
        // Remove display if no points
        if (rewardPointsDisplay) {
            rewardPointsDisplay.remove();
        }
    }
}

// Get cart total price
function getCartTotal() {
    const cart = getCart();
    return cart.reduce((total, item) => {
        return total + (item.price * (item.quantity || 1));
    }, 0);
}

// Get total number of items in cart
function getCartItemCount() {
    const cart = getCart();
    return cart.reduce((count, item) => count + (item.quantity || 1), 0);
}

// Update cart count badge in navbar
function updateCartCount() {
    const cartCountElements = document.querySelectorAll('.cart-count, #cart-count');
    const count = getCartItemCount();
    
    cartCountElements.forEach(element => {
        if (element) {
            element.textContent = count;
            element.style.display = count > 0 ? 'flex' : 'none';
        }
    });
}

// Clear entire cart
function clearCart() {
    const user = getActiveUser();
    
    if (user) {
        user.cart = [];
        updateActiveUser(user);
    } else {
        localStorage.removeItem('cart');
    }
    
    updateCartCount();
}

// Transfer guest cart to user cart on login
function transferGuestCartToUser() {
    const guestCart = JSON.parse(localStorage.getItem('cart')) || [];
    
    if (guestCart.length > 0) {
        const user = getActiveUser();
        if (user) {
            user.cart = user.cart || [];
            
            // Merge guest items with user cart, avoiding duplicates
            guestCart.forEach(guestItem => {
                const exists = user.cart.some(userItem => userItem.cartId === guestItem.cartId);
                if (!exists) {
                    user.cart.push(guestItem);
                }
            });
            
            updateActiveUser(user);
            localStorage.removeItem('cart');
        }
    }
}
/* ================================================
   SECTION 3A: CHECKOUT - AUTO-POPULATE USER DATA
   ================================================ */

// Auto-fill checkout form with logged-in user's saved information
function autopopulateCheckoutFields() {
    const user = getActiveUser();
    
    // Only populate if user is logged in
    if (!user) return;
    
    // Get form input elements
    const emailInput = document.querySelector('input[type="email"]');
    const allTextInputs = document.querySelectorAll('.checkout-left input[type="text"]');
    const phoneInput = document.querySelector('input[type="tel"]');
    
    let fieldsPopulated = false;
    
    // Populate customer information
    if (emailInput && user.email) {
        emailInput.value = user.email;
        emailInput.classList.add('autofilled');
        fieldsPopulated = true;
    }
    
    if (allTextInputs[0] && user.firstName) {
        allTextInputs[0].value = user.firstName;
        allTextInputs[0].classList.add('autofilled');
        fieldsPopulated = true;
    }
    
    if (allTextInputs[1] && user.lastName) {
        allTextInputs[1].value = user.lastName;
        allTextInputs[1].classList.add('autofilled');
        fieldsPopulated = true;
    }
    
    if (phoneInput && user.phone) {
        phoneInput.value = user.phone;
        phoneInput.classList.add('autofilled');
        fieldsPopulated = true;
    }
    
    // Populate delivery address fields
    const deliverySection = document.getElementById('delivery-address-section');
    if (deliverySection) {
        const deliveryInputs = deliverySection.querySelectorAll('input[type="text"]');
        
        // Street Address
        if (deliveryInputs[0] && user.streetAddress) {
            deliveryInputs[0].value = user.streetAddress;
            deliveryInputs[0].classList.add('autofilled');
            fieldsPopulated = true;
        }
        
        // City
        const cityInput = Array.from(deliveryInputs).find(input => {
            const label = input.closest('.form-group')?.querySelector('label');
            return label?.textContent.includes('City');
        });
        if (cityInput && user.city) {
            cityInput.value = user.city;
            cityInput.classList.add('autofilled');
            fieldsPopulated = true;
        }
        
        // State dropdown
        const stateSelect = deliverySection.querySelector('select');
        if (stateSelect && user.state) {
            const stateValue = user.state.toUpperCase().trim();
            
            // Find matching option in dropdown
            const matchingOption = Array.from(stateSelect.options).find(option => {
                return option.value.toUpperCase() === stateValue || 
                       option.text.toUpperCase() === stateValue;
            });
            
            if (matchingOption) {
                stateSelect.value = matchingOption.value;
                stateSelect.classList.add('autofilled');
                fieldsPopulated = true;
            }
        }
        
        // ZIP Code
        const zipInput = Array.from(deliveryInputs).find(input => {
            const label = input.closest('.form-group')?.querySelector('label');
            return label?.textContent.includes('ZIP');
        });
        if (zipInput && user.zipCode) {
            zipInput.value = user.zipCode;
            zipInput.classList.add('autofilled');
            fieldsPopulated = true;
        }
    }

    // Populate saved payment method
    if (user.paymentMethods && user.paymentMethods.length > 0) {
        // Select default card or first card
        let selectedMethod;
        if (user.paymentMethods.length === 1) {
            selectedMethod = user.paymentMethods[0];
        } else {
            selectedMethod = user.paymentMethods.find(m => m.isDefault) || user.paymentMethods[0];
        }
        
        // Find payment input fields
        const paymentPanel = document.querySelector('.checkout-panel:nth-child(3)');
        if (paymentPanel) {
            const paymentInputs = paymentPanel.querySelectorAll('input[type="text"]');
            
            if (paymentInputs.length >= 3) {
                const cardNumberInput = paymentInputs[0];
                const expiryInput = paymentInputs[1];
                const cvvInput = paymentInputs[2];
                
                // Populate card number with formatting
                if (cardNumberInput && selectedMethod.cardNumber) {
                    const formatted = selectedMethod.cardNumber.match(/.{1,4}/g)?.join(' ') || selectedMethod.cardNumber;
                    cardNumberInput.value = formatted;
                    cardNumberInput.classList.add('autofilled');
                    fieldsPopulated = true;
                }
                
                // Populate expiry date
                if (expiryInput && selectedMethod.expiry) {
                    expiryInput.value = selectedMethod.expiry;
                    expiryInput.classList.add('autofilled');
                    fieldsPopulated = true;
                }
                
                // Populate CVV
                if (cvvInput && selectedMethod.cvv) {
                    cvvInput.value = selectedMethod.cvv;
                    cvvInput.classList.add('autofilled');
                    fieldsPopulated = true;
                }
            }
        }
    }
    
    // Add visual indicator that info was loaded
    if (fieldsPopulated) {
        const customerPanel = document.querySelector('.checkout-panel');
        
        if (customerPanel && !document.querySelector('.autofill-indicator')) {
            const indicator = document.createElement('div');
            indicator.className = 'autofill-indicator';
            indicator.innerHTML = `
                <span class="autofill-icon">✓</span>
                <span class="autofill-text">Information loaded from your account</span>
            `;
            
            const sectionTitle = customerPanel.querySelector('.section-title');
            if (sectionTitle) {
                sectionTitle.after(indicator);
            } else {
                customerPanel.insertBefore(indicator, customerPanel.firstChild);
            }
        }
    }
}

/* ================================================
   SECTION 3B: CHECKOUT PAGE POPULATION
   ================================================ */

// Populate checkout page with cart items and order summary
function populateCheckoutPage() {
    const checkoutMain = document.querySelector('.checkout-main');
    if (!checkoutMain) return;
    
    const cart = getCart();
    
    // Handle empty cart
    if (cart.length === 0) {
        clearAppliedReward();
        const orderSummaryPanel = document.querySelector('.order-summary-panel');
        if (orderSummaryPanel) {
            orderSummaryPanel.innerHTML = `
                <h2 class="section-title">Your Cart is Empty</h2>
                <div style="text-align: center; padding: 40px 20px;">
                    <div style="font-size: 4rem; margin-bottom: 20px;">🛒</div>
                    <p style="margin-bottom: 20px;">Add some treats to get started!</p>
                    <a href="BrowsePage.html" style="display: inline-block; padding: 12px 24px; background: #ff71aa; color: white; text-decoration: none; border-radius: 8px;">Browse Products</a>
                </div>
            `;
        }
        return;
    }
    
    const orderSummaryPanel = document.querySelector('.order-summary-panel');
    if (!orderSummaryPanel) return;
    
    // Calculate total reward points for order
    const totalRewardPoints = cart.reduce((sum, item) => {
        return sum + ((item.rewardPoints || 0) * (item.quantity || 1));
    }, 0);
    
    // Build order summary HTML
    orderSummaryPanel.innerHTML = `
        <h2 class="section-title">Order Summary</h2>
        <div id="checkout-cart-items"></div>
        
        <div class="reward-code-section">
            <input type="text" id="reward-code-input" placeholder="Enter reward code" maxlength="20">
            <button class="apply-code-btn" id="apply-code-btn" onclick="applyRewardCode()">Apply</button>
        </div>
        
        <div class="order-summary">
            <div class="summary-row"><span>Subtotal</span><span id="checkout-subtotal">$0.00</span></div>
            <div class="summary-row discount-row" id="discount-row" style="display: none;">
                <span>Reward Discount</span><span id="checkout-discount" style="color: #27ae60;">-$0.00</span>
            </div>
            <div class="summary-row"><span>Shipping</span><span id="checkout-shipping">$5.00</span></div>
            <div class="summary-row"><span>Tax (8%)</span><span id="checkout-tax">$0.00</span></div>
            <div class="summary-row total"><span>Total</span><span id="checkout-total">$0.00</span></div>
            
            ${totalRewardPoints > 0 ? `
            <div class="reward-points-display" style="margin-top: 15px; padding: 12px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px; text-align: center; color: white;">
                <span style="font-size: 0.9rem;">🎁 You will earn </span>
                <strong style="font-size: 1.1rem;">${totalRewardPoints} points</strong>
                <span style="font-size: 0.9rem;"> for this order!</span>
            </div>
            ` : ''}
        </div>
        <button class="checkout-button" id="place-order-btn">Place Order</button>
    `;
    
    const cartItemsContainer = document.getElementById('checkout-cart-items');
    
    // Render each cart item
    cart.forEach(item => {
        const cartItemDiv = document.createElement('div');
        cartItemDiv.classList.add('cart-item');
        
        // Check if item is a catering order
        if (item.isCatering && item.cateringDetails) {
            const details = item.cateringDetails;
            const itemsList = details.items.join(', ');
            
            cartItemDiv.innerHTML = `
                <img class="cart-item-image" src="${item.image}" alt="Catering Order">
                <div class="cart-item-details">
                    <span class="cart-item-name" style="font-weight: bold; color: var(--accent);">
                        🎉 Catering Order
                    </span>
                    <div style="font-size: 0.85rem; margin-top: 8px; line-height: 1.5;">
                        <strong>Event Date:</strong> ${details.eventDate}<br>
                        <strong>Event Type:</strong> ${details.eventType}<br>
                        <strong>Items:</strong> ${itemsList}<br>
                        <strong>Message:</strong> ${details.specialRequests}
                    </div>
                    <button class="remove-mini-btn" onclick="removeItemFromCheckout('${item.cartId}')">Remove</button>
                </div>
                <span class="cart-item-price">$${item.price.toFixed(2)}</span>
            `;
        } else {
            // Regular product item
            const itemPrice = item.rewardDiscount ? item.price - item.rewardDiscount : item.price;
            const itemTotal = (itemPrice * (item.quantity || 1)).toFixed(2);
            const hasDiscount = item.rewardDiscount && item.rewardDiscount > 0;
            
            cartItemDiv.innerHTML = `
                <img class="cart-item-image" src="${item.image}" alt="${item.name}">
                <div class="cart-item-details">
                    <span class="cart-item-name">${item.name}${hasDiscount ? ' <span style="color: #27ae60; font-size: 0.85rem;">(FREE)</span>' : ''}</span>
                    <div class="cart-item-quantity-controls">
                        <button class="qty-mini-btn" onclick="decrementItemQuantity('${item.cartId}')">−</button>
                        <span class="cart-item-quantity">Qty: ${item.quantity || 1}</span>
                        <button class="qty-mini-btn" onclick="incrementItemQuantity('${item.cartId}')">+</button>
                    </div>
                    <button class="remove-mini-btn" onclick="removeItemFromCheckout('${item.cartId}')">Remove</button>
                </div>
                <span class="cart-item-price">${hasDiscount ? '<span style="text-decoration: line-through; color: #999;">$' + (item.price * (item.quantity || 1)).toFixed(2) + '</span> ' : ''}$${itemTotal}</span>
            `;
        }
        
        cartItemsContainer.appendChild(cartItemDiv);
    });
    
    // Calculate order totals
    const subtotal = cart.reduce((total, item) => {
        return total + (item.price * (item.quantity || 1));
    }, 0);
    
    // Calculate item-level discounts
    const itemDiscounts = cart.reduce((total, item) => {
        return total + ((item.rewardDiscount || 0) * (item.quantity || 1));
    }, 0);
    
    // Check for order-level discount
    const appliedReward = getAppliedReward();
    let orderDiscount = 0;
    if (appliedReward && (appliedReward.message.includes('$5') || appliedReward.message.includes('$10'))) {
        orderDiscount = appliedReward.amount;
    }
    
    const totalDiscount = itemDiscounts + orderDiscount;
    const subtotalAfterDiscount = Math.max(0, subtotal - totalDiscount);
    
    // Get shipping cost based on fulfillment method
    const fulfillmentMethod = document.querySelector('input[name="fulfillment"]:checked')?.value;
    const shipping = fulfillmentMethod === 'pickup' ? 0 : 5.00;
    
    // Calculate tax on discounted subtotal
    const tax = subtotalAfterDiscount * 0.08;
    const total = subtotalAfterDiscount + tax + shipping;
    
    // Update summary display
    document.getElementById('checkout-subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('checkout-shipping').textContent = shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`;
    document.getElementById('checkout-tax').textContent = `$${tax.toFixed(2)}`;
    document.getElementById('checkout-total').textContent = `$${total.toFixed(2)}`;
    
    // Show discount row if applicable
    if (totalDiscount > 0) {
        const discountRow = document.getElementById('discount-row');
        discountRow.style.display = 'flex';
        document.getElementById('checkout-discount').textContent = `-$${totalDiscount.toFixed(2)}`;
        
        // Disable reward code input
        document.getElementById('reward-code-input').disabled = true;
        document.getElementById('apply-code-btn').disabled = true;
        
        if (appliedReward) {
            showRewardAppliedMessage(appliedReward.message);
        }
    }
    
    // Add place order button listener
    document.getElementById('place-order-btn').addEventListener('click', function(e) {
        e.preventDefault();
        processCheckout();
    });
}

// Helper functions for checkout quantity controls
function incrementItemQuantity(cartId) {
    const cart = getCart();
    const item = cart.find(item => item.cartId === String(cartId));
    
    if (item) {
        item.quantity = (item.quantity || 1) + 1;
        saveCart(cart);
        updateCartCount();
        populateCheckoutPage();
    }
}

function decrementItemQuantity(cartId) {
    const cart = getCart();
    const item = cart.find(item => item.cartId === String(cartId));
    
    if (item) {
        item.quantity = Math.max(1, (item.quantity || 1) - 1);
        saveCart(cart);
        updateCartCount();
        populateCheckoutPage();
    }
}

function removeItemFromCheckout(cartId) {
    if (confirm('Remove this item from cart?')) {
        const cart = getCart();
        const index = cart.findIndex(item => item.cartId === String(cartId));
        
        if (index > -1) {
            cart.splice(index, 1);
            saveCart(cart);
            updateCartCount();
            populateCheckoutPage();
            showNotification('Item removed from cart');
        }
    }
}

// Process checkout and create order
function processCheckout() {
    const user = getActiveUser();
    const cart = getCart();
    
    if (cart.length === 0) {
        showErrorNotification('Your cart is empty!');
        return;
    }
    
    // Validate required fields
    const email = document.querySelector('input[type="email"]').value;
    const firstName = document.querySelector('.checkout-left .form-row .form-group:first-child input').value;
    const lastName = document.querySelector('.checkout-left .form-row .form-group:last-child input').value;
    
    if (!email || !firstName || !lastName) {
        showErrorNotification('Please fill out all required customer information fields.');
        return;
    }
    
    // Calculate final totals with discounts
    const subtotal = cart.reduce((total, item) => {
        return total + (item.price * (item.quantity || 1));
    }, 0);
    
    const totalDiscount = cart.reduce((total, item) => {
        return total + ((item.rewardDiscount || 0) * (item.quantity || 1));
    }, 0);
    
    const appliedReward = getAppliedReward();
    let orderDiscount = 0;
    if (appliedReward && appliedReward.message.includes('$')) {
        orderDiscount = appliedReward.amount;
    }
    
    const finalDiscount = totalDiscount + orderDiscount;
    const discountedSubtotal = Math.max(0, subtotal - finalDiscount);
    
    const fulfillmentMethod = document.querySelector('input[name="fulfillment"]:checked')?.value;
    const shipping = fulfillmentMethod === 'pickup' ? 0 : 5.00;
    const tax = discountedSubtotal * 0.08;
    const orderTotal = discountedSubtotal + tax + shipping;
    
    // Generate order details
    const orderId = Math.floor(10000 + Math.random() * 90000);
    const orderDate = new Date().toLocaleDateString();
    
    // Create order object with catering details preserved
    const order = {
        id: orderId,
        date: orderDate,
        total: orderTotal,
        status: 'Processing',
        discount: finalDiscount,
        items: cart.map(item => {
            if (item.isCatering && item.cateringDetails) {
                return {
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity || 1,
                    image: item.image,
                    rewardDiscount: item.rewardDiscount || 0,
                    isCatering: true,
                    cateringDetails: item.cateringDetails
                };
            } else {
                return {
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity || 1,
                    image: item.image,
                    rewardDiscount: item.rewardDiscount || 0
                };
            }
        })
    };
    
    // Save order to user history if logged in
    if (user) {
        if (!user.orderHistory) user.orderHistory = [];
        user.orderHistory.unshift(order);
        
        // Award reward points based on discounted subtotal
        const pointsEarned = Math.floor(discountedSubtotal * 2);
        user.rewards = (user.rewards || 0) + pointsEarned;
        
        // Mark reward code as used
        if (appliedReward && appliedReward.code) {
            const reward = user.rewardHistory.find(r => r.rewardCode === appliedReward.code);
            if (reward) {
                reward.used = true;
            }
        }
        
        updateActiveUser(user);
    }
    
    // Clear cart and rewards
    clearCart();
    clearAppliedReward();
    
    // Show success message
    alert(`Order #${orderId} placed successfully!\n\nTotal: $${orderTotal.toFixed(2)}${finalDiscount > 0 ? `\nYou saved: $${finalDiscount.toFixed(2)}` : ''}\n\nThank you for your purchase!`);
    
    // Redirect appropriately
    if (user) {
        window.location.href = 'OrderHistoryPage.html';
    } else {
        window.location.href = 'HomePage.html';
    }
}

/* ================================================
   SECTION 3C: REWARD CODE APPLICATION
   ================================================ */

// Apply reward code to cart
function applyRewardCode() {
    const user = getActiveUser();
    const codeInput = document.getElementById('reward-code-input');
    const codeValue = codeInput?.value.trim().toUpperCase();
    
    // Validate code input
    if (!codeValue) {
        showErrorNotification('Please enter a reward code.');
        return;
    }
    
    if (!user) {
        showErrorNotification('Please log in to use reward codes.');
        return;
    }
    
    // Check if user has rewards
    if (!user.rewardHistory || user.rewardHistory.length === 0) {
        showErrorNotification('Invalid reward code. This code is not associated with your account.');
        codeInput.value = '';
        return;
    }
    
    // Find matching reward
    const reward = user.rewardHistory.find(r => r.rewardCode === codeValue);
    
    if (!reward) {
        showErrorNotification('Invalid reward code. This code is not associated with your account.');
        codeInput.value = '';
        return;
    }
    
    // Check expiration
    const today = new Date();
    const expireDate = new Date(reward.expireDate);
    if (today > expireDate) {
        showErrorNotification('This reward code has expired.');
        codeInput.value = '';
        return;
    }
    
    // Check if already used
    if (reward.used) {
        showErrorNotification('This reward code has already been used.');
        codeInput.value = '';
        return;
    }
    
    // Apply reward based on type
    const cart = getCart();
    let discountApplied = false;
    let discountAmount = 0;
    let discountMessage = '';
    
    // Match reward to appropriate products
    if (reward.rewardName.toLowerCase().includes('cookie')) {
        const cookieItem = cart.find(item => item.category === 'Cookies');
        if (cookieItem) {
            if (!cookieItem.rewardDiscount) {
                cookieItem.rewardDiscount = cookieItem.price;
                discountAmount = cookieItem.price;
                discountApplied = true;
                discountMessage = `Free ${cookieItem.name} applied!`;
            }
        } else {
            showErrorNotification('No cookies in your cart. Add a cookie to use this reward!');
            return;
        }
    } 
    else if (reward.rewardName.toLowerCase().includes('cupcake')) {
        const cupcakeItem = cart.find(item => item.category === 'Cupcakes');
        if (cupcakeItem) {
            if (!cupcakeItem.rewardDiscount) {
                cupcakeItem.rewardDiscount = cupcakeItem.price;
                discountAmount = cupcakeItem.price;
                discountApplied = true;
                discountMessage = `Free ${cupcakeItem.name} applied!`;
            }
        } else {
            showErrorNotification('No cupcakes in your cart. Add a cupcake to use this reward!');
            return;
        }
    }
    else if (reward.rewardName.toLowerCase().includes('pastry')) {
        const pastryItem = cart.find(item => item.category === 'Pastries');
        if (pastryItem) {
            if (!pastryItem.rewardDiscount) {
                pastryItem.rewardDiscount = pastryItem.price;
                discountAmount = pastryItem.price;
                discountApplied = true;
                discountMessage = `Free ${pastryItem.name} applied!`;
            }
        } else {
            showErrorNotification('No pastries in your cart. Add a pastry to use this reward!');
            return;
        }
    }
    else if (reward.rewardName.toLowerCase().includes('cake slice')) {
        const cakeItem = cart.find(item => item.category === 'Cakes');
        if (cakeItem) {
            if (!cakeItem.rewardDiscount) {
                cakeItem.rewardDiscount = cakeItem.price;
                discountAmount = cakeItem.price;
                discountApplied = true;
                discountMessage = `Free ${cakeItem.name} applied!`;
            }
        } else {
            showErrorNotification('No cake slices in your cart. Add a cake slice to use this reward!');
            return;
        }
    }
    else if (reward.rewardName.toLowerCase().includes('10%')) {
        // Apply percentage discount
        const subtotal = cart.reduce((total, item) => {
            return total + (item.price * (item.quantity || 1));
        }, 0);
        
        discountAmount = subtotal * 0.10;
        discountApplied = true;
        discountMessage = '10% discount applied to your order!';
    }
    else if (reward.rewardName.toLowerCase().includes('dozen')) {
        // Free dozen - requires 12+ items
        const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
        
        if (totalItems < 12) {
            showErrorNotification(`You need at least 12 items in your cart to use this reward. You currently have ${totalItems} item(s).`);
            return;
        }
        
        // Apply discount to cheapest 12 items
        const sortedCart = [...cart].sort((a, b) => a.price - b.price);
        let itemsToDiscount = 12;
        
        sortedCart.forEach(item => {
            if (itemsToDiscount <= 0) return;
            
            const quantityToDiscount = Math.min(item.quantity || 1, itemsToDiscount);
            
            if (!item.rewardDiscount) {
                item.rewardDiscount = 0;
            }
            
            item.rewardDiscount = item.price * quantityToDiscount;
            discountAmount += item.rewardDiscount;
            itemsToDiscount -= quantityToDiscount;
        });
        
        discountApplied = true;
        discountMessage = 'Free dozen treats applied!';
    }
    else {
        showErrorNotification('This reward code is not recognized. Please contact support.');
        return;
    }
    
    // Save changes if discount was applied
    if (discountApplied) {
        saveCart(cart);
        
        // Store applied reward in session
        sessionStorage.setItem('appliedReward', JSON.stringify({
            code: codeValue,
            amount: discountAmount,
            message: discountMessage
        }));
        
        // Clear and disable input
        codeInput.value = '';
        codeInput.disabled = true;
        document.getElementById('apply-code-btn').disabled = true;
        
        showRewardAppliedMessage(discountMessage);
        populateCheckoutPage();
    }
}

// Display reward applied success message
function showRewardAppliedMessage(message) {
    const rewardSection = document.querySelector('.reward-code-section');
    if (rewardSection) {
        const successMsg = document.createElement('div');
        successMsg.className = 'reward-success-message';
        successMsg.innerHTML = `
            <span style="color: #27ae60; font-weight: 600;">✓ ${message}</span>
        `;
        rewardSection.appendChild(successMsg);
    }
}

// Get currently applied reward from session
function getAppliedReward() {
    const applied = sessionStorage.getItem('appliedReward');
    return applied ? JSON.parse(applied) : null;
}

// Clear applied reward from session
function clearAppliedReward() {
    sessionStorage.removeItem('appliedReward');
}

/* ================================================
   SECTION 4: PAYMENT PROCESSING
   ================================================ */

// Validate fake card details (for demo purposes)
function validateFakeCard(cardNumber, expiry, cvv) {
    // Check card number length
    const cleanCard = cardNumber.replace(/\s/g, '');
    if (cleanCard.length < 13 || !/^\d+$/.test(cleanCard)) {
        return { valid: false, error: 'Card number must be at least 13 digits' };
    }

    // Check expiry format
    if (!expiry || !/^\d{2}\/\d{2}$/.test(expiry)) {
        return { valid: false, error: 'Expiry date must be in MM/YY format' };
    }

    // Validate expiry date
    const [month, year] = expiry.split('/');
    const expMonth = parseInt(month);
    const expYear = parseInt('20' + year);

    if (expMonth < 1 || expMonth > 12) {
        return { valid: false, error: 'Invalid month in expiry date' };
    }

    const today = new Date();
    const expiryDate = new Date(expYear, expMonth - 1);
    
    if (expiryDate <= today) {
        return { valid: false, error: 'Card has expired' };
    }

    // Check CVV
    if (!cvv || !/^\d{3,4}$/.test(cvv)) {
        return { valid: false, error: 'CVV must be 3 or 4 digits' };
    }

    return { valid: true };
}

// Detect card brand from number
function detectCardBrand(cardNumber) {
    const cleanNumber = cardNumber.replace(/\s/g, '');
    
    if (/^4/.test(cleanNumber)) return 'Visa';
    if (/^5[1-5]/.test(cleanNumber)) return 'Mastercard';
    if (/^3[47]/.test(cleanNumber)) return 'American Express';
    if (/^6(?:011|5)/.test(cleanNumber)) return 'Discover';
    
    return 'Card';
}

// Format card number with spaces
function formatCardNumber(input) {
    let value = input.value.replace(/\D/g, '');
    let formatted = value.match(/.{1,4}/g)?.join(' ') || value;
    input.value = formatted.substring(0, 19);
}

// Format expiry date as MM/YY
function formatExpiryDate(input) {
    let value = input.value.replace(/\D/g, '');
    if (value.length >= 2) {
        value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    input.value = value;
}

// Format CVV to numbers only
function formatCVV(input) {
    input.value = input.value.replace(/\D/g, '').substring(0, 4);
}

// Setup payment input formatting on checkout page
function setupPaymentInputFormatting() {
    const paymentPanel = document.querySelector('.checkout-panel:nth-child(3)');
    if (!paymentPanel) return;

    const inputs = paymentPanel.querySelectorAll('input[type="text"]');
    if (inputs.length < 3) return;

    const cardNumberInput = inputs[0];
    const expiryInput = inputs[1];
    const cvvInput = inputs[2];

    // Card number formatting
    if (cardNumberInput) {
        cardNumberInput.setAttribute('placeholder', '1234 5678 9012 3456');
        
        cardNumberInput.addEventListener('input', function() {
            let value = this.value.replace(/\D/g, '');
            let formatted = value.match(/.{1,4}/g)?.join(' ') || value;
            this.value = formatted.substring(0, 19);
        });
    }

    // Expiry date formatting
    if (expiryInput) {
        expiryInput.setAttribute('placeholder', 'MM/YY');
        expiryInput.setAttribute('maxlength', '5');
        
        expiryInput.addEventListener('input', function() {
            let value = this.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.substring(0, 2) + '/' + value.substring(2, 4);
            }
            this.value = value;
        });
    }

    // CVV formatting
    if (cvvInput) {
        cvvInput.setAttribute('placeholder', '123');
        cvvInput.setAttribute('maxlength', '4');
        
        cvvInput.addEventListener('input', function() {
            this.value = this.value.replace(/\D/g, '').substring(0, 4);
        });
    }
}

/* ================================================
   SECTION 4A: FULFILLMENT OPTIONS
   ================================================ */

// Add pickup/delivery selection to checkout
function addFulfillmentOptions() {
    const checkoutMain = document.querySelector('.checkout-main');
    if (!checkoutMain) return;

    const shippingSection = document.querySelector('.checkout-panel:nth-child(2)');
    if (!shippingSection) return;

    // Create fulfillment selection HTML
    const fulfillmentSection = document.createElement('div');
    fulfillmentSection.className = 'fulfillment-method-section';
    fulfillmentSection.innerHTML = `
        <h3 style="font-size: 1.1rem; margin-bottom: 15px; color: var(--text);">
            Fulfillment Method
        </h3>
        <div class="fulfillment-options">
            <label class="fulfillment-option">
                <input type="radio" name="fulfillment" value="delivery" checked>
                <div class="option-content">
                    <div class="option-icon">🚚</div>
                    <div class="option-text">
                        <strong>Delivery</strong>
                        <span>We'll deliver to your address</span>
                    </div>
                    <div class="option-price">$5.00</div>
                </div>
            </label>
            
            <label class="fulfillment-option">
                <input type="radio" name="fulfillment" value="pickup">
                <div class="option-content">
                    <div class="option-icon">🏪</div>
                    <div class="option-text">
                        <strong>Pickup</strong>
                        <span>Pick up at our bakery</span>
                    </div>
                    <div class="option-price">FREE</div>
                </div>
            </label>
        </div>
        
        <div id="pickup-location-info" style="display: none; margin-top: 15px; padding: 15px; background: #f8f9fa; border-radius: 8px;">
            <strong>📍 Pickup Location:</strong><br>
            123 Bakery Lane<br>
            Sweet City, SC 12345<br><br>
            <strong>⏰ Hours:</strong> Mon-Fri 7AM-7PM, Sat-Sun 8AM-6PM<br>
            <small style="color: #666;">Ready for pickup in 30-45 minutes</small>
        </div>
        
        <div id="delivery-address-section">
        </div>
    `;

    // Insert fulfillment options at top of shipping section
    shippingSection.insertBefore(fulfillmentSection, shippingSection.firstChild.nextSibling);

    // Move existing address fields into delivery section
    const deliverySection = document.getElementById('delivery-address-section');
    const addressFields = Array.from(shippingSection.querySelectorAll('.form-group, .form-row'))
        .filter(el => !el.closest('.fulfillment-method-section'));
    
    addressFields.forEach(field => {
        deliverySection.appendChild(field);
    });

    // Setup fulfillment method change handlers
    const fulfillmentInputs = document.querySelectorAll('input[name="fulfillment"]');
    fulfillmentInputs.forEach(input => {
        input.addEventListener('change', function() {
            const pickupInfo = document.getElementById('pickup-location-info');
            const deliverySection = document.getElementById('delivery-address-section');
            
            if (this.value === 'pickup') {
                pickupInfo.style.display = 'block';
                deliverySection.style.display = 'none';
                
                // Make address fields optional
                deliverySection.querySelectorAll('input').forEach(inp => {
                    inp.removeAttribute('required');
                });
            } else {
                pickupInfo.style.display = 'none';
                deliverySection.style.display = 'block';
                
                // Make address fields required
                deliverySection.querySelectorAll('input').forEach(inp => {
                    if (!inp.placeholder?.includes('Apartment')) {
                        inp.setAttribute('required', 'required');
                    }
                });
            }

            updateShippingCost();
        });
    });
}

// Setup fulfillment toggle listeners
function setupFulfillmentToggle() {
    const fulfillmentInputs = document.querySelectorAll('input[name="fulfillment"]');
    const pickupInfo = document.getElementById('pickup-location-info');
    const deliverySection = document.getElementById('delivery-address-section');
    
    if (!fulfillmentInputs.length || !pickupInfo || !deliverySection) return;
    
    fulfillmentInputs.forEach(input => {
        input.addEventListener('change', function() {
            if (this.value === 'pickup') {
                pickupInfo.style.display = 'block';
                deliverySection.style.display = 'none';
                
                // Make address fields optional
                deliverySection.querySelectorAll('input, select').forEach(field => {
                    field.removeAttribute('required');
                });
            } else {
                pickupInfo.style.display = 'none';
                deliverySection.style.display = 'block';
                
                // Make address fields required
                deliverySection.querySelectorAll('input, select').forEach(field => {
                    if (!field.closest('.form-group')?.querySelector('label')?.textContent.includes('Apartment')) {
                        field.setAttribute('required', 'required');
                    }
                });
            }
            
            // Refresh checkout to recalculate totals
            populateCheckoutPage();
        });
    });
}

// Update shipping cost based on fulfillment method
function updateShippingCost() {
    const fulfillmentMethod = document.querySelector('input[name="fulfillment"]:checked')?.value;
    const shippingCost = fulfillmentMethod === 'pickup' ? 0 : 5.00;
    
    const shippingElement = document.getElementById('checkout-shipping');
    if (shippingElement) {
        shippingElement.textContent = shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`;
    }

    // Recalculate total with discount
    const subtotalElement = document.getElementById('checkout-subtotal');
    const discountElement = document.getElementById('checkout-discount');
    const taxElement = document.getElementById('checkout-tax');
    const totalElement = document.getElementById('checkout-total');
    
    if (subtotalElement && taxElement && totalElement) {
        const subtotal = parseFloat(subtotalElement.textContent.replace('$', '')) || 0;
        
        // Get discount if exists
        let discount = 0;
        if (discountElement && discountElement.parentElement.style.display !== 'none') {
            discount = parseFloat(discountElement.textContent.replace('-$', '').replace('$', '')) || 0;
        }
        
        const subtotalAfterDiscount = Math.max(0, subtotal - discount);
        const tax = subtotalAfterDiscount * 0.08;
        const total = subtotalAfterDiscount + tax + shippingCost;
        
        // Update display
        taxElement.textContent = `$${tax.toFixed(2)}`;
        totalElement.textContent = `$${total.toFixed(2)}`;
    }
}
/* ================================================
   SECTION 5: ACCOUNT PAGE MANAGEMENT
   ================================================ */

// Populate account page with user data
function populateAccountPage() {
    const user = getActiveUser();
    
    // Redirect if not logged in
    if (!user && window.location.pathname.includes('account')) {
        showErrorNotification('Please log in to view your account.');
        window.location.href = 'LoginPage.html';
        return;
    }
    
    if (!user) return;

    // Update display name and email
    const accountName = document.querySelector('.account-name');
    const accountEmail = document.querySelector('.account-email');
    
    if (accountName) {
        accountName.textContent = `${user.firstName} ${user.lastName}`;
    }
    if (accountEmail) {
        accountEmail.textContent = user.email;
    }

    // Populate form fields
    const fullNameInput = document.querySelector('input[placeholder="Full Name"]');
    const usernameInput = document.querySelector('input[placeholder="Username"]');
    const phoneInput = document.querySelector('input[placeholder="(000)-000-0000"]');
    const streetAddressInput = document.querySelector('input[placeholder="Street Address"]');
    const cityInput = document.querySelector('input[placeholder="City"]');
    const stateInput = document.querySelector('input[placeholder="State"]');
    const zipCodeInput = document.querySelector('input[placeholder="ZIP Code"]');
    
    if (fullNameInput) fullNameInput.value = `${user.firstName} ${user.lastName}`;
    if (usernameInput) usernameInput.value = user.username;
    if (phoneInput) phoneInput.value = user.phone || '';
    if (streetAddressInput) streetAddressInput.value = user.streetAddress || '';
    if (cityInput) cityInput.value = user.city || '';
    if (stateInput) stateInput.value = user.state || '';
    if (zipCodeInput) zipCodeInput.value = user.zipCode || '';

    // Display payment methods
    displayPaymentMethods();

    // Display rewards
    const rewardsNumber = document.querySelector('.rewards-number');
    if (rewardsNumber) {
        rewardsNumber.textContent = user.rewards || '0';
    }

    // Display recent orders
    const orderTable = document.querySelector('.order-table');
    if (orderTable && user.orderHistory && user.orderHistory.length > 0) {
        const tbody = orderTable.querySelector('tbody') || orderTable;
        const rows = tbody.querySelectorAll('tr');
        
        // Clear existing rows except header
        rows.forEach((row, index) => {
            if (index > 0) row.remove();
        });
        
        // Add order rows
        user.orderHistory.forEach(order => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${order.id}</td>
                <td>${order.date}</td>
                <td>$${order.total.toFixed(2)}</td>
                <td>${order.status}</td>
                <td><button class="tiny-btn" onclick="window.location.href='OrderHistoryPage.html'">View</button></td>
            `;
            tbody.appendChild(row);
        });
    }
    
    // Display profile picture
    displayProfilePicture();
}

// Display saved payment methods
function displayPaymentMethods() {
    const user = getActiveUser();
    if (!user) return;
    
    const paymentBoxes = document.querySelectorAll('.payment-box');
    
    // Clear existing content
    paymentBoxes.forEach(box => box.innerHTML = '');
    
    if (!user.paymentMethods || user.paymentMethods.length === 0) {
        // Show empty state
        if (paymentBoxes[0]) {
            paymentBoxes[0].innerHTML = `
                <p style="color: #999; text-align: center; padding: 20px;">
                    No payment methods saved
                </p>
            `;
        }
        return;
    }
    
    // Display each saved payment method
    user.paymentMethods.forEach((method, index) => {
        if (paymentBoxes[index]) {
            paymentBoxes[index].innerHTML = `
                <div class="saved-payment-card">
                    <div class="payment-card-info">
                        <div class="card-brand">${method.brand || 'Card'}</div>
                        <div class="card-number">•••• •••• •••• ${method.lastFour}</div>
                        <div class="card-expiry">Expires: ${method.expiry}</div>
                        ${method.isDefault ? '<span class="default-badge">Default</span>' : ''}
                    </div>
                    <div class="payment-card-actions">
                        ${!method.isDefault ? `<button class="tiny-btn" onclick="setDefaultPaymentMethod(${index})">Set Default</button>` : ''}
                        <button class="tiny-btn red" onclick="removePaymentMethod(${index})">Remove</button>
                    </div>
                </div>
            `;
        }
    });
}

// Setup account page button event listeners
function setupAccountButtons() {
    // Edit Information button
    const editInfoBtn = document.getElementById('edit-info-btn');
    if (editInfoBtn) {
        let isEditing = false;

        editInfoBtn.addEventListener('click', function() {
            isEditing = !isEditing;

            const fullNameInput = document.getElementById('full-name-input');
            const usernameInput = document.getElementById('username-input');
            const phoneInput = document.getElementById('phone-input');
            const streetAddressInput = document.getElementById('street-address-input');
            const cityInput = document.getElementById('city-input');
            const stateInput = document.getElementById('state-input');
            const zipCodeInput = document.getElementById('zip-code-input');

            if (isEditing) {
                // Enable editing
                fullNameInput.removeAttribute('readonly');
                phoneInput.removeAttribute('readonly');
                streetAddressInput.removeAttribute('readonly');
                cityInput.removeAttribute('readonly');
                stateInput.removeAttribute('disabled');
                zipCodeInput.removeAttribute('readonly');

                editInfoBtn.textContent = 'Save Changes';
                editInfoBtn.classList.add('green');

            } else {
                // Save changes
                const user = getActiveUser();
                if (user) {
                    const fullName = fullNameInput.value.trim().split(' ');
                    user.firstName = fullName[0] || user.firstName;
                    user.lastName = fullName.slice(1).join(' ') || user.lastName;
                    user.phone = phoneInput.value.trim();
                    user.streetAddress = streetAddressInput.value.trim();
                    user.city = cityInput.value.trim();
                    user.state = stateInput.value.trim();
                    user.zipCode = zipCodeInput.value.trim();

                    updateActiveUser(user);
                    showNotification('Account information updated successfully!');

                    const accountName = document.querySelector('.account-name');
                    if (accountName) {
                        accountName.textContent = `${user.firstName} ${user.lastName}`;
                    }
                }

                // Disable editing
                fullNameInput.setAttribute('readonly', 'readonly');
                phoneInput.setAttribute('readonly', 'readonly');
                streetAddressInput.setAttribute('readonly', 'readonly');
                cityInput.setAttribute('readonly', 'readonly');
                stateInput.setAttribute('disabled', 'disabled');
                zipCodeInput.setAttribute('readonly', 'readonly');

                editInfoBtn.textContent = 'Edit Information';
                editInfoBtn.classList.remove('green');
            }
        });
    }

    // Change Password button
    const changePasswordBtn = document.querySelector('.small-btn.grey');
    if (changePasswordBtn && changePasswordBtn.textContent.includes('Change Password')) {
        changePasswordBtn.addEventListener('click', function() {
            showChangePasswordModal();
        });
    }

    // Log Out button
    const logoutBtn = document.querySelector('.large-btn.grey');
    if (logoutBtn && logoutBtn.textContent.includes('Log Out')) {
        logoutBtn.addEventListener('click', function() {
            logoutUser();
            showNotification('You have been logged out.');
            window.location.href = 'HomePage.html';
        });
    }
    
    // Delete Account button
    const deleteBtn = document.querySelector('.large-btn.red');
    if (deleteBtn && deleteBtn.textContent.includes('Delete Account')) {
        deleteBtn.addEventListener('click', function() {
            const confirm = window.confirm('Are you sure you want to delete your account? This action cannot be undone.');
            if (confirm) {
                deleteAccount();
                showNotification('Your account has been deleted.');
                window.location.href = 'HomePage.html';
            }
        });
    }
}

/* ================================================
   SECTION 5A: PAYMENT METHOD MANAGEMENT
   ================================================ */

// Show modal to add new payment method
function showAddPaymentModal() {
    const modal = document.createElement('div');
    modal.className = 'payment-modal';
    modal.innerHTML = `
        <div class="payment-modal-content">
            <div class="payment-modal-header">
                <h3>Add Payment Method</h3>
                <button class="modal-close-btn" onclick="closePaymentModal()">✕</button>
            </div>
            
            <form class="payment-form" onsubmit="savePaymentMethod(event)">
                <div class="form-group">
                    <label>Card Number</label>
                    <input type="text" id="modal-card-number" placeholder="1234 5678 9012 3456" maxlength="19" required>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label>Expiration Date</label>
                        <input type="text" id="modal-expiry" placeholder="MM/YY" maxlength="5" required>
                    </div>
                    
                    <div class="form-group">
                        <label>CVV</label>
                        <input type="text" id="modal-cvv" placeholder="123" maxlength="4" required>
                    </div>
                </div>
                
                <div class="form-group">
                    <label>
                        <input type="checkbox" id="modal-set-default">
                        Set as default payment method
                    </label>
                </div>
                
                <div class="modal-footer">
                    <button type="button" class="medium-btn grey" onclick="closePaymentModal()">Cancel</button>
                    <button type="submit" class="medium-btn">Save Card</button>
                </div>
            </form>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add input formatting
    const cardNumberInput = document.getElementById('modal-card-number');
    const expiryInput = document.getElementById('modal-expiry');
    const cvvInput = document.getElementById('modal-cvv');
    
    cardNumberInput.addEventListener('input', function() {
        let value = this.value.replace(/\D/g, '');
        let formatted = value.match(/.{1,4}/g)?.join(' ') || value;
        this.value = formatted.substring(0, 19);
    });
    
    expiryInput.addEventListener('input', function() {
        let value = this.value.replace(/\D/g, '');
        if (value.length >= 2) {
            value = value.substring(0, 2) + '/' + value.substring(2, 4);
        }
        this.value = value;
    });
    
    cvvInput.addEventListener('input', function() {
        this.value = this.value.replace(/\D/g, '').substring(0, 4);
    });
    
    // Focus first input
    setTimeout(() => cardNumberInput.focus(), 100);
}

// Close payment modal
function closePaymentModal() {
    const modal = document.querySelector('.payment-modal');
    if (modal) {
        modal.remove();
    }
}

// Save new payment method
function savePaymentMethod(event) {
    event.preventDefault();
    
    const user = getActiveUser();
    if (!user) return;
    
    const cardNumber = document.getElementById('modal-card-number').value.replace(/\s/g, '');
    const expiry = document.getElementById('modal-expiry').value;
    const cvv = document.getElementById('modal-cvv').value;
    const setDefault = document.getElementById('modal-set-default').checked;
    
    // Validate card number
    if (cardNumber.length < 13) {
        showErrorNotification('Please enter a valid card number (at least 13 digits).');
        return;
    }
    
    // Validate expiry
    if (!/^\d{2}\/\d{2}$/.test(expiry)) {
        showErrorNotification('Please enter expiry date in MM/YY format.');
        return;
    }
    
    // Validate CVV
    if (cvv.length < 3) {
        showErrorNotification('Please enter a valid CVV (3-4 digits).');
        return;
    }
    
    // Detect card brand
    let brand = 'Card';
    if (/^4/.test(cardNumber)) brand = 'Visa';
    else if (/^5[1-5]/.test(cardNumber)) brand = 'Mastercard';
    else if (/^3[47]/.test(cardNumber)) brand = 'Amex';
    else if (/^6(?:011|5)/.test(cardNumber)) brand = 'Discover';
    
    // Initialize payment methods array if needed
    if (!user.paymentMethods) {
        user.paymentMethods = [];
    }
    
    // Remove default from other cards if setting as default
    if (setDefault) {
        user.paymentMethods.forEach(method => {
            method.isDefault = false;
        });
    }
    
    // First card is always default
    const isFirstCard = user.paymentMethods.length === 0;
    
    // Create payment method object
    const newMethod = {
        brand: brand,
        lastFour: cardNumber.slice(-4),
        expiry: expiry,
        cardNumber: cardNumber,
        cvv: cvv,
        isDefault: setDefault || isFirstCard
    };
    
    // Add to user's payment methods
    user.paymentMethods.push(newMethod);
    updateActiveUser(user);
    
    closePaymentModal();
    displayPaymentMethods();
    
    showNotification('Payment method added successfully!');
}

// Remove payment method
function removePaymentMethod(index) {
    const user = getActiveUser();
    if (!user || !user.paymentMethods) return;
    
    const method = user.paymentMethods[index];
    const confirmRemove = confirm(`Remove ${method.brand} ending in ${method.lastFour}?`);
    
    if (confirmRemove) {
        user.paymentMethods.splice(index, 1);
        
        // If removed card was default, make first card default
        if (method.isDefault && user.paymentMethods.length > 0) {
            user.paymentMethods[0].isDefault = true;
        }
        
        updateActiveUser(user);
        displayPaymentMethods();
        
        showNotification('Payment method removed.');
    }
}

// Set payment method as default
function setDefaultPaymentMethod(index) {
    const user = getActiveUser();
    if (!user || !user.paymentMethods) return;
    
    // Remove default from all cards
    user.paymentMethods.forEach(method => {
        method.isDefault = false;
    });
    
    // Set selected card as default
    user.paymentMethods[index].isDefault = true;
    
    updateActiveUser(user);
    displayPaymentMethods();
    
    showNotification('Default payment method updated.');
}

/* ================================================
   SECTION 5B: PASSWORD CHANGE FUNCTIONALITY
   ================================================ */

// Show change password modal
function showChangePasswordModal() {
    const modal = document.createElement('div');
    modal.className = 'payment-modal';
    modal.innerHTML = `
        <div class="payment-modal-content">
            <div class="payment-modal-header">
                <h3>Change Password</h3>
                <button class="modal-close-btn" onclick="closeChangePasswordModal()">✕</button>
            </div>
            
            <form class="payment-form" onsubmit="changePassword(event)">
                <div class="form-group">
                    <label>Current Password</label>
                    <input type="password" id="modal-current-password" placeholder="Enter current password" required>
                </div>
                
                <div class="form-group">
                    <label>New Password</label>
                    <input type="password" id="modal-new-password" placeholder="Enter new password" required>
                    
                    <div class="password-requirements" id="modal-password-requirements" style="display: block; margin-top: 10px;">
                        <h4 style="margin: 0 0 10px 0; color: #333; font-size: 0.95rem;">Password Requirements:</h4>
                        <div class="requirement" id="modal-req-length" style="color: #e74c3c;">
                            • At least 8 characters
                        </div>
                        <div class="requirement" id="modal-req-uppercase" style="color: #e74c3c;">
                            • At least 1 uppercase letter
                        </div>
                        <div class="requirement" id="modal-req-number" style="color: #e74c3c;">
                            • At least 1 number
                        </div>
                        <div class="requirement" id="modal-req-special" style="color: #e74c3c;">
                            • At least 2 special characters (!@#$%^&*)
                        </div>
                    </div>
                </div>
                
                <div class="form-group">
                    <label>Confirm New Password</label>
                    <input type="password" id="modal-confirm-password" placeholder="Confirm new password" required>
                </div>
                
                <div class="modal-footer">
                    <button type="button" class="medium-btn grey" onclick="closeChangePasswordModal()">Cancel</button>
                    <button type="submit" class="medium-btn">Change Password</button>
                </div>
            </form>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Setup live password validation
    setupModalPasswordValidation();
    
    // Focus first input
    setTimeout(() => document.getElementById('modal-current-password').focus(), 100);
}

// Close change password modal
function closeChangePasswordModal() {
    const modal = document.querySelector('.payment-modal');
    if (modal) {
        modal.remove();
    }
}

// Setup live password validation in modal
function setupModalPasswordValidation() {
    const passwordInput = document.getElementById('modal-new-password');
    if (!passwordInput) return;
    
    // Update requirements as user types
    passwordInput.addEventListener('input', function() {
        const password = this.value;
        const validation = validatePassword(password);
        
        // Update requirement colors
        document.getElementById('modal-req-length').style.color = validation.requirements.length ? '#333' : '#e74c3c';
        document.getElementById('modal-req-uppercase').style.color = validation.requirements.uppercase ? '#333' : '#e74c3c';
        document.getElementById('modal-req-number').style.color = validation.requirements.number ? '#333' : '#e74c3c';
        document.getElementById('modal-req-special').style.color = validation.requirements.specialChars ? '#333' : '#e74c3c';
    });
}

// Process password change
function changePassword(event) {
    event.preventDefault();
    
    const user = getActiveUser();
    if (!user) {
        showErrorNotification('Please log in to change your password.');
        return;
    }
    
    const currentPassword = document.getElementById('modal-current-password').value;
    const newPassword = document.getElementById('modal-new-password').value;
    const confirmPassword = document.getElementById('modal-confirm-password').value;
    
    // Validate current password
    if (currentPassword !== user.password) {
        showErrorNotification('Current password is incorrect.');
        return;
    }
    
    // Validate new password
    const passwordValidation = validatePassword(newPassword);
    
    if (!passwordValidation.valid) {
        let missing = [];
        if (!passwordValidation.requirements.length) missing.push('at least 8 characters');
        if (!passwordValidation.requirements.uppercase) missing.push('at least 1 uppercase letter');
        if (!passwordValidation.requirements.number) missing.push('at least 1 number');
        if (!passwordValidation.requirements.specialChars) missing.push('at least 2 special characters');
        
        showErrorNotification('New password does not meet requirements:\n\n• ' + missing.join('\n• '));
        return;
    }
    
    // Check passwords match
    if (newPassword !== confirmPassword) {
        showErrorNotification('New passwords do not match.');
        return;
    }
    
    // Check new password is different
    if (newPassword === currentPassword) {
        showErrorNotification('New password must be different from current password.');
        return;
    }
    
    // Update password
    user.password = newPassword;
    updateActiveUser(user);
    
    closeChangePasswordModal();
    showNotification('Password changed successfully!');
}

/* ================================================
   SECTION 5C: PROFILE PICTURE MANAGEMENT
   ================================================ */

// Upload profile picture
function uploadProfilePicture() {
    // Create file input
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            showErrorNotification('Image size must be less than 5MB');
            return;
        }
        
        // Validate file type
        if (!file.type.startsWith('image/')) {
            showErrorNotification('Please select an image file');
            return;
        }
        
        // Read file as base64
        const reader = new FileReader();
        reader.onload = function(event) {
            const base64Image = event.target.result;
            saveProfilePicture(base64Image);
        };
        reader.readAsDataURL(file);
    };
    
    input.click();
}

// Save profile picture to user data
function saveProfilePicture(base64Image) {
    const user = getActiveUser();
    if (!user) {
        showErrorNotification('Please log in to upload a profile picture');
        return;
    }
    
    // Save to user object
    user.profilePicture = base64Image;
    updateActiveUser(user);
    
    // Update display immediately
    displayProfilePicture();
    
    showNotification('Profile picture updated successfully!');
}

// Display profile picture across all pages
function displayProfilePicture() {
    const user = getActiveUser();
    if (!user) return;
    
    // Find all profile picture elements
    const profileIcons = document.querySelectorAll('.profile-icon img, .profile-picture img, .rewards-profile-header .profile-picture img');
    
    if (user.profilePicture) {
        // Display user's uploaded picture
        profileIcons.forEach(icon => {
            icon.src = user.profilePicture;
            icon.style.display = 'block';
        });
    } else {
        // Display default placeholder
        profileIcons.forEach(icon => {
            icon.src = 'profile-placeholder.png';
            icon.style.display = 'block';
        });
    }
    
    // Update username on rewards page
    const rewardsUsername = document.querySelector('.rewards-username');
    if (rewardsUsername && user) {
        rewardsUsername.textContent = `${user.firstName} ${user.lastName}`;
    }
}

// Remove profile picture
function removeProfilePicture() {
    const user = getActiveUser();
    if (!user) return;
    
    const confirm = window.confirm('Are you sure you want to remove your profile picture?');
    if (!confirm) return;
    
    // Reset to placeholder
    user.profilePicture = 'images/profile-placeholder.png';
    updateActiveUser(user);
    
    displayProfilePicture();
    
    showNotification('Profile picture removed');
}

/* ================================================
   SECTION 6: NAVIGATION BAR UPDATES
   ================================================ */

// Update navigation bar based on login status
function updateNavbar() {
    const user = getActiveUser();
    const mainNav = document.querySelector('.main-nav ul');
    
    if (!mainNav) return;
    
    if (user) {
        // User is logged in - show account options
        mainNav.innerHTML = `
            <li><a href="HomePage.html">Home</a></li>
            <li><a href="BrowsePage.html">Browse</a></li>
            <li><a href="CateringPage.html">Catering</a></li>
            <li><a href="ContactUs.html">Contact Us</a></li>
            <li><a href="AboutUsPage.html">About Us</a></li>
            <li><a href="AccountPage.html">My Account</a></li>
            <li><a href="RewardsPage.html">Rewards</a></li>
            <li><a href="#" id="logout-link">Logout</a></li>
        `;
        
        // Add logout functionality
        const logoutLink = document.getElementById('logout-link');
        if (logoutLink) {
            logoutLink.addEventListener('click', function(e) {
                e.preventDefault();
                logoutUser();
                showNotification('You have been logged out.');
                window.location.href = 'HomePage.html';
            });
        }
    } else {
        // User is logged out - show login/register
        mainNav.innerHTML = `
            <li><a href="HomePage.html">Home</a></li>
            <li><a href="BrowsePage.html">Browse</a></li>
            <li><a href="CateringPage.html">Catering</a></li>
            <li><a href="ContactUs.html">Contact</a></li>
            <li><a href="AboutUsPage.html">About Us</a></li>
            <li><a href="LoginPage.html">Login</a></li>
            <li><a href="RegisterPage.html">Register</a></li>
        `;
    }
}
/* ================================================
   SECTION 7: BROWSE PAGE FUNCTIONALITY
   ================================================ */

// Setup browse page carousel
function setupBrowseCarousel() {
    const slides = document.querySelectorAll('.bslide');
    const thumbs = document.querySelectorAll('.bthumb');
    
    // Exit if not on browse page
    if (slides.length === 0 || thumbs.length === 0) {
        return;
    }
    
    let currentSlideIndex = 0;
    let slideInterval;
    
    // Display specific slide
    function showSlide(index) {
        // Hide all slides
        slides.forEach(slide => slide.classList.remove('active'));
        thumbs.forEach(thumb => thumb.classList.remove('active'));
        
        // Handle wrapping
        if (index >= slides.length) {
            currentSlideIndex = 0;
        } else if (index < 0) {
            currentSlideIndex = slides.length - 1;
        } else {
            currentSlideIndex = index;
        }
        
        // Show current slide
        slides[currentSlideIndex].classList.add('active');
        if (thumbs[currentSlideIndex]) {
            thumbs[currentSlideIndex].classList.add('active');
        }
    }
    
    // Move to next slide
    function nextSlide() {
        showSlide(currentSlideIndex + 1);
    }
    
    // Start automatic rotation
    function startSlideshow() {
        slideInterval = setInterval(nextSlide, 5000);
    }
    
    // Reset timer
    function resetTimer() {
        clearInterval(slideInterval);
        startSlideshow();
    }
    
    // Add thumbnail click listeners
    thumbs.forEach((thumb, index) => {
        thumb.addEventListener('click', () => {
            showSlide(index);
            resetTimer();
        });
    });
    
    // Initialize
    showSlide(0);
    startSlideshow();
}

// Populate browse grid with products
function populateBrowseGrid(filter) {
    const grid = document.querySelector(".browse-grid");
    if (!grid) return;

    grid.innerHTML = "";

    let filtered;

    // Handle different filter types
    if (Array.isArray(filter)) {
        filtered = filter;
    } else if (typeof filter === "string") {
        filtered = filter === "All"
            ? products
            : products.filter(p => p.category === filter);
    } else {
        filtered = products;
    }

    // Create product cards
    filtered.forEach(product => {
        const itemDiv = document.createElement("div");
        itemDiv.classList.add("item");

        itemDiv.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-clickable">
            <h4 class="product-clickable">${product.name}</h4>
            <p class="product-description">${product.description}</p>
            <p class="product-price">$${product.price.toFixed(2)}</p>
            <button class="add-to-cart-btn">Add to Cart</button>
        `;

        // Make image and title clickable
        const clickableElements = itemDiv.querySelectorAll(".product-clickable");
        clickableElements.forEach(element => {
            element.style.cursor = "pointer";
            element.addEventListener("click", function() {
                window.location.href = `ProductPage.html?product=${encodeURIComponent(product.name)}`;
            });
        });

        // Add to cart button
        const addBtn = itemDiv.querySelector(".add-to-cart-btn");
        addBtn.addEventListener("click", function(e) {
            e.stopPropagation();
            addToCart(product);
        });

        grid.appendChild(itemDiv);
    });
}

// Setup category filter tabs
function setupCategoryTabs() {
    const tabs = document.querySelectorAll(".category-tabs .tab");
    if (!tabs || tabs.length === 0) return;
    
    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            tabs.forEach(t => t.classList.remove("active"));
            tab.classList.add("active");
            populateBrowseGrid(tab.textContent);
        });
    });
}

/* ================================================
   SECTION 8: SEARCH AND FILTER FUNCTIONALITY
   ================================================ */

// Setup search and filter controls
function setupSearchAndFilter() {
    const searchBtn = document.getElementById("search-btn");
    const filterBtn = document.getElementById("filter-btn");
    const searchContainer = document.getElementById("search-container");
    const filterContainer = document.getElementById("filter-container");

    if (!searchBtn || !filterBtn || !searchContainer || !filterContainer) return;

    // Toggle search input
    searchBtn.addEventListener("click", () => {
        if (searchContainer.innerHTML === "") {
            searchContainer.innerHTML = `
                <input type="text" id="search-input" placeholder="Search products by name">
            `;
            setupSearchInput();
        } else {
            searchContainer.innerHTML = "";
        }
    });

    // Toggle filter inputs
    filterBtn.addEventListener("click", () => {
        if (filterContainer.innerHTML === "") {
            filterContainer.innerHTML = `
                <input type="number" id="min-price" placeholder="Min Price" min="0" step="0.01">
                <input type="number" id="max-price" placeholder="Max Price" min="0" step="0.01">
                <button id="apply-filter">Apply Filter</button>
            `;
            setupFilterInputs();
        } else {
            filterContainer.innerHTML = "";
        }
    });
}

// Setup search input functionality
function setupSearchInput() {
    const searchInput = document.getElementById("search-input");
    if (!searchInput) return;

    searchInput.addEventListener("input", () => {
        const term = searchInput.value.trim().toLowerCase();
        const filtered = products.filter(p => p.name.toLowerCase().includes(term));
        populateBrowseGrid(filtered);
    });
}

// Setup price filter functionality
function setupFilterInputs() {
    const minInput = document.getElementById("min-price");
    const maxInput = document.getElementById("max-price");
    const applyBtn = document.getElementById("apply-filter");
    if (!minInput || !maxInput || !applyBtn) return;

    applyBtn.addEventListener("click", () => {
        const min = parseFloat(minInput.value) || 0;
        const max = parseFloat(maxInput.value) || Infinity;

        if (min > max) {
            showErrorNotification("Min price cannot be greater than max price.");
            return;
        }

        const filtered = products.filter(p => p.price >= min && p.price <= max);
        populateBrowseGrid(filtered);
    });
}

/* ================================================
   SECTION 9: CATERING PAGE FUNCTIONALITY
   ================================================ */

// Catering item prices and reward points
const CATERING_PRICES = {
    'Sheet Cake': { price: 45.00, rewardPoints: 90 },
    '2 Layer Cake': { price: 60.00, rewardPoints: 120 },
    '3 Layer Cake': { price: 85.00, rewardPoints: 170 },
    'Cupcakes (Order of 5)': { price: 20.00, rewardPoints: 40 },
    'Cookies (Dozen)': { price: 15.00, rewardPoints: 30 },
    'Cookie Cake': { price: 35.00, rewardPoints: 70 }
};

// Setup catering carousel
function setupCateringCarousel() {
    const slides = document.querySelectorAll('.cslide');
    const thumbs = document.querySelectorAll('.cthumb');
    
    // Exit if not on catering page
    if (slides.length === 0 || thumbs.length === 0) {
        return;
    }
    
    let currentSlideIndex = 0;
    let slideInterval;
    
    // Display specific slide
    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        thumbs.forEach(thumb => thumb.classList.remove('active'));
        
        // Handle wrapping
        if (index >= slides.length) {
            currentSlideIndex = 0;
        } else if (index < 0) {
            currentSlideIndex = slides.length - 1;
        } else {
            currentSlideIndex = index;
        }
        
        slides[currentSlideIndex].classList.add('active');
        if (thumbs[currentSlideIndex]) {
            thumbs[currentSlideIndex].classList.add('active');
        }
    }
    
    // Move to next slide
    function nextSlide() {
        showSlide(currentSlideIndex + 1);
    }
    
    // Start automatic rotation
    function startSlideshow() {
        slideInterval = setInterval(nextSlide, 5000);
    }
    
    // Reset timer
    function resetTimer() {
        clearInterval(slideInterval);
        startSlideshow();
    }
    
    // Add thumbnail click listeners
    thumbs.forEach((thumb, index) => {
        thumb.addEventListener('click', () => {
            showSlide(index);
            resetTimer();
        });
    });
    
    // Initialize
    showSlide(0);
    startSlideshow();
}

// Setup catering form submission
function setupCateringForm() {
    const addToCartBtn = document.querySelector('.catering-button-row .btn-primary');
    if (!addToCartBtn) return;
    
    addToCartBtn.addEventListener('click', function() {
        addCateringToCart();
    });
}

// Add catering order to cart
function addCateringToCart() {
    // Get form values
    const eventDate = document.getElementById('event-date').value;
    const eventType = document.getElementById('event-type').value.trim();
    const specialRequests = document.getElementById('special-requests').value.trim();
    
    // Get selected items
    const itemSelects = document.querySelectorAll('.catering-items-col select');
    const selectedItems = [];
    
    itemSelects.forEach(select => {
        const value = select.value;
        if (value && value !== 'Select Catering Item 1' && 
            value !== 'Select Catering Item 2' && 
            value !== 'Select Catering Item 3' &&
            value !== 'Select Catering Item 4' &&
            value !== 'Select Catering Item 5') {
            selectedItems.push(value);
        }
    });
    
    // Validate form
    if (!eventDate) {
        showErrorNotification('Please select an event date.');
        return;
    }
    
    if (!eventType) {
        showErrorNotification('Please enter an event type.');
        return;
    }
    
    if (selectedItems.length === 0) {
        showErrorNotification('Please select at least one catering item.');
        return;
    }
    
    // Calculate totals
    let totalPrice = 0;
    let totalRewardPoints = 0;
    
    selectedItems.forEach(item => {
        const itemData = CATERING_PRICES[item];
        if (itemData) {
            totalPrice += itemData.price;
            totalRewardPoints += itemData.rewardPoints;
        }
    });
    
    // Format date
    const dateObj = new Date(eventDate + 'T00:00:00');
    const formattedDate = dateObj.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    
    // Create catering order object
    const cateringOrder = {
        name: 'Catering Order',
        price: totalPrice,
        quantity: 1,
        category: 'Catering',
        image: 'images/Catering1.png',
        cartId: `catering-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        rewardPoints: totalRewardPoints,
        isCatering: true,
        cateringDetails: {
            eventDate: formattedDate,
            eventDateRaw: eventDate,
            eventType: eventType,
            specialRequests: specialRequests || 'None',
            items: selectedItems
        }
    };
    
    // Add to cart
    const cart = getCart();
    cart.push(cateringOrder);
    saveCart(cart);
    updateCartCount();
    
    showNotification(`Catering order added to cart! Total: $${totalPrice.toFixed(2)} (Earn ${totalRewardPoints} points)`);
    
    // Clear form
    clearCateringForm();
    
    // Offer to view cart
    setTimeout(() => {
        if (confirm('Catering order added! Would you like to view your cart?')) {
            window.location.href = 'CheckoutPage.html';
        }
    }, 500);
}

// Clear catering form
function clearCateringForm() {
    document.getElementById('event-date').value = '';
    document.getElementById('event-type').value = '';
    document.getElementById('special-requests').value = '';
    
    const itemSelects = document.querySelectorAll('.catering-items-col select');
    itemSelects.forEach(select => {
        select.selectedIndex = 0;
    });
}

/* ================================================
   SECTION 10: HOME PAGE - FEATURED PRODUCTS
   ================================================ */

// Populate featured products on home page
function populateFeaturedProducts() {
    const featuredGrid = document.querySelector('.featured-grid');
    if (!featuredGrid) return;

    // Select 4 featured products
    const featuredProducts = [
        products[0],
        products[3],
        products[2],
        products[8]
    ];

    featuredGrid.innerHTML = '';

    // Create featured product cards
    featuredProducts.forEach(product => {
        const featuredItem = document.createElement('div');
        featuredItem.classList.add('featured-item');
        featuredItem.style.cursor = 'pointer';

        featuredItem.innerHTML = `
            <div class="featured-image">
                <img src="${product.image}" alt="${product.name}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 10px;">
            </div>
            <h3>${product.name}</h3>
            <p>${product.price.toFixed(2)}</p>
        `;

        // Make card clickable
        featuredItem.addEventListener('click', function() {
            window.location.href = `ProductPage.html?product=${encodeURIComponent(product.name)}`;
        });

        // Add hover effect
        featuredItem.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px)';
        });
        
        featuredItem.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });

        featuredGrid.appendChild(featuredItem);
    });
}

/* ================================================
   SECTION 11: CONTACT PAGE FUNCTIONALITY
   ================================================ */

// Setup contact form submission
function setupContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('contact-name').value;
        const email = document.getElementById('contact-email').value;
        const subject = document.getElementById('contact-subject').value;
        const message = document.getElementById('contact-message').value;

        // Simulate sending message
        alert(`Thank you for contacting us, ${name}! We'll respond to ${email} within 24 hours.`);
        
        // Reset form
        contactForm.reset();
    });
}

// Initialize contact page map
function initializeContactMap() {
    const mapElement = document.getElementById('contact-map');
    
    if (!mapElement) return;
    
    // Coordinates for location
    const latitude = 40.2204;
    const longitude = -74.0121;
    
    // Create map
    const map = L.map('contact-map').setView([latitude, longitude], 15);
    
    // Add map tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
    }).addTo(map);
    
    // Add marker
    const marker = L.marker([latitude, longitude]).addTo(map);
    
    // Add popup
    marker.bindPopup(`
        <div style="text-align: center;">
            <strong>🍰 Sweet Treats</strong><br>
            123 Bakery Lane<br>
            Sweet City, SC 12345<br>
            <a href="https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}" target="_blank" style="color: var(--accent);">Get Directions</a>
        </div>
    `).openPopup();
}

/* ================================================
   SECTION 12: LIVE CHAT WIDGET
   ================================================ */

// Setup customer support live chat
function setupLiveChat() {
    const chatToggle = document.getElementById('chat-toggle');
    const chatBox = document.getElementById('chat-box');
    const chatClose = document.getElementById('chat-close');
    const chatSend = document.getElementById('chat-send');
    const chatInput = document.getElementById('chat-input');
    const chatMessages = document.getElementById('chat-messages');
    const chatNotification = document.getElementById('chat-notification');

    if (!chatToggle || !chatBox) return;

    let isOpen = false;

    // Toggle chat box
    chatToggle.addEventListener('click', () => {
        isOpen = !isOpen;
        chatBox.style.display = isOpen ? 'flex' : 'none';
        
        if (isOpen) {
            chatNotification.style.display = 'none';
            chatInput.focus();
        }
    });

    // Close chat box
    if (chatClose) {
        chatClose.addEventListener('click', () => {
            isOpen = false;
            chatBox.style.display = 'none';
        });
    }

    // Send message on button click
    if (chatSend) {
        chatSend.addEventListener('click', sendMessage);
    }

    // Send message on Enter key
    if (chatInput) {
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }

    // Send message function
    function sendMessage() {
        const message = chatInput.value.trim();
        if (!message) return;

        addMessage(message, 'user');
        chatInput.value = '';

        // Show typing indicator
        showTypingIndicator();

        // Simulate bot response
        setTimeout(() => {
            removeTypingIndicator();
            const botResponse = getBotResponse(message);
            addMessage(botResponse, 'bot');
        }, 1500);
    }

    // Add message to chat
    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('chat-message');
        
        if (sender === 'user') {
            messageDiv.classList.add('user-message');
        } else {
            messageDiv.classList.add('bot-message');
        }

        const avatar = sender === 'user' ? '👤' : '🍰';
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        messageDiv.innerHTML = `
            <div class="message-avatar">${avatar}</div>
            <div class="message-content">
                <p>${text}</p>
                <span class="message-time">${time}</span>
            </div>
        `;

        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Show typing indicator
    function showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.classList.add('chat-message', 'bot-message', 'typing-indicator-message');
        typingDiv.id = 'typing-indicator';

        typingDiv.innerHTML = `
            <div class="message-avatar">🍰</div>
            <div class="message-content">
                <div class="typing-indicator">
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                </div>
            </div>
        `;

        chatMessages.appendChild(typingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Remove typing indicator
    function removeTypingIndicator() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    // Generate bot response based on keywords
    function getBotResponse(userMessage) {
        const msg = userMessage.toLowerCase();

        if (msg.includes('hours') || msg.includes('open') || msg.includes('close')) {
            return "We're open Monday-Friday 7AM-7PM, and Saturday-Sunday 8AM-6PM!";
        } else if (msg.includes('order') || msg.includes('buy') || msg.includes('purchase')) {
            return "You can browse our products and place an order through our Browse page. Just add items to your cart and checkout!";
        } else if (msg.includes('delivery') || msg.includes('ship')) {
            return "We offer local delivery and shipping! Delivery options will be shown at checkout based on your location.";
        } else if (msg.includes('catering') || msg.includes('event') || msg.includes('party')) {
            return "We offer catering services! Visit our Catering page to see options and submit a request.";
        } else if (msg.includes('price') || msg.includes('cost') || msg.includes('how much')) {
            return "Our treats range from $2.50 to $6.50. You can see all prices on our Browse page!";
        } else if (msg.includes('reward') || msg.includes('points')) {
            return "Yes! Create an account to earn reward points with every purchase. Points can be redeemed for free treats!";
        } else if (msg.includes('account') || msg.includes('login') || msg.includes('register')) {
            return "You can create an account or login from the links in our navigation menu. Members get exclusive rewards!";
        } else if (msg.includes('location') || msg.includes('address') || msg.includes('where')) {
            return "We're located at 123 Bakery Lane, Sweet City, SC 12345. See our Contact page for a map!";
        } else if (msg.includes('thanks') || msg.includes('thank you')) {
            return "You're very welcome! Is there anything else I can help you with?";
        } else if (msg.includes('hi') || msg.includes('hello') || msg.includes('hey')) {
            return "Hello! How can I assist you today?";
        } else if (msg.includes('bye') || msg.includes('goodbye')) {
            return "Goodbye! Thanks for chatting with Sweet Treats. Have a great day! 🍰";
        } else {
            return "I'm here to help! You can ask me about our hours, products, catering, delivery, or anything else. Or feel free to call us at (555) 123-4567!";
        }
    }

    // Show notification after delay
    setTimeout(() => {
        if (!isOpen) {
            chatNotification.style.display = 'flex';
        }
    }, 3000);
}
/* ================================================
   SECTION 13: PRODUCT PAGE FUNCTIONALITY
   ================================================ */

// Load and display individual product details
function loadProductDetails() {
    // Exit if not on product page
    if (!document.querySelector('.product-main')) return;
    
    // Get product name from URL
    const urlParams = new URLSearchParams(window.location.search);
    const productName = urlParams.get('product');

    if (!productName) {
        showErrorNotification('No product specified!');
        window.location.href = 'BrowsePage.html';
        return;
    }

    // Find product by name
    const product = products.find(p => p.name === productName);

    if (!product) {
        showErrorNotification('Product not found!');
        window.location.href = 'BrowsePage.html';
        return;
    }

    // Populate product details
    document.getElementById('product-name').textContent = product.name;
    document.getElementById('product-name-breadcrumb').textContent = product.name;
    document.getElementById('product-category').textContent = product.category;
    document.getElementById('product-category-text').textContent = product.category;
    document.getElementById('product-price').textContent = `$${product.price.toFixed(2)}`;
    document.getElementById('product-rewards-points').textContent = product.rewardPoints;
    document.getElementById('product-description').textContent = product.description;
    document.getElementById('product-image').src = product.image;
    document.getElementById('product-image').alt = product.name;
    
    // Generate SKU
    const sku = `SKU-${product.name.substring(0, 3).toUpperCase()}-${Math.floor(Math.random() * 1000)}`;
    document.getElementById('product-sku').textContent = sku;

    // Update page title
    document.title = `${product.name} - Sweet Treats`;

    // Add to cart button
    const addToCartBtn = document.getElementById('add-to-cart-btn');
    addToCartBtn.addEventListener('click', function() {
        const quantity = parseInt(document.getElementById('quantity').value);
        
        if (quantity < 1) {
            showErrorNotification('Please select a valid quantity.');
            return;
        }
        
        for (let i = 0; i < quantity; i++) {
            addToCart(product);
        }
        
        showNotification(`Added ${quantity} ${product.name}(s) to cart!`);
    });

    // Load related products
    loadRelatedProducts(product.category, product.name);
}

// Load related products from same category
function loadRelatedProducts(category, currentProductName) {
    const relatedGrid = document.getElementById('related-products-grid');
    if (!relatedGrid) return;

    // Get products from same category, excluding current
    const relatedProducts = products
        .filter(p => p.category === category && p.name !== currentProductName)
        .slice(0, 4);

    relatedGrid.innerHTML = '';

    relatedProducts.forEach(product => {
        const productLink = document.createElement('a');
        productLink.href = `ProductPage.html?product=${encodeURIComponent(product.name)}`;
        productLink.classList.add('related-product-item');

        productLink.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h4>${product.name}</h4>
            <p>$${product.price.toFixed(2)}</p>
        `;

        relatedGrid.appendChild(productLink);
    });
}

/* ================================================
   SECTION 14: REWARDS PAGE FUNCTIONALITY
   ================================================ */

// Load and populate rewards page
function loadRewardsPage() {
    const rewardsMain = document.querySelector('.rewards-main');
    if (!rewardsMain) return;

    const user = getActiveUser();
    
    if (!user) {
        showErrorNotification('Please log in to view your rewards.');
        window.location.href = 'LoginPage.html';
        return;
    }
    
    // Display profile picture
    displayProfilePicture();

    const userPoints = user.rewards || 0;
    
    // Display user points
    const pointsDisplay = document.getElementById('user-points');
    if (pointsDisplay) {
        pointsDisplay.textContent = userPoints;
    }

    // Update redeem buttons
    updateRedeemButtons(userPoints);
    
    // Display redeemed rewards
    displayRedeemedRewards(user);
}

// Update redeem button states based on available points
function updateRedeemButtons(userPoints) {
    const redeemButtons = document.querySelectorAll('.redeem-btn');
    
    redeemButtons.forEach(button => {
        // Extract cost from onclick attribute
        const onclickAttr = button.getAttribute('onclick');
        
        let cost = 0;
        if (onclickAttr) {
            const match = onclickAttr.match(/redeemReward\([^,]+,\s*(\d+)\)/);
            if (match) {
                cost = parseInt(match[1]);
            }
        }
        
        // Disable button if insufficient points
        if (userPoints < cost) {
            button.disabled = true;
            button.style.opacity = '0.5';
            button.style.cursor = 'not-allowed';
        } else {
            button.disabled = false;
            button.style.opacity = '1';
            button.style.cursor = 'pointer';
        }
    });
}

// Display user's redeemed rewards
function displayRedeemedRewards(user) {
    let redeemedSection = document.getElementById('redeemed-rewards-section');
    
    if (!redeemedSection) {
        // Create section if doesn't exist
        const myRewardsSection = document.querySelector('.my-rewards-section');
        redeemedSection = document.createElement('section');
        redeemedSection.id = 'redeemed-rewards-section';
        redeemedSection.className = 'redeemed-rewards-display';
        myRewardsSection.parentNode.insertBefore(redeemedSection, myRewardsSection.nextSibling);
    }

    // Check if user has redeemed rewards
    if (!user.rewardHistory || user.rewardHistory.length === 0) {
        redeemedSection.style.display = 'none';
        return;
    }

    redeemedSection.style.display = 'block';
    
    // Build HTML
    redeemedSection.innerHTML = `
        <h2>My Redeemed Rewards</h2>
        <div class="redeemed-rewards-list" id="redeemed-rewards-list"></div>
    `;

    const rewardsList = document.getElementById('redeemed-rewards-list');

    // Display each reward
    user.rewardHistory.forEach((reward, index) => {
        const rewardCard = document.createElement('div');
        rewardCard.classList.add('redeemed-reward-card');

        // Check expiration
        const today = new Date();
        const expireDate = new Date(reward.expireDate);
        const isExpired = today > expireDate;

        rewardCard.innerHTML = `
            <div class="redeemed-reward-header">
                <h3>${reward.rewardName}</h3>
                ${isExpired ? '<span class="expired-badge">Expired</span>' : '<span class="active-badge">Active</span>'}
            </div>
            <div class="redeemed-reward-body">
                <div class="reward-info-row">
                    <span class="reward-label">Code:</span>
                    <span class="reward-code">${reward.rewardCode}</span>
                </div>
                <div class="reward-info-row">
                    <span class="reward-label">Redeemed:</span>
                    <span>${reward.redeemDate}</span>
                </div>
                <div class="reward-info-row">
                    <span class="reward-label">Expires:</span>
                    <span ${isExpired ? 'style="color: #e74c3c; font-weight: bold;"' : ''}>${reward.expireDate}</span>
                </div>
            </div>
            <div class="redeemed-reward-actions">
                <button class="copy-code-btn" onclick="copyRewardCode('${reward.rewardCode}')">Copy Code</button>
                ${isExpired ? `<button class="remove-reward-btn" onclick="removeRedeemedReward(${index})">Remove</button>` : ''}
            </div>
        `;

        rewardsList.appendChild(rewardCard);
    });
}

// Redeem reward for points
function redeemReward(rewardName, pointCost) {
    const user = getActiveUser();
    
    if (!user) {
        showErrorNotification('Please log in to redeem rewards.');
        return;
    }

    const userPoints = user.rewards || 0;

    if (userPoints < pointCost) {
        showErrorNotification(`You need ${pointCost - userPoints} more points to redeem this reward.`);
        return;
    }

    const confirmRedeem = confirm(`Redeem ${pointCost} points for ${rewardName}?`);
    
    if (confirmRedeem) {
        // Deduct points
        user.rewards = userPoints - pointCost;

        // Generate reward code
        const rewardCode = `SWEET-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

        // Create dates
        const redeemedOn = new Date();
        const expiresOn = new Date();
        expiresOn.setDate(redeemedOn.getDate() + 30);

        // Initialize reward history if needed
        if (!Array.isArray(user.rewardHistory)) {
            user.rewardHistory = [];
        }

        // Add reward record
        user.rewardHistory.push({
            rewardName: rewardName,
            redeemDate: redeemedOn.toISOString().split("T")[0],
            expireDate: expiresOn.toISOString().split("T")[0],
            rewardCode: rewardCode
        });

        updateActiveUser(user);

        showNotification(`Reward redeemed! Your code is: ${rewardCode}\n\nShow this code at checkout or enter it online.`);

        // Reload page
        loadRewardsPage();
    }
}

// Copy reward code to clipboard
function copyRewardCode(code) {
    navigator.clipboard.writeText(code).then(() => {
        showNotification('Code copied!');
    }).catch(() => {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = code;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
    });
}

// Remove expired reward from list
function removeRedeemedReward(index) {
    const user = getActiveUser();
    if (!user) return;

    const confirmRemove = confirm('Remove this expired reward from your list?');
    
    if (confirmRemove) {
        user.rewardHistory.splice(index, 1);
        updateActiveUser(user);
        showNotification('Reward Removed!');
        loadRewardsPage();
    }
}

/* ================================================
   SECTION 15: ORDER HISTORY PAGE
   ================================================ */

// Load user's order history
function loadOrderHistory() {
    const user = getActiveUser();
    
    if (!user) {
        showErrorMessage('Please log in to view your order history.');
        window.location.href = 'LoginPage.html';
        return;
    }

    const ordersList = document.getElementById('orders-list');
    const emptyOrders = document.getElementById('empty-orders');

    if (!user.orderHistory || user.orderHistory.length === 0) {
        // Show empty state
        ordersList.style.display = 'none';
        emptyOrders.style.display = 'block';
        return;
    }

    // Show orders
    ordersList.style.display = 'flex';
    emptyOrders.style.display = 'none';

    displayOrders(user.orderHistory);
    setupOrderFilters(user.orderHistory);
}

// Display order cards
function displayOrders(orders) {
    const ordersList = document.getElementById('orders-list');
    ordersList.innerHTML = '';

    orders.forEach(order => {
        const orderCard = document.createElement('div');
        orderCard.classList.add('order-card');

        // Determine status class
        let statusClass = 'status-completed';
        if (order.status.toLowerCase() === 'processing') statusClass = 'status-processing';
        if (order.status.toLowerCase() === 'cancelled') statusClass = 'status-cancelled';

        // Build order items HTML
        let orderItemsHTML = '';
        if (order.items && order.items.length > 0) {
            orderItemsHTML = order.items.map(item => {
                // Check if catering order
                if (item.isCatering && item.cateringDetails) {
                    const details = item.cateringDetails;
                    const itemsList = details.items.join(', ');
                    
                    return `
                        <div class="order-item" style="flex-direction: column; align-items: flex-start;">
                            <div style="display: flex; width: 100%; gap: 15px;">
                                <img src="${item.image}" alt="Catering Order" style="width: 80px; height: 80px; object-fit: cover; border-radius: 8px;">
                                <div style="flex: 1;">
                                    <h4 style="color: var(--accent); margin-bottom: 8px;">🎉 ${item.name}</h4>
                                    <div style="font-size: 0.85rem; line-height: 1.6; color: #666;">
                                        <strong>Event Date:</strong> ${details.eventDate}<br>
                                        <strong>Event Type:</strong> ${details.eventType}<br>
                                        <strong>Items:</strong> ${itemsList}
                                        ${details.specialRequests !== 'None' ? `<br><strong>Message:</strong> ${details.specialRequests}` : ''}
                                    </div>
                                </div>
                                <p class="order-item-price">$${item.price.toFixed(2)}</p>
                            </div>
                        </div>
                    `;
                } else {
                    // Regular item
                    return `
                        <div class="order-item">
                            <img src="${item.image}" alt="${item.name}">
                            <div class="order-item-info">
                                <h4>${item.name}</h4>
                                <p>Quantity: ${item.quantity || 1}</p>
                            </div>
                            <p class="order-item-price">$${item.price.toFixed(2)}</p>
                        </div>
                    `;
                }
            }).join('');
        }

        orderCard.innerHTML = `
            <div class="order-header">
                <div class="order-header-left">
                    <h3>Order #${order.id}</h3>
                    <p class="order-date">${order.date}</p>
                </div>
                <div class="order-header-right">
                    <span class="order-status ${statusClass}">${order.status}</span>
                    <p class="order-total">$${order.total.toFixed(2)}</p>
                </div>
            </div>
            
            <div class="order-items">
                ${orderItemsHTML}
            </div>
            
            <div class="order-actions">
                <button class="order-btn view-details-btn" onclick="viewOrderDetails('${order.id}')">View Details</button>
                <button class="order-btn reorder-btn" data-order-id="${order.id}">Reorder</button>
            </div>
        `;

        ordersList.appendChild(orderCard);
    });

    setupReorderButtons();
}

// Setup order filter controls
function setupOrderFilters(orders) {
    const statusFilter = document.getElementById('order-status-filter');
    const sortFilter = document.getElementById('order-sort');

    if (!statusFilter || !sortFilter) return;

    let filteredOrders = [...orders];

    const applyFilters = () => {
        // Filter by status
        const status = statusFilter.value;
        if (status !== 'all') {
            filteredOrders = orders.filter(o => o.status.toLowerCase() === status);
        } else {
            filteredOrders = [...orders];
        }

        // Sort orders
        const sortBy = sortFilter.value;
        if (sortBy === 'newest') {
            filteredOrders.sort((a, b) => new Date(b.date) - new Date(a.date));
        } else if (sortBy === 'oldest') {
            filteredOrders.sort((a, b) => new Date(a.date) - new Date(b.date));
        } else if (sortBy === 'highest') {
            filteredOrders.sort((a, b) => b.total - a.total);
        } else if (sortBy === 'lowest') {
            filteredOrders.sort((a, b) => a.total - b.total);
        }

        displayOrders(filteredOrders);
    };

    statusFilter.addEventListener('change', applyFilters);
    sortFilter.addEventListener('change', applyFilters);
}

// View order details (placeholder)
function viewOrderDetails(orderId) {
    alert(`View details for Order #${orderId} - Feature coming soon!`);
}

// Reorder entire order
function reorderOrder(orderId) {
    const user = getActiveUser();
    
    if (!user) {
        showNotification("Please log in to reorder", "error");
        return;
    }
    
    const orderIdNum = Number(orderId);
    const order = user.orderHistory.find(o => o.id === orderIdNum);
    
    if (!order || !order.items || order.items.length === 0) {
        showNotification("Order not found", "error");
        return;
    }
    
    const cart = getCart();
    const allProducts = products;
    
    let itemsAdded = 0;
    
    order.items.forEach(orderItem => {
        // Check if catering order
        if (orderItem.isCatering && orderItem.cateringDetails) {
            const confirmCatering = confirm(
                `This order includes a catering order for ${orderItem.cateringDetails.eventType}.\n\n` +
                `Would you like to add it to your cart? You'll need to update the event date on the catering page.`
            );
            
            if (confirmCatering) {
                cart.push({
                    ...orderItem,
                    cartId: `catering-${Date.now()}-${Math.floor(Math.random() * 1000)}`
                });
                itemsAdded += 1;
            }
        } else {
            // Regular item
            let productToAdd = allProducts.find(p => p.name === orderItem.name);
            
            if (!productToAdd) {
                productToAdd = orderItem;
            }
            
            const existingCartItem = cart.find(item => item.name === productToAdd.name);
            
            if (existingCartItem) {
                existingCartItem.quantity += (orderItem.quantity || 1);
            } else {
                cart.push({
                    ...productToAdd,
                    quantity: orderItem.quantity || 1,
                    cartId: `${Date.now()}-${Math.floor(Math.random() * 1000)}`
                });
            }
            
            itemsAdded += (orderItem.quantity || 1);
        }
    });
    
    if (itemsAdded === 0) {
        showNotification("Could not add items to cart", "error");
        return;
    }
    
    saveCart(cart);
    updateCartCount();
    
    if (document.getElementById('cart-items')) {
        loadCartPage();
    }
    
    const itemText = itemsAdded === 1 ? "item" : "items";
    showNotification(`${itemsAdded} ${itemText} added to cart from order #${orderId}`);
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Setup reorder button listeners
function setupReorderButtons() {
    const reorderButtons = document.querySelectorAll('.reorder-btn');
    
    // Remove existing listeners
    reorderButtons.forEach(button => {
        button.replaceWith(button.cloneNode(true));
    });
    
    // Re-query and add fresh listeners
    const freshButtons = document.querySelectorAll('.reorder-btn');
    
    freshButtons.forEach(button => {
        button.addEventListener('click', function() {
            const orderId = this.getAttribute('data-order-id');
            reorderOrder(orderId);
        });
    });
}

/* ================================================
   SECTION 16: CART PAGE
   ================================================ */

// Load and display cart page
function loadCartPage() {
    const cart = getCart();
    const cartItemsContainer = document.getElementById('cart-items');
    
    if (!cartItemsContainer) return;
    
    cartItemsContainer.innerHTML = '';
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p>Your cart is empty</p>';
        updateCartSummary();
        return;
    }
    
    // Ensure all items have cartId
    cart.forEach(item => {
        if (!item.cartId) {
            item.cartId = `${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        }
    });
    saveCart(cart);
    
    // Render cart items
    cart.forEach((item) => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'cart-item';
        
        // Check if catering order
        if (item.isCatering && item.cateringDetails) {
            const details = item.cateringDetails;
            const itemsList = details.items.join(', ');
            
            itemDiv.innerHTML = `
                <img src="${item.image}" alt="Catering Order" class="cart-item-image">
                <div class="cart-item-details">
                    <h3 class="cart-item-name" style="color: var(--accent);">🎉 Catering Order</h3>
                    <div style="font-size: 0.9rem; margin-top: 10px; line-height: 1.6;">
                        <strong>Event Date:</strong> ${details.eventDate}<br>
                        <strong>Event Type:</strong> ${details.eventType}<br>
                        <strong>Items:</strong> ${itemsList}<br>
                        <strong>Message:</strong> ${details.specialRequests}
                    </div>
                    <p class="cart-item-price" style="margin-top: 10px;">$${item.price.toFixed(2)}</p>
                </div>
                <button class="remove-btn" data-cart-id="${item.cartId}">Remove</button>
            `;
        } else {
            // Regular item
            itemDiv.innerHTML = `
                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-details">
                    <h3 class="cart-item-name">${item.name}</h3>
                    <p class="cart-item-price">$${item.price.toFixed(2)}</p>
                    <div class="cart-item-quantity">
                        <button class="qty-btn decrease-btn" data-cart-id="${item.cartId}">-</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="qty-btn increase-btn" data-cart-id="${item.cartId}">+</button>
                    </div>
                </div>
                <button class="remove-btn" data-cart-id="${item.cartId}">Remove</button>
            `;
        }
        
        cartItemsContainer.appendChild(itemDiv);
    });
    
    setupCartEventListeners();
    updateCartSummary();
}

/* ================================================
   SECTION 17: NOTIFICATION SYSTEM
   ================================================ */

// Show success notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.classList.add('notification');
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => notification.classList.add('show'), 10);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Show error notification
function showErrorNotification(message) {
    const notification = document.createElement('div');
    notification.classList.add('error-notification');
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => notification.classList.add('show'), 10);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

/* ================================================
   SECTION 18: INITIALIZATION
   ================================================ */

// Main initialization on DOM ready
document.addEventListener("DOMContentLoaded", () => {
    
    // Register page setup
    if (window.location.pathname.includes('Register')) {
        setupPasswordValidation();
    }
    
    // Register form handler
    const registerForm = document.getElementById("register-form");
    if (registerForm) {
        registerForm.addEventListener("submit", function (e) {
            e.preventDefault();
            registerUser();
        });
    }
    
    // Login form handler
    const loginForm = document.getElementById("login-form");
    if (loginForm) {
        loginForm.addEventListener("submit", function (e) {
            e.preventDefault();
            
            const username = document.getElementById("username").value.trim();
            const password = document.getElementById("password").value;
            
            if (!username || !password) {
                showErrorNotification("Please enter both username and password.");
                return;
            }
            
            const result = loginUser(username, password);
            
            if (result.success) {
                showNotification(result.message);
                window.location.href = "AccountPage.html";
            } else {
                showErrorNotification(result.message);
            }
        });
    }
    
    // Update navbar on all pages
    updateNavbar();
    
    // Account page
    populateAccountPage();
    setupAccountButtons();
    
    // Browse page
    setupCategoryTabs();
    populateBrowseGrid();
    setupSearchAndFilter();
    setupBrowseCarousel();

    // Home page
    populateFeaturedProducts();

    // Contact page
    setupContactForm();
    initializeContactMap();
    
    // Order history page
    if (document.getElementById("orders-list")) {
        loadOrderHistory();
    }

    // Live chat
    setupLiveChat();
    
    // Cart functionality
    updateCartCount();

    // Checkout page
    populateCheckoutPage();
    autopopulateCheckoutFields();
    setupFulfillmentToggle();
    setupPaymentInputFormatting();

    // Product page
    loadProductDetails();

    // Rewards page
    loadRewardsPage();

    // Catering page
    setupCateringCarousel();
    setupCateringForm();
});

/* ================================================
   END OF FILE
   ================================================ */

