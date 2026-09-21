"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Shield } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

export default function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const router = useRouter();
  const [error, setError] = useState("");

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  if (isAuthenticated) {
    router.push("/");
    return null;
  }

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    try {
      setError("");
      await login({ email: values.email, password: values.password });
      router.push("/");
    } catch (err: any) {
      setError(err.message || "Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <div className="absolute inset-0 bg-[#0f172a] h-[40vh] z-0"></div>
      
      <Card className="z-10 w-full max-w-md shadow-2xl border-0">
        <CardHeader className="space-y-3 items-center bg-[#0f172a] text-white rounded-t-xl pb-8 pt-10">
          <div className="bg-white p-3 rounded-full mb-2">
            <Shield className="h-8 w-8 text-[#0f172a]" />
          </div>
          <CardTitle className="text-2xl font-bold text-center">Disaster Training Monitor</CardTitle>
          <CardDescription className="text-slate-300 text-center">
            Government of India National Platform
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pt-8 px-8 pb-10 bg-white rounded-b-xl">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {error && (
              <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md border border-red-200">
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Email Address</label>
              <Input 
                type="email" 
                placeholder="officer@gov.in"
                className="h-11"
                {...form.register("email")} 
              />
              {form.formState.errors.email && (
                <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-slate-700">Password</label>
                <a href="#" className="text-sm text-blue-600 hover:underline">Forgot password?</a>
              </div>
              <Input 
                type="password" 
                placeholder="••••••••"
                className="h-11"
                {...form.register("password")} 
              />
              {form.formState.errors.password && (
                <p className="text-sm text-red-500">{form.formState.errors.password.message}</p>
              )}
            </div>
            
            <Button 
              type="submit" 
              className="w-full h-11 bg-blue-700 hover:bg-blue-800 text-white font-medium text-base"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? "Authenticating..." : "Secure Login"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
