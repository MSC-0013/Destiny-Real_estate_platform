import { jsPDF } from "jspdf";

const ConstructionPdf = (req, type = 'Construction') => {
  const doc = new jsPDF('p', 'pt', 'a4');
  let y = 40;
  const left = 40;
  const pageWidth = 520; // approximate width for wrapping

  // Helper to print field if exists
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
  doc.text(`${type} Request Details`, left, y);
  y += 30;

  // Personal Info
  doc.setFontSize(16);
  doc.text("Personal Information", left, y); y += 20;
  addField("Full Name", req.clientName);
  addField("Email", req.email);
  addField("Phone", req.phone);
  if (type === 'Repair') addField("City/State", req.city);
  y += 10;

  // Project / Repair Details
  doc.setFontSize(16);
  doc.text(type === 'Construction' ? "Project Details" : "Repair Details", left, y);
  y += 20;

  if (type === 'Construction') {
    addField("Type", req.projectType);
    addField("Location", req.location);
    addField("Area", req.area ? `${req.area} sq. ft.` : '');
    addField("Bedrooms", req.bedrooms);
    addField("Bathrooms", req.bathrooms);
    addField("Floors", req.floors);
  } else {
    addField("Repair Title", req.repairTitle);
    addField("Description", req.description);
    addField("Address", req.address);
    addField("Estimated Cost", req.estimatedCost || 'N/A');
    addField("Project Type", req.projectType);
    addField("Urgency", req.urgency);
  }
  y += 10;

  // Budget & Timeline (construction)
  if (type === 'Construction') {
    doc.setFontSize(16);
    doc.text("Budget & Timeline", left, y); y += 20;
    addField("Budget", req.budget);
    addField("Timeline", req.timeline);
    y += 10;
  }

  // Special Requirements (construction)
  if (type === 'Construction' && req.specialRequirements) {
    doc.setFontSize(16);
    doc.text("Special Requirements", left, y); y += 20;
    addField("Details", req.specialRequirements);
    y += 10;
  }

  // Project / Repair Description
  if (req.description) {
    doc.setFontSize(16);
    doc.text("Description", left, y); y += 20;
    addField("Details", req.description);
    y += 10;
  }

  // Save PDF
  const fileName = `${req.clientName ? req.clientName.replace(/\s/g, "_") : 'request'}_${type}Request.pdf`;
  doc.save(fileName);
};

export { ConstructionPdf };
