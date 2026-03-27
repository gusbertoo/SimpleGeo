import {Link} from 'react-router-dom';
import dayjs from "dayjs";
import { useState } from 'react'
import axios from 'axios'; axios.defaults.withCredentials = true;

function Dataset({dataset, username, getUserSets}) {
    const upload = dayjs(dataset.upload).format("DD/MM/YYYY");
    const update = dayjs(dataset.update).format("DD/MM/YYYY");
    const [showDeleteDataset, setShowDeleteDataset] = useState(false);

    const deleteDataset = async () => {
      try {
        const fd = new FormData();
        fd.append('id', dataset['set_id']);
        const response = await axios.post('http://localhost:8000/backend/delete-dataset',fd);
        getUserSets();
        setShowDeleteDataset(false);
      } catch (err) {
        alert(err);
      }
    }
    
  return (
      <div className='p-3'>
          <div className='h-full bg-white p-5 rounded-lg shadow-md m-auto font-mono border border-gray-200 hover:border-gray-500 grid gap-3 grid-rows-[auto_1fr_auto]'>
              <div className=''>
                  <h1 className='text-lg font-bold'>{dataset.title}</h1>
                  <h2 className='ml-auto'>Provided by: <strong>{username}</strong></h2>
              </div>
          
            <div className='grid grid-rows-[1fr_auto] gap-1'>
              <div className='p-1 border border-gray-300 rounded-lg text-sm'>
                  {dataset.description ? <p>{dataset.description}</p> : <p>No description</p>}
              </div>
              
              <div className='p-1 border border-gray-300 rounded-lg text-sm w-fit'>
                  <h2>Upload: {upload}</h2>
                  <h2>Update: {update}</h2>
              </div>
            </div>

              <div className='grid grid-cols-2 gap-3 text-sm'>
                  <Link className='border rounded-lg border-gray-300 hover:border-gray-500 shadow-md p-1 text-center col-span-2 lg:col-span-1' to={`/view/${dataset.set_id}`}>
                      Update
                  </Link>
                  <button className='border rounded-lg bg-red-200 border-red-400 hover:bg-red-400 shadow-md p-1 text-center cursor-pointer col-span-2 lg:col-span-1' onClick={()=>setShowDeleteDataset(true)}>
                    Delete
                  </button>
              </div>
              <Link className='border rounded-lg bg-teal-100 border-teal-300 hover:bg-teal-300 shadow-md p-1 text-center' to={`/view/${dataset.set_id}`}>
                  Visualise
              </Link>
          </div>
          {showDeleteDataset &&
              <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                <div className="bg-white p-5 rounded-md shadow-lg w-80">
                    <h2 className="font-bold mb-3">Are you sure you want to delete this dataset?</h2>
                    <h2>Title: {dataset['title']}</h2>

                    <div className="flex justify-center gap-2">
                        <button onClick={() => setShowDeleteDataset(false)} className="px-3 py-1 bg-gray-200 rounded cursor-pointer">No</button>
                        <button onClick={() => deleteDataset()} className="px-3 py-1 bg-blue-500 text-white rounded cursor-pointer">Yes</button>
                    </div>
                </div>
              </div>
          }
      </div>
  );
}

export default Dataset