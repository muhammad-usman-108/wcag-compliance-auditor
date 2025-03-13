import { launchBrowser } from "./utils/browser";
import chalk from "chalk";
import { checkTextAlternatives } from "./perceivable/text-alternatives";
import { checkTimeBasedMedia } from "./perceivable/time-based-media";
import { checkAdaptable } from "./perceivable/adaptable";
import { generatePDFReport } from "./reportGeneration/pdfReport";
import { generateJsonFile } from "./reportGeneration/saveJson";
import { AccessibilityIssue } from "./types/accessibilityIssue";
import { checkKeyboardAccessibility } from "./operable/keyboard-accessibility";
process.env.PUPPETEER_DISABLE_HEADLESS_WARNING = "true";

async function runAccessibilityChecks(
  url: string
): Promise<AccessibilityIssue[]> {
  console.log(chalk.cyan("🔍 Checking for text alternatives..."));
  const textAlternativeIssues = await checkTextAlternatives(url);
  console.log(chalk.green("✓ Text alternatives check complete"));

  console.log(chalk.cyan("🔍 Checking time-based media..."));
  const timeBasedMediaIssues = await checkTimeBasedMedia(url);
  console.log(chalk.green("✓ Time-based media check complete"));

  console.log(chalk.cyan("🔍 Checking for adaptable..."));
  const adaptableIssues = await checkAdaptable(url);
  console.log(chalk.green("✓ Adaptable check complete"));

  console.log(chalk.cyan("🔍 Checking keyboard accessibility..."));
  const keyboardAccessibilityIssues = await checkKeyboardAccessibility(url);
  console.log(chalk.green("✓ Keyboard accessibility check complete"));

  return [
    ...textAlternativeIssues,
    ...timeBasedMediaIssues,
    ...adaptableIssues,
    ...keyboardAccessibilityIssues,
  ];
}

export async function checkWCAGCompliance(
  url: string,
  verbose: boolean
): Promise<void> {
  const browser = await launchBrowser();
  try {
    let issues: AccessibilityIssue[] = [];
    const page = await browser.newPage();
    await page.goto(url);

    issues = await runAccessibilityChecks(url);
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

    console.log(chalk.bold.cyan("\nWCAG Compliance Summary:"));
    console.log(chalk.bold.cyan("=======================\n"));
    console.log(
      chalk.yellow(`Total issues found: ${chalk.red(issues.length)}`)
    );

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
    console.log(chalk.red(`\nCritical issues: ${criticalIssues}`));
  } finally {
    await browser.close();
  }
}
