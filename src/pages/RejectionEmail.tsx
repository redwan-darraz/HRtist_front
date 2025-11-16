import { useState } from "react";
import { candidateApi } from "@/services/candidateApi";
import { feedbackApi } from "@/services/feedbackApi";
import type { Candidate, RejectionEmailResponse } from "@/types/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Search, Mail, Copy, Loader2, User, Phone } from "lucide-react";

const RejectionEmail = () => {
  const { toast } = useToast();

  const [searchTerm, setSearchTerm] = useState("");
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [generatedEmail, setGeneratedEmail] = useState<RejectionEmailResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [generatingFor, setGeneratingFor] = useState<number | null>(null);

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer un nom de candidat",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setGeneratedEmail(null);
    try {
      const results = await candidateApi.searchCandidatesByName(searchTerm);
      setCandidates(results);
      toast({
        title: "Succès",
        description: `${results.length} candidat(s) trouvé(s)`,
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Erreur lors de la recherche",
        variant: "destructive",
      });
      setCandidates([]);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async (candidate: Candidate) => {
    if (!candidate.id) return;

    setGeneratingFor(candidate.id);
    setGeneratedEmail(null);

    try {
      const result = await feedbackApi.generateRejectionEmail({
        candidate_full_name: `${candidate.prenom || ""} ${candidate.nom}`.trim(),
        decision: "rejected",
      });

      setGeneratedEmail(result);
      toast({
        title: "Email généré",
        description: "Le template d'email de refus a été généré avec succès",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Erreur lors de la génération",
        variant: "destructive",
      });
    } finally {
      setGeneratingFor(null);
    }
  };

  const handleCopy = async () => {
    if (!generatedEmail) return;

    try {
      await navigator.clipboard.writeText(generatedEmail.body);
      toast({
        title: "Copié",
        description: "Le corps de l'email a été copié dans le presse-papiers",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de copier dans le presse-papiers",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold flex items-center gap-3">
          <Mail className="h-8 w-8" />
          Template de mail de refus
        </h1>
        <p className="text-muted-foreground">
          Recherchez un candidat et générez un email de refus personnalisé
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Rechercher un candidat
          </CardTitle>
          <CardDescription>Recherchez un candidat par son nom</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Nom du candidat..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="flex-1"
            />
            <Button onClick={handleSearch} disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              Rechercher
            </Button>
          </div>

          {candidates.length > 0 && (
            <div className="space-y-3 mt-6">
              <h3 className="font-semibold text-lg">Résultats ({candidates.length})</h3>
              <div className="space-y-3">
                {candidates.map((candidate) => (
                  <Card key={candidate.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span className="font-semibold">
                              {candidate.prenom} {candidate.nom}
                            </span>
                          </div>
                          <div className="text-sm text-muted-foreground space-y-1">
                            <div>📧 {candidate.email}</div>
                            {candidate.telephone && (
                              <div className="flex items-center gap-1">
                                <Phone className="h-3 w-3" />
                                {candidate.telephone}
                              </div>
                            )}
                          </div>
                          {candidate.competences && candidate.competences.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {candidate.competences.map((skill, idx) => (
                                <Badge key={idx} variant="secondary" className="text-xs">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                        <Button
                          onClick={() => handleGenerate(candidate)}
                          disabled={generatingFor === candidate.id}
                        >
                          {generatingFor === candidate.id ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin mr-2" />
                              Génération...
                            </>
                          ) : (
                            <>
                              <Mail className="h-4 w-4 mr-2" />
                              Générer
                            </>
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {generatedEmail && (
        <Card className="border-primary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Email généré
            </CardTitle>
            <CardDescription>Copiez et personnalisez ce template si nécessaire</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="subject">Sujet</Label>
              <Input id="subject" value={generatedEmail.subject} readOnly className="bg-muted" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="body">Corps du message</Label>
              <Textarea
                id="body"
                value={generatedEmail.body}
                readOnly
                className="min-h-[300px] bg-muted font-mono text-sm"
              />
            </div>
            <Button onClick={handleCopy} className="w-full">
              <Copy className="h-4 w-4 mr-2" />
              Copier le mail
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RejectionEmail;
