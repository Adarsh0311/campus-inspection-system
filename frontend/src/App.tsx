import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import BuildingManagementPage from './pages/BuildingManagementPage';
import AddBuildingPage from './pages/AddBuildingPage';

function App() {
    return (
        <Layout>
            <Routes>
                {/* --- Public Routes --- */}
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />

                {/* --- Protected Routes --- */}
                <Route element={<ProtectedRoute />}>
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/buildings" element={<BuildingManagementPage />} />
                    <Route path="/buildings/new" element={<AddBuildingPage />} />
                </Route>
            </Routes>
        </Layout>
    );
}

export default App;