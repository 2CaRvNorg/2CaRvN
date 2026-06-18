import { createFileRoute } from "@tanstack/react-router";
import {
  LayoutDashboard,
  BookOpen,
  Award,
  Bot,
  StickyNote,
  Lightbulb,
} from "lucide-react";
import {
  DashboardLayout,
  type SidebarNavGroup,
} from "@/components/site/DashboardLayout";

const sidebarGroups: SidebarNavGroup[] = [
  {
    title: "Learning",
    items: [
      { label: "Dashboard", to: "/student", icon: LayoutDashboard },
      { label: "My Courses", to: "/student/courses", icon: BookOpen },
      {
        label: "Certificates",
        to: "/student/certificates",
        icon: Award,
      },
    ],
  },
  {
    title: "AI Features",
    items: [
      {
        label: "AI Tutor",
        to: "/student/ai-tutor",
        icon: Bot,
        badge: "New",
      },
      {
        label: "AI Notes",
        to: "/student/ai-notes",
        icon: StickyNote,
      },
      {
        label: "Learning Insights",
        to: "/student/ai-insights",
        icon: Lightbulb,
      },
    ],
  },
];

export const Route = createFileRoute("/student")({
  component: StudentLayout,
});

function StudentLayout() {
  return (
    <DashboardLayout
      role="student"
      groups={sidebarGroups}
      userName="Aarav Sharma"
      userEmail="aarav@student.edu"
    />
  );
}
