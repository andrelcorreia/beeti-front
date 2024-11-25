import Link from "next/link";

import { House, LogOut, PackageSearch, User, Airplay } from "lucide-react";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { useRouter } from "next/navigation";
import { UserNav } from "./UserNav";

const handleDelToken = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

const user =
  typeof window !== "undefined" ? localStorage.getItem("user") : null;

const test = user ? JSON.parse(user) : null;

const Sidebar = () => {
  const router = useRouter();

  const handleLogout = () => {
    handleDelToken();
    router.push("/");
  };

  if (test.access_level_id === "6d5b47c2-f153-40d1-999f-6b42f913ccc3") {
    return (
      <Command className="rounded-lg border shadow-md md:min-w-[450px]">
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>Nenhum resultado encontrado!</CommandEmpty>
          <CommandGroup heading="Sidebar">
            <CommandItem>
              <House className="mr-2 h-4 w-4" />
              <Link href="/dashboard">
                <span>Home</span>
              </Link>
            </CommandItem>
            <CommandItem>
              <PackageSearch className="mr-2 h-4 w-4" />
              <Link href="/products">
                <span>Produto</span>
              </Link>
            </CommandItem>
            <CommandItem>
              <User className="mr-2 h-4 w-4" />
              <Link href="/users">
                <span>Usuários</span>
              </Link>
            </CommandItem>
            <CommandItem>
              <User className="mr-2 h-4 w-4" />
              <Link href="/serviceProvided">
                <span>Serviços providenciados</span>
              </Link>
            </CommandItem>
            <CommandItem>
              <User className="mr-2 h-4 w-4" />
              <Link href="/maintenance">
                <span>Manutenção</span>
              </Link>
            </CommandItem>
            <CommandItem>
              <Airplay className="mr-2 h-4 w-4" />
              <Link href="/access">
                <span>Níveis de acesso</span>
              </Link>
            </CommandItem>
            <CommandItem>
              {/* <User className="mr-2 h-4 w-4" /> */}
              {/* <Link href="/reports">
                <span>Relatórios</span>
              </Link> */}
            </CommandItem>
            <CommandItem onSelect={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Deslogar</span>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
        </CommandList>
      </Command>
    );
  }

  return (
    <Command className="rounded-lg border shadow-md md:min-w-[450px]">
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>Nenhum resultado encontrado!</CommandEmpty>
        <CommandGroup heading="Sidebar">
          <CommandItem>
            <House className="mr-2 h-4 w-4" />
            <Link href="/dashboard">
              <span>Home</span>
            </Link>
          </CommandItem>
          <CommandItem>
            <PackageSearch className="mr-2 h-4 w-4" />
            <Link href="/products">
              <span>Produto</span>
            </Link>
          </CommandItem>
          <CommandItem>
            {/* <User className="mr-2 h-4 w-4" />
            <Link href="/users">
              <span>Usuários</span>
            </Link> */}
          </CommandItem>
          <CommandItem>
            <User className="mr-2 h-4 w-4" />
            <Link href="/serviceProvided">
              <span>Serviços providenciados</span>
            </Link>
          </CommandItem>
          {/* <CommandItem>
            <User className="mr-2 h-4 w-4" />
            <Link href="/maintenance">
              <span>Manutenção</span>
            </Link>
          </CommandItem> */}
          <CommandItem>
            {/* <User className="mr-2 h-4 w-4" /> */}
            {/* <Link href="/reports">
              <span>Relatórios</span>
            </Link> */}
          </CommandItem>
          <CommandItem onSelect={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Deslogar</span>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
      </CommandList>
    </Command>
  );
};

export default Sidebar;
