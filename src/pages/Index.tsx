import { useGameState } from '@/hooks/useGameState';
import OpeningScreen from '@/components/OpeningScreen';
import LifeStageScreen from '@/components/LifeStageScreen';
import LifeLedger from '@/components/LifeLedger';
import RevealScreen from '@/components/RevealScreen';

const Index = () => {
  const game = useGameState();

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

  // Playing phase
  if (game.phase === 'playing' && game.currentLifeStage) {
    return (
      <div className="flex">
        <div className="flex-1 pr-48 md:pr-56">
          <LifeStageScreen
            stage={game.currentLifeStage}
            choices={game.availableChoices}
            conditionId={game.conditionId!}
            isPrivileged={game.isPrivileged}
            stageIndex={game.currentStage}
            onChoice={game.makeChoice}
          />
        </div>
        <LifeLedger
          netWorth={game.stats.netWorth}
          stress={game.stats.stress}
          socialCapital={game.stats.socialCapital}
          security={game.stats.security}
          isPrivileged={game.isPrivileged}
          stageIndex={game.currentStage}
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
