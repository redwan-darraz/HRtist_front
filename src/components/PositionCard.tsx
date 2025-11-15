import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface PositionCardProps {
  id: number;
  title: string;
  department: string;
  candidateCount: number;
  activeCount: number;
}

export const PositionCard = ({ 
  id, 
  title, 
  department, 
  candidateCount, 
  activeCount 
}: PositionCardProps) => {
  const navigate = useNavigate();
  
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-xl">{title}</CardTitle>
            <p className="text-sm text-muted-foreground">{department}</p>
          </div>
          <Badge variant="secondary">{candidateCount} candidats</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm">
            <Users className="h-4 w-4 text-primary" />
            <span className="font-medium text-primary">{activeCount}</span>
            <span className="text-muted-foreground">en cours</span>
          </div>
          <Button 
            onClick={() => navigate(`/position/${id}`)}
            variant="ghost"
            size="sm"
            className="gap-1"
          >
            Voir les candidats
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
