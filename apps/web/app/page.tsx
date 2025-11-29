'use client';

import { useState } from 'react';

export default function Home() {
  const [file, setFile] = useState<File | null>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]!);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!file) {
      alert('Please select a file');
      return;
    }

    const mime = file.type.split('/')[1];

    console.log(file.type,mime)

    const response = await fetch('http://localhost:4000/api/get-presigned-url', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        mime,
      }),
    });

    if (!response.ok) {
      console.log('error in presign url');
    }

    const data = await response.json();

    const res = await fetch(data.url,{
      method:"PUT",
      headers:{
        'Content-Type': file.type || 'application.octet-stream',
      },
      body: file,
    })

     if (!res.ok) {
      console.log('error whe uploading to s3');
    }

    console.log("Success");

  }

  return (
    <div style={{ padding: '30px' }}>
      <h1>Select a File</h1>

      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} />

        <button type="submit" style={{ marginTop: '20px', padding: '10px 20px' }}>
          Submit
        </button>
      </form>

      {file && (
        <p style={{ marginTop: '15px' }}>
          Selected file: <strong>{file.name}</strong>
        </p>
      )}
    </div>
  );
}
