import { useState } from 'react'
import Header from '../components/Header';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
axios.defaults.withCredentials = true;

function LoginPage() {
	const navigate = useNavigate();
	const handleLogin = async (e,user, password) => {
		e.preventDefault();
		try {
			const fd = new FormData();
		   	fd.append('user', user);
		   	fd.append('password', password)
		    const response = await axios.post('http://localhost:8000/backend/login',fd,);
		    if (response.data['success']) {
		    	return navigate('/account');
		    }
		    alert(response.data['error']);
		} catch (err) {
			console.log(err);
		}
	}

	return (
		<div className='bg-gray-100 min-h-screen grid grid-rows-[auto_1fr_auto] gap-3 overflow-hidden font-mono'>
			<div className='row-start-1'>
				<Header name='Login' desc='Sign in to be able to view, upload and manage your datasets' />
			</div>
			<div className='p-3 row-start-2 w-screen'>
				<div className='w-100 xl:w-200 mx-auto max-w-full grid gap-5 xl:text-xl'>
					<form className='w-full grid place-items-center gap-2'>
						<input id='user' type='text' className='bg-white border border-white px-3 rounded-lg shadow-sm hover:border-gray-300 w-full' placeholder='Username or email'/>
						<input id='password' type='password' className='w-full bg-white border border-white px-3 rounded-lg shadow-sm hover:border-gray-300' placeholder='********'/>
						<button className='bg-black text-center w-30 xl:w-50 rounded-full text-white cursor-pointer' onClick={(e)=>handleLogin(e, document.getElementById('user').value, document.getElementById('password').value)}>Login</button>
					</form>
					<div className='grid gap-5'>
						<div className='border-t'>
							<p className='absolute bg-gray-100 px-3 -translate-y-1/2 left-1/2 -translate-x-1/2 text-xs'>or</p>
						</div>
						<Link to='/register'>
							<p className='text-center underline 4text-sm'>Create an account</p>
						</Link>
					</div>
				</div>
			</div>
			<div className='h-32 bg-teal-700 row-start-3'/>
		</div>
	);
};

export default LoginPage;