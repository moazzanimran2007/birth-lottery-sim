import { useState, useCallback } from 'react';
import {
  type ConditionId, type GameStats, type RandomEvent,
  CONDITIONS, LIFE_STAGES,
  getAvailableChoices, simulateOutcome, simulateTrajectory,
  getOppositeCondition, compoundBetweenStages,
  rollRandomEvents, getEventEffects, applyEffects,
} from '@/data/gameData';

// Re-export applyEffects from gameData (need to export it there)
export type GamePhase = 'intro' | 'coin_flip' | 'condition_reveal' | 'playing' | 'random_event' | 'transition' | 'reveal';

export interface HistoryEntry {
  age: number;
  label: string;
  type: 'choice' | 'event' | 'compound';
  description: string;
  statChanges: Partial<GameStats>;
}

export interface GameState {
  phase: GamePhase;
  conditionId: ConditionId | null;
  currentStage: number;
  choicesMade: string[];
  stats: GameStats;
  history: HistoryEntry[];
  pendingEvent: RandomEvent | null;
  transitionFromAge: number;
  transitionToAge: number;
}

const DEFAULT_STATS: GameStats = {
  netWorth: 0, stress: 50, socialCapital: 50, security: 50,
  health: 70, education: 1, careerTier: 0, creditScore: 600,
};

export function useGameState() {
  const [state, setState] = useState<GameState>({
    phase: 'intro',
    conditionId: null,
    currentStage: 0,
    choicesMade: [],
    stats: DEFAULT_STATS,
    history: [],
    pendingEvent: null,
    transitionFromAge: 0,
    transitionToAge: 14,
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
      stats: { ...condition.startingStats },
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

      // Apply choice effects
      const newStats = applyEffectsLocal(s.stats, choice.effects);

      const historyEntry: HistoryEntry = {
        age: stage.age,
        label: choice.label,
        type: 'choice',
        description: choice.description,
        statChanges: getStatDiff(s.stats, newStats),
      };

      const nextStage = s.currentStage + 1;
      const isFinished = nextStage >= LIFE_STAGES.length;

      if (isFinished) {
        return {
          ...s,
          choicesMade: newChoices,
          stats: newStats,
          phase: 'reveal' as GamePhase,
          history: [...s.history, historyEntry],
        };
      }

      // Transition to next stage — show transition screen with compounding
      const nextAge = LIFE_STAGES[nextStage].age;
      const yearsBetween = nextAge - stage.age;

      // Roll for random events
      const condition = CONDITIONS.find(c => c.id === s.conditionId)!;
      const events = rollRandomEvents(s.conditionId!, nextStage, condition.isPrivileged);

      // Apply compound effects
      const compoundedStats = compoundBetweenStages(newStats, yearsBetween, condition.isPrivileged);
      const compoundEntry: HistoryEntry = {
        age: stage.age,
        label: `${yearsBetween} years pass`,
        type: 'compound',
        description: `Interest, inflation, and life compound your position.`,
        statChanges: getStatDiff(newStats, compoundedStats),
      };

      if (events.length > 0) {
        return {
          ...s,
          choicesMade: newChoices,
          stats: compoundedStats,
          currentStage: nextStage,
          phase: 'random_event' as GamePhase,
          pendingEvent: events[0],
          transitionFromAge: stage.age,
          transitionToAge: nextAge,
          history: [...s.history, historyEntry, compoundEntry],
        };
      }

      // No event — go to transition screen briefly, then playing
      return {
        ...s,
        choicesMade: newChoices,
        stats: compoundedStats,
        currentStage: nextStage,
        phase: 'transition' as GamePhase,
        transitionFromAge: stage.age,
        transitionToAge: nextAge,
        history: [...s.history, historyEntry, compoundEntry],
      };
    });
  }, []);

  const acknowledgeEvent = useCallback(() => {
    setState(s => {
      if (!s.pendingEvent || !s.conditionId) return s;

      const condition = CONDITIONS.find(c => c.id === s.conditionId)!;
      const effects = getEventEffects(s.pendingEvent, condition.isPrivileged);
      const newStats = applyEffectsLocal(s.stats, effects);

      const historyEntry: HistoryEntry = {
        age: s.transitionToAge,
        label: s.pendingEvent.title,
        type: 'event',
        description: s.pendingEvent.description,
        statChanges: getStatDiff(s.stats, newStats),
      };

      return {
        ...s,
        stats: newStats,
        phase: 'playing' as GamePhase,
        pendingEvent: null,
        history: [...s.history, historyEntry],
      };
    });
  }, []);

  const continueFromTransition = useCallback(() => {
    setState(s => ({ ...s, phase: 'playing' }));
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
      stats: DEFAULT_STATS,
      history: [],
      pendingEvent: null,
      transitionFromAge: 0,
      transitionToAge: 14,
    });
  }, []);

  const condition = state.conditionId ? CONDITIONS.find(c => c.id === state.conditionId)! : null;
  const currentLifeStage = LIFE_STAGES[state.currentStage] || null;
  const availableChoices = currentLifeStage && state.conditionId
    ? getAvailableChoices(currentLifeStage, state.conditionId, state.stats)
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
    acknowledgeEvent,
    continueFromTransition,
    replayWithSameChoices,
    restart,
  };
}

function applyEffectsLocal(stats: GameStats, effects: Partial<Record<string, number>>): GameStats {
  return {
    netWorth: stats.netWorth + (effects.netWorth || 0),
    stress: Math.max(0, Math.min(100, stats.stress + (effects.stress || 0))),
    socialCapital: Math.max(0, Math.min(100, stats.socialCapital + (effects.socialCapital || 0))),
    security: Math.max(0, Math.min(100, stats.security + (effects.security || 0))),
    health: Math.max(0, Math.min(100, stats.health + (effects.health || 0))),
    education: Math.max(0, Math.min(5, stats.education + (effects.education || 0))),
    careerTier: Math.max(0, Math.min(5, stats.careerTier + (effects.careerTier || 0))),
    creditScore: Math.max(300, Math.min(850, stats.creditScore + (effects.creditScore || 0))),
  };
}

function getStatDiff(before: GameStats, after: GameStats): Partial<GameStats> {
  const diff: Partial<GameStats> = {};
  const keys = Object.keys(before) as (keyof GameStats)[];
  for (const key of keys) {
    const delta = after[key] - before[key];
    if (Math.abs(delta) > 0.01) {
      diff[key] = Math.round(delta * 100) / 100;
    }
  }
  return diff;
}
