import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Pages (will create these next)
import Home from './pages/Home';
import Confess from './pages/Confess';
import Search from './pages/Search';
import ViewConfession from './pages/ViewConfession';
import Admin from './pages/Admin';
import NotFound from './pages/NotFound';

function App() {
    return (
        <Router>
            <Toaster
                position="top-center"
                toastOptions={{
                    duration: 3000,
                    style: {
                        background: 'rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(10px)',
                        color: '#fff',
                        border: '1px solid rgba(255, 77, 109, 0.3)',
                    },
                    success: {
                        iconTheme: {
                            primary: '#ff4d6d',
                            secondary: '#fff',
                        },
                    },
                }}
            />

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/confess" element={<Confess />} />
                <Route path="/search" element={<Search />} />
                <Route path="/confession/:code" element={<ViewConfession />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Router>
    );
}

export default App;
