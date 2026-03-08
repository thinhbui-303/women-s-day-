import React, { useState } from 'react';
import Storyline from './components/Storyline';
import DinoGame from './components/DinoGame';
import Celebration from './components/Celebration';
import './App.css';

function App() {
  const [currentStage, setCurrentStage] = useState('storyline');

  const handleFinishStory = () => {
    setCurrentStage('game');
  };

  const handleWinGame = () => {
    setCurrentStage('celebration');
  };

  const handleRestart = () => {
    setCurrentStage('storyline');
  };

  return (
    <div className="App">
      {currentStage === 'storyline' && <Storyline onFinish={handleFinishStory} />}
      {currentStage === 'game' && <DinoGame onGameComplete={handleWinGame} />}
      {currentStage === 'celebration' && <Celebration onRestart={handleRestart} />}
    </div>
  );
}

export default App;
