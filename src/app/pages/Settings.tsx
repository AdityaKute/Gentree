import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Switch } from '../components/ui/switch';
import { Separator } from '../components/ui/separator';
import { toast } from 'sonner';
import { User, Bell, Shield, Database, Download } from 'lucide-react';

export function Settings() {
  const [profileData, setProfileData] = useState({
    name: 'John Doe',
    email: 'john.doe@email.com',
    username: 'johndoe',
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    newMemberAlerts: true,
    updateReminders: false,
  });

  const handleSaveProfile = () => {
    toast.success('Profile updated successfully!');
  };

  const handleExportData = () => {
    toast.success('Family tree data exported successfully!');
  };

  return (
    <div className="p-8 space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-[#2D5A27] mb-2">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account and application preferences
        </p>
      </div>

      {/* Profile Settings */}
      <Card className="border-[#2D5A27]/20">
        <CardHeader>
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-[#2D5A27]" />
            <CardTitle>Profile Settings</CardTitle>
          </div>
          <CardDescription>Update your personal information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={profileData.name}
              onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={profileData.email}
              onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={profileData.username}
              onChange={(e) => setProfileData({ ...profileData, username: e.target.value })}
            />
          </div>

          <Button onClick={handleSaveProfile} className="bg-[#2D5A27] hover:bg-[#4A7C59]">
            Save Changes
          </Button>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card className="border-[#2D5A27]/20">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-[#2D5A27]" />
            <CardTitle>Notifications</CardTitle>
          </div>
          <CardDescription>Manage your notification preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="email-notifications">Email Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive email updates about your family tree
              </p>
            </div>
            <Switch
              id="email-notifications"
              checked={notifications.emailNotifications}
              onCheckedChange={(checked) =>
                setNotifications({ ...notifications, emailNotifications: checked })
              }
            />
          </div>

          <Separator className="bg-[#2D5A27]/10" />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="new-member-alerts">New Member Alerts</Label>
              <p className="text-sm text-muted-foreground">
                Get notified when new members are added
              </p>
            </div>
            <Switch
              id="new-member-alerts"
              checked={notifications.newMemberAlerts}
              onCheckedChange={(checked) =>
                setNotifications({ ...notifications, newMemberAlerts: checked })
              }
            />
          </div>

          <Separator className="bg-[#2D5A27]/10" />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="update-reminders">Update Reminders</Label>
              <p className="text-sm text-muted-foreground">
                Receive reminders to update family information
              </p>
            </div>
            <Switch
              id="update-reminders"
              checked={notifications.updateReminders}
              onCheckedChange={(checked) =>
                setNotifications({ ...notifications, updateReminders: checked })
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Security */}
      <Card className="border-[#2D5A27]/20">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-[#2D5A27]" />
            <CardTitle>Security</CardTitle>
          </div>
          <CardDescription>Manage your account security</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current-password">Current Password</Label>
            <Input id="current-password" type="password" placeholder="••••••••" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="new-password">New Password</Label>
            <Input id="new-password" type="password" placeholder="••••••••" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm New Password</Label>
            <Input id="confirm-password" type="password" placeholder="••••••••" />
          </div>

          <Button
            variant="outline"
            className="border-[#2D5A27]/20 hover:bg-[#2D5A27]/5"
            onClick={() => toast.success('Password updated successfully!')}
          >
            Update Password
          </Button>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card className="border-[#2D5A27]/20">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-[#2D5A27]" />
            <CardTitle>Data Management</CardTitle>
          </div>
          <CardDescription>Export or manage your family tree data</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-[#FAF3E0] rounded-lg border border-[#2D5A27]/10">
            <div>
              <p className="font-medium text-gray-900">Export Family Tree</p>
              <p className="text-sm text-muted-foreground">
                Download your complete family tree data as JSON
              </p>
            </div>
            <Button
              onClick={handleExportData}
              variant="outline"
              className="border-[#2D5A27] text-[#2D5A27] hover:bg-[#2D5A27]/10"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-destructive/20">
            <div>
              <p className="font-medium text-destructive">Delete Account</p>
              <p className="text-sm text-destructive/70">
                Permanently delete your account and all family tree data
              </p>
            </div>
            <Button
              variant="outline"
              className="border-destructive text-destructive hover:bg-destructive/10"
              onClick={() => toast.error('Account deletion is not available in this demo')}
            >
              Delete
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
