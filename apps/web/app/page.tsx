'use client';

import { useState } from 'react';

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [folder, setFolder] = useState('temporary');

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files?.length) {
      setFile(e.target.files[0]!);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!file) {
      alert('Please select a file');
      return;
    }

    const mime = file.type; // FULL MIME TYPE
    console.log('File type:', mime);

    const response = await fetch('http://localhost:4000/api/v1/get-presigned-url', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        mime,
        folder,
        fileName: file.name,
      }),
    });

    if (!response.ok) {
      console.error('Error getting presigned URL');
      return;
    }

    const data = await response.json();

    const upload = await fetch(data.url, {
      method: 'PUT',
      headers: {
        'Content-Type': file.type,
      },
      body: file,
    });

    if (!upload.ok) {
      console.error('Error uploading to S3');
      return;
    }

    console.log('Upload Success!');
  }

  return (
    <div style={{ padding: '30px' }}>
      <h1>Select a File</h1>

      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} />

        <br />
        <br />

        <select
          value={folder}
          onChange={e => setFolder(e.target.value)}
          style={{ padding: '10px', marginTop: '10px' }}
        >
          <option value="temporary">Temporary</option>
          <option value="uploads">Uploads</option>
          <option value="processed">Processed</option>
        </select>

        <button type="submit" style={{ marginTop: '20px', padding: '10px 20px' }}>
          Upload
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
