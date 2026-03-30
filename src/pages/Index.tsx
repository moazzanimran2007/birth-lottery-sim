import { useGameState } from '@/hooks/useGameState';
import { LIFE_STAGES } from '@/data/gameData';
import OpeningScreen from '@/components/OpeningScreen';
import LifeStageScreen from '@/components/LifeStageScreen';
import LifeLedger from '@/components/LifeLedger';
import RevealScreen from '@/components/RevealScreen';
import RandomEventScreen from '@/components/RandomEventScreen';
import TransitionScreen from '@/components/TransitionScreen';

const Index = () => {
  const game = useGameState();
  const totalStages = LIFE_STAGES.length;

  // Opening phases
  if (game.phase === 'intro' || game.phase === 'coin_flip' || game.phase === 'condition_reveal') {
    return (
      <OpeningScreen
        phase={game.phase}
        conditionId={game.conditionId}
        onStartFlip={game.startCoinFlip}
        onAssignCondition={game.assignCondition}
        onStartPlaying={game.startPlaying}
      />
    );
  }

  // Random event interstitial
  if (game.phase === 'random_event' && game.pendingEvent) {
    return (
      <RandomEventScreen
        event={game.pendingEvent}
        isPrivileged={game.isPrivileged}
        currentStats={game.stats}
        onAcknowledge={game.acknowledgeEvent}
      />
    );
  }

  // Transition screen
  if (game.phase === 'transition') {
    return (
      <TransitionScreen
        fromAge={game.transitionFromAge}
        toAge={game.transitionToAge}
        isPrivileged={game.isPrivileged}
        stats={game.stats}
        onContinue={game.continueFromTransition}
      />
    );
  }

  // Playing phase
  if (game.phase === 'playing' && game.currentLifeStage) {
    return (
      <div className="flex">
        <div className="flex-1 pb-16 md:pb-0 md:pr-60">
          <LifeStageScreen
            stage={game.currentLifeStage}
            choices={game.availableChoices}
            conditionId={game.conditionId!}
            isPrivileged={game.isPrivileged}
            stageIndex={game.currentStage}
            totalStages={totalStages}
            stats={game.stats}
            onChoice={game.makeChoice}
          />
        </div>
        <LifeLedger
          stats={game.stats}
          isPrivileged={game.isPrivileged}
          stageIndex={game.currentStage}
          totalStages={totalStages}
          history={game.history}
        />
      </div>
    );
  }

  // Reveal phase
  if (game.phase === 'reveal' && game.condition) {
    return (
      <RevealScreen
        condition={game.condition}
        stats={game.stats}
        oppositeCondition={game.oppositeCondition}
        oppositeOutcome={game.oppositeOutcome}
        yourTrajectory={game.yourTrajectory}
        oppositeTrajectory={game.oppositeTrajectory}
        onReplayAs={game.replayWithSameChoices}
        onRestart={game.restart}
      />
    );
  }

  return null;
};

export default Index;
