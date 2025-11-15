import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mail, Phone, Calendar, ChevronRight } from "lucide-react";
import { StatusBadge, CandidateStatus } from "./StatusBadge";
import { useNavigate } from "react-router-dom";

interface CandidateCardProps {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  status: CandidateStatus;
  skills: string[];
  appliedDate: string;
  position: string;
}

export const CandidateCard = ({
  id,
  firstName,
  lastName,
  email,
  phone,
  status,
  skills,
  appliedDate,
  position,
}: CandidateCardProps) => {
  const navigate = useNavigate();
  
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold">
              {firstName} {lastName}
            </h3>
            <p className="text-sm text-muted-foreground">{position}</p>
          </div>
          <StatusBadge status={status} />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-col gap-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Mail className="h-4 w-4" />
            <span>{email}</span>
          </div>
          {phone && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Phone className="h-4 w-4" />
              <span>{phone}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Candidature : {new Date(appliedDate).toLocaleDateString('fr-FR')}</span>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-1.5">
          {skills.slice(0, 3).map((skill) => (
            <Badge key={skill} variant="outline" className="text-xs">
              {skill}
            </Badge>
          ))}
          {skills.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{skills.length - 3}
            </Badge>
          )}
        </div>
        
        <Button 
          onClick={() => navigate(`/candidate/${id}`)}
          className="w-full gap-2"
          variant="outline"
        >
          Voir la fiche
          <ChevronRight className="h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
};
