import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Helmet } from "react-helmet-async";
import AnimatedSection from "@/components/AnimatedSection";
import { Mail, MapPin, ExternalLink, CheckCircle2, AlertCircle } from "lucide-react";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().min(3, "Subject must be at least 3 characters"),
  message: z.string().min(20, "Message must be at least 20 characters"),
});

type ContactFields = z.infer<typeof contactSchema>;

const team = [
  {
    name: "Zhijing Jin",
    role: "Founder & Head",
    email: "zjin.admin@cs.toronto.edu",
    website: "https://zhijing-jin.com/home/",
    social: [
      { label: "X / Twitter", href: "https://x.com/ZhijingJin" },
      { label: "Bluesky", href: "https://bsky.app/profile/zhijingjin.bsky.social" },
      { label: "YouTube", href: "https://youtube.com/@Zhijing" },
    ],
  },
  {
    name: "Pepijn Cobben",
    role: "Co-founder",
    email: "pcobben@ethz.ch",
    social: [
      { label: "LinkedIn", href: "https://www.linkedin.com/in/pepijn-cobben" },
    ],
  },
];

type SubmitStatus = "idle" | "sending" | "success" | "error";

const ContactPage = () => {
  const [status, setStatus] = useState<SubmitStatus>("idle");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFields>();

  const onSubmit = async (raw: ContactFields) => {
    // Validate with zod before sending
    const result = contactSchema.safeParse(raw);
    if (!result.success) return;

    setStatus("sending");
    try {
      // No backend yet — open a prefilled mailto as a graceful fallback.
      const { name, email, subject, message } = result.data;
      const body = encodeURIComponent(`From: ${name} <${email}>\n\n${message}`);
      window.location.assign(`mailto:hello@safe.eu?subject=${encodeURIComponent(subject)}&body=${body}`);
      setStatus("success");
      reset();
    } catch {
      setStatus("error");
    }
  };

  const inputBase =
    "w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:ring-2 focus:ring-primary/40 transition-shadow";
  const errorClass = "border-red-400 focus:ring-red-300/40";

  return (
    <div>
      <Helmet>
        <title>Contact — EuroSafeAI</title>
        <meta name="description" content="Get in touch with the EuroSafeAI team for collaborations, media inquiries, and research questions." />
      </Helmet>

      {/* Header */}
      <section
        style={{
          background: "linear-gradient(180deg, #ffffff 0%, #ffffff 55%, #f5f7fb 100%)",
          padding: "9rem 0 6rem",
        }}
      >
        <div className="mx-auto px-6" style={{ maxWidth: "1100px" }}>
          <AnimatedSection>
            <h1
              style={{
                fontSize: "clamp(1.9rem, 5vw, 4rem)",
                fontWeight: 800,
                lineHeight: 1.08,
                color: "#0a1f4d",
                letterSpacing: "-0.025em",
                marginBottom: "1.4rem",
                maxWidth: "820px",
              }}
            >
              Get in <span style={{ color: "#003399" }}>touch</span>
            </h1>
            <p
              style={{
                fontSize: "1.05rem",
                lineHeight: 1.7,
                color: "rgba(10,31,77,0.65)",
                maxWidth: "720px",
              }}
            >
              We welcome collaborations, media inquiries, and questions about our research. Reach out to us directly.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Contact form + info */}
      <section className="section-alt py-24">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Form */}
            <AnimatedSection>
              <h2 className="font-display text-2xl md:text-3xl font-bold mb-8">Send a message</h2>

              {status === "success" && (
                <div className="mb-6 flex items-start gap-3 rounded-lg border border-green-200 bg-green-50 p-4 text-green-800 text-sm">
                  <CheckCircle2 className="h-5 w-5 mt-0.5 shrink-0" />
                  <span>Thanks for reaching out! Your default mail client has opened with the message pre-filled.</span>
                </div>
              )}

              {status === "error" && (
                <div className="mb-6 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-red-800 text-sm">
                  <AlertCircle className="h-5 w-5 mt-0.5 shrink-0" />
                  <span>Something went wrong. Please email us directly at hello@safe.eu</span>
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-1.5">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="name"
                    type="text"
                    autoComplete="name"
                    placeholder="Your name"
                    className={`${inputBase} ${errors.name ? errorClass : ""}`}
                    {...register("name", {
                      required: "Name is required",
                      minLength: { value: 2, message: "Name must be at least 2 characters" },
                    })}
                  />
                  {errors.name && (
                    <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-1.5">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    className={`${inputBase} ${errors.email ? errorClass : ""}`}
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Please enter a valid email address",
                      },
                    })}
                  />
                  {errors.email && (
                    <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium mb-1.5">
                    Subject <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="subject"
                    type="text"
                    placeholder="What is this about?"
                    className={`${inputBase} ${errors.subject ? errorClass : ""}`}
                    {...register("subject", {
                      required: "Subject is required",
                      minLength: { value: 3, message: "Subject must be at least 3 characters" },
                    })}
                  />
                  {errors.subject && (
                    <p className="mt-1 text-xs text-red-500">{errors.subject.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-1.5">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    placeholder="Tell us about your inquiry..."
                    className={`${inputBase} resize-none ${errors.message ? errorClass : ""}`}
                    {...register("message", {
                      required: "Message is required",
                      minLength: { value: 20, message: "Message must be at least 20 characters" },
                    })}
                  />
                  {errors.message && (
                    <p className="mt-1 text-xs text-red-500">{errors.message.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="w-full rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 focus:outline-hidden focus:ring-2 focus:ring-primary/40 disabled:opacity-60 transition-colors"
                >
                  {status === "sending" ? "Sending…" : "Send message"}
                </button>
              </form>
            </AnimatedSection>

            {/* Info cards */}
            <div className="space-y-6">
              <AnimatedSection delay={0.1} className="rounded-xl border bg-background p-8 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <Mail className="h-5 w-5 text-primary" />
                  <span className="font-mono text-xs text-muted-foreground uppercase tracking-widest">General Inquiries</span>
                </div>
                <h3 className="font-display text-xl font-bold mb-2">Email Us Directly</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  For general questions, collaborations, or media requests.
                </p>
                <a
                  href="mailto:hello@safe.eu"
                  className="inline-flex items-center gap-1.5 text-primary font-semibold text-sm hover:underline"
                >
                  hello@safe.eu <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </AnimatedSection>

              <AnimatedSection delay={0.2} className="rounded-xl border bg-background p-8 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <MapPin className="h-5 w-5 text-primary" />
                  <span className="font-mono text-xs text-muted-foreground uppercase tracking-widest">Location</span>
                </div>
                <h3 className="font-display text-xl font-bold mb-2">Zurich, Switzerland</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Uetikon am See 8852<br />
                  Zürich, Switzerland
                </p>
                <p className="mt-4 text-sm text-muted-foreground">
                  Registered as a Swiss nonprofit under Swiss law (Democratic Verein), in deep collaboration with the University of Toronto.
                </p>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>

      {/* Team Contacts */}
      <section className="py-24">
        <div className="container mx-auto px-6 max-w-5xl">
          <AnimatedSection>
            <h2 className="font-display text-2xl md:text-3xl font-bold mb-10">Team Contacts</h2>
          </AnimatedSection>
          <div className="space-y-4">
            {team.map((member, i) => (
              <AnimatedSection
                key={member.name}
                delay={i * 0.05}
                className="flex flex-col sm:flex-row sm:items-center gap-4 rounded-lg border p-5 hover:shadow-xs transition-shadow"
              >
                <div className="shrink-0 min-w-[200px]">
                  <p className="font-display font-bold text-base">{member.name}</p>
                  <p className="font-mono text-xs text-muted-foreground mt-0.5">{member.role}</p>
                </div>
                <a
                  href={`mailto:${member.email}`}
                  className="flex-1 min-w-0 break-all text-sm text-primary hover:underline"
                >
                  {member.email}
                </a>
                <div className="flex items-center gap-3 shrink-0">
                  {member.website && (
                    <a href={member.website} target="_blank" rel="noopener noreferrer" className="font-mono text-xs text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1">
                      Website <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                  {member.social.map((s) => (
                    <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="font-mono text-xs text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1">
                      {s.label} <ExternalLink className="h-3 w-3" />
                    </a>
                  ))}
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
