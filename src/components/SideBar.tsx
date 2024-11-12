import Link from "next/link";

import { House, LogOut, PackageSearch, User } from "lucide-react";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";

const Sidebar = () => {
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
            <LogOut className="mr-2 h-4 w-4" />
            <Link href="/">
              <span>Deslogar</span>
            </Link>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
      </CommandList>
    </Command>
  );
};

export default Sidebar;
