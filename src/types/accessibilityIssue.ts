export interface AccessibilityIssue {
    type: string;
    element: string;
    path: string;
    description: string;
    wcagCriteria: string;
    impact: "critical" | "serious" | "moderate" | "minor";
    suggestion: string;
  }