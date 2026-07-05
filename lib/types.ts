export type Category =
  | 'Foundation'
  | 'Memory'
  | 'Tools'
  | 'Protocols'
  | 'Retrieval'
  | 'Orchestration'
  | 'Evaluation'
  | 'Security'
  | 'Observability';

export interface TermBase {
  term: string;
  slug: string;
  category: Category;
  tier: 1 | 2 | 3;
  definition_plain: string;
  related_terms: string[];
  source_url: string;
  source_label: string;
}

export interface TermTier2 extends TermBase {
  tier: 1 | 2;
  scenario: {
    meeting_line: string;
    smart_followup: string;
  };
  quiz_question: {
    question: string;
    options: [string, string, string, string];
    answer: 'A' | 'B' | 'C' | 'D';
    explanation: string;
  };
}

export interface TermTier1 extends TermTier2 {
  tier: 1;
  company_example: {
    text: string;
    citation_label: string;
    citation_url: string;
  };
}

export type Term = TermBase | TermTier2 | TermTier1;

export function isTier2(t: Term): t is TermTier2 {
  return t.tier <= 2;
}

export function isTier1(t: Term): t is TermTier1 {
  return t.tier === 1;
}
