import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { FiLock, FiMail } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

type LoginForm = {
  email: string;
  password: string;
};

export const AdminLoginPage = () => {
  const navigate = useNavigate();
  const { login, firebaseUser, isAdmin, loading } = useAuth();
  const { register, handleSubmit, formState: { isSubmitting } } = useForm<LoginForm>();
  const [errorMessage, setErrorMessage] = useState('');

  const submitLogin = async (values: LoginForm) => {
    setErrorMessage('');

    try {
      await login(values.email, values.password);
      navigate('/admin/dashboard', { replace: true });
      toast.success('Signed in');
    } catch (error) {
      console.error(error);
      setErrorMessage('Unable to sign in. Confirm Firebase auth and the admin user record in Firestore.');
      toast.error('Login failed');
    }
  };

  useEffect(() => {
    if (!loading && firebaseUser && isAdmin) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [firebaseUser, isAdmin, loading, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-ink-950 via-ink-900 to-slate-950 px-4 py-10 text-white">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 shadow-glow backdrop-blur-xl lg:grid-cols-[1fr_0.9fr]">
        <div className="relative hidden overflow-hidden p-10 lg:block">
          <div className="absolute inset-0 bg-hero-grid opacity-80" />
          <div className="relative z-10 flex h-full flex-col justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-gold-300">Faculty CMS</p>
              <h1 className="mt-4 max-w-md font-heading text-5xl font-semibold leading-tight">Secure administration for the entire portfolio.</h1>
            </div>
            <div className="grid gap-4 rounded-[1.7rem] border border-white/10 bg-white/10 p-6 text-sm text-white/75">
              <div className="flex items-center gap-3"><FiLock className="text-gold-300" /> Role-based dashboard access</div>
              <div className="flex items-center gap-3"><FiMail className="text-gold-300" /> Firebase Authentication and Firestore CMS</div>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 text-ink-900 dark:bg-ink-900 dark:text-white sm:p-10">
          <p className="text-xs uppercase tracking-[0.35em] text-gold-500 dark:text-gold-300">Admin sign in</p>
          <h2 className="mt-3 font-heading text-3xl font-semibold">Access the dashboard</h2>
          <p className="mt-3 text-sm leading-7 text-ink-600 dark:text-white/65">
            Use the Firebase Auth credentials for an account that has an <span className="font-semibold">admin</span> record in the <span className="font-semibold">users</span> collection.
          </p>

          <form onSubmit={handleSubmit(submitLogin)} className="mt-8 grid gap-4">
            <label className="grid gap-2 text-sm font-medium">
              Email
              <div className="relative">
                <FiMail className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-400" />
                <input {...register('email', { required: true })} type="email" className="w-full rounded-2xl border border-ink-200 bg-white py-3 pl-11 pr-4 text-sm outline-none transition focus:border-gold-400 dark:border-white/10 dark:bg-ink-950/60 dark:text-white" />
              </div>
            </label>

            <label className="grid gap-2 text-sm font-medium">
              Password
              <div className="relative">
                <FiLock className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-400" />
                <input {...register('password', { required: true })} type="password" className="w-full rounded-2xl border border-ink-200 bg-white py-3 pl-11 pr-4 text-sm outline-none transition focus:border-gold-400 dark:border-white/10 dark:bg-ink-950/60 dark:text-white" />
              </div>
            </label>

            {errorMessage ? <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-200">{errorMessage}</p> : null}

            <button type="submit" disabled={isSubmitting} className="mt-2 rounded-2xl bg-ink-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-ink-800 disabled:opacity-70">
              Sign in
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
