import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import {
  CheckCircle2,
  Clock,
  FolderOpen,
  Loader2,
  Plus,
  XCircle,
} from "lucide-react";
import { motion } from "motion/react";
import type { Project } from "../backend.d";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useMyProjects } from "../hooks/useQueries";

const STATUS_CONFIG = {
  pending: {
    label: "Pending Review",
    color: "#F59E0B",
    bg: "rgba(245,158,11,0.1)",
    border: "rgba(245,158,11,0.3)",
    icon: Clock,
  },
  approved: {
    label: "Approved",
    color: "#24E6FF",
    bg: "rgba(36,230,255,0.1)",
    border: "rgba(36,230,255,0.3)",
    icon: CheckCircle2,
  },
  rejected: {
    label: "Rejected",
    color: "#EF4444",
    bg: "rgba(239,68,68,0.1)",
    border: "rgba(239,68,68,0.3)",
    icon: XCircle,
  },
};

function MyProjectCard({
  project,
  index,
}: { project: Project; index: number }) {
  const status =
    STATUS_CONFIG[project.status as keyof typeof STATUS_CONFIG] ||
    STATUS_CONFIG.pending;
  const Icon = status.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      className="rounded-xl p-5"
      style={{
        background: "rgba(18,22,33,0.55)",
        backdropFilter: "blur(16px)",
        border: "1px solid rgba(42,49,67,0.8)",
      }}
      data-ocid={`my-projects.item.${index + 1}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h3
            className="font-bold text-base truncate mb-1"
            style={{ color: "#F2F6FF" }}
          >
            {project.name}
          </h3>
          <p className="text-sm line-clamp-2 mb-3" style={{ color: "#A7B0C2" }}>
            {project.description}
          </p>
          <div className="flex items-center gap-3">
            <span
              className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded"
              style={{ color: "#24E6FF", background: "rgba(36,230,255,0.1)" }}
            >
              {project.category}
            </span>
            <span className="font-bold text-sm" style={{ color: "#24E6FF" }}>
              ${project.price.toLocaleString()}
            </span>
          </div>
        </div>
        <div className="flex-shrink-0">
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
            style={{
              color: status.color,
              background: status.bg,
              border: `1px solid ${status.border}`,
            }}
          >
            <Icon className="w-3.5 h-3.5" />
            {status.label}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function MyProjects() {
  const { identity, login, isLoggingIn } = useInternetIdentity();
  const { data: projects, isLoading } = useMyProjects();

  if (!identity) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-6">
        <div className="text-center max-w-sm" data-ocid="my-projects.modal">
          <FolderOpen
            className="w-12 h-12 mx-auto mb-4"
            style={{ color: "#6E768A" }}
          />
          <h2 className="text-2xl font-black mb-2" style={{ color: "#F2F6FF" }}>
            Your Projects
          </h2>
          <p className="text-sm mb-6" style={{ color: "#A7B0C2" }}>
            Sign in to view and manage your submitted projects.
          </p>
          <Button
            onClick={login}
            disabled={isLoggingIn}
            className="btn-liquid font-bold"
            style={{
              background: "linear-gradient(135deg, #22D8E6, #8B5CFF)",
              color: "#071017",
              border: "none",
            }}
            data-ocid="my-projects.primary_button"
          >
            {isLoggingIn ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Connecting...
              </>
            ) : (
              "Sign in"
            )}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16 px-6">
      <div className="container mx-auto max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-end justify-between mb-10"
        >
          <div>
            <div
              className="text-xs font-bold uppercase tracking-widest mb-2"
              style={{ color: "#A56BFF" }}
            >
              Portfolio
            </div>
            <h1
              className="text-4xl font-black tracking-tight"
              style={{ color: "#F2F6FF", letterSpacing: "-0.03em" }}
            >
              My Projects
            </h1>
          </div>
          <Link to="/submit">
            <Button
              size="sm"
              className="btn-liquid font-semibold gap-1.5 text-xs"
              style={{
                background: "linear-gradient(135deg, #22D8E6, #8B5CFF)",
                color: "#071017",
                border: "none",
              }}
              data-ocid="my-projects.primary_button"
            >
              <Plus className="w-3.5 h-3.5" /> New Submission
            </Button>
          </Link>
        </motion.div>

        {isLoading ? (
          <div
            className="flex justify-center py-20"
            data-ocid="my-projects.loading_state"
          >
            <Loader2
              className="w-8 h-8 animate-spin"
              style={{ color: "#24E6FF" }}
            />
          </div>
        ) : !projects || projects.length === 0 ? (
          <div
            className="text-center py-20 rounded-2xl"
            style={{
              background: "rgba(18,22,33,0.55)",
              border: "1px solid rgba(42,49,67,0.8)",
            }}
            data-ocid="my-projects.empty_state"
          >
            <FolderOpen
              className="w-12 h-12 mx-auto mb-4"
              style={{ color: "#6E768A" }}
            />
            <h3 className="font-bold text-lg mb-2" style={{ color: "#F2F6FF" }}>
              No projects yet
            </h3>
            <p className="text-sm mb-6" style={{ color: "#A7B0C2" }}>
              Submit your first project to get started.
            </p>
            <Link to="/submit">
              <Button
                className="btn-liquid font-bold"
                style={{
                  background: "linear-gradient(135deg, #22D8E6, #8B5CFF)",
                  color: "#071017",
                  border: "none",
                }}
                data-ocid="my-projects.secondary_button"
              >
                Submit a Project
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4" data-ocid="my-projects.list">
            {projects.map((p, i) => (
              <MyProjectCard key={String(p.id)} project={p} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
