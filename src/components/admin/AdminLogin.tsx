import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, ArrowLeft, Loader2, Lock } from 'lucide-react';
import { signInAdmin } from '@/services/adminService';

interface AdminLoginProps {
  onSuccess: () => void;
}

export function AdminLogin({ onSuccess }: AdminLoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    if (!email.trim() || !password) {
      setError('Please enter both your admin email and password.');
      return;
    }

    setIsLoading(true);
    try {
      await signInAdmin(email, password);
      onSuccess();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Sign in failed. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="cinematic-card relative z-10 w-full max-w-md rounded-2xl p-8">
      <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full border border-ember-500/35 bg-ember-500/10 text-ember-400">
        <Lock className="h-5 w-5" aria-hidden="true" />
      </div>

      <h1 className="text-center font-display text-3xl font-bold uppercase tracking-wide text-smoke-50">
        Admin Sign In
      </h1>
      <p className="mt-2 text-center text-xs leading-relaxed text-smoke-300">
        Authorized portfolio administrator access only. Public registration is
        disabled.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label
            htmlFor="admin-email"
            className="mb-1.5 block font-mono text-xs uppercase tracking-wider text-smoke-300"
          >
            Admin Email
          </label>
          <input
            id="admin-email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Amrithkaruppasamy1@gmail.com"
            className="w-full rounded-xl border border-white/10 bg-obsidian-950/80 px-4 py-3 text-sm text-smoke-50 placeholder:text-smoke-400 focus:border-ember-400 focus:outline-none"
          />
        </div>

        <div>
          <label
            htmlFor="admin-password"
            className="mb-1.5 block font-mono text-xs uppercase tracking-wider text-smoke-300"
          >
            Password
          </label>
          <input
            id="admin-password"
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••••••"
            className="w-full rounded-xl border border-white/10 bg-obsidian-950/80 px-4 py-3 text-sm text-smoke-50 placeholder:text-smoke-400 focus:border-ember-400 focus:outline-none"
          />
        </div>

        {error && (
          <div
            role="alert"
            className="flex items-start gap-2 rounded-xl border border-ember-500/40 bg-ember-500/10 p-3 text-xs text-ember-200"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-ember-400" />
            <span>{error}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-ember-500 px-6 py-3 text-sm font-semibold text-obsidian-950 shadow-ember transition-colors hover:bg-ember-400 disabled:opacity-60"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Signing In...</span>
            </>
          ) : (
            <span>Sign In to Dashboard</span>
          )}
        </button>
      </form>

      <div className="mt-6 text-center">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs text-smoke-300 transition-colors hover:text-smoke-50"
        >
          <ArrowLeft className="h-3.5 w-3.5 text-ember-400" />
          <span>Back to Public Portfolio</span>
        </Link>
      </div>
    </div>
  );
}
