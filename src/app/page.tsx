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
import { Eye, EyeOff } from "lucide-react";

export default function Home() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const router = useRouter();

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleLogin = React.useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);

      try {
        const data = await login(email, password);
        console.log("Login bem-sucedido:", data);

        if (data.data.token) {
          localStorage.setItem("token", data.data.token);
        }

        router.push("/dashboard");
        setError(data.message);
      } catch (err: any) {
        setError(err.message);
      }
    },
    [email, password, router]
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
                  maxLength={140}
                />
              </div>
              <div className="flex flex-col space-y-1.5 relative">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Digite sua senha"
                  />
                  <div
                    className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </div>
                </div>
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
          <Link href="/forgotPassword">
            <p className="text-sm text-gray-500">Esqueci minha senha</p>
          </Link>
        </div>
      </Card>
    </div>
  );
}
