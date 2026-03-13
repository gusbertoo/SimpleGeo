import Datasets from '../components/Datasets.tsx'
import Header from '../components/Header'

function Browse() {
  return (
      <>
          <Header name='Browse Datasets' desc='View public datasets uploaded and managed by other users' />
          <div className='min-h-screen bg-gray-100'>
              <Datasets />
          </div>
      </>
  );
}

export default Browse
