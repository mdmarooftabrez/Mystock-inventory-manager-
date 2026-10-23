import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Brand from "../../components/layout/Brand";
import AuthContext from "../../context/auth-context";

function RegisterPage() {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }

    setSaving(true);
    try {
      await register(name, email, password);
      navigate("/products", { replace: true });
    } catch (registerError) {
      setError(registerError.message || "Could not create your account. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-gray-50 px-3 py-6 sm:px-4 sm:py-10">
      <section className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-8">
        <Brand />
        <h1 className="mt-6 text-2xl font-bold text-gray-900 sm:mt-8">Create your MyStock account</h1>
        <p className="mt-2 text-sm text-gray-600">Add products, track stock levels, and keep your inventory details in one place.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4 sm:mt-7 sm:space-y-5">
          <div>
            <label htmlFor="name" className="mb-1.5 block text-sm font-semibold text-gray-900">
              Your name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              placeholder="Enter your name"
              maxLength={150}
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="w-full rounded-lg border border-gray-400 bg-white px-3.5 py-2.5 text-sm text-gray-950 outline-none placeholder:text-gray-500 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            />
          </div>
          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-semibold text-gray-900">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="Enter your email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-lg border border-gray-400 bg-white px-3.5 py-2.5 text-sm text-gray-950 outline-none placeholder:text-gray-500 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            />
          </div>
          <div>
            <label htmlFor="password" className="mb-1.5 block text-sm font-semibold text-gray-900">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              placeholder="Create a password"
              minLength={8}
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-lg border border-gray-400 bg-white px-3.5 py-2.5 text-sm text-gray-950 outline-none placeholder:text-gray-500 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            />
            <p className="mt-1.5 text-xs text-gray-600">Use at least 8 characters.</p>
          </div>
          {error && <p role="alert" className="rounded-lg bg-red-50 px-3.5 py-3 text-sm text-red-700">{error}</p>}
          <button type="submit" disabled={saving} className="w-full rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800 disabled:cursor-wait disabled:opacity-60">
            {saving ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account? <Link to="/login" className="font-semibold text-emerald-700 hover:underline">Log in</Link>
        </p>
      </section>
    </main>
  );
}

export default RegisterPage;
