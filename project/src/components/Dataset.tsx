import {Link} from 'react-router-dom';
import dayjs from "dayjs";
import axios from 'axios'; axios.defaults.withCredentials = true;

function Dataset({dataset}) {
    const upload = dayjs(dataset.upload).format("DD/MM/YYYY");
    const update = dayjs(dataset.update).format("DD/MM/YYYY");

    const addView = async () => {
      try {
        const fd = new FormData();
        fd.append('id',dataset.set_id);
        const response = await axios.post('http://localhost:8000/backend//update-views',fd,);
      } catch (err) {
        alert(err);
      }
    }
    
  return (
      <div className='p-3'>
          <div className='h-full bg-white p-5 rounded-lg shadow-md m-auto font-mono border border-gray-200 hover:border-gray-500 grid gap-3 grid-rows-[auto_1fr_auto]'>
              <div className=''>
                  <h1 className='text-lg font-bold'>{dataset.title}</h1>
                  <h2 className='ml-auto'>Provided by: <strong>{dataset.user__username}</strong></h2>
              </div>
          
            <div className='grid gap-1'>
              <div className='p-1 border border-gray-300 rounded-lg break-words overflow-auto max-h-40'>
                  {dataset.description ? <p>{dataset.description}</p> : <p>No description</p>}
              </div>
              
              <div className='p-1 border border-gray-300 rounded-lg text-sm'>
                  <h2>Upload: {upload}</h2>
                  <h2>Update: {update}</h2>
              </div>
            </div>

              <div className='flex justify-center'>
                  <Link className='border rounded-lg bg-teal-100 border-teal-300 hover:bg-teal-300 shadow-md py-1 px-3' to={`/view/${dataset.set_id}`} onClick={()=>addView()}>
                      Visualise
                  </Link>
              </div>
          </div>
      </div>
  );
}

export default Dataset