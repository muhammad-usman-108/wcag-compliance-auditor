import { AccessibilityIssue } from "../../types/accessibilityIssue";
import PDFDocument from "pdfkit";
import * as fs from "fs";

export async function generatePDFReport(
  url: string,
  violations: AccessibilityIssue[]
): Promise<void> {
  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const pdfFileName = `report-${timestamp}.pdf`;

    const doc = new PDFDocument();
    doc.pipe(fs.createWriteStream(pdfFileName));

    // Title
    doc
      .fontSize(22)
      .font("Helvetica-Bold")
      .fillColor("#4B9CD3")
      .text("Accessibility Audit Report", { align: "center" })
      .moveDown(2);

    // URL and Violations Information
    doc
      .fontSize(14)
      .font("Helvetica")
      .fillColor("#000000")
      .text(`URL: ${url}`)
      .moveDown(0.5);
    doc
      .fontSize(14)
      .font("Helvetica")
      .fillColor("#000000")
      .text(`Total Violations: ${violations.length}`)
      .moveDown(1);

    // Issues Heading
    doc
      .fontSize(16)
      .font("Helvetica-Bold")
      .fillColor("#333333")
      .text("Issues Found:", { underline: true })
      .moveDown(1);

    // List of Violations
    // List of Violations
    violations.forEach((issue, index) => {
      // Issue number and description
      doc
        .fontSize(12)
        .font("Helvetica")
        .fillColor("#333333")
        .text(`${index + 1}. ${issue.type}`)
        .moveDown(0.5);

      // Indentation for all the following bullet points
      const bulletIndent = 20; // Indentation level for bullet points
      const bulletSpacing = 0.5; // Spacing between bullet points

      // Element
      doc
        .fontSize(10)
        .font("Helvetica")
        .fillColor("#000000")
        .text(`• Element: ${issue.element}`, { indent: bulletIndent })
        .moveDown(bulletSpacing);

      // Description
      doc
        .fontSize(10)
        .font("Helvetica")
        .fillColor("#000000")
        .text(`• Description: ${issue.description}`, { indent: bulletIndent })
        .moveDown(bulletSpacing);

      // WCAG Criteria
      doc
        .fontSize(10)
        .font("Helvetica")
        .fillColor("#000000")
        .text(`• WCAG Criteria: ${issue.wcagCriteria}`, {
          indent: bulletIndent,
        })
        .moveDown(bulletSpacing);

      // Impact
      doc
        .fontSize(10)
        .font("Helvetica")
        .fillColor("#FF5733")
        .text(`• Impact: ${issue.impact}`, { indent: bulletIndent })
        .moveDown(bulletSpacing);

      // Selector
      doc
        .fontSize(10)
        .font("Helvetica")
        .fillColor("#000000")
        .text(`• Selector: ${issue.path}`, { indent: bulletIndent })
        .moveDown(bulletSpacing);

      // Suggestion
      doc
        .fontSize(10)
        .font("Helvetica")
        .fillColor("#000000")
        .text(`• Suggestion: ${issue.suggestion}`, { indent: bulletIndent })
        .moveDown(1);
    });

    // Finalize the document
    doc.end();

    // Log completion message
    console.log(`📄 PDF report saved as ${pdfFileName}`);
  } finally {
  }
}
