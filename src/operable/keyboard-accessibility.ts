import { launchBrowser } from "../utils/browser";
import { AccessibilityIssue } from "../types/accessibilityIssue";

export async function checkKeyboardAccessibility(
  url: string
): Promise<AccessibilityIssue[]> {
  const issues: AccessibilityIssue[] = [];
  const browser = await launchBrowser();

  try {
    const page = await browser.newPage();
    await page.goto(url);

    // Check 1: Keyboard Accessibility (WCAG 2.1)
    const keyboardAccessibilityIssues = await page.evaluate(() => {
      const interactiveElements = document.querySelectorAll(
        'a[href], button, input, select, textarea, [role="button"], [role="link"], [tabindex]'
      );

      const issues: Array<{
        element: string;
        path: string;
        description: string;
      }> = [];

      interactiveElements.forEach((el) => {
        const element = el as HTMLElement;

        // Check if element is keyboard accessible
        const tabIndex = element.tabIndex;
        const hasClickHandler = element.onclick !== null;
        const hasKeyboardHandler =
          element.hasAttribute("onkeydown") ||
          element.hasAttribute("onkeypress") ||
          element.hasAttribute("onkeyup") ||
          element.hasAttribute("onkeyenter");

        // Check if element has proper keyboard interaction
        if (tabIndex < 0 || (hasClickHandler && !hasKeyboardHandler)) {
          issues.push({
            element: element.tagName.toLowerCase(),
            path: getElementPath(element),
            description:
              tabIndex < 0
                ? "Element is not keyboard accessible"
                : "Element has click handler but no keyboard event handler",
          });
        }
      });

      function getElementPath(element: Element): string {
        const path = [];
        while (element && element.nodeType === Node.ELEMENT_NODE) {
          let selector = element.nodeName.toLowerCase();
          if (element.id) {
            selector += "#" + element.id;
          } else if (element.className) {
            selector += "." + element.className.replace(/\s+/g, ".");
          }
          path.unshift(selector);
          element = element.parentNode as Element;
        }
        return path.join(" > ");
      }

      return issues;
    });

    // Check 2: No Keyboard Traps (WCAG 2.1.2)
    const keyboardTrapIssues = await page.evaluate(() => {
      const potentialTraps = document.querySelectorAll(
        // Common elements that might trap keyboard focus
        'dialog, [role="dialog"], .modal, [class*="modal"], [role="alertdialog"]'
      );

      const issues: Array<{
        element: string;
        path: string;
        description: string;
      }> = [];

      potentialTraps.forEach((trap) => {
        const element = trap as HTMLElement;

        // Check if the element has focusable elements
        const focusableElements = element.querySelectorAll(
          'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );

        if (focusableElements.length > 0) {
          // Check for escape mechanism
          const hasEscapeMechanism =
            element.querySelector('button[aria-label*="close"]') ||
            element.querySelector('button[aria-label*="exit"]') ||
            element.querySelector(".close") ||
            element.hasAttribute("aria-modal");

          if (!hasEscapeMechanism) {
            issues.push({
              element: element.tagName.toLowerCase(),
              path: getElementPath(element),
              description:
                "Element may trap keyboard focus without providing an escape mechanism",
            });
          }
        }
      });

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

      return issues;
    });

    // Convert findings to AccessibilityIssue format
    keyboardAccessibilityIssues.forEach((finding) => {
      issues.push({
        type: "keyboard-accessibility",
        element: finding.element,
        path: finding.path,
        description: finding.description,
        wcagCriteria: "WCAG 2.1 Keyboard",
        impact: "critical",
        suggestion:
          "Add keyboard event handlers or ensure proper tabIndex value",
      });
    });

    keyboardTrapIssues.forEach((finding) => {
      issues.push({
        type: "keyboard-trap",
        element: finding.element,
        path: finding.path,
        description: finding.description,
        wcagCriteria: "WCAG 2.1.2 No Keyboard Trap",
        impact: "critical",
        suggestion: "Add a keyboard-accessible escape mechanism",
      });
    });
  } catch (error) {
    console.error("Error during keyboard accessibility check:", error);
  } finally {
    await browser.close();
  }

  return issues;
}
