import { Link } from "react-router-dom";
import { Users, Briefcase, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const Home = () => {
  const developers = [
    "Nathanel Jacquier",
    "Nathan Lalouet",
    "Alexandre Gastinel",
    "Redwan Darraz"
  ];

  return (
    <div className="min-h-[calc(100vh-10rem)] flex items-center justify-center">
      <div className="max-w-4xl mx-auto text-center space-y-12 px-6">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
            <Sparkles className="h-4 w-4" />
            <span>Plateforme de Recrutement Premium</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
            Bienvenue sur <span className="text-primary">HRtist</span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Une plateforme moderne de gestion de recrutement qui simplifie le processus 
            de sélection des candidats et la gestion des postes ouverts. Optimisez votre 
            workflow RH avec une interface élégante et intuitive.
          </p>
        </div>

        <div className="flex gap-4 justify-center flex-wrap">
          <Link to="/postes">
            <Button size="lg" className="gap-2">
              <Briefcase className="h-5 w-5" />
              Voir les Postes
            </Button>
          </Link>
          <Link to="/candidates">
            <Button size="lg" variant="outline" className="gap-2">
              <Users className="h-5 w-5" />
              Voir les Candidats
            </Button>
          </Link>
        </div>

        <Card className="p-8 bg-card/50 backdrop-blur-sm border-border/50">
          <h2 className="text-lg font-semibold mb-4 text-foreground">Développé par</h2>
          <div className="flex flex-wrap gap-3 justify-center">
            {developers.map((dev) => (
              <span
                key={dev}
                className="px-4 py-2 rounded-lg bg-accent/50 text-accent-foreground font-medium text-sm"
              >
                {dev}
              </span>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Home;
