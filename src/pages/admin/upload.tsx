import { useState } from 'react';
import api from '../../services/api';
import withAuth from '../../components/withAuth';
import AdminLayout from '../../components/AdminLayout';
import AdminHeader from '../../components/AdminHeader';
import { useLocale } from '../../context/LocaleContext';

interface UploadResponse {
  message: string;
}

function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { t } = useLocale();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setMessage('');
      setError('');
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
      const response = await api.post<UploadResponse>('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setMessage(response.data.message);
      setFile(null);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.response?.data?.message || t('admin.upload.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <AdminHeader />

      <section className="grid gap-8 lg:grid-cols-[1.6fr_1fr]">
        <div className="rounded-3xl border border-dashed border-white/20 bg-white/5 p-10 text-center">
          <div className="flex flex-col items-center justify-center gap-4">
            <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-sky-500/20 text-3xl">
              ⬆️
            </span>
            <div>
              <h2 className="text-xl font-semibold text-white">
                {t('admin.upload.dropzone.title')}
              </h2>
              <p className="mt-2 text-sm text-slate-300">
                {t('admin.upload.dropzone.subtitle')}
              </p>
            </div>
          </div>

          <label
            htmlFor="file-upload"
            className="mt-8 inline-flex cursor-pointer items-center gap-2 rounded-full border border-white/15 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:border-white/30 hover:bg-white/15"
          >
            {t('admin.upload.select')}
            <svg
              className="h-4 w-4"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.6}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 10h12" />
              <path d="M10 4v12" />
            </svg>
          </label>
          <input
            id="file-upload"
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileChange}
            className="hidden"
          />

          {file && (
            <p className="mt-6 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200">
              {t('admin.upload.selected')} <span className="font-semibold">{file.name}</span>
            </p>
          )}

          <button
            type="button"
            onClick={handleUpload}
            disabled={loading || !file}
            className="primary-button mt-8 inline-flex min-w-[12rem] justify-center py-3 text-base disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? t('admin.upload.loading') : t('admin.upload.button')}
          </button>

          {message && (
            <p className="mt-6 rounded-2xl border border-emerald-400/30 bg-emerald-500/15 px-4 py-3 text-sm text-emerald-200">
              {message}
            </p>
          )}
          {error && (
            <p className="mt-6 rounded-2xl border border-rose-400/30 bg-rose-500/15 px-4 py-3 text-sm text-rose-200">
              {error}
            </p>
          )}
        </div>

        <aside className="space-y-6">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
              {t('admin.upload.tips')}
            </p>
            <ul className="mt-4 space-y-3 text-sm text-slate-300">
              <li>{t('admin.upload.tips.item1')}</li>
              <li>{t('admin.upload.tips.item2')}</li>
              <li>{t('admin.upload.tips.item3')}</li>
            </ul>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
              {t('admin.upload.after')}
            </p>
            <p className="mt-3 text-sm text-slate-300">
              {t('admin.upload.after.desc')}
            </p>
          </div>
        </aside>
      </section>
    </AdminLayout>
  );
}

export default withAuth(UploadPage);
