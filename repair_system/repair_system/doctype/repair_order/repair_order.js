// Copyright (c) 2025, Mostafa Waleed and contributors
// For license information, please see license.txt

frappe.ui.form.on('Repair Order', {
    
    // ======================================
    // When form loads or refreshes
    // ======================================
    refresh: function(frm) {
        
        // If order is not Delivered and not Cancelled, show delivery button
        if (!frm.is_new() && frm.doc.status !== 'Delivered' && frm.doc.status !== 'Cancelled') {
            frm.add_custom_button('Deliver Device', function() {
                
                // Make sure Final Cost is set
                if (!frm.doc.final_cost || frm.doc.final_cost <= 0) {
                    frappe.msgprint('Please set the Final Cost first!');
                    return;
                }
                
                // Change status and set delivery date
                frm.set_value('status', 'Delivered');
                frm.set_value('actual_delivery_date', frappe.datetime.get_today());
                frm.save();
                
            }, 'Actions');
        }
    },

    // ======================================
    // When creating a new order
    // ======================================
    setup: function(frm) {
        // Set received date to today
        if (frm.is_new()) {
            frm.set_value('received_date', frappe.datetime.get_today());
        }
    },

    // ======================================
    // When Customer is selected
    // ======================================
    customer: function(frm) {
        if (frm.doc.customer) {
            // Fetch phone number
            frappe.db.get_value('Repair Customer', frm.doc.customer, 'phone', function(r) {
                if (r) {
                    frm.set_value('customer_phone', r.phone);
                }
            });
            
            // Clear device field
            frm.set_value('device', '');
            
            // Filter devices to show only this customer's devices
            frm.set_query('device', function() {
                return {
                    filters: {
                        customer: frm.doc.customer
                    }
                };
            });
        }
    },

    // ======================================
    // When Device is selected
    // ======================================
    device: function(frm) {
        if (frm.doc.device) {
            frappe.db.get_value('Repair Device', frm.doc.device, ['device_type', 'brand'], function(r) {
                if (r) {
                    frm.set_value('device_type', r.device_type);
                    frm.set_value('brand', r.brand);
                }
            });
        }
    },

    // ======================================
    // When Final Cost or Paid Amount changes
    // ======================================
    final_cost: function(frm) {
        calculate_balance(frm);
    },
    
    paid_amount: function(frm) {
        calculate_balance(frm);
    }

});

// ======================================
// Function to calculate balance
// ======================================
function calculate_balance(frm) {
    let final_cost = frm.doc.final_cost || 0;
    let paid_amount = frm.doc.paid_amount || 0;
    let balance = final_cost - paid_amount;
    
    // Set balance value
    frm.set_value('balance', balance);
    
    // If there's remaining balance, show warning
    if (balance > 0) {
        frm.dashboard.set_headline('⚠️ Remaining Balance: ' + balance + ' EGP');
    } else {
        frm.dashboard.clear_headline();
    }
}


