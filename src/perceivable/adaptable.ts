import { launchBrowser } from "../utils/browser";
import { AccessibilityIssue } from "../types/accessibilityIssue";

export async function checkAdaptable(
  url: string
): Promise<AccessibilityIssue[]> {
  const browser = await launchBrowser();
  try {
    const page = await browser.newPage();
    await page.goto(url);

    const issues = await page.evaluate(() => {
      const findings: AccessibilityIssue[] = [];

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

      // 1️. Success Criterion 1.3.1 - Info and Relationships
      document.querySelectorAll("b, i, u, font").forEach((el) => {
        findings.push({
          type: "Non-semantic formatting",
          element: el.tagName.toLowerCase(),
          path: getElementPath(el),
          description: "Non-semantic elements detected.",
          wcagCriteria: "1.3.1 Info and Relationships",
          impact: "moderate",
          suggestion:
            "Use <strong> instead of <b>, <em> instead of <i>, and CSS for styling.",
        });
      });

      // 2️. Success Criterion 1.3.2 - Meaningful Sequence
      document.querySelectorAll("[tabindex]").forEach((el) => {
        if (
          !el.hasAttribute("aria-flowto") &&
          !el.hasAttribute("aria-labelledby")
        ) {
          findings.push({
            type: "Tab order issue",
            element: el.tagName.toLowerCase(),
            path: getElementPath(el),
            description:
              "Tab order may not reflect a meaningful reading sequence.",
            wcagCriteria: "1.3.2 Meaningful Sequence",
            impact: "critical",
            suggestion:
              "Use aria-flowto or aria-labelledby to maintain logical navigation order.",
          });
        }
      });

      // 3️. Success Criterion 1.3.3 - Sensory Characteristics
      document.querySelectorAll("*").forEach((el) => {
        if (
          el.textContent?.match(
            /click the red button|above the blue text|on the right side/gi
          )
        ) {
          findings.push({
            type: "Sensory-dependent instructions",
            element: el.tagName.toLowerCase(),
            path: getElementPath(el),
            description: "Instructions rely on color, shape, or position.",
            wcagCriteria: "1.3.3 Sensory Characteristics",
            impact: "critical",
            suggestion:
              "Provide alternative text descriptions like 'Click the submit button.'",
          });
        }
      });

      // 4️. Success Criterion 1.3.4 - Orientation
      const orientationMeta = document.querySelector(
        'meta[name="viewport"]'
      ) as HTMLMetaElement;

      if (
        orientationMeta &&
        orientationMeta.content?.includes("user-scalable=no")
      ) {
        findings.push({
          type: "Restricted viewport scaling",
          element: "meta",
          path: "head > meta[name='viewport']",
          description: "Viewport scaling is restricted.",
          wcagCriteria: "1.3.4 Orientation",
          impact: "moderate",
          suggestion:
            "Allow users to rotate their device by removing 'user-scalable=no'.",
        });
      }

      // 5️. Success Criterion 1.3.5 - Identify Input Purpose
      document.querySelectorAll("input").forEach((input) => {
        if (!input.hasAttribute("autocomplete")) {
          findings.push({
            type: "Missing autocomplete attribute",
            element: input.tagName.toLowerCase(),
            path: getElementPath(input),
            description: "Input field missing autocomplete attribute.",
            wcagCriteria: "1.3.5 Identify Input Purpose",
            impact: "moderate",
            suggestion:
              "Add an 'autocomplete' attribute (e.g., autocomplete='email' for email fields).",
          });
        }
      });

      // 6️. Success Criterion 1.3.6 - Identify Purpose
      document.querySelectorAll("[role]").forEach((el) => {
        if (
          !el.hasAttribute("aria-label") &&
          !el.hasAttribute("aria-describedby")
        ) {
          findings.push({
            type: "Unlabeled UI component",
            element: el.tagName.toLowerCase(),
            path: getElementPath(el),
            description: "UI component role is unclear.",
            wcagCriteria: "1.3.6 Identify Purpose",
            impact: "critical",
            suggestion:
              "Use aria-label or aria-describedby to describe the purpose of the UI component.",
          });
        }
      });

      return findings;
    });

    return issues;
  } finally {
    await browser.close();
  }
}
