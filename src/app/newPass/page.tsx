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
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import api from "@/services/axios";
import { useRouter } from "next/navigation";

export default function ForgotPassword() {
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);
  const router = useRouter();

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleRegister = React.useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);
      setSuccess(null);

      if (confirmPassword !== password) {
        setError("Senhas não combinam");
        return;
      }

      try {
        // const response = await api.post("/forgot-password", {
        //   email,
        // });
        // setSuccess(response.data.message);
        // console.log("Email enviado com sucesso:", response.data);

        console.log("working...");
      } catch (err: any) {
        setError(err.response?.data?.message || "Erro ao salvar nova senha");
      }
    },
    [confirmPassword, password, router]
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
      <Card className="w-[350px]  bg-white bg-opacity-80">
        <CardHeader>
          <CardTitle>Nova senha</CardTitle>
          <CardDescription>Por favor, insira uma nova senha!</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister}>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Digite sua senha"
                  minLength={8}
                  maxLength={12}
                />
                <div
                  className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </div>
              </div>
            </div>
            {error && <p className="text-red-500">{error}</p>}
            {success && <p className="text-green-500">{success}</p>}
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Link href="/">
            <Button variant="outline">Voltar ao Login</Button>
          </Link>
          <Button type="submit" onClick={handleRegister}>
            Enviar
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
