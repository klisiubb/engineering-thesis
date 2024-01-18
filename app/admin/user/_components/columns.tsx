"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import axios from "axios";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "firstName",
    header: "Imię",
  },
  {
    accessorKey: "lastName",
    header: "Nazwisko",
  },
  {
    accessorKey: "email",
    header: "Adres email",
  },
  {
    accessorKey: "rola",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Rola
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "id",
    header: "Akcje",
    cell: ({ row }) => {
      const user = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Otwórz menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Akcje:</DropdownMenuLabel>
            <DropdownMenuItem>
              <Link href={`/admin/user/edit/${user.Id}`}>Edytuj</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-500">
              <button onClick={() => deleteUser(user.Id)}>Usuń</button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

const deleteUser = async (userId: string) => {
  try {
    const response = await axios.delete(`/api/admin/user/delete/${userId}`);
    if (response.status === 200) {
      window.location.reload();
      toast.success("Usuwanie użytkownika powiodło się");
    } else {
      toast.error("Wystąpił błąd podczas usuwania użytkownika");
    }
  } catch (error) {
    toast.error("Wystąpił błąd podczas usuwania użytkownika");
  }
};
