"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/core/card";
import { Button } from "@/components/ui/core/button";
import { Input } from "@/components/ui/core/input";
import { Label } from "@/components/ui/core/label";
import { Switch } from "@/components/ui/core/switch";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/core/select";

export default function SettingsPageClient() {
  return (
    <div className="container mx-auto py-6">
      <h1 className="mb-6 text-2xl font-bold">Settings</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" defaultValue="artist@example.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Display Name</Label>
              <Input id="name" defaultValue="Music Artist" />
            </div>
            <Button>Save Changes</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="notifications">Email Notifications</Label>
              <Switch id="notifications" />
            </div>
            <div className="space-y-2">
              <Label>Theme</Label>
              <Select defaultValue="dark">
                <SelectTrigger>
                  <SelectValue placeholder="Select theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button>Save Preferences</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
