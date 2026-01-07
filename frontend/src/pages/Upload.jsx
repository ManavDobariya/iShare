import React, { useState, useRef } from 'react'
import axios from 'axios'

const Upload = () => {
  const [uploaded, setUploaded] = useState(false)
  const [password, setPassword] = useState('')
  const [link, setLink] = useState('')
  const [files, setFiles] = useState([])
  const [isDragging, setIsDragging] = useState(false)

  const fileInputRef = useRef(null)

  const handleFilesSelect = (selectedFiles) => {
    setFiles(selectedFiles)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    handleFilesSelect(Array.from(e.dataTransfer.files))
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleFileUpload = async (e) => {
    e.preventDefault()

    const formData = new FormData()
    files.forEach((file) => formData.append('files', file))
    formData.append('password', password)

    try {
      const response = await axios.post(
        'http://localhost:1234/upload',
        formData
      )

      setLink(window.location.origin + '/' + response.data.hash)
      setUploaded(true)
    } catch (err) {
      console.error(err)
    }
  }

  const copyLink = () => {
    navigator.clipboard.writeText(link)
    const btn = document.getElementById('copy')
    btn.innerText = 'Copied!'
    setTimeout(() => (btn.innerText = 'Copy'), 3000)
  }

  return (
    <div className="relative h-screen overflow-hidden">

      {/* 🔹 Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center scale-105"
        style={{ backgroundImage: "url('/bg.jpg')" }}
      ></div>

      {/* 🔹 Content */}
      <div className="relative z-10 flex items-center justify-center h-screen">

        {/* 🔹 Glass Card */}
        <div className="relative w-[450px] rounded-md shadow-2xl ">

          {/* Blur layer */}
          <div className="absolute inset-0 bg-white/40 backdrop-blur-md rounded-md"></div>

          {/* Content */}
          <div className="relative z-10 p-4">

            <form onSubmit={handleFileUpload}>

              {/* Drag & Drop */}
              <div
                onClick={() => fileInputRef.current.click()}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={`mb-2 border-2 border-dashed rounded-md w-full py-6 px-3 text-center cursor-pointer transition
                  ${isDragging
                    ? 'border-blue-600 bg-blue-50/50'
                    : 'border-zinc-500'}`}
              >
                <input
                  type="file"
                  multiple
                  ref={fileInputRef}
                  onChange={(e) =>
                    handleFilesSelect(Array.from(e.target.files))
                  }
                  hidden
                />

                <p className="text-zinc-800 font-medium">
                  {isDragging
                    ? 'Drop files here 👇'
                    : 'Drag & drop files or click to select'}
                </p>
              </div>

              {/* Preview */}
              {files.length > 0 && (
                <ul className="mb-2 grid grid-cols-2 gap-3 max-h-40 overflow-y-auto">
                  {files.map((file, i) => (
                    <li key={i} className="border rounded p-2 bg-white/70 ">
                      <img
                        src={URL.createObjectURL(file)}
                        alt=""
                        className="h-20 w-full object-cover rounded"
                      />
                      <p className="text-xs truncate mt-1">
                        {file.name}
                      </p>
                    </li>
                  ))}
                </ul>
              )}

              <input
                type="password"
                placeholder="Password"
                className="mb-2 border border-zinc-700 rounded-md w-full py-3 px-3 bg-transparent outline-none"
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <input
                type="submit"
                value="Upload"
                className="w-full bg-blue-700 hover:bg-blue-900 text-white py-3 rounded-md cursor-pointer"
                disabled={files.length === 0}
              />
            </form>

            {uploaded && (
              <div className="flex items-center justify-between mt-4 px-3 py-3 rounded-md bg-green-600 text-white">
                <p className="font-semibold">File Uploaded Successfully</p>
                <button
                  id="copy"
                  onClick={copyLink}
                  className="bg-white text-green-600 px-2 py-1 rounded-md shadow"
                >
                  Copy
                </button>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  )
}

export default Upload
