import { Link } from "@tanstack/react-router";
import { Zap } from "lucide-react";
import { SiGithub, SiX } from "react-icons/si";

export default function Footer() {
  const year = new Date().getFullYear();
  const cafeLink = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`;

  return (
    <footer
      style={{
        borderTop: "1px solid rgba(42, 49, 67, 0.6)",
        background: "rgba(5, 7, 11, 0.9)",
      }}
      className="py-12"
    >
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div
                className="w-6 h-6 rounded flex items-center justify-center"
                style={{
                  background: "linear-gradient(135deg, #24E6FF, #8B5CFF)",
                }}
              >
                <Zap className="w-3.5 h-3.5 text-white" />
              </div>
              <span
                className="font-bold tracking-tight"
                style={{ color: "#F2F6FF" }}
              >
                HalfBuilt
              </span>
            </div>
            <p className="text-xs leading-relaxed" style={{ color: "#6E768A" }}>
              The premium directory for unfinished digital assets. Curated.
              Verified. Serious.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4
              className="text-xs font-semibold uppercase tracking-widest mb-4"
              style={{ color: "#6E768A" }}
            >
              Explore
            </h4>
            <ul className="space-y-2">
              {["Browse", "Categories", "Featured"].map((item) => (
                <li key={item}>
                  <Link
                    to="/directory"
                    className="text-sm transition-colors hover:text-neon-cyan"
                    style={{ color: "#A7B0C2" }}
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4
              className="text-xs font-semibold uppercase tracking-widest mb-4"
              style={{ color: "#6E768A" }}
            >
              Submit
            </h4>
            <ul className="space-y-2">
              {["Submit Project", "Guidelines", "Pricing"].map((item) => (
                <li key={item}>
                  <Link
                    to="/submit"
                    className="text-sm transition-colors hover:text-neon-cyan"
                    style={{ color: "#A7B0C2" }}
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4
              className="text-xs font-semibold uppercase tracking-widest mb-4"
              style={{ color: "#6E768A" }}
            >
              Connect
            </h4>
            <div className="flex items-center gap-3">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-neon-cyan"
                style={{ color: "#6E768A" }}
              >
                <SiGithub className="w-5 h-5" />
              </a>
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-neon-cyan"
                style={{ color: "#6E768A" }}
              >
                <SiX className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div
          className="mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4"
          style={{ borderTop: "1px solid rgba(42, 49, 67, 0.4)" }}
        >
          <p className="text-xs" style={{ color: "#6E768A" }}>
            © {year}. Built with ❤ using{" "}
            <a
              href={cafeLink}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-neon-cyan transition-colors"
            >
              caffeine.ai
            </a>
          </p>
          <p className="text-xs" style={{ color: "#6E768A" }}>
            All projects verified by HalfBuilt Forensic Audit.
          </p>
        </div>
      </div>
    </footer>
  );
}
