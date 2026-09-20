# 📚 MadeEasy — Research Papers Made Simple

> **Understand foundational AI papers without getting lost in math jargon.**

MadeEasy breaks down 50+ of the most influential AI & Machine Learning research papers into clear visual explanations, real-world intuitions, interactive sliders, and practical PyTorch code.

---

## 🌟 Why MadeEasy?

Reading AI research papers is often intimidating. Authors pack them with dense mathematical formulas and complex academic phrasing. 

**MadeEasy fixes that by answering four simple questions for every paper:**
1. *What problem was it trying to solve?*
2. *What was the breakthrough intuition?*
3. *How does the math/architecture actually work under the hood?*
4. *How do I write it in real code?*

---

## 🚀 Key Features & How to Use Them

### 1. 📖 Industry Library (50 Papers)
A curated collection of the most important papers in modern AI (Transformers, LoRA, FlashAttention, DPO, Whisper, CLIP, and more).

- **How to use:**
  - Click on any paper card in the library.
  - Read the **Intuition**: Plain English explanation of the paper's core idea.
  - Read the **Breakdown**: The key bottlenecks, solutions, and trade-offs.
  - Click **Paper Link**: Direct link to the original arXiv paper if you want to inspect the source.

### 2. 🧮 Interactive Math & Sliders
Instead of just showing static formulas, MadeEasy lets you play with live parameters to see what actually happens.

- **How to use:**
  - Open a paper (like *Attention Is All You Need* or *LoRA*).
  - Move the sliders (e.g., Sequence Length, Hidden Dimension, Rank $r$).
  - Watch the memory consumption, FLOPs, and parameter savings calculate in real time.

### 3. 💻 PyTorch Implementation Snippets
See how theoretical equations translate into concise, executable code.

- **How to use:**
  - In any paper modal, look at the **Code** tab.
  - Read the annotated PyTorch module showing the exact forward pass.
  - Click **Copy** to drop the module directly into your own project or Jupyter notebook.

### 4. 📊 Benchmark Matrix
Compare models and architectures across industry benchmarks like MMLU, GSM8K, HumanEval, and more.

- **How to use:**
  - Click the **Benchmark Matrix** tab at the top.
  - Filter by category (Reasoning, Coding, Multimodal).
  - Quickly see which models excel at specific tasks.

### 5. ✅ Reading Checklist & Bookmarks
Never lose track of your learning journey.

- **How to use:**
  - Click the **Bookmark (ribbon)** icon on any paper to save it for later.
  - Click the **Checkmark** icon when you've finished reading and understanding a paper.
  - Click the **Reading Checklist** tab at the top to review your completed papers and study stats.

### 6. ☁️ Google Cloud Sync
Your bookmarks and study checklist are always safe.

- **How to use:**
  - **Guest Mode:** If you don't sign in, your reading list is automatically saved directly in your browser.
  - **Google Sign-In:** Click **Sign In with Google** in the top right. Your reading progress instantly syncs across your laptop, phone, or any other device.

---

## 🛠️ Tech Stack

- **Frontend:** React 18, TypeScript, Tailwind CSS, Lucide Icons, Motion
- **Tooling:** Vite
- **Cloud & Auth:** Supabase (PostgreSQL & Google OAuth)
- **Deployment:** Vercel

---

## 💻 Running Locally

If you want to run MadeEasy on your local machine:

```bash
# 1. Clone your repository
git clone https://github.com/your-username/made-easy.git

# 2. Go to project directory
cd made-easy

# 3. Install dependencies
npm install

# 4. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📄 License

MIT License — Feel free to use, learn from, and share!
