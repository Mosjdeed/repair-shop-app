# Location: repair_order/repair_order.py

import frappe
from frappe.model.document import Document

class RepairOrder(Document):
    
    # ─────────────────────────────────────
    # 1️⃣ Before Save (Validation)
    # ─────────────────────────────────────
    def validate(self):
        self.validate_dates()
        self.validate_costs()
    
    def validate_dates(self):
        """Ensure delivery date is not before received date"""
        if self.expected_delivery and self.received_date:
            if self.expected_delivery < self.received_date:
                frappe.throw("Expected delivery date must be after received date!")
    
    def validate_costs(self):
        """Ensure paid amount does not exceed final cost"""
        if self.paid_amount and self.final_cost:
            if self.paid_amount > self.final_cost:
                frappe.throw("Paid amount cannot be greater than final cost!")
    
    # ─────────────────────────────────────
    # 2️⃣ Before Save to Database
    # ─────────────────────────────────────
    def before_save(self):
        self.calculate_balance()
    
    def calculate_balance(self):
        """Calculate remaining balance automatically"""
        self.balance = (self.final_cost or 0) - (self.paid_amount or 0)
    
    # ─────────────────────────────────────
    # 3️⃣ After Save
    # ─────────────────────────────────────
    def on_update(self):
        self.update_device_status()
    
    def update_device_status(self):
        """Update device status when order status changes"""
        if self.status == "Delivered" and self.device:
            frappe.db.set_value("Repair Device", self.device, "status", "Delivered")
            


