import { useState } from 'react'
import Header from '../components/Header';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
axios.defaults.withCredentials = true;

function RegisterPage() {

	const navigate = useNavigate();
	const handleRegister = async (username, email, password) => {
		if (username == '' || email == '' || password == '') {
			if (username == '') alert('The username field is required');
			if (email == '') alert('The email field is required');
			if (password == '') alert('The password field is required');
			return;
		}
		try {
			const fd = new FormData();
		   	fd.append('username', username);
		   	fd.append('email', email)
		   	fd.append('password', password)
		    const response = await axios.post('http://localhost:8000/backend/register',fd,);
		    if (response.data['error']) {
		    	return alert(response.data['error']);
		    }
		    navigate('/account')
		} catch (err) {
			alert(err);
		}
	}

	return (
		<div className='bg-gray-100 min-h-screen grid grid-rows-[auto_1fr_auto] gap-3 overflow-hidden font-mono'>
			<div className='row-start-1'>
				<Header name='Login' desc='Sign in to be able to view, upload and manage your datasets' />
			</div>

			<div className='p-3 row-start-2 w-screen'>
				<div className='max-w-full w-100 xl:w-200 xl:text-xl mx-auto grid gap-5'>
					<form className='w-full grid place-items-center gap-2'>
						<input id='username' type='text' className='bg-white border border-white px-3 rounded-lg shadow-sm hover:border-gray-300 w-full' placeholder='Username'/>
						<input id='email' type='email' className='bg-white border border-white px-3 rounded-lg shadow-sm hover:border-gray-300 w-full' placeholder='Email'/>
						<input id='password' type='password' className='w-full bg-white border border-white px-3 rounded-lg shadow-sm hover:border-gray-300' placeholder='********'/>
						<button className='bg-black text-center xl:py-1 xl:w-70 w-50 max-w-full rounded-full text-white cursor-pointer' onClick={(e) => {handleRegister(document.getElementById('username').value,document.getElementById('email').value,document.getElementById('password').value); e.preventDefault();}}>Create Account</button>
					</form>
					<div className='grid gap-5'>
						<div className='border-t'>
							<p className='absolute bg-gray-100 px-3 -translate-y-1/2 left-1/2 -translate-x-1/2 text-xs'>or</p>
						</div>
						<Link to='/login'>
							<p className='text-center underline text-sm'>Login</p>
						</Link>
					</div>
				</div>
			</div>
			<div className='h-32 bg-linear-to-r from-teal-800 to-teal-200 border-t row-start-3'/>
		</div>
	);
};

export default RegisterPage;