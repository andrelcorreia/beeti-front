"use client";
import * as React from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { login } from "@/services/auth";
import { useRouter } from "next/navigation";

export default function Home() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const router = useRouter();

  const handleLogin = React.useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);

      try {
        const data = await login(email, password);
        console.log("Login bem-sucedido:", data);

        localStorage.setItem("authToken", data.data.token);

        router.push("/dashboard");
        setError(data.message);
      } catch (err: any) {
        setError(err.message);
      }
    },
    [email, password]
  );

  return (
    <div
      className="flex min-h-screen items-center justify-center"
      style={{
        backgroundImage: 'url("/images/background.jpg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Card className="w-[350px] bg-white bg-opacity-80">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Por favor, utilize todos os campos!</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  placeholder="test@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
            {error && <p className="text-red-500">{error}</p>}
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Link href="/register">
            <Button variant="outline">Cadastre-se</Button>
          </Link>
          <Button type="submit" onClick={handleLogin}>
            Logar
          </Button>
        </CardFooter>
        <div className="flex justify-center mt-2">
          <Link href="/forgot-password">
            <p className="text-sm text-gray-500">Esqueci minha senha</p>
          </Link>
        </div>
      </Card>
    </div>
  );
}
