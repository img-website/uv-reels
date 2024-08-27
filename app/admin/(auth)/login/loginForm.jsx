"use client"
import { useRouter } from "next/navigation";
import { useState } from "react"

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const loginHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(""); // Clear any previous errors

        try {
            const response = await fetch("/api/admin/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (data?.success) {
                // Set the token in a cookie
                document.cookie = `token=${data?.token}; path=/; priority=high;`;
                document.cookie = `userEmail=${data?.user?.email}; path=/;`;
                document.cookie = `userRole=${data?.user?.role}; path=/;`;

                // Redirect to admin dashboard or other protected page
                router.push('/admin')
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <form className={`space-y-6 ${loading ? 'pointer-events-none' : ''}`} onSubmit={(e) => loginHandler(e)}>
            <div>
                <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-800">
                    Email address
                </label>
                <div className="mt-2">
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => { setEmail(e.target.value) }}
                        required
                        autoComplete="email"
                        className="block w-full rounded-xl px-4 border-0 py-4 text-gray-800 shadow-sm bg-transparent ring-1 ring-inset ring-gray-300 placeholder:text-gray-600 focus:ring-2 focus:ring-inset focus:ring-purple-700 sm:text-base sm:leading-6"
                    />
                </div>
            </div>

            <div>
                <div className="flex items-center justify-between">
                    <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-800">
                        Password
                    </label>
                </div>
                <div className="mt-2">
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => { setPassword(e.target.value) }}
                        required
                        autoComplete="current-password"
                        className="block w-full rounded-xl px-4 border-0 py-4 text-gray-800 shadow-sm bg-transparent ring-1 ring-inset ring-gray-300 placeholder:text-gray-600 focus:ring-2 focus:ring-inset focus:ring-purple-700 sm:text-base sm:leading-6"
                    />
                </div>
            </div>

            <div>
                <button
                    type="submit"
                    disabled={loading}
                    className="flex w-full justify-center rounded-xl px-4 bg-purple-700 py-4 text-base font-semibold leading-6 text-white shadow-sm hover:bg-purple-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-700"
                >
                    {loading ? 'Signing in...' : 'Sign in'}
                </button>
            </div>
            {error && <p className="p-2 mt-5 bg-rose-300 text-rose-700 font-semibold text-center text-sm rounded-lg border">{error}</p>}
        </form>
    )
}

export default LoginForm