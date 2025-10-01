import { jsPDF } from "jspdf";

export const generateRepairPDF = (req) => {
  const doc = new jsPDF('p', 'pt', 'a4');
  let y = 40;
  const left = 40;
  const pageWidth = 520;

  // Helper to safely add a field
  const addField = (label, value, fontSize = 12) => {
    if (value) {
      doc.setFontSize(fontSize);
      const lines = doc.splitTextToSize(`${label}: ${value}`, pageWidth);
      doc.text(lines, left, y);
      y += lines.length * 14;
    }
  };

  // Title
  doc.setFontSize(20);
  doc.text(req.title || 'Repair Request', left, y);
  y += 30;

  // Personal Information
  doc.setFontSize(16);
  doc.text("Personal Information", left, y);
  y += 20;
  addField("Full Name", req.clientName);
  addField("Email", req.email);
  addField("Phone", req.phone);
  addField("City/State", req.city);
  y += 10;

  // Repair Details
  doc.setFontSize(16);
  doc.text("Repair Details", left, y);
  y += 20;
  addField("Repair Title", req.repairTitle);
  addField("Description", req.description);
  addField("Address", req.address);
  addField("Estimated Cost", req.estimatedCost || 'N/A');
  addField("Project Type", req.projectType);
  addField("Urgency", req.urgency);
  y += 10;

  // Documents
  doc.setFontSize(16);
  doc.text("Documents", left, y);
  y += 20;
  addField("Attachment", req.documents || "No attachments");
  y += 10;

  // Status
  doc.setFontSize(16);
  doc.text("Status", left, y);
  y += 20;
  addField("Current Status", req.status ? req.status.toUpperCase() : 'Pending');
  y += 10;

  // Save PDF
  const fileName = `${req.clientName ? req.clientName.replace(/\s/g, "_") : 'repair_request'}.pdf`;
  doc.save(fileName);
};

export default generateRepairPDF;
