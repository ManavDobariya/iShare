import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDownload } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios'

const FileViewer = () => {
  const hash = window.location.pathname.slice(1)
  const [password, setPassword] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [authenticated, setAuthenticated] = useState(false)
  const [files, setFiles] = useState([])

  const accessFiles = async (e) => {
    e.preventDefault()

    try {
      const response = await axios.post('http://localhost:1234/access', {
        hash,
        password
      })

      if (response.status === 200) {
        setAuthenticated(true)
        setFiles(response.data)
      } else {
        setErrorMsg('Access denied!')
      }
    } catch (err) {
      setErrorMsg('Invalid password')
    }
  }

  return (
    <div className="relative min-h-screen h-screen overflow-hidden">
      
      {/* 🔹 Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center scale-105 "
        style={{ backgroundImage: "url('/bg.jpg')" }}
      ></div>

      {/* 🔹 Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen  ">
        {
          authenticated ? (
            <div className="h-[450px] shadow-2xl border-none bg-white/50 backdrop-blur-lg rounded-lg p-3 w-[450px] overflow-y-auto ">
              <table className='w-full'>
                <caption className="text-center text-2xl font-semibold mb-2">Files</caption>
                <tbody>
                  {
                    files.map((file, index) => (
                      <tr key={index}>
                        <td className="border px-4 py-2 border-zinc-500 ">{file.name}</td>
                        <td className="border px-4 py-2 text-right border-zinc-500">
                          <a
                            href={file.url}
                            className="text-blue-600 hover:text-blue-800"
                            download
                          >
                            <FontAwesomeIcon icon={faDownload} />
                          </a>
                        </td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </div>
          ) : (
            <form
              className=" backdrop-blur-lg px-5 py-5 w-[450px] h-[200px] rounded-lg bg-white/40 shadow-xl justify-center items-center flex flex-col"
              onSubmit={accessFiles}
            >
              <input
                type='password'
                placeholder='Password'
                onChange={(e) => setPassword(e.target.value)}
                className='w-full py-3 px-3 border border-zinc-500 outline-none rounded-md mb-3 bg-transparent'
                required
              />

              {errorMsg && (
                <p className='text-red-600 font-semibold mb-2'>
                  {errorMsg}
                </p>
              )}

              <input
                type='submit'
                value='Access files'
                className='w-full bg-blue-700 hover:bg-blue-900 rounded-md text-white py-3'
              />
            </form>
          )
        }
      </div>
    </div>
  )
}

export default FileViewer
