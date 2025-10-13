import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';

// Let's create a placeholder for a home page
const HomePage = () => <div><h2>Welcome to the Home Page</h2></div>;

function App() {
    return (
        <Layout>
            <Routes>
                <Route path="/" element={<HomePage />} />
                {/* Other routes for login, dashboard, etc., will go here */}
            </Routes>
        </Layout>
    );
}


export default App ;