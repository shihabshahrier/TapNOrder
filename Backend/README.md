# **Backend Technical Specification Document**

### **Project:** WhatsApp-Integrated Food Ordering System (FastAPI Backend)

### **Version:** Prototype V1

### **Backend Framework:** FastAPI (Python)

---

# **1. Overview**

The backend will power:

* WhatsApp bot automation
* Menu delivery
* Order creation
* Order status management
* Restaurant dashboard APIs
* Customer notifications via WhatsApp Cloud API

This document outlines the data models, infrastructure, API endpoints, WhatsApp event flows, and system architecture required to ship a real, functional prototype.

---

# **2. Core Responsibilities of Backend**

1. Serve menu data
2. Receive and save orders
3. Update order statuses
4. Trigger WhatsApp message notifications
5. Connect with the restaurant dashboard
6. Process WhatsApp webhook events
7. Handle basic validations

No authentication is required in V1 (simple dashboard access token is enough).

---

# **3. Architecture Overview**

```
Customer → WhatsApp Bot → Menu Link → Web App → Backend API →  
Database → Dashboard → WhatsApp Notifications → Customer
```

### Components:

* **FastAPI backend**
* **PostgreSQL / Supabase DB**
* **WhatsApp Cloud API**
* **Next.js mini web-app (frontend)**
* **Next.js dashboard (restaurant)**

---

# **4. Database Schema**

## **4.1 Menu Tables**

### `MenuCategory`

| Field         | Type      | Description   |
| ------------- | --------- | ------------- |
| id            | UUID      | Primary key   |
| restaurant_id | UUID      | Foreign key   |
| name          | VARCHAR   | Category name |
| created_at    | TIMESTAMP |               |

### `MenuItem`

| Field        | Type      | Description |
| ------------ | --------- | ----------- |
| id           | UUID      |             |
| category_id  | UUID      |             |
| name         | VARCHAR   |             |
| description  | TEXT      |             |
| price        | DECIMAL   |             |
| image_url    | TEXT      |             |
| is_available | BOOLEAN   |             |
| created_at   | TIMESTAMP |             |

---

## **4.2 Order Tables**

### `Order`

| Field            | Type                                                               | Description |
| ---------------- | ------------------------------------------------------------------ | ----------- |
| id               | UUID                                                               |             |
| restaurant_id    | UUID                                                               |             |
| customer_name    | VARCHAR                                                            |             |
| customer_phone   | VARCHAR                                                            |             |
| delivery_address | TEXT                                                               |             |
| order_type       | ENUM(pickup, delivery)                                             |             |
| total            | DECIMAL                                                            |             |
| status           | ENUM(pending, accepted, cooking, on_the_way, delivered, cancelled) |             |
| created_at       | TIMESTAMP                                                          |             |

### `OrderItem`

| Field      | Type    |
| ---------- | ------- |
| id         | UUID    |
| order_id   | UUID    |
| item_id    | UUID    |
| name       | VARCHAR |
| quantity   | INT     |
| unit_price | DECIMAL |
| subtotal   | DECIMAL |

---

# **5. FastAPI Directory Structure**

```
backend/
│── app/
│   ├── main.py
│   ├── config.py
│   ├── database.py
│   ├── models/
│   │    ├── menu.py
│   │    ├── order.py
│   ├── routers/
│   │    ├── menu.py
│   │    ├── orders.py
│   │    ├── whatsapp.py
│   ├── services/
│   │    ├── whatsapp_service.py
│   │    ├── order_service.py
│   ├── schemas/
│   │    ├── menu.py
│   │    ├── order.py
│   ├── utils/
│   │    ├── whatsapp_formatter.py
│   └── ...
```

---

# **6. API Endpoints**

## **6.1 Menu APIs**

### **GET /menu**

Returns full menu grouped by category.

### **GET /menu/{id}**

Return single item.

### **POST /menu**

(For admin/dashboard) Add menu item.

### **PATCH /menu/{id}**

Update item details.

---

## **6.2 Order APIs**

### **POST /order**

Creates a new order.

**Request Body:**

```json
{
  "customer_name": "John",
  "customer_phone": "+44071...",
  "delivery_address": "Baker Street",
  "order_type": "delivery",
  "items": [
    { "item_id": "uuid", "quantity": 2 }
  ]
}
```

### **GET /order/{id}**

Get order details.

### **GET /orders**

List all orders for dashboard.

### **PATCH /order/{id}/status**

Update order status.

**Request Body:**

```json
{
  "status": "cooking"
}
```

This will trigger a WhatsApp notification.

---

# **7. WhatsApp Cloud API Integration**

## **7.1 Webhook Endpoint**

### **POST /webhook/whatsapp**

Handles incoming WhatsApp messages.

Flow:

1. User sends “hi”
2. Backend receives webhook
3. Backend sends menu link from server
4. User taps link and goes to web app

## **7.2 Messages Backend Will Send**

### Welcome template

```
Welcome to Kacchi King 🍽️  
Tap to view menu: https://yourapp/menu
```

### Order confirmation

```
Your order (#3921) has been received.
You'll get updates here 🚀
```

### Status updates:

* Accepted
* Cooking
* Rider on the way
* Delivered

---

# **8. Order Status Flow**

Restaurant dashboard triggers:

| Dashboard Action | WhatsApp Message Sent           |
| ---------------- | ------------------------------- |
| Accept           | “Your order has been accepted!” |
| Start cooking    | “Your food is being cooked 🍳”  |
| Rider on the way | “Rider is on the way 🚴‍♂️”     |
| Delivered        | “Order delivered ✔️ Enjoy!”     |

---

# **9. Security**

Prototype-level:

* Simple API key header for dashboard
* Limited endpoint access
* Verified WhatsApp numbers only
* Rate limiting on WhatsApp webhook
* Sanitized user inputs

---

# **10. Deployment Plan**

### Backend:

* FastAPI running on:

  * Render.com or Railway OR
  * Docker on your VPS
* Auto-deploy from GitHub

### Database:

* Supabase / Neon (PostgreSQL)

### WhatsApp Cloud API:

* Hosted by Meta (no deployment work)

---

# **11. What This Backend Enables (Prototype Capabilities)**

### Fully functional:

* Real WhatsApp automation
* Real order storage
* Real restaurant dashboard
* Real status updates
* Real menu editing
* Real customer flow
* Real order lifecycle

### Missing in prototype (comes later):

* Online payments
* Auth roles
* Delivery driver assignment
* Multi-restaurant SaaS billing
* Notifications dashboard
