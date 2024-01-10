"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { redirect } from "next/navigation";

import { cn } from "@/lib/utils";
import { Icons } from "@/components/icons";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useToast } from "../ui/use-toast";



interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

type UserCredentials = {
  email: string;
  password: string;
  cpassword: string;
};

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [user, setUser] = React.useState<UserCredentials>({
    email: "",
    password: "",
    cpassword: "",
  });

  const pathname = usePathname();
  const { toast } = useToast();

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault();
    setIsLoading(true);

    try {
      if (pathname === "/register") {
        await handleSignUp();
      } else {
        await handleLogin();
      }
    } catch (error) {
      console.log("error", error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleLoginWithGoogle = () => {

  };

  const handleSignUp = async () => {

  };

  const handleLogin = async () => {

  };

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setUser((prevState) => ({ ...prevState, [id]: value }));
  };

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <form onSubmit={onSubmit}>
        <div className="grid gap-2">
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="email">
              Email
            </Label>
            <Input
              id="email"
              placeholder="name@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading}
              value={user.email}
              onChange={handleOnChange}
            />
          </div>
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="password">
              Password
            </Label>
            <Input
              id="password"
              placeholder="Password"
              type="password"
              disabled={isLoading}
              value={user.password}
              onChange={handleOnChange}
            />
          </div>

          {pathname === "/register" && (
            <div className="grid gap-1">
              <Label className="sr-only" htmlFor="cpassword">
                Confirm Password
              </Label>
              <Input
                id="cpassword"
                placeholder="Confirm Password"
                type="password"
                disabled={isLoading}
                value={user.cpassword}
                onChange={handleOnChange}
              />
            </div>
          )}

          <Button disabled={isLoading}>
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            {pathname === "/register" ? "Register" : "Login"}
          </Button>
        </div>
      </form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <Button
        variant="outline"
        type="button"
        disabled={isLoading}
        onClick={handleLoginWithGoogle}
      >
        {isLoading ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Icons.google className="mr-2 h-4 w-4" />
        )}{" "}
        Google
      </Button>
    </div>
  );
}
