import {Link} from 'react-router-dom';
import dayjs from "dayjs";

function Dataset({dataset}) {
    const upload = dayjs(dataset.upload).format("DD/MM/YYYY");
    const update = dayjs(dataset.update).format("DD/MM/YYYY");
    
  return (
      <div className='w-1/3 p-3'>
          <div className='bg-white p-8 rounded-lg shadow-md m-auto font-serif'>
              <div className='flex'>
                  <h1 className='text-2xl font-bold underline'>{dataset.title}</h1>
                  <h2 className='ml-auto'>{dataset.username_id}</h2>
              </div>
              
              <div>
                  {dataset.description ? <p>{dataset.description}</p> : <p>No description</p>}
              </div>
              
              <div className='pt-3'>
                  <h2>Upload: {upload}</h2>
                  <h2>Last Update: {update}</h2>
              </div>
              <div className='pt-3'>
                  <Link to={`/view/${dataset.set_id}`}>
                      Show Visualisation
                  </Link>
              </div>
          </div>
      </div>
  );
}

export default Dataset