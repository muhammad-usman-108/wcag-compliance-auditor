import puppeteer from "puppeteer";
import chalk from "chalk";

interface AccessibilityIssue {
  type: string;
  element: string;
  path: string;
  description: string;
  wcagCriteria: string;
  impact: "critical" | "serious" | "moderate" | "minor";
}

export async function checkWCAGCompliance(
  url: string,
  verbose: boolean
): Promise<void> {
  const browser = await puppeteer.launch();
  try {
    const page = await browser.newPage();
    await page.goto(url);

    const issues = await page.evaluate(() => {
      const findings: Array<{
        type: string;
        element: string;
        path: string;
        description: string;
        wcagCriteria: string;
        impact: "critical" | "serious" | "moderate" | "minor";
      }> = [];

      // Helper function to get element path
      function getElementPath(element: Element): string {
        const path = [];
        while (element && element.nodeType === Node.ELEMENT_NODE) {
          let selector = element.nodeName.toLowerCase();
          if (element.id) {
            selector += "#" + element.id;
          }
          path.unshift(selector);
          element = element.parentNode as Element;
        }
        return path.join(" > ");
      }

      // Check 1: Images must have alt text (WCAG 1.1.1)
      document.querySelectorAll("img").forEach((img) => {
        if (!img.hasAttribute("alt")) {
          findings.push({
            type: "missing-alt",
            element: "img",
            path: getElementPath(img),
            description: "Image is missing alt text",
            wcagCriteria: "1.1.1 Non-text Content",
            impact: "critical",
          });
        }
      });

      // Check 2: Form inputs must have labels (WCAG 1.3.1)
      document.querySelectorAll("input, select, textarea").forEach((input) => {
        const hasLabel = Array.from(document.querySelectorAll("label")).some(
          (label) => label.htmlFor === input.id
        );
        const hasAriaLabel =
          input.hasAttribute("aria-label") ||
          input.hasAttribute("aria-labelledby");

        if (!hasLabel && !hasAriaLabel) {
          findings.push({
            type: "missing-label",
            element: input.tagName.toLowerCase(),
            path: getElementPath(input),
            description: "Form control is missing a label",
            wcagCriteria: "1.3.1 Info and Relationships",
            impact: "serious",
          });
        }
      });

      // Check 3: Buttons must have accessible names (WCAG 4.1.2)
      document.querySelectorAll("button").forEach((button) => {
        if (
          !button.textContent?.trim() &&
          !button.hasAttribute("aria-label") &&
          !button.hasAttribute("aria-labelledby")
        ) {
          findings.push({
            type: "empty-button",
            element: "button",
            path: getElementPath(button),
            description: "Button has no accessible name",
            wcagCriteria: "4.1.2 Name, Role, Value",
            impact: "serious",
          });
        }
      });

      // Check 4: Check color contrast (WCAG 1.4.3)
      // Note: This is a basic check and might need a more sophisticated color contrast algorithm
      document.querySelectorAll("*").forEach((element) => {
        const style = window.getComputedStyle(element);
        if (style.color === style.backgroundColor) {
          findings.push({
            type: "contrast",
            element: element.tagName.toLowerCase(),
            path: getElementPath(element),
            description: "Element might have insufficient color contrast",
            wcagCriteria: "1.4.3 Contrast (Minimum)",
            impact: "serious",
          });
        }
      });

      // Check 5: Headings must be in order (WCAG 1.3.1)
      let previousLevel = 0;
      document.querySelectorAll("h1, h2, h3, h4, h5, h6").forEach((heading) => {
        const currentLevel = parseInt(heading.tagName[1]);
        if (currentLevel - previousLevel > 1) {
          findings.push({
            type: "heading-order",
            element: heading.tagName.toLowerCase(),
            path: getElementPath(heading),
            description: "Heading levels should not be skipped",
            wcagCriteria: "1.3.1 Info and Relationships",
            impact: "moderate",
          });
        }
        previousLevel = currentLevel;
      });

      return findings;
    });

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
