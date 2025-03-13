import { launchBrowser } from "../utils/browser";
import { AccessibilityIssue } from "../types/accessibilityIssue";

export async function checkTimeBasedMedia(
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

      // 1.2.1 Audio-only & Video-only (Prerecorded)
      document
        .querySelectorAll("audio:not([controls]), video:not([controls])")
        .forEach((media) => {
          findings.push({
            type: "Audio/Video without controls",
            element: media.tagName.toLowerCase(),
            path: getElementPath(media),
            description: "Provide alternatives for time-based media.",
            wcagCriteria: "1.2.1 Audio-only and Video-only (Prerecorded)",
            impact: "critical",
            suggestion:
              "Ensure media has accessible alternative text or transcripts.",
          });
        });

      // 1.2.2 Captions (Prerecorded)
      document.querySelectorAll("video").forEach((video) => {
        const hasCaptions = video.querySelector('track[kind="captions"]');
        if (!hasCaptions) {
          findings.push({
            type: "Missing Captions (Prerecorded)",
            element: "video",
            path: getElementPath(video),
            description: "Provide alternatives for time-based media.",
            wcagCriteria: "1.2.2 Captions (Prerecorded)",
            impact: "critical",
            suggestion: 'Add a <track kind="captions"> to provide captions.',
          });
        }
      });

      // 1.2.3 Audio Description or Media Alternative (Prerecorded)
      document.querySelectorAll("video").forEach((video) => {
        const hasAudioDesc = video.querySelector('track[kind="descriptions"]');
        if (!hasAudioDesc) {
          findings.push({
            type: "Missing Audio Descriptions",
            element: "video",
            path: getElementPath(video),
            description: "Provide alternatives for time-based media.",
            wcagCriteria:
              "1.2.3 Audio Description or Media Alternative (Prerecorded)",
            impact: "critical",
            suggestion:
              "Provide audio descriptions for visual content in videos.",
          });
        }
      });

      // 1.2.4 Captions (Live)
      document
        .querySelectorAll("video[live], audio[live]")
        .forEach((liveMedia) => {
          const hasCaptions = liveMedia.querySelector('track[kind="captions"]');
          if (!hasCaptions) {
            findings.push({
              type: "Missing Captions (Live)",
              element: "video/audio",
              path: getElementPath(liveMedia),
              description: "Provide alternatives for time-based media.",
              wcagCriteria: "1.2.4 Captions (Live)",
              impact: "critical",
              suggestion: "Provide real-time captions for live media.",
            });
          }
        });

      // 1.2.5 Audio Description (Prerecorded)
      document.querySelectorAll("video").forEach((video) => {
        const hasAudioDesc = video.querySelector('track[kind="descriptions"]');
        if (!hasAudioDesc) {
          findings.push({
            type: "Missing Audio Description (Prerecorded)",
            element: "video",
            path: getElementPath(video),
            description: "Provide alternatives for time-based media.",
            wcagCriteria: "1.2.5 Audio Description (Prerecorded)",
            impact: "critical",
            suggestion: "Provide additional track for audio descriptions.",
          });
        }
      });

      // 1.2.6 Sign Language Interpretation (Prerecorded)
      document.querySelectorAll("video").forEach((video) => {
        const hasSignLangTrack = video.querySelector('track[kind="sign"]');
        if (!hasSignLangTrack) {
          findings.push({
            type: "Missing Sign Language Interpretation",
            element: "video",
            path: getElementPath(video),
            description: "Provide alternatives for time-based media.",
            wcagCriteria: "1.2.6 Sign Language (Prerecorded)",
            impact: "critical",
            suggestion:
              "Provide sign language interpretation for audio content in video.",
          });
        }
      });

      // 1.2.7 Extended Audio Description (Prerecorded)
      document.querySelectorAll("video").forEach((video) => {
        const hasExtendedAudioDesc = video.querySelector(
          'track[kind="descriptions"][extended]'
        );
        if (!hasExtendedAudioDesc) {
          findings.push({
            type: "Missing Extended Audio Description",
            element: "video",
            path: getElementPath(video),
            description: "Provide alternatives for time-based media.",
            wcagCriteria: "1.2.7 Extended Audio Description (Prerecorded)",
            impact: "critical",
            suggestion: "Provide extended audio descriptions when needed.",
          });
        }
      });

      // 1.2.8 Media Alternative (Prerecorded)
      document.querySelectorAll("video").forEach((video) => {
        if (!video.hasAttribute("aria-describedby")) {
          findings.push({
            type: "Missing Media Alternative",
            element: "video",
            path: getElementPath(video),
            description: "Provide alternatives for time-based media.",
            wcagCriteria: "1.2.8 Media Alternative (Prerecorded)",
            impact: "critical",
            suggestion: "Provide a text alternative describing video content.",
          });
        }
      });

      // 1.2.9 Audio-only (Live)
      document.querySelectorAll("audio[live]").forEach((liveAudio) => {
        if (!liveAudio.hasAttribute("aria-live")) {
          findings.push({
            type: "Missing Alternative for Live Audio",
            element: "audio",
            path: getElementPath(liveAudio),
            description: "Provide alternatives for time-based media.",
            wcagCriteria: "1.2.9 Audio-only (Live)",
            impact: "critical",
            suggestion: "Provide alternative content for live audio streams.",
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
