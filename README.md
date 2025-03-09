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

## License

MIT
