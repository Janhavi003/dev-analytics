import LoginButton from "../components/LoginButton";

const Login = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <a
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-white/80 hover:text-white"
          >
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-white/10 ring-1 ring-white/10">
              DA
            </span>
            Dev Analytics
          </a>

          <div className="mt-6 rounded-2xl bg-white/5 p-6 shadow-sm ring-1 ring-white/10">
            <h1 className="text-xl font-semibold tracking-tight">
              Sign in to your dashboard
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-white/70">
              Connect GitHub to generate your developer analytics and insights.
            </p>

            <div className="mt-6">
              <LoginButton />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;