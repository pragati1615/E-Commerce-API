const express = require('express');
const app = express();  // Initialize the express app
const bcrypt = require('bcryptjs');  // For password hashing
const jwt = require('jsonwebtoken'); // For generating JWT
const moment = require('moment'); // For handling dates

app.use(express.json()); // Middleware to parse JSON

// Temporary in-memory storage (In production, you'd use a database)
let users = [];
let products = [];

// User ID counter for new users
let userId = 1;

// Example user structure (roles: admin, staff, vendor, user)
users.push({
  id: userId++, 
  name: 'Admin User', 
  role: 'admin', 
  username: 'admin', 
  password: '$2a$10$KIX02ON0Jh1zOw5e0g7v4eYLRHkZANauNNLM3MQTjFE0b8MZldXBy'  // Pre-hashed password for 'admin'
});

// POST route for user signup (creating new user with password hashing)
app.post('/signup', async (req, res) => {
  const { name, username, password, role } = req.body;

  // Check if the username already exists
  const existingUser = users.find(u => u.username === username);
  if (existingUser) {
    return res.status(400).json({ error: 'Username already taken' });
  }

  // Hash the password before storing it
  const hashedPassword = await bcrypt.hash(password, 10); // The "10" is the salt rounds for bcrypt

  // Create the new user
  const user = {
    id: userId++,
    name,
    username,
    password: hashedPassword, // Store the hashed password, not the plain text one
    role: role || 'user', // Default to 'user' role if none provided
  };

  // Save the user to the in-memory array
  users.push(user);

  // Send success response
  res.status(201).json({ message: 'User created successfully' });
});

// POST route for user signin (authenticating the user)
app.post('/signin', (req, res) => {
  const { username, password } = req.body;

  // Find the user by username
  const user = users.find(u => u.username === username);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  // Compare the entered password with the stored hashed password
  bcrypt.compare(password, user.password, (err, result) => {
    if (err || !result) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token on successful login
    const token = jwt.sign({ id: user.id, role: user.role }, 'secretKey', { expiresIn: '1h' });

    res.json({ message: 'Login successful', token });
  });
});

// POST route for creating a product (Admin Role)
app.post('/products', (req, res) => {
  const { name, description, category, start_date, free_delivery, delivery_amount, imageUrl, old_price, new_price, vendor_id } = req.body;
  const startDate = moment(start_date);
  const expiryDate = startDate.add(7, 'days'); // Product expires 7 days from the start date
  
  const product = {
    id: products.length + 1,
    name,
    description,
    category,
    start_date: startDate.format(),
    expiry_date: expiryDate.format(),
    free_delivery,
    delivery_amount,
    imageUrl,
    old_price,
    new_price,
    unique_url: `/products/${products.length + 1}`,
    vendor_id
  };

  products.push(product);
  res.status(201).json({ message: 'Product created successfully', product });
});

// GET route for retrieving products (User Role, all products viewable)
app.get('/products', (req, res) => {
  res.json(products);
});

// GET route for retrieving product by ID (For Vendor, Staff, Admin)
app.get('/products/:id', (req, res) => {
  const productId = parseInt(req.params.id); // Get the ID from the request parameters
  console.log('Looking for product with ID:', productId); // Log the requested ID

  // Try to find the product by matching the ID
  const product = products.find(p => p.id === productId);
  
  // If the product is not found, log and return an error
  if (!product) {
    console.log('Product not found:', productId); // Log if not found
    return res.status(404).json({ error: 'Product not found' });
  }

  // Log the product if found
  console.log('Product found:', product);
  res.json(product); // Send the product as the response
});

// Admin: Get all vendors, staff, and user details
app.get('/users', (req, res) => {
  // Admin role validation can be implemented via JWT or session-based authentication
  res.json(users);
});

// POST route to assign products to vendors (Staff Role)
app.post('/products/vendor/:vendorId', (req, res) => {
  const vendorId = parseInt(req.params.vendorId);
  const { name, description, category, start_date, free_delivery, delivery_amount, imageUrl, old_price, new_price } = req.body;

  // Check if the user is staff and assigned to the vendor (For example)
  const vendorProducts = products.filter(p => p.vendor_id === vendorId);

  // Add the product to the vendor's products list
  const startDate = moment(start_date);
  const expiryDate = startDate.add(7, 'days');
  
  const product = {
    id: products.length + 1,
    name,
    description,
    category,
    start_date: startDate.format(),
    expiry_date: expiryDate.format(),
    free_delivery,
    delivery_amount,
    imageUrl,
    old_price,
    new_price,
    unique_url: `/products/${products.length + 1}`,
    vendor_id: vendorId
  };

  products.push(product);
  res.status(201).json({ message: 'Product created for the vendor', product });
});

// Vendor: Can view and add their own products
app.get('/vendor/products/:vendorId', (req, res) => {
  const vendorId = parseInt(req.params.vendorId);
  const vendorProducts = products.filter(p => p.vendor_id === vendorId);

  if (vendorProducts.length === 0) {
    return res.status(404).json({ error: 'No products found for this vendor' });
  }
  res.json(vendorProducts);
});

// User: Can view all products, vendor info, and expiry time
app.get('/user/products', (req, res) => {
  const productsWithExpiryInfo = products.map(product => {
    return {
      ...product,
      vendor_info: users.find(user => user.id === product.vendor_id),
      expiry_time: moment(product.expiry_date).fromNow()
    };
  });

  res.json(productsWithExpiryInfo);
});

// Start the server
app.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});
