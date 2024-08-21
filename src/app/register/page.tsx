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

export default function Register() {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);

  const handleRegister = React.useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);
      setSuccess(null);

      try {
        const response = await api.post("/users", {
          name,
          email,
          password,
        });
        setSuccess(response.data.message);
        console.log("Usuário criado com sucesso:", response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || "Erro ao criar usuário");
      }
    },
    [name, email, password]
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
                />
              </div>
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
