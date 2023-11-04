import { ModeToggle } from "./mode-toggle";
import { Button } from "./ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background h-16 px-10">
      <nav className="w-full h-full flex justify-between items-center">
        <div className="flex items-center gap-x-4">
          <h1 className="text-2xl font-semibold">Realtime Chat</h1>
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Options</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[200px] gap-3 p-4">
                    <li>
                      <Button
                        variant="secondary"
                        className="w-full justify-start"
                      >
                        Chat
                      </Button>
                    </li>

                    <li>
                      <Button variant="ghost" className="w-full justify-start">
                        Video Call
                      </Button>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        <div className="flex items-center gap-x-4">
          <Button variant="default">Sign Out</Button>
          <ModeToggle />
        </div>
      </nav>
    </header>
  );
}
