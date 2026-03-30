import { HashRouter, Routes, Route } from 'react-router-dom';
import BrowsePage from './pages/BrowsePage';
import ViewPage from './pages/ViewDatasetPage';
import CreatePage from './pages/CreatePage2';
import AccountPage from './pages/AccountPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import TutorialsPage from './pages/TutorialsPage';

function App() {
    return (
        <HashRouter>
            <Routes>
                <Route index element={<BrowsePage />} />
                <Route path='/view/' element={<ViewPage />} />
                <Route path='/view/:set_id' element={<ViewPage />} />
                <Route path='/view/:set_id/:vis_mode' element={<ViewPage />} />
                <Route path='/create' element={<CreatePage />} />
                <Route path='/account' element={<AccountPage />} />
                <Route path='/login' element={<LoginPage />} />
                <Route path='/register' element={<RegisterPage />} />
                <Route path='/tutorials' element={<TutorialsPage />} />
            </Routes>
        </HashRouter>
    );
}

export default App;