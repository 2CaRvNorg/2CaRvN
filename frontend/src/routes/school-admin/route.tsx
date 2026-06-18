import { createFileRoute } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Users,
  BarChart3,
  FileText,
} from "lucide-react";
import {
  DashboardLayout,
  type SidebarNavGroup,
} from "@/components/site/DashboardLayout";

const sidebarGroups: SidebarNavGroup[] = [
  {
    title: "Overview",
    items: [
      {
        label: "Dashboard",
        to: "/school-admin",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    title: "Management",
    items: [
      { label: "Students", to: "/school-admin/students", icon: Users },
      {
        label: "Analytics",
        to: "/school-admin/analytics",
        icon: BarChart3,
      },
      { label: "Reports", to: "/school-admin/reports", icon: FileText },
    ],
  },
];

export const Route = createFileRoute("/school-admin")({
  component: SchoolAdminLayout,
});

function SchoolAdminLayout() {
  return (
    <DashboardLayout
      role="school-admin"
      groups={sidebarGroups}
      userName="School Admin"
      userEmail="admin@school.edu"
    />
  );
}
