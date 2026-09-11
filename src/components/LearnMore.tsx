import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ACCENT } from "@/components/leaderboard/constants";

/**
 * Optional depth, not a hidden section.
 *
 * An accordion keeps one label and rotates an arrow, which reads as "there is
 * a section here you have not opened". This says "Learn more" and then
 * "Collapse", so the control describes what the next click does and the closed
 * state carries no suggestion that something is missing. Used where the prose
 * qualifies a figure a reader can already see rather than explaining it.
 */
export const LearnMore: React.FC<{
  children: React.ReactNode;
  label?: string;
  /**
   * Swap the label for "Collapse" when open. Right for a generic "Learn more",
   * wrong for a label that names what is inside: a reader who opened "What does
   * CBRN mean?" should still see what they opened.
   */
  swapLabel?: boolean;
}> = ({ children, label = "Learn more", swapLabel = true }) => {
  const [open, setOpen] = useState(false);

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.35em",
          background: "none",
          border: "none",
          padding: 0,
          fontSize: 12,
          fontWeight: 600,
          color: ACCENT,
          cursor: "pointer",
        }}
      >
        {open && swapLabel ? "Collapse" : label}
        <ChevronDown
          size={14}
          aria-hidden
          style={{ transition: "transform 0.2s", transform: open ? "rotate(180deg)" : undefined }}
        />
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div style={{ paddingTop: "0.6rem" }}>{children}</div>
      </CollapsibleContent>
    </Collapsible>
  );
};
