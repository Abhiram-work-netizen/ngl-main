import { login } from "./actions";

export default function LoginPage({ searchParams }: { searchParams: { error?: string } }) {
  const error = searchParams.error;

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gradient-radial from-pink-500/10 to-transparent opacity-30 blur-2xl -z-10" />
      <div className="w-full max-w-md p-8 glass-card rounded-[2rem]">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2 text-white">Enter App</h1>
          <p className="text-white/60">Choose a username to get your link.</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-xl mb-6 text-sm text-center">
            {error}
          </div>
        )}

        <form action={login} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm text-white/70 mb-1 ml-2 font-medium">Username</label>
            <input
              name="username"
              type="text"
              placeholder="e.g. alex2025"
              required
              className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-white/30 focus:outline-none focus:border-pink-500 transition-colors"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-pink-500 to-orange-500 text-white font-bold text-lg py-4 rounded-full mt-4 hover:scale-[1.02] transition-transform shadow-[0_0_20px_rgba(236,72,153,0.3)]"
          >
            Enter Dashboard
          </button>
        </form>
      </div>
    </main>
  );
}
