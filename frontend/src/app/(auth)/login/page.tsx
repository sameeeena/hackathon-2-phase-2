"use client"

import { useState } from "react"
import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function LoginPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        const result = await authClient.signIn({
            username: email, // FastAPI typically uses username, but might accept email
            password: password,
        })

        if ('error' in result && result.error) {
            alert(result.error)
        } else {
            router.push("/dashboard")
        }
        setLoading(false)
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-50 dark:bg-black p-4">
            <div className="w-full max-w-md p-8 bg-white dark:bg-zinc-950 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-xl">
                <h1 className="text-3xl font-black mb-6 tracking-tight">Welcome Back</h1>
                <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Email</label>
                        <Input 
                            type="email" 
                            placeholder="name@example.com" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Password</label>
                        <Input 
                            type="password" 
                            placeholder="••••••••" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <Button type="submit" className="w-full h-12 rounded-2xl font-bold" disabled={loading}>
                        {loading ? "Signing in..." : "Sign In"}
                    </Button>
                </form>
                <p className="mt-6 text-center text-zinc-500 text-sm font-medium">
                    Don't have an account?{" "}
                    <Link href="/register" className="text-zinc-900 dark:text-zinc-100 font-bold hover:underline">
                        Register
                    </Link>
                </p>
            </div>
        </div>
    )
}
