import React from 'react';
import { Paper } from '../../types';
import { AttentionMatrixVisualizer } from './AttentionMatrixVisualizer';
import { ScalingLawsVisualizer } from './ScalingLawsVisualizer';
import { MoeRouterVisualizer } from './MoeRouterVisualizer';
import { LoraRankVisualizer } from './LoraRankVisualizer';
import { PagedAttentionVisualizer } from './PagedAttentionVisualizer';
import { DiffusionStepVisualizer } from './DiffusionStepVisualizer';
import { RlhfRewardVisualizer } from './RlhfRewardVisualizer';
import { TestTimeBudgetVisualizer } from './TestTimeBudgetVisualizer';
import { LatentEquilibriumVisualizer } from './LatentEquilibriumVisualizer';
import { NeuroSymbolicVisualizer } from './NeuroSymbolicVisualizer';
import { SafetyAlignmentVisualizer } from './SafetyAlignmentVisualizer';
import { RecurrentDepthVisualizer } from './RecurrentDepthVisualizer';
import { Sparkles, Terminal } from 'lucide-react';

interface Props {
  paper: Paper;
}

export const InteractiveToyContainer: React.FC<Props> = ({ paper }) => {
  const toyType = paper.interactiveToy?.type;

  const renderToy = () => {
    switch (toyType) {
      case 'attention_matrix':
        return <AttentionMatrixVisualizer />;
      case 'scaling_laws':
      case 'scaling_curve':
        return <ScalingLawsVisualizer />;
      case 'moe_routing':
      case 'moe_router':
        return <MoeRouterVisualizer />;
      case 'lora_rank':
        return <LoraRankVisualizer />;
      case 'paged_attention':
      case 'paged_blocks':
        return <PagedAttentionVisualizer />;
      case 'diffusion_steps':
      case 'diffusion_denoise':
        return <DiffusionStepVisualizer />;
      case 'rlhf_reward':
      case 'rlhf_ppo':
        return <RlhfRewardVisualizer />;
      case 'test_time_budget':
        return <TestTimeBudgetVisualizer />;
      case 'latent_equilibrium':
        return <LatentEquilibriumVisualizer />;
      case 'neuro_symbolic':
        return <NeuroSymbolicVisualizer />;
      case 'safety_faking':
        return <SafetyAlignmentVisualizer />;
      case 'recurrent_depth':
        return <RecurrentDepthVisualizer />;
      default:
        // Fallback for generic stepper or agent sandbox
        if (paper.category === 'architecture-scaling') {
          return <ScalingLawsVisualizer />;
        }
        if (paper.category === 'systems-efficiency') {
          return <PagedAttentionVisualizer />;
        }
        if (paper.category === 'reasoning-compute') {
          return <TestTimeBudgetVisualizer />;
        }
        if (paper.category === 'safety-governance') {
          return <SafetyAlignmentVisualizer />;
        }
        return <AttentionMatrixVisualizer />;
    }
  };

  return (
    <div className="space-y-3">
      {paper.interactiveToy && (
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-white font-mono flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              {paper.interactiveToy.title}
            </h3>
            <p className="text-xs text-[#94a3b8] mt-0.5 font-sans">
              {paper.interactiveToy.description}
            </p>
          </div>
        </div>
      )}
      {renderToy()}
    </div>
  );
};
