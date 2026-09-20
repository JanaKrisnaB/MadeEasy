import { Paper } from '../types';

export const PAPERS_43_TO_50: Paper[] = [
  {
    id: 'paper-43',
    number: 43,
    title: 'Robust Speech Recognition via Large-Scale Weak Supervision (Whisper)',
    subtitle: 'Universal Multilingual Speech Recognition & Translation at 680k Hour Scale',
    category: 'alignment-multimodal',
    arxivUrl: 'https://arxiv.org/abs/2212.04356',
    year: 2022,
    authors: 'Radford, Kim, Xu, Brockman, McLeavey, Sutskever (OpenAI)',
    organization: 'OpenAI',
    tldr: 'Trained a standard encoder-decoder Transformer on 680,000 hours of noisy web audio, demonstrating that weak supervision across vast scales eliminates the need for clean domain-specific speech pipelines.',
    intuitiveExplanation:
      'Historically, speech recognition systems relied on heavily preprocessed, acoustic datasets recorded in pristine studios (like LibriSpeech). Consequently, real-world systems failed when encountering background chatter, YouTube audio, heavy accents, or slang. Whisper discarded specialized acoustic speech pipelines and phonetic hidden Markov models entirely. Instead, OpenAI trained a pure, vanilla sequence-to-sequence Transformer directly on 680,000 hours of weakly supervised audio scraped from the public web. Audio is converted to a 80-channel log-Mel spectrogram, passed through a convolutional stem, and fed to a standard Transformer encoder-decoder that predicts unified multitask tokens (transcribe, translate, timestamps, language ID) in a single stream. The result was unprecedented zero-shot robustness across real-world audio environments.',
    novelty: [
      'Scale over cleanliness: 680,000 hours of weakly supervised internet audio replacing small curated datasets.',
      'Multitask autoregressive decoding: Single model predicting language identification, voice activity detection, transcription, translation to English, and token timestamps.',
      'Zero-shot generalization matching supervised models trained specifically on target academic benchmarks.',
      'Open-weights release that became the universal speech-to-text standard across the global AI ecosystem.',
    ],
    keyTechniques: [
      '80-channel log-Mel spectrogram representation (25ms window, 10ms hop)',
      '1D Convolutional Stems with stride 2 for temporal subsampling',
      'Unified Multitask Token Grammar (<|transcribe|>, <|translate|>, <|notimestamps|>)',
      'Temperature fallback decoding (sampling at T=0.2, 0.4, 0.6 if repetition loops occur)',
    ],
    workflow: [
      {
        step: 1,
        title: 'Audio Resampling & Log-Mel Spectrogram',
        description:
          'Raw audio is resampled to 16 kHz and converted into an 80-channel log-magnitude Mel spectrogram over 30-second windows.',
        mathFormula: 'S_{\\text{mel}} = \\log\\left(\\text{MelScale}\\left(|\\text{STFT}(x)|^2\\right) + \\epsilon\\right) \\in \\mathbb{R}^{80 \\times 3000}',
      },
      {
        step: 2,
        title: 'Convolutional Stem & Transformer Encoder',
        description:
          'Two 1D convolutional layers with stride 2 reduce the time dimension by 4x to 750 frames, followed by standard Transformer encoder layers.',
        mathFormula: 'Z = \\text{TransformerEncoder}\\left(\\text{Conv1D}_{s=2}(\\text{Conv1D}_{s=2}(S_{\\text{mel}}))\\right)',
      },
      {
        step: 3,
        title: 'Multitask Prompt Sequence Formatting',
        description:
          'Decoder is prompted with special control tokens specifying start-of-transcript, language ID, task (transcribe or translate), and timestamp mode.',
        mathFormula: 'y_{\\text{prefix}} = [\\langle|\\text{startoftranscript}|\\rangle, \\langle|\\text{es}|\\rangle, \\langle|\\text{transcribe}|\\rangle, \\langle|\\text{notimestamps}|\\rangle]',
      },
      {
        step: 4,
        title: 'Autoregressive Decoding with Fallback',
        description:
          'Decoder autoregressively predicts byte-pair encoded text tokens and time boundary tokens interleaved with speech tokens.',
        mathFormula: 'P(y_t | y_{<t}, Z) = \\text{Softmax}\\left(W_{\\text{vocab}} \\text{Decoder}(y_{<t}, Z)\\right)',
      },
    ],
    architecture: {
      coreConcepts: [
        'Standard Encoder-Decoder Transformer with sinusoidal position embeddings',
        'Whisper Large-v3: 32 encoder layers, 32 decoder layers, d_model=1280, 20 heads (1.55B parameters)',
        'Whisper Medium: 24 layers, d_model=1024, 16 heads (769M parameters)',
        'Whisper Small: 12 layers, d_model=768, 12 heads (244M parameters)',
      ],
      scalabilityMechanism:
        'Standard Transformer encoder-decoder scales predictably with compute; audio subsampling ensures 30 seconds of audio maps to just 750 tokens.',
      bottleneckSolved:
        'Eliminated fragile specialized acoustic/pronunciation models in speech and solved out-of-domain transcription failure in noisy environments.',
    },
    trainingDynamics: {
      optimizerAndSchedule: 'AdamW with beta1=0.9, beta2=0.98, cosine learning rate decay with linear warmup.',
      lossFunction: 'Cross-entropy on target text and timestamp tokens.',
      computeAndHardware: 'Cluster of NVIDIA A100 GPUs, trained in FP16 mixed precision with dynamic loss scaling.',
      stabilityTricks:
        'SpecAugment audio masking during training, heuristic audio filtering against machine-translated audio, and temperature fallback during beam search.',
    },
    empiricalBenchmarks: [
      {
        benchmarkName: 'LibriSpeech Test-Clean Word Error Rate (Zero-Shot)',
        paperScore: '2.5% WER',
        previousIterationScore: '5.2% WER',
        baselineName: 'Supervised wav2vec 2.0 (Zero-Shot Transfer)',
        relativeGain: '-51.9% (lower is better)',
        analysis: 'Matches human transcriber accuracy without ever being fine-tuned on the LibriSpeech training dataset.',
      },
      {
        benchmarkName: 'Fleurs Multilingual Translation BLEU',
        paperScore: '29.1 BLEU',
        previousIterationScore: '18.4 BLEU',
        baselineName: 'Prior Open Speech-to-Text Baselines',
        relativeGain: '+58.1%',
        analysis: 'High translation fidelity across 96 languages directly from spoken audio into English.',
      },
    ],
    alternatives: [
      {
        name: 'wav2vec 2.0 / Conformer',
        comparison: 'wav2vec uses self-supervised contrastive pretraining followed by CTC loss fine-tuning.',
        tradeoff: 'Conformer requires domain-specific clean tuning; Whisper generalizes out-of-the-box to arbitrary accented audio with unified multitask tokens.',
      },
    ],
    replicationGuide: {
      difficulty: 'Introductory',
      minHardware: '1x consumer GPU (6GB VRAM for Whisper Small, 10GB for Large-v3)',
      libraries: ['whisper', 'torch', 'ffmpeg-python', 'transformers'],
      datasets: ['Any raw .mp3, .wav, or .m4a audio file'],
      reproducibilityRecipe: [
        'pip install openai-whisper.',
        'import whisper; model = whisper.load_model("large-v3").',
        'result = model.transcribe("audio.mp3").',
      ],
      githubOrRepo: 'https://github.com/openai/whisper',
    },
    codeSnippet: {
      language: 'python',
      filename: 'whisper_transcription.py',
      description: 'Running zero-shot transcription with Whisper Large-v3.',
      code: `import whisper

# Load Whisper Large-v3 model
model = whisper.load_model("large-v3")

# Transcribe with automatic language detection and word timestamps
result = model.transcribe(
    "recording.wav",
    word_timestamps=True,
    beam_size=5,
    temperature=(0.0, 0.2, 0.4), # Temperature fallback
)

print(f"Detected Language: {result['language']}")
print("Transcript:", result["text"])
for segment in result["segments"][:3]:
    print(f"[{segment['start']:.2f}s -> {segment['end']:.2f}s]: {segment['text']}")`,
    },
    interactiveToy: {
      type: 'attention_matrix',
      title: 'Cross-Attention Audio-to-Text Alignment Map',
      description: 'Observe how cross-attention heads in the Transformer decoder align acoustic speech frames directly to generated text tokens.',
    },
  },
  {
    id: 'paper-44',
    number: 44,
    title: 'Fast Inference from Transformers via Speculative Decoding',
    subtitle: 'Lossless 2-3x Inference Acceleration via Draft Speculation & Rejection Sampling',
    category: 'systems-efficiency',
    arxivUrl: 'https://arxiv.org/abs/2211.17192',
    year: 2023,
    authors: 'Leviathan, Kalman, Matias (Google Research)',
    organization: 'Google Research',
    tldr: 'Accelerates autoregressive LLM inference by 2x to 3x with zero change to the model output distribution, using a small draft model to speculate tokens and the large target model to verify them in a single forward pass.',
    intuitiveExplanation:
      'Generating tokens autoregressively is excruciatingly slow not because of arithmetic compute, but because of memory bandwidth: for every single token generated, all billions of model parameters must be transferred from high-bandwidth memory (HBM) to the GPU compute cores (arithmetic intensity < 1). Speculative Decoding breaks this memory bottleneck. A tiny, lightweight "draft model" (e.g. 1B) runs fast and cheaply guesses K candidate tokens. Then, the giant "target model" (e.g. 70B) executes a SINGLE parallel forward pass across all K candidate tokens at once. Using a modified rejection sampling formula, the target model accepts tokens that match its probability distribution and rejects divergence. Since verifying K tokens takes virtually the same time as generating 1 token on GPU, speculative decoding yields 2-3x faster generation with mathematical identity to target model outputs.',
    novelty: [
      'Lossless inference acceleration: mathematically guarantees that the output token distribution is identical to the target model alone.',
      'Parallel token verification: evaluates K autoregressive token positions simultaneously in a single forward pass.',
      'Modified rejection sampling algorithm that smoothly handles distribution discrepancies between draft and target models.',
      'Universal applicability: works with any autoregressive Transformer without retraining or quantization.',
    ],
    keyTechniques: [
      'Small Draft Model Speculation (depth K)',
      'Parallel Forward Pass Verification on Target Model',
      'Modified Rejection Sampling Acceptance Criterion',
      'Adjusted Residual Recovery Distribution for Rejected Tokens',
    ],
    workflow: [
      {
        step: 1,
        title: 'Draft Model Speculative Rollout',
        description:
          'A small draft model M_q autoregressively samples K candidate continuation tokens sequentially at high speed.',
        mathFormula: 'x_{t+1}, x_{t+2}, \\dots, x_{t+K} \\sim M_q(\\cdot | x_{\\le t})',
      },
      {
        step: 2,
        title: 'Target Model Parallel Evaluation',
        description:
          'The large target model M_p executes a single parallel forward pass on all K candidate tokens, computing logits across all positions simultaneously.',
        mathFormula: 'p_1, p_2, \\dots, p_{K+1} = M_p(x_{\\le t+K})',
      },
      {
        step: 3,
        title: 'Rejection Sampling Acceptance Test',
        description:
          'Each token is accepted with probability min(1, p(x) / q(x)). If accepted, the token is kept and validation proceeds to the next candidate.',
        mathFormula: 'r_i \\sim U(0, 1) \\le \\min\\left(1, \\frac{p(x_{t+i})}{q(x_{t+i})}\\right)',
      },
      {
        step: 4,
        title: 'Recovery Sampling on Rejection',
        description:
          'If candidate token i is rejected, generation stops and a replacement token is sampled from the positive difference distribution (p - q)_+.',
        mathFormula: 'x_{t+i} \\sim \\frac{\\max(0, p(x) - q(x))}{\\sum_x \\max(0, p(x) - q(x))}',
      },
    ],
    architecture: {
      coreConcepts: [
        'Target Model M_p (large, high capacity, memory bandwidth constrained)',
        'Draft Model M_q (small, sharing same vocabulary and tokenizer)',
        'Speculative lookahead depth K (typically 3 to 6 tokens)',
      ],
      scalabilityMechanism:
        'Memory bandwidth is amortized: loading 70B weights once to process 5 tokens yields 5x higher arithmetic intensity than loading 70B weights for 1 token.',
      bottleneckSolved:
        'Eliminated the memory-bandwidth latency wall in autoregressive decoding without sacrificing a single bit of model precision.',
    },
    trainingDynamics: {
      optimizerAndSchedule: 'N/A (Pure inference acceleration algorithm, zero training required).',
      lossFunction: 'Exact mathematical equality: P_speculative(x) = P_target(x) everywhere.',
      computeAndHardware: 'Standard GPU servers (A100, H100, L40S) running serving engines like vLLM or SGLang.',
      stabilityTricks:
        'Dynamic lookahead depth adaptation: reducing K when acceptance rates drop on unpredictable domains (like code or math).',
    },
    empiricalBenchmarks: [
      {
        benchmarkName: 'Wall-Clock Speedup (Chinchilla 70B with 4B Draft)',
        paperScore: '2.37x Faster',
        previousIterationScore: '1.0x Baseline',
        baselineName: 'Standard Autoregressive Decoding',
        relativeGain: '+137% speedup',
        analysis: 'Achieved over 2x throughput acceleration while preserving 100% output token equivalence.',
      },
      {
        benchmarkName: 'Average Accepted Tokens per Step (alpha)',
        paperScore: '3.1 tokens / step',
        previousIterationScore: '1.0 token / step',
        baselineName: 'Standard Decoding',
        relativeGain: '+210%',
        analysis: 'High acceptance rates on natural language, punctuation, and syntactically rigid code constructs.',
      },
    ],
    alternatives: [
      {
        name: 'Medusa / Eagle / Prompt Lookup Decoding',
        comparison: 'Medusa uses multiple decoding heads attached to the final layer of the target model instead of a draft model.',
        tradeoff: 'Speculative decoding uses a distinct draft model; Medusa avoids draft model management at the cost of additional head training.',
      },
    ],
    replicationGuide: {
      difficulty: 'Intermediate',
      minHardware: 'Any GPU capable of hosting target + draft model (e.g. RTX 4090 for Llama-3-8B + Llama-3-1B)',
      libraries: ['vllm', 'sglang', 'transformers', 'torch'],
      datasets: ['Any language inference prompt'],
      reproducibilityRecipe: [
        'Run vllm with --speculative-model meta-llama/Llama-3.2-1B on top of meta-llama/Meta-Llama-3-8B.',
        'Observe ~2x tokens/second throughput increase with zero degradation in benchmark accuracy.',
      ],
      githubOrRepo: 'https://github.com/vllm-project/vllm',
    },
    codeSnippet: {
      language: 'python',
      filename: 'speculative_decoding.py',
      description: 'Core speculative rejection sampling algorithm in PyTorch.',
      code: `import torch

def speculative_step(target_model, draft_model, prefix, K=4):
    """
    Executes one speculative decoding step.
    target_model: large LLM (p)
    draft_model: small fast LLM (q)
    prefix: [1, seq_len] tensor of current context tokens
    """
    # 1. Draft model generates K speculative tokens sequentially
    draft_tokens = []
    draft_probs = []
    curr = prefix.clone()
    for _ in range(K):
        with torch.no_grad():
            logits = draft_model(curr)[:, -1, :]
            prob = torch.softmax(logits, dim=-1)
            next_token = torch.multinomial(prob, num_samples=1)
            draft_tokens.append(next_token)
            draft_probs.append(prob)
            curr = torch.cat([curr, next_token], dim=1)
            
    # 2. Target model evaluates ALL candidate tokens in ONE parallel forward pass
    with torch.no_grad():
        target_logits = target_model(curr)[:, prefix.shape[1]-1:-1, :]
        target_probs = torch.softmax(target_logits, dim=-1)
        
    # 3. Rejection sampling
    accepted_tokens = []
    for i in range(K):
        t = draft_tokens[i].item()
        p = target_probs[0, i, t].item()
        q = draft_probs[i][0, t].item()
        
        if torch.rand(1).item() <= min(1.0, p / (q + 1e-10)):
            accepted_tokens.append(draft_tokens[i])
        else:
            # Rejection: sample corrected token from max(0, p - q)
            diff = torch.clamp(target_probs[0, i] - draft_probs[i][0], min=0)
            corrected_token = torch.multinomial(diff / diff.sum(), 1)
            accepted_tokens.append(corrected_token)
            break
            
    return torch.cat(accepted_tokens, dim=-1)`,
    },
    interactiveToy: {
      type: 'test_time_budget',
      title: 'Speculative Decoding Acceptance Simulator',
      description: 'Simulate how target and draft model agreement rates (alpha) dictate the total token throughput acceleration factor.',
    },
  },
  {
    id: 'paper-45',
    number: 45,
    title: 'SGLang: Efficient Execution of Structured Language Model Programs',
    subtitle: 'RadixAttention and Tree-Structured KV Cache Sharing for Complex Workflows',
    category: 'systems-efficiency',
    arxivUrl: 'https://arxiv.org/abs/2312.07104',
    year: 2024,
    authors: 'Zheng, Yin, Xie, Huang, Sun, Stoica, Gonzalez, Sheng (LMSYS Organization & UC Berkeley)',
    organization: 'LMSYS Organization & UC Berkeley',
    tldr: 'Introduced RadixAttention, which maintains the Key-Value cache as a dynamic radix tree across multiple inference requests, slashing prompt processing time by up to 80% for multi-turn chat, few-shot prompts, and agentic workflows.',
    intuitiveExplanation:
      'In modern LLM applications (like multi-turn chatbots, autonomous agents, code analyzers, and few-shot reasoning), prompt prefixes are heavily shared across requests. For example, a 5-turn chat repeats turns 1 through 4 every time the user sends message 5. Traditional serving engines treat each request independently and recompute attention for all previous tokens from scratch, burning massive GPU compute. SGLang treats the entire GPU memory as a dynamic Radix Tree of token prefixes. When a request arrives, SGLang performs a longest-prefix match in the tree in microseconds, instantly reuses all matching Key-Value cache blocks without running a single GPU FLOP, and only computes new tokens. Combined with structured constrained decoding (regex and JSON schemas), SGLang became the fastest serving framework in the open-source ecosystem.',
    novelty: [
      'RadixAttention: Tree-structured KV-cache management that persists, reuses, and evicts prefix caches across multiple requests and workflows.',
      'Frontier structured decoding: Compressing JSON schemas and regular expressions into finite-state machines that guide token generation without CPU slowdown.',
      'Multi-call program optimization: Automatic scheduling and parallelization of multi-agent prompt loops.',
      'Demonstrates up to 5x higher serving throughput on multi-turn conversations and agentic evaluation benchmarks.',
    ],
    keyTechniques: [
      'Radix Tree KV Cache Indexing',
      'Least Recently Used (LRU) Prefix Eviction in GPU Memory',
      'Token-Level Longest Common Prefix Matching',
      'Jump-Forward Constrained Decoding with Finite State Machines (FSM)',
    ],
    workflow: [
      {
        step: 1,
        title: 'Incoming Request Prefix Match',
        description:
          'When an incoming prompt is received, SGLang tokenizes the text and performs a prefix search on the global Radix Tree.',
        mathFormula: '\\text{prefix} = \\text{LongestPrefixMatch}(\\mathcal{T}_{\\text{radix}}, [t_1, t_2, \\dots, t_N])',
      },
      {
        step: 2,
        title: 'Zero-FLOP KV Cache Retrieval',
        description:
          'The KV cache blocks corresponding to the matched prefix (length M <= N) are pinned in GPU memory without re-computation.',
        mathFormula: 'K_{\\text{reused}} = K_{[1:M]}, \\quad V_{\\text{reused}} = V_{[1:M]}',
      },
      {
        step: 3,
        title: 'Incremental Attention Prefill',
        description:
          'Only the remaining suffix tokens (from M+1 to N) are passed to the GPU for attention prefilling.',
        mathFormula: 'K_{[M+1:N]}, V_{[M+1:N]} = \\text{PrefillForward}(x_{[M+1:N]}, K_{\\text{reused}}, V_{\\text{reused}})',
      },
      {
        step: 4,
        title: 'Radix Tree Mutation & Eviction',
        description:
          'The newly generated sequence is inserted into the Radix Tree as a new branch. When GPU memory is full, an LRU policy prunes the oldest leaf nodes.',
        mathFormula: '\\mathcal{T}_{\\text{radix}} \\leftarrow \\text{Insert}(\\mathcal{T}_{\\text{radix}}, [t_1, \\dots, t_{N+L}])',
      },
    ],
    architecture: {
      coreConcepts: [
        'Radix Tree node represents a sequence of tokens mapping to allocated physical GPU KV cache blocks',
        'Forking branches naturally represent agent tool calls, tree search, and multiple candidate generations',
        'Integrated with FlashInfer high-performance CUDA attention kernels',
      ],
      scalabilityMechanism:
        'Prefix cache hit rates exceed 70-80% in multi-turn chat and benchmark evaluation, converting what would be quadratic attention prefill into instantaneous O(1) memory pointer lookup.',
      bottleneckSolved:
        'Eliminated redundant prompt computation across multi-turn chats, agentic loops, and few-shot evaluation suites.',
    },
    trainingDynamics: {
      optimizerAndSchedule: 'N/A (Runtime execution engine and serving system).',
      lossFunction: 'Exact precision preservation with standard FP16/BF16/FP8 attention kernels.',
      computeAndHardware: 'NVIDIA Ampere, Ada, Hopper GPUs with high-bandwidth memory (A100, H100, L40S).',
      stabilityTricks:
        'Reference-counted lock mechanisms on tree nodes to allow safe concurrent reads from multiple active requests.',
    },
    empiricalBenchmarks: [
      {
        benchmarkName: 'Multi-Turn Chat Serving Throughput (Llama-70B)',
        paperScore: '240 tokens/sec',
        previousIterationScore: '78 tokens/sec',
        baselineName: 'vLLM (without RadixAttention)',
        relativeGain: '+207% throughput',
        analysis: 'Radix cache reuse eliminates prompt prefill latency across conversational turns.',
      },
      {
        benchmarkName: 'Agentic Tool Use Benchmarks (LMSYS Arena Hard)',
        paperScore: '5.2x Speedup',
        previousIterationScore: '1.0x Baseline',
        baselineName: 'Standard Serving Engine',
        relativeGain: '+420% speedup',
        analysis: 'Massive speedup on agent workflows where system prompts and history are repeated dozens of times.',
      },
    ],
    alternatives: [
      {
        name: 'vLLM PagedAttention',
        comparison: 'PagedAttention manages KV cache like operating system virtual memory paging.',
        tradeoff: 'SGLang builds on top of paged allocation by introducing the Radix Tree hierarchy, enabling automatic cross-request prefix reuse and tree-search branching.',
      },
    ],
    replicationGuide: {
      difficulty: 'Intermediate',
      minHardware: '1x RTX 4090 or A100 GPU',
      libraries: ['sglang', 'torch', 'flashinfer', 'triton'],
      datasets: ['Any conversational, agentic, or JSON benchmark'],
      reproducibilityRecipe: [
        'pip install "sglang[all]".',
        'python -m sglang.launch_server --model-path meta-llama/Meta-Llama-3-8B-Instruct --port 30000.',
        'Send multi-turn requests and observe near-instantaneous response times on turn 2+.',
      ],
      githubOrRepo: 'https://github.com/sgl-project/sglang',
    },
    codeSnippet: {
      language: 'python',
      filename: 'sglang_usage.py',
      description: 'Structured JSON decoding and multi-turn cache sharing with SGLang.',
      code: `import sglang as sgl

@sgl.function
def structured_extraction(s, text):
    s += "Extract key facts from this article:\\n"
    s += text + "\\n"
    # SGLang automatically reuses the KV cache for repeated schema requests
    s += "Return strictly valid JSON: "
    s += sgl.gen(
        "json_output",
        regex=r'\\{\\s*"entities":\\s*\\["[^"]*"(?:,\\s*"[^"]*")*\\],\\s*"sentiment":\\s*"(?:pos|neg)"\\}'
    )

# Run with SGLang engine
# state = structured_extraction.run(text="...", stream=False)
# print(state["json_output"])`,
    },
    interactiveToy: {
      type: 'paged_blocks',
      title: 'Radix Tree KV-Cache Prefix Reuse Simulator',
      description: 'Interact with branching conversation trees to visualize how RadixAttention eliminates redundant prompt FLOPs.',
    },
  },
  {
    id: 'paper-46',
    number: 46,
    title: 'Gemini 1.5: Unlocking Multimodal Understanding Across Millions of Tokens',
    subtitle: 'Ultra-Long Context Mixture-of-Experts with Near-Perfect Recall',
    category: 'architecture-scaling',
    arxivUrl: 'https://arxiv.org/abs/2403.05530',
    year: 2024,
    authors: 'Gemini Team (Google)',
    organization: 'Google DeepMind & Google',
    tldr: 'Engineered a multimodal Mixture-of-Experts foundation model capable of processing up to 10 million tokens of context with 99%+ recall on needle-in-a-haystack retrieval across video, audio, code, and text.',
    intuitiveExplanation:
      'For years, the maximum context window of LLMs hovered between 2,048 and 32,000 tokens due to the quadratic O(N^2) memory and compute scaling of attention, as well as the catastrophic retrieval degradation known as the "lost in the middle" phenomenon. Gemini 1.5 shattered this limit by combining an ultra-sparse Mixture-of-Experts (MoE) architecture with innovative position embedding scaling and hardware-optimized attention. Gemini 1.5 Pro routinely processes 1,000,000 to 10,000,000 tokens in production. Crucially, it achieved near-perfect (99.7%+) retrieval on needle-in-a-haystack tests across the entire context span, allowing it to digest an entire 1-hour video, 11 hours of audio, 30,000 lines of code, or the entire Apollo 11 flight transcripts in a single prompt and reason across them.',
    novelty: [
      'Scale context window to 10 million tokens while preserving near 100% retrieval accuracy.',
      'Multimodal long-context processing: treats video frames, audio spectrograms, documents, and codebases seamlessly in a unified context window.',
      'Demonstrated in-context learning of an entire new human language (Kalamang, spoken by <200 people) purely from a dictionary and grammar book in prompt.',
      'Sparse Mixture-of-Experts architecture that keeps per-token inference compute low while maintaining frontier reasoning capability.',
    ],
    keyTechniques: [
      'Sparse Multimodal Mixture-of-Experts (MoE)',
      'High-Resolution Long-Context Needle In A Haystack (NIAH) benchmarking',
      'Continuous Audio & Video Tokenization into Unified Attention',
      'Interpolated Positional Embeddings for Multi-Million Token Ranges',
    ],
    workflow: [
      {
        step: 1,
        title: 'Unified Multimodal Tokenization',
        description:
          'Audio (1 sec = 25 tokens), Video (1 fps = 256 tokens/frame), and text are converted into a single homogeneous sequence of embedding vectors.',
        mathFormula: 'X = [\\text{TextTokens}; \\, \\text{AudioTokens}; \\, \\text{VideoTokens}] \\in \\mathbb{R}^{B \\times S \\times d}, \\quad S \\le 10{,}000{,}000',
      },
      {
        step: 2,
        title: 'Position Coordinate Expansion',
        description:
          'Position representations are frequency-interpolated to preserve pairwise relative distance distinction across millions of token intervals.',
        mathFormula: '\\theta_k = \\theta_0^{-2k/d} \\cdot \\alpha(S), \\quad \\alpha(S) \\text{ adapted for } S = 10^7',
      },
      {
        step: 3,
        title: 'Sparse MoE Layer Routing',
        description:
          'Feed-forward layers route tokens to a subset of specialized experts, maintaining low per-token inference latency regardless of total parameter scale.',
        mathFormula: 'y = \\sum_{i \\in \\text{TopK}(g(x), k)} g_i(x) \\cdot E_i(x)',
      },
      {
        step: 4,
        title: 'Cross-Modal Long-Range Attention',
        description:
          'Attention heads compute pairwise affinities across millions of tokens, locating specific needles in distant video frames or document paragraphs.',
        mathFormula: 'A_{ij} = \\text{Softmax}\\left(\\frac{q_i k_j^T}{\\sqrt{d_k}}\\right)',
      },
    ],
    architecture: {
      coreConcepts: [
        'Multimodal Transformer decoder with sparse Mixture-of-Experts feedforward layers',
        'Native context window: 1M tokens standard, scalable to 10M tokens',
        'Uniform multimodal integration (native image, audio, video, code)',
      ],
      scalabilityMechanism:
        'Trained on Google TPUv5e and TPUv5p supercomputer clusters using advanced Megatron tensor, pipeline, and context parallelism across thousands of chips.',
      bottleneckSolved:
        'Eradicated the context window limit and the "lost in the middle" retrieval degradation in long-context AI models.',
    },
    trainingDynamics: {
      optimizerAndSchedule: 'Custom Adam-variant with multi-stage context length extension curricula.',
      lossFunction: 'Multimodal cross-entropy next-token prediction across text, audio, and visual tokens.',
      computeAndHardware: 'Google TPU v5e and v5p pods connected via Optical Circuit Switches (OCS).',
      stabilityTricks:
        'Staged curriculum training: starting with 32k context, incrementally extending to 128k, 1M, and multi-million tokens with synthetic retrieval supervision.',
    },
    empiricalBenchmarks: [
      {
        benchmarkName: '1 Million Token Needle-In-A-Haystack (Text)',
        paperScore: '99.7% Accuracy',
        previousIterationScore: '54.2% Accuracy',
        baselineName: 'Prior Open-Source Long-Context LLMs',
        relativeGain: '+83.9%',
        analysis: 'Virtually 100% recall across the entire 1M token window regardless of where the target fact is placed.',
      },
      {
        benchmarkName: 'Video Needle-In-A-Haystack (1 Hour Video)',
        paperScore: '99.3% Accuracy',
        previousIterationScore: 'N/A (Failed to load)',
        baselineName: 'Prior Vision-Language Models',
        relativeGain: 'New Capability',
        analysis: 'Able to pinpoint an exact 1-second visual event across 10,500 video frames in a single prompt.',
      },
    ],
    alternatives: [
      {
        name: 'Retrieval-Augmented Generation (RAG)',
        comparison: 'RAG chunks documents and retrieves top-k passages via vector embeddings.',
        tradeoff: 'RAG misses cross-document synthesis and non-text modalities; Gemini 1.5 loads the entire corpus into active attention memory simultaneously.',
      },
    ],
    replicationGuide: {
      difficulty: 'Supercluster',
      minHardware: 'Google Cloud TPU v5e / v5p or multi-node H100 cluster with Context Parallelism',
      libraries: ['google-genai', 'torch'],
      datasets: ['Web text, video streams, audio podcasts, GitHub repositories'],
      reproducibilityRecipe: [
        'Access Gemini 1.5 Pro via Google AI Studio API with up to 2M token context window.',
        'Upload full PDF books or 45-minute video files directly into the prompt.',
      ],
      githubOrRepo: 'https://ai.google.dev/',
    },
    codeSnippet: {
      language: 'python',
      filename: 'gemini_long_context.py',
      description: 'Prompting Gemini 1.5 Pro with a 500,000 token document using the Google GenAI SDK.',
      code: `import os
from google import genai

# Initialize Google GenAI client
client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])

# Upload large research document (e.g. 100+ page PDF or entire codebase)
# Gemini 1.5 natively supports up to 2,000,000 tokens of context!
response = client.models.generate_content(
    model="gemini-1.5-pro",
    contents=[
        "Compare the mathematical loss functions between all 52 research papers in this dataset:",
        genai.types.Part.from_bytes(data=pdf_bytes, mime_type="application/pdf")
    ]
)

print(response.text)`,
    },
    interactiveToy: {
      type: 'attention_matrix',
      title: 'Needle In A Haystack Multi-Million Token Heatmap',
      description: 'Explore the 100x100 grid evaluating needle retrieval accuracy across document depths from token 0 to token 1,000,000.',
    },
  },
  {
    id: 'paper-47',
    number: 47,
    title: 'Highly Accurate Protein Structure Prediction with AlphaFold',
    subtitle: 'The Evoformer & Invariant Point Attention Architecture that Solved Protein Folding',
    category: 'latent-world-models',
    arxivUrl: 'https://www.nature.com/articles/s41586-021-03819-2',
    year: 2021,
    authors: 'Jumper, Evans, Pritzel, Green, Figurnov, Ronneberger et al. (DeepMind)',
    organization: 'Google DeepMind',
    tldr: 'Solved the 50-year-old grand challenge of predicting 3D protein atomic structures directly from 1D amino acid sequences with atomic precision, using the Evoformer architecture and Invariant Point Attention (IPA).',
    intuitiveExplanation:
      'Proteins are the fundamental molecular machines of biology, made of linear chains of amino acids that fold into intricate 3D shapes that dictate their function. Predicting a 3D structure from 1D sequence alone (Levinthal\'s paradox) stumped biophysicists for half a century. DeepMind\'s AlphaFold 2 transformed structural biology by framing protein folding as a spatial reasoning problem. It takes Multiple Sequence Alignments (evolutionary cousins of the protein) and an amino acid pair matrix, passing them through "Evoformer" blocks that exchange geometric information back and forth. Then, an Invariant Point Attention (IPA) structure module places 3D residue frames directly in Euclidean space SE(3), refining atomic coordinates with rotation-and-translation invariance. AlphaFold reached atomic accuracy (GDT > 90) matching experimental crystallography.',
    novelty: [
      'Evoformer architecture: Co-evolutionary spatial reasoning that exchanges information between sequence alignment (MSA) and residue pair distance matrices.',
      'Invariant Point Attention (IPA): Attention mechanism operating directly on 3D rigid body Euclidean coordinates SE(3) that is invariant to global rotations and translations.',
      'End-to-end differentiable structure prediction without classical molecular dynamics simulations.',
      'Predicted 200+ million protein structures across almost every known organism on Earth.',
    ],
    keyTechniques: [
      'Multiple Sequence Alignment (MSA) Representations',
      'Residue Pair Distance Matrix Updating (Outer Product Mean)',
      'Invariant Point Attention (IPA) in SE(3) space',
      'Triangular Multiplicative Updates & Self-Attention on Pairs',
      'Frame-aligned Point Error (FAPE) loss',
    ],
    workflow: [
      {
        step: 1,
        title: 'MSA & Pair Representation Initialization',
        description:
          'Amino acid sequence is queried against genetic databases to construct an MSA representation m_{si} and a pairwise interaction matrix z_{ij}.',
        mathFormula: 'm_{si} \\in \\mathbb{R}^{S \\times N \\times c_m}, \\quad z_{ij} = \\text{Linear}(w_i \\otimes w_j) \\in \\mathbb{R}^{N \\times N \\times c_z}',
      },
      {
        step: 2,
        title: 'Evoformer Triangular Updates',
        description:
          '48 Evoformer blocks update pairs z_{ij} via triangular multiplication and attention to satisfy triangle inequality in 3D distance metrics.',
        mathFormula: 'z_{ij} \\leftarrow z_{ij} + \\sum_k a_{ik} \\odot b_{jk} \\quad (\\text{Triangle Multiplicative Update})',
      },
      {
        step: 3,
        title: 'Invariant Point Attention (IPA)',
        description:
          'The structure module updates 3D residue frames (rotation R_i and translation t_i) using attention computed across 3D coordinates.',
        mathFormula: 'q_i^p = R_i \\cdot \\tilde{q}_i^p + t_i, \\quad a_{ij} = \\text{Softmax}\\left(\\frac{q_i^T k_j}{\\sqrt{c}} - \\frac{\\gamma}{2} \\sum_p ||q_i^p - k_j^p||^2\\right)',
      },
      {
        step: 4,
        title: 'FAPE Loss Optimization',
        description:
          'Frame-Aligned Point Error penalizes the distance between predicted and experimental atomic coordinates computed within the local coordinate frame of each residue.',
        mathFormula: '\\mathcal{L}_{\\text{FAPE}} = \\frac{1}{N^2} \\sum_{i, j} \\min\\left(d_{\\text{clamp}}, ||T_i^{-1} x_j - \\hat{T}_i^{-1} \\hat{x}_j||\\right)',
      },
    ],
    architecture: {
      coreConcepts: [
        'Evoformer: 48 blocks with MSA row/column attention and triangular pair updates',
        'Structure Module: 8 blocks of Invariant Point Attention (IPA) operating on SE(3) Lie groups',
        'Direct atomic output coordinates: backbone rotations (C_alpha, N, C) and side-chain torsion angles (chi_1 to chi_4)',
      ],
      scalabilityMechanism:
        'Recycling iterations: Feeding the model\'s own predicted pairwise representations and 3D coordinates back into the input for 3-4 recycling passes dramatically sharpens structural resolution.',
      bottleneckSolved:
        'Solved the 50-year protein folding challenge, reducing structural determination time from 4 years of crystallography to seconds of GPU compute.',
    },
    trainingDynamics: {
      optimizerAndSchedule: 'Adam with warmup to 1e-3, cosine decay, gradient clipping 0.1.',
      lossFunction: 'FAPE loss + side-chain torsion loss + masked MSA cross-entropy + structural violation penalty.',
      computeAndHardware: '128 Google TPUv3 chips trained continuously for several weeks.',
      stabilityTricks:
        'Self-distillation on 350,000 unlabelled metagenomic sequences; randomized cropping of protein chains during training.',
    },
    empiricalBenchmarks: [
      {
        benchmarkName: 'CASP14 Overall Median GDT-TS (Global Distance Test)',
        paperScore: '92.4 GDT',
        previousIterationScore: '61.6 GDT',
        baselineName: 'AlphaFold 1 (CASP13)',
        relativeGain: '+50.0%',
        analysis: 'GDT above 90 is widely considered competitive with high-resolution X-ray crystallography and cryo-EM.',
      },
      {
        benchmarkName: 'All-Atom RMSD Accuracy (C-alpha backbone)',
        paperScore: '0.96 Ångströms',
        previousIterationScore: '2.5+ Ångströms',
        baselineName: 'Rosetta / Classical Physics Simulation',
        relativeGain: '-61.6% error',
        analysis: 'Sub-angstrom precision matches the diameter of an individual hydrogen atom.',
      },
    ],
    alternatives: [
      {
        name: 'Classical Molecular Dynamics / Rosetta',
        comparison: 'Simulates physics equations (electrostatics, van der Waals) over billions of femtosecond timesteps.',
        tradeoff: 'Classical MD takes weeks of supercomputer time per protein; AlphaFold predicts equilibrium coordinates in seconds.',
      },
    ],
    replicationGuide: {
      difficulty: 'Advanced',
      minHardware: '1x A100 (80GB) or RTX 4090 for fast protein inference (ColabFold)',
      libraries: ['colabfold', 'jax', 'openfold', 'biopython'],
      datasets: ['Protein Data Bank (PDB) and BFD/UniRef90 MSA databases'],
      reproducibilityRecipe: [
        'Run ColabFold or OpenFold.',
        'Input amino acid FASTA sequence.',
        'Generate MSA with MMseqs2 and predict 3D PDB structure.',
      ],
      githubOrRepo: 'https://github.com/google-deepmind/alphafold',
    },
    codeSnippet: {
      language: 'python',
      filename: 'alphafold_ipa.py',
      description: 'Invariant Point Attention (IPA) 3D coordinate transformation concept in PyTorch.',
      code: `import torch
import torch.nn as nn

class InvariantPointAttention(nn.Module):
    def __init__(self, d_single=384, d_pair=128, num_heads=12, num_points=4):
        super().__init__()
        self.num_heads = num_heads
        self.num_points = num_points
        # Scalar projections
        self.q_scalar = nn.Linear(d_single, num_heads * 16, bias=False)
        self.k_scalar = nn.Linear(d_single, num_heads * 16, bias=False)
        # 3D Point projections (in local residue frame)
        self.q_point = nn.Linear(d_single, num_heads * num_points * 3, bias=False)
        self.k_point = nn.Linear(d_single, num_heads * num_points * 3, bias=False)
        # Pair interaction projection
        self.pair_bias = nn.Linear(d_pair, num_heads, bias=False)

    def forward(self, single_rep, pair_rep, rotations, translations):
        """
        rotations: [B, N, 3, 3] rotation matrices
        translations: [B, N, 3] translation vectors
        Transforms local 3D points to global frame and computes distance attention.
        """
        B, N, _ = single_rep.shape
        # Compute scalar dot product attention
        # Map 3D points from local residue coordinates to global 3D space: x_global = R * x_local + T
        # IPA guarantees output is invariant under any global rotation or translation of the protein!
        return single_rep`,
    },
    interactiveToy: {
      type: 'latent_equilibrium',
      title: 'Evoformer Invariant Point Attention 3D Convergence',
      description: 'Observe how recycling iterations progressively fold disordered linear amino acid chains into sub-angstrom 3D equilibrium structures.',
    },
  },
  {
    id: 'paper-48',
    number: 48,
    title: 'Generative Adversarial Nets (GAN)',
    subtitle: 'The Minimax Adversarial Game that Launched Modern Generative Deep Learning',
    category: 'latent-world-models',
    arxivUrl: 'https://arxiv.org/abs/1406.2661',
    year: 2014,
    authors: 'Goodfellow, Pouget-Abadie, Mirza, Xu, Warde-Farley, Ozair, Courville, Bengio',
    organization: 'Université de Montréal',
    tldr: 'Introduced generative adversarial training via a two-player minimax game between a Generator and a Discriminator, proving that deep neural networks can synthesize high-fidelity data without explicit density estimation.',
    intuitiveExplanation:
      'Before 2014, training computers to generate sharp images was nearly impossible: models like Variational Autoencoders (VAEs) produced blurry results because their loss functions (Mean Squared Error) averaged all plausible futures into a muddy blend. Ian Goodfellow had a revolutionary insight inspired by game theory: What if, instead of manually writing a loss function, we train a second neural network to BE the loss function? GANs pit two neural networks against each other: The Generator G acts like an art counterfeiter trying to paint fake images from random noise z; the Discriminator D acts like an art detective trying to distinguish fake paintings from real images. As D gets better at spotting flaws, G is forced to synthesize increasingly sharp, indistinguishable details. The minimax game drove computer vision forward for a decade.',
    novelty: [
      'Two-player minimax game formulation: min_G max_D V(D, G).',
      'Eliminated the need for Markov chains or explicit likelihood / density computation in generative modeling.',
      'Showed that adversarial gradients from an evolving discriminator provide sharp, perceptual training signals far superior to L2/L1 pixel loss.',
      'Spawned an entire era of generative AI (DCGAN, CycleGAN, StyleGAN, BigGAN) and inspired adversarial testing throughout modern AI safety.',
    ],
    keyTechniques: [
      'Minimax Objective Function',
      'Non-saturating generator heuristic (maximize log D(G(z)) instead of minimize log(1 - D(G(z))))',
      'Latent noise vector sampling (z ~ N(0, I))',
      'Alternating stochastic gradient descent optimization',
    ],
    workflow: [
      {
        step: 1,
        title: 'Latent Noise Vector Sampling',
        description:
          'Sample a random noise vector z from a prior distribution (such as a standard Gaussian or uniform distribution).',
        mathFormula: 'z \\sim p_z(z) = \\mathcal{N}(0, I_d)',
      },
      {
        step: 2,
        title: 'Generator Forward Pass',
        description:
          'The generator neural network G_theta maps the low-dimensional noise vector z into the high-dimensional data space.',
        mathFormula: 'x_{\\text{fake}} = G(z; \\theta_g)',
      },
      {
        step: 3,
        title: 'Discriminator Adversarial Evaluation',
        description:
          'Discriminator D_phi evaluates both real data x_real and synthetic data x_fake, predicting the probability that each came from real data.',
        mathFormula: 'D(x; \\theta_d) = \\sigma(\\text{Logits}(x)) \\in [0, 1]',
      },
      {
        step: 4,
        title: 'Simultaneous Minimax Weight Updates',
        description:
          'Update D to maximize log D(x) + log(1 - D(G(z))) and update G to maximize log D(G(z)).',
        mathFormula: '\\min_G \\max_D V(D, G) = \\mathbb{E}_{x \\sim p_{\\text{data}}}[\\log D(x)] + \\mathbb{E}_{z \\sim p_z}[\\log(1 - D(G(z)))]',
      },
    ],
    architecture: {
      coreConcepts: [
        'Generator network G: maps R^d -> R^{H x W x C}',
        'Discriminator network D: maps R^{H x W x C} -> [0, 1]',
        'Theoretical global optimum when p_g = p_data, at which point D(x) = 1/2 everywhere',
      ],
      scalabilityMechanism:
        'Backpropagation through the discriminator provides dense gradient vectors that tell the generator precisely which pixels to adjust to look more realistic.',
      bottleneckSolved:
        'Eliminated blurry outputs caused by pixel-space Mean Squared Error loss functions in generative models.',
    },
    trainingDynamics: {
      optimizerAndSchedule: 'SGD with momentum or Adam (lr=2e-4, beta1=0.5 in subsequent DCGAN stabilization).',
      lossFunction: 'Binary cross-entropy minimax objective.',
      computeAndHardware: '1x NVIDIA Titan X / K40 GPU.',
      stabilityTricks:
        'Non-saturating generator loss: maximizing log(D(G(z))) early in training when D easily rejects G to prevent vanishing gradients.',
    },
    empiricalBenchmarks: [
      {
        benchmarkName: 'MNIST Log-Likelihood & Visual Sharpness',
        paperScore: '225 ± 2 (Parzen window)',
        previousIterationScore: '138 ± 2',
        baselineName: 'Deep Boltzmann Machines (DBM)',
        relativeGain: '+63.0%',
        analysis: 'Synthesized crisp handwritten digits without blurry artifacts for the first time.',
      },
      {
        benchmarkName: 'CIFAR-10 Visual Sample Diversity',
        paperScore: 'Competitive real-sample realism',
        previousIterationScore: 'Unintelligible blobs',
        baselineName: 'Autoencoders',
        relativeGain: 'Generative Paradigm Shift',
        analysis: 'Proved deep networks could generate natural image components (dog faces, cars, planes) from pure noise.',
      },
    ],
    alternatives: [
      {
        name: 'Variational Autoencoders (VAEs)',
        comparison: 'VAEs maximize the evidence lower bound (ELBO) with explicit reconstruction loss.',
        tradeoff: 'VAEs are mathematically stable but blur high frequencies; GANs produce razor-sharp textures but suffer from mode collapse.',
      },
    ],
    replicationGuide: {
      difficulty: 'Introductory',
      minHardware: 'Any laptop CPU/GPU',
      libraries: ['torch', 'torchvision'],
      datasets: ['MNIST, Fashion-MNIST, or CelebA'],
      reproducibilityRecipe: [
        'Build 3-layer MLP generator and discriminator.',
        'Train on MNIST with Adam (lr=2e-4).',
        'Observe clear handwritten digits generated from random noise within 10 epochs.',
      ],
      githubOrRepo: 'https://github.com/goodfeli/adversarial',
    },
    codeSnippet: {
      language: 'python',
      filename: 'vanilla_gan.py',
      description: 'Clean PyTorch implementation of the original Generative Adversarial Network.',
      code: `import torch
import torch.nn as nn

class Generator(nn.Module):
    def __init__(self, z_dim=100, img_dim=784):
        super().__init__()
        self.gen = nn.Sequential(
            nn.Linear(z_dim, 256),
            nn.LeakyReLU(0.2),
            nn.Linear(256, 512),
            nn.LeakyReLU(0.2),
            nn.Linear(512, img_dim),
            nn.Tanh() # Output in [-1, 1]
        )
    def forward(self, z):
        return self.gen(z)

class Discriminator(nn.Module):
    def __init__(self, img_dim=784):
        super().__init__()
        self.disc = nn.Sequential(
            nn.Linear(img_dim, 512),
            nn.LeakyReLU(0.2),
            nn.Linear(512, 256),
            nn.LeakyReLU(0.2),
            nn.Linear(256, 1),
            nn.Sigmoid()
        )
    def forward(self, x):
        return self.disc(x)`,
    },
    interactiveToy: {
      type: 'diffusion_steps',
      title: 'Generator vs. Discriminator Minimax Balance Simulator',
      description: 'Adjust Generator and Discriminator learning rates to observe equilibrium convergence vs mode collapse.',
    },
  },
  {
    id: 'paper-49',
    number: 49,
    title: 'Swin Transformer: Hierarchical Vision Transformer using Shifted Windows',
    subtitle: 'Linear-Complexity Shifted Window Vision Backbone for Dense Prediction',
    category: 'alignment-multimodal',
    arxivUrl: 'https://arxiv.org/abs/2103.14030',
    year: 2021,
    authors: 'Liu, Lin, Cao, Hu, Wei, Zhang, Lin, Guo (Microsoft Research Asia)',
    organization: 'Microsoft Research Asia',
    tldr: 'Solves the quadratic computation bottleneck of Vision Transformers on high-resolution images by computing self-attention within local shifted windows, enabling linear complexity O(M) and hierarchical multi-scale feature maps.',
    intuitiveExplanation:
      'Standard Vision Transformers (ViT) have two severe limitations when applied to general computer vision tasks like object detection and semantic segmentation: 1) Their attention complexity scales quadratically with image resolution (O((HW)^2)), making high-resolution processing prohibitively expensive. 2) They produce a single, fixed low-resolution feature map, whereas dense detection tasks require multi-scale feature pyramids (detecting tiny coins and giant buildings simultaneously). Swin Transformer solved both problems elegantly. It computes self-attention exclusively within local non-overlapping windows of size M x M, reducing complexity to linear O(M * HW). To enable communication across windows without expensive global attention, it alternately "shifts" the window grid by (M/2, M/2) between consecutive layers, providing cross-window connectivity with zero overhead.',
    novelty: [
      'Shifted Window Attention: Limits self-attention to local M x M windows and alternates window partitions between layers for cross-window message passing.',
      'Linear computational complexity: O(4M^2 HW) scaling linearly with image resolution instead of quadratically.',
      'Hierarchical feature representation: Patch merging layers progressively downsample spatial resolution while doubling channel dimension, creating multi-scale feature pyramids like ResNets.',
      'Universal vision backbone replacing CNNs across ImageNet classification, COCO object detection, and ADE20K semantic segmentation.',
    ],
    keyTechniques: [
      'Local Window Multi-Head Self-Attention (W-MSA)',
      'Shifted Window Multi-Head Self-Attention (SW-MSA)',
      'Cyclic Shifting and Efficient Batch Masking',
      'Relative Position Bias B in Self-Attention Matrix',
      'Patch Merging Layers for Hierarchical Downsampling',
    ],
    workflow: [
      {
        step: 1,
        title: 'Patch Partition & Stage 1 Linear Embedding',
        description:
          'Input image (H, W, 3) is split into 4x4 non-overlapping patches, projecting each to dimension C.',
        mathFormula: 'x_0 \\in \\mathbb{R}^{\\frac{H}{4} \\times \\frac{W}{4} \\times C}',
      },
      {
        step: 2,
        title: 'Window Self-Attention (W-MSA)',
        description:
          'Feature maps are partitioned into non-overlapping M x M local windows (typically M=7), computing self-attention only within each window.',
        mathFormula: '\\text{Attention}(Q, K, V) = \\text{Softmax}\\left(\\frac{QK^T}{\\sqrt{d}} + B\\right)V',
      },
      {
        step: 3,
        title: 'Shifted Window Self-Attention (SW-MSA)',
        description:
          'In the next layer, the window partition is shifted by (floor(M/2), floor(M/2)) pixels, using cyclic shifting and masked attention to prevent cross-boundary pollution.',
        mathFormula: '\\text{ShiftedWindowPartition}(x, \\text{shift}=(\\lfloor M/2 \\rfloor, \\lfloor M/2 \\rfloor))',
      },
      {
        step: 4,
        title: 'Patch Merging (Hierarchical Pyramid)',
        description:
          'Adjacent 2x2 patch tokens are concatenated and linearly projected to 2C channels, cutting spatial resolution in half (H/8, W/8, 2C).',
        mathFormula: 'x_{l+1} = \\text{Linear}(\\text{Concat}(x_{2i, 2j}, x_{2i+1, 2j}, x_{2i, 2j+1}, x_{2i+1, 2j+1}))',
      },
    ],
    architecture: {
      coreConcepts: [
        '4-stage hierarchical structure producing feature maps at 4x, 8x, 16x, 32x downsampling',
        'Swin-Large: C=192, layer depths [2, 2, 18, 2], 197M parameters',
        'Swin-Base: C=128, layer depths [2, 2, 18, 2], 88M parameters',
        'Swin-Tiny: C=96, layer depths [2, 2, 6, 2], 29M parameters',
      ],
      scalabilityMechanism:
        'Linear complexity with respect to image pixel count permits training and inference on ultra-high-resolution images (1024x1024+ and gigapixel medical scans) without running out of GPU memory.',
      bottleneckSolved:
        'Broke the quadratic resolution barrier of standard ViTs and brought multi-scale feature pyramids to Vision Transformers.',
    },
    trainingDynamics: {
      optimizerAndSchedule: 'AdamW with learning rate 1e-3, cosine decay, 20 epochs linear warmup, weight decay 0.05.',
      lossFunction: 'Cross-entropy on ImageNet classification / Focal Loss for object detection.',
      computeAndHardware: 'Cluster of NVIDIA V100 / A100 GPUs.',
      stabilityTricks:
        'Relative position bias B added directly into attention matrix logits rather than absolute position embeddings at the input.',
    },
    empiricalBenchmarks: [
      {
        benchmarkName: 'COCO Object Detection box mAP (Swin-L)',
        paperScore: '58.7 mAP',
        previousIterationScore: '53.5 mAP',
        baselineName: 'Prior ConvNeXt / ResNeXt-101',
        relativeGain: '+5.2 points',
        analysis: 'Set an all-time record on COCO test-dev, decisively proving Transformers outperform CNNs in dense spatial tasks.',
      },
      {
        benchmarkName: 'ADE20K Semantic Segmentation mIoU',
        paperScore: '53.5 mIoU',
        previousIterationScore: '45.3 mIoU',
        baselineName: 'SETR (Standard ViT Backbone)',
        relativeGain: '+18.1%',
        analysis: 'Hierarchical multi-scale feature maps preserve fine-grained semantic boundaries.',
      },
    ],
    alternatives: [
      {
        name: 'Standard Vision Transformer (ViT)',
        comparison: 'Standard ViT computes global attention across all patches.',
        tradeoff: 'ViT has O(N^2) complexity and single-scale features; Swin has linear O(N) complexity and multi-scale pyramids ideal for dense detection.',
      },
    ],
    replicationGuide: {
      difficulty: 'Intermediate',
      minHardware: '1x RTX 3090 / 4090 GPU',
      libraries: ['torch', 'torchvision', 'timm', 'mmdetection'],
      datasets: ['ImageNet-1K, COCO 2017 detection dataset'],
      reproducibilityRecipe: [
        'Import timm.models.swin_base_patch4_window7_224.',
        'Evaluate on ImageNet validation set to confirm ~83.5% top-1 accuracy.',
      ],
      githubOrRepo: 'https://github.com/microsoft/Swin-Transformer',
    },
    codeSnippet: {
      language: 'python',
      filename: 'swin_window_attention.py',
      description: 'Window partitioning and local self-attention in Swin Transformer.',
      code: `import torch
import torch.nn as nn

def window_partition(x, window_size=7):
    """
    x: [B, H, W, C]
    Returns: [num_windows * B, window_size, window_size, C]
    """
    B, H, W, C = x.shape
    x = x.view(B, H // window_size, window_size, W // window_size, window_size, C)
    windows = x.permute(0, 1, 3, 2, 4, 5).contiguous().view(-1, window_size, window_size, C)
    return windows

def window_reverse(windows, window_size, H, W):
    B = int(windows.shape[0] / (H * W / window_size / window_size))
    x = windows.view(B, H // window_size, W // window_size, window_size, window_size, -1)
    x = x.permute(0, 1, 3, 2, 4, 5).contiguous().view(B, H, W, -1)
    return x`,
    },
    interactiveToy: {
      type: 'attention_matrix',
      title: 'Shifted Window Cyclic Attention Partition Simulator',
      description: 'Visualize how the window partition shifts by (M/2, M/2) and applies masked attention to bridge spatial boundaries with zero FLOP overhead.',
    },
  },
  {
    id: 'paper-50',
    number: 50,
    title: "Large Language Models are Zero-Shot Reasoners ('Let's Think Step by Step')",
    subtitle: 'Zero-Shot Chain-of-Thought Prompting as an Emergent Latent Capability',
    category: 'reasoning-compute',
    arxivUrl: 'https://arxiv.org/abs/2205.11916',
    year: 2022,
    authors: 'Kojima, Gu, Reid, Matsuo, Iwasawa (University of Tokyo & Google Research)',
    organization: 'University of Tokyo & Google Research',
    tldr: "Discovered that simply appending the single phrase 'Let's think step by step' to any reasoning prompt elicits high-accuracy multi-step chain-of-thought deductions without requiring a single few-shot exemplar.",
    intuitiveExplanation:
      'When Jason Wei et al. introduced Chain-of-Thought (CoT) prompting in 2022, it was believed that models required carefully handcrafted few-shot demonstrations: 4 to 8 detailed question-and-rationale pairs in the prompt to show the model how to reason step by step. Kojima et al. uncovered something far more profound: models do not need to be shown demonstrations; the ability to reason step-by-step is ALREADY latent inside the pretrained weights! By simply prompting the model with the zero-shot instruction "Let\'s think step by step", the model changes its decoding path: instead of trying to leap directly to the final answer in one token (which fails on complex math), it uses its autoregressive generation tokens as internal scratchpad memory. This single 5-word sentence jumped MultiArith accuracy from 17% to 78%, unlocking modern System 2 reasoning paradigms.',
    novelty: [
      'Discovery of Zero-Shot Chain-of-Thought (Zero-Shot-CoT): Multi-step reasoning emerges without any few-shot task-specific demonstrations.',
      'Two-stage reasoning extraction pipeline: 1) Reasoning extraction with "Let\'s think step by step", 2) Answer extraction with "Therefore, the answer is".',
      'Demonstrated that chain-of-thought is an intrinsic latent behavior of sufficiently large language models (>100B parameters) rather than an in-context demonstration mimicry.',
      'Foundational catalyst that inspired self-consistency, tree-of-thought, reflection, and modern test-time compute scaling (o1 / R1).',
    ],
    keyTechniques: [
      'Two-Step Zero-Shot CoT Protocol',
      'Cognitive Trigger Prompts ("Let\'s think step by step")',
      'Answer Extraction Prompting ("Therefore, the answer (arabic numerals) is")',
      'Temperature 0 Greedy Decoding for Deterministic Reasoning Paths',
    ],
    workflow: [
      {
        step: 1,
        title: 'Step 1: Reasoning Extraction Prompt',
        description:
          'Input question Q is appended with the trigger phrase "Let\'s think step by step" to generate rationale sequence Z.',
        mathFormula: 'Z \\sim P(\\cdot | Q, \\text{"Let\'s think step by step"})',
      },
      {
        step: 2,
        title: 'Intermediate Rationalization Scratchpad',
        description:
          'The model autoregressively generates intermediate sub-computations, arithmetic steps, and logical deductions into the token sequence.',
        mathFormula: 'Z = [z_1, z_2, \\dots, z_T] \\quad (\\text{Internal computational scratchpad})',
      },
      {
        step: 3,
        title: 'Step 2: Answer Extraction Prompt',
        description:
          'The full sequence [Q, "Let\'s think step by step", Z] is concatenated with an answer-trigger suffix like "Therefore, the answer is".',
        mathFormula: 'A \\sim P(\\cdot | Q, \\text{"Let\'s think step by step"}, Z, \\text{"Therefore, the answer is"})',
      },
      {
        step: 4,
        title: 'Final Answer Extraction',
        description:
          'The first token or parsed numeric string following the extraction prompt is harvested as the validated output.',
        mathFormula: '\\hat{y} = \\text{ExtractAnswer}(A)',
      },
    ],
    architecture: {
      coreConcepts: [
        'Universal zero-shot prompt wrapper applicable to any decoder LLM',
        'Emergent capability: shows zero impact on models <10B parameters, but causes exponential accuracy phase transitions above 50B-100B parameters',
        'Direct precursor to autonomous reasoning models like OpenAI o1 and DeepSeek-R1',
      ],
      scalabilityMechanism:
        'Provides the model with additional forward passes (test-time compute tokens) to compute intermediate representations before committing to the final answer token.',
      bottleneckSolved:
        'Eliminated the need for human-authored few-shot reasoning prompts, demonstrating that step-by-step logic is already encoded in foundation models.',
    },
    trainingDynamics: {
      optimizerAndSchedule: 'N/A (Pure prompt engineering protocol on frozen pretrained models).',
      lossFunction: 'Evaluated on exact match accuracy on multi-step reasoning benchmarks.',
      computeAndHardware: 'Zero training compute required; runs on standard API or local model inference.',
      stabilityTricks:
        'Using deterministic greedy decoding (T=0) during reasoning extraction to prevent arithmetic hallucination.',
    },
    empiricalBenchmarks: [
      {
        benchmarkName: 'MultiArith Math Reasoning Accuracy (InstructGPT-175B)',
        paperScore: '78.7%',
        previousIterationScore: '17.7%',
        baselineName: 'Standard Zero-Shot Prompting',
        relativeGain: '+344% improvement',
        analysis: 'A single 5-word sentence jumped accuracy from failure to state-of-the-art without a single training update.',
      },
      {
        benchmarkName: 'GSM8K Grade School Math',
        paperScore: '40.7%',
        previousIterationScore: '10.4%',
        baselineName: 'Standard Zero-Shot Prompting',
        relativeGain: '+291%',
        analysis: 'Allows the model to maintain sub-goal variables in token memory before calculating final answers.',
      },
    ],
    alternatives: [
      {
        name: 'Few-Shot Chain-of-Thought (Wei et al.)',
        comparison: 'Few-shot CoT provides 4 to 8 explicit reasoning examples in the prompt.',
        tradeoff: 'Few-shot CoT uses significant prompt context space and requires task-specific manual authoring; Zero-shot CoT is universal and prompt-free.',
      },
    ],
    replicationGuide: {
      difficulty: 'Introductory',
      minHardware: 'Any API endpoint or local model (Llama 3, Mistral, Gemma)',
      libraries: ['requests', 'transformers', 'torch'],
      datasets: ['GSM8K, SVAMP, MultiArith'],
      reproducibilityRecipe: [
        'Prompt model: "Q: [Insert complex math question]. A: Let\'s think step by step."',
        'Observe the model solve the problem step by step without any prior training.',
      ],
      githubOrRepo: 'https://github.com/kojima-takeshi188/zero_shot_cot',
    },
    codeSnippet: {
      language: 'python',
      filename: 'zero_shot_cot.py',
      description: 'The two-stage Zero-Shot Chain-of-Thought pipeline.',
      code: `def zero_shot_cot_solve(model_generate_fn, question):
    # Step 1: Reasoning Extraction
    prompt_stage1 = f"Q: {question}\\nA: Let's think step by step.\\n"
    reasoning = model_generate_fn(prompt_stage1, max_tokens=512)
    
    # Step 2: Answer Extraction
    prompt_stage2 = f"{prompt_stage1}{reasoning}\\nTherefore, the answer is"
    final_answer = model_generate_fn(prompt_stage2, max_tokens=32)
    
    return {
        "reasoning": reasoning,
        "answer": final_answer.strip()
    }`,
    },
    interactiveToy: {
      type: 'test_time_budget',
      title: 'Zero-Shot CoT Token Scratchpad Simulator',
      description: 'Compare standard zero-shot immediate answer prediction against step-by-step reasoning tokens on complex multi-step problems.',
    },
  },
];
