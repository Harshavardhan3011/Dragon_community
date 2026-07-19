"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { loginFormSchema, type LoginFormValues } from "@/lib/validations";

export default function AdminLoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        router.push("/admin/dashboard");
        router.refresh();
      } else {
        setError(json.error || "Invalid credentials. Please try again.");
      }
    } catch {
      setError("Network error. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <svg width="40" height="40" viewBox="0 0 32 32" fill="none" className="text-dragon-neon" aria-hidden="true">
              <path d="M16 2L4 10l4 6-4 6 12 8 12-8-4-6 4-6L16 2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" fill="currentColor" fillOpacity="0.2" />
              <path d="M16 8l-6 4 3 4-3 4 6 4 6-4-3-4 3-4-6-4z" fill="currentColor" opacity="0.5" />
            </svg>
            <span className="font-heading text-2xl font-bold text-dragon-text">Dragon Up</span>
          </div>
          <p className="text-dragon-text-muted text-sm font-heading uppercase tracking-wider">Admin Panel</p>
        </div>

        <div className="glass-card rounded-2xl p-8">
          <h1 className="font-heading text-xl font-bold text-dragon-text mb-6 text-center">Sign In</h1>

          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-sm text-red-400" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
            <Input
              label="Email Address"
              type="email"
              placeholder="admin@dragonup.com"
              error={errors.email?.message}
              autoComplete="email"
              {...register("email")}
            />
            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                error={errors.password?.message}
                autoComplete="current-password"
                className="pr-12"
                {...register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 bottom-3 text-dragon-text-muted hover:text-dragon-text transition-colors cursor-pointer"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="remember"
                className="w-4 h-4 accent-dragon-neon"
                {...register("remember")}
              />
              <label htmlFor="remember" className="text-sm text-dragon-text-secondary cursor-pointer">
                Remember me
              </label>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isSubmitting}
              disabled={isSubmitting}
              className="w-full"
            >
              <LogIn className="w-4 h-4" />
              Sign In to Admin
            </Button>
          </form>
        </div>

        <p className="text-center text-xs text-dragon-text-muted mt-6">
          Dragon Up Admin Panel — Authorized Access Only
        </p>
      </div>
    </div>
  );
}
