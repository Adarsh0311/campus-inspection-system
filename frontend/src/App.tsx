import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import LoginPage from "./pages/LoginPage.tsx";

// Let's create a placeholder for a home page
const HomePage = () => <div><h2>Welcome to the Home Page</h2></div>;

function App() {
    return (
        <Layout>
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/login" element={<LoginPage />} />
            </Routes>
        </Layout>
    );
}


export default App ;