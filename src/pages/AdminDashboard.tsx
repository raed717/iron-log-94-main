import Header from "@/components/layout/Header";
import UserManagement from "@/components/admin/UserManagement";
import { Shield, Users, Activity, TrendingUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const AdminDashboard = () => {
  return (
    <div className="min-h-screen pb-24 md:pb-8">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 opacity-0 animate-fade-in">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="h-8 w-8 text-primary" />
            <h1 className="font-display text-4xl md:text-5xl tracking-wide">
              <span className="text-gradient-power">ADMIN</span>
              <span className="text-foreground"> DASHBOARD</span>
            </h1>
          </div>
          <p className="text-muted-foreground">
            Manage users, roles, and platform settings
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">-</div>
              <p className="text-xs text-muted-foreground">
                All registered users
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Today</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">-</div>
              <p className="text-xs text-muted-foreground">
                Users active in last 24h
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Coaches</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">-</div>
              <p className="text-xs text-muted-foreground">
                Total coach accounts
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Growth</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">-</div>
              <p className="text-xs text-muted-foreground">
                New users this month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* User Management Section */}
        <Card>
          <CardHeader>
            <CardTitle>User Management</CardTitle>
            <CardDescription>
              View, manage, and modify user accounts and roles
            </CardDescription>
          </CardHeader>
          <CardContent>
            <UserManagement />
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AdminDashboard;
