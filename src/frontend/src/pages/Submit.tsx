import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, Loader2, Lock, Shield, Zap } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useSubmitProject } from "../hooks/useQueries";

export default function Submit() {
  const { identity, login, isLoggingIn } = useInternetIdentity();
  const submitProject = useSubmitProject();
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    contactLink: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identity) {
      login();
      return;
    }
    if (
      !form.name.trim() ||
      !form.description.trim() ||
      !form.category ||
      !form.price ||
      !form.contactLink.trim()
    ) {
      toast.error("All fields are required");
      return;
    }
    const price = Number(form.price);
    if (Number.isNaN(price) || price < 0) {
      toast.error("Enter a valid price");
      return;
    }
    try {
      await submitProject.mutateAsync({
        name: form.name.trim(),
        description: form.description.trim(),
        category: form.category,
        price,
        contactLink: form.contactLink.trim(),
      });
      setSuccess(true);
      toast.success("Project submitted for review!");
    } catch {
      toast.error("Submission failed. Please try again.");
    }
  };

  if (success) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
          data-ocid="submit.success_state"
        >
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{
              background: "rgba(36,230,255,0.1)",
              border: "2px solid rgba(36,230,255,0.4)",
            }}
          >
            <CheckCircle2 className="w-8 h-8" style={{ color: "#24E6FF" }} />
          </div>
          <h2 className="text-3xl font-black mb-3" style={{ color: "#F2F6FF" }}>
            Submitted!
          </h2>
          <p className="text-sm mb-6" style={{ color: "#A7B0C2" }}>
            Your project is now in the pending queue. The admin will review and
            approve it within 48 hours.
          </p>
          <Button
            onClick={() => setSuccess(false)}
            className="btn-liquid font-bold"
            style={{
              background: "linear-gradient(135deg, #22D8E6, #8B5CFF)",
              color: "#071017",
              border: "none",
            }}
            data-ocid="submit.button"
          >
            Submit Another
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="py-16 px-6">
      <div className="container mx-auto max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div
            className="text-xs font-bold uppercase tracking-widest mb-3"
            style={{ color: "#A56BFF" }}
          >
            List Your Project
          </div>
          <h1
            className="text-4xl font-black tracking-tight mb-2"
            style={{ color: "#F2F6FF", letterSpacing: "-0.03em" }}
          >
            Submit Project
          </h1>
          <p className="text-sm mb-10" style={{ color: "#A7B0C2" }}>
            Fill in the details below. All submissions are manually reviewed
            before going live.
          </p>

          {/* Auth gate */}
          {!identity ? (
            <div
              className="rounded-2xl p-10 text-center mb-8"
              style={{
                background: "rgba(18,22,33,0.55)",
                backdropFilter: "blur(16px)",
                border: "1px solid rgba(42,49,67,0.8)",
              }}
              data-ocid="submit.modal"
            >
              <Lock
                className="w-8 h-8 mx-auto mb-3"
                style={{ color: "#A56BFF" }}
              />
              <h3
                className="font-bold text-lg mb-2"
                style={{ color: "#F2F6FF" }}
              >
                Sign in Required
              </h3>
              <p className="text-sm mb-6" style={{ color: "#A7B0C2" }}>
                You need to sign in with Internet Identity to submit a project.
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
                data-ocid="submit.primary_button"
              >
                {isLoggingIn ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  "Sign in with Internet Identity"
                )}
              </Button>
            </div>
          ) : null}

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl p-8 space-y-6"
            style={{
              background: "rgba(18,22,33,0.55)",
              backdropFilter: "blur(16px)",
              border: "1px solid rgba(42,49,67,0.8)",
            }}
            data-ocid="submit.modal"
          >
            <div className="space-y-2">
              <Label
                className="text-xs font-semibold uppercase tracking-wider"
                style={{ color: "#6E768A" }}
              >
                Project Name
              </Label>
              <Input
                placeholder="e.g. NeuralFlow SaaS Platform"
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                disabled={!identity}
                className="h-11 text-sm"
                style={{
                  background: "rgba(14,20,34,0.8)",
                  border: "1px solid rgba(42,49,67,0.9)",
                  color: "#F2F6FF",
                }}
                data-ocid="submit.input"
              />
            </div>

            <div className="space-y-2">
              <Label
                className="text-xs font-semibold uppercase tracking-wider"
                style={{ color: "#6E768A" }}
              >
                Description
              </Label>
              <Textarea
                placeholder="Describe your project, what's built, what's missing, and what makes it valuable..."
                rows={5}
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
                disabled={!identity}
                className="text-sm resize-none"
                style={{
                  background: "rgba(14,20,34,0.8)",
                  border: "1px solid rgba(42,49,67,0.9)",
                  color: "#F2F6FF",
                }}
                data-ocid="submit.textarea"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  className="text-xs font-semibold uppercase tracking-wider"
                  style={{ color: "#6E768A" }}
                >
                  Category
                </Label>
                <Select
                  value={form.category}
                  onValueChange={(v) => setForm((f) => ({ ...f, category: v }))}
                  disabled={!identity}
                >
                  <SelectTrigger
                    className="h-11 text-sm"
                    style={{
                      background: "rgba(14,20,34,0.8)",
                      border: "1px solid rgba(42,49,67,0.9)",
                      color: form.category ? "#F2F6FF" : "#6E768A",
                    }}
                    data-ocid="submit.select"
                  >
                    <SelectValue placeholder="Select category" />
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
              </div>

              <div className="space-y-2">
                <Label
                  className="text-xs font-semibold uppercase tracking-wider"
                  style={{ color: "#6E768A" }}
                >
                  Price (USD)
                </Label>
                <Input
                  placeholder="e.g. 2500"
                  type="number"
                  min="0"
                  value={form.price}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, price: e.target.value }))
                  }
                  disabled={!identity}
                  className="h-11 text-sm"
                  style={{
                    background: "rgba(14,20,34,0.8)",
                    border: "1px solid rgba(42,49,67,0.9)",
                    color: "#F2F6FF",
                  }}
                  data-ocid="submit.input"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label
                className="text-xs font-semibold uppercase tracking-wider"
                style={{ color: "#6E768A" }}
              >
                Seller Contact Link
              </Label>
              <Input
                placeholder="Telegram or GitHub link (e.g. t.me/yourhandle)"
                value={form.contactLink}
                onChange={(e) =>
                  setForm((f) => ({ ...f, contactLink: e.target.value }))
                }
                disabled={!identity}
                required
                className="h-11 text-sm"
                style={{
                  background: "rgba(14,20,34,0.8)",
                  border: "1px solid rgba(42,49,67,0.9)",
                  color: "#F2F6FF",
                }}
                data-ocid="submit.input"
              />
            </div>

            {/* Audit info */}
            <div
              className="rounded-lg p-4 flex items-start gap-3"
              style={{
                background: "rgba(139,92,255,0.08)",
                border: "1px solid rgba(139,92,255,0.2)",
              }}
            >
              <Shield
                className="w-4 h-4 mt-0.5 flex-shrink-0"
                style={{ color: "#A56BFF" }}
              />
              <p
                className="text-xs leading-relaxed"
                style={{ color: "#A7B0C2" }}
              >
                Your submission will be reviewed by the HalfBuilt team. Approved
                projects receive a Forensic Audit badge and go live on the
                directory.
              </p>
            </div>

            <Button
              type="submit"
              className="w-full btn-liquid font-bold"
              disabled={submitProject.isPending || !identity}
              style={{
                background: "linear-gradient(135deg, #22D8E6, #8B5CFF)",
                color: "#071017",
                border: "none",
                height: "48px",
                fontSize: "15px",
              }}
              data-ocid="submit.submit_button"
            >
              {submitProject.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 mr-2" />
                  Submit for Forensic Review
                </>
              )}
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
