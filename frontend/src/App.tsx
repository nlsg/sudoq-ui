import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './ThemeContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Singleplayer from './pages/Singleplayer';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="singleplayer" element={<Singleplayer />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  )
}

export default App
