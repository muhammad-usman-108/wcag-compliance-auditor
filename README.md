# WCAG Compliance Checker

A command-line utility to check websites for WCAG (Web Content Accessibility Guidelines) compliance.

## Features

Checks for various WCAG compliance issues including:

- Images without alt text (WCAG 1.1.1)
- Form controls without labels (WCAG 1.3.1)
- Buttons without accessible names (WCAG 4.1.2)
- Color contrast issues (WCAG 1.4.3)
- Heading hierarchy issues (WCAG 1.3.1)

## Installation

```bash
npm install -g wcag-compliance-checker
```

Or run directly with npx:

```bash
npx wcag-compliance-checker <url>
```

## Usage

```bash
wcag-compliance-checker <url>
```

## Options

- `-v, --verbose`: Show detailed output for each issue.
- `-h, --help`: Show help for the command.
- `-V, --version`: Show version number.

```bash
wcag-compliance-checker https://example.com
```


# Accessibility Compliance Table (WCAG 2.1 - Success Criterion 1.1.1)

This table outlines accessibility requirements for various HTML elements under **WCAG 2.1 - Success Criterion 1.1.1 (Non-text Content)**.

| **HTML Element**       | **Description**                                        | **Alternative Text Attribute/Method**                                   | **Example**                                                   | **WCAG Criteria**                       |
|------------------------|--------------------------------------------------------|------------------------------------------------------------------------|--------------------------------------------------------------|-----------------------------------------|
| `<img>`               | Images must have a text alternative                    | `alt` attribute                                                        | `<img src="logo.png" alt="Company Logo">`                    | 1.1.1 (Controls, Input)                 |
| `<svg>`               | SVG icons must have descriptive text                   | `aria-label` or `role="img"`                                           | `<svg aria-label="Settings Icon" role="img"></svg>`          | 1.1.1 (Controls, Input)                 |
| `<input type="image">`| Image buttons must have alternative text               | `alt` attribute                                                        | `<input type="image" src="submit.png" alt="Submit Form">`    | 1.1.1 (Controls, Input)                 |
| `<area>`              | Image map areas must have descriptive text             | `alt` attribute                                                        | `<area shape="rect" coords="34,44,270,350" alt="Home">`      | 1.1.1 (Controls, Input)                 |
| `<object>`            | Embedded objects must have descriptive text            | `title` or `aria-label`                                                | `<object data="chart.swf" title="Sales Chart"></object>`     | 1.1.1 (Time-Based Media)                |
| `<iframe>`            | Iframes must have a descriptive title                   | `title` attribute                                                      | `<iframe src="video.html" title="Video Tutorial"></iframe>`  | 1.1.1 (Time-Based Media)                |
| `<video>`            | Videos must provide captions                            | `<track kind="captions">`                                              | `<video><track kind="captions" src="subtitles.vtt"></track></video>` | 1.1.1 (Time-Based Media)                |
| `<audio>`            | Audio elements must provide a transcript                | `<track kind="descriptions">`                                          | `<audio><track kind="descriptions" src="transcript.vtt"></track></audio>` | 1.1.1 (Time-Based Media)                |
| `<canvas>`           | Canvas elements must have alternative text              | `aria-label` or fallback content                                       | `<canvas aria-label="Graph showing sales trend"></canvas>`   | 1.1.1 (Sensory Content)                 |
| `<abbr>`             | Abbreviations must have a description                   | `title` attribute                                                      | `<abbr title="World Health Organization">WHO</abbr>`        | 1.1.1 (Text Alternative)                |
| `<button>`           | Buttons must have text or an accessible name            | Visible text or `aria-label`                                           | `<button aria-label="Close"></button>`                      | 1.1.1 (Controls, Input)                 |
| `<a>` (links)        | Links with only icons must have an accessible name      | `aria-label`                                                           | `<a href="#" aria-label="Go to Homepage"><svg></svg></a>`   | 1.1.1 (Controls, Input)                 |
| `<figure>`           | Figures must have captions                              | `<figcaption>`                                                         | `<figure><img src="chart.png"><figcaption>Sales Chart</figcaption></figure>` | 1.1.1 (Text Alternative)                |
| CAPTCHA elements     | CAPTCHA content must have an alternative method        | Alternative text & multiple forms (e.g., audio CAPTCHA)                | `<img src="captcha.png" alt="Enter the text shown">`        | 1.1.1 (CAPTCHA)                         |
| Decorative elements  | Purely decorative elements must be hidden from assistive technology | `aria-hidden="true"`, `role="presentation"`, or empty `alt` attribute | `<img src="decorative.png" alt="">`                         | 1.1.1 (Decoration, Formatting, Invisible) |

---


# Accessibility Compliance Table (WCAG 2.1 - Success Criterion 1.2)

This table outlines accessibility requirements for various HTML elements under **WCAG 2.1 - Success Criterion 1.2 (Time Based Media)**.

| **HTML Element**   | **Description**                                      | **Alternative Text Attribute/Method**             | **Example**                                                | **WCAG Criteria**                                           |
|--------------------|------------------------------------------------------|--------------------------------------------------|------------------------------------------------------------|-------------------------------------------------------------|
| `<audio>` (no controls) | Audio-only content without user controls.          | Provide `<track>` or transcripts.               | ```html <audio src="audio.mp3"></audio> ```                | **1.2.1 Audio-only (Prerecorded)**                          |
| `<video>` (no controls) | Video-only content without user controls.          | Provide `<track>` or alternative descriptions.  | ```html <video src="video.mp4"></video> ```                | **1.2.1 Video-only (Prerecorded)**                          |
| `<video>`          | Missing captions for video.                          | `<track kind="captions">`                        | ```html <track kind="captions" src="captions.vtt"> ```      | **1.2.2 Captions (Prerecorded)**, **1.2.4 Captions (Live)** |
| `<video>`          | Missing audio descriptions for visually impaired users. | `<track kind="descriptions">`                    | ```html <track kind="descriptions" src="descriptions.vtt"> ``` | **1.2.3 Audio Description (Prerecorded)**, **1.2.5 Audio Description (Prerecorded)** |
| `<video>`          | No sign language interpretation provided.             | `<track kind="sign">`                            | ```html <track kind="sign" src="sign_language.vtt"> ```    | **1.2.6 Sign Language (Prerecorded)**                       |
| `<video>`          | No extended audio description.                        | `<track kind="descriptions" extended>`          | ```html <track kind="descriptions" src="extended_desc.vtt"> ``` | **1.2.7 Extended Audio Description (Prerecorded)**          |
| `<video>`          | No media alternative (text-based equivalent).         | `aria-describedby`                               | ```html <video aria-describedby="video-desc"></video> ```  | **1.2.8 Media Alternative (Prerecorded)**                   |
| `<audio>` (live)   | No real-time captions provided for live audio.        | `<track kind="captions">` or `aria-live="assertive"` | ```html <audio live></audio> ```                           | **1.2.9 Audio-only (Live)**                                 |

---


## License

MIT
