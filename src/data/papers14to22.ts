import { Paper } from '../types';

export const PAPERS_14_TO_22: Paper[] = [
  {
    id: 'paper-14',
    number: 14,
    title: 'Chain-of-Thought Prompting Elicits Reasoning in Large Language Models',
    subtitle: 'Genesis of LLM Reasoning',
    category: 'reasoning-compute',
    arxivUrl: 'https://arxiv.org/abs/2201.11903',
    year: 2022,
    authors: 'Wei, Wang, Schuurmans, Bosma, Chi, Le, Zhou',
    organization: 'Google Research, Brain Team',
    tldr: 'Showed that generating a sequence of intermediate natural language reasoning steps ("chain of thought") unlocks multi-step arithmetic, commonsense, and symbolic reasoning.',
    intuitiveExplanation:
      'If you ask a human to multiply 487 by 629 in their head in 0.5 seconds, they will fail. But give them a scratchpad to write down intermediate steps, and they succeed easily. Prior to this paper, language models were asked to answer complex math and logic questions in a single step (predicting the final number immediately). Chain-of-Thought (CoT) prompting provides a few examples where questions are solved step-by-step. This gives the transformer more intermediate tokens (and therefore more sequential forward passes) to compute, decompose problems, and self-correct.',
    novelty: [
      'Discovered that intermediate natural language rationales elicit reasoning capabilities in large language models.',
      'Demonstrated an emergent ability: CoT does not help models <10B parameters, but yields massive performance jumps at >100B parameters.',
      'Showed that language models can solve complex multi-hop word problems without changing weights or architecture.',
      'Inspired modern reasoning models (OpenAI o1, o3, DeepSeek-R1) which use test-time compute for thinking traces.',
    ],
    keyTechniques: [
      'Few-shot Chain-of-Thought Exemplar formatting',
      'Zero-Shot CoT ("Let\'s think step by step" - Kojima et al.)',
      'Multi-hop problem decomposition',
      'Execution tracing over intermediate natural language tokens',
    ],
    workflow: [
      {
        step: 1,
        title: 'Prompt Augmentation with Rationales',
        description: 'Format prompt with input question followed by step-by-step intermediate calculation steps before the final answer.',
      },
      {
        step: 2,
        title: 'Sequential Forward Pass Generation',
        description: 'The autoregressive decoder generates intermediate rationale tokens one-by-one; each token attends to all previous thinking steps.',
      },
      {
        step: 3,
        title: 'Final Answer Extraction',
        description: 'The model concludes its chain of thought and outputs the final numerical or symbolic solution.',
      },
    ],
    architecture: {
      coreConcepts: [
        'Pure inference prompting methodology applied to dense decoder transformers (PaLM 540B, GPT-3 175B)',
        'Requires no parameter updates or fine-tuning datasets',
        'Effective working memory capacity scales with generated token length',
      ],
      scalabilityMechanism:
        'Converts computational depth from a static layer count L into dynamic sequence length O(L * T_tokens), allocating more FLOPs to harder problems.',
      bottleneckSolved:
        'Catastrophic failure of standard LLMs on multi-step reasoning, arithmetic, and logic problems.',
    },
    trainingDynamics: {
      optimizerAndSchedule: 'N/A (Prompting strategy; no training required).',
      lossFunction: 'N/A (Evaluated on standard pre-trained foundation models).',
      computeAndHardware: 'Inference on PaLM 540B (Google TPU v4) and GPT-3 175B.',
      stabilityTricks: 'Ensuring exemplars have diverse reasoning structures to prevent stylistic looping.',
    },
    empiricalBenchmarks: [
      {
        benchmarkName: 'GSM8K Math Word Problems (PaLM 540B)',
        paperScore: '58.1% Accuracy (CoT)',
        previousIterationScore: '17.9% Accuracy (Standard Prompting)',
        baselineName: 'Standard Few-Shot Prompting',
        relativeGain: '+40.2% absolute gain',
        analysis: 'Tripled mathematical problem-solving accuracy on grade school math without a single parameter update.',
      },
      {
        benchmarkName: 'SVAMP Math Benchmark',
        paperScore: '79.0%',
        previousIterationScore: '58.9%',
        baselineName: 'Standard Prompting',
        relativeGain: '+20.1%',
        analysis: 'Exceeded specialized fine-tuned task models purely through in-context step-by-step prompting.',
      },
    ],
    alternatives: [
      {
        name: 'Self-Consistency (Wang et al. 2022)',
        comparison: 'Samples multiple independent reasoning paths with temperature > 0 and takes majority vote on final answer.',
        tradeoff: 'Further boosts accuracy by 10-15%, but costs N times more inference tokens.',
      },
      {
        name: 'Tree-of-Thoughts (ToT - Yao et al.)',
        comparison: 'Explores deliberate branching search trees over reasoning steps with lookahead and backtracking.',
        tradeoff: 'Powerful for puzzles like Game of 24, but requires complex search controllers.',
      },
    ],
    replicationGuide: {
      difficulty: 'Introductory',
      minHardware: 'Any CPU/GPU capable of running an open LLM (or API call to Gemini / Claude / GPT)',
      libraries: ['transformers', 'litellm', 'ollama'],
      datasets: ['GSM8K', 'SVAMP', 'MATH', 'StrategyQA'],
      reproducibilityRecipe: [
        'Take GSM8K question: "Roger has 5 tennis balls. He buys 2 cans of 3 balls. How many does he have?"',
        'Direct prompt: "Answer:" -> model often outputs wrong guess.',
        'CoT prompt: "Roger started with 5 balls. 2 cans of 3 tennis balls each is 2 * 3 = 6 tennis balls. 5 + 6 = 11. The answer is 11."',
        'Observe reliable multi-step calculation on test queries.',
      ],
      githubOrRepo: 'https://github.com/google-research/google-research',
    },
    codeSnippet: {
      language: 'python',
      filename: 'cot_prompt_eval.py',
      description: 'Zero-shot and Few-shot Chain-of-Thought evaluation script',
      code: `import re

def parse_cot_solution(response_text: str):
    """Extracts numeric answer following intermediate reasoning trace"""
    # Look for common concluding delimiters
    patterns = [
        r"####\\s*(-?\\d+)",
        r"[Tt]he answer is\\s*(-?\\d+)",
        r"=\\s*(-?\\d+)\\.?$"
    ]
    for pattern in patterns:
        match = re.search(pattern, response_text)
        if match:
            return int(match.group(1))
    return None

few_shot_cot_prompt = """Q: Janet's ducks lay 16 eggs per day. She eats three for breakfast and bakes muffins with four. The rest are sold for $2 each. How much does she make per day?
A: Janet's ducks lay 16 eggs. She uses 3 + 4 = 7 eggs. That leaves 16 - 7 = 9 eggs to sell. At $2 each, 9 * 2 = 18 dollars. The answer is 18.

Q: A robe takes 2 bolts of blue fiber and half that of white fiber. How many bolts are needed for 3 robes?
A:"""`,
    },
    interactiveToy: {
      type: 'generic_stepper',
      title: 'Direct vs Chain-of-Thought Attention Trace',
      description: 'Contrast single-step answer guessing against multi-step reasoning traces. See how intermediate tokens allow the transformer to store scratchpad states.',
    },
  },
  {
    id: 'paper-15',
    number: 15,
    title: 'Scaling LLM Test-Time Compute Optimally Can Be More Effective Than Scaling Pre-Training',
    subtitle: 'Inference Scaling Laws',
    category: 'reasoning-compute',
    arxivUrl: 'https://arxiv.org/abs/2408.03314',
    year: 2024,
    authors: 'Snell, Lee, Xu, Kumar',
    organization: 'UC Berkeley & Google DeepMind',
    tldr: 'Showed that spending test-time compute dynamically (via search against a verifier and revision) can outperform a 14x larger pre-trained model.',
    intuitiveExplanation:
      'For years, AI progress was driven entirely by training larger models on more data. But when a human is faced with a hard problem, they do not read another million books—they sit and think longer. Snell et al. proved that inference compute has its own scaling laws. By allowing a model to generate multiple candidate reasoning paths and using a Process Reward Model (verifier) to score them, or by letting the model iteratively revise its answer, a smaller 7B parameter model can beat a 14x larger pre-trained model on challenging competition math.',
    novelty: [
      'Formulated test-time compute scaling laws: performance scales predictably as a function of inference FLOPs.',
      'Showed that optimal test-time search can beat a model trained on 14x more compute.',
      'Identified task difficulty as the key routing variable: easy questions need minimal thinking, hard questions scale monotonically with search budget.',
      'Compared Best-of-N search, beam search, and sequential revision to derive optimal compute allocation.',
    ],
    keyTechniques: [
      'Best-of-N sampling with Process-Supervised Reward Models (PRMs)',
      'Sequential revision and iterative refinement rollouts',
      'Compute-optimal test-time budget allocation as a function of problem difficulty',
      'Tree search over step-level reasoning tokens',
    ],
    workflow: [
      {
        step: 1,
        title: 'Difficulty Estimation & Compute Routing',
        description: 'Classify problem complexity; route simple queries to greedy decoding and challenging queries to deep search.',
      },
      {
        step: 2,
        title: 'Candidate Reasoning Trajectory Sampling',
        description: 'Sample N reasoning rollouts from the policy model at temperature T > 0.',
        mathFormula: 'Y = \\{y_1, y_2, \\dots, y_N\\}, \\quad y_i \\sim \\pi_\\theta(\\cdot \\mid x)',
      },
      {
        step: 3,
        title: 'Process Verifier Scoring',
        description: 'Score each intermediate reasoning step using a Process Reward Model (PRM) rather than just the final answer.',
        mathFormula: 'r(y) = \\prod_{t=1}^T r_\\phi(s_t)',
      },
      {
        step: 4,
        title: 'Candidate Selection or Revision',
        description: 'Select argmax r(y) or feed the highest-scoring candidate back into the model with feedback prompts for refinement.',
      },
    ],
    architecture: {
      coreConcepts: [
        'Dual-system architecture: Generator policy model + Verifier evaluation model',
        'Process Reward Model (PRM) scoring each line of math rather than single scalar at the end (Outcome Reward Model)',
        'Adaptive test-time budget allocator',
      ],
      scalabilityMechanism:
        'Allows spending compute at runtime where needed, breaking free of fixed pre-training scaling caps.',
      bottleneckSolved:
        'The diminishing returns of pre-training scaling laws on reasoning tasks and the inefficiency of static compute allocation.',
    },
    trainingDynamics: {
      optimizerAndSchedule: 'PRMs trained with cross-entropy on step-level human/synthetic labels.',
      lossFunction: 'Step-level verification cross-entropy.',
      computeAndHardware: 'Inference test sweeps running on clusters of H100 GPUs.',
      stabilityTricks: 'Length normalization for PRM scores to avoid bias toward verbose or overly short derivations.',
    },
    empiricalBenchmarks: [
      {
        benchmarkName: 'MATH Benchmark Accuracy',
        paperScore: 'Outperformed 14x larger model',
        previousIterationScore: 'Baseline larger model',
        baselineName: 'Llama-2 70B (Greedy)',
        relativeGain: 'Equalized by 5B model + Search',
        analysis: 'A small model with optimized test-time search matched or exceeded models with 14x more parameters.',
      },
      {
        benchmarkName: 'Pass@K Compute Efficiency',
        paperScore: '4x Compute Reduction vs Uniform Sampling',
        previousIterationScore: 'Standard Best-of-N',
        baselineName: 'Naive majority voting',
        relativeGain: '400% efficiency',
        analysis: 'Adaptive compute allocation based on prompt difficulty saved 4x inference compute compared to fixed N.',
      },
    ],
    alternatives: [
      {
        name: 'Outcome Reward Model (ORM) Best-of-N',
        comparison: 'Scores only the final answer at the very end of the full trace.',
        tradeoff: 'ORM suffers from false positives when wrong reasoning accidentally arrives at the right number.',
      },
      {
        name: 'Pure Pre-Training Scaling',
        comparison: 'Scaling the base model to 400B+ parameters with zero search.',
        tradeoff: 'Extremely expensive to train and deploy, yet still prone to single-token reasoning missteps.',
      },
    ],
    replicationGuide: {
      difficulty: 'Intermediate',
      minHardware: 'Single RTX 4090 or cloud GPU for running 7B model generation + reward model',
      libraries: ['vllm', 'torch', 'transformers'],
      datasets: ['MATH dataset', 'GSM8K', 'PRM800K'],
      reproducibilityRecipe: [
        'Load base policy: Qwen-2.5-Math-7B-Base.',
        'Load reward model / verifier: Math-Shepherd or Qwen-2.5-Math-PRM.',
        'Generate N=16 completions at temperature=0.7.',
        'Score completions with PRM and pick top-scoring response; observe pass@1 jumping from ~50% to >75%.',
      ],
      githubOrRepo: 'https://github.com/scaling-test-time-compute/code',
    },
    codeSnippet: {
      language: 'python',
      filename: 'test_time_best_of_n.py',
      description: 'Best-of-N test-time compute search algorithm with step-level verifier scoring',
      code: `import torch

def best_of_n_search(generator, verifier, prompt: str, N: int = 16):
    """
    Allocates test-time compute by sampling N candidate trajectories
    and selecting the candidate with the highest verifier score.
    """
    candidates = []
    # 1. Sample N reasoning paths at temperature > 0
    for _ in range(N):
        output = generator.generate(prompt, temperature=0.7, max_tokens=1024)
        candidates.append(output)
        
    best_candidate = None
    best_score = float('-inf')
    
    # 2. Evaluate each candidate using Process Reward Model (verifier)
    for cand in candidates:
        with torch.no_grad():
            score = verifier.score(prompt, cand)
        if score > best_score:
            best_score = score
            best_candidate = cand
            
    return best_candidate, best_score`,
    },
    interactiveToy: {
      type: 'test_time_budget',
      title: 'Test-Time Compute Search Frontier',
      description: 'Simulate search budget N (number of rollouts) and verifier accuracy. Observe how test-time compute scales accuracy across easy, medium, and competition math.',
    },
  },
  {
    id: 'paper-16',
    number: 16,
    title: 'DeepSeek-R1: Incentivizing Reasoning Capability in LLMs via Reinforcement Learning',
    subtitle: 'Pure RL Inducing Reasoning',
    category: 'reasoning-compute',
    arxivUrl: 'https://arxiv.org/abs/2501.12948',
    year: 2025,
    authors: 'DeepSeek-AI: Guo, Yang, Zhang, Song, Zhang, Xu, Zhu, Ma, Wang, Bi, Zhang et al.',
    organization: 'DeepSeek',
    tldr: 'Discovered that pure Reinforcement Learning (Group Relative Policy Optimization) on a base model directly induces deep reasoning behaviors, self-correction, and long thinking traces without human SFT.',
    intuitiveExplanation:
      'Most people believed that to teach an AI to "think" in long reasoning chains, you first needed humans to write hundreds of thousands of step-by-step thinking examples. DeepSeek-R1 Zero proved this wrong: they took a raw base model and trained it using pure reinforcement learning with simple rule-based rewards (is the math answer correct? does the code pass tests?). Without any human examples, the model spontaneously developed long internal thinking chains, self-reflection ("Wait, let me double-check that..."), backtracking, and verification on its own. They then distilled this capability into smaller 1.5B - 14B models that run locally.',
    novelty: [
      'DeepSeek-R1-Zero: First demonstration that pure RL without prior SFT induces sophisticated reasoning, self-reflection, and "Aha!" moments.',
      'Group Relative Policy Optimization (GRPO): Eliminates the critic value network entirely, saving ~50% GPU memory during RL training.',
      'Multi-stage training pipeline: R1-Zero -> Cold-start SFT -> Reasoning RL -> General SFT -> General RL.',
      'Showed that distilled 14B and 32B models match or beat OpenAI o1-mini across math and coding benchmarks.',
    ],
    keyTechniques: [
      'Group Relative Policy Optimization (GRPO) without Critic',
      'Rule-based verification rewards (Accuracy reward + Format reward: <think> ... </think>)',
      'Aha Moment emergent self-correction behaviors',
      'High-quality reasoning trace distillation to Qwen/Llama student models',
    ],
    workflow: [
      {
        step: 1,
        title: 'Group Sampling (GRPO)',
        description: 'For each prompt x, sample a group of G outputs {o_1, o_2, ..., o_G} from the old policy model.',
      },
      {
        step: 2,
        title: 'Rule-Based Outcome Reward Scoring',
        description: 'Evaluate each completion using automated compiler/math verifiers: r_i = 1.0 if answer correct and formatted, else 0.0.',
      },
      {
        step: 3,
        title: 'Group Advantage Normalization',
        description: 'Compute advantages by normalizing rewards relative to the group mean and standard deviation without a separate critic network.',
        mathFormula: 'A_i = \\frac{r_i - \\text{mean}(\\{r_1, \\dots, r_G\\})}{\\text{std}(\\{r_1, \\dots, r_G\\})}',
      },
      {
        step: 4,
        title: 'Clipped Policy Optimization',
        description: 'Update model weights using PPO-style clipped objective with KL penalty against reference policy.',
      },
    ],
    architecture: {
      coreConcepts: [
        'Built on DeepSeek-V3 MoE base model (671B total params, 37B activated per token)',
        'GRPO replaces PPO value model with group-normalized baseline',
        'Strict formatting constraint using <think> ... </think> tags',
      ],
      scalabilityMechanism:
        'Removes the critic model memory footprint, allowing large-scale RL exploration on MoE architectures with longer context rollouts (up to 32k tokens).',
      bottleneckSolved:
        'Dependency on expensive, human-annotated reasoning chain datasets and the memory overhead of PPO critic models.',
    },
    trainingDynamics: {
      optimizerAndSchedule: 'AdamW with constant low learning rate; gradient clipping at 1.0.',
      lossFunction: 'GRPO clipped surrogate loss with per-token KL divergence penalty.',
      computeAndHardware: 'Clusters of NVIDIA H800 GPUs training with FP8 mixed precision.',
      stabilityTricks: 'Length penalties to prevent infinite thinking loops; language consistency rewards to prevent multi-language code-switching.',
    },
    empiricalBenchmarks: [
      {
        benchmarkName: 'AIME 2024 Math Olympiad (Pass@1)',
        paperScore: '79.8%',
        previousIterationScore: '15.6% (DeepSeek-V3 Base) / 79.2% (OpenAI o1-0912)',
        baselineName: 'OpenAI o1-0912',
        relativeGain: 'Matched frontier SOTA',
        analysis: 'Achieved top Olympiad math performance purely through RL exploration, matching OpenAI o1.',
      },
      {
        benchmarkName: 'MATH-500 Benchmark',
        paperScore: '97.3%',
        previousIterationScore: '90.2% (GPT-4o)',
        baselineName: 'GPT-4o',
        relativeGain: '+7.1%',
        analysis: 'Set a new world record on competition grade mathematics.',
      },
    ],
    alternatives: [
      {
        name: 'Standard PPO with Critic',
        comparison: 'Requires maintaining a value network of identical parameter size to the policy model.',
        tradeoff: 'PPO requires double the GPU VRAM for the critic; GRPO discards the critic completely.',
      },
      {
        name: 'Supervised Fine-Tuning Only (SFT)',
        comparison: 'Training solely on human-written or synthetic teacher traces.',
        tradeoff: 'SFT models imitate teacher formatting but lack the exploratory self-correction discovered via pure RL.',
      },
    ],
    replicationGuide: {
      difficulty: 'Intermediate',
      minHardware: 'Single RTX 3090/4090 or cloud A100 using Unsloth or TRL',
      libraries: ['unsloth', 'trl (GRPO)', 'transformers', 'vllm'],
      datasets: ['GSM8K', 'MATH', 'NuminaMath'],
      reproducibilityRecipe: [
        'Install: pip install unsloth trl vllm.',
        'Load base: Qwen-2.5-Coder-1.5B or 7B.',
        'Define reward function: def reward_fn(prompts, completions, answer) checking exact regex match.',
        'Run GRPOTrainer with group_size=4 and max_prompt_length=256, max_completion_length=1024.',
        'Watch thinking traces emerge within 100 training steps.',
      ],
      githubOrRepo: 'https://github.com/deepseek-ai/DeepSeek-R1',
    },
    codeSnippet: {
      language: 'python',
      filename: 'grpo_loss_engine.py',
      description: 'Group Relative Policy Optimization (GRPO) advantage calculation and loss formulation',
      code: `import torch
import torch.nn.functional as F

def compute_grpo_loss(
    log_probs_policy: torch.Tensor,
    log_probs_old: torch.Tensor,
    rewards: torch.Tensor,       # Shape: (batch_size, group_size)
    clip_eps: float = 0.2,
    kl_beta: float = 0.04,
    log_probs_ref: torch.Tensor = None
):
    """
    GRPO replaces the PPO critic with group-normalized advantages:
    A_{i, j} = (r_{i, j} - mean(r_i)) / (std(r_i) + eps)
    """
    # 1. Group-relative advantage normalization across group dimension
    mean_r = rewards.mean(dim=-1, keepdim=True)
    std_r = rewards.std(dim=-1, keepdim=True) + 1e-8
    advantages = (rewards - mean_r) / std_r  # (batch_size, group_size)
    
    # 2. Probability ratios: pi_theta / pi_old
    ratio = torch.exp(log_probs_policy - log_probs_old)
    
    # 3. Clipped surrogate objective
    surr1 = ratio * advantages.unsqueeze(-1)
    surr2 = torch.clamp(ratio, 1.0 - clip_eps, 1.0 + clip_eps) * advantages.unsqueeze(-1)
    policy_loss = -torch.min(surr1, surr2).mean()
    
    # 4. Optional per-token KL divergence penalty against reference policy
    if log_probs_ref is not None:
        kl = torch.exp(log_probs_ref - log_probs_policy) - (log_probs_ref - log_probs_policy) - 1.0
        policy_loss += kl_beta * kl.mean()
        
    return policy_loss`,
    },
    interactiveToy: {
      type: 'test_time_budget',
      title: 'GRPO Group Reward & Advantage Explorer',
      description: 'Simulate a group of G generated reasoning completions. See how reward normalization creates relative advantages without an expensive value network.',
    },
  },
  {
    id: 'paper-17',
    number: 17,
    title: "Let's Verify Step by Step",
    subtitle: 'Process-Supervised Reward Models (PRMs) & PRM800K for Multi-Step Reasoning',
    category: 'reasoning-compute',
    arxivUrl: 'https://arxiv.org/abs/2305.20050',
    year: 2023,
    authors: 'Hunter Lightman, Vineet Kosaraju, Yura Burda, Harri Edwards, Bowen Baker, Teddy Lee, Jan Leike, John Schulman, Ilya Sutskever, Karl Cobbe',
    organization: 'OpenAI',
    tldr: 'Proved that process supervision (evaluating every intermediate reasoning step with a PRM) substantially outperforms outcome supervision (ORM), establishing the foundational verifier architecture for modern reasoning models.',
    intuitiveExplanation:
      'When evaluating complex reasoning, conventional Outcome Reward Models (ORMs) only check whether the final answer is right. But a model can take 10 flawed steps and stumble upon the correct answer by accident (a false positive), or execute 9 brilliant steps and make a small arithmetic typo at the end (a false negative). OpenAI introduced Process-Supervised Reward Models (PRMs): instead of scoring just the final outcome, a PRM scores every single intermediate step. Using a dataset of 800,000 human step-level annotations (PRM800K), they proved that process supervision achieves 78.2% on the competitive MATH benchmark, solving significantly more problems than ORMs while eliminating reward hacking.',
    novelty: [
      'Process Supervision vs Outcome Supervision: Demonstrated that step-by-step verification drastically improves reasoning accuracy over final-answer scoring.',
      'PRM800K Dataset: Released 800,000 human step-level correctness labels on 75,000 model-generated solutions to MATH problems.',
      'Mitigating Reward Hacking: Step-level credit assignment prevents models from being rewarded for unsound reasoning that accidentally yields the right number.',
      'Active Learning Data Strategy: Actively sampled completions with highest verifier uncertainty to maximize human labeling efficiency.',
    ],
    keyTechniques: [
      'Process-Supervised Reward Models (PRM)',
      'Step-delimiter scoring token representations',
      'Minimum step probability trajectory scoring: R(x, y) = min_k p_k',
      'PRM800K active learning sampling methodology',
    ],
    workflow: [
      {
        step: 1,
        title: 'Candidate Reasoning Trace Generation',
        description: 'Generator policy samples candidate step-by-step reasoning paths separated by step delimiter tokens.',
        mathFormula: 'y = (s_1, s_2, \\dots, s_K) \\sim \\pi_\\theta(\\cdot | x)',
      },
      {
        step: 2,
        title: 'Step-Level Delimiter Scoring',
        description: 'The PRM evaluates the probability that each individual step s_k is mathematically sound conditioned on prior steps.',
        mathFormula: 'p_k = \\text{PRM}(s_k | x, s_1, \\dots, s_{k-1}) = \\sigma\\left(w^T h_{\\text{delimiter}}^{(k)}\\right)',
      },
      {
        step: 3,
        title: 'Path Value Formulation',
        description: 'The overall trajectory score is formulated as the product or minimum of step-level correctness probabilities.',
        mathFormula: 'R(x, y) = \\prod_{k=1}^K p_k, \\quad R_{\\min}(x, y) = \\min_{k=1}^K p_k',
      },
      {
        step: 4,
        title: 'Test-Time Best-of-N / Tree Pruning',
        description: 'Select the highest-scoring candidate reasoning path, immediately pruning any branch where a step fails verification.',
        mathFormula: 'y^* = \\arg\\max_{y \\in \\{y^{(1)}, \\dots, y^{(N)}\\}} R(x, y)',
      },
    ],
    architecture: {
      coreConcepts: [
        'Base Model: GPT-4 fine-tuned as a Step-Level Process Verifier',
        '800,000 step annotations across 12,000 competition MATH problems',
        'Evaluates validity of step k conditioned on context x and steps 1 through k-1',
      ],
      scalabilityMechanism:
        'Provides granular step-level reward signals to guide test-time tree search (MCTS, beam search, best-of-N) without requiring answer keys.',
      bottleneckSolved:
        'Outcome reward model hacking, where wrong reasoning produces the right answer, causing reinforcement learning to reinforce faulty logic.',
    },
    trainingDynamics: {
      optimizerAndSchedule: 'AdamW with linear warmup and cosine decay; trained on PRM800K tokenized step sequences.',
      lossFunction: '\\mathcal{L}_{\\text{PRM}} = -\\sum_{k=1}^K \\left[ y_k^* \\log p_k + (1 - y_k^*) \\log (1 - p_k) \\right]',
      computeAndHardware: 'Fine-tuned GPT-4 family models on Azure cloud GPU clusters.',
      stabilityTricks: 'Loss masking applied strictly to delimiter tokens; active sampling to balance positive and negative step annotations.',
    },
    empiricalBenchmarks: [
      {
        benchmarkName: 'MATH Benchmark (Competition Level Math)',
        paperScore: '78.2% Pass@1 (Best-of-N)',
        previousIterationScore: '69.6% (Outcome-Supervised ORM)',
        baselineName: 'Outcome-Supervised Reward Model (ORM)',
        relativeGain: '+8.6% absolute gain',
        analysis: 'Process supervision solved significantly more competition problems and scaled far more effectively with test-time compute.',
      },
      {
        benchmarkName: 'Sample Efficiency in Verification',
        paperScore: '7.8x reduction in required samples',
        previousIterationScore: 'Outcome-based scoring',
        baselineName: 'ORM Best-of-N',
        relativeGain: '780% compute efficiency',
        analysis: 'Process supervision reached target accuracy with a fraction of the candidate samples required by outcome supervision.',
      },
    ],
    alternatives: [
      {
        name: 'Outcome Reward Model (ORM)',
        comparison: 'Evaluates only the final answer at the very end of the solution.',
        tradeoff: 'ORMs cannot pinpoint which step introduced an error, and reward faulty reasoning that stumbles onto the right answer.',
      },
      {
        name: 'Self-Consistency (Majority Voting)',
        comparison: 'Samples N completions and takes the modal final answer.',
        tradeoff: 'Majority voting fails when common reasoning traps cause multiple completions to fail in identical ways.',
      },
    ],
    replicationGuide: {
      difficulty: 'Intermediate',
      minHardware: 'Single GPU (RTX 4090 or A10G) for running step-level verification with Qwen2.5-Math-PRM-7B',
      libraries: ['transformers', 'torch', 'vllm'],
      datasets: ['PRM800K (OpenAI)', 'MATH dataset', 'GSM8K'],
      reproducibilityRecipe: [
        'Load a pretrained process reward model: Qwen/Qwen2.5-Math-PRM-7B.',
        'Tokenize generation with step delimiters ("\\n\\n").',
        'Extract logits at each delimiter token to obtain per-step probability p_k.',
        'Aggregate with min(p_k) to rank candidate solutions.',
      ],
      githubOrRepo: 'https://github.com/openai/prm800k',
    },
    codeSnippet: {
      language: 'python',
      filename: 'process_reward_model.py',
      description: 'Step-level Process-Supervised Reward Model (PRM) scoring and trace filtering',
      code: `import torch
import torch.nn as nn

def score_reasoning_steps(step_logits: torch.Tensor, step_indices: list[int]) -> list[float]:
    """
    Extracts step-level correctness probabilities at each step delimiter token.
    step_logits: (seq_len, vocab_or_classes) from the PRM
    step_indices: token positions corresponding to '\\n\\n' step boundaries
    """
    step_probabilities = []
    for idx in step_indices:
        # Delimiter token outputs binary classification: [incorrect, correct]
        probs = torch.softmax(step_logits[idx], dim=-1)
        p_correct = probs[1].item()  # Probability that this step is mathematically valid
        step_probabilities.append(p_correct)
    return step_probabilities

def score_trajectory(step_probs: list[float], aggregation: str = "min") -> float:
    """
    Aggregates step-level probabilities into an overall trajectory score.
    'min' aggregation immediately penalizes any reasoning chain with a single faulty step.
    """
    if not step_probs:
        return 0.0
    if aggregation == "min":
        return min(step_probs)
    elif aggregation == "product":
        prod = 1.0
        for p in step_probs:
            prod *= p
        return prod
    return sum(step_probs) / len(step_probs)`,
    },
    interactiveToy: {
      type: 'test_time_budget',
      title: 'Process Supervision (PRM) Step-by-Step Verifier',
      description: 'Simulate step-level reasoning verification. Contrast how an Outcome Reward Model (ORM) gets fooled by lucky arithmetic errors while a PRM catches bugs at step 3.',
    },
  },
  {
    id: 'paper-18',
    number: 18,
    title: 'Universal Transformers',
    subtitle: 'Looped Transformers with Adaptive Computation Time (ACT)',
    category: 'latent-world-models',
    arxivUrl: 'https://arxiv.org/abs/1807.03819',
    year: 2018,
    authors: 'Dehghani, Gouws, Vinyals, Uszkoreit, Kaiser',
    organization: 'Google Brain & DeepMind',
    tldr: 'Combined parallel self-attention with recurrent weight-sharing and Adaptive Computation Time (ACT), creating a Turing-complete universal sequence model.',
    intuitiveExplanation:
      'Standard transformers stack N distinct layers: layer 1 has different weights than layer 2, and every token passes through exactly N layers. But algorithms and reasoning are often iterative loops (like a while loop that runs until a condition is met). Universal Transformers make the transformer recurrent across depth: all layers share the exact same weights. Furthermore, using Adaptive Computation Time (ACT), the model can decide how many loop iterations each token needs. A simple word like "the" might stop after 1 step, while a difficult logic puzzle loops for 10 steps.',
    novelty: [
      'Recurrent depth weight sharing: applies the same self-attention and transition functions repeatedly across depth.',
      'Dynamic per-token Adaptive Computation Time (ACT) halting mechanism.',
      'Proved computational universality (Turing-completeness under finite precision assumptions).',
      'Demonstrated superior algorithmic generalization on Program Evaluation, bAbI, and LAMBADA.',
    ],
    keyTechniques: [
      'Recurrent Layer Weight-Tying across depth step t',
      'Adaptive Computation Time (Graves 2016) halting probabilities',
      'Coordinate embeddings summing timestep step t with spatial position pos',
      'Dynamic computational halting thresholds (1 - epsilon)',
    ],
    workflow: [
      {
        step: 1,
        title: 'State Initialization',
        description: 'Initialize token representations H_0 from input embeddings and add combined position-step coordinate vectors.',
      },
      {
        step: 2,
        title: 'Recurrent Depth Step Update',
        description: 'Pass current states H_t through shared multi-head self-attention and shared transition function.',
        mathFormula: 'H_{t+1} = \\text{Transition}(\\text{SelfAttention}(H_t))',
      },
      {
        step: 3,
        title: 'Dynamic Halting Evaluation (ACT)',
        description: 'Halting unit computes probability h_t for each token. If accumulated halting probability reaches 1 - epsilon, the token halts.',
        mathFormula: 'p_t = \\sigma(W_h H_t + b_h), \\quad \\sum_{t=1}^T p_t \\approx 1',
      },
      {
        step: 4,
        title: 'Ponder-Cost Weighted Output',
        description: 'Output is computed as the probability-weighted sum of intermediate representations across halting steps.',
      },
    ],
    architecture: {
      coreConcepts: [
        'Single recurrent transformer block iterated dynamically across depth',
        'ACT scalar halting sigmoidal unit per token position',
        'Ponder cost penalty added to training objective',
      ],
      scalabilityMechanism:
        'Decouples parameter capacity from computational depth: can run 20 depth iterations with the parameter footprint of a single layer.',
      bottleneckSolved:
        'Inability of fixed-depth feed-forward transformers to solve algorithmic tasks requiring variable recursion depth.',
    },
    trainingDynamics: {
      optimizerAndSchedule: 'Adam with warmup; ACT ponder loss weight tau in [0.01, 0.1].',
      lossFunction: 'Task cross-entropy loss + Ponder cost penalty tau * sum(N_t).',
      computeAndHardware: 'Trained on Google Cloud TPUs.',
      stabilityTricks: 'Remainder accumulation for halting step to ensure clean differentiability.',
    },
    empiricalBenchmarks: [
      {
        benchmarkName: 'bAbI Reasoning Tasks (All 20 tasks solved)',
        paperScore: '0.2% Error (Solved all 20)',
        previousIterationScore: '2.1% Error (Failed tasks)',
        baselineName: 'Standard Transformer (Vaswani et al.)',
        relativeGain: 'Solved previously failing tasks',
        analysis: 'Standard transformers failed on path finding and induction; Universal Transformers solved all 20 tasks perfectly.',
      },
      {
        benchmarkName: 'Subject-Verb Agreement Long Distance',
        paperScore: '99.2%',
        previousIterationScore: '96.2%',
        baselineName: 'LSTM / Standard Transformer',
        relativeGain: '+3.0%',
        analysis: 'Maintained near-perfect syntactic agreement across arbitrary sentence distances.',
      },
    ],
    alternatives: [
      {
        name: 'Standard Fixed-Depth Transformer',
        comparison: 'Fixed stack of 32 or 64 non-weight-tied layers.',
        tradeoff: 'Fixed depth cannot adapt compute based on problem complexity; all tokens get identical FLOPs.',
      },
      {
        name: 'Deep Equilibrium Models (DEQ)',
        comparison: 'Solves for the infinite-depth fixed point directly using numerical root-finding.',
        tradeoff: 'DEQs compute infinite depth without unrolling, but require implicit function differentiation.',
      },
    ],
    replicationGuide: {
      difficulty: 'Intermediate',
      minHardware: 'Single RTX 3060 / 4060 (8GB VRAM)',
      libraries: ['PyTorch', 'torch.nn'],
      datasets: ['bAbI tasks', 'Sort / Copy algorithmic strings', 'ListOps'],
      reproducibilityRecipe: [
        'Build single TransformerEncoderLayer.',
        'Wrap inside a loop for step in range(max_steps): x = layer(x).',
        'Add linear sigmoid halting head: p = sigmoid(halt_linear(x)).',
        'Train on string reversal or parenthesis matching task.',
      ],
      githubOrRepo: 'https://github.com/tensorflow/tensor2tensor',
    },
    codeSnippet: {
      language: 'python',
      filename: 'universal_transformer_act.py',
      description: 'Universal Transformer recurrent block with Adaptive Computation Time (ACT)',
      code: `import torch
import torch.nn as nn

class UniversalTransformerBlock(nn.Module):
    def __init__(self, d_model: int = 256, n_heads: int = 4, max_steps: int = 8):
        super().__init__()
        self.max_steps = max_steps
        # Single shared attention layer reused across all depth steps
        self.shared_layer = nn.TransformerEncoderLayer(d_model=d_model, nhead=n_heads, batch_first=True)
        # Halting unit to dynamically terminate pondering
        self.halt_unit = nn.Linear(d_model, 1)

    def forward(self, x: torch.Tensor, threshold: float = 0.99):
        B, S, D = x.shape
        state = x
        halting_probs = torch.zeros(B, S, 1, device=x.device)
        remainders = torch.zeros(B, S, 1, device=x.device)
        n_updates = torch.zeros(B, S, 1, device=x.device)
        accumulated_state = torch.zeros_like(x)

        for step in range(self.max_steps):
            # Recurrently pass state through the shared transformer block
            state = self.shared_layer(state)
            p = torch.sigmoid(self.halt_unit(state))
            
            # Mask of tokens still pondering
            still_running = (halting_probs < threshold).float()
            new_halt_probs = halting_probs + p * still_running
            
            # Check for halting threshold boundary
            halted_now = (new_halt_probs >= threshold).float() * still_running
            remainder = (1.0 - halting_probs) * halted_now
            
            prob_weight = p * still_running * (1.0 - halted_now) + remainder
            accumulated_state += prob_weight * state
            
            halting_probs = new_halt_probs
            n_updates += still_running
            
            if (halting_probs >= threshold).all():
                break

        return accumulated_state, n_updates`,
    },
    interactiveToy: {
      type: 'recurrent_depth',
      title: 'Universal Transformer ACT Halting Simulator',
      description: 'Observe tokens pondering through recurrent depth loops. Watch simple grammatical tokens halt after 1-2 steps while ambiguous words continue to loop.',
    },
  },
  {
    id: 'paper-19',
    number: 19,
    title: 'Deep Equilibrium Models',
    subtitle: 'Fixed-Point Latent Representations',
    category: 'latent-world-models',
    arxivUrl: 'https://arxiv.org/abs/1909.01377',
    year: 2019,
    authors: 'Bai, Kolter, Koltun',
    organization: 'Carnegie Mellon University & Intel Labs',
    tldr: 'Demonstrated that an "infinitely deep" network can be trained in O(1) memory by casting the forward pass as finding a fixed-point equilibrium z* = f(z*, x) and backpropagating via implicit differentiation.',
    intuitiveExplanation:
      'In a 100-layer neural network, you must store the intermediate activations of all 100 layers in GPU memory during the forward pass so you can calculate gradients during the backward pass. This causes memory to explode with depth. Deep Equilibrium (DEQ) models ask: what if an infinite number of identical layers converges to a stable equilibrium state z* where feeding z* into the layer outputs z* again? The forward pass simply uses a fast numerical root-finder (like Broyden\'s method) to find z*. Crucially, by using the Implicit Function Theorem, we can calculate exact gradients directly at the equilibrium point without storing ANY intermediate steps! Infinite depth in constant O(1) memory.',
    novelty: [
      'Eliminated activation memory scaling with depth, achieving O(1) memory for arbitrarily deep networks.',
      'Replaced forward layer stacking with root-finding for the fixed-point equilibrium z* = f_theta(z*, x).',
      'Applied the Implicit Function Theorem (IFT) to backpropagate directly through the equilibrium point without unrolling.',
      'Matched state-of-the-art results on WikiText-103 language modeling and ImageNet classification.',
    ],
    keyTechniques: [
      'Fixed-Point Equation: z^* = f_\\theta(z^*, x)',
      'Black-box root-finding algorithms (Broyden\'s Quasi-Newton, Anderson acceleration)',
      'Implicit Function Theorem for backward gradient calculation: (I - J_{f, z^*})^{-1}',
      'Vector-Jacobian product linear solving via GMRES / Richardson iteration',
    ],
    workflow: [
      {
        step: 1,
        title: 'Equilibrium Formulation',
        description: 'Define transformation f_theta(z, x). The forward pass goal is to find state z* such that z* = f_theta(z*, x).',
        mathFormula: 'g(z^*) = f_\\theta(z^*, x) - z^* = 0',
      },
      {
        step: 2,
        title: 'Forward Root-Finding (Broyden / Anderson)',
        description: 'Use numerical solvers to iterate until ||f(z) - z|| < tol. Intermediate states are discarded immediately.',
      },
      {
        step: 3,
        title: 'Implicit Differentiation Backward Pass',
        description: 'Compute loss gradient using implicit function theorem, solving a single linear system at z* without unrolling steps.',
        mathFormula: '\\frac{\\partial \\mathcal{L}}{\\partial \\theta} = -\\frac{\\partial \\mathcal{L}}{\\partial z^*} \\left( I - J_{f, z^*} \\right)^{-1} \\frac{\\partial f_\\theta(z^*, x)}{\\partial \\theta}',
      },
    ],
    architecture: {
      coreConcepts: [
        'Single non-linear equilibrium layer (e.g. multi-head attention + FFN block)',
        'O(1) activation memory: memory footprint is invariant to the number of solver iterations',
        'Black-box solver separation: forward solver can be swapped without retraining weights',
      ],
      scalabilityMechanism:
        'Enables arbitrary computational depth during inference and training while strictly capping memory to a single layer footprint.',
      bottleneckSolved:
        'The linear O(L) GPU memory wall imposed by backpropagation through deep layered architectures.',
    },
    trainingDynamics: {
      optimizerAndSchedule: 'AdamW; Broyden solver tolerance set to 1e-5 during forward and 1e-6 during backward.',
      lossFunction: 'Cross-entropy on target vocabulary at equilibrium state z*.',
      computeAndHardware: 'NVIDIA V100 GPUs.',
      stabilityTricks: 'Weight normalization and spectral radius bounding of Jacobian J to ensure contractive convergence.',
    },
    empiricalBenchmarks: [
      {
        benchmarkName: 'WikiText-103 Perplexity (Language Modeling)',
        paperScore: '24.0 PPL (at 88% memory savings)',
        previousIterationScore: '24.2 PPL',
        baselineName: 'Transformer-XL (16 layers)',
        relativeGain: 'Equal quality in constant memory',
        analysis: 'Matched 16-layer Transformer-XL while consuming only 1/6th the activation memory during training.',
      },
      {
        benchmarkName: 'Memory Consumption vs Depth',
        paperScore: 'O(1) Flat Constant',
        previousIterationScore: 'O(L) Linear Growth',
        baselineName: 'Standard Deep Feedforward Networks',
        relativeGain: 'Zero memory growth with depth',
        analysis: 'Could run 50+ solver iterations with zero additional GPU VRAM allocation.',
      },
    ],
    alternatives: [
      {
        name: 'Neural Ordinary Differential Equations (Neural ODEs)',
        comparison: 'Models continuous depth dynamics as dz/dt = f(z, t) and solves using ODE integrators (adjoint method).',
        tradeoff: 'Neural ODEs integrate over time trajectories; DEQ directly solves for terminal steady-state fixed points.',
      },
      {
        name: 'Reversible Networks (RevNet)',
        comparison: 'Reconstructs activations on-the-fly during backward pass to save memory.',
        tradeoff: 'RevNets still require fixed explicit layer stacking, whereas DEQs model infinite depth.',
      },
    ],
    replicationGuide: {
      difficulty: 'Advanced',
      minHardware: 'Single GPU with 8GB - 16GB VRAM (RTX 3070/3080/4080)',
      libraries: ['torchdeq', 'scipy', 'torch'],
      datasets: ['MNIST', 'CIFAR-10', 'Penn Treebank'],
      reproducibilityRecipe: [
        'Install torchdeq: pip install torchdeq.',
        'Define contractive layer: f = nn.Sequential(nn.Linear(d, d), nn.Tanh()).',
        'Wrap with torchdeq.get_deq(f, solver="broyden").',
        'Verify that backward pass computes gradients with torch.autograd without memory growth.',
      ],
      githubOrRepo: 'https://github.com/locuslab/deq',
    },
    codeSnippet: {
      language: 'python',
      filename: 'deq_fixed_point.py',
      description: 'Fixed-Point forward iteration and Implicit Function Theorem backward step',
      code: `import torch
import torch.nn as nn

class SimpleDEQ(torch.autograd.Function):
    @staticmethod
    def forward(ctx, f_layer, x, max_iter=50, tol=1e-5):
        # 1. Forward fixed point search: z_{k+1} = f(z_k, x)
        z = torch.zeros_like(x)
        for _ in range(max_iter):
            z_next = f_layer(z, x)
            if torch.norm(z_next - z) < tol:
                z = z_next
                break
            z = z_next

        ctx.f_layer = f_layer
        ctx.save_for_backward(z, x)
        return z

    @staticmethod
    def backward(ctx, grad_output):
        # 2. Implicit differentiation using fixed point condition: z* = f(z*, x)
        z, x = ctx.saved_tensors
        f_layer = ctx.f_layer
        
        # Enable grad temporarily to compute Vector-Jacobian product
        with torch.enable_grad():
            z_var = z.detach().requires_grad_(True)
            f_val = f_layer(z_var, x)
            
        # Solve linear system: u = grad_output + u * J_{f, z*}
        u = grad_output.clone()
        for _ in range(30):
            # Power iteration / Neumann series solver
            vjp = torch.autograd.grad(f_val, z_var, u, retain_graph=True)[0]
            u = grad_output + vjp
            
        # Compute gradient with respect to layer weights and inputs
        grads = torch.autograd.grad(f_val, list(f_layer.parameters()), u)
        return None, None`,
    },
    interactiveToy: {
      type: 'latent_equilibrium',
      title: 'Fixed-Point Equilibrium Convergence Toy',
      description: 'Watch the state vector z iterate toward steady-state fixed point z* where f(z*) = z*. Inspect the flat O(1) memory profile as solver depth increases.',
    },
  },
  {
    id: 'paper-20',
    number: 20,
    title: 'Training Large Language Models to Reason in a Continuous Latent Space',
    subtitle: 'Coconut: Continuous Latent-Space Reasoning',
    category: 'latent-world-models',
    arxivUrl: 'https://arxiv.org/abs/2412.06769',
    year: 2024,
    authors: 'Hao, Gu, Hu, Gao, Liu, Neubig',
    organization: 'Carnegie Mellon University & Meta FAIR',
    tldr: 'Pioneered training LLMs to reason directly in continuous hidden state space rather than generating discrete words, enabling breadth-first search and latent backtracking.',
    intuitiveExplanation:
      'Standard Chain-of-Thought reasoning requires the model to output English words one after another. But words are discrete: once a model writes the word "Therefore", it is committed to a specific linguistic path and cannot easily explore multiple hypotheses simultaneously. The Coconut architecture introduces continuous latent reasoning. Instead of decoding hidden states back into vocabulary words, the model feeds its raw continuous hidden vectors directly into the next time step as "latent thought tokens". In continuous vector space, a single latent vector can represent a superposed superposition of multiple hypotheses, allowing the model to explore multiple reasoning paths in parallel before collapsing into a final answer.',
    novelty: [
      'First architecture to eliminate the discrete token bottleneck during multi-step chain-of-thought.',
      'Continuous latent thought tokens: feeds final-layer hidden states directly as input embeddings for subsequent steps.',
      'Demonstrated emergent breadth-first search (BFS) capability within continuous latent states.',
      'Multi-stage curriculum that progressively replaces discrete language tokens with continuous latent thoughts.',
    ],
    keyTechniques: [
      'Latent Thought Embedding Recurrence: e_{t+1} = h_t^L (bypassing language modeling head)',
      'Progressive Token Replacement Curriculum (k stages)',
      'Reward-guided and teacher-forcing latent training',
      'Unconstrained continuous representation search',
    ],
    workflow: [
      {
        step: 1,
        title: 'Standard Discrete Warmup',
        description: 'Train the model initially on human reasoning chains where intermediate thoughts are standard English words.',
      },
      {
        step: 2,
        title: 'Progressive Latent Conversion',
        description: 'Iteratively replace intermediate thought tokens with continuous latent vectors across training stages.',
        mathFormula: 'x_{t+1} = \\begin{cases} \\text{Embed}(w_{t+1}) & \\text{if word token} \\\\ h_t^{(L)} & \\text{if latent thought token} \\end{cases}',
      },
      {
        step: 3,
        title: 'Latent-Space Thinking Trajectory',
        description: 'The model generates k continuous latent steps. No text is emitted; information is processed purely in activation space.',
      },
      {
        step: 4,
        title: 'Discrete Answer Decoding',
        description: 'Switch back to the vocabulary language modeling head to project the final latent thought into the concrete answer.',
      },
    ],
    architecture: {
      coreConcepts: [
        'Decoder transformer where input embedding table can accept raw continuous vectors from layer L',
        'Continuous thought budget: hyperparameter k specifying number of latent thinking steps',
        'Preserves full model weights without architectural changes',
      ],
      scalabilityMechanism:
        'Reduces token count by 3x-5x while increasing expressivity, bypassing the 32k-token discrete output bottleneck.',
      bottleneckSolved:
        'The discrete token bottleneck that forces early commitment to narrow reasoning paths and limits parallel hypothesis exploration.',
    },
    trainingDynamics: {
      optimizerAndSchedule: 'AdamW with warm-up; learning rate 1e-5; cosine decay.',
      lossFunction: 'Cross-entropy on final discrete answer tokens; gradient backpropagates through all continuous latent steps.',
      computeAndHardware: '8x NVIDIA A100 (80GB) GPUs.',
      stabilityTricks: 'LayerNorm applied to latent thought vectors before feeding them back into layer 1 to prevent activation magnitude drift.',
    },
    empiricalBenchmarks: [
      {
        benchmarkName: 'GSM8K Math with 3x Fewer Tokens',
        paperScore: '74.2% Accuracy',
        previousIterationScore: '68.5% Accuracy',
        baselineName: 'Discrete CoT with equal token budget',
        relativeGain: '+5.7%',
        analysis: 'Continuous latent thinking solved problems with 1/3rd the token count of explicit verbal Chain-of-Thought.',
      },
      {
        benchmarkName: 'ProntoQA Logical Deductions',
        paperScore: '88.9%',
        previousIterationScore: '71.4%',
        baselineName: 'Standard Discrete CoT',
        relativeGain: '+17.5%',
        analysis: 'Demonstrated superior multi-hop backtracking and hypothesis superposition on tree search logic tasks.',
      },
    ],
    alternatives: [
      {
        name: 'Standard Chain-of-Thought (Discrete Words)',
        comparison: 'Outputs explicit English words token-by-token.',
        tradeoff: 'Discrete CoT is human-interpretable, but is locked into depth-first greedy search and cannot maintain fuzzy superpositions.',
      },
      {
        name: 'Soft Prompting / Prefix Tuning',
        comparison: 'Learns static virtual prefix vectors prepended to input.',
        tradeoff: 'Soft prompts are static task embeddings; Coconut generates dynamic input-dependent reasoning paths.',
      },
    ],
    replicationGuide: {
      difficulty: 'Advanced',
      minHardware: 'Single RTX 3090/4090 (24GB VRAM) for 1B-3B model testing',
      libraries: ['transformers', 'torch', 'accelerate'],
      datasets: ['ProntoQA', 'GSM8K', 'Last Letter Concatenation'],
      reproducibilityRecipe: [
        'Take small base model: SmolLM-135M or Qwen-2.5-0.5B.',
        'Hook forward pass: if token is <thought>, set inputs_embeds directly to hidden_states[-1] of previous step.',
        'Backpropagate end-to-end cross-entropy loss on final answer through 4 latent thinking steps.',
        'Verify that loss converges without NaNs using LayerNorm on recurrent hidden vectors.',
      ],
      githubOrRepo: 'https://github.com/facebookresearch/coconut',
    },
    codeSnippet: {
      language: 'python',
      filename: 'coconut_latent_step.py',
      description: 'Continuous Latent Space Reasoning recurrence loop bypassing discrete vocabulary projection',
      code: `import torch
import torch.nn as nn

class CoconutReasoningLoop(nn.Module):
    def __init__(self, transformer_backbone, latent_norm: nn.LayerNorm):
        super().__init__()
        self.backbone = transformer_backbone
        self.latent_norm = latent_norm  # Prevents activation explosion

    def forward_latent_thinking(self, prompt_embeds: torch.Tensor, k_latent_steps: int = 4):
        """
        Executes k_latent_steps entirely in continuous vector space.
        Instead of sampling discrete tokens from lm_head,
        it feeds the final hidden state directly back as the next input embedding.
        """
        current_embeds = prompt_embeds
        
        for step in range(k_latent_steps):
            # Run forward pass through transformer layers
            outputs = self.backbone(inputs_embeds=current_embeds, output_hidden_states=True)
            last_hidden_state = outputs.hidden_states[-1][:, -1:, :]  # (Batch, 1, Hidden_Dim)
            
            # Normalize continuous thought vector to stabilize recurrent dynamics
            latent_thought_token = self.latent_norm(last_hidden_state)
            
            # Append continuous thought vector directly to inputs for next step
            current_embeds = torch.cat([current_embeds, latent_thought_token], dim=1)
            
        # Final answer is generated normally via discrete vocabulary projection
        final_logits = self.backbone.lm_head(last_hidden_state)
        return final_logits, current_embeds`,
    },
    interactiveToy: {
      type: 'generic_stepper',
      title: 'Discrete CoT vs Continuous Latent Superposition',
      description: 'Contrast traditional sequential English tokens with Coconut continuous vector embeddings. See how latent space preserves multiple parallel hypothesis branches.',
    },
  },
  {
    id: 'paper-21',
    number: 21,
    title: 'A Path Towards Autonomous Machine Intelligence',
    subtitle: 'JEPA: Joint Embedding Predictive Architecture',
    category: 'latent-world-models',
    arxivUrl: 'https://openreview.net/forum?id=BZ5a1r-kVsf',
    year: 2022,
    authors: 'LeCun',
    organization: 'Meta FAIR & NYU',
    tldr: 'Proposed non-generative Joint Embedding Predictive Architectures (JEPA) that predict representations in latent abstract space rather than predicting raw pixel or token details.',
    intuitiveExplanation:
      'Current generative models (like Stable Diffusion or auto-regressive LLMs) predict every single pixel or word. If a car drives past a tree in a video, a generative model spends enormous capacity predicting the exact shape of every swaying leaf. Yann LeCun argued that this is fundamentally wrong: humans ignore unpredictable irrelevant noise (like water ripples or rustling leaves) and form an abstract world model. JEPA does not predict pixels; it maps both past observations and future outcomes into an abstract latent embedding space and predicts the future representation. This enables true world modeling, commonsense physics, and hierarchical planning.',
    novelty: [
      'Philosophical and mathematical blueprint for Autonomous Machine Intelligence (AMI).',
      'Replaces generative pixel/token reconstruction with non-generative representation prediction.',
      'Eliminates the curse of dimensionality and sensitivity to irreproducible background noise.',
      'Hierarchical world model architecture featuring Configurator, Perception, World Model, Cost, Actor, and Short-Term Memory.',
    ],
    keyTechniques: [
      'Joint Embedding Predictive Architecture (x-encoder, y-encoder, predictor)',
      'Energy-Based Models (EBM) with latent variable z',
      'VICReg / Stop-gradient / EMA to prevent informational collapse',
      'Abstract Action-conditioned World Model rollouts',
    ],
    workflow: [
      {
        step: 1,
        title: 'Perception Encoding',
        description: 'Encode context observation x into abstract representation s_x using context encoder Enc_x.',
        mathFormula: 's_x = \\text{Enc}_x(x)',
      },
      {
        step: 2,
        title: 'Target Representation Encoding',
        description: 'Encode target outcome y into target representation s_y using target encoder Enc_y (updated via EMA).',
        mathFormula: 's_y = \\text{Enc}_y(y)',
      },
      {
        step: 3,
        title: 'Latent-Space Action Prediction',
        description: 'Given context s_x and hypothetical action a, predictor network predicts the future latent state s_pred.',
        mathFormula: 's_{\\text{pred}} = \\text{Pred}(s_x, a, z)',
      },
      {
        step: 4,
        title: 'Latent Distance Minimization',
        description: 'Minimize energy/distance D(s_pred, s_y) in representation space while maintaining non-collapse constraints.',
        mathFormula: '\\mathcal{L}_{\\text{JEPA}} = \\| s_{\\text{pred}} - s_y \\|_2^2 + \\lambda \\mathcal{L}_{\\text{reg}}',
      },
    ],
    architecture: {
      coreConcepts: [
        'Context Encoder, Target Encoder (Exponential Moving Average), and Latent Predictor',
        'No decoder or pixel reconstruction heads exist in the architecture',
        'Hierarchical JEPA (H-JEPA) for multi-timescale temporal planning',
      ],
      scalabilityMechanism:
        'Discards 99% of irrelevant perceptual entropy, allowing massive scaling on video and robotics without wasting FLOPs on high-frequency noise.',
      bottleneckSolved:
        'The inefficiency, hallucination, and superficial surface-level memorization of generative pixel and token autoregression.',
    },
    trainingDynamics: {
      optimizerAndSchedule: 'AdamW with cosine annealing; warm-up for 40 epochs.',
      lossFunction: 'L1 or Smooth L1 loss in latent space + variance/invariance regularization (VICReg).',
      computeAndHardware: 'Clusters of 64-512 NVIDIA A100 GPUs for V-JEPA / I-JEPA.',
      stabilityTricks: 'Stop-gradient on target encoder s_y and EMA updating to avoid catastrophic constant collapse.',
    },
    empiricalBenchmarks: [
      {
        benchmarkName: 'Video Action Understanding (Kinetics-400 Top-1)',
        paperScore: '82.0% (V-JEPA)',
        previousIterationScore: '78.5%',
        baselineName: 'Masked Autoencoder (MAE pixel reconstruction)',
        relativeGain: '+3.5% with 3x faster training',
        analysis: 'Learned superior physical representations in 1/3rd the training compute of pixel-predicting models.',
      },
      {
        benchmarkName: 'Downstream Transfer Efficiency',
        paperScore: '10x fewer downstream labels needed',
        previousIterationScore: 'Standard pre-training baseline',
        baselineName: 'Supervised ViT',
        relativeGain: '10x sample efficiency',
        analysis: 'Demonstrated rich conceptual abstraction transferable to diverse robotic and visual control tasks.',
      },
    ],
    alternatives: [
      {
        name: 'Masked Autoencoders (MAE / He et al.)',
        comparison: 'Masks image/video patches and reconstructs raw pixel values via a lightweight decoder.',
        tradeoff: 'MAE wastes capacity reconstructing minute pixel details; JEPA predicts semantics in feature space.',
      },
      {
        name: 'Autoregressive Video Transformers (Sora)',
        comparison: 'Generates every pixel/latent diffusion frame sequentially.',
        tradeoff: 'Generates visually appealing videos, but is computationally massive and cannot be easily used for fast internal planning.',
      },
    ],
    replicationGuide: {
      difficulty: 'Advanced',
      minHardware: '2x-4x RTX 4090 or A100 (24GB+ VRAM)',
      libraries: ['vjepa (Meta)', 'ijepa', 'torchvision', 'timm'],
      datasets: ['ImageNet-1K', 'Something-Something v2', 'Kinetics-400'],
      reproducibilityRecipe: [
        'Clone official Meta I-JEPA repository: git clone https://github.com/facebookresearch/ijepa.',
        'Instantiate Vision Transformer backbone for encoder and predictor.',
        'Implement target encoder with EMA: theta_target = 0.996 * theta_target + 0.004 * theta_context.',
        'Train on masked image patches with L1 loss in latent feature space.',
      ],
      githubOrRepo: 'https://github.com/facebookresearch/ijepa',
    },
    codeSnippet: {
      language: 'python',
      filename: 'jepa_representation_loss.py',
      description: 'Joint Embedding Predictive Architecture (I-JEPA) loss formulation with stop-gradient',
      code: `import torch
import torch.nn as nn
import torch.nn.functional as F

class JEPATrainer(nn.Module):
    def __init__(self, context_encoder, predictor, target_encoder, ema_decay: float = 0.996):
        super().__init__()
        self.context_encoder = context_encoder
        self.predictor = predictor
        self.target_encoder = target_encoder
        self.ema_decay = ema_decay
        
        # Target encoder does not receive direct backpropagation
        for p in self.target_encoder.parameters():
            p.requires_grad = False

    def forward(self, x_context, x_target, action_condition=None):
        # 1. Encode context through online encoder
        s_x = self.context_encoder(x_context)
        
        # 2. Predict future/target representation in latent space
        s_pred = self.predictor(s_x, action_condition)
        
        # 3. Compute target representation via frozen/EMA encoder (no grad)
        with torch.no_grad():
            s_y = self.target_encoder(x_target)
            
        # 4. Compute L1 distance in abstract representation space
        loss = F.l1_loss(s_pred, s_y)
        return loss

    def update_ema_target(self):
        """Exponential Moving Average update for target encoder"""
        with torch.no_grad():
            for p_ctx, p_tgt in zip(self.context_encoder.parameters(), self.target_encoder.parameters()):
                p_tgt.data = self.ema_decay * p_tgt.data + (1.0 - self.ema_decay) * p_ctx.data`,
    },
    interactiveToy: {
      type: 'generic_stepper',
      title: 'JEPA Non-Generative World Model Stepper',
      description: 'Observe how JEPA encodes noisy visual backgrounds into invariant semantic coordinates, predicting future trajectory states without wasting FLOPs on raw pixels.',
    },
  },
  {
    id: 'paper-22',
    number: 22,
    title: 'Learning to (Learn at Test Time): RNNs with Expressive Hidden States',
    subtitle: 'TTT: Test-Time Training Layers',
    category: 'latent-world-models',
    arxivUrl: 'https://arxiv.org/abs/2407.04620',
    year: 2024,
    authors: 'Sun, Zhang, Tao, Xu, Al-Rfou, Efros, Keutzer, Malik',
    organization: 'UC Berkeley, Stanford, UCSD, Meta',
    tldr: 'Replaced self-attention with Test-Time Training (TTT) layers where the hidden state is itself a machine learning model whose weights update at inference time via gradient descent.',
    intuitiveExplanation:
      'In a recurrent network (RNN), the hidden state is a fixed-size vector. As the sequence grows to thousands of tokens, trying to compress all past context into a static vector causes severe amnesia. Self-attention avoids this by keeping every past token in memory, but that causes the KV-cache to grow linearly O(N), becoming too slow. TTT introduces an ingenious solution: make the hidden state a mini-neural network! As the model reads new tokens at test time, it actually takes mini gradient descent steps on an unsupervised self-supervised loss to update the weights of this mini-network. This allows it to compress infinite context with constant O(1) inference time while matching or beating Transformer attention.',
    novelty: [
      'Replaced static hidden states in RNNs with dynamic weight matrices updated at test time via gradient descent.',
      'Derived an inner-loop self-supervised reconstruction objective that updates weights during the inference forward pass.',
      'Hardware-efficient dual form: linear time during training (parallel prefix scan) and constant memory O(1) during test-time serving.',
      'Outperformed Mamba and Transformer on long-context language modeling up to 32k tokens.',
    ],
    keyTechniques: [
      'Hidden state as model weights: W_t = W_{t-1} - eta * grad_W(loss)',
      'Inner-loop reconstruction task: self-supervised projection of token features',
      'TTT-Linear and TTT-MLP layer formulations',
      'Mini-batch parallel formulation for high GPU tensor core utilization',
    ],
    workflow: [
      {
        step: 1,
        title: 'Inner-Loop Self-Supervised Task',
        description: 'Define input token x_t and create self-supervised reconstruction target x_tilde using learnable projection matrices.',
      },
      {
        step: 2,
        title: 'Test-Time Gradient Descent Step',
        description: 'Update the inner hidden state weights W_t by taking a gradient step on the reconstruction error.',
        mathFormula: 'W_t = W_{t-1} - \\eta \\nabla_W \\ell(W_{t-1}; x_t)',
      },
      {
        step: 3,
        title: 'Forward Inference Prediction',
        description: 'Pass the current query token through the freshly updated weight matrix W_t to compute output representation y_t.',
        mathFormula: 'y_t = f(x_t; W_t)',
      },
      {
        step: 4,
        title: 'Outer-Loop Meta-Training',
        description: 'During pre-training, backpropagate through the entire sequence of inner gradient steps to optimize initialization W_0.',
      },
    ],
    architecture: {
      coreConcepts: [
        'TTT-Linear: inner model is a linear layer W in R^(d x d)',
        'TTT-MLP: inner model is a 2-layer MLP with nonlinear GeLU activations',
        'Hybrid backbone alternating TTT layers with standard feedforward blocks',
      ],
      scalabilityMechanism:
        'Memory footprint is strictly constant O(1) relative to context length, completely eliminating KV-cache memory explosions.',
      bottleneckSolved:
        'The memory wall of Transformer KV-caches and the capacity amnesia of linear attention / recurrent architectures.',
    },
    trainingDynamics: {
      optimizerAndSchedule: 'Outer loop: AdamW with cosine decay. Inner loop: SGD with learned step size eta.',
      lossFunction: 'Autoregressive language modeling cross-entropy outer loss.',
      computeAndHardware: 'Trained on clusters of NVIDIA A100 and H100 GPUs using custom Triton kernels.',
      stabilityTricks: 'LayerNorm and residual connections around inner model weight updates to bound eigenvalues.',
    },
    empiricalBenchmarks: [
      {
        benchmarkName: '32k Long-Context Perplexity',
        paperScore: 'Beats Transformer & Mamba',
        previousIterationScore: 'High perplexity degradation',
        baselineName: 'Mamba / Llama-3 (Standard Context)',
        relativeGain: 'Monotonic perplexity reduction',
        analysis: 'Test loss continued to decline smoothly as context extended to 32k tokens with zero KV-cache memory growth.',
      },
      {
        benchmarkName: 'Inference Memory Complexity',
        paperScore: 'O(1) Flat Constant',
        previousIterationScore: 'O(N) Linear Growth',
        baselineName: 'Transformer KV-Cache',
        relativeGain: 'Zero memory growth',
        analysis: 'Stored only the weight matrix W_t rather than accumulating megabytes of KV tokens.',
      },
    ],
    alternatives: [
      {
        name: 'Mamba (State Space Model / SSM)',
        comparison: 'Uses data-dependent selection matrix B, C and associative scan over fixed hidden state vector.',
        tradeoff: 'Mamba scales linearly in compute, but has less expressive expressivity than an inner neural network undergoing gradient updates.',
      },
      {
        name: 'Transformer KV-Cache with FlashAttention',
        comparison: 'Stores full history of Key and Value vectors.',
        tradeoff: 'Exact retrieval, but requires gigabytes of VRAM per request for long context windows.',
      },
    ],
    replicationGuide: {
      difficulty: 'Advanced',
      minHardware: 'Single RTX 4090 or A100 (24GB VRAM)',
      libraries: ['torch', 'triton', 'transformers'],
      datasets: ['Pile-10k', 'FineWeb-Edu', 'BookCorpus'],
      reproducibilityRecipe: [
        'Clone official Berkeley TTT-LM repository: git clone https://github.com/test-time-training/ttt-lm.',
        'Examine ttt_linear.py: inspect how inner gradient descent is unrolled using torch.autograd or custom Triton scan.',
        'Train 125M parameter TTT model on 10B tokens.',
        'Evaluate context extrapolation beyond training length.',
      ],
      githubOrRepo: 'https://github.com/test-time-training/ttt-lm',
    },
    codeSnippet: {
      language: 'python',
      filename: 'ttt_linear_layer.py',
      description: 'Test-Time Training (TTT-Linear) layer executing inner gradient update during forward pass',
      code: `import torch
import torch.nn as nn
import torch.nn.functional as F

class TTTLinear(nn.Module):
    """
    Test-Time Training Layer:
    Hidden state is a dynamic matrix W_t that updates at test-time
    via gradient descent on an inner self-supervised reconstruction task.
    """
    def __init__(self, d_model: int = 512, inner_lr: float = 0.1):
        super().__init__()
        self.d_model = d_model
        self.inner_lr = nn.Parameter(torch.tensor(inner_lr))
        # Initial state of the inner model weights
        self.W_0 = nn.Parameter(torch.eye(d_model))
        # Feature projections
        self.q_proj = nn.Linear(d_model, d_model, bias=False)
        self.k_proj = nn.Linear(d_model, d_model, bias=False)
        self.v_proj = nn.Linear(d_model, d_model, bias=False)

    def forward_step(self, x_t: torch.Tensor, W_prev: torch.Tensor):
        # x_t: (batch_size, d_model)
        Q = self.q_proj(x_t)
        K = self.k_proj(x_t)
        V = self.v_proj(x_t)

        # 1. Inner loss gradient: MSE(W * K, V)
        # Gradient with respect to W: (W * K - V) * K^T
        pred_V = torch.matmul(K, W_prev.t())
        error = pred_V - V
        grad_W = torch.matmul(error.t(), K)

        # 2. Test-time weight update via gradient descent
        W_t = W_prev - self.inner_lr * grad_W

        # 3. Output prediction using freshly updated weight state
        output = torch.matmul(Q, W_t.t())
        return output, W_t`,
    },
    interactiveToy: {
      type: 'generic_stepper',
      title: 'TTT Inner Gradient Descent Stepper',
      description: 'Step through sequential tokens. Observe how inner weight matrix W_t undergoes gradient descent updates on-the-fly, compressing memory into fixed matrix dimensions.',
    },
  },
];
