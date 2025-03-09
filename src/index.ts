#!/usr/bin/env node

import { Command } from "commander";
import chalk from "chalk";
import { checkWCAGCompliance } from "./checker";

const program = new Command();

program
  .name("wcag-checker")
  .description("CLI utility to check websites for WCAG compliance")
  .version("1.0.0")
  .argument("<url>", "website URL to check")
  .option("-v, --verbose", "show detailed output for each issue")
  .action(async (url: string, options: { verbose: boolean }) => {
    try {
      console.log(chalk.blue(`Checking ${url} for WCAG compliance...`));
      await checkWCAGCompliance(url, options.verbose);
    } catch (error) {
      console.error(chalk.red("Error:"), error);
      process.exit(1);
    }
  });

program.parse();
