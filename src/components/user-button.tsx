"use client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import { Skeleton } from "./ui/skeleton"

const UserButton = () => {
  const navigate = useRouter()
  const { data: user, isPending } = authClient.useSession()
  const currentUser = user?.user
  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          navigate.push("/login")
        },
      },
    })
  }

  if (isPending) {
    return <Skeleton className="size-8 rounded-full" />
  }
  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Avatar className="size-8 hover:-rotate-12 origin-center transition-transform">
            <AvatarImage
              src="https://doodleipsum.com/700?i=8645c98fadb4bc084500338c3d2b1d92"
              alt={currentUser?.email}
            />
            <AvatarFallback>
              {currentUser?.email?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem asChild>
            <Button
              onClick={handleLogout}
              variant="destructive"
              className="w-full"
              size={"sm"}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </Button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export default UserButton
