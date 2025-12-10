# 🏥 Health NEXUS - Project Setup & Running Guide

## ✅ Project Status: FULLY FUNCTIONAL

Your Health NEXUS e-commerce platform is now running smoothly with all features implemented!

---

## 🚀 How to Run the Project

### **Option 1: Start the Server (Recommended)**

Run this command in PowerShell:

```powershell
cd C:\workspace\server
Start-Process node -ArgumentList "index.js" -RedirectStandardOutput "C:\workspace\server.log" -WindowStyle Hidden
```

Then open your browser and go to:
```
http://localhost:3000/health-nexus.html
```

### **Option 2: Using npm start**

```powershell
cd C:\workspace\server
npm start
```

### **Option 3: Direct Node Execution**

```powershell
cd C:\workspace\server
node index.js
```

---

## 🧪 Test the Application

1. **Open the Frontend**
   - Visit: `http://localhost:3000/health-nexus.html`

2. **Login**
   - **Aadhaar Number:** `123412341234`
   - **OTP:** Check the server console or the modal (it shows the OTP in dev mode)

3. **Test Features**
   - **Search:** Use the search bar to find medicines, and click the search button (🔍) for generic substitutes
   - **Add to Cart:** Click +/- buttons to add medicines to cart
   - **View Cart:** Click "View Cart" button to see your cart
   - **Checkout:** Fill in name, phone (10 digits), and address
   - **Payment:** Use the demo card details (any card number works)
   - **Track Order:** View order status and tracking in the Orders section
   - **Invoice:** Print or view invoices for completed orders

---

## 📊 API Endpoints

The server provides the following REST APIs:

### **Authentication**
- `POST /api/login-request` - Request OTP for login
- `POST /api/verify-otp` - Verify OTP and get JWT token

### **Medicines**
- `GET /api/medicines` - Get all medicines
- `POST /api/search-suggest` - Search medicines

### **Orders**
- `GET /api/orders` - Get user's orders
- `POST /api/orders` - Create new order

### **Vault (Document Storage)**
- `GET /api/vault` - Get user's documents
- `POST /api/vault` - Upload new document
- `DELETE /api/vault/:id` - Delete a document

---

## 📁 Project Structure

```
C:\workspace\
├── frontend/
│   └── health-nexus.html  (Main UI with all features)
├── server/
│   ├── index.js           (Express server)
│   ├── package.json       (Dependencies)
│   └── data/
│       ├── users.json     (User accounts)
│       ├── medicines.json (100 medicines)
│       ├── orders.json    (Customer orders)
│       └── vault.json     (Document storage)
└── README.md
```

---

## ✨ Features Implemented

✅ **User Authentication**
- Aadhaar-based login with OTP verification
- JWT token management
- Session persistence

✅ **Medicine Catalog**
- 100+ generic medicines
- Search functionality
- Brand-to-generic substitution (25+ mappings)

✅ **Shopping Cart**
- Add/remove medicines
- Quantity management
- Persistent storage (localStorage)

✅ **Checkout System**
- Customer details collection (name, phone, address)
- Form validation
- Order summary with pricing

✅ **Payment Gateway** (Demo Mode)
- Card payment form
- 2-second processing simulation
- Payment ID generation
- Order creation on success

✅ **Order Management**
- Real-time order tracking
- Status calculation (Processing → Shipped → Delivered)
- Progress bar visualization
- Estimated delivery dates

✅ **Invoice System**
- Professional HTML invoices
- Itemized breakdown
- Print-friendly format
- Printable from browser

---

## 🐛 Troubleshooting

### **Server won't start?**
1. Kill existing Node processes:
   ```powershell
   Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
   ```
2. Make sure you're in the server directory
3. Check that dependencies are installed:
   ```powershell
   cd C:\workspace\server
   npm install
   ```

### **Frontend not loading?**
- Make sure the server is running on port 3000
- Check the browser console for errors (F12)
- Verify the file exists: `C:\workspace\frontend\health-nexus.html`

### **API errors?**
- Check the server console for detailed error messages
- Verify you're logged in (login session required)
- Make sure you're sending valid JSON data

### **Port 3000 already in use?**
- Change the port in the server code or set environment variable:
  ```powershell
  $env:PORT = 3001
  node index.js
  ```

---

## 📝 Notes

- All data is stored in JSON files locally in `server/data/`
- No database setup required - file-based persistence
- Payment gateway is in demo mode - all card numbers are accepted
- OTP is displayed in server console for development (DEV mode)
- Cart data persists in browser's localStorage

---

## 🎯 Next Steps (Optional Enhancements)

- Integrate real payment gateway (Razorpay, Stripe)
- Add email/SMS notifications for orders
- Implement admin dashboard for order management
- Add inventory tracking system
- Include customer reviews and ratings
- Setup database migration from JSON files

---

**Happy Testing! 🎉**

If you encounter any issues, check the server console logs for detailed error messages.
