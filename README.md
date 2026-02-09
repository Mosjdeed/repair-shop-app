# 🔧 Repair System

Device Repair Management System built on Frappe Framework

## 📋 Description

A complete management system for mobile and electronics repair shops, including:
- Customer Management
- Device Management
- Repair Orders Management
- Technician Management

## ✨ Features

- 👥 **Customer Management** - Register customer data and repair history
- 📱 **Device Management** - Track devices and their status
- 📝 **Repair Orders** - Create and track repair requests
- 👨‍🔧 **Technician Management** - Assign tasks to technicians

## 🛠️ Installation

```bash
cd ~/frappe-bench
bench get-app https://github.com/Mosjdeed/repair-shop-app.git
bench --site your-site install-app repair_system
```

## Usage
```
bench start
```
Then open your browser at: http://localhost:8000

## App Structure
repair_system/
├── repair_system/
│   └── doctype/
│       ├── repair_customer/     # Customers
│       ├── repair_device/       # Devices
│       ├── repair_order/        # Repair Orders
│       └── repair_technician/   # Technicians

## 📄 License
MIT License - See LICENSE file
