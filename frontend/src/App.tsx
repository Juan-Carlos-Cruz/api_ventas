import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { NewSale } from './pages/NewSale';
import { Persons } from './pages/Persons';
import { Store } from './pages/Store';

function App() {
    return (
        <Router>
            <Routes>
                {/* Public Routes */}
                <Route path="/tienda" element={<Store />} />

                {/* Admin Routes */}
                <Route
                    path="/*"
                    element={
                        <Layout>
                            <Routes>
                                <Route path="/" element={<Dashboard />} />
                                <Route path="/nueva-venta" element={<NewSale />} />
                                <Route path="/personas" element={<Persons />} />
                            </Routes>
                        </Layout>
                    }
                />
            </Routes>
        </Router>
    );
}

export default App;
