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
import api from "@/services/axios";
import { Eye, EyeOff } from "lucide-react";

interface ForgotPasswordConfirmProps {
  params: {
    token: string;
  };
}

export default function ForgotPasswordConfirm({
  params,
}: ForgotPasswordConfirmProps) {
  const { token } = params;
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleRegister = React.useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);
      setSuccess(null);

      if (password !== confirmPassword) {
        setError("As senhas não coincidem.");
        return;
      }

      try {
        const response = await api.post("/forgot-password/confirmPassword", {
          token,
          password,
          confirm_password: confirmPassword,
        });
        setSuccess(response.data.message);
        console.log("Senha alterada com sucesso:", response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || "Erro ao redefinir a senha");
      }
    },
    [password, confirmPassword, token]
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
      <Card className="w-[400px] bg-white bg-opacity-90 shadow-lg rounded-lg">
        <CardHeader>
          <CardTitle>Redefinir Senha</CardTitle>
          <CardDescription>Insira sua nova senha abaixo.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister}>
            <div className="flex flex-col space-y-4">
              <div>
                <Label htmlFor="password">Nova Senha</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Digite sua nova senha"
                    minLength={8}
                    maxLength={12}
                    required
                  />
                  <div
                    className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirme sua nova senha"
                  minLength={8}
                  maxLength={12}
                  required
                />
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}
              {success && <p className="text-green-500 text-sm">{success}</p>}
            </div>

            <CardFooter className="flex justify-between mt-6">
              <Link href="/">
                <Button variant="outline">Voltar ao Login</Button>
              </Link>
              <Button type="submit">Enviar</Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
