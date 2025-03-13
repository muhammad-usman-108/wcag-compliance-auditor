import { launchBrowser } from "../utils/browser";
import { AccessibilityIssue } from "../types/accessibilityIssue";

export async function checkTextAlternatives(
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

      // 1: Images must have alt text
      document.querySelectorAll("img").forEach((img) => {
        if (
          !img.hasAttribute("alt") ||
          img.getAttribute("alt")?.trim() === ""
        ) {
          findings.push({
            type: "Image",
            element: "img",
            path: getElementPath(img),
            description: "Image is missing alt text",
            wcagCriteria: "1.1.1 Non-text Content",
            impact: "critical",
            suggestion: "Add an alt attribute with a meaningful description.",
          });
        }
      });

      // 2️a SVG Icons <svg>
      document.querySelectorAll("svg").forEach((svg) => {
        if (
          !svg.hasAttribute("aria-label") ||
          svg.getAttribute("aria-label")?.trim() === ""
        ) {
          findings.push({
            type: "SVG Icon",
            element: "svg",
            path: getElementPath(svg),
            description: "SVG Icon is missing aria-label text",
            wcagCriteria: "1.1.1 Non-text Content",
            impact: "critical",
            suggestion: "Use aria-label to describe the icon.",
          });
        }
      });

      // 2️b SVG Icons <svg>
      document.querySelectorAll("svg").forEach((svg) => {
        if (
          !svg.hasAttribute("role") ||
          svg.getAttribute("role")?.trim() === ""
        ) {
          findings.push({
            type: "SVG Icon",
            element: "svg",
            path: getElementPath(svg),
            description: "SVG Icon is missing role text",
            wcagCriteria: "1.1.1 Non-text Content",
            impact: "critical",
            suggestion: 'Use role="img" to describe the icon.',
          });
        }
      });

      // 3️ Image Buttons <input type="image">
      document.querySelectorAll('input[type="image"]').forEach((input) => {
        if (
          !input.hasAttribute("alt") ||
          input.getAttribute("alt")?.trim() === ""
        ) {
          findings.push({
            type: "Image Button",
            element: 'input[type="image"]',
            path: getElementPath(input),
            description: "Image Button is missing alt text",
            wcagCriteria: "1.1.1 Non-text Content",
            impact: "critical",
            suggestion: "Add an alt attribute to describe the button action.",
          });
        }
      });

      // 4️ Image Maps <area>
      document.querySelectorAll("area").forEach((area) => {
        if (
          !area.hasAttribute("alt") ||
          area.getAttribute("alt")?.trim() === ""
        ) {
          findings.push({
            type: "Image Map Area",
            element: "area",
            path: getElementPath(area),
            description: `Image Map Area '${
              area.href || "No Link"
            }' is missing alt text`,
            wcagCriteria: "1.1.1 Non-text Content",
            impact: "critical",
            suggestion: "Add an alt attribute describing the clickable area.",
          });
        }
      });

      // 5️ Embedded Objects <object>
      document.querySelectorAll("object").forEach((object) => {
        if (
          !object.hasAttribute("title") &&
          !object.hasAttribute("aria-label")
        ) {
          findings.push({
            type: "Embedded Object",
            element: "object",
            path: getElementPath(object),
            description: `Embedded Object '${
              object.getAttribute("data") || "No Data"
            }' is missing alt text`,
            wcagCriteria: "1.1.1 Non-text Content",
            impact: "critical",
            suggestion:
              "Use the title attribute or aria-label for accessibility.",
          });
        }
      });

      // 6️ Iframes <iframe>
      document.querySelectorAll("iframe").forEach((iframe) => {
        if (
          !iframe.hasAttribute("title") ||
          iframe.getAttribute("title")?.trim() === ""
        ) {
          findings.push({
            type: "Iframe",
            element: "iframe",
            path: getElementPath(iframe),
            description: `Iframe '${
              iframe.src || "No Source"
            }' is missing title text`,
            wcagCriteria: "1.1.1 Non-text Content",
            impact: "critical",
            suggestion: "Add a title attribute describing the iframe content.",
          });
        }
      });

      // 7️ Videos <video>
      document.querySelectorAll("video").forEach((video) => {
        if (!video.querySelector('track[kind="captions"]')) {
          findings.push({
            type: "Video",
            element: "video",
            path: getElementPath(video),
            description: `Video '${
              video.getAttribute("src") || "No Source"
            }' is missing track text`,
            wcagCriteria: "1.1.1 Non-text Content",
            impact: "critical",
            suggestion: 'Provide a <track> with kind="captions" for subtitles.',
          });
        }
      });

      // 8️ Audio <audio>
      document.querySelectorAll("audio").forEach((audio) => {
        if (!audio.querySelector('track[kind="descriptions"]')) {
          findings.push({
            type: "Audio",
            element: "audio",
            path: getElementPath(audio),
            description: `Audio '${
              audio.getAttribute("src") || "No Source"
            }' is missing track text`,
            wcagCriteria: "1.1.1 Non-text Content",
            impact: "critical",
            suggestion:
              'Provide a <track> with kind="descriptions" for transcripts.',
          });
        }
      });

      // 9️ Canvas <canvas>
      document.querySelectorAll("canvas").forEach((canvas) => {
        if (!canvas.hasAttribute("aria-label")) {
          findings.push({
            type: "Canvas",
            element: "canvas",
            path: getElementPath(canvas),
            description: "Canvas is missing aria-label text",
            wcagCriteria: "1.1.1 Non-text Content",
            impact: "critical",
            suggestion:
              "Use aria-label or provide fallback text inside <canvas>.",
          });
        }
      });

      // 10 Abbreviations <abbr>
      document.querySelectorAll("abbr").forEach((abbr) => {
        if (!abbr.hasAttribute("title")) {
          findings.push({
            type: "Abbreviation",
            element: "abbr",
            path: getElementPath(abbr),
            description: "Abbreviation is missing title text",
            wcagCriteria: "1.1.1 Non-text Content",
            impact: "critical",
            suggestion: "Use the title attribute to define the abbreviation.",
          });
        }
      });

      // 1️.1 Buttons Without Text <button>
      document.querySelectorAll("button").forEach((button) => {
        if (!button.textContent?.trim() && !button.hasAttribute("aria-label")) {
          findings.push({
            type: "Button",
            element: "button",
            path: getElementPath(button),
            description: "Button is missing text or an aria-label",
            wcagCriteria: "1.1.1 Non-text Content",
            impact: "critical",
            suggestion: "Ensure buttons have visible text or an aria-label.",
          });
        }
      });

      // 1️.2 Links with Icons Only <a>
      document.querySelectorAll("a").forEach((link) => {
        if (!link.textContent?.trim() && !link.hasAttribute("aria-label")) {
          findings.push({
            type: "Link with Icon",
            element: "a",
            path: getElementPath(link),
            description: `Link with Icon '${
              link.href || "No Link"
            }' is missing aria-label text`,
            wcagCriteria: "1.1.1 Non-text Content",
            impact: "critical",
            suggestion:
              "Add an aria-label to describe the purpose of the link.",
          });
        }
      });

      // 1️.3 Figures without Captions <figure>
      document.querySelectorAll("figure").forEach((figure) => {
        if (!figure.querySelector("figcaption")) {
          findings.push({
            type: "Figure",
            element: "figure",
            path: getElementPath(figure),
            description: `Figure is missing figcaption text`,
            wcagCriteria: "1.1.1 Non-text Content",
            impact: "critical",
            suggestion: "Add a <figcaption> to describe the figure content.",
          });
        }
      });

      // 1.4 Test or Exercise Content
      document
        .querySelectorAll("canvas, object, iframe, embed, video")
        .forEach((element) => {
          if (
            !element.hasAttribute("aria-label") &&
            !element.hasAttribute("title")
          ) {
            findings.push({
              type: "Test/Exercise",
              element: element.tagName.toLowerCase(),
              path: getElementPath(element),
              description: `Test/Exercise is missing aria-label or title text`,
              wcagCriteria: "1.1.1 Non-text Content",
              impact: "critical",
              suggestion:
                "Provide a text description using aria-label or title.",
            });
          }
        });

      // 1.5 Sensory Content
      document
        .querySelectorAll("video, audio, canvas, embed, object")
        .forEach((element) => {
          if (
            !element.hasAttribute("aria-describedby") &&
            !element.hasAttribute("aria-label")
          ) {
            findings.push({
              type: "Sensory Content",
              element: element.tagName.toLowerCase(),
              path: getElementPath(element),
              description:
                "Sensory Content is missing aria-describedby or aria-label text",
              wcagCriteria: "1.1.1 Non-text Content",
              impact: "critical",
              suggestion:
                "Provide captions, transcripts, or an ARIA description.",
            });
          }
        });

      // 1.6 CAPTCHA Content
      document
        .querySelectorAll("img, audio, object, embed, iframe, div, span")
        .forEach((element) => {
          if (element.closest('[aria-hidden="true"]')) return; // Skip hidden elements

          const altText = element.getAttribute("alt")?.trim() || "";
          const ariaLabel = element.getAttribute("aria-label")?.trim() || "";
          const role = element.getAttribute("role")?.trim() || "";
          const src = element.getAttribute("src")?.toLowerCase() || "";
          const classList = element.classList.value.toLowerCase();
          const id = element.id.toLowerCase();

          // Common CAPTCHA indicators
          const captchaKeywords = [
            "captcha",
            "challenge",
            "verification",
            "security check",
          ];
          const isCaptcha = captchaKeywords.some(
            (keyword) =>
              altText.toLowerCase().includes(keyword) ||
              ariaLabel.toLowerCase().includes(keyword) ||
              src.includes(keyword) ||
              classList.includes(keyword) ||
              id.includes(keyword)
          );

          // Detect embedded CAPTCHA services (Google reCAPTCHA, hCaptcha, Cloudflare Turnstile)
          const knownCaptchaClasses = [
            "g-recaptcha",
            "h-captcha",
            "cf-turnstile",
          ];
          const isKnownCaptcha = knownCaptchaClasses.some(
            (keyword) => classList.includes(keyword) || id.includes(keyword)
          );

          if (isKnownCaptcha || isCaptcha) {
            findings.push({
              type: "CAPTCHA",
              element: element.tagName.toLowerCase(),
              path: getElementPath(element),
              description:
                "CAPTCHA detected, ensure an accessible alternative is available.",
              wcagCriteria: "1.1.1 Non-text Content",
              impact: "critical",
              suggestion:
                "Provide alternative verification methods like audio CAPTCHA, text-based CAPTCHA, or human assistance.",
            });
          }

          // Detect iframes commonly used for CAPTCHA (Google reCAPTCHA, hCaptcha, etc.)
          if (
            element.tagName.toLowerCase() === "iframe" &&
            /recaptcha|hcaptcha|captcha|turnstile/i.test(src)
          ) {
            findings.push({
              type: "CAPTCHA",
              element: element.tagName.toLowerCase(),
              path: getElementPath(element),
              description:
                "CAPTCHA iframe detected, ensure an accessible alternative is available.",
              wcagCriteria: "1.1.1 Non-text Content",
              impact: "critical",
              suggestion:
                "Provide alternative verification methods like audio CAPTCHA, text-based CAPTCHA, or human assistance.",
            });
          }
        });

      // 1.7 Decorative, Formatting, or Invisible Elements
      document
        .querySelectorAll("img, svg, div, span, i, icon, canvas, iframe")
        .forEach((element) => {
          const ariaHidden = element.getAttribute("aria-hidden")?.trim();
          const role = element.getAttribute("role")?.trim();
          const alt = element.getAttribute("alt")?.trim() || "";
          const classList = element.classList.value.toLowerCase();

          // Ensure element is cast to HTMLElement to access offsetWidth/offsetHeight
          const htmlElement = element as HTMLElement;

          // Check if element is visually hidden (but not aria-hidden)
          const isVisuallyHidden =
            htmlElement.style.display === "none" ||
            htmlElement.style.visibility === "hidden" ||
            htmlElement.offsetWidth === 0 ||
            htmlElement.offsetHeight === 0;

          // Decorative elements should have aria-hidden="true", role="presentation", or alt=""
          const isDecorative =
            ariaHidden === "true" ||
            role === "presentation" ||
            (element.tagName.toLowerCase() === "img" && alt === "");

          // Flag non-decorative elements that should be marked correctly
          if (!isDecorative && isVisuallyHidden) {
            findings.push({
              type: "Decorative Content",
              element: element.tagName.toLowerCase(),
              path: getElementPath(element),
              description:
                "Visually hidden content is missing proper accessibility attributes.",
              wcagCriteria: "1.1.1 Non-text Content",
              impact: "moderate",
              suggestion:
                'Use aria-hidden="true", role="presentation", or alt="" for purely decorative elements.',
            });
          }

          // Detect empty iframes (commonly used for decorative/formatting purposes)
          if (
            element.tagName.toLowerCase() === "iframe" &&
            !element.hasAttribute("title")
          ) {
            findings.push({
              type: "Decorative Content",
              element: "iframe",
              path: getElementPath(element),
              description:
                "Iframe is missing a title attribute, which may cause accessibility issues.",
              wcagCriteria: "4.1.2 Name, Role, Value",
              impact: "moderate",
              suggestion:
                'Provide a descriptive title for meaningful iframes, or use aria-hidden="true" for decorative ones.',
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
