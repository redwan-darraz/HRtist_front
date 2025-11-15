import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type CandidateStatus = 
  | "new" 
  | "screening" 
  | "interview" 
  | "offer" 
  | "hired" 
  | "rejected";

interface StatusBadgeProps {
  status: CandidateStatus;
  className?: string;
}

const statusConfig: Record<CandidateStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  new: { label: "Nouveau", variant: "secondary" },
  screening: { label: "Présélection", variant: "outline" },
  interview: { label: "Entretien", variant: "default" },
  offer: { label: "Offre", variant: "default" },
  hired: { label: "Embauché", variant: "default" },
  rejected: { label: "Refusé", variant: "destructive" },
};

export const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const config = statusConfig[status];
  
  return (
    <Badge 
      variant={config.variant}
      className={cn(
        status === "hired" && "bg-success hover:bg-success/90",
        status === "offer" && "bg-warning hover:bg-warning/90",
        className
      )}
    >
      {config.label}
    </Badge>
  );
};
