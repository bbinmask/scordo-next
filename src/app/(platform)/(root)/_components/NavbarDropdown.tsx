import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
import { SignOutButton } from "@clerk/nextjs";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import React from "react";

interface NavbarDropdownProps {
  data: any;
}

const NavbarDropdown = ({ data }: NavbarDropdownProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="shadow">
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>
            <img src="/user.svg" alt="User" />
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mr-4">
        <ul className="center flex flex-col p-4">
          <DropdownMenuItem>
            <SignOutButton>Sign out</SignOutButton>
          </DropdownMenuItem>
        </ul>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NavbarDropdown;
