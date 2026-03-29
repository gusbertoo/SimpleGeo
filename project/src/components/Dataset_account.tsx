import {Link} from 'react-router-dom';
import dayjs from "dayjs";
import { useState } from 'react'
import { FaLock, FaLockOpen } from 'react-icons/fa'
import axios from 'axios'; axios.defaults.withCredentials = true;

function Dataset({dataset, username, getUserSets, setUpdate}) {
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

    const updatePublic = async (public_) => {
      try {
        const fd = new FormData();
        fd.append('id', dataset['set_id']);
        fd.append('public', public_)
        const response = await axios.post('http://localhost:8000/backend/update-public-status',fd);
        getUserSets();
      } catch (err) {
        alert(err);
      }
    }
    
  return (
      <div className='p-3'>
          <div className='relative h-full bg-white p-5 rounded-lg shadow-md m-auto font-mono border border-gray-200 hover:border-gray-500 grid gap-3 grid-rows-[auto_1fr_auto]'>
            <div className='absolute top-3 right-3'>
              <select onChange={(e)=>updatePublic(e.target.value)} value={dataset.public ? 'Public':'Private'} className='w-5 appearance-none outline-none cursor-pointer text-white border border-gray-300 hover:border-gray-500 rounded-md shadow-lg'>
                <option>Public</option>
                <option>Private</option>
              </select>
              <div className='absolute top-0 w-5 h-full pointer-events-none grid place-items-center'>{dataset.public ? <FaLockOpen title='Public' className='w-4 h-3 text-gray-500'/> : <FaLock title='Private' className='w-4 h-3 text-gray-500'/>}</div>
            </div>
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
                  <button onClick={()=>setUpdate(dataset)} className='border rounded-lg border-gray-300 hover:border-gray-500 shadow-md p-1 text-center col-span-2 lg:col-span-1 cursor-pointer'>
                      Update
                  </button>
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