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
import { useRouter } from "next/navigation";

export default function Register() {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);
  const router = useRouter();
  console.log({ confirmPassword, password });
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleRegister = React.useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);
      setSuccess(null);

      console.log({ confirmPassword, password });

      if (confirmPassword !== password) {
        setError("Senhas não combinam");
        return;
      }

      try {
        console.log({ name, email, password });
        const response = await api.post("/users", {
          name,
          email,
          password,
        });
        setSuccess(response.data.message);

        console.log("Usuário criado com sucesso:", response.data);

        router.push("/");
      } catch (err: any) {
        setError(err.response?.data?.message || "Erro ao criar usuário");
      }
    },
    [confirmPassword, password, name, email, router]
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
          <CardTitle>Cadastro</CardTitle>
          <CardDescription>
            Preencha os campos abaixo para se cadastrar.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  placeholder="Seu nome"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  minLength={8}
                  maxLength={140}
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  placeholder="test@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  minLength={8}
                  maxLength={140}
                />
              </div>
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
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="confirmPassword">Confirmar senha</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  minLength={8}
                  maxLength={12}
                />
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
