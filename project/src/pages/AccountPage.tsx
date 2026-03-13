import { Navigate } from 'react-router-dom'

function AccountPage() {
	if (true) {
		return <Navigate to='/login'/>
	}
	else {
		return (
			<h1>false</h1>
		)
	}
}

export default AccountPage;