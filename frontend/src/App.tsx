import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { GameSettingsProvider } from './contexts/GameSettingsContext';
import { UserProvider } from './contexts/UserContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Singleplayer from './pages/Singleplayer';

function App() {
  return (
    <ThemeProvider>
      <GameSettingsProvider>
        <UserProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="singleplayer" element={<Singleplayer />} />
              </Route>
            </Routes>
          </Router>
        </UserProvider>
      </GameSettingsProvider>
    </ThemeProvider>
  )
}

export default App
