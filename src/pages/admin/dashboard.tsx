import { useRouter } from 'next/router';
import withAuth from '../../components/withAuth';
import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import AdminLayout from '../../components/AdminLayout';

interface JwtPayload {
  id: string;
  role: 'admin' | 'user';
}

function AdminDashboard() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode<JwtPayload>(token);
      setIsAdmin(decoded.role === 'admin');
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  if (!isAdmin) return null;

  return (
    <AdminLayout>
      <div className="min-h-screen p-8 bg-gray-50">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Painel do Administrador</h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Sair
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded shadow hover:shadow-md transition cursor-pointer" onClick={() => router.push('/admin/upload')}>
            <h2 className="text-xl font-semibold mb-2">📤 Upload de Planilha</h2>
            <p className="text-gray-600">Importe transações a partir de uma planilha Excel.</p>
          </div>

          <div className="bg-white p-6 rounded shadow hover:shadow-md transition cursor-pointer" onClick={() => router.push('/admin/report')}>
            <h2 className="text-xl font-semibold mb-2">📊 Relatório de Transações</h2>
            <p className="text-gray-600">Visualize e filtre todas as transações do sistema.</p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default withAuth(AdminDashboard);
