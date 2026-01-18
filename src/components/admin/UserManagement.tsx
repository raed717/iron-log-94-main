import { useState } from "react";
import { Tables } from "@/types/database";
import { useUsers, UserRole } from "@/hooks/useUsers";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Search, Trash2, User as UserIcon, Mail, Calendar } from "lucide-react";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

type User = Tables<'users'>;

const UserManagement = () => {
  const { users, loading, updateUserRole, deleteUser } = useUsers();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState<UserRole | "all">("all");

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.full_name?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRole = selectedRole === "all" || user.role === selectedRole;
    
    return matchesSearch && matchesRole;
  });

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    await updateUserRole(userId, newRole);
  };

  const handleDelete = async (userId: string) => {
    await deleteUser(userId);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users by name, email, or username..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-secondary/50"
          />
        </div>
        <Select value={selectedRole} onValueChange={(value) => setSelectedRole(value as UserRole | "all")}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="user">User</SelectItem>
            <SelectItem value="coach">Coach</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="owner">Owner</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-secondary/50 rounded-lg p-4">
          <div className="text-sm text-muted-foreground">Total Users</div>
          <div className="text-2xl font-bold mt-1">{users.length}</div>
        </div>
        <div className="bg-secondary/50 rounded-lg p-4">
          <div className="text-sm text-muted-foreground">Admins</div>
          <div className="text-2xl font-bold mt-1">
            {users.filter(u => u.role === 'admin').length}
          </div>
        </div>
        <div className="bg-secondary/50 rounded-lg p-4">
          <div className="text-sm text-muted-foreground">Coaches</div>
          <div className="text-2xl font-bold mt-1">
            {users.filter(u => u.role === 'coach').length}
          </div>
        </div>
        <div className="bg-secondary/50 rounded-lg p-4">
          <div className="text-sm text-muted-foreground">Regular Users</div>
          <div className="text-2xl font-bold mt-1">
            {users.filter(u => u.role === 'user').length}
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="border rounded-lg bg-card">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">User</TableHead>
                <TableHead className="hidden sm:table-cell">Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="hidden md:table-cell">Joined</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No users found
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                          <UserIcon className="h-5 w-5 text-primary" />
                        </div>
                        <div className="min-w-0">
                          <div className="font-medium truncate">{user.username}</div>
                          {user.full_name && (
                            <div className="text-sm text-muted-foreground truncate">
                              {user.full_name}
                            </div>
                          )}
                          <div className="text-xs text-muted-foreground sm:hidden mt-1">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Mail className="h-4 w-4" />
                        <span className="truncate max-w-[200px]">{user.email}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={user.role}
                        onValueChange={(value) => handleRoleChange(user.id, value as UserRole)}
                      >
                        <SelectTrigger className="w-[120px] sm:w-[140px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="user">User</SelectItem>
                          <SelectItem value="coach">Coach</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="owner">Owner</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="flex items-center gap-2 text-muted-foreground text-sm">
                        <Calendar className="h-4 w-4" />
                        {user.created_at
                          ? format(new Date(user.created_at), "MMM d, yyyy")
                          : "N/A"}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only sm:not-sr-only sm:ml-2">Delete</span>
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete User</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete {user.username}? This action cannot
                              be undone and will permanently delete all their data.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(user.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
