import { useGameStore } from './store/gameStore';
import { ScreenTransition } from './components/common/ScreenTransition';
import { MainMenu } from './components/screens/MainMenu';
import { MinigameSelector } from './components/screens/MinigameSelector';
import { FarmView } from './components/farm/FarmView';
import { Shop } from './components/farm/Shop';
import { Achievements } from './components/farm/Achievements';
import { DailyChallenges } from './components/farm/DailyChallenges';
import { EggNest } from './components/minigames/EggNest/EggNest';
import { GooseMarch } from './components/minigames/GooseMarch/GooseMarch';
import { FlockFlight } from './components/minigames/FlockFlight/FlockFlight';
import { FenceBuilder } from './components/minigames/FenceBuilder/FenceBuilder';
import { GooseDetective } from './components/minigames/GooseDetective/GooseDetective';
import { FractionFarm } from './components/minigames/FractionFarm/FractionFarm';
import { SecretDebugPanel } from './components/debug/SecretDebugPanel';
import { UpdatePrompt } from './components/common/UpdatePrompt';
import './App.css';

function App() {
  const { currentScreen, currentMinigame } = useGameStore();

  const screenKey = currentScreen === 'minigame' && currentMinigame
    ? `minigame-${currentMinigame}`
    : currentScreen;

  const renderScreen = () => {
    // Minigame routing
    if (currentScreen === 'minigame' && currentMinigame) {
      switch (currentMinigame) {
        case 'eggNest':
          return <EggNest />;
        case 'gooseMarch':
          return <GooseMarch />;
        case 'flockFlight':
          return <FlockFlight />;
        case 'fenceBuilder':
          return <FenceBuilder />;
        case 'gooseDetective':
          return <GooseDetective />;
        case 'fractionFarm':
          return <FractionFarm />;
      }
    }

    // Screen routing
    switch (currentScreen) {
      case 'mainMenu':
        return <MainMenu />;
      case 'farm':
        return <FarmView />;
      case 'minigameSelector':
        return <MinigameSelector />;
      case 'shop':
        return <Shop />;
      case 'achievements':
        return <Achievements />;
      case 'dailyChallenges':
        return <DailyChallenges />;
      default:
        return <MainMenu />;
    }
  };

  return (
    <>
      <ScreenTransition screenKey={screenKey}>
        {renderScreen()}
      </ScreenTransition>
      <SecretDebugPanel />
      <UpdatePrompt />
    </>
  );
}

export default App;
