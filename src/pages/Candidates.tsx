import { useState } from "react";
import { CandidateCard } from "@/components/CandidateCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { candidateApi } from "@/services/candidateApi";
import { Candidate } from "@/types/api";
import { CandidateStatus } from "@/components/StatusBadge";
import { Loader2, TestTube2 } from "lucide-react";

const Candidates = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [candidates, setCandidates] = useState<Candidate[]>([]);

  // Test inputs
  const [processId, setProcessId] = useState("");
  const [searchName, setSearchName] = useState("");
  const [candidateId, setCandidateId] = useState("");
  const [newCandidate, setNewCandidate] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    poste: ""
  });

  const handleGetByProcess = async () => {
    if (!processId) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer un ID de processus",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const data = await candidateApi.getCandidatesForProcess(Number(processId));
      setCandidates(data);
      toast({
        title: "Succès",
        description: `${data.length} candidat(s) trouvé(s)`
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Erreur lors de la récupération",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearchByName = async () => {
    if (!searchName) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer un nom à rechercher",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const data = await candidateApi.searchCandidatesByName(searchName);
      setCandidates(data);
      toast({
        title: "Succès",
        description: `${data.length} candidat(s) trouvé(s)`
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Erreur lors de la recherche",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGetById = async () => {
    if (!candidateId) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer un ID de candidat",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const data = await candidateApi.getCandidateById(Number(candidateId));
      setCandidates([data]);
      toast({
        title: "Succès",
        description: `Candidat ${data.nom} ${data.prenom} trouvé`
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Erreur lors de la récupération",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCandidate = async () => {
    if (!newCandidate.nom || !newCandidate.email) {
      toast({
        title: "Erreur",
        description: "Le nom et l'email sont obligatoires",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const data = await candidateApi.createCandidate(newCandidate as Candidate);
      setCandidates([data]);
      toast({
        title: "Succès",
        description: `Candidat ${data.nom} créé avec succès`
      });
      // Reset form
      setNewCandidate({
        nom: "",
        prenom: "",
        email: "",
        telephone: "",
        poste: ""
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Erreur lors de la création",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Map API data to CandidateCard props format
  const mapCandidateToCardProps = (candidate: Candidate) => ({
    id: candidate.id || 0,
    firstName: candidate.prenom || "",
    lastName: candidate.nom,
    email: candidate.email,
    phone: candidate.telephone,
    status: (candidate.statut as CandidateStatus) || "new",
    skills: candidate.competences || [],
    appliedDate: candidate.date_candidature || new Date().toISOString(),
    position: candidate.poste || "Non spécifié"
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Test API Candidats</h1>
        <p className="text-muted-foreground mt-1">
          Interface de test pour les endpoints de l'API candidats
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Test 1: Get candidates by process */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TestTube2 className="h-5 w-5" />
              Candidats par processus
            </CardTitle>
            <CardDescription>GET /processes/{"{process_id}"}/candidates</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="processId">ID du processus</Label>
              <Input
                id="processId"
                type="number"
                placeholder="Ex: 1"
                value={processId}
                onChange={(e) => setProcessId(e.target.value)}
              />
            </div>
            <Button onClick={handleGetByProcess} disabled={loading} className="w-full">
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Tester
            </Button>
          </CardContent>
        </Card>

        {/* Test 2: Search by name */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TestTube2 className="h-5 w-5" />
              Recherche par nom
            </CardTitle>
            <CardDescription>GET /candidates/search/{"{name}"}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="searchName">Nom à rechercher</Label>
              <Input
                id="searchName"
                placeholder="Ex: Dupont"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
              />
            </div>
            <Button onClick={handleSearchByName} disabled={loading} className="w-full">
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Tester
            </Button>
          </CardContent>
        </Card>

        {/* Test 3: Get by ID */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TestTube2 className="h-5 w-5" />
              Candidat par ID
            </CardTitle>
            <CardDescription>GET /candidates/{"{candidate_id}"}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="candidateId">ID du candidat</Label>
              <Input
                id="candidateId"
                type="number"
                placeholder="Ex: 1"
                value={candidateId}
                onChange={(e) => setCandidateId(e.target.value)}
              />
            </div>
            <Button onClick={handleGetById} disabled={loading} className="w-full">
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Tester
            </Button>
          </CardContent>
        </Card>

        {/* Test 4: Create candidate */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TestTube2 className="h-5 w-5" />
              Créer un candidat
            </CardTitle>
            <CardDescription>POST /candidates</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nom">Nom *</Label>
              <Input
                id="nom"
                placeholder="Dupont"
                value={newCandidate.nom}
                onChange={(e) => setNewCandidate({ ...newCandidate, nom: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="prenom">Prénom</Label>
              <Input
                id="prenom"
                placeholder="Jean"
                value={newCandidate.prenom}
                onChange={(e) => setNewCandidate({ ...newCandidate, prenom: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="jean.dupont@email.com"
                value={newCandidate.email}
                onChange={(e) => setNewCandidate({ ...newCandidate, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="telephone">Téléphone</Label>
              <Input
                id="telephone"
                placeholder="0612345678"
                value={newCandidate.telephone}
                onChange={(e) => setNewCandidate({ ...newCandidate, telephone: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="poste">Poste</Label>
              <Input
                id="poste"
                placeholder="Développeur Full Stack"
                value={newCandidate.poste}
                onChange={(e) => setNewCandidate({ ...newCandidate, poste: e.target.value })}
              />
            </div>
            <Button onClick={handleCreateCandidate} disabled={loading} className="w-full">
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Créer
            </Button>
          </CardContent>
        </Card>
      </div>

      <Separator />

      {/* Results section */}
      <div className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold">Résultats</h2>
          <p className="text-muted-foreground text-sm">
            {candidates.length} candidat(s) affiché(s)
          </p>
        </div>

        {candidates.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {candidates.map((candidate) => (
              <CandidateCard key={candidate.id} {...mapCandidateToCardProps(candidate)} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-10 text-center text-muted-foreground">
              Aucun résultat. Testez un endpoint ci-dessus.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Candidates;
