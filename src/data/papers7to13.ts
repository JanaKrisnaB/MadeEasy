import { Paper } from '../types';

export const PAPERS_7_TO_13: Paper[] = [
  {
    id: 'paper-7',
    number: 7,
    title: 'Training Language Models to Follow Instructions with Human Feedback',
    subtitle: 'InstructGPT: The RLHF Alignment Recipe',
    category: 'alignment-multimodal',
    arxivUrl: 'https://arxiv.org/abs/2203.02155',
    year: 2022,
    authors: 'Ouyang, Wu, Jiang, Almeida, Wainwright, Mishkin, Zhang, Agarwal, Slama, Ray et al.',
    organization: 'OpenAI',
    tldr: 'Introduced the canonical 3-stage Reinforcement Learning from Human Feedback (RLHF) pipeline, aligning raw text completion models with user intent.',
    intuitiveExplanation:
      'A raw base model like GPT-3 is simply a statistical mimic: if you give it the prompt "Write an essay about photosynthesis", it might reply with "Chapter 2: The Calvin Cycle" because that is how textbooks look on the web. It does not understand that you want an answer. InstructGPT introduced the three-stage alignment playbook: 1) Supervised Fine-Tuning (SFT) on human demonstrations, 2) Training a Reward Model on human preference comparisons (which response is better, A or B?), and 3) Proximal Policy Optimization (PPO) reinforcement learning to steer the LLM toward high reward while staying anchored via a KL-divergence penalty.',
    novelty: [
      'Formalized the 3-step RLHF pipeline: SFT -> Reward Model (RM) -> PPO reinforcement learning.',
      'Showed that a 1.3B parameter InstructGPT model is preferred by human raters over a 100x larger 175B raw GPT-3.',
      'Introduced the per-token KL divergence penalty to prevent reward hacking and policy collapse.',
      'Demonstrated significant reductions in toxic outputs, hallucinations, and harmful refusal failures.',
    ],
    keyTechniques: [
      'Supervised Fine-Tuning (SFT) on curated prompt-response pairs',
      'Pairwise Bradley-Terry Reward Modeling loss: -E[log(sigma(r(y_w) - r(y_l)))]',
      'PPO (Proximal Policy Optimization) with value network critic',
      'KL-Divergence penalty: D_KL(pi_phi(y|x) || pi_ref(y|x))',
    ],
    workflow: [
      {
        step: 1,
        title: 'Supervised Fine-Tuning (SFT)',
        description: 'Collect prompts submitted to OpenAI API; hire human labelers to write ideal demonstrations. Fine-tune base GPT-3 via standard next-token cross-entropy.',
      },
      {
        step: 2,
        title: 'Reward Model Training',
        description: 'Sample multiple model responses for a prompt. Human annotators rank them from best to worst. Train scalar reward model r_theta using Bradley-Terry loss.',
        mathFormula: '\\mathcal{L}_{\\text{RM}} = -\\mathbb{E}_{(x, y_w, y_l)} \\left[ \\log \\sigma(r_\\theta(x, y_w) - r_\\theta(x, y_l)) \\right]',
      },
      {
        step: 3,
        title: 'PPO Reinforcement Learning',
        description: 'Optimize the policy model to maximize reward model score minus a KL penalty against the frozen SFT reference model.',
        mathFormula: '\\text{obj}(\\phi) = \\mathbb{E} \\left[ r_\\theta(x, y) - \\beta D_{\\text{KL}}(\\pi_\\phi(y|x) \\parallel \\pi_{\\text{ref}}(y|x)) \\right]',
      },
    ],
    architecture: {
      coreConcepts: [
        'Base models: GPT-3 1.3B, 6B, and 175B parameters',
        'Reward Model: 6B parameter model initialized from SFT, outputting a scalar reward head',
        'Value Network (Critic) initialized from Reward Model for PPO generalized advantage estimation (GAE)',
      ],
      scalabilityMechanism:
        'Small amounts of high-quality human preference data (~13k SFT demonstrations, ~33k pairwise comparisons) unlock immense usability gains without requiring larger base models.',
      bottleneckSolved:
        'The "alignment tax" where raw next-token prediction models output toxic, unhelpful, or evasive text despite high perplexity.',
    },
    trainingDynamics: {
      optimizerAndSchedule: 'Adam for SFT (lr=1e-5); PPO uses constant lr=9e-6 with 2 epochs per batch.',
      lossFunction: 'PPO clipped surrogate objective + KL divergence anchor + auxiliary pre-training gradient mix.',
      computeAndHardware: 'NVIDIA V100 GPU clusters running distributed PPO actor/critic rollouts.',
      stabilityTricks: 'Clipping reward score to [-5, 5]; adaptive KL coefficient beta to maintain stable divergence.',
    },
    empiricalBenchmarks: [
      {
        benchmarkName: 'Human Preference vs GPT-3 175B',
        paperScore: '85% win-rate',
        previousIterationScore: '50% tie',
        baselineName: 'Raw GPT-3 175B',
        relativeGain: '+35% net win',
        analysis: 'InstructGPT 1.3B was preferred by human evaluators over 175B raw GPT-3 despite having 100x fewer parameters.',
      },
      {
        benchmarkName: 'TruthfulQA Truthfulness Score',
        paperScore: '42.0%',
        previousIterationScore: '22.0%',
        baselineName: 'Raw GPT-3',
        relativeGain: '+20.0% truthfulness',
        analysis: 'Dramatically reduced confabulations and gullible repetitions of common internet misconceptions.',
      },
    ],
    alternatives: [
      {
        name: 'Direct Preference Optimization (DPO - Rafailov et al.)',
        comparison: 'Eliminates the separate reward model and PPO policy loop by solving the RL objective in closed form via implicit reward formulation.',
        tradeoff: 'DPO is mathematically simpler and faster to train, but RLHF with PPO remains more resilient for iterative multi-turn rollouts.',
      },
      {
        name: 'KTO (Kahneman-Tversky Optimization)',
        comparison: 'Optimizes directly on binary thumbs-up/thumbs-down signals using human prospect theory rather than pairwise preferences.',
        tradeoff: 'Much cheaper to gather binary signals than pairwise rankings, but slightly lower peak alignment fidelity.',
      },
    ],
    replicationGuide: {
      difficulty: 'Intermediate',
      minHardware: '1x A100 (40GB/80GB) or 2x RTX 3090 with LoRA / TRL',
      libraries: ['trl (Hugging Face)', 'peft', 'transformers', 'accelerate'],
      datasets: ['Anthropic HH-RLHF', 'OpenAssistant Conversations', 'UltraFeedback'],
      reproducibilityRecipe: [
        'Load base model (e.g. Llama-3-8B-Instruct or Qwen-2.5-7B).',
        'Use trl.RewardTrainer with AutoModelForSequenceClassification on pairwise preference data.',
        'Use trl.PPOTrainer or trl.DPOTrainer with reference model.',
        'Keep KL beta at 0.05 - 0.1 to avoid model degeneracy.',
      ],
      githubOrRepo: 'https://github.com/huggingface/trl',
    },
    codeSnippet: {
      language: 'python',
      filename: 'rlhf_pairwise_loss.py',
      description: 'Bradley-Terry Pairwise Reward Model Loss and KL penalty computation',
      code: `import torch
import torch.nn as nn
import torch.nn.functional as F

class BradleyTerryRewardLoss(nn.Module):
    """
    Computes pairwise reward loss:
    L = -E[log(sigmoid(r(y_w) - r(y_l)))]
    where y_w is the human-preferred response and y_l is the dispreferred response.
    """
    def __init__(self):
        super().__init__()

    def forward(self, preferred_rewards: torch.Tensor, dispreferred_rewards: torch.Tensor):
        logits = preferred_rewards - dispreferred_rewards
        loss = -F.logsigmoid(logits).mean()
        # Compute accuracy metric (fraction where preferred > dispreferred)
        accuracy = (preferred_rewards > dispreferred_rewards).float().mean()
        return loss, accuracy

def compute_kl_penalty(log_probs_policy: torch.Tensor, log_probs_ref: torch.Tensor, beta: float = 0.1):
    """
    Per-token KL divergence penalty: beta * (log pi(y|x) - log pi_ref(y|x))
    Prevents the RL policy from drifting too far from the base model.
    """
    kl_divergence = log_probs_policy - log_probs_ref
    penalized_rewards = -beta * kl_divergence
    return penalized_rewards`,
    },
    interactiveToy: {
      type: 'rlhf_ppo',
      title: 'RLHF Policy & KL Constraint Simulator',
      description: 'Adjust the KL penalty weight (beta) and observe how the policy trades off reward optimization against linguistic stability and mode collapse.',
    },
  },
  {
    id: 'paper-8',
    number: 8,
    title: 'Learning Transferable Visual Models From Natural Language Supervision',
    subtitle: 'CLIP: Unified Vision-Language Contrastive Learning',
    category: 'alignment-multimodal',
    arxivUrl: 'https://arxiv.org/abs/2103.00020',
    year: 2021,
    authors: 'Radford, Kim, Hallacy, Ramesh, Goh, Agarwal, Sastry, Askell, Mishkin, Clark, Krueger, Sutskever',
    organization: 'OpenAI',
    tldr: 'Trained dual encoders (Image Transformer + Text Transformer) using symmetric contrastive loss on 400M web image-text pairs, unlocking robust zero-shot classification.',
    intuitiveExplanation:
      'Traditionally, computer vision models were trained on ImageNet with fixed 1,000 label classes (like "goldfish" or "crane"). If you asked it to classify a "smiling barista" or a sketch, it broke because it had no concept of language. CLIP threw away fixed labels entirely. It scrapes 400 million image-caption pairs from the internet and trains two encoders simultaneously: one for images, one for text. During training, it forces the image embedding and text embedding of matching pairs to point in the same direction in vector space, while pushing mismatched pairs apart. To classify any new image, you simply feed text prompts like "a photo of a {dog}" and find the highest cosine similarity.',
    novelty: [
      'Unified vision and language representations via large-scale symmetric contrastive learning.',
      'Demonstrated zero-shot transfer matching supervised ResNet-50 on ImageNet without using any ImageNet training labels.',
      'Extreme robustness to distribution shift (ImageNet-A, ImageNet-R, Sketch) where standard supervised models degraded heavily.',
      'Became the foundational visual backbone for Stable Diffusion, DALL-E 2, and modern Vision-Language Models (LLaVA).',
    ],
    keyTechniques: [
      'Dual-Encoder architecture (ViT / ResNet image encoder + Transformer text encoder)',
      'Symmetric InfoNCE / cross-entropy contrastive loss over N x N batch similarity matrix',
      'Learnable temperature parameter tau initialized at 0.07 (clipped at 100)',
      'Zero-shot prompt engineering ("a photo of a {label}")',
    ],
    workflow: [
      {
        step: 1,
        title: 'Dual Feature Extraction',
        description: 'Pass batch of N images through Image Encoder and N corresponding text captions through Text Encoder.',
        mathFormula: 'I_f = \\text{ImageEncoder}(I), \\quad T_f = \\text{TextEncoder}(T)',
      },
      {
        step: 2,
        title: 'L2 Normalization & Projection',
        description: 'Project both modalities into a shared d=512 embedding space and normalize to unit hypersphere.',
        mathFormula: 'i_n = \\frac{I_f W_i}{\\|I_f W_i\\|_2}, \\quad t_n = \\frac{T_f W_t}{\\|T_f W_t\\|_2}',
      },
      {
        step: 3,
        title: 'Cosine Similarity Matrix Computation',
        description: 'Calculate pairwise dot-product matrix across all image-text combinations scaled by learnable temperature exp(tau).',
        mathFormula: 'S = (i_n \\cdot t_n^T) \\cdot e^\\tau',
      },
      {
        step: 4,
        title: 'Symmetric Cross-Entropy Loss',
        description: 'Optimize cross-entropy along both rows (image-to-text) and columns (text-to-image).',
        mathFormula: '\\mathcal{L} = \\frac{1}{2} \\left( \\mathcal{L}_{\\text{image}} + \\mathcal{L}_{\\text{text}} \\right)',
      },
    ],
    architecture: {
      coreConcepts: [
        'Image Encoder: ResNet-50, ResNet-101, or Vision Transformer (ViT-B/32, ViT-B/16, ViT-L/14)',
        'Text Encoder: Transformer decoder with causal masking (masked self-attention, 8 heads, 63M params)',
        'Shared embedding dimension: 512 or 768 float values',
      ],
      scalabilityMechanism:
        'Self-supervised contrastive learning on web-scale weak supervision scales gracefully with compute, avoiding expensive manual per-pixel bounding boxes or labels.',
      bottleneckSolved:
        'Rigid, closed-vocabulary limitations of supervised ImageNet models and their catastrophic vulnerability to distribution shifts.',
    },
    trainingDynamics: {
      optimizerAndSchedule: 'Adam with decoupled weight decay; cosine annealing schedule with 32,768 batch size.',
      lossFunction: 'Symmetric InfoNCE contrastive cross-entropy loss.',
      computeAndHardware: 'Trained on 592 NVIDIA V100 GPUs for 18 days for ViT-L/14 (400M image-text pairs).',
      stabilityTricks: 'Learned temperature parameter tau clamped to prevent numerical explosion (>100.0) in fp16.',
    },
    empiricalBenchmarks: [
      {
        benchmarkName: 'ImageNet Zero-Shot Top-1 Accuracy',
        paperScore: '76.2% (ViT-L/14)',
        previousIterationScore: '76.5% (Supervised ResNet-50)',
        baselineName: 'Supervised ResNet-50 trained on ImageNet',
        relativeGain: 'Matched supervised baseline',
        analysis: 'Matched standard supervised ImageNet accuracy without ever seeing a single labeled ImageNet training image.',
      },
      {
        benchmarkName: 'ImageNet-Adversarial (ImageNet-A)',
        paperScore: '77.1% Accuracy',
        previousIterationScore: '25.2%',
        baselineName: 'Standard ResNet-50',
        relativeGain: '+51.9%',
        analysis: 'Demonstrated massive out-of-distribution robustness against natural adversarial perturbations.',
      },
    ],
    alternatives: [
      {
        name: 'SigLIP (Sigmoid Loss for Language-Image Pretraining)',
        comparison: 'Replaces softmax normalization over the full batch with a pairwise sigmoid loss.',
        tradeoff: 'SigLIP eliminates all-gather global softmax communication, enabling scaling to massive batch sizes (>65k).',
      },
      {
        name: 'BLIP-2 / Flamingo',
        comparison: 'Uses a Q-Former to feed visual tokens into a pre-trained autoregressive LLM to generate descriptive sentences.',
        tradeoff: 'Generates freeform dialogue, but is significantly heavier computationally than CLIP dual encoders.',
      },
    ],
    replicationGuide: {
      difficulty: 'Intermediate',
      minHardware: 'Single RTX 3090 / 4090 for inference & fine-tuning; 4x A100 for small pre-training',
      libraries: ['open_clip_torch', 'transformers', 'torchvision', 'timm'],
      datasets: ['LAION-400M / LAION-5B (sample)', 'COCO Captions', 'Flickr30k'],
      reproducibilityRecipe: [
        'Use open_clip: model, _, preprocess = open_clip.create_model_and_transforms("ViT-B-32", pretrained="laion2b_s34b_b79k").',
        'Tokenize candidate classes: text = open_clip.tokenize(["a dog", "a cat", "a sports car"]).',
        'Compute cosine similarity between image_features and text_features.',
        'Apply softmax across similarities to get zero-shot class probabilities.',
      ],
      githubOrRepo: 'https://github.com/openai/CLIP',
    },
    codeSnippet: {
      language: 'python',
      filename: 'clip_contrastive_loss.py',
      description: 'CLIP symmetric contrastive InfoNCE loss implementation with learnable temperature',
      code: `import torch
import torch.nn as nn
import torch.nn.functional as F

class CLIPLoss(nn.Module):
    def __init__(self, init_temperature: float = 0.07):
        super().__init__()
        # Temperature stored in log space to ensure positivity
        self.logit_scale = nn.Parameter(torch.ones([]) * torch.log(torch.tensor(1.0 / init_temperature)))

    def forward(self, image_features: torch.Tensor, text_features: torch.Tensor):
        # 1. Normalize representations to unit hypersphere
        image_features = F.normalize(image_features, p=2, dim=-1)
        text_features = F.normalize(text_features, p=2, dim=-1)

        # 2. Scaled cosine similarity matrix (N, N)
        logit_scale = torch.clamp(self.logit_scale.exp(), max=100.0)
        logits_per_image = torch.matmul(image_features, text_features.t()) * logit_scale
        logits_per_text = logits_per_image.t()

        # 3. Ground truth targets are diagonal indices (0, 1, 2, ..., N-1)
        batch_size = image_features.shape[0]
        ground_truth = torch.arange(batch_size, device=image_features.device)

        # 4. Symmetric cross-entropy
        loss_i2t = F.cross_entropy(logits_per_image, ground_truth)
        loss_t2i = F.cross_entropy(logits_per_text, ground_truth)
        
        return (loss_i2t + loss_t2i) / 2.0`,
    },
    interactiveToy: {
      type: 'generic_stepper',
      title: 'CLIP Zero-Shot Cosine Alignment Visualizer',
      description: 'Inspect image and text embedding vectors projected on the unit hypersphere. See how cosine distances translate to zero-shot classification probabilities.',
    },
  },
  {
    id: 'paper-9',
    number: 9,
    title: 'Denoising Diffusion Probabilistic Models',
    subtitle: 'DDPM: Foundational Diffusion Mathematics',
    category: 'alignment-multimodal',
    arxivUrl: 'https://arxiv.org/abs/2006.11239',
    year: 2020,
    authors: 'Ho, Jain, Abbeel',
    organization: 'UC Berkeley',
    tldr: 'Derived the simplified score-matching variational objective that ignited the modern generative image revolution, replacing unstable GANs with iterative denoising.',
    intuitiveExplanation:
      'Imagine dropping food coloring into a glass of water: over time, it diffuses into uniform, disordered noise. That is easy (the forward process). Can you take that cloudy water and run time backward to reassemble the original droplet? That is the reverse process. DDPM adds tiny amounts of Gaussian noise to an image across 1,000 steps until it becomes pure static. It then trains a U-Net neural network to predict the exact noise vector that was added at any given step. By subtracting the predicted noise iteratively, the network can start from pure random static and generate a crystal-clear photorealistic image.',
    novelty: [
      'Proved that diffusion models are equivalent to score matching with Langevin dynamics under a simplified L2 loss.',
      'Eliminated adversarial minimax training instabilities of GANs while covering full data mode distributions.',
      'Derived closed-form forward marginal q(x_t | x_0) using alpha_bar cumulative products, avoiding step-by-step unrolling during training.',
      'Achieved competitive FID scores on CIFAR-10 and 256x256 LSUN, setting the foundation for Stable Diffusion and Sora.',
    ],
    keyTechniques: [
      'Forward Markov diffusion process with linear variance schedule beta_1 to beta_T',
      'Closed-form jump sampling: x_t = sqrt(alpha_bar_t) * x_0 + sqrt(1 - alpha_bar_t) * epsilon',
      'Simplified L_simple loss: E_{t, x_0, epsilon} [ || epsilon - epsilon_theta(x_t, t) ||^2 ]',
      'Time-conditioned U-Net with sinusoidal timestep embeddings and self-attention',
    ],
    workflow: [
      {
        step: 1,
        title: 'Forward Noise Diffusion (Training)',
        description: 'Sample random timestep t in [1, T] and standard Gaussian noise epsilon. Jump directly to noisy image x_t.',
        mathFormula: 'x_t = \\sqrt{\\bar{\\alpha}_t} x_0 + \\sqrt{1 - \\bar{\\alpha}_t} \\epsilon, \\quad \\epsilon \\sim \\mathcal{N}(0, I)',
      },
      {
        step: 2,
        title: 'Noise Prediction by U-Net',
        description: 'Pass noisy tensor x_t and timestep embedding t into U-Net to predict the added noise vector epsilon_theta.',
      },
      {
        step: 3,
        title: 'Mean Squared Error Optimization',
        description: 'Calculate simple L2 regression loss between true noise epsilon and predicted noise epsilon_theta.',
        mathFormula: '\\mathcal{L}_{\\text{simple}}(\\theta) = \\mathbb{E}_{t, x_0, \\epsilon} \\left[ \\| \\epsilon - \\epsilon_\\theta(x_t, t) \\|^2 \\right]',
      },
      {
        step: 4,
        title: 'Reverse Denoising Generation (Sampling)',
        description: 'Start from pure Gaussian static x_T; iteratively subtract predicted noise and add calibrated variance sigma_t.',
        mathFormula: 'x_{t-1} = \\frac{1}{\\sqrt{\\alpha_t}} \\left( x_t - \\frac{\\beta_t}{\\sqrt{1 - \\bar{\\alpha}_t}} \\epsilon_\\theta(x_t, t) \\right) + \\sigma_t z',
      },
    ],
    architecture: {
      coreConcepts: [
        'U-Net backbone with residual blocks, spatial downsampling and upsampling skip connections',
        'Sinusoidal positional embeddings for scalar diffusion timestep t',
        'Self-attention blocks at 16x16 feature resolution',
      ],
      scalabilityMechanism:
        'Decouples training (which requires only single-step noise prediction) from generation (iterative multi-step sampling), allowing stable scaling without mode collapse.',
      bottleneckSolved:
        'Mode collapse, training instability, and hyperparameter sensitivity in Generative Adversarial Networks (GANs).',
    },
    trainingDynamics: {
      optimizerAndSchedule: 'Adam (lr=2e-4, constant) without weight decay; EMA (Exponential Moving Average) rate 0.9999.',
      lossFunction: 'Simplified unweighted L2 loss ||epsilon - epsilon_theta(x_t, t)||^2.',
      computeAndHardware: 'Trained on 8 NVIDIA V100 GPUs for several days per resolution.',
      stabilityTricks: 'Exponential Moving Average (EMA) of model weights is essential for high-fidelity generation.',
    },
    empiricalBenchmarks: [
      {
        benchmarkName: 'CIFAR-10 Unconditional FID (Frechet Inception Distance)',
        paperScore: '3.17 FID',
        previousIterationScore: '3.42 FID',
        baselineName: 'StyleGAN2 with ADA',
        relativeGain: 'New SOTA',
        analysis: 'First non-adversarial likelihood/diffusion model to beat contemporary SOTA GANs in sample visual fidelity.',
      },
      {
        benchmarkName: 'Inception Score (CIFAR-10)',
        paperScore: '9.46',
        previousIterationScore: '9.18',
        baselineName: 'NCSN (Song & Ermon)',
        relativeGain: '+0.28 points',
        analysis: 'Produced sharp, diverse samples across all 10 image classes with zero mode dropping.',
      },
    ],
    alternatives: [
      {
        name: 'DDIM (Denoising Diffusion Implicit Models)',
        comparison: 'Non-Markovian sampling formulation that enables high-quality generation in 20-50 steps instead of 1,000 steps.',
        tradeoff: 'Accelerates inference by 20x-50x with virtually no loss in visual quality.',
      },
      {
        name: 'Latent Diffusion Models (Stable Diffusion / Rombach et al.)',
        comparison: 'Runs diffusion in the compressed latent space of an Autoencoder (VAE) rather than raw high-resolution pixel space.',
        tradeoff: 'Cuts GPU memory and training time by 8x-16x, making high-res synthesis possible on consumer GPUs.',
      },
    ],
    replicationGuide: {
      difficulty: 'Intermediate',
      minHardware: 'Single RTX 3060/4070 (8GB - 12GB VRAM)',
      libraries: ['diffusers', 'torch', 'torchvision'],
      datasets: ['MNIST', 'Fashion-MNIST', 'CelebA 64x64', 'CIFAR-10'],
      reproducibilityRecipe: [
        'Define beta schedule: betas = torch.linspace(1e-4, 0.02, steps=1000).',
        'Precompute alphas = 1.0 - betas, alphas_bar = torch.cumprod(alphas, dim=0).',
        'Build small U-Net with time embedding MLP.',
        'Train on MNIST: sample t, add noise, compute MSELoss between noise and predicted noise.',
        'Generate digits from scratch after ~15 epochs.',
      ],
      githubOrRepo: 'https://github.com/hojonathanho/diffusion',
    },
    codeSnippet: {
      language: 'python',
      filename: 'ddpm_forward_and_loss.py',
      description: 'DDPM Forward Diffusion step and Simplified Training Loss',
      code: `import torch
import torch.nn.functional as F

class DDPMDiffusion:
    def __init__(self, timesteps: int = 1000, beta_start: float = 1e-4, beta_end: float = 0.02):
        self.timesteps = timesteps
        # Linear variance schedule
        self.betas = torch.linspace(beta_start, beta_end, timesteps)
        self.alphas = 1.0 - self.betas
        self.alphas_bar = torch.cumprod(self.alphas, dim=0)

    def q_sample(self, x_0: torch.Tensor, t: torch.Tensor, noise: torch.Tensor = None) -> torch.Tensor:
        """Closed-form forward sample: x_t = sqrt(alpha_bar_t)*x_0 + sqrt(1 - alpha_bar_t)*noise"""
        if noise is None:
            noise = torch.randn_like(x_0)
        
        sqrt_alpha_bar = torch.sqrt(self.alphas_bar[t]).view(-1, 1, 1, 1)
        sqrt_one_minus_alpha_bar = torch.sqrt(1.0 - self.alphas_bar[t]).view(-1, 1, 1, 1)
        
        return sqrt_alpha_bar * x_0 + sqrt_one_minus_alpha_bar * noise

    def compute_loss(self, model, x_0: torch.Tensor) -> torch.Tensor:
        batch_size = x_0.shape[0]
        # Uniform random timesteps
        t = torch.randint(0, self.timesteps, (batch_size,), device=x_0.device).long()
        noise = torch.randn_like(x_0)
        
        # Corrupt image to timestep t
        x_t = self.q_sample(x_0, t, noise)
        
        # Predict noise using U-Net
        predicted_noise = model(x_t, t)
        
        # Simple L2 regression loss
        return F.mse_loss(predicted_noise, noise)`,
    },
    interactiveToy: {
      type: 'diffusion_denoise',
      title: 'Diffusion Denoising Trajectory Explorer',
      description: 'Scrub through diffusion timesteps t=1000 (pure Gaussian noise) down to t=0 (reconstructed image) to observe variance reduction and feature emergence.',
    },
  },
  {
    id: 'paper-10',
    number: 10,
    title: 'Megatron-LM: Training Multi-Billion Parameter Language Models Using Model Parallelism',
    subtitle: 'Tensor and Pipeline Parallelism',
    category: 'systems-efficiency',
    arxivUrl: 'https://arxiv.org/abs/1909.08053',
    year: 2019,
    authors: 'Shoeybi, Patwary, Puri, LeGresley, Casper, Catanzaro',
    organization: 'NVIDIA Applied Deep Learning Research',
    tldr: 'Introduced simple, highly efficient intra-node 1D Tensor Parallelism for Multi-Head Attention and MLP layers requiring minimal all-reduce communication.',
    intuitiveExplanation:
      'When an AI model is too large to fit into the memory of a single GPU (like a model with 50 billion parameters needing 100GB+ VRAM), standard data parallelism fails because each GPU must hold a copy of the whole model. Megatron-LM slices the individual matrix multiplications across GPUs. In the Multi-Head Attention block, it splits the Query, Key, and Value weights column-wise across GPUs, and splits the output projection row-wise. This mathematical formulation ensures that only two All-Reduce communication operations are needed per transformer block, running at blistering NVLink speeds.',
    novelty: [
      'Orthogonal 1D Tensor Parallelism splitting attention and MLP projections across GPU groups.',
      'Column-parallel and Row-parallel conjugate pairing requiring only 2 all-reduce communications per transformer layer.',
      'Demonstrated 76% linear scaling efficiency across up to 512 GPUs.',
      'Trained unprecedented multi-billion parameter models (8.3B GPT-2, 3.9B BERT) that exceeded single-GPU memory.',
    ],
    keyTechniques: [
      'Column Parallel Linear layer: split W along columns; no communication in forward until row step',
      'Row Parallel Linear layer: split W along rows; single All-Reduce forward, identity backward',
      'Fused GeLU and Softmax kernels for maximum GPU memory bandwidth efficiency',
      'Mixed-precision fp16 training with dynamic loss scaling',
    ],
    workflow: [
      {
        step: 1,
        title: 'Column-Parallel Attention QKV Projection',
        description: 'Partition attention heads evenly across P GPUs. Each GPU multiplies input X by its local slice W_col without communication.',
        mathFormula: 'Q_i = X W_{Q, i}, \\quad K_i = X W_{K, i}, \\quad V_i = X W_{V, i}',
      },
      {
        step: 2,
        title: 'Local Scaled Dot-Product Attention',
        description: 'Each GPU computes self-attention independently for its assigned attention heads.',
      },
      {
        step: 3,
        title: 'Row-Parallel Output Projection & All-Reduce',
        description: 'Multiply local attention output by row-sliced W_out and execute a single All-Reduce (sum) across the tensor-parallel group.',
        mathFormula: 'Y = \\sum_{i=1}^P Z_i W_{O, i} = \\text{All-Reduce}\\left(Z_i W_{O, i}\\right)',
      },
      {
        step: 4,
        title: 'Column/Row Splitting in Feed-Forward MLP',
        description: 'Split first MLP layer W_1 column-wise; split second layer W_2 row-wise followed by one final All-Reduce.',
      },
    ],
    architecture: {
      coreConcepts: [
        'Tensor Model Parallelism (TP) for fast intra-node NVLink interconnects',
        'Pipeline Parallelism (PP) across nodes to minimize network hop latency',
        'Data Parallelism (DP) layered orthogonally across model replicas',
      ],
      scalabilityMechanism:
        'Slices matrix operations so GPU memory scales down linearly O(1/P) with tensor parallelism while keeping communication bound to local NVLink.',
      bottleneckSolved:
        'Out-Of-Memory (OOM) barrier preventing models larger than 16GB VRAM from training on contemporary GPUs.',
    },
    trainingDynamics: {
      optimizerAndSchedule: 'Adam with mixed-precision fp16/fp32 master weights, dynamic loss scaling.',
      lossFunction: 'Cross-entropy autoregressive and masked language modeling.',
      computeAndHardware: 'Clusters of NVIDIA DGX-2 servers (16 V100 32GB GPUs connected via 300 GB/s NVSwitch).',
      stabilityTricks: 'Activation checkpointing (recomputation) to drop intermediate activations and conserve VRAM.',
    },
    empiricalBenchmarks: [
      {
        benchmarkName: 'Scaling Efficiency on 512 GPUs',
        paperScore: '76% of theoretical peak',
        previousIterationScore: '40% - 50%',
        baselineName: 'Naive model parallelism (Mesh-TensorFlow)',
        relativeGain: '+26% efficiency',
        analysis: 'Achieved sustained 15.1 PetaFLOPs across a 512-GPU cluster on an 8.3 billion parameter model.',
      },
      {
        benchmarkName: 'LAMBADA Accuracy (8.3B GPT-2)',
        paperScore: '66.5%',
        previousIterationScore: '63.2%',
        baselineName: '1.5B GPT-2',
        relativeGain: '+3.3%',
        analysis: 'Established clear scaling improvements on zero-shot reasoning benchmarks directly via model capacity.',
      },
    ],
    alternatives: [
      {
        name: 'ZeRO-3 (DeepSpeed)',
        comparison: 'Partitions weights, gradients, and optimizer states across data-parallel ranks rather than slicing tensor matrices.',
        tradeoff: 'ZeRO works over standard Ethernet/InfiniBand without requiring NVLink, but has higher all-gather communication frequency.',
      },
      {
        name: 'Pipeline Parallelism (GPipe)',
        comparison: 'Splits model layers sequentially across GPUs and pipelines micro-batches.',
        tradeoff: 'Suffers from pipeline bubbles (idle GPU time) during warmup and cooldown phases.',
      },
    ],
    replicationGuide: {
      difficulty: 'Advanced',
      minHardware: 'Multi-GPU workstation (e.g. 2x or 4x RTX 3090/4090 or A100)',
      libraries: ['Megatron-LM', 'torch.distributed', 'DeepSpeed'],
      datasets: ['OpenWebText', 'Pile'],
      reproducibilityRecipe: [
        'Initialize PyTorch distributed process group: torch.distributed.init_process_group("nccl").',
        'Implement ColumnParallelLinear and RowParallelLinear using torch.distributed.all_reduce.',
        'Run torchrun --nproc_per_node=2 train_script.py.',
        'Verify identical output activations to single-GPU forward pass within numerical precision.',
      ],
      githubOrRepo: 'https://github.com/NVIDIA/Megatron-LM',
    },
    codeSnippet: {
      language: 'python',
      filename: 'tensor_parallel_layers.py',
      description: 'Minimal Megatron-LM style ColumnParallel and RowParallel Linear layers with torch.distributed',
      code: `import torch
import torch.nn as nn
import torch.distributed as dist

class ColumnParallelLinear(nn.Module):
    """Splits weight matrix along columns: Y_i = X * W_i. No communication in forward."""
    def __init__(self, in_features: int, out_features: int, world_size: int, rank: int):
        super().__init__()
        self.split_out_features = out_features // world_size
        self.weight = nn.Parameter(torch.empty(self.split_out_features, in_features))
        nn.init.xavier_normal_(self.weight)

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        # Each GPU computes its slice of the output channels
        return torch.matmul(x, self.weight.t())

class RowParallelLinear(nn.Module):
    """Splits weight matrix along rows: Y = AllReduce(X_i * W_i). Sums over all GPUs."""
    def __init__(self, in_features: int, out_features: int, world_size: int, rank: int):
        super().__init__()
        self.split_in_features = in_features // world_size
        self.weight = nn.Parameter(torch.empty(out_features, self.split_in_features))
        nn.init.xavier_normal_(self.weight)

    def forward(self, x_slice: torch.Tensor) -> torch.Tensor:
        # Local matrix multiply
        output_partial = torch.matmul(x_slice, self.weight.t())
        # All-Reduce sum across all GPUs in tensor-parallel group
        if dist.is_initialized():
            dist.all_reduce(output_partial, op=dist.ReduceOp.SUM)
        return output_partial`,
    },
    interactiveToy: {
      type: 'generic_stepper',
      title: 'Megatron Tensor Parallel Slicing Stepper',
      description: 'Step through column-parallel and row-parallel matrix multiplication across GPU 0 and GPU 1 to see how All-Reduce reconstructs full activations.',
    },
  },
  {
    id: 'paper-11',
    number: 11,
    title: 'ZeRO: Memory Optimizations Toward Training Trillion Parameter Models',
    subtitle: 'Zero Redundancy Optimizer Memory Partitioning',
    category: 'systems-efficiency',
    arxivUrl: 'https://arxiv.org/abs/1910.02054',
    year: 2019,
    authors: 'Rajbhandari, Rasley, Ruwase, He',
    organization: 'Microsoft',
    tldr: 'Eliminated memory redundancies in standard Data Parallel training by partitioning Optimizer States, Gradients, and Model Parameters across data-parallel ranks.',
    intuitiveExplanation:
      'In standard distributed training, if you have 64 GPUs, every single GPU keeps an identical copy of the model weights, the optimizer states (like Adam momentum and variance), and the gradients. For a 100B model in fp16, that requires 1.6 Terabytes of memory per GPU just for training states! ZeRO noticed this was 100% redundant. ZeRO partitions this data across the GPUs: GPU 0 holds 1/64th of the optimizer states, GPU 1 holds the next 1/64th, and so on. When a GPU needs a weight for a forward calculation, it quickly fetches it on-the-fly via All-Gather and discards it immediately. This allows training trillion-parameter models without changing model code.',
    novelty: [
      'ZeRO-Stage 1: Partitions Optimizer States (4x memory reduction with zero extra communication).',
      'ZeRO-Stage 2: Partitions Gradients alongside optimizer states (8x memory reduction with zero extra communication).',
      'ZeRO-Stage 3: Partitions Model Parameters (linear memory reduction proportional to GPU count N_d).',
      'ZeRO-Offload: Offloads partitioned states to host CPU DRAM, enabling 10B+ models on a single GPU.',
    ],
    keyTechniques: [
      'Partitioned Optimizer States (ZeRO-1: P_os)',
      'Partitioned Gradients (ZeRO-2: P_g)',
      'Partitioned Parameters (ZeRO-3: P_p) with dynamic All-Gather and Reduce-Scatter',
      'Constant buffer memory management to prevent memory fragmentation',
    ],
    workflow: [
      {
        step: 1,
        title: 'ZeRO Stage 1: Optimizer Partitioning',
        description: 'Instead of storing all 12 bytes of Adam states per parameter, each GPU holds only 1/N_d of the optimizer states.',
        mathFormula: '\\text{Memory}_{\\text{opt}} = \\frac{12 \\times \\Psi}{N_d} \\text{ bytes}',
      },
      {
        step: 2,
        title: 'ZeRO Stage 2: Gradient Partitioning',
        description: 'As gradients are computed in backward pass, reduce-scatter them so each GPU keeps only the gradients for its owned parameters.',
      },
      {
        step: 3,
        title: 'ZeRO Stage 3: Parameter Partitioning',
        description: 'Each GPU stores only 1/N_d of the model weights. During forward and backward pass, execute dynamic All-Gather just-in-time, then discard.',
      },
      {
        step: 4,
        title: 'Optimizer Update Step',
        description: 'Each GPU updates its local slice of weights and broadcasts the updated slice.',
      },
    ],
    architecture: {
      coreConcepts: [
        'Eliminates 16 bytes per parameter of redundancy in Adam mixed precision (2B fp16 weights + 2B fp16 grads + 4B fp32 weights + 8B fp32 moments = 16B)',
        'Retains simple data parallel programming model without requiring tensor-level model refactoring',
        'DeepSpeed runtime engine',
      ],
      scalabilityMechanism:
        'Memory footprint scales down as O(1/N_d) where N_d is the number of data parallel GPUs, unlocking trillion parameter regimes on commodity clusters.',
      bottleneckSolved:
        'Extreme memory bloat of optimizer states in Adam mixed precision that limited data-parallel training.',
    },
    trainingDynamics: {
      optimizerAndSchedule: 'Distributed AdamW with partitioned state updates.',
      lossFunction: 'Cross-entropy language modeling loss.',
      computeAndHardware: '400 NVIDIA V100 GPUs connected via 100 Gbps InfiniBand.',
      stabilityTricks: 'Overlap communication and computation using CUDA streams to hide all-gather overhead during forward pass.',
    },
    empiricalBenchmarks: [
      {
        benchmarkName: 'Model Size Trainable on 1,024 GPUs',
        paperScore: '1,000+ Billion (1 Trillion)',
        previousIterationScore: '10 Billion',
        baselineName: 'Standard Data Parallelism',
        relativeGain: '100x capacity increase',
        analysis: 'Allowed training a 1 Trillion parameter model on 1024 GPUs without running out of memory.',
      },
      {
        benchmarkName: 'Throughput Efficiency (TFLOPs/GPU)',
        paperScore: '52 TFLOPs/GPU (52% peak)',
        previousIterationScore: '30 TFLOPs/GPU',
        baselineName: 'Standard Model Parallelism',
        relativeGain: '+73% sustained throughput',
        analysis: 'Retained ultra-high GPU compute utilization while removing all redundant memory storage.',
      },
    ],
    alternatives: [
      {
        name: 'FSDP (Fully Sharded Data Parallel - PyTorch)',
        comparison: 'PyTorch native implementation of ZeRO-3 integrated directly into torch.distributed.fsdp.',
        tradeoff: 'FSDP is officially supported in upstream PyTorch without external DeepSpeed dependencies.',
      },
      {
        name: 'Megatron Tensor Parallelism',
        comparison: 'Slices individual matrix weights within a single node.',
        tradeoff: 'Tensor Parallelism requires high-bandwidth NVLink; ZeRO-1/2 works efficiently over standard network switches.',
      },
    ],
    replicationGuide: {
      difficulty: 'Intermediate',
      minHardware: '2x-4x GPUs (even consumer 2x RTX 3090/4090 with PyTorch FSDP)',
      libraries: ['deepspeed', 'torch.distributed.fsdp', 'accelerate'],
      datasets: ['OpenWebText', 'Wikitext-103'],
      reproducibilityRecipe: [
        'Configure deepspeed_config.json with "zero_optimization": {"stage": 2}.',
        'Wrap model using deepspeed.initialize(model=model, optimizer=optimizer).',
        'Compare GPU VRAM before and after ZeRO: observe memory dropping by ~60%.',
      ],
      githubOrRepo: 'https://github.com/microsoft/DeepSpeed',
    },
    codeSnippet: {
      language: 'python',
      filename: 'fsdp_zero3_setup.py',
      description: 'Configuring PyTorch native Fully Sharded Data Parallel (ZeRO-3 equivalent) with auto-wrap',
      code: `import torch
from torch.distributed.fsdp import (
    FullyShardedDataParallel as FSDP,
    ShardingStrategy,
    CPUOffload
)
from torch.distributed.fsdp.wrap import size_based_auto_wrap_policy
import functools

def wrap_model_fsdp(model: torch.nn.Module, offload_to_cpu: bool = False):
    """
    Shards optimizer, gradients, and model parameters across all data parallel ranks.
    Equivalent to ZeRO-Stage 3 with optional CPU offload.
    """
    # Auto-wrap submodules with more than 100k parameters
    auto_wrap_policy = functools.partial(
        size_based_auto_wrap_policy, min_num_params=100_000
    )
    
    fsdp_model = FSDP(
        model,
        sharding_strategy=ShardingStrategy.FULL_SHARD,  # ZeRO-3: shard weights, grads, opt states
        cpu_offload=CPUOffload(offload_params=offload_to_cpu),
        auto_wrap_policy=auto_wrap_policy,
        device_id=torch.cuda.current_device(),
    )
    return fsdp_model`,
    },
    interactiveToy: {
      type: 'generic_stepper',
      title: 'ZeRO Stages 1-2-3 Memory Partitioning Comparison',
      description: 'Compare VRAM consumption across Standard Data Parallelism, ZeRO-1, ZeRO-2, and ZeRO-3 for a 70B parameter model.',
    },
  },
  {
    id: 'paper-12',
    number: 12,
    title: 'Efficient Memory Management for Large Language Model Serving with PagedAttention',
    subtitle: 'vLLM: Paged Memory for Inference',
    category: 'systems-efficiency',
    arxivUrl: 'https://arxiv.org/abs/2309.06180',
    year: 2023,
    authors: 'Kwon, Li, Zhuang, Sheng, Zheng, Yu, Gonzalez, Zhang, Stoica',
    organization: 'UC Berkeley & LMSYS',
    tldr: 'Introduced PagedAttention and vLLM, drawing inspiration from virtual memory paging to eliminate 96% of KV-cache fragmentation and boost LLM serving throughput by 2x-4x.',
    intuitiveExplanation:
      'When an LLM generates words, it saves past Key and Value vectors in a "KV cache" so it does not have to recompute them. Before vLLM, serving systems pre-allocated huge contiguous blocks of GPU memory for each request in case it reached max context length (e.g. 2,048 tokens). Most queries only use 100 tokens, leaving the rest of the memory empty and wasted. Kwon et al. solved this by implementing the same concept used by computer operating systems: virtual memory paging. PagedAttention divides the KV cache into small, non-contiguous physical memory blocks (e.g. 16 tokens per block). New tokens simply grab the next free block from a lookup table, eliminating memory waste and enabling massive batch sizes.',
    novelty: [
      'PagedAttention: self-attention operator that reads non-contiguous KV cache memory blocks via logical-to-physical block tables.',
      'Reduced memory waste from 60%-80% fragmentation down to under 4%.',
      'Enabled copy-on-write memory sharing for complex sampling patterns like parallel decoding and beam search.',
      'Increased LLM serving throughput by 2x-4x over HuggingFace Transformers and Orca.',
    ],
    keyTechniques: [
      'Block Table logical-to-physical address translation',
      'Fixed-size KV blocks (typically block_size = 16 tokens)',
      'Copy-on-Write (CoW) page reference counting for prompt sharing',
      'Dynamic block allocation and asynchronous preemption',
    ],
    workflow: [
      {
        step: 1,
        title: 'Prompt Token Ingestion',
        description: 'As prompt tokens arrive, allocate minimal required physical blocks from free memory pool and record mappings in request Block Table.',
      },
      {
        step: 2,
        title: 'Paged Attention Kernel Execution',
        description: 'During decoding, gather non-contiguous Key and Value blocks via block table pointers; compute attention across scattered memory pages.',
        mathFormula: 'K_i = \\text{FetchPhysicalBlock}(\\text{BlockTable}[i / B]), \\quad B = 16',
      },
      {
        step: 3,
        title: 'On-Demand Page Allocation',
        description: 'When the current 16-token page fills up, allocate one new physical block from the global free list without copying existing memory.',
      },
      {
        step: 4,
        title: 'Zero-Copy Branching',
        description: 'For parallel sampling (e.g., n=5 completions), increment physical page reference counts without duplicating identical prompt KV cache.',
      },
    ],
    architecture: {
      coreConcepts: [
        'Centralized Block Manager tracking free physical pages on GPU',
        'Logical-to-Physical Block Table per active generation request',
        'Triton / CUDA custom kernel reading non-contiguous memory chunks',
      ],
      scalabilityMechanism:
        'Eliminates internal and external memory fragmentation, allowing serving engines to pack 2x to 4x more concurrent requests into GPU VRAM.',
      bottleneckSolved:
        'Severe KV-cache memory waste and low batch throughput in production LLM inference servers.',
    },
    trainingDynamics: {
      optimizerAndSchedule: 'N/A (Inference-time system engine).',
      lossFunction: 'N/A (Serving and memory management).',
      computeAndHardware: 'NVIDIA A100 (40GB/80GB) and RTX 3090/4090 GPUs running vLLM server.',
      stabilityTricks: 'Preemption via recomputation or CPU swap-out when all physical blocks are exhausted under heavy traffic bursts.',
    },
    empiricalBenchmarks: [
      {
        benchmarkName: 'Serving Throughput vs HuggingFace Text Generation Inference (TGI)',
        paperScore: '2.2x - 4.1x Higher Throughput',
        previousIterationScore: '1.0x Baseline',
        baselineName: 'Hugging Face TGI & FasterTransformer',
        relativeGain: '+220% - 410%',
        analysis: 'Handled 2x to 4x more concurrent requests per second under identical latency constraints.',
      },
      {
        benchmarkName: 'Memory Waste from Fragmentation',
        paperScore: '< 4% Wasted VRAM',
        previousIterationScore: '60% - 80% Wasted VRAM',
        baselineName: 'Static contiguous KV allocation',
        relativeGain: '95% reduction in wasted memory',
        analysis: 'Virtually eliminated internal and external fragmentation across arbitrary generation lengths.',
      },
    ],
    alternatives: [
      {
        name: 'FlashAttention-2',
        comparison: 'Tiling algorithm minimizing SRAM read/writes for dense contiguous attention.',
        tradeoff: 'FlashAttention optimizes compute kernel FLOPs; PagedAttention optimizes memory capacity and dynamic batching.',
      },
      {
        name: 'TensorRT-LLM (In-Flight Batching)',
        comparison: 'NVIDIA proprietary inference runtime featuring continuous batching.',
        tradeoff: 'TensorRT-LLM is optimized for NVIDIA hardware, while vLLM is open-source and flexible.',
      },
    ],
    replicationGuide: {
      difficulty: 'Introductory',
      minHardware: 'Single GPU with 16GB+ VRAM (RTX 4080/4090, T4, or A10G)',
      libraries: ['vllm', 'transformers', 'ray'],
      datasets: ['ShareGPT dataset', 'Alpaca prompts'],
      reproducibilityRecipe: [
        'Install: pip install vllm',
        'Spin up server: python -m vllm.entrypoints.openai.api_server --model mistralai/Mistral-7B-Instruct-v0.2',
        'Benchmark throughput using vllm benchmark_serving.py with 1,000 synthetic requests.',
        'Observe near-zero latency degradation under 50 concurrent streams.',
      ],
      githubOrRepo: 'https://github.com/vllm-project/vllm',
    },
    codeSnippet: {
      language: 'python',
      filename: 'paged_attention_simulator.py',
      description: 'Logical to physical page table allocation and memory management simulator',
      code: `class BlockManager:
    """Manages physical GPU memory blocks (pages) for non-contiguous KV-cache"""
    def __init__(self, num_blocks: int, block_size: int = 16):
        self.block_size = block_size
        self.free_blocks = list(range(num_blocks))
        # Maps request_id -> list of physical block indices
        self.block_tables = {}

    def allocate(self, request_id: str, num_tokens: int):
        num_blocks_needed = (num_tokens + self.block_size - 1) // self.block_size
        assert len(self.free_blocks) >= num_blocks_needed, "Out of GPU block memory!"
        
        allocated = [self.free_blocks.pop(0) for _ in range(num_blocks_needed)]
        self.block_tables[request_id] = allocated
        return allocated

    def append_token(self, request_id: str, current_token_count: int):
        """Allocate a new physical block only when current block is full"""
        if current_token_count % self.block_size == 0:
            assert len(self.free_blocks) > 0, "Out of GPU block memory!"
            new_block = self.free_blocks.pop(0)
            self.block_tables[request_id].append(new_block)
            print(f"Request {request_id}: Allocated new physical block #{new_block}")

    def free(self, request_id: str):
        blocks = self.block_tables.pop(request_id, [])
        self.free_blocks.extend(blocks)
        print(f"Request {request_id}: Returned {len(blocks)} blocks to free pool")`,
    },
    interactiveToy: {
      type: 'paged_blocks',
      title: 'PagedAttention Virtual Memory Block Simulator',
      description: 'Spawn concurrent user requests, watch logical tokens map into scattered physical memory pages, and see how memory waste stays under 4%.',
    },
  },
  {
    id: 'paper-13',
    number: 13,
    title: 'LoRA: Low-Rank Adaptation of Large Language Models',
    subtitle: 'Parameter-Efficient Fine-Tuning',
    category: 'systems-efficiency',
    arxivUrl: 'https://arxiv.org/abs/2106.09685',
    year: 2021,
    authors: 'Hu, Shen, Wallis, Allen-Zhu, Li, Wang, Wang, Chen',
    organization: 'Microsoft',
    tldr: 'Froze pre-trained model weights and injected trainable low-rank rank-decomposition matrices into attention layers, cutting trainable parameters by 10,000x and GPU memory by 3x.',
    intuitiveExplanation:
      'Fine-tuning a 175-billion parameter model normally requires updating and saving 175 billion new numbers for every single task. Hu et al. hypothesized that the weight changes during adaptation have a very low "intrinsic dimension". Instead of updating a huge d x d matrix W directly, LoRA freezes W and adds a parallel bypass composed of two tiny matrices: A (d x r) and B (r x d), where the rank r can be as small as 4 or 8. If d=4096 and r=8, 4096 x 4096 = 16.7 million parameters drops to 4096 x 8 + 8 x 4096 = 65,536 parameters (a 250x reduction!). At inference time, the delta matrix can be directly folded back into W with zero added inference latency.',
    novelty: [
      'Low-Rank Adaptation: decomposes weight updates Delta W = B * A with rank r << min(d_in, d_out).',
      'Freezes original model weights completely, enabling serving multiple customized task adapters on a single base model in memory.',
      'Zero inference latency: W_final = W_0 + (alpha / r) * (B * A) folded into weights at deployment.',
      'Matches or exceeds full fine-tuning performance across GPT-3, RoBERTa, and DeBERTa.',
    ],
    keyTechniques: [
      'Low-Rank Matrix Decomposition: Delta W = B * A (A initialized with Gaussian N(0, 1/r), B initialized to 0)',
      'Scaling hyperparameter: (alpha / r) * Delta W x',
      'Targeting Attention projection matrices (W_q, W_k, W_v, W_o)',
      'Dynamic adapter hot-swapping during inference',
    ],
    workflow: [
      {
        step: 1,
        title: 'Freeze Pre-trained Weights',
        description: 'Set requires_grad = False for all base model parameters W_0 in the network.',
      },
      {
        step: 2,
        title: 'Inject Low-Rank Pair (B and A)',
        description: 'For each target linear layer, instantiate matrix A in R^(r x d_in) and B in R^(d_out x r) with rank r in [4, 16].',
        mathFormula: 'h = W_0 x + \\Delta W x = W_0 x + \\frac{\\alpha}{r} B A x',
      },
      {
        step: 3,
        title: 'Forward & Gradient Backprop',
        description: 'Compute loss; backpropagation only computes gradients for B and A, avoiding optimizer state storage for W_0.',
      },
      {
        step: 4,
        title: 'Inference Weight Fusion (Zero Overhead)',
        description: 'Prior to serving, add Delta W = (alpha/r)*B*A directly to W_0; inference latency is identical to base model.',
        mathFormula: 'W_{\\text{deployed}} = W_0 + \\frac{\\alpha}{r} (B \\times A)',
      },
    ],
    architecture: {
      coreConcepts: [
        'Base model weights remain untouched in fp16 or 4-bit (QLoRA)',
        'Trainable adapter size is typically 0.01% to 0.1% of total model parameters',
        'Scale factor alpha stabilizes learning rate when varying rank r',
      ],
      scalabilityMechanism:
        'Reduces gradient checkpointing and optimizer memory from 16 bytes/param across full model down to just the tiny low-rank matrices.',
      bottleneckSolved:
        'Prohibitive VRAM storage and deployment costs of maintaining distinct full-model weight checkpoints for every client or task.',
    },
    trainingDynamics: {
      optimizerAndSchedule: 'AdamW with higher learning rate (1e-4 to 5e-4) compared to full fine-tuning.',
      lossFunction: 'Cross-entropy fine-tuning objective on task dataset.',
      computeAndHardware: 'Fine-tunes a 7B model on a single 16GB GPU (or 70B model with QLoRA on a 48GB GPU).',
      stabilityTricks: 'Initializing B to exactly zero ensures Delta W = 0 at step 0, preserving pre-trained behavior.',
    },
    empiricalBenchmarks: [
      {
        benchmarkName: 'GPT-3 175B Fine-Tuning Performance',
        paperScore: 'Matches / Exceeds Full Fine-Tuning',
        previousIterationScore: 'Full Fine-Tuning Baseline',
        baselineName: 'Full Parameter Fine-Tuning',
        relativeGain: 'Equal performance at 10,000x fewer params',
        analysis: 'Achieved 89.4% on WikiSQL with 37MB adapter file vs 350GB full checkpoint.',
      },
      {
        benchmarkName: 'GPU VRAM Footprint During Training',
        paperScore: '3x Reduction in VRAM',
        previousIterationScore: 'Standard VRAM usage',
        baselineName: 'Full parameter Adam training',
        relativeGain: '67% memory savings',
        analysis: 'Cut VRAM usage from 1.2TB down to ~350GB on GPT-3 175B without checkpointing.',
      },
    ],
    alternatives: [
      {
        name: 'Prefix Tuning / Prompt Tuning',
        comparison: 'Prepends learnable virtual continuous tokens to prompt sequences.',
        tradeoff: 'Reduces available context window length and is often harder to optimize than LoRA.',
      },
      {
        name: 'QLoRA (Dettmers et al. 2023)',
        comparison: 'Quantizes base model W_0 to 4-bit NormalFloat (NF4) with double quantization and paged optimizers.',
        tradeoff: 'Enables fine-tuning a 65B model on a single 48GB workstation GPU.',
      },
    ],
    replicationGuide: {
      difficulty: 'Introductory',
      minHardware: 'Single consumer GPU with 8GB - 12GB VRAM (RTX 3060, 4060, T4)',
      libraries: ['peft', 'transformers', 'bitsandbytes', 'accelerate'],
      datasets: ['OpenAssistant', 'Alpaca-Cleaned', 'GSM8K'],
      reproducibilityRecipe: [
        'Load model: AutoModelForCausalLM.from_pretrained("meta-llama/Llama-3-8B", device_map="auto").',
        'Configure PEFT: LoraConfig(r=8, lora_alpha=16, target_modules=["q_proj", "v_proj"], lora_dropout=0.05).',
        'Wrap model: model = get_peft_model(model, config); print_trainable_parameters().',
        'Train with Hugging Face SFTTrainer for 1 epoch on custom dataset.',
      ],
      githubOrRepo: 'https://github.com/microsoft/LoRA',
    },
    codeSnippet: {
      language: 'python',
      filename: 'lora_linear_layer.py',
      description: 'LoRA Linear Layer implementation with rank decomposition and weight merging',
      code: `import torch
import torch.nn as nn
import math

class LoRALinear(nn.Module):
    def __init__(self, in_features: int, out_features: int, r: int = 8, lora_alpha: float = 16.0):
        super().__init__()
        # 1. Base linear layer (frozen)
        self.base_layer = nn.Linear(in_features, out_features, bias=False)
        self.base_layer.weight.requires_grad = False
        
        # 2. Low-rank matrices A and B
        self.r = r
        self.scaling = lora_alpha / r
        self.lora_A = nn.Parameter(torch.empty(r, in_features))
        self.lora_B = nn.Parameter(torch.zeros(out_features, r))
        
        # Initialize A with Gaussian noise; B with exact zeros
        nn.init.kaiming_uniform_(self.lora_A, a=math.sqrt(5))
        nn.init.zeros_(self.lora_B)

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        # Base forward pass
        base_out = self.base_layer(x)
        # Low-rank bypass: (x * A^T) * B^T
        lora_out = (x @ self.lora_A.t()) @ self.lora_B.t() * self.scaling
        return base_out + lora_out

    def merge_weights(self):
        """Fuses low-rank delta directly into base weights for zero-overhead deployment"""
        with torch.no_grad():
            self.base_layer.weight += (self.lora_B @ self.lora_A) * self.scaling`,
    },
    interactiveToy: {
      type: 'lora_rank',
      title: 'LoRA Low-Rank Parameter Savings Calculator',
      description: 'Adjust base layer dimensions (d_in, d_out) and rank r to see parameters compress by >99% while calculating matrix multiplication memory savings.',
    },
  },
];
