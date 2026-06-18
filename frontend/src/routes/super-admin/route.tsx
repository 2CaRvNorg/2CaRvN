import { createFileRoute } from "@tanstack/react-router";
import {
  LayoutDashboard,
  School,
  BookOpen,
  Video,
  ClipboardList,
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
        to: "/super-admin",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    title: "Management",
    items: [
      { label: "Schools", to: "/super-admin/schools", icon: School },
      { label: "Courses", to: "/super-admin/courses", icon: BookOpen },
      {
        label: "Video Releases",
        to: "/super-admin/video-releases",
        icon: Video,
      },
      {
        label: "Quizzes",
        to: "/super-admin/quizzes",
        icon: ClipboardList,
      },
    ],
  },
];

export const Route = createFileRoute("/super-admin")({
  component: SuperAdminLayout,
});

function SuperAdminLayout() {
  return (
    <DashboardLayout
      role="super-admin"
      groups={sidebarGroups}
      userName="Admin User"
      userEmail="admin@2carvn.com"
    />
  );
}
