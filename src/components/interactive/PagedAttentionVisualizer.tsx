import React, { useState } from 'react';
import { Server, Database, Play, RotateCcw, Check, AlertCircle } from 'lucide-react';

interface RequestStream {
  id: string;
  name: string;
  color: string;
  tokensCount: number;
  physicalBlocks: number[];
}

export const PagedAttentionVisualizer: React.FC = () => {
  const blockSize = 16; // 16 tokens per block
  const totalPhysicalBlocks = 18;

  const [requests, setRequests] = useState<RequestStream[]>([
    { id: 'req-1', name: 'Request A (Chat)', color: 'bg-emerald-500', tokensCount: 28, physicalBlocks: [0, 1] },
    { id: 'req-2', name: 'Request B (Code)', color: 'bg-cyan-500', tokensCount: 42, physicalBlocks: [2, 3, 4] },
    { id: 'req-3', name: 'Request C (RAG)', color: 'bg-purple-500', tokensCount: 19, physicalBlocks: [5, 6] },
  ]);

  const [allocatedBlocks, setAllocatedBlocks] = useState<Set<number>>(new Set([0, 1, 2, 3, 4, 5, 6]));
  const [activeStep, setActiveStep] = useState(0);

  // Advance generation: add 4 tokens to each active request
  const handleStepGeneration = () => {
    setRequests((prev) => {
      const nextReqs = prev.map((req) => {
        const newCount = req.tokensCount + 6;
        const requiredBlocks = Math.ceil(newCount / blockSize);
        const currentBlocks = [...req.physicalBlocks];

        // If need more blocks, grab next free physical block
        while (currentBlocks.length < requiredBlocks) {
          // Find first unallocated block id
          let nextFree = -1;
          for (let i = 0; i < totalPhysicalBlocks; i++) {
            if (!allocatedBlocks.has(i) && !currentBlocks.includes(i)) {
              nextFree = i;
              break;
            }
          }
          if (nextFree !== -1) {
            currentBlocks.push(nextFree);
            allocatedBlocks.add(nextFree);
          } else {
            break; // Out of memory
          }
        }

        return {
          ...req,
          tokensCount: newCount,
          physicalBlocks: currentBlocks,
        };
      });

      return nextReqs;
    });

    setActiveStep((s) => s + 1);
  };

  const handleReset = () => {
    setRequests([
      { id: 'req-1', name: 'Request A (Chat)', color: 'bg-emerald-500', tokensCount: 28, physicalBlocks: [0, 1] },
      { id: 'req-2', name: 'Request B (Code)', color: 'bg-cyan-500', tokensCount: 42, physicalBlocks: [2, 3, 4] },
      { id: 'req-3', name: 'Request C (RAG)', color: 'bg-purple-500', tokensCount: 19, physicalBlocks: [5, 6] },
    ]);
    setAllocatedBlocks(new Set([0, 1, 2, 3, 4, 5, 6]));
    setActiveStep(0);
  };

  // Memory metrics
  const totalTokens = requests.reduce((acc, r) => acc + r.tokensCount, 0);
  const usedPhysicalBlocks = new Set(requests.flatMap((r) => r.physicalBlocks)).size;
  const capacityInTokens = usedPhysicalBlocks * blockSize;
  const internalFragTokens = capacityInTokens - totalTokens;
  const memoryWastePct = capacityInTokens > 0 ? ((internalFragTokens / capacityInTokens) * 100).toFixed(1) : '0';

  return (
    <div className="bg-[#0e1117] border border-[#232734] rounded-lg p-5 text-[#e2e8f0]">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#232734]">
        <div>
          <h4 className="text-sm font-semibold tracking-wide text-white uppercase font-mono flex items-center gap-2">
            <Server className="w-4 h-4 text-emerald-400" />
            PagedAttention Virtual Memory Block Manager
          </h4>
          <p className="text-xs text-[#94a3b8] mt-0.5">
            Non-contiguous physical KV block allocation inspired by OS virtual paging &nbsp;|&nbsp; Block Size: 16 tokens
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleStepGeneration}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-mono font-bold transition-colors"
          >
            <Play className="w-3.5 h-3.5" />
            Decode Next Step (+6 tokens)
          </button>
          <button
            onClick={handleReset}
            className="p-1.5 bg-[#181c26] border border-[#2e3446] hover:text-white text-[#94a3b8] rounded text-xs transition-colors"
            title="Reset simulation"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Logical Requests State */}
      <div className="my-4 space-y-2">
        <div className="text-xs font-mono text-[#94a3b8]">Logical Client Requests & Page Tables:</div>
        {requests.map((req) => (
          <div
            key={req.id}
            className="p-2.5 bg-[#131722] border border-[#232734] rounded flex flex-wrap items-center justify-between gap-3 text-xs font-mono"
          >
            <div className="flex items-center gap-2 min-w-[160px]">
              <span className={`w-3 h-3 rounded-full ${req.color}`} />
              <span className="font-bold text-white">{req.name}</span>
              <span className="text-[#94a3b8] text-[11px]">({req.tokensCount} tokens)</span>
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] text-[#64748b]">Page Table:</span>
              {req.physicalBlocks.map((blkIdx, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 bg-[#1a202c] border border-[#374151] rounded text-[11px] text-white font-mono"
                >
                  Page {i} &rarr; Block #{blkIdx}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Physical GPU DRAM KV Block Pool */}
      <div className="my-4 p-4 bg-[#131722] rounded border border-[#232734]">
        <div className="flex justify-between items-center text-xs font-mono mb-3">
          <span className="text-white font-bold flex items-center gap-1.5">
            <Database className="w-4 h-4 text-cyan-400" />
            Physical GPU Memory (KV Blocks of 16 tokens):
          </span>
          <span className="text-[#94a3b8] text-[11px]">
            Allocated: {usedPhysicalBlocks} / {totalPhysicalBlocks} blocks
          </span>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {Array.from({ length: totalPhysicalBlocks }).map((_, blkIdx) => {
            // Check which request occupies this block
            const occupyingReq = requests.find((r) => r.physicalBlocks.includes(blkIdx));

            return (
              <div
                key={blkIdx}
                className={`p-2 rounded border text-xs font-mono flex flex-col items-center justify-center min-h-[56px] transition-all ${
                  occupyingReq
                    ? 'bg-[#181f2f] border-emerald-500/50 text-white'
                    : 'bg-[#11141c] border-[#202534] text-[#475569]'
                }`}
              >
                <div className="text-[10px] font-bold">Block #{blkIdx}</div>
                {occupyingReq ? (
                  <div className="flex items-center gap-1 mt-1">
                    <span className={`w-2 h-2 rounded-full ${occupyingReq.color}`} />
                    <span className="text-[10px] text-[#cbd5e1] truncate max-w-[50px]">
                      {occupyingReq.name.split(' ')[1]}
                    </span>
                  </div>
                ) : (
                  <span className="text-[10px] text-[#475569] mt-1">FREE</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Memory Efficiency Comparison Box */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4 font-mono text-xs">
        <div className="p-3 bg-[#131722] border border-[#232734] rounded">
          <span className="text-[#94a3b8] text-[11px] block">PagedAttention Waste</span>
          <span className="text-lg font-bold text-emerald-400">{memoryWastePct}%</span>
          <span className="text-[10px] text-[#64748b] block">Only last-block internal slack</span>
        </div>

        <div className="p-3 bg-[#131722] border border-[#232734] rounded">
          <span className="text-[#94a3b8] text-[11px] block">Naive Contiguous Waste</span>
          <span className="text-lg font-bold text-amber-400">60% - 80%</span>
          <span className="text-[10px] text-[#64748b] block">Pre-allocated max sequence length</span>
        </div>

        <div className="p-3 bg-[#131722] border border-[#232734] rounded">
          <span className="text-[#94a3b8] text-[11px] block">Serving Throughput Gain</span>
          <span className="text-lg font-bold text-white">2x - 4x</span>
          <span className="text-[10px] text-emerald-400 block flex items-center gap-1">
            <Check className="w-3 h-3" /> Enables much larger batch size
          </span>
        </div>
      </div>
    </div>
  );
};
