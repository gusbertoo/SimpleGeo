import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import BrowsePage from './pages/BrowsePage';
import ViewPage from './pages/ViewDatasetPage';
import CreatePage from './pages/CreatePage2';
import AccountPage from './pages/AccountPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'

const router2 = createBrowserRouter (
    createRoutesFromElements(
        <Route path='/' element={ <MainLayout name='Browse Datasets' desc='View public datasets uploaded and managed by other users' /> }>
            <Route index element={ <BrowsePage /> } />
            <Route path='/view/:set_id' element={ <ViewPage /> } />
        </Route>
    )
);

const router = createBrowserRouter(
    createRoutesFromElements(
        <>
            <Route index element={<BrowsePage />} />
            <Route path='/view/' element={ <ViewPage /> } />
            <Route path='/view/:set_id' element={ <ViewPage /> } />
            <Route path='/view/:set_id/:vis_mode' element={ <ViewPage /> } />
            <Route path='/create' element={ <CreatePage /> } />
            <Route path='/account' element={ <AccountPage /> } />
            <Route path='/login' element={ <LoginPage /> } />
            <Route path='/register' element={ <RegisterPage /> } />
        </>
    )
);

function App() {
  return (
      <RouterProvider router={router} />
  );
}

export default App;
