import { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { HomePage } from '@/pages/Home/HomePage';
import { NotFoundPage } from '@/pages/NotFound/NotFoundPage';

const AdminPage = lazy(() =>
  import('@/pages/Admin/AdminPage').then((m) => ({ default: m.AdminPage }))
);

function RouteFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-obsidian-950">
      <Loader2 className="h-7 w-7 animate-spin text-ember-400" />
    </div>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
