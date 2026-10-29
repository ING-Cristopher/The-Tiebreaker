export interface ProItem {
  id: string;
  point: string;
  weight: number; // 1 to 5
  rationale: string;
  userExcluded?: boolean;
}

export interface ConItem {
  id: string;
  point: string;
  weight: number; // 1 to 5
  mitigation: string;
  userExcluded?: boolean;
}

export interface SwotData {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

export interface OptionAnalysis {
  name: string;
  tagline: string;
  pros: ProItem[];
  cons: ConItem[];
  swot: SwotData;
}

export interface CriteriaScore {
  optionName: string;
  score: number; // 1 to 10
  comment: string;
}

export interface ComparisonCriterion {
  id: string;
  name: string;
  category: string;
  defaultWeight: number; // 1 to 5
  scores: CriteriaScore[];
}

export interface ComparisonTable {
  criteria: ComparisonCriterion[];
}

export interface ActionPlanStep {
  step: number;
  title: string;
  detail: string;
  deadline: string;
}

export interface TenTenTenRule {
  in10Minutes: string;
  in10Months: string;
  in10Years: string;
}

export interface TiebreakerVerdict {
  recommendedOption: string;
  confidenceScore: number;
  headline: string;
  coreRationale: string;
  decisiveTiebreakerFactor: string;
  devilsAdvocate: string;
  tenTenTenRule: TenTenTenRule;
  actionPlan: ActionPlanStep[];
}

export interface DecisionAnalysis {
  id: string;
  title: string;
  context: string;
  timeHorizon: string;
  priorityCriteria: string[];
  createdAt: string;
  status: 'pending' | 'decided' | 'archived';
  selectedWinner?: string;
  summary: string;
  options: OptionAnalysis[];
  comparisonTable: ComparisonTable;
  tiebreakerVerdict: TiebreakerVerdict;
}

export interface StressTestResult {
  impactAnalysis: string;
  resilienceLevel: 'Alto' | 'Medio' | 'Bajo';
  contingencyPlan: string[];
  verdictShift: string;
  takeaway: string;
}
