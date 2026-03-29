import Datasets from '../components/Datasets.tsx'
import Header from '../components/Header'

function Browse() {
  return (
      <div className='bg-gray-100 min-h-screen grid grid-rows-[auto_1fr_auto] gap-3 overflow-hidden font-mono'>
        <div className='row-start-1'>
          <Header name='Browse Datasets' desc='View public datasets uploaded and managed by other users' />
        </div>
        <div>
          <div className='row-start-2 px-3 flex justify-center w-screen'>
            <Datasets />
          </div>
        </div>
        <div className='h-32 bg-linear-to-r from-teal-800 to-teal-200 border-t row-start-3'/>
      </div>
  );
}

export default Browse
