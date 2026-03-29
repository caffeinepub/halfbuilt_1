import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Loader2, Lock } from "lucide-react";
import { useState } from "react";
import type { Project } from "../backend.d";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useUnlockContact } from "../hooks/useQueries";

const CATEGORY_COLORS: Record<string, string> = {
  SaaS: "#19D7E6",
  AI: "#A56BFF",
  "3D": "#D24CFF",
  Code: "#32E6FF",
  Prototypes: "#FFB347",
};

const AUDIT_TAGS = [
  "[Code: Clean/Audited]",
  "[Revenue: Verified]",
  "[UI: High-Aura]",
  "[Stack: AI-Native]",
  "[Status: Plug-and-Play]",
  "[Security: Tamper-Proof]",
];

const STATUS_STYLES: Record<string, { color: string; bg: string }> = {
  pending: { color: "#F59E0B", bg: "rgba(245, 158, 11, 0.1)" },
  approved: { color: "#19D7E6", bg: "rgba(25, 215, 230, 0.1)" },
  rejected: { color: "#EF4444", bg: "rgba(239, 68, 68, 0.1)" },
};

interface Props {
  project: Project;
  showStatus?: boolean;
  index?: number;
}

export default function ProjectCard({
  project,
  showStatus = false,
  index = 0,
}: Props) {
  const catColor = CATEGORY_COLORS[project.category] || "#19D7E6";
  const statusStyle = STATUS_STYLES[project.status] || STATUS_STYLES.pending;
  const tag = AUDIT_TAGS[Number(project.id) % AUDIT_TAGS.length];

  const { identity, login } = useInternetIdentity();
  const unlockContact = useUnlockContact();
  const [contact, setContact] = useState<string | null>(null);

  const handleUnlock = async () => {
    if (!identity) {
      login();
      return;
    }
    try {
      const result = await unlockContact.mutateAsync(project.id);
      setContact(result);
    } catch {
      // silently fail — user not signed in or network error
    }
  };

  return (
    <div
      className="neon-border neon-glow rounded-xl overflow-hidden animate-fade-in"
      style={{
        animationDelay: `${index * 80}ms`,
        background: "rgba(18, 22, 33, 0.55)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
      }}
      data-ocid="project.card"
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 pt-4 pb-0">
        <span
          className="text-xs font-bold uppercase tracking-widest px-2 py-0.5 rounded"
          style={{
            color: catColor,
            background: `${catColor}18`,
            border: `1px solid ${catColor}33`,
          }}
        >
          {project.category}
        </span>
        {showStatus && (
          <span
            className="text-xs font-semibold px-2 py-0.5 rounded"
            style={{ color: statusStyle.color, background: statusStyle.bg }}
          >
            {project.status}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3
          className="font-bold text-base tracking-tight mb-1 truncate"
          style={{ color: "#F2F6FF" }}
        >
          {project.name}
        </h3>
        <p
          className="text-sm leading-relaxed line-clamp-2 mb-3"
          style={{ color: "#A7B0C2" }}
        >
          {project.description}
        </p>

        {/* Audit tag */}
        <div className="mb-3">
          <span
            className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded"
            style={{
              color: "#A56BFF",
              background: "rgba(139,92,255,0.12)",
              border: "1px solid rgba(139,92,255,0.2)",
            }}
          >
            {tag}
          </span>
        </div>

        {/* Price + action */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-lg font-black" style={{ color: "#24E6FF" }}>
              ${project.price.toLocaleString()}
            </span>
          </div>
          <Button
            size="sm"
            className="btn-liquid text-xs font-semibold gap-1"
            style={{
              background: "rgba(36,230,255,0.12)",
              color: "#24E6FF",
              border: "1px solid rgba(36,230,255,0.3)",
            }}
            data-ocid="project.button"
          >
            View Details <ArrowUpRight className="w-3 h-3" />
          </Button>
        </div>

        {/* Unlock Contact */}
        <div
          className="pt-3"
          style={{ borderTop: "1px solid rgba(42,49,67,0.6)" }}
        >
          {contact ? (
            <div>
              <div
                className="text-[10px] font-semibold uppercase tracking-wider mb-1"
                style={{ color: "#6E768A" }}
              >
                Contact Revealed
              </div>
              <a
                href={
                  contact.startsWith("http") ? contact : `https://${contact}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-semibold truncate block hover:underline"
                style={{ color: "#24E6FF" }}
                data-ocid="project.link"
              >
                {contact}
              </a>
            </div>
          ) : (
            <Button
              size="sm"
              className="w-full btn-liquid text-xs font-semibold gap-1.5"
              onClick={handleUnlock}
              disabled={unlockContact.isPending}
              style={{
                background: "rgba(139,92,255,0.12)",
                color: "#A56BFF",
                border: "1px solid rgba(139,92,255,0.3)",
              }}
              data-ocid="project.open_modal_button"
            >
              {unlockContact.isPending ? (
                <>
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Unlocking...
                </>
              ) : (
                <>
                  <Lock className="w-3 h-3" />
                  Unlock Contact
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

// Skeleton
export function ProjectCardSkeleton(_props: { id: string }) {
  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        background: "rgba(18,22,33,0.55)",
        backdropFilter: "blur(16px)",
        border: "1px solid rgba(42,49,67,0.8)",
      }}
    >
      <div className="p-4 space-y-3">
        <div
          className="h-4 rounded w-16"
          style={{
            background: "rgba(255,255,255,0.06)",
            animation: "pulse 2s infinite",
          }}
        />
        <div
          className="h-5 rounded w-3/4"
          style={{
            background: "rgba(255,255,255,0.06)",
            animation: "pulse 2s infinite",
          }}
        />
        <div
          className="h-3 rounded w-full"
          style={{
            background: "rgba(255,255,255,0.04)",
            animation: "pulse 2s infinite",
          }}
        />
        <div
          className="h-3 rounded w-2/3"
          style={{
            background: "rgba(255,255,255,0.04)",
            animation: "pulse 2s infinite",
          }}
        />
        <div
          className="h-8 rounded w-1/3 mt-2"
          style={{
            background: "rgba(255,255,255,0.04)",
            animation: "pulse 2s infinite",
          }}
        />
      </div>
    </div>
  );
}
