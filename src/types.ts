export type CategoryId =
  | 'architecture-scaling'
  | 'alignment-multimodal'
  | 'systems-efficiency'
  | 'reasoning-compute'
  | 'latent-world-models'
  | 'neuro-symbolic-agents'
  | 'safety-governance'
  | 'frontier-future';

export interface Category {
  id: CategoryId;
  name: string;
  shortName: string;
  description: string;
  paperRange: string;
  count: number;
}

export interface WorkflowStep {
  step: number;
  title: string;
  description: string;
  mathFormula?: string;
}

export interface BenchmarkComparison {
  benchmarkName: string;
  paperScore: string;
  previousIterationScore: string;
  baselineName: string;
  relativeGain: string;
  analysis: string;
}

export interface AlternativeModel {
  name: string;
  comparison: string;
  tradeoff: string;
}

export interface ReplicationGuide {
  difficulty: 'Introductory' | 'Intermediate' | 'Advanced' | 'Supercluster' | 'Frontier';
  minHardware: string;
  libraries: string[];
  datasets: string[];
  reproducibilityRecipe: string[];
  githubOrRepo: string;
}

export interface CodeSnippet {
  language: string;
  filename: string;
  description: string;
  code: string;
}

export type InteractiveToyType =
  | 'attention_matrix'
  | 'scaling_curve'
  | 'scaling_laws'
  | 'moe_router'
  | 'moe_routing'
  | 'lora_rank'
  | 'paged_blocks'
  | 'paged_attention'
  | 'diffusion_denoise'
  | 'diffusion_steps'
  | 'rlhf_ppo'
  | 'rlhf_reward'
  | 'test_time_budget'
  | 'latent_equilibrium'
  | 'neuro_symbolic'
  | 'safety_faking'
  | 'recurrent_depth'
  | 'generic_stepper'
  | 'agent_sandbox';

export interface InteractiveToyConfig {
  type: InteractiveToyType;
  title: string;
  description: string;
  params?: Record<string, any>;
}

export interface Paper {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  category: CategoryId;
  arxivUrl: string;
  year: number;
  authors: string;
  organization: string;
  tldr: string;
  intuitiveExplanation: string;
  novelty: string[];
  keyTechniques: string[];
  workflow: WorkflowStep[];
  architecture: {
    coreConcepts: string[];
    scalabilityMechanism: string;
    bottleneckSolved: string;
  };
  trainingDynamics: {
    optimizerAndSchedule: string;
    lossFunction: string;
    computeAndHardware: string;
    stabilityTricks: string;
  };
  empiricalBenchmarks: BenchmarkComparison[];
  alternatives: AlternativeModel[];
  replicationGuide: ReplicationGuide;
  codeSnippet: CodeSnippet;
  interactiveToy: InteractiveToyConfig;
  isCustom?: boolean;
  uploadedAt?: string;
}
