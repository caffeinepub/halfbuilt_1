import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Shield, Star, Zap } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import ParticleBackground from "../components/ParticleBackground";
import ProjectCard, { ProjectCardSkeleton } from "../components/ProjectCard";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useApprovedProjects, useSubmitProject } from "../hooks/useQueries";

const HERO_WORDS = [
  "Digital Assets",
  "Code Repos",
  "AI Agents",
  "3D Worlds",
  "SaaS MVPs",
];

const FEATURES = [
  { icon: Shield, text: "Forensic Audit on every project" },
  { icon: Star, text: "Access 1,000+ serious buyers" },
  { icon: Zap, text: "Go live in under 48 hours" },
];

const SKELETONS = ["sk-1", "sk-2", "sk-3", "sk-4", "sk-5", "sk-6"];

function TypewriterText() {
  const [wordIndex, setWordIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const word = HERO_WORDS[wordIndex];
    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          if (displayed.length < word.length) {
            setDisplayed(word.slice(0, displayed.length + 1));
          } else {
            setTimeout(() => setIsDeleting(true), 1800);
          }
        } else {
          if (displayed.length > 0) {
            setDisplayed(displayed.slice(0, -1));
          } else {
            setIsDeleting(false);
            setWordIndex((i) => (i + 1) % HERO_WORDS.length);
          }
        }
      },
      isDeleting ? 60 : 90,
    );
    return () => clearTimeout(timeout);
  }, [displayed, isDeleting, wordIndex]);

  return (
    <span style={{ color: "#24E6FF" }}>
      {displayed}
      <span className="animate-pulse">|</span>
    </span>
  );
}

