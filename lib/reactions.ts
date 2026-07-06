export type Group = 'G1' | 'G2' | 'G3' | 'G4' | 'G5';

export interface ReactionStep {
  sym: string;
  title: string;
  body: string;
  realWorld: string;
}

export interface ReactionEquationPart {
  sym: string;
  group: Group;
}

export interface Reaction {
  id: string;
  name: string;
  equation: (ReactionEquationPart | string)[];
  steps: ReactionStep[];
}

export const REACTIONS: Reaction[] = [
  {
    id: 'rag',
    name: '\u2460 Production RAG chatbot',
    equation: [
      { sym: 'Em', group: 'G2' }, '\u2192',
      { sym: 'Vx', group: 'G2' }, '\u2192',
      { sym: 'Rg', group: 'G3' }, '\u2192',
      { sym: 'Pr', group: 'G1' }, '\u2192',
      { sym: 'Lg', group: 'G5' }, '+',
      { sym: 'Gr', group: 'G4' },
    ],
    steps: [
      {
        sym: 'Em',
        title: 'Documents become vectors',
        body: 'Every page and paragraph in your knowledge base gets converted into a list of numbers \u2014 an embedding \u2014 encoding its meaning. Similar topics cluster close together in this mathematical space, even if they use different words.',
        realWorld: 'A legal firm feeds 10,000 contracts into an embedding model. Each becomes a 1,536-number vector. \u201CForce majeure clause\u201D and \u201CAct of God provision\u201D end up as neighbors even though the words are different.',
      },
      {
        sym: 'Vx',
        title: 'Vectors stored for instant search',
        body: 'Those embeddings live in a vector database built specifically for \u201Cfind me the most similar things to this query\u201D in milliseconds \u2014 not the row-by-row matching of traditional SQL.',
        realWorld: 'Pinecone stores the 10k contract vectors. When a lawyer asks \u201Cshow me dispute resolution clauses,\u201D the DB returns the 5 most semantically relevant chunks in under 50ms.',
      },
      {
        sym: 'Rg',
        title: 'Retrieval augments the prompt',
        body: 'When a user asks a question, RAG embeds that question, searches the vector DB, and pulls the most relevant chunks \u2014 injecting them into the context window before the LLM ever sees the question.',
        realWorld: '\u201CWhat\u2019s our liability cap in the Acme contract?\u201D \u2192 RAG retrieves 3 relevant clauses from 10k contracts and places them in the prompt alongside the question.',
      },
      {
        sym: 'Pr',
        title: 'Prompt carries the retrieved context',
        body: 'The prompt now does double duty: the user\u2019s question AND the retrieved evidence. The LLM is told \u201Chere\u2019s the source material, answer based on this\u201D \u2014 grounding the response in real data, not hallucination.',
        realWorld: 'Prompt reads: \u201C[Clause 14.3: Liability capped at 2x annual contract value...] Based on the above, what is our cap?\u201D The LLM synthesizes, not invents.',
      },
      {
        sym: 'Lg',
        title: 'LLM generates a grounded answer',
        body: 'The LLM reads the retrieved context and generates an answer faithful to it. Because source material is in the prompt, the model is synthesizing evidence \u2014 far less likely to hallucinate.',
        realWorld: 'Output: \u201CBased on clause 14.3, the liability cap is 2x the annual contract value \u2014 approximately $240k for Acme.\u201D Accurate because it came from the retrieved text, not training data.',
      },
      {
        sym: 'Gr',
        title: 'Guardrails filter before delivery',
        body: 'Before the answer reaches the user, guardrails check for PII leaks, contradictions with source material, and format validity. It\u2019s the last line of defense.',
        realWorld: 'The guardrail detects a response mentioning a named individual\u2019s salary (PII from a retrieved HR doc) and blocks it, returning a sanitized version instead.',
      },
    ],
  },
  {
    id: 'agent',
    name: '\u2461 Agentic loop',
    equation: [
      { sym: 'Ag', group: 'G1' }, '\u21BB',
      { sym: 'Fc', group: 'G1' }, 'via',
      { sym: 'Fw', group: 'G3' },
    ],
    steps: [
      {
        sym: 'Ag',
        title: 'Agent receives a goal, not instructions',
        body: 'Unlike a one-shot LLM call, an agent gets a goal and figures out the steps itself. It plans, acts, observes the result, and decides what to do next \u2014 looping until done or stuck.',
        realWorld: '\u201CBook me a flight to Tokyo next month under $800.\u201D The agent doesn\u2019t ask clarifying questions \u2014 it immediately starts searching, checking calendars, and comparing prices.',
      },
      {
        sym: 'Fc',
        title: 'Function calling is the agent\u2019s hands',
        body: 'The agent\u2019s actions are function calls \u2014 structured invocations of external tools. The LLM decides which tool to call and what params to pass. The result comes back, the agent reads it, plans the next step.',
        realWorld: 'Agent calls search_flights({dest:\u2019TYO\u2019}), gets 12 results, calls check_calendar({date:\u2019Aug 15-22\u2019}) to avoid conflicts, then calls book_flight({id:\u2019JL047\u2019}).',
      },
      {
        sym: 'Fw',
        title: 'Framework manages the loop machinery',
        body: 'The think-act-observe loop, memory between steps, tool registration, retry logic \u2014 all boilerplate. Frameworks handle this infrastructure so you write business logic, not loop mechanics.',
        realWorld: 'LangGraph manages the state machine (planning \u2192 searching \u2192 comparing \u2192 booking \u2192 done), handles API timeouts, and stores intermediate results the agent re-reads on the next iteration.',
      },
    ],
  },
  {
    id: 'ma',
    name: '\u2462 Multi-agent research system',
    equation: [
      { sym: 'Ma', group: 'G1' }, '\u2192',
      { sym: 'Rg', group: 'G3' }, '+',
      { sym: 'Fc', group: 'G1' }, '+',
      { sym: 'Rt', group: 'G4' },
    ],
    steps: [
      {
        sym: 'Ma',
        title: 'Multiple agents divide the work',
        body: 'Instead of one agent doing everything, a multi-agent system assigns specialized roles: researcher, writer, critic. Each agent has its own prompt, tools, and mandate \u2014 they collaborate through structured handoffs.',
        realWorld: 'A market research system has three agents: Researcher searches the web and databases, Writer synthesizes findings into a report, and Critic reviews for gaps and contradictions before final output.',
      },
      {
        sym: 'Rg',
        title: 'Researcher agent retrieves evidence',
        body: 'The research agent uses RAG to pull relevant documents, data, and sources. It doesn\u2019t generate conclusions \u2014 it gathers raw material and passes structured findings to the next agent in the chain.',
        realWorld: 'Researcher agent queries internal knowledge bases, pulls 15 relevant market reports, extracts key statistics, and passes a structured evidence package to the Writer agent.',
      },
      {
        sym: 'Fc',
        title: 'Writer agent calls tools to draft',
        body: 'The writer agent takes the researcher\u2019s evidence and uses function calls to structure, format, and draft the output. It might call a charting tool, a citation formatter, or a template engine.',
        realWorld: 'Writer calls generate_chart({data: marketShare}), format_citations({sources: [...]}), and render_report({template: \u2019executive_brief\u2019}) to produce a polished 5-page analysis.',
      },
      {
        sym: 'Rt',
        title: 'Critic agent red-teams the output',
        body: 'Before anything reaches a human, the critic agent stress-tests the draft: checking factual claims against sources, looking for logical gaps, and flagging unsupported conclusions. Red teaming built into the pipeline.',
        realWorld: 'Critic catches that the draft claims \u201Cmarket grew 40%\u201D but the source data shows 28%. It flags the discrepancy, the Writer re-drafts that section, and only then does the report ship.',
      },
    ],
  },
  {
    id: 'code',
    name: '\u2463 Domain-specific code assistant',
    equation: [
      { sym: 'Ft', group: 'G2' }, '+',
      { sym: 'Pr', group: 'G1' }, '\u2192',
      { sym: 'Sm', group: 'G5' }, '+',
      { sym: 'Gr', group: 'G4' },
    ],
    steps: [
      {
        sym: 'Ft',
        title: 'Fine-tune on your codebase',
        body: 'A base model is fine-tuned on your organization\u2019s code: internal APIs, naming conventions, architecture patterns. The model learns how your team writes code, not just generic programming.',
        realWorld: 'A fintech company fine-tunes a 7B model on 2 years of internal Go code. The model learns their custom ORM patterns, error handling conventions, and microservice communication style.',
      },
      {
        sym: 'Pr',
        title: 'Prompts carry project context',
        body: 'Each code completion request includes contextual prompts: the current file, recent changes, related modules. The prompt grounds the model in what\u2019s happening right now, not just what it learned during fine-tuning.',
        realWorld: 'Developer opens payments/handler.go. The prompt includes the current function signature, imports, and the last 3 edited files \u2014 giving the model enough context to suggest code that fits.',
      },
      {
        sym: 'Sm',
        title: 'Small model runs fast and local',
        body: 'A fine-tuned small model (7\u201313B params) runs on local infrastructure or edge GPUs. It\u2019s fast enough for real-time code completion \u2014 200ms latency, not 2 seconds \u2014 and keeps proprietary code off external APIs.',
        realWorld: 'The fine-tuned 7B model runs on an internal GPU cluster. Completions arrive in 150ms. No code leaves the company network. Cost: ~$0.001 per completion vs $0.03 for a cloud API.',
      },
      {
        sym: 'Gr',
        title: 'Guardrails block secret leakage',
        body: 'Output guardrails scan every suggestion for secrets, credentials, internal URLs, and PII before it reaches the developer\u2019s editor. A last-mile filter prevents the model from surfacing sensitive training data.',
        realWorld: 'The guardrail catches a suggestion containing a hardcoded database connection string from the training data. It strips the credential, replaces it with a placeholder, and logs the incident.',
      },
    ],
  },
];

export const GROUP_COLORS_DARK: Record<Group, { bg: string; text: string }> = {
  G1: { bg: '#FAECE7', text: '#712B13' },
  G2: { bg: '#E6F1FB', text: '#0C447C' },
  G3: { bg: '#EEEDFE', text: '#3C3489' },
  G4: { bg: '#FAEEDA', text: '#633806' },
  G5: { bg: '#E1F5EE', text: '#085041' },
};
