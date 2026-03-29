import {Link} from 'react-router-dom';

function Header({name, desc}) {
  return (
      <>
          <div className='m-auto w-200 max-w-screen'>
           <header className='bg-teal-400 font-mono border max-w-full w-200 rounded-md px-3 flex fixed top-3 shadow-md z-10000'> {/* z-50 for stick nav bar over map */}
              <div className='border-r-1 w-1/3 flex items-center'>
                  <h1 className='text-xl'>Header</h1>
              </div>
              <nav className='w-2/3 flex justify-end py-1'>
                  <Link to='/tutorials' className='flex items-center px-3 border-1 mr-1 hover:bg-teal-300'>
                      Tutorials
                  </Link>
                  <Link to='/create' className='flex items-center px-3 border-1 mr-1 hover:bg-teal-300'>
                      Create
                  </Link>
                  
                  <Link to='/' className='flex items-center px-3 border-1 mr-1 hover:bg-teal-300'>
                      Browse
                  </Link>
                  
                  <Link to='/account' className='flex items-center px-3 border-1 mr-1 hover:bg-teal-300'>
                      Account
                  </Link>
              </nav>
          </header>
        </div>

          <div className='bg-linear-to-r from-teal-200 to-teal-800 h-48 w-screen border-b flex flex-col justify-center'>
              <h1 className='text-3xl font-mono text-center'>{name}</h1>
              <h2 className='text-2xl font-mono text-center'>{desc}</h2>
          </div>
      </>
  );
}

export default Header