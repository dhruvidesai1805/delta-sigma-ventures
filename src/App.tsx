import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/common/Layout';
import { UserList } from './components/users/UserList';

function App() {
    return (
        <Router>
            <Layout>
                <Routes>
                    <Route path="/" element={<UserList />} />
                </Routes>
            </Layout>
        </Router>
    );
}

export default App;
