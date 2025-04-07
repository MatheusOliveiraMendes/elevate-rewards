// frontend/pages/admin/upload.tsx

import { useState } from 'react';
import axios from 'axios';
import withAuth from '../../components/withAuth';
import { useRouter } from 'next/router';

function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setMessage('');
    setError('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const token = localStorage.getItem('token');
      interface UploadResponse {
        message: string;
      }

      const response = await axios.post<UploadResponse>('http://localhost:3001/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      setMessage(response.data.message);
      setFile(null);
       // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao fazer upload');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Upload de Planilha</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Sair
        </button>
      </div>

      <div className="bg-white p-6 rounded shadow max-w-xl mx-auto">
        <input
          type="file"
          accept=".xlsx, .xls"
          onChange={handleFileChange}
          className="mb-4 block w-full"
        />

        {file && <p className="mb-4 text-sm text-gray-700">Arquivo selecionado: <strong>{file.name}</strong></p>}

        <button
          onClick={handleUpload}
          disabled={loading || !file}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Enviando...' : 'Enviar Planilha'}
        </button>

        {message && <p className="mt-4 text-green-600 text-sm text-center">{message}</p>}
        {error && <p className="mt-4 text-red-600 text-sm text-center">{error}</p>}
      </div>
    </div>
  );
}

export default withAuth(UploadPage);
