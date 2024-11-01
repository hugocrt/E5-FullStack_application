import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LogInPage from "./pages/LogIn";
import HomePage from './pages/Home';
import SearchPage from './pages/Search';
import ProfilePage from './pages/Profile';
import SettingsPage from './pages/Settings';
import CreatePostPage from './pages/CreatePost';
import EditProfilePage from './pages/EditProfile';

import ProtectedRoute from './components/ProtectedRoute';


function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LogInPage />} />
                <Route path="/home/me" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
                <Route path="/search" element={<ProtectedRoute><SearchPage /></ProtectedRoute>} />
                <Route path="/settings/me" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
                <Route path="/profile/me" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
                <Route path="/profile/me/edit" element={<ProtectedRoute><EditProfilePage /></ProtectedRoute>} />
                <Route path="/newpost/me" element={<ProtectedRoute><CreatePostPage /></ProtectedRoute>} />
                <Route path="/profile/:userId" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            </Routes>
        </Router>
    );
}

export default App;