export default function Landing() {
  const { data: projects, isLoading } = useApprovedProjects();
  const { identity, login } = useInternetIdentity();
  const submitProject = useSubmitProject();

  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    contactLink: "",
  });
  const displayProjects = projects?.slice(0, 6) ?? [];

  const handleQuickSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identity) {
      login();
      return;
    }
    if (
      !form.name ||
      !form.description ||
      !form.category ||
      !form.price ||
      !form.contactLink
    ) {
      toast.error("Please fill all fields");
      return;
    }
    try {
      await submitProject.mutateAsync({
        name: form.name,
        description: form.description,
        category: form.category,
        price: Number(form.price),
        contactLink: form.contactLink,
      });
      toast.success("Project submitted! Pending admin review.");
      setForm({
        name: "",
        description: "",
        category: "",
        price: "",
        contactLink: "",
      });
    } catch {
      toast.error("Submission failed. Try again.");
    }
  };

  return (
    <div className="relative">
      {/* ============ HERO ============ */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-20 pb-24">
        <ParticleBackground />
        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6 text-xs font-semibold"
              style={{
                background: "rgba(36,230,255,0.08)",
                border: "1px solid rgba(36,230,255,0.2)",
                color: "#24E6FF",
              }}
            >
              <Zap className="w-3 h-3" /> Premium Curated Directory
            </div>

            <h1
              className="text-5xl md:text-7xl font-black tracking-tight leading-none mb-6"
              style={{ color: "#F2F6FF", letterSpacing: "-0.03em" }}
            >
              Trade Unfinished
              <br />
              <TypewriterText />
            </h1>

            <p
              className="text-lg md:text-xl font-medium max-w-2xl mx-auto mb-10"
              style={{ color: "#A7B0C2" }}
            >
              HalfBuilt is the verified marketplace for serious digital assets.
              Every listing forensically audited. Every seller vetted.
            </p>

            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Link to="/directory">
                <Button
                  size="lg"
                  className="btn-liquid font-bold gap-2"
                  style={{
                    background: "linear-gradient(135deg, #22D8E6, #8B5CFF)",
                    color: "#071017",
                    border: "none",
                    padding: "0 32px",
                    height: "48px",
                  }}
                  data-ocid="hero.primary_button"
                >
                  Browse Directory <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link to="/submit">
                <Button
                  size="lg"
                  variant="outline"
                  className="btn-liquid font-semibold gap-2"
                  style={{
                    background: "#0E1422",
                    borderColor: "#2A3143",
                    color: "#F2F6FF",
                    padding: "0 32px",
                    height: "48px",
                  }}
                  data-ocid="hero.secondary_button"
                >
                  <Shield className="w-4 h-4" /> List Your Project
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="flex items-center justify-center gap-8 mt-16 flex-wrap"
          >
            <div className="text-center">
              <div className="text-2xl font-black" style={{ color: "#24E6FF" }}>
                {projects?.length ?? 0}
              </div>
              <div
                className="text-xs font-medium mt-0.5"
                style={{ color: "#6E768A" }}
              >
                Verified Projects
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-black" style={{ color: "#24E6FF" }}>
                5
              </div>
              <div
                className="text-xs font-medium mt-0.5"
                style={{ color: "#6E768A" }}
              >
                Active Sectors
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-black" style={{ color: "#24E6FF" }}>
                Forensic Shield Active
              </div>
              <div
                className="text-xs font-medium mt-0.5"
                style={{ color: "#6E768A" }}
              >
                Security Status
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-black" style={{ color: "#24E6FF" }}>
                ₹100
              </div>
              <div
                className="text-xs font-medium mt-0.5"
                style={{ color: "#6E768A" }}
              >
                Listing Fee
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============ FEATURED PROJECTS ============ */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex items-end justify-between mb-10"
          >
            <div>
              <div
                className="text-xs font-bold uppercase tracking-widest mb-2"
                style={{ color: "#A56BFF" }}
              >
                Featured Listings
              </div>
              <h2
                className="text-3xl font-black tracking-tight"
                style={{ color: "#F2F6FF" }}
              >
                Verified Projects
              </h2>
            </div>
            <Link to="/directory">
              <Button
                variant="ghost"
                size="sm"
                className="gap-1 text-sm"
                style={{ color: "#24E6FF" }}
                data-ocid="featured.link"
              >
                View all <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </motion.div>

          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
            data-ocid="featured.list"
          >
            {isLoading ? (
              SKELETONS.map((id) => <ProjectCardSkeleton key={id} id={id} />)
            ) : displayProjects.length === 0 ? (
              <div
                className="col-span-3 py-16 text-center"
                style={{ color: "#6E768A" }}
              >
                No verified listings yet. Be the first to submit.
              </div>
            ) : (
              displayProjects.map((p, i) => (
                <ProjectCard key={String(p.id)} project={p} index={i} />
              ))
            )}
          </div>
        </div>
      </section>

      {/* ============ SUBMIT PANEL ============ */}
      <section className="py-20 px-6" id="submit">
        <div className="container mx-auto max-w-5xl">
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              background:
                "linear-gradient(90deg, rgba(20,240,255,0.10) 0%, rgba(18,22,33,0.55) 45%, rgba(165,107,255,0.12) 100%)",
              backdropFilter: "blur(24px)",
              border: "1px solid rgba(42,49,67,0.8)",
              boxShadow:
                "0 0 60px rgba(36,230,255,0.08), 0 0 80px rgba(139,92,255,0.08)",
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
              {/* Left: copy */}
              <div className="p-10 flex flex-col justify-center">
                <div
                  className="text-xs font-bold uppercase tracking-widest mb-3"
                  style={{ color: "#A56BFF" }}
                >
                  Open Submissions
                </div>
                <h2
                  className="text-4xl font-black tracking-tight mb-4"
                  style={{ color: "#F2F6FF", letterSpacing: "-0.03em" }}
                >
                  Join the
                  <br />
                  Collective
                </h2>
                <p
                  className="text-sm leading-relaxed mb-6"
                  style={{ color: "#A7B0C2" }}
                >
                  List your half-finished project and connect with buyers who
                  see the potential. Every listing goes through our Forensic
                  Audit before going live.
                </p>
                <div className="space-y-3">
                  {FEATURES.map(({ icon: Icon, text }) => (
                    <div key={text} className="flex items-center gap-3">
                      <div
                        className="w-6 h-6 rounded flex items-center justify-center flex-shrink-0"
                        style={{
                          background: "rgba(36,230,255,0.1)",
                          border: "1px solid rgba(36,230,255,0.2)",
                        }}
                      >
                        <Icon
                          className="w-3 h-3"
                          style={{ color: "#24E6FF" }}
                        />
                      </div>
                      <span className="text-sm" style={{ color: "#A7B0C2" }}>
                        {text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: form */}
              <div
                className="p-10"
                style={{ borderLeft: "1px solid rgba(42,49,67,0.5)" }}
              >
                <h3
                  className="font-bold text-lg mb-6"
                  style={{ color: "#F2F6FF" }}
                >
                  Quick Submit
                </h3>
                <form
                  onSubmit={handleQuickSubmit}
                  className="space-y-4"
                  data-ocid="submit.modal"
                >
                  <div>
                    <Input
                      placeholder="Project name"
                      value={form.name}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, name: e.target.value }))
                      }
                      className="h-10 text-sm"
                      style={{
                        background: "rgba(14,20,34,0.8)",
                        border: "1px solid rgba(42,49,67,0.9)",
                        color: "#F2F6FF",
                      }}
                      data-ocid="submit.input"
                    />
                  </div>
                  <div>
                    <Textarea
                      placeholder="Short description"
                      rows={3}
                      value={form.description}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, description: e.target.value }))
                      }
                      className="text-sm resize-none"
                      style={{
                        background: "rgba(14,20,34,0.8)",
                        border: "1px solid rgba(42,49,67,0.9)",
                        color: "#F2F6FF",
                      }}
                      data-ocid="submit.textarea"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Select
                      value={form.category}
                      onValueChange={(v) =>
                        setForm((f) => ({ ...f, category: v }))
                      }
                    >
                      <SelectTrigger
                        className="h-10 text-sm"
                        style={{
                          background: "rgba(14,20,34,0.8)",
                          border: "1px solid rgba(42,49,67,0.9)",
                          color: form.category ? "#F2F6FF" : "#6E768A",
                        }}
                        data-ocid="submit.select"
                      >
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                      <SelectContent
                        style={{
                          background: "#0E1422",
                          border: "1px solid rgba(42,49,67,0.9)",
                        }}
                      >
                        {["SaaS", "AI", "3D", "Code", "Prototypes"].map((c) => (
                          <SelectItem key={c} value={c}>
                            {c}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      placeholder="Price (USD)"
                      type="number"
                      value={form.price}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, price: e.target.value }))
                      }
                      className="h-10 text-sm"
                      style={{
                        background: "rgba(14,20,34,0.8)",
                        border: "1px solid rgba(42,49,67,0.9)",
                        color: "#F2F6FF",
                      }}
                      data-ocid="submit.input"
                    />
                  </div>
                  <div>
                    <Input
                      placeholder="Telegram or GitHub link"
                      value={form.contactLink}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, contactLink: e.target.value }))
                      }
                      required
                      className="h-10 text-sm"
                      style={{
                        background: "rgba(14,20,34,0.8)",
                        border: "1px solid rgba(42,49,67,0.9)",
                        color: "#F2F6FF",
                      }}
                      data-ocid="submit.input"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full btn-liquid font-bold"
                    disabled={submitProject.isPending}
                    style={{
                      background: "linear-gradient(135deg, #22D8E6, #8B5CFF)",
                      color: "#071017",
                      border: "none",
                      height: "44px",
                    }}
                    data-ocid="submit.submit_button"
                  >
                    {submitProject.isPending
                      ? "Submitting..."
                      : identity
                        ? "Submit for Review"
                        : "Sign in to Submit"}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
