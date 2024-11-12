"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { User } from "lucide-react"; // Certifique-se de ter instalado este pacote
import Link from "next/link";

const token =
  typeof window !== "undefined" ? localStorage.getItem("token") : null;

const user =
  typeof window !== "undefined" ? localStorage.getItem("user") : null;

const test = user ? JSON.parse(user) : null;
const userId = test ? test.id : null;

export function UserNav() {
  return (
    <div className="flex items-center space-x-4">
      {/* Ícone de usuário, nome e email alinhados lado a lado */}
      <Link href={`/userDetails/${userId}`} passHref>
        <div className="flex items-center cursor-pointer space-x-2">
          {/* Ícone do Usuário */}
          <User className="h-6 w-6 text-primary" />

          {/* Perfil, Nome e Email */}
          <div className="flex flex-col">
            <span className="text-sm font-medium">
              {test ? test.name : "Usuário não identificado"}
            </span>
            <span className="text-xs text-muted-foreground">
              {test ? test.email : "Email não fornecido"}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}
