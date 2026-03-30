import { useState, useCallback } from 'react';
import { ConditionId, CONDITIONS, LIFE_STAGES, getAvailableChoices, simulateOutcome, simulateTrajectory, getOppositeCondition } from '@/data/gameData';

export type GamePhase = 'intro' | 'coin_flip' | 'condition_reveal' | 'playing' | 'reveal';

export interface GameStats {
  netWorth: number;
  stress: number;
  socialCapital: number;
  security: number;
}

export interface GameState {
  phase: GamePhase;
  conditionId: ConditionId | null;
  currentStage: number; // 0-4
  choicesMade: string[];
  stats: GameStats;
}

export function useGameState() {
  const [state, setState] = useState<GameState>({
    phase: 'intro',
    conditionId: null,
    currentStage: 0,
    choicesMade: [],
    stats: { netWorth: 0, stress: 0, socialCapital: 0, security: 0 },
  });

  const startCoinFlip = useCallback(() => {
    setState(s => ({ ...s, phase: 'coin_flip' }));
  }, []);

  const assignCondition = useCallback((id?: ConditionId) => {
    const conditionId = id || CONDITIONS[Math.floor(Math.random() * CONDITIONS.length)].id;
    const condition = CONDITIONS.find(c => c.id === conditionId)!;
    setState(s => ({
      ...s,
      phase: 'condition_reveal',
      conditionId,
      stats: {
        netWorth: condition.startingNetWorth,
        stress: condition.startingStress,
        socialCapital: condition.startingSocialCapital,
        security: condition.startingSecurity,
      },
    }));
  }, []);

  const startPlaying = useCallback(() => {
    setState(s => ({ ...s, phase: 'playing' }));
  }, []);

  const makeChoice = useCallback((choiceId: string) => {
    setState(s => {
      const stage = LIFE_STAGES[s.currentStage];
      const choice = stage.choices.find(c => c.id === choiceId);
      if (!choice) return s;

      const newChoices = [...s.choicesMade, choiceId];
      const newStats = {
        netWorth: s.stats.netWorth + choice.effects.netWorth,
        stress: Math.max(0, Math.min(100, s.stats.stress + choice.effects.stress)),
        socialCapital: Math.max(0, Math.min(100, s.stats.socialCapital + choice.effects.socialCapital)),
        security: Math.max(0, Math.min(100, s.stats.security + choice.effects.security)),
      };

      const nextStage = s.currentStage + 1;
      const isFinished = nextStage >= LIFE_STAGES.length;

      return {
        ...s,
        choicesMade: newChoices,
        stats: newStats,
        currentStage: isFinished ? s.currentStage : nextStage,
        phase: isFinished ? 'reveal' : 'playing',
      };
    });
  }, []);

  const replayAs = useCallback((newConditionId: ConditionId) => {
    const condition = CONDITIONS.find(c => c.id === newConditionId)!;
    setState(s => ({
      phase: 'playing',
      conditionId: newConditionId,
      currentStage: 0,
      choicesMade: [],
      stats: {
        netWorth: condition.startingNetWorth,
        stress: condition.startingStress,
        socialCapital: condition.startingSocialCapital,
        security: condition.startingSecurity,
      },
    }));
  }, []);

  const replayWithSameChoices = useCallback((newConditionId: ConditionId) => {
    const result = simulateOutcome(newConditionId, state.choicesMade);
    setState(s => ({
      ...s,
      conditionId: newConditionId,
      stats: result,
    }));
  }, [state.choicesMade]);

  const restart = useCallback(() => {
    setState({
      phase: 'intro',
      conditionId: null,
      currentStage: 0,
      choicesMade: [],
      stats: { netWorth: 0, stress: 0, socialCapital: 0, security: 0 },
    });
  }, []);

  const condition = state.conditionId ? CONDITIONS.find(c => c.id === state.conditionId)! : null;
  const currentLifeStage = LIFE_STAGES[state.currentStage] || null;
  const availableChoices = currentLifeStage && state.conditionId
    ? getAvailableChoices(currentLifeStage, state.conditionId)
    : [];
  const isPrivileged = condition?.isPrivileged ?? true;
  const oppositeConditionId = state.conditionId ? getOppositeCondition(state.conditionId) : null;
  const oppositeOutcome = oppositeConditionId
    ? simulateOutcome(oppositeConditionId, state.choicesMade)
    : null;
  const oppositeCondition = oppositeConditionId
    ? CONDITIONS.find(c => c.id === oppositeConditionId)!
    : null;
  const yourTrajectory = state.conditionId
    ? simulateTrajectory(state.conditionId, state.choicesMade)
    : [];
  const oppositeTrajectory = oppositeConditionId
    ? simulateTrajectory(oppositeConditionId, state.choicesMade)
    : [];

  return {
    ...state,
    condition,
    currentLifeStage,
    availableChoices,
    isPrivileged,
    oppositeCondition,
    oppositeOutcome,
    yourTrajectory,
    oppositeTrajectory,
    startCoinFlip,
    assignCondition,
    startPlaying,
    makeChoice,
    replayAs,
    replayWithSameChoices,
    restart,
  };
}
