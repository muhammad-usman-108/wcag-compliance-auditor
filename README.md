# wcag-compliance-auditor

A command-line tool to audit websites for WCAG 2.1 compliance, focusing on accessibility standards and best practices.

[![npm version](https://badge.fury.io/js/wcag-compliance-auditor.svg)](https://www.npmjs.com/package/wcag-compliance-auditor)
[![npm downloads](https://img.shields.io/npm/dt/wcag-compliance-auditor.svg)](https://www.npmjs.com/package/wcag-compliance-auditor)
[![Contributors](https://img.shields.io/github/contributors/muhammad-usman-108/wcag-compliance-auditor.svg)](https://github.com/muhammad-usman-108/wcag-compliance-auditor)
[![Forks](https://img.shields.io/github/forks/nabeel-shakeel/wcag-compliance-auditor.svg)](https://github.com/nabeel-shakeel/wcag-compliance-auditor/network/members)
[![Stargazers](https://img.shields.io/github/stars/nabeel-shakeel/wcag-compliance-auditor.svg)](https://github.com/nabeel-shakeel/wcag-compliance-auditor/stargazers)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- 🔍 Automated WCAG 2.1 compliance checking
- 📝 Comprehensive accessibility reports in PDF and JSON formats

## Installation

```bash
# Install globally
npm install -g wcag-compliance-auditor

# Or use with npx
npx wcag-compliance-auditor <url>
```

## Usage

```bash
wcag-compliance-auditor <url> [options]
```

### Options

- `-v, --verbose`: Show detailed output for each issue
- `-h, --help`: Display help information
- `-V, --version`: Display version information

### Examples

Basic usage:

```bash
wcag-compliance-auditor https://example.com
```

With verbose output:

```bash
wcag-compliance-auditor https://example.com --verbose
```

## WCAG Criteria Checked

Currently supports checking for:

- **Perceivable**

  - Text Alternatives (1.1.1)
  - Time-based Media (1.2)
  - Adaptable (1.3)

- **Operable**
  - Keyboard Accessible (2.1)
  - No Keyboard Traps (2.1.2)

## Output

The tool generates:

- Console output with summary of findings
- Detailed PDF report
- JSON file with structured data
- Color-coded severity levels for issues

## Reports

Reports include:

- Issue type and description
- WCAG criteria reference
- Element location (DOM path)
- Impact level
- Suggested fixes

## Requirements

- Node.js 14.x or higher
- Chromium (automatically installed with Puppeteer)

## Contributing

Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details on how to contribute to this project.

## Development

```bash
# Clone the repository
git clone https://github.com/yourusername/wcag-compliance-auditor.git

# Install dependencies
npm install

# Build the project
npm run build
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with [Puppeteer](https://pptr.dev/)
- WCAG 2.1 Guidelines
- The web accessibility community

## Support

For support, please:

1. Check the [issues](https://github.com/yourusername/wcag-compliance-auditor/issues) page
2. Open a new issue if needed

## Roadmap

- [ ] Add more WCAG criteria checks
- [ ] Implement batch URL processing
- [ ] Add CI/CD pipeline integration

## Authors

| Name           | Role             | GitHub                                                       |
| -------------- | ---------------- | ------------------------------------------------------------ |
| Muhammad Usman | Core Contributor | [@muhammad-usman-108](https://github.com/muhammad-usman-108) |
| Nabeel Shakeel | Core Contributor | [@nabeel-shakeel](https://github.com/nabeel-shakeel)         |

## Accessibility Compliance Table

Please see [COMPLIANCE_TABLE.md](COMPLIANCE_TABLE.md) for details of success criteria
