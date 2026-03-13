import { useState } from 'react'
import Header from '../components/Header';
import { Link } from 'react-router-dom';
import axios from 'axios';

function LoginPage() {
	return (
		<div className='bg-gray-100 min-h-screen grid grid-rows-[auto_1fr_auto] gap-3 overflow-hidden font-mono'>
			<div className='row-start-1'>
				<Header name='Login' desc='Sign in to be able to view, upload and manage your datasets' />
			</div>

			<div className='p-3 row-start-2 w-screen'>
				<div className='max-w-full w-100 xl:w-200 xl:text-xl mx-auto grid gap-5'>
					<form className='w-full grid place-items-center gap-2'>
						<input type='text' className='bg-white border border-white px-3 rounded-lg shadow-sm hover:border-gray-300 w-full' placeholder='Username'/>
						<input type='email' className='bg-white border border-white px-3 rounded-lg shadow-sm hover:border-gray-300 w-full' placeholder='Email'/>
						<input type='password' className='w-full bg-white border border-white px-3 rounded-lg shadow-sm hover:border-gray-300' placeholder='********'/>
						<button className='bg-black text-center xl:py-1 xl:w-70 w-50 max-w-full rounded-full text-white cursor-pointer'>Create Account</button>
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
			<div className='h-32 bg-teal-700 row-start-3'/>
		</div>
	);
};

export default LoginPage;