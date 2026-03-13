import { Outlet } from 'react-router-dom'
import Header from '../components/Header.tsx'

function MainLayout({name, desc}) {
    return (
        <>
            <Header name={name} desc={desc}/>
            <Outlet />
        </>
    );
}

export default MainLayout