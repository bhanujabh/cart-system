# 🛒 E-Commerce Microservices System

A backend-heavy microservices-based e-commerce system built with **Node.js, Express, PostgreSQL, RabbitMQ, and Docker**.  
The project demonstrates **scalable service-oriented architecture**, inter-service communication, and event-driven design.

---

## 🚀 Features
- **Authentication Service** – User registration and login with JWT.  
- **Product Service** – Manages product catalog (name, price, description).  
- **Inventory Service** – Tracks product stock and syncs with product events.  
- **Cart Service** – Handles shopping cart operations.  
- **Order Service** – Processes customer orders.  
- **Shipping Service** – Manages shipment and tracking updates.  
- **Notification Service** – Sends email alerts via RabbitMQ (order placed, stock updates, etc.).  
- **Inter-Service Communication** – Achieved via **RabbitMQ message queues**.  
- **Containerization** – All services run in isolated **Docker containers**.  

---

## 🏗️ Tech Stack
- **Backend:** Node.js, Express  
- **Database:** PostgreSQL (Sequelize ORM)  
- **Messaging Queue:** RabbitMQ  
- **Containerization:** Docker & Docker Compose  
- **Email Service:** Nodemailer  
- **Frontend (Basic Demo):** React (for testing APIs)  

---

## 📦 Architecture
```mermaid
graph TD
    A[Auth Service] -->|JWT| B[Cart Service]
    B --> C[Order Service]
    C --> D[Shipping Service]
    A -->|Events| E[Notification Service]
    C -->|Events| E
    F[Product Service] --> G[Inventory Service]
    G -->|Events| E
    F -->|Events| G
````

---

## ⚡ Setup & Run

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/ecommerce-microservices.git
   cd ecommerce-microservices
   ```

2. Create a `.env` file for each service (example):

   ```env
   PORT=3001
   DATABASE_URL=postgres://user:password@localhost:5432/authdb
   RABBITMQ_URL=amqp://localhost
   EMAIL_USER=your-email@example.com
   EMAIL_PASS=your-email-password
   ```

3. Start all services with Docker Compose:

   ```bash
   docker-compose up --build
   ```

4. Access services:

   * **Auth Service:** `http://localhost:3001/api/auth`
   * **Product Service:** `http://localhost:3007/api/product`
   * **Inventory Service:** `http://localhost:3003/api/inventory`
   * **Cart Service:** `http://localhost:3002/api/cart`
   * **Order Service:** `http://localhost:3005/api/order`
   * **Shipping Service:** `http://localhost:3006/api/shipping`
   * **Notification Service:** `http://localhost:3004/api/notify`

---

## 📧 Example Event Flow

* User places an order → `order-service` emits `order-placed` event →
  `notification-service` sends confirmation email →
  `inventory-service` decreases stock.

---

## 🔮 Future Improvements

* Add **API Gateway** for unified routing.
* Implement **service discovery** (e.g., with Consul).
* Enhance **monitoring/logging** with Prometheus & Grafana.
* Add **payment service integration**.



---

👉 This README emphasizes **microservices, RabbitMQ, and backend-heavy focus**, not just “e-commerce clone.”  

Would you like me to also include **sample products seeding instructions** inside the README so anyone cloning your repo can get dummy data quickly?
```
