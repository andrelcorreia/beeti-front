import { useEffect, useState } from "react";
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

const Sidebar = () => {
  const router = useRouter();
  const [test, setTest] = useState<any>(null);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setTest(JSON.parse(user));
    }
  }, []);

  const handleDelToken = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  const handleLogout = () => {
    handleDelToken();
    router.push("/");
  };

  const hasPermission = (permission: string) => {
    return test?.permissions?.includes(permission);
  };

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
          {hasPermission("users") && (
            <CommandItem>
              <User className="mr-2 h-4 w-4" />
              <Link href="/users">
                <span>Usuários</span>
              </Link>
            </CommandItem>
          )}
          {hasPermission("serviceProvided") && (
            <CommandItem>
              <User className="mr-2 h-4 w-4" />
              <Link href="/serviceProvided">
                <span>Serviços providenciados</span>
              </Link>
            </CommandItem>
          )}
          {hasPermission("maintenance") && (
            <CommandItem>
              <User className="mr-2 h-4 w-4" />
              <Link href="/maintenance">
                <span>Manutenção</span>
              </Link>
            </CommandItem>
          )}
          {hasPermission("access") && (
            <CommandItem>
              <Airplay className="mr-2 h-4 w-4" />
              <Link href="/access">
                <span>Níveis de acesso</span>
              </Link>
            </CommandItem>
          )}
          {hasPermission("reports") && (
            <CommandItem>{/* Exemplo futuro para relatórios */}</CommandItem>
          )}
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
