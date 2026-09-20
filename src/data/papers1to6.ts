import { Paper } from '../types';

export const PAPERS_1_TO_6: Paper[] = [
  {
    id: 'paper-1',
    number: 1,
    title: 'Attention Is All You Need',
    subtitle: 'The Transformer Architecture',
    category: 'architecture-scaling',
    arxivUrl: 'https://arxiv.org/abs/1706.03762',
    year: 2017,
    authors: 'Vaswani, Shazeer, Parmar, Uszkoreit, Jones, Gomez, Kaiser, Polosukhin',
    organization: 'Google Brain & Google Research',
    tldr: 'Eliminated recurrence and convolutions entirely in favor of multi-head self-attention, enabling massively parallel sequence processing.',
    intuitiveExplanation:
      'Before this paper, AI processed sentences one word after another using RNNs and LSTMs. If a sentence had 50 words, the computer had to compute step 1 before step 2, creating a sequential bottleneck and forgetting early words. The Transformer does away with sequential stepping entirely: it looks at every word in the sentence simultaneously. Every word broadcasts a Query ("what I need to understand myself"), a Key ("who I am and what I contain"), and a Value ("my informational payload"). The model computes dot-product similarities across all pairs at once, letting words like "bank" instantly focus on "river" or "money" regardless of distance.',
    novelty: [
      'Pure attention-based sequence-to-sequence model without any recurrence (RNN/LSTM) or convolution.',
      'Multi-Head Attention mechanism allowing tokens to attend jointly to information from distinct representation subspaces.',
      'Sinusoidal positional encodings providing spatial coordinate awareness across permutation-invariant attention matrices.',
      'O(1) sequential operation count for training, reducing path length between distant tokens to constant time.',
    ],
    keyTechniques: [
      'Scaled Dot-Product Attention (Softmax(QK^T / sqrt(d_k)) * V)',
      'Multi-Head Projections (h=8 heads, d_k=d_v=64)',
      'Pre-LN / Post-LN with Residual Additions and LayerNorm',
      'Causal masking for autoregressive decoder generation',
      'Sinusoid Position Embeddings',
    ],
    workflow: [
      {
        step: 1,
        title: 'Input Token & Positional Embedding',
        description: 'Discrete tokens are projected into continuous d_model=512 space and summed with sinusoidal position vectors.',
        mathFormula: 'PE_{(pos, 2i)} = \\sin(pos / 10000^{2i / d_{model}})',
      },
      {
        step: 2,
        title: 'Linear Q, K, V Projections',
        description: 'Input representations are linearly mapped into separate Query, Key, and Value matrices across h distinct heads.',
        mathFormula: 'Q = X W_Q, \\quad K = X W_K, \\quad V = X W_V',
      },
      {
        step: 3,
        title: 'Scaled Dot-Product Attention',
        description: 'Queries and Keys are multiplied to produce an alignment affinity matrix, scaled by 1/sqrt(d_k) to avoid softmax saturation, and masked.',
        mathFormula: '\\text{Attention}(Q, K, V) = \\text{softmax}\\left(\\frac{QK^T}{\\sqrt{d_k}}\\right)V',
      },
      {
        step: 4,
        title: 'Feed-Forward Network & Residual LayerNorm',
        description: 'Multi-head outputs are concatenated, projected linearly, added to the residual skip connection, and passed through a two-layer MLP with ReLU.',
        mathFormula: '\\text{FFN}(x) = \\max(0, x W_1 + b_1) W_2 + b_2',
      },
    ],
    architecture: {
      coreConcepts: [
        'Encoder-Decoder dual stack (6 encoder layers, 6 decoder layers)',
        'd_model = 512, d_ff = 2048, 8 attention heads per block',
        'Shared embedding weights between input/output and pre-softmax projection',
      ],
      scalabilityMechanism:
        'Replaced O(n) sequential forward passes with O(1) sequential depth, enabling complete hardware tensor saturation on GPUs/TPUs.',
      bottleneckSolved:
        'Vanishing gradients over long sequence horizons in LSTMs and the inability to parallelize training across sequence lengths.',
    },
    trainingDynamics: {
      optimizerAndSchedule:
        'Adam (beta_1=0.9, beta_2=0.98, eps=1e-9) with warm-up over 4,000 steps followed by inverse square root learning rate decay.',
      lossFunction: 'Label-smoothed cross-entropy loss (smoothing epsilon = 0.1) across target vocabulary tokens.',
      computeAndHardware: '8 x NVIDIA Tesla P100 GPUs trained for 3.5 days (Transformer-Big: 300,000 steps).',
      stabilityTricks: 'Residual connections around sub-layers with LayerNorm; 0.1 dropout applied to sums of embeddings and sub-layer outputs.',
    },
    empiricalBenchmarks: [
      {
        benchmarkName: 'WMT 2014 English-to-German (BLEU)',
        paperScore: '28.4 BLEU',
        previousIterationScore: '26.3 BLEU',
        baselineName: 'ByteNet / ConvS2S (Facebook)',
        relativeGain: '+2.1 BLEU',
        analysis: 'Set a new state of the art on WMT 2014 English-to-German by over 2 BLEU points while requiring a fraction of the training compute.',
      },
      {
        benchmarkName: 'WMT 2014 English-to-French (BLEU)',
        paperScore: '41.8 BLEU',
        previousIterationScore: '41.29 BLEU',
        baselineName: 'MoE Recurrent (Shazeer et al.)',
        relativeGain: '+0.51 BLEU',
        analysis: 'Achieved top BLEU score at 1/4th the training FLOPs compared to the previous best recurrent ensemble model.',
      },
    ],
    alternatives: [
      {
        name: 'LSTM with Bahdanau Attention',
        comparison: 'Processes tokens sequentially O(n); retains memory via hidden state vectors.',
        tradeoff: 'LSTMs require linear time to encode and degrade heavily on sequences > 100 tokens.',
      },
      {
        name: 'ByteNet / ConvS2S (Convolutional Seq2Seq)',
        comparison: 'Hierarchical 1D dilated convolutions with receptive field scaling logarithmically O(log n).',
        tradeoff: 'Parallelizable like Transformer, but path length between tokens is logarithmic rather than direct O(1).',
      },
    ],
    replicationGuide: {
      difficulty: 'Introductory',
      minHardware: 'Single NVIDIA T4 / RTX 3060 (12GB VRAM)',
      libraries: ['PyTorch >= 2.0', 'HuggingFace Transformers', 'tiktoken / tokenizers'],
      datasets: ['Multi30k', 'WMT 2014 En-De', 'Shakespeare (nanoGPT)'],
      reproducibilityRecipe: [
        'Initialize PyTorch nn.Module with nn.MultiheadAttention or manual QKV projections.',
        'Use pre-LayerNorm formulation (more stable than original post-LN).',
        'Implement scaled dot-product attention with torch.bmm or F.scaled_dot_product_attention.',
        'Train on synthetic copy task or small translation pair using AdamW with 500 warmup steps.',
      ],
      githubOrRepo: 'https://github.com/karpathy/nanoGPT',
    },
    codeSnippet: {
      language: 'python',
      filename: 'scaled_dot_product_attention.py',
      description: 'Core Scaled Dot-Product Self-Attention with multi-head tensor operations and causal masking',
      code: `import torch
import torch.nn as nn
import torch.nn.functional as F
import math

class MultiHeadSelfAttention(nn.Module):
    def __init__(self, d_model: int = 512, n_heads: int = 8, dropout: float = 0.1):
        super().__init__()
        assert d_model % n_heads == 0, "d_model must be divisible by n_heads"
        self.d_model = d_model
        self.n_heads = n_heads
        self.d_k = d_model // n_heads

        # Linear projections for Query, Key, Value and Output
        self.q_proj = nn.Linear(d_model, d_model, bias=False)
        self.k_proj = nn.Linear(d_model, d_model, bias=False)
        self.v_proj = nn.Linear(d_model, d_model, bias=False)
        self.out_proj = nn.Linear(d_model, d_model, bias=False)
        self.dropout = nn.Dropout(dropout)

    def forward(self, x: torch.Tensor, mask: torch.Tensor = None) -> torch.Tensor:
        B, S, D = x.shape  # Batch, Sequence, d_model

        # 1. Project and reshape into (B, n_heads, S, d_k)
        Q = self.q_proj(x).view(B, S, self.n_heads, self.d_k).transpose(1, 2)
        K = self.k_proj(x).view(B, S, self.n_heads, self.d_k).transpose(1, 2)
        V = self.v_proj(x).view(B, S, self.n_heads, self.d_k).transpose(1, 2)

        # 2. Scaled dot-product: (B, H, S, S)
        scores = torch.matmul(Q, K.transpose(-2, -1)) / math.sqrt(self.d_k)

        if mask is not None:
            scores = scores.masked_fill(mask == 0, float('-inf'))

        # 3. Softmax alignment and dropout
        attn_weights = F.softmax(scores, dim=-1)
        attn_weights = self.dropout(attn_weights)

        # 4. Context weighted sum: (B, H, S, d_k)
        context = torch.matmul(attn_weights, V)

        # 5. Concatenate heads and project out: (B, S, D)
        context = context.transpose(1, 2).contiguous().view(B, S, D)
        return self.out_proj(context)`,
    },
    interactiveToy: {
      type: 'attention_matrix',
      title: 'Attention Matrix & Temperature Explorer',
      description: 'Interact with token Query/Key affinities, tweak softmax temperature scaling (1/sqrt(d_k)), and observe attention weight redistribution.',
    },
  },
  {
    id: 'paper-2',
    number: 2,
    title: 'BERT: Pre-training of Deep Bidirectional Transformers',
    subtitle: 'Bidirectional Language Representations',
    category: 'architecture-scaling',
    arxivUrl: 'https://arxiv.org/abs/1810.04805',
    year: 2018,
    authors: 'Devlin, Chang, Lee, Toutanova',
    organization: 'Google AI Language',
    tldr: 'Introduced Masked Language Modeling (MLM) and Next Sentence Prediction (NSP), creating deeply bidirectional language representations.',
    intuitiveExplanation:
      'Standard language models read from left to right, predicting what word comes next. But human understanding is holistic: in "the bank was muddy after the rain", knowing "muddy" and "rain" informs what "bank" means as much as "the" does. Standard transformers could not look both directions during training because the target word would see itself ("cheat"). BERT solved this with Cloze style masking: blank out 15% of the words randomly with [MASK] and force the Transformer encoder to guess them using context from both left and right simultaneously.',
    novelty: [
      'First deeply bidirectional contextual representation model using Transformer encoder.',
      'Masked Language Modeling (MLM) objective preventing identity leakage in bidirectional attention.',
      'Next Sentence Prediction (NSP) auxiliary objective aiding sentence pair reasoning (MNLI, QQP).',
      'Unified fine-tuning paradigm: same pre-trained weights fine-tuned with single output layer across 11 distinct tasks.',
    ],
    keyTechniques: [
      'Masked Language Model (MLM): 80% [MASK], 10% random token, 10% unchanged',
      'Next Sentence Prediction (NSP) binary classification',
      'WordPiece Tokenization (30,000 vocab)',
      'Segment embeddings to distinguish sentence A from sentence B',
      'GELU activation function in Feed-Forward layers',
    ],
    workflow: [
      {
        step: 1,
        title: 'Input Construction & Segment Packing',
        description: 'Pack pair of sentences [CLS] Sentence A [SEP] Sentence B [SEP], adding token, segment, and positional embeddings.',
        mathFormula: 'E = E_{\\text{token}} + E_{\\text{segment}} + E_{\\text{position}}',
      },
      {
        step: 2,
        title: 'Random 15% Cloze Masking',
        description: '15% of token positions are chosen: 80% replaced with [MASK], 10% with random word, 10% kept untouched.',
      },
      {
        step: 3,
        title: 'Deep Bidirectional Self-Attention',
        description: 'Full unmasked self-attention across all positions allows every layer to integrate left and right contextual signals.',
      },
      {
        step: 4,
        title: 'Dual-Head Pre-training Loss',
        description: 'Jointly optimize cross-entropy loss on masked token predictions and binary classification for NSP on [CLS].',
        mathFormula: '\\mathcal{L}_{\\text{BERT}} = \\mathcal{L}_{\\text{MLM}}(\\text{masked tokens}) + \\mathcal{L}_{\\text{NSP}}(\\text{is\\_next})',
      },
    ],
    architecture: {
      coreConcepts: [
        'BERT-Base: L=12, H=768, A=12 (110M params); BERT-Large: L=24, H=1024, A=16 (340M params)',
        'Encoder-only architecture; no causal masking in attention matrices',
        '[CLS] token output serves as aggregated sentence representation',
      ],
      scalabilityMechanism:
        'Scales pre-training on 3.3 billion tokens of unlabelled BookCorpus + Wikipedia to power downstream tasks without custom architectures.',
      bottleneckSolved:
        'Uni-directional constraints in GPT-1 and shallow feature concatenation in ELMo.',
    },
    trainingDynamics: {
      optimizerAndSchedule: 'AdamW (lr=1e-4, warmup=10,000 steps, linear decay) with batch size 256 (128k tokens/batch).',
      lossFunction: 'Cross-entropy over MLM predictions + Binary Cross-Entropy on [CLS] NSP head.',
      computeAndHardware: 'BERT-Base: 4 Cloud TPU v2 chips (16 TPU chips); BERT-Large: 16 Cloud TPU v3 chips for 4 days.',
      stabilityTricks: 'Weight decay of 0.01, dropout 0.1, gradient clipping at norm 1.0.',
    },
    empiricalBenchmarks: [
      {
        benchmarkName: 'GLUE Benchmark Average',
        paperScore: '80.5 (Large)',
        previousIterationScore: '72.8',
        baselineName: 'OpenAI GPT-1',
        relativeGain: '+7.7 points',
        analysis: 'Swept all 9 GLUE benchmark tasks by dramatic margins, establishing the standard for NLP transfer learning.',
      },
      {
        benchmarkName: 'SQuAD v1.1 Reading Comprehension F1',
        paperScore: '93.2 F1',
        previousIterationScore: '91.6 F1',
        baselineName: 'Ensemble Human Baseline (86.8) / BiDAF',
        relativeGain: '+1.6 F1 over human',
        analysis: 'First model to outperform human performance on both SQuAD v1.1 and SQuAD v2.0 benchmarks.',
      },
    ],
    alternatives: [
      {
        name: 'OpenAI GPT-1 (Autoregressive)',
        comparison: 'Left-to-right causal transformer; generates tokens sequentially.',
        tradeoff: 'GPT-1 can generate text naturally, but suffers on sentence classification and comprehension due to one-way attention.',
      },
      {
        name: 'ELMo (BiLSTM Embeddings)',
        comparison: 'Concatenates independently trained left-to-right and right-to-left LSTMs.',
        tradeoff: 'Shallow concatenation lacks joint interaction across cross-layer bidirectional attention.',
      },
    ],
    replicationGuide: {
      difficulty: 'Intermediate',
      minHardware: '1x NVIDIA A10G (24GB VRAM) for fine-tuning; 4x A100 for small pre-training',
      libraries: ['transformers', 'datasets', 'accelerate', 'torch'],
      datasets: ['Wikitext-103', 'BookCorpus', 'GLUE (MRPC, SST-2, QNLI)'],
      reproducibilityRecipe: [
        'Load bert-base-uncased from HuggingFace Transformers.',
        'Use AutoModelForSequenceClassification with BertConfig.',
        'Fine-tune on SST-2 sentiment with lr=2e-5, AdamW, batch_size=32 for 3 epochs.',
        'Expect >92% validation accuracy in under 10 minutes.',
      ],
      githubOrRepo: 'https://github.com/google-research/bert',
    },
    codeSnippet: {
      language: 'python',
      filename: 'masked_language_model_loss.py',
      description: 'Dynamic MLM token corruption and cross-entropy loss computation',
      code: `import torch
import torch.nn as nn
import torch.nn.functional as F

def mask_tokens(inputs: torch.Tensor, tokenizer, mlm_probability: float = 0.15):
    """Corrupt 15% of tokens following BERT 80/10/10 rule"""
    labels = inputs.clone()
    # Probability matrix for selection
    prob_matrix = torch.full(labels.shape, mlm_probability)
    # Never mask special tokens (pad, cls, sep)
    special_tokens_mask = tokenizer.get_special_tokens_mask(labels.tolist())
    prob_matrix.masked_fill_(torch.tensor(special_tokens_mask, dtype=torch.bool), value=0.0)
    
    masked_indices = torch.bernoulli(prob_matrix).bool()
    labels[~masked_indices] = -100  # PyTorch ignore index for cross-entropy

    # 80% of selected tokens -> [MASK] token
    indices_replaced = torch.bernoulli(torch.full(labels.shape, 0.8)).bool() & masked_indices
    inputs[indices_replaced] = tokenizer.mask_token_id

    # 10% of selected tokens -> random token
    indices_random = torch.bernoulli(torch.full(labels.shape, 0.5)).bool() & masked_indices & ~indices_replaced
    random_words = torch.randint(len(tokenizer), labels.shape, dtype=torch.long)
    inputs[indices_random] = random_words[indices_random]

    # Remaining 10% kept untouched
    return inputs, labels`,
    },
    interactiveToy: {
      type: 'generic_stepper',
      title: 'BERT 80/10/10 MLM Corruption Simulator',
      description: 'Observe how a sentence is randomly masked, replaced with random tokens, or preserved while calculating the cross-entropy gradient target.',
    },
  },
  {
    id: 'paper-3',
    number: 3,
    title: 'Scaling Laws for Neural Language Models',
    subtitle: 'Empirical Compute Power Laws',
    category: 'architecture-scaling',
    arxivUrl: 'https://arxiv.org/abs/2001.08361',
    year: 2020,
    authors: 'Kaplan, McCandlish, Henighan, Brown, Chess, Child, Gray, Radford, Wu, Amodei',
    organization: 'OpenAI',
    tldr: 'Discovered that language model performance scales as a predictable power law with parameters, dataset size, and compute across >6 orders of magnitude.',
    intuitiveExplanation:
      'Instead of guessing whether a bigger model will work, Kaplan et al. performed hundreds of controlled experiments to find the physical laws of AI. They proved that test loss follows smooth power laws L(N), L(D), L(C) = (N_c / N)^alpha. Crucially, architectural hyper-parameters (such as model depth vs. width, or number of attention heads) barely matter within reasonable bounds—what matters overwhelmingly is raw scale: Parameters (N), Dataset tokens (D), and Total Training Compute (C). Larger models are also drastically more sample-efficient, requiring fewer steps to hit a target loss.',
    novelty: [
      'Empirical discovery of smooth power-law scaling spanning 6+ orders of magnitude in compute.',
      'Demonstrated that architectural details (depth, aspect ratio, head count) have minimal impact compared to scale.',
      'Showed that larger models are fundamentally more sample-efficient than smaller models trained longer.',
      'Established the original compute allocation recommendation: scaling parameters N faster than tokens D (N ~ C^0.73, D ~ C^0.27).',
    ],
    keyTechniques: [
      'Power law fitting: L(N) = (N_c / N)^{alpha_N}',
      'Compute modeling: C approx 6 * N * D FLOPs',
      'Controlled ablation over depth, width, feed-forward ratio, and context window',
      'Critical batch size quantification to identify limits of data parallelism',
    ],
    workflow: [
      {
        step: 1,
        title: 'Controlled Grid Scaling',
        description: 'Train models from 10^3 to 10^9 parameters across varying training token budgets from 10^7 to 10^10 tokens.',
      },
      {
        step: 2,
        title: 'Compute Budget FLOP Accounting',
        description: 'Account for forward/backward pass compute using C = 6ND floating-point operations.',
        mathFormula: 'C \\approx 6 N D',
      },
      {
        step: 3,
        title: 'Power-Law Regression Fitting',
        description: 'Fit cross-entropy loss against isolated variables: parameter count N, dataset size D, and training compute C.',
        mathFormula: 'L(N) = \\left(\\frac{N_c}{N}\\right)^{\\alpha_N}, \\quad \\alpha_N \\approx 0.076',
      },
      {
        step: 4,
        title: 'Optimal Frontier Extrapolation',
        description: 'Derive Pareto-optimal model size and data allocation given fixed compute envelopes.',
      },
    ],
    architecture: {
      coreConcepts: [
        'Decoder-only autoregressive transformers tested across 10^3 to 10^9 parameter regimes',
        'Demonstrated that aspect ratio (depth/width) exhibits wide plateaus of near-identical performance',
        'Performance depends weakly on number of attention heads',
      ],
      scalabilityMechanism:
        'Allowed AI organizations to spend modest compute testing small models to extrapolate performance of billion-parameter models before allocating millions of dollars.',
      bottleneckSolved:
        'Trial-and-error hyperparameter tuning and unguided architectural guesswork for large-scale pre-training.',
    },
    trainingDynamics: {
      optimizerAndSchedule: 'Adam with cosine decay; learning rate scaled down inversely with model size (lr ~ N^{-0.14}).',
      lossFunction: 'Autoregressive cross-entropy loss on WebText.',
      computeAndHardware: 'Hundreds of GPU days across NVIDIA V100 clusters running scaling sweeps.',
      stabilityTricks: 'Tracking critical batch size B_crit = B* / (L - L_inf)^alpha to avoid gradient noise saturation.',
    },
    empiricalBenchmarks: [
      {
        benchmarkName: 'Loss vs Compute Power Law Fit (R^2)',
        paperScore: 'R^2 > 0.99',
        previousIterationScore: 'Heuristic estimates',
        baselineName: 'Uncalibrated scaling',
        relativeGain: 'Perfect extrapolation',
        analysis: 'Predicted GPT-3 175B performance within 1% error before it was ever trained.',
      },
      {
        benchmarkName: 'Sample Efficiency of 10x Larger Model',
        paperScore: '3x fewer steps',
        previousIterationScore: '1x baseline',
        baselineName: 'Small model prolonged training',
        relativeGain: '300% efficiency',
        analysis: 'Larger models achieve identical test cross-entropy in significantly fewer optimization steps.',
      },
    ],
    alternatives: [
      {
        name: 'Chinchilla Scaling Laws (Hoffmann et al. 2022)',
        comparison: 'Refined Kaplan scaling by showing N and D should scale equally (1:1) rather than favoring parameters 3:1.',
        tradeoff: 'Kaplan over-allocated compute to model size N at the expense of under-training on tokens D.',
      },
      {
        name: 'Llama Over-Training Paradigm',
        comparison: 'Trains smaller models on 10x-20x more tokens than compute-optimal for cheaper downstream inference.',
        tradeoff: 'Costs more compute during pre-training, but drastically lowers per-token inference latency.',
      },
    ],
    replicationGuide: {
      difficulty: 'Intermediate',
      minHardware: '1x-2x RTX 4090 or A100 (24GB+)',
      libraries: ['PyTorch', 'scipy (curve_fit)', 'matplotlib', 'transformers'],
      datasets: ['TinyStories', 'OpenWebText', 'FineWeb-Edu sample'],
      reproducibilityRecipe: [
        'Instantiate 5 small decoder models (1M, 5M, 15M, 40M, 100M params).',
        'Train all models on identical token distribution for exactly equal step counts.',
        'Log evaluation cross-entropy loss at convergence.',
        'Use scipy.optimize.curve_fit to fit power law y = a * x^(-b) + c in log-log space.',
      ],
      githubOrRepo: 'https://github.com/karpathy/nanoGPT',
    },
    codeSnippet: {
      language: 'python',
      filename: 'power_law_fit.py',
      description: 'Fitting Kaplan power law equation L(N) = (N_c / N)^alpha + L_inf to empirical loss points',
      code: `import numpy as np
from scipy.optimize import curve_fit

# Empirical test loss vs parameter count (Kaplan et al. style)
parameters = np.array([1e6, 5e6, 2e7, 8e7, 3e8, 1e9])  # Model size N
empirical_loss = np.array([3.82, 3.41, 3.05, 2.76, 2.52, 2.31])

def kaplan_power_law(N, N_c, alpha, L_inf):
    """L(N) = (N_c / N)^alpha + L_inf"""
    return (N_c / N)**alpha + L_inf

# Initial guesses
p0 = [1e4, 0.08, 1.8]
bounds = ([1.0, 0.01, 0.5], [1e8, 0.5, 3.0])

popt, pcov = curve_fit(kaplan_power_law, parameters, empirical_loss, p0=p0, bounds=bounds)
N_c_fit, alpha_fit, L_inf_fit = popt

print(f"Fitted Kaplan Scaling: N_c={N_c_fit:.2e}, alpha={alpha_fit:.4f}, L_inf={L_inf_fit:.3f}")
# Predict loss for 175B model:
N_gpt3 = 1.75e11
predicted_loss = kaplan_power_law(N_gpt3, *popt)
print(f"Predicted loss for 175B model: {predicted_loss:.3f}")`,
    },
    interactiveToy: {
      type: 'scaling_curve',
      title: 'Interactive Compute & Parameter Scaling Simulator',
      description: 'Slide Parameter Count (N) and Dataset Tokens (D) to watch theoretical cross-entropy loss and FLOP consumption update on the empirical frontier.',
    },
  },
  {
    id: 'paper-4',
    number: 4,
    title: 'GPT-3: Language Models are Few-Shot Learners',
    subtitle: 'In-Context Learning at Scale',
    category: 'architecture-scaling',
    arxivUrl: 'https://arxiv.org/abs/2005.14165',
    year: 2020,
    authors: 'Brown, Mann, Ryder, Subbiah, Kaplan, Dhariwal, Neelakantan, Pradhan, Amodei et al.',
    organization: 'OpenAI',
    tldr: 'Scaled autoregressive transformers to 175 billion parameters, demonstrating that large language models perform few-shot in-context learning without fine-tuning.',
    intuitiveExplanation:
      'Before GPT-3, using AI for a new task required gathering thousands of labeled examples and fine-tuning the model weights via backpropagation. GPT-3 showed that when an autoregressive model becomes big enough (175 billion parameters), you do not need to update its weights at all. You can simply provide 2 or 3 examples in plain English inside the prompt ("in-context learning"), and the model infers the task rule dynamically during the forward pass.',
    novelty: [
      'Discovered emergent few-shot in-context learning (ICL) without updating any model weights.',
      'Scaled dense autoregressive transformer to 175 billion parameters (GPT-3 175B).',
      'Demonstrated human-level zero-shot and one-shot text generation, translation, arithmetic, and code synthesis.',
      'Proved that task versatility scales continuously with parameter capacity without task-specific engineering.',
    ],
    keyTechniques: [
      'Dense Decoder-only Transformer with alternating dense and locally banded sparse attention patterns',
      'Common Crawl filtering pipeline with classifier-guided quality filtering and de-duplication',
      'Model Parallelism (megatron-style tensor slicing across 8 GPUs per node)',
      'Prompt formatting: System instruction + few-shot exemplar prefixes',
    ],
    workflow: [
      {
        step: 1,
        title: 'Large-Scale Web Dataset Filtering',
        description: 'Cleaned 45TB of Common Crawl down to 570GB high-quality tokens using high-recall classifier and MinHash LSH deduplication.',
      },
      {
        step: 2,
        title: 'Massive Distributed Pre-training',
        description: 'Trained across 96 layers, 96 attention heads, d_model=12,288 with 3.2M token batch sizes.',
        mathFormula: 'P(w_t \\mid w_1, \\dots, w_{t-1}) = \\text{softmax}(W_v h_t)',
      },
      {
        step: 3,
        title: 'Zero-Shot / Few-Shot In-Context Prompting',
        description: 'At inference time, format prompt with k demonstrations; compute next-token probabilities without gradient updates.',
      },
    ],
    architecture: {
      coreConcepts: [
        '96 Transformer layers, hidden dimension 12,288, 96 attention heads (d_head = 128)',
        'Context window: 2,048 tokens',
        'Alternating dense and locally banded sparse attention patterns (similar to Sparse Transformer)',
      ],
      scalabilityMechanism:
        'Combined intra-node tensor model parallelism with inter-node data parallelism across clusters of V100 GPUs.',
      bottleneckSolved:
        'Need for expensive task-specific dataset annotation and brittle fine-tuning runs for every downstream application.',
    },
    trainingDynamics: {
      optimizerAndSchedule:
        'Adam (beta_1=0.9, beta_2=0.95, eps=1e-8) with cosine learning rate decay down to 10% over 260B tokens; gradient clip at 1.0.',
      lossFunction: 'Autoregressive cross-entropy loss over 300 billion tokens.',
      computeAndHardware: 'Thousands of NVIDIA V100 GPUs trained over several months (estimated ~3.14 x 10^23 FLOPs).',
      stabilityTricks: 'Dynamic batch size scaling up from 32k tokens to 3.2M tokens over the first 12 billion tokens.',
    },
    empiricalBenchmarks: [
      {
        benchmarkName: 'SuperGLUE (Few-Shot Benchmark)',
        paperScore: '71.8',
        previousIterationScore: '53.4 (GPT-2 Few-Shot)',
        baselineName: 'GPT-2 1.5B',
        relativeGain: '+18.4 points',
        analysis: 'Matched fine-tuned BERT-Large purely through in-context few-shot prompting with zero gradient steps.',
      },
      {
        benchmarkName: 'LAMBADA (Language Modeling Next-Word)',
        paperScore: '86.4% Accuracy',
        previousIterationScore: '68.0%',
        baselineName: 'Turing-NLG 17B',
        relativeGain: '+18.4%',
        analysis: 'Achieved near-human performance on long-range contextual word prediction in zero-shot mode.',
      },
    ],
    alternatives: [
      {
        name: 'T5 / FLAN (Fine-Tuned Instruction Tuning)',
        comparison: 'Explicitly trains models on thousands of labeled task prompts via supervised multi-task learning.',
        tradeoff: 'T5 requires labeled instruction datasets; GPT-3 demonstrated few-shot ability purely from raw web pre-training.',
      },
      {
        name: 'Fine-Tuned Specialized BERT',
        comparison: 'Task-specific heads fine-tuned on thousands of labeled samples.',
        tradeoff: 'BERT fine-tuned achieves high accuracy on narrow distribution, but lacks generality across unexpected prompts.',
      },
    ],
    replicationGuide: {
      difficulty: 'Advanced',
      minHardware: '4x NVIDIA A100 (80GB) for inference (quantized 4-bit runs on 1x RTX 3090/4090)',
      libraries: ['vLLM', 'transformers', 'vLLM', 'deepspeed', 'torch'],
      datasets: ['OpenWebText2', 'SlimPajama', 'RefinedWeb'],
      reproducibilityRecipe: [
        'Modern open-source equivalents: LLaMA-3 8B or 70B, Mistral 7B, or Qwen-2.5.',
        'Load model via HuggingFace or Ollama: model = AutoModelForCausalLM.from_pretrained(...)',
        'Provide 3 structured QA exemplars in prompt: "Q: ... A: ... \\n Q: ... A: ..."',
        'Observe consistent few-shot format adherence with temperature=0.0.',
      ],
      githubOrRepo: 'https://github.com/openai/gpt-3',
    },
    codeSnippet: {
      language: 'python',
      filename: 'in_context_few_shot_prompting.py',
      description: 'Autoregressive greedy generation and in-context learning evaluation harness',
      code: `import torch
from transformers import AutoTokenizer, AutoModelForCausalLM

def evaluate_few_shot(model_name: str = "gpt2-xl"):
    tokenizer = AutoTokenizer.from_pretrained(model_name)
    model = AutoModelForCausalLM.from_pretrained(model_name, torch_dtype=torch.float16, device_map="auto")
    
    # In-context exemplars (task: translate English jargon to simple definition)
    prompt = """Task: Translate technical acronyms into plain English descriptions.
Input: GPU
Output: A processor designed for parallel rendering and matrix computations.

Input: LLM
Output: A neural network trained on massive text data to predict upcoming tokens.

Input: Backpropagation
Output:"""

    inputs = tokenizer(prompt, return_tensors="pt").to(model.device)
    
    with torch.no_grad():
        outputs = model.generate(
            **inputs,
            max_new_tokens=25,
            temperature=0.0,  # Greedy argmax sampling
            pad_token_id=tokenizer.eos_token_id,
            do_sample=False
        )
        
    completion = tokenizer.decode(outputs[0][inputs.input_ids.shape[1]:], skip_special_tokens=True)
    print("Zero-gradient ICL Prediction:", completion.strip().split("\\n")[0])`,
    },
    interactiveToy: {
      type: 'generic_stepper',
      title: 'In-Context Exemplar Impact Stepper',
      description: 'Step through 0-shot, 1-shot, and 5-shot prompt construction to inspect how attention heads bind exemplar input-output patterns.',
    },
  },
  {
    id: 'paper-5',
    number: 5,
    title: 'Chinchilla: Training Compute-Optimal Large Language Models',
    subtitle: 'Data-Optimal Scaling Laws',
    category: 'architecture-scaling',
    arxivUrl: 'https://arxiv.org/abs/2203.15556',
    year: 2022,
    authors: 'Hoffmann, Borgeaud, Mensch, Buchatskaya, Cai, Rutherford, Casas, Hendricks, Welbl et al.',
    organization: 'DeepMind',
    tldr: 'Proved that existing LLMs were severely undertrained; optimal performance requires scaling model parameters and training tokens in equal 1:1 proportion.',
    intuitiveExplanation:
      'Kaplan scaling had convinced the AI community that to build a better model, you should make it huge (e.g. 175B, 280B, 530B) and train on ~300B tokens. DeepMind audited this with over 400 models and proved the earlier law was mathematically flawed. For optimal compute efficiency, model parameters and dataset tokens must grow in equal 1:1 lockstep: a model twice as big needs twice as many tokens. DeepMind built Chinchilla (70B parameters) trained on 1.4 trillion tokens with the exact same compute budget as Gopher (280B parameters). Chinchilla decisively outperformed Gopher and GPT-3 while being 4x smaller and 4x cheaper to run.',
    novelty: [
      'Proved that for compute-optimal training, parameters and tokens must be scaled in equal proportion (a ~ 0.5, b ~ 0.5).',
      'Demonstrated that all existing landmark models (GPT-3 175B, Gopher 280B, Megatron-Turing 530B) were significantly undertrained.',
      'Showed that a 70B model trained on 1.4T tokens beats 280B models trained on 300B tokens across MMLU, BIG-bench, and QA.',
      'Dramatically altered the industry paradigm toward training smaller, denser models on massive token corpora.',
    ],
    keyTechniques: [
      'Tri-method empirical fitting: Minimum loss envelopes, IsoFLOP slices, and Parametric loss modeling',
      'Loss equation: L(N, D) = E + A / N^alpha + B / D^beta with alpha approx 0.34 and beta approx 0.28',
      'FLOP budget: C = 6 * N * D',
      'Massive deduplicated training corpus: MassiveText (1.4T tokens)',
    ],
    workflow: [
      {
        step: 1,
        title: 'IsoFLOP Slice Formulation',
        description: 'Vary model size across fixed compute budgets (e.g., 10^18 to 10^21 FLOPs) and identify the parameter count minimizing validation loss.',
        mathFormula: 'L(N, D) = E + \\frac{A}{N^\\alpha} + \\frac{B}{D^\\beta}',
      },
      {
        step: 2,
        title: 'Analytical Power-Law Derivation',
        description: 'Solve constrained optimization of L(N, D) subject to C = 6ND using Lagrange multipliers, finding N_opt ~ C^a and D_opt ~ C^b.',
        mathFormula: 'a = \\frac{\\beta}{\\alpha + \\beta} \\approx 0.50, \\quad b = \\frac{\\alpha}{\\alpha + \\beta} \\approx 0.50',
      },
      {
        step: 3,
        title: 'Chinchilla 70B Execution',
        description: 'Allocate the exact 280B Gopher compute budget into a 70B model trained on 1.4 Trillion tokens (4x data, 1/4 size).',
      },
    ],
    architecture: {
      coreConcepts: [
        '70-layer Transformer decoder, hidden dimension 8,192, 64 attention heads',
        'Context length: 2,048 tokens',
        'RMSNorm and GeLU activations with rotary or standard position embeddings',
      ],
      scalabilityMechanism:
        'Decoupled inference efficiency from training compute: smaller optimal models reduce inference VRAM footprint and latency by 75%.',
      bottleneckSolved:
        'Massive parameter bloat, excessive serving costs, and severe token starvation in 2020-2021 LLMs.',
    },
    trainingDynamics: {
      optimizerAndSchedule:
        'AdamW with cosine learning rate schedule decaying to 10% peak value over 1.4 Trillion tokens.',
      lossFunction: 'Autoregressive cross-entropy loss on MassiveText.',
      computeAndHardware: 'Same FLOP budget as Gopher 280B (~5.76 x 10^23 FLOPs on TPU v3/v4 pods).',
      stabilityTricks: 'Clipping gradients to 1.0; using lower peak learning rate (1e-4) to ensure late-stage cosine convergence.',
    },
    empiricalBenchmarks: [
      {
        benchmarkName: 'MMLU (Massive Multitask Language Understanding)',
        paperScore: '67.5% (Chinchilla 70B)',
        previousIterationScore: '60.0% (Gopher 280B) / 53.9% (GPT-3 175B)',
        baselineName: 'Gopher 280B',
        relativeGain: '+7.5%',
        analysis: 'Beat the 4x larger 280B Gopher model across 57 humanities, STEM, and social science subjects.',
      },
      {
        benchmarkName: 'BIG-bench Hard Suite',
        paperScore: '65.1%',
        previousIterationScore: '59.5%',
        baselineName: 'Gopher 280B',
        relativeGain: '+5.6%',
        analysis: 'Outperformed Gopher on 62% of all BIG-bench tasks while requiring 1/4 the memory during inference.',
      },
    ],
    alternatives: [
      {
        name: 'Kaplan OpenAI Scaling Law',
        comparison: 'Advocated scaling parameters ~3x faster than tokens (N ~ C^0.73, D ~ C^0.27).',
        tradeoff: 'Produced models that were bloated in parameters but undercooked on tokens (e.g. MT-NLG 530B on only 270B tokens).',
      },
      {
        name: 'Meta LLaMA Scaling (Touvron et al.)',
        comparison: 'Pushed past Chinchilla optimality by training 7B and 13B models on 1.0T - 2.0T tokens (sub-optimal for training FLOPs, optimal for inference).',
        tradeoff: 'Higher upfront training cost, but drastically faster and cheaper inference across millions of end-user queries.',
      },
    ],
    replicationGuide: {
      difficulty: 'Intermediate',
      minHardware: '2x-4x RTX 4090 (24GB) or cloud 4x A100',
      libraries: ['megatron-lm', 'torchtitan', 'axolotl', 'nanotron'],
      datasets: ['FineWeb-Edu', 'RedPajama-V2', 'Dolma'],
      reproducibilityRecipe: [
        'Given compute budget C (e.g. 10^20 FLOPs), calculate N_opt = sqrt(C / (6 * (beta/alpha))) and D_opt = C / (6 * N_opt).',
        'For 1B model, compute-optimal training tokens = ~20 billion tokens.',
        'Run cosine learning rate schedule matched exactly to total token count (do not stop early).',
        'Compare against 3B model trained on only 7B tokens with same total FLOPs.',
      ],
      githubOrRepo: 'https://github.com/google-deepmind/chinchilla',
    },
    codeSnippet: {
      language: 'python',
      filename: 'chinchilla_optimal_budget.py',
      description: 'Compute Chinchilla-optimal parameters N and tokens D given target FLOP compute budget',
      code: `import math

def chinchilla_optimal_allocation(total_flops: float):
    """
    Given total FLOP budget C = 6 * N * D,
    computes optimal model parameters N_opt and training tokens D_opt.
    Coefficients from Hoffmann et al. 2022 (Table 2):
    N_opt = G * (C / 6)^a, where a approx 0.49
    D_opt = G^-1 * (C / 6)^b, where b approx 0.51
    """
    a = 0.49
    b = 0.51
    # Normalized scaling coefficients
    G = 0.59
    
    C_norm = total_flops / 6.0
    N_opt = G * (C_norm ** a)
    D_opt = (1.0 / G) * (C_norm ** b)
    
    actual_flops = 6 * N_opt * D_opt
    tokens_per_param = D_opt / N_opt
    
    return {
        "Total_FLOPs": total_flops,
        "Optimal_Params_N": f"{N_opt / 1e9:.2f} Billion",
        "Optimal_Tokens_D": f"{D_opt / 1e9:.2f} Billion",
        "Tokens_Per_Param_Ratio": f"{tokens_per_param:.1f} tokens/param"
    }

# Example: Compute optimal allocation for 5.76e23 FLOPs (Gopher budget)
gopher_budget = 5.76e23
result = chinchilla_optimal_allocation(gopher_budget)
for k, v in result.items():
    print(f"{k}: {v}")`,
    },
    interactiveToy: {
      type: 'scaling_curve',
      title: 'Chinchilla IsoFLOP Frontier Explorer',
      description: 'Drag total training budget (in ExaFLOPs) to visualize the optimal balance between parameter capacity (N) and token volume (D).',
    },
  },
  {
    id: 'paper-6',
    number: 6,
    title: 'Switch Transformer: Scaling to Trillion Parameter Models',
    subtitle: 'Sparse Mixture-of-Experts Routing',
    category: 'architecture-scaling',
    arxivUrl: 'https://arxiv.org/abs/2101.03961',
    year: 2021,
    authors: 'Fedus, Zoph, Shazeer',
    organization: 'Google Brain',
    tldr: 'Replaced dense FFN layers with a simplified Switch Routing mechanism that routes each token to only a single expert, scaling to 1.6 trillion parameters with 4x speedup.',
    intuitiveExplanation:
      'In a traditional transformer, every single token passes through every single neuron in the network. If your model has 100 billion parameters, you must execute 100 billion parameters of math for every comma and preposition. Switch Transformer introduces a Sparse Mixture of Experts (MoE). Instead of one giant feed-forward network, it has 128 smaller expert networks per layer. A lightweight router looks at each token and picks only the single best expert (Top-1) to process it. The parameter count increases 10x or 100x, but computational cost (FLOPs per token) stays constant!',
    novelty: [
      'Switch Routing: simplified Shazeer et al. Top-2 gating down to Top-1 gating, preserving quality while cutting routing compute and communication overhead.',
      'Scaled language models to 1.6 Trillion parameters while keeping per-token FLOPs equivalent to a T5-Base.',
      'Introduced auxiliary load balancing loss to prevent expert collapse and ensure uniform device utilization.',
      'Developed selective float32 precision for router stability while training 99% of weights in bfloat16.',
    ],
    keyTechniques: [
      'Top-1 Gating Softmax Router',
      'Auxiliary Load Balancing Loss (alpha * N * sum(f_i * P_i))',
      'Expert Capacity Factor (C = 1.0 to 1.25) to bound memory buffers',
      'Selective precision casting (fp32 router, bf16 experts)',
    ],
    workflow: [
      {
        step: 1,
        title: 'Token Gating Probability Calculation',
        description: 'Linear router projects token hidden state x to N expert logits; apply softmax to obtain routing probability distribution.',
        mathFormula: 'p_i(x) = \\frac{e^{h(x)_i}}{\\sum_j e^{h(x)_j}}, \\quad h(x) = x W_g',
      },
      {
        step: 2,
        title: 'Top-1 Expert Selection & Dispatch',
        description: 'Identify top-1 index i = argmax p(x) and route token x to expert E_i provided expert buffer capacity is not exceeded.',
        mathFormula: 'y = p_i(x) \\cdot E_i(x)',
      },
      {
        step: 3,
        title: 'Capacity Overflow Handling',
        description: 'If an expert receives more tokens than its capacity buffer C, excess tokens bypass the expert via residual connection.',
      },
      {
        step: 4,
        title: 'Auxiliary Load Balancing Loss',
        description: 'Penalize uneven expert dispatch to encourage uniform token distribution across all expert devices.',
        mathFormula: '\\mathcal{L}_{\\text{aux}} = \\alpha N \\sum_{i=1}^N f_i P_i',
      },
    ],
    architecture: {
      coreConcepts: [
        'Switch-Base (7.4B params, 128 experts) to Switch-C (1.6 Trillion params, 2048 experts)',
        'Only Feed-Forward (FFN) blocks are replaced with MoE; Attention layers remain dense and shared',
        'Expert Capacity Factor set between 1.0 and 1.25',
      ],
      scalabilityMechanism:
        'Decouples parameter count from FLOPs: total parameters scale linearly with expert count O(E), but computation per token remains O(1).',
      bottleneckSolved:
        'Prohibitive computational FLOP cost of dense models beyond 100B parameters and communication overhead of Top-2 gating.',
    },
    trainingDynamics: {
      optimizerAndSchedule:
        'Adafactor with inverse square root learning rate schedule; router weights stored in full fp32.',
      lossFunction: 'Cross-entropy seq2seq loss + Auxiliary Load Balancing loss (alpha = 0.01).',
      computeAndHardware: 'Trained on TPU v3 pods (up to 2048 cores simultaneously with Megatron/Mesh-TensorFlow expert parallelism).',
      stabilityTricks: 'Smaller parameter initialization (std=0.1 * sqrt(2/d_in)) and router z-loss to prevent extreme logit drift.',
    },
    empiricalBenchmarks: [
      {
        benchmarkName: 'Pre-training Speedup to Baseline Perplexity',
        paperScore: '4x Speedup',
        previousIterationScore: '1x baseline',
        baselineName: 'Dense T5-XXL (11B)',
        relativeGain: '400% faster convergence',
        analysis: 'Switch-Base reached the exact same pre-training perplexity as dense T5-Base in 1/4 the wall-clock training time.',
      },
      {
        benchmarkName: 'SuperGLUE Score (Switch-XXL)',
        paperScore: '89.2',
        previousIterationScore: '87.1',
        baselineName: 'T5-XXL',
        relativeGain: '+2.1 points',
        analysis: 'Outperformed dense T5-XXL while requiring similar per-token compute during inference.',
      },
    ],
    alternatives: [
      {
        name: 'GShard Top-2 Routing (Lepikhin et al.)',
        comparison: 'Routes each token to the top 2 experts, combining their outputs with weighted sum.',
        tradeoff: 'Top-2 provides higher capacity per token, but doubles all-to-all communication latency and expert compute.',
      },
      {
        name: 'DeepSeek-V3 Fine-Grained MoE',
        comparison: 'Uses 256 micro-experts with 8 activated per token and dedicated shared experts.',
        tradeoff: 'DeepSeek fine-grained routing provides richer combination flexibility than single Top-1 Switch routing.',
      },
    ],
    replicationGuide: {
      difficulty: 'Advanced',
      minHardware: 'Multi-GPU (2x or 4x A100/H100) with NVLink for fast all-to-all communication',
      libraries: ['DeepSpeed-MoE', 'Megatron-DeepSpeed', 'vLLM', 'fairseq'],
      datasets: ['C4 (Colossal Clean Crawled Corpus)', 'FineWeb'],
      reproducibilityRecipe: [
        'Use HuggingFace or DeepSpeed: initialize DeepSpeedMoE module with num_experts=8.',
        'Implement Top-1 softmax routing with capacity_factor=1.25.',
        'Add auxiliary loss: loss = ce_loss + 0.01 * aux_loss.',
        'Verify expert utilization histogram using TensorBoard to detect potential expert collapse.',
      ],
      githubOrRepo: 'https://github.com/google-research/t5x',
    },
    codeSnippet: {
      language: 'python',
      filename: 'switch_transformer_router.py',
      description: 'Switch Transformer Top-1 Sparse MoE Gating with auxiliary load-balancing loss',
      code: `import torch
import torch.nn as nn
import torch.nn.functional as F

class SwitchRouter(nn.Module):
    def __init__(self, d_model: int, num_experts: int, capacity_factor: float = 1.25):
        super().__init__()
        self.num_experts = num_experts
        self.capacity_factor = capacity_factor
        # Keep router weights in fp32 for stability
        self.router_weights = nn.Linear(d_model, num_experts, bias=False)

    def forward(self, x: torch.Tensor):
        # x: (batch_size * seq_len, d_model)
        N, D = x.shape
        router_logits = self.router_weights(x.float())  # (N, num_experts)
        router_probs = F.softmax(router_logits, dim=-1)

        # 1. Top-1 routing: choose the single highest scoring expert
        gate_weights, expert_indices = torch.max(router_probs, dim=-1)

        # 2. Auxiliary load balancing loss calculation: alpha * num_experts * sum(f_i * P_i)
        # f_i: fraction of tokens dispatched to expert i
        expert_mask = F.one_hot(expert_indices, num_classes=self.num_experts).float()
        tokens_per_expert = expert_mask.sum(dim=0)
        fraction_tokens = tokens_per_expert / N
        
        # P_i: average routing probability for expert i
        mean_prob = router_probs.mean(dim=0)
        
        aux_loss = self.num_experts * torch.sum(fraction_tokens * mean_prob)

        # 3. Compute expert capacity limit
        expert_capacity = int((N / self.num_experts) * self.capacity_factor)
        
        return expert_indices, gate_weights, aux_loss, expert_capacity`,
    },
    interactiveToy: {
      type: 'moe_router',
      title: 'Top-1 Switch Expert Router Simulator',
      description: 'Dispatch input tokens to parallel experts. Monitor token distribution, capacity buffer overflows, and auxiliary load-balancing loss in real time.',
    },
  },
];
