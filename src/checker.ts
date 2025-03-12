import puppeteer from "puppeteer";
import chalk from "chalk";
import { checkTextAlternatives } from "./perceivable/text-alternatives";
import { checkTimeBasedMedia } from "./perceivable/time-based-media"; 
import { generatePDFReport } from "./pdfReport";
import { generateJsonFile } from "./saveJson";
import { AccessibilityIssue } from "./types/accessibilityIssue";

export async function checkWCAGCompliance(
  url: string,
  verbose: boolean
): Promise<void> {
  const browser = await puppeteer.launch();
  try {
    let issues: AccessibilityIssue[] = [];
    const page = await browser.newPage();
    await page.goto(url);
    
    issues = [...await checkTextAlternatives(url), ...await checkTimeBasedMedia(url)];

    console.log("Issues : ", issues);

    // generate PDF report
    generatePDFReport(url, issues);

    // generate JSON file
    generateJsonFile(url, issues);

    if (verbose) {
      issues.forEach((issue) => {
        const color = {
          critical: "red",
          serious: "yellow",
          moderate: "blue",
          minor: "gray",
        }[issue.impact] as keyof typeof chalk;

        console.log(
          chalk["green"](
            `${issue.type}: ${issue.description}\n` +
              `WCAG Criteria: ${issue.wcagCriteria}\n` +
              `Element: ${issue.element}\n` +
              `Path: ${issue.path}\n` +
              `Impact: ${issue.impact}\n`
          )
        );
      });
    }

    // Group issues by WCAG criteria
    const groupedIssues = issues.reduce((acc, issue) => {
      acc[issue.wcagCriteria] = acc[issue.wcagCriteria] || [];
      acc[issue.wcagCriteria].push(issue);
      return acc;
    }, {} as Record<string, AccessibilityIssue[]>);

    console.log("\nWCAG Compliance Summary:");
    console.log("=======================");
    console.log(`Total issues found: ${issues.length}`);

    Object.entries(groupedIssues).forEach(([criteria, criteriaIssues]) => {
      console.log(
        `\n${criteria}: ${criteriaIssues.length} ${
          criteriaIssues.length === 1 ? "issue" : "issues"
        }`
      );
    });

    const criticalIssues = issues.filter(
      (issue) => issue.impact === "critical"
    ).length;
    console.log(`\nCritical issues: ${criticalIssues}`);
  } finally {
    await browser.close();
  }
}
