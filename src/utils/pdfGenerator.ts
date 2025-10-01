// Client-side PDF generation utility
import { Order } from '@/contexts/OrderContext';
import { Property } from '@/contexts/PropertyContext';
import { User } from '@/contexts/AuthContext';

export const generateInvoicePDF = (
  order: Order,
  buyer: User | null,
  seller: User | null
): void => {
  const content = generateInvoiceHTML(order, buyer, seller);
  
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(content);
    printWindow.document.close();
    printWindow.focus();
    
    setTimeout(() => {
      printWindow.print();
    }, 250);
  }
};

const generateInvoiceHTML = (
  order: Order,
  buyer: User | null,
  seller: User | null
): string => {
  const now = new Date();
  const invoiceNumber = `INV-${order.id.slice(0, 8).toUpperCase()}`;
  const taxRate = 0.13; // 13% tax
  const serviceCharge = order.amount * 0.02; // 2% service charge
  const taxAmount = order.amount * taxRate;
  const totalAmount = order.amount + serviceCharge + taxAmount;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Invoice ${invoiceNumber}</title>
  <style>
    @page { margin: 20mm; }
    body {
      font-family: 'Arial', sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 3px solid #1a2332;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    .logo {
      font-size: 32px;
      font-weight: bold;
      color: #1a2332;
    }
    .invoice-info {
      text-align: right;
    }
    .invoice-number {
      font-size: 24px;
      font-weight: bold;
      color: #1a2332;
    }
    .parties {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 30px;
      margin: 30px 0;
    }
    .party {
      padding: 20px;
      background: #f8f9fa;
      border-radius: 8px;
    }
    .party h3 {
      margin-top: 0;
      color: #1a2332;
      border-bottom: 2px solid #d4a556;
      padding-bottom: 10px;
    }
    .property-details {
      margin: 30px 0;
      padding: 20px;
      border: 2px solid #1a2332;
      border-radius: 8px;
    }
    .property-details h3 {
      margin-top: 0;
      color: #1a2332;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
    }
    th, td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #ddd;
    }
    th {
      background: #1a2332;
      color: white;
      font-weight: bold;
    }
    .totals {
      margin-top: 30px;
      float: right;
      width: 300px;
    }
    .total-row {
      display: flex;
      justify-content: space-between;
      padding: 10px;
      border-bottom: 1px solid #ddd;
    }
    .total-row.grand {
      background: #1a2332;
      color: white;
      font-weight: bold;
      font-size: 18px;
      border: none;
      border-radius: 4px;
    }
    .qr-code {
      text-align: center;
      margin: 30px 0;
      padding: 20px;
      background: #f8f9fa;
      border-radius: 8px;
    }
    .signatures {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 40px;
      margin-top: 60px;
    }
    .signature {
      border-top: 2px solid #333;
      padding-top: 10px;
      text-align: center;
    }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 2px solid #ddd;
      text-align: center;
      font-size: 12px;
      color: #666;
    }
    .badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: bold;
      background: #d4a556;
      color: white;
    }
    @media print {
      body { padding: 0; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo">PADMAYA HOME</div>
    <div class="invoice-info">
      <div class="invoice-number">${invoiceNumber}</div>
      <div>Date: ${now.toLocaleDateString()}</div>
      <div>Time: ${now.toLocaleTimeString()}</div>
    </div>
  </div>

  <div class="parties">
    <div class="party">
      <h3>Buyer Information</h3>
      <p><strong>Name:</strong> ${buyer?.name || 'N/A'}</p>
      <p><strong>Email:</strong> ${buyer?.email || 'N/A'}</p>
      <p><strong>Phone:</strong> ${buyer?.phone || 'N/A'}</p>
      <p><strong>Address:</strong> ${buyer?.address || 'N/A'}</p>
    </div>
    <div class="party">
      <h3>Seller Information</h3>
      <p><strong>Name:</strong> ${seller?.name || 'N/A'}</p>
      <p><strong>Email:</strong> ${seller?.email || 'N/A'}</p>
      <p><strong>Phone:</strong> ${seller?.phone || 'N/A'}</p>
      <p><strong>Address:</strong> ${seller?.address || 'N/A'}</p>
    </div>
  </div>

  <div class="property-details">
    <h3>Property Details</h3>
    <p><strong>Title:</strong> ${order.property.title}</p>
    <p><strong>Location:</strong> ${order.property.location}</p>
    <p><strong>Type:</strong> <span class="badge">${order.type === 'rental' ? 'RENTAL' : 'PURCHASE'}</span></p>
    ${order.type === 'rental' ? `
      <p><strong>Duration:</strong> ${order.duration || 'N/A'}</p>
      <p><strong>Start Date:</strong> ${order.startDate ? new Date(order.startDate).toLocaleDateString() : 'N/A'}</p>
      <p><strong>End Date:</strong> ${order.endDate ? new Date(order.endDate).toLocaleDateString() : 'N/A'}</p>
    ` : ''}
  </div>

  <table>
    <thead>
      <tr>
        <th>Description</th>
        <th>Amount</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>${order.type === 'rental' ? 'Rental Amount' : 'Purchase Price'}</td>
        <td>Rs. ${order.amount.toLocaleString()}</td>
      </tr>
      <tr>
        <td>Service Charge (2%)</td>
        <td>Rs. ${serviceCharge.toLocaleString()}</td>
      </tr>
      <tr>
        <td>Tax (13%)</td>
        <td>Rs. ${taxAmount.toLocaleString()}</td>
      </tr>
    </tbody>
  </table>

  <div class="totals">
    <div class="total-row">
      <span>Subtotal:</span>
      <span>Rs. ${order.amount.toLocaleString()}</span>
    </div>
    <div class="total-row">
      <span>Service Charge:</span>
      <span>Rs. ${serviceCharge.toLocaleString()}</span>
    </div>
    <div class="total-row">
      <span>Tax:</span>
      <span>Rs. ${taxAmount.toLocaleString()}</span>
    </div>
    <div class="total-row grand">
      <span>Grand Total:</span>
      <span>Rs. ${totalAmount.toLocaleString()}</span>
    </div>
  </div>

  <div style="clear: both;"></div>

  <div class="qr-code">
    <p><strong>Scan to verify transaction</strong></p>
    <svg width="150" height="150" style="margin: 0 auto;">
      <rect width="150" height="150" fill="#000" />
      <text x="50%" y="50%" text-anchor="middle" fill="#fff" font-size="12">QR Code</text>
    </svg>
    <p style="font-size: 12px; margin-top: 10px;">Transaction ID: ${order.id}</p>
  </div>

  <div class="signatures">
    <div class="signature">
      <p><strong>${buyer?.name || 'Buyer'}</strong></p>
      <p>Buyer Signature</p>
    </div>
    <div class="signature">
      <p><strong>${seller?.name || 'Seller'}</strong></p>
      <p>Seller Signature</p>
    </div>
  </div>

  <div class="footer">
    <p><strong>PADMAYA HOME - Premium Real Estate Services</strong></p>
    <p>Email: info@padmayahome.com | Phone: +977-1-XXXXXXX</p>
    <p>Address: Kathmandu, Nepal</p>
    <p style="margin-top: 10px;">This is a computer-generated invoice and does not require a physical signature.</p>
  </div>

  <div class="no-print" style="text-align: center; margin-top: 20px;">
    <button onclick="window.print()" style="padding: 10px 30px; background: #1a2332; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 16px;">Print / Save as PDF</button>
  </div>
</body>
</html>
  `;
};

export const downloadInvoiceAsDoc = (order: Order, buyer: User | null, seller: User | null): void => {
  const content = generateInvoiceText(order, buyer, seller);
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Invoice-${order.id}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

const generateInvoiceText = (order: Order, buyer: User | null, seller: User | null): string => {
  const invoiceNumber = `INV-${order.id.slice(0, 8).toUpperCase()}`;
  const serviceCharge = order.amount * 0.02;
  const taxAmount = order.amount * 0.13;
  const totalAmount = order.amount + serviceCharge + taxAmount;

  return `
PADMAYA HOME - INVOICE
Invoice Number: ${invoiceNumber}
Date: ${new Date().toLocaleDateString()}

BUYER INFORMATION:
Name: ${buyer?.name || 'N/A'}
Email: ${buyer?.email || 'N/A'}
Phone: ${buyer?.phone || 'N/A'}
Address: ${buyer?.address || 'N/A'}

SELLER INFORMATION:
Name: ${seller?.name || 'N/A'}
Email: ${seller?.email || 'N/A'}
Phone: ${seller?.phone || 'N/A'}
Address: ${seller?.address || 'N/A'}

PROPERTY DETAILS:
Title: ${order.property.title}
Location: ${order.property.location}
Type: ${order.type === 'rental' ? 'RENTAL' : 'PURCHASE'}
${order.type === 'rental' ? `Duration: ${order.duration || 'N/A'}
Start Date: ${order.startDate ? new Date(order.startDate).toLocaleDateString() : 'N/A'}
End Date: ${order.endDate ? new Date(order.endDate).toLocaleDateString() : 'N/A'}` : ''}

FINANCIAL BREAKDOWN:
${order.type === 'rental' ? 'Rental Amount' : 'Purchase Price'}: Rs. ${order.amount.toLocaleString()}
Service Charge (2%): Rs. ${serviceCharge.toLocaleString()}
Tax (13%): Rs. ${taxAmount.toLocaleString()}
GRAND TOTAL: Rs. ${totalAmount.toLocaleString()}

Transaction ID: ${order.id}

---
This is a computer-generated invoice.
PADMAYA HOME - Premium Real Estate Services
  `;
};