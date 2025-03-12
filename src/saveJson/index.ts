import { AccessibilityIssue } from '../types/accessibilityIssue';
import chalk from "chalk";
import * as fs from 'fs';

export async function generateJsonFile(
  url: string,
  violations: AccessibilityIssue[]
): Promise<void> {
  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const jsonFileName = `report-${timestamp}.json`;
    // Save JSON report
    fs.writeFileSync(jsonFileName, JSON.stringify({ url, violations: violations }, null, 2));
    console.log(chalk.yellow(`📄 JSON report saved as ${jsonFileName}`));

  } finally {
  }
}
