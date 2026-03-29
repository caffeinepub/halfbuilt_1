import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import ProjectCard, { ProjectCardSkeleton } from "../components/ProjectCard";
import { useApprovedProjects } from "../hooks/useQueries";

const CATEGORIES = ["All", "SaaS", "AI", "3D", "Code", "Prototypes"];

const SKELETONS = ["sk-1", "sk-2", "sk-3", "sk-4", "sk-5", "sk-6"];

export default function Directory() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const { data: projects, isLoading } = useApprovedProjects();

  const allProjects = projects ?? [];
  const filtered = allProjects.filter((p) => {
    const matchCat = activeCategory === "All" || p.category === activeCategory;
    const matchSearch =
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const emptyMessage = () => {
    if (search !== "" && filtered.length === 0)
      return "No listings match your search.";
    if (activeCategory !== "All" && search === "")
      return "Scanning for assets in this sector...";
    return "No verified listings yet.";
  };

  return (
    <div className="py-16 px-6">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <div
            className="text-xs font-bold uppercase tracking-widest mb-2"
            style={{ color: "#A56BFF" }}
          >
            Verified Listings
          </div>
          <h1
            className="text-4xl font-black tracking-tight mb-2"
            style={{ color: "#F2F6FF", letterSpacing: "-0.03em" }}
          >
            Project Directory
          </h1>
          <p className="text-sm" style={{ color: "#A7B0C2" }}>
            Every project forensically audited before listing.
          </p>
        </motion.div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
              style={{ color: "#6E768A" }}
            />
            <Input
              placeholder="Search projects..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-10 text-sm"
              style={{
                background: "rgba(14,20,34,0.8)",
                border: "1px solid rgba(42,49,67,0.9)",
                color: "#F2F6FF",
              }}
              data-ocid="directory.search_input"
            />
          </div>
          <div className="flex gap-2 flex-wrap" data-ocid="directory.tab">
            {CATEGORIES.map((cat) => (
              <Button
                key={cat}
                size="sm"
                onClick={() => setActiveCategory(cat)}
                className="btn-liquid text-xs font-semibold"
                style={
                  activeCategory === cat
                    ? {
                        background: "linear-gradient(135deg, #22D8E6, #8B5CFF)",
                        color: "#071017",
                        border: "none",
                      }
                    : {
                        background: "rgba(14,20,34,0.8)",
                        border: "1px solid rgba(42,49,67,0.9)",
                        color: "#A7B0C2",
                      }
                }
                data-ocid="directory.tab"
              >
                {cat}
              </Button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          data-ocid="directory.list"
        >
          {isLoading ? (
            SKELETONS.map((id) => <ProjectCardSkeleton key={id} id={id} />)
          ) : filtered.length === 0 ? (
            <div
              className="col-span-3 py-16 text-center"
              style={{ color: "#6E768A" }}
              data-ocid="directory.empty_state"
            >
              {emptyMessage()}
            </div>
          ) : (
            filtered.map((p, i) => (
              <ProjectCard key={String(p.id)} project={p} index={i} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
