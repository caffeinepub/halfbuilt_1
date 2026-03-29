import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  Clock,
  Loader2,
  Shield,
  ShieldOff,
  XCircle,
} from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import type { Project } from "../backend.d";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useApproveProject,
  useIsAdmin,
  usePendingProjects,
  useRejectProject,
} from "../hooks/useQueries";

function ProjectRow({ project, index }: { project: Project; index: number }) {
  const approve = useApproveProject();
  const reject = useRejectProject();

  const handleApprove = async () => {
    try {
      await approve.mutateAsync(project.id);
      toast.success(`"${project.name}" approved!`);
    } catch {
      toast.error("Failed to approve. Try again.");
    }
  };

  const handleReject = async () => {
    try {
      await reject.mutateAsync(project.id);
      toast.success(`"${project.name}" rejected.`);
    } catch {
      toast.error("Failed to reject. Try again.");
    }
  };

  const ocidIndex = index + 1;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="rounded-xl p-5 flex flex-col md:flex-row md:items-center gap-4 md:gap-6"
      style={{
        background: "rgba(18,22,33,0.55)",
        backdropFilter: "blur(16px)",
        border: "1px solid rgba(42,49,67,0.8)",
      }}
      data-ocid={`admin.item.${ocidIndex}`}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span
            className="text-xs font-bold uppercase tracking-wider px-1.5 py-0.5 rounded"
            style={{ color: "#24E6FF", background: "rgba(36,230,255,0.1)" }}
          >
            {project.category}
          </span>
          <span
            className="text-xs flex items-center gap-1"
            style={{ color: "#6E768A" }}
          >
            <Clock className="w-3 h-3" /> Pending Review
          </span>
        </div>
        <h3
          className="font-bold text-base truncate"
          style={{ color: "#F2F6FF" }}
        >
          {project.name}
        </h3>
        <p className="text-sm line-clamp-2 mt-1" style={{ color: "#A7B0C2" }}>
          {project.description}
        </p>
        <div className="flex items-center gap-3 mt-2">
          <span className="font-bold text-sm" style={{ color: "#24E6FF" }}>
            ${project.price.toLocaleString()}
          </span>
          <span className="text-xs" style={{ color: "#6E768A" }}>
            ID: {String(project.id)}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        <Button
          size="sm"
          onClick={handleApprove}
          disabled={approve.isPending || reject.isPending}
          className="btn-liquid font-semibold gap-1.5 text-xs"
          style={{
            background: "rgba(36,230,255,0.12)",
            color: "#24E6FF",
            border: "1px solid rgba(36,230,255,0.3)",
          }}
          data-ocid="admin.confirm_button"
        >
          {approve.isPending ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <CheckCircle2 className="w-3.5 h-3.5" />
          )}
          Approve
        </Button>
        <Button
          size="sm"
          onClick={handleReject}
          disabled={approve.isPending || reject.isPending}
          className="btn-liquid font-semibold gap-1.5 text-xs"
          style={{
            background: "rgba(239,68,68,0.1)",
            color: "#EF4444",
            border: "1px solid rgba(239,68,68,0.3)",
          }}
          data-ocid="admin.delete_button"
        >
          {reject.isPending ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <XCircle className="w-3.5 h-3.5" />
          )}
          Reject
        </Button>
      </div>
    </motion.div>
  );
}

export default function Admin() {
  const { identity } = useInternetIdentity();
  const { data: isAdmin, isLoading: checkingAdmin } = useIsAdmin();
  const { data: pendingProjects, isLoading } = usePendingProjects();

  if (!identity) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-6">
        <div className="text-center" data-ocid="admin.error_state">
          <ShieldOff
            className="w-12 h-12 mx-auto mb-4"
            style={{ color: "#6E768A" }}
          />
          <h2 className="text-2xl font-black mb-2" style={{ color: "#F2F6FF" }}>
            Sign In Required
          </h2>
          <p className="text-sm" style={{ color: "#A7B0C2" }}>
            Please sign in to access the admin panel.
          </p>
        </div>
      </div>
    );
  }

  if (checkingAdmin) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <Loader2
          className="w-8 h-8 animate-spin"
          style={{ color: "#24E6FF" }}
          data-ocid="admin.loading_state"
        />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-6">
        <div className="text-center" data-ocid="admin.error_state">
          <ShieldOff
            className="w-12 h-12 mx-auto mb-4"
            style={{ color: "#EF4444" }}
          />
          <h2 className="text-2xl font-black mb-2" style={{ color: "#F2F6FF" }}>
            Access Denied
          </h2>
          <p className="text-sm" style={{ color: "#A7B0C2" }}>
            You don't have admin privileges.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16 px-6">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="flex items-center gap-3 mb-3">
            <Shield className="w-5 h-5" style={{ color: "#A56BFF" }} />
            <div
              className="text-xs font-bold uppercase tracking-widest"
              style={{ color: "#A56BFF" }}
            >
              Admin Panel
            </div>
          </div>
          <h1
            className="text-4xl font-black tracking-tight"
            style={{ color: "#F2F6FF", letterSpacing: "-0.03em" }}
          >
            Pending Review
          </h1>
          <p className="text-sm mt-2" style={{ color: "#A7B0C2" }}>
            {pendingProjects?.length ?? 0} project
            {(pendingProjects?.length ?? 0) !== 1 ? "s" : ""} awaiting forensic
            audit
          </p>
        </motion.div>

        {isLoading ? (
          <div
            className="flex justify-center py-20"
            data-ocid="admin.loading_state"
          >
            <Loader2
              className="w-8 h-8 animate-spin"
              style={{ color: "#24E6FF" }}
            />
          </div>
        ) : !pendingProjects || pendingProjects.length === 0 ? (
          <div
            className="text-center py-20 rounded-2xl"
            style={{
              background: "rgba(18,22,33,0.55)",
              border: "1px solid rgba(42,49,67,0.8)",
            }}
            data-ocid="admin.empty_state"
          >
            <CheckCircle2
              className="w-12 h-12 mx-auto mb-4"
              style={{ color: "#24E6FF" }}
            />
            <h3 className="font-bold text-lg mb-1" style={{ color: "#F2F6FF" }}>
              All Clear!
            </h3>
            <p className="text-sm" style={{ color: "#A7B0C2" }}>
              No pending submissions. The queue is empty.
            </p>
          </div>
        ) : (
          <div className="space-y-4" data-ocid="admin.list">
            {pendingProjects.map((p, i) => (
              <ProjectRow key={String(p.id)} project={p} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
