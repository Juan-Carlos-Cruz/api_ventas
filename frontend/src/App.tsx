import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { NewSale } from './pages/NewSale';

function App() {
    return (
        <Router>
            <Layout>
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/nueva-venta" element={<NewSale />} />
                    {/* Add other routes as needed */}
                </Routes>
            </Layout>
        </Router>
    );
}

export default App;
