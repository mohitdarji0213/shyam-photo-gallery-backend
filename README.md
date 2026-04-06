# 🛍️ Shyam Photo Gallery - Full Stack E-Commerce Website
**Owner: Monika Sharma | Jaipur, Rajasthan**

## 🚀 Quick Start

### Backend
```bash
cd backend
npm install
cp .env.example .env
# .env mein fill karein:
# - MONGO_URI (MongoDB Atlas ya local)
# - CLOUDINARY_CLOUD_NAME, API_KEY, API_SECRET
# - EMAIL_USER, EMAIL_PASS (Gmail)
# - ADMIN_EMAIL (aapka email)
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Admin Account
MongoDB mein ek user create karein aur uski role `admin` karein:
```js
db.users.updateOne({email: "aapka@email.com"}, {$set: {role: "admin"}})
```

## 📱 Pages

### Public
| Route | Page |
|-------|------|
| `/` | Home - Events banner, new products, all products |
| `/product/:slug` | Product detail, related products, payment |
| `/category/:slug` | Category products |
| `/search?q=` | Search results |
| `/contact` | Contact - Order inquiry & Issue report |
| `/cart` | Shopping cart |
| `/checkout` | Checkout with payment methods |
| `/login` | Login / Register |
| `/developer` | Developer info page |

### Admin (`/admin/*`)
| Route | Page |
|-------|------|
| `/admin` | Dashboard with all charts |
| `/admin/products` | Products list + upload |
| `/admin/categories` | Categories + create |
| `/admin/orders` | All orders + status update |
| `/admin/contacts` | Order inquiries |
| `/admin/issues` | Customer issues |
| `/admin/stats` | Full statistics & graphs |

## 🎨 Tech Stack
- **Frontend:** React 18 + Vite + Tailwind CSS + Framer Motion + GSAP + Recharts
- **Backend:** Node.js + Express + MongoDB + Mongoose
- **Images:** Cloudinary
- **Email:** Nodemailer (Gmail)
- **Auth:** JWT
- **Payment:** Google Pay, Paytm, BHIM UPI, Credit Card, COD (UI only - integrate payment gateway separately)

## 📦 Categories
Shadi Frames, Birthday Frames, Clocks, Couple Frames, Gifts, Birthday Gifts, Wedding Gifts, Note Bouquet, Flower Bouquet, Printed T-Shirts

## 💳 Payment Methods
- Google Pay
- Paytm
- BHIM UPI
- Credit / Debit Card
- Cash on Delivery
