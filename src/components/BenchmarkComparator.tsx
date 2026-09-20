import React, { useState } from 'react';
import { Paper } from '../types';
import { CATEGORIES } from '../data/categories';
import { ArrowUpDown, Search, ExternalLink, X, TrendingUp } from 'lucide-react';

interface Props {
  papers: Paper[];
  onSelectPaper: (paper: Paper) => void;
  onClose: () => void;
}

export const BenchmarkComparator: React.FC<Props> = ({ papers, onSelectPaper, onClose }) => {
  const [filterQuery, setFilterQuery] = useState('');
  const [sortField, setSortField] = useState<'number' | 'year'>('number');
  const [sortAsc, setSortAsc] = useState(true);

  const filtered = papers.filter(
    (p) =>
      p.title.toLowerCase().includes(filterQuery.toLowerCase()) ||
      p.empiricalBenchmarks.some((b) => b.benchmarkName.toLowerCase().includes(filterQuery.toLowerCase())) ||
      p.organization.toLowerCase().includes(filterQuery.toLowerCase())
  );

  const sorted = [...filtered].sort((a, b) => {
    if (sortField === 'number') {
      return sortAsc ? a.number - b.number : b.number - a.number;
    }
    return sortAsc ? a.year - b.year : b.year - a.year;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="bg-[#090b10] border border-[#232b3b] rounded-xl w-full max-w-6xl h-[92vh] flex flex-col shadow-2xl overflow-hidden text-[#e2e8f0]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#1c2230] bg-[#0c0f17] flex items-center justify-between gap-3 shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-cyan-400" />
              <h2 className="text-base font-bold text-white font-mono tracking-tight">
                CROSS-PAPER BENCHMARK & HARDWARE MATRIX
              </h2>
            </div>
            <p className="text-xs text-[#94a3b8] font-mono mt-0.5">
              Empirical evaluations, baseline improvements, and training hardware across all 33 frontier papers
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative w-48 sm:w-64">
              <Search className="w-3.5 h-3.5 text-[#64748b] absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                placeholder="Filter benchmarks..."
                className="w-full bg-[#11141d] border border-[#232a3b] text-white pl-8 pr-2.5 py-1 rounded text-xs font-mono focus:outline-none focus:border-cyan-500 placeholder:text-[#475569]"
              />
            </div>
            <button
              onClick={onClose}
              className="p-1.5 bg-[#121622] border border-[#22293b] hover:text-white text-[#94a3b8] rounded cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Table */}
        <div className="flex-1 overflow-auto font-mono text-xs">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 z-10 bg-[#11141d] border-b border-[#1c2230] text-[#64748b] text-[11px]">
              <tr>
                <th
                  onClick={() => {
                    if (sortField === 'number') setSortAsc(!sortAsc);
                    else {
                      setSortField('number');
                      setSortAsc(true);
                    }
                  }}
                  className="p-3 font-semibold cursor-pointer hover:text-white"
                >
                  <div className="flex items-center gap-1">
                    <span># Paper</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => {
                    if (sortField === 'year') setSortAsc(!sortAsc);
                    else {
                      setSortField('year');
                      setSortAsc(true);
                    }
                  }}
                  className="p-3 font-semibold cursor-pointer hover:text-white"
                >
                  <div className="flex items-center gap-1">
                    <span>Year / Org</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="p-3 font-semibold">Primary Benchmark</th>
                <th className="p-3 font-semibold text-emerald-400">Paper Score</th>
                <th className="p-3 font-semibold">Previous Baseline</th>
                <th className="p-3 font-semibold text-cyan-400">Relative Gain</th>
                <th className="p-3 font-semibold">Hardware Footprint</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1c2230] bg-[#0d1017]">
              {sorted.map((p) => {
                const b = p.empiricalBenchmarks[0];
                return (
                  <tr
                    key={p.id}
                    onClick={() => onSelectPaper(p)}
                    className="hover:bg-[#131724] cursor-pointer transition-colors"
                  >
                    <td className="p-3">
                      <div className="font-bold text-white flex items-center gap-2">
                        <span className="text-emerald-400">#{p.number < 10 ? `0${p.number}` : p.number}</span>
                        <span className="truncate max-w-[200px]">{p.title}</span>
                      </div>
                      <div className="text-[10px] text-[#64748b] truncate max-w-[200px]">{p.subtitle}</div>
                    </td>
                    <td className="p-3 text-[#cbd5e1] whitespace-nowrap">
                      <div>{p.year}</div>
                      <div className="text-[10px] text-[#64748b]">{p.organization}</div>
                    </td>
                    <td className="p-3 text-[#cbd5e1]">
                      {b ? (
                        <div>
                          <div className="font-semibold text-white">{b.benchmarkName}</div>
                          <div className="text-[10px] text-[#64748b] truncate max-w-[220px]">{b.analysis}</div>
                        </div>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td className="p-3 font-bold text-emerald-400 whitespace-nowrap">
                      {b?.paperScore || '-'}
                    </td>
                    <td className="p-3 text-[#94a3b8] whitespace-nowrap">
                      <div>{b?.previousIterationScore || '-'}</div>
                      <div className="text-[10px] text-[#64748b] truncate max-w-[120px]">{b?.baselineName || ''}</div>
                    </td>
                    <td className="p-3 font-bold text-cyan-400 whitespace-nowrap">
                      {b?.relativeGain || '-'}
                    </td>
                    <td className="p-3 text-[#cbd5e1] text-[11px] max-w-[180px]">
                      <div className="truncate">{p.trainingDynamics.computeAndHardware.split(';')[0]}</div>
                      <div className="text-[10px] text-[#64748b]">Diff: {p.replicationGuide.difficulty}</div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
