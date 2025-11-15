import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { StatusBadge } from "@/components/StatusBadge";
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  Calendar, 
  MapPin, 
  FileText,
  MessageSquare,
  Plus
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

// Mock data - à remplacer par les appels API
const mockCandidate = {
  id: 1,
  firstName: "Marie",
  lastName: "Dubois",
  email: "marie.dubois@email.com",
  phone: "+33 6 12 34 56 78",
  status: "interview" as const,
  skills: ["React", "TypeScript", "Node.js", "PostgreSQL", "Docker", "AWS"],
  appliedDate: "2024-01-15",
  position: "Développeur Full-Stack Senior",
  location: "Paris, France",
  experience: "7 ans",
  education: "Master Informatique - Université Paris Diderot",
  interviews: [
    {
      id: 1,
      date: "2024-01-20",
      interviewer: "Jean Dupont",
      type: "Technique",
      feedback: "Excellente maîtrise des concepts React et TypeScript. Bonnes pratiques de code.",
      rating: 4,
    },
    {
      id: 2,
      date: "2024-01-22",
      interviewer: "Sophie Martin",
      type: "Culture fit",
      feedback: "Très bonne communication, s'intègre bien à l'équipe.",
      rating: 5,
    },
  ],
  notes: [
    {
      id: 1,
      author: "RH Team",
      date: "2024-01-16",
      content: "CV très complet, profil intéressant pour le poste.",
    },
  ],
};

const CandidateDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [newNote, setNewNote] = useState("");
  const [newFeedback, setNewFeedback] = useState("");

  const handleAddNote = () => {
    if (newNote.trim()) {
      toast.success("Note ajoutée avec succès");
      setNewNote("");
    }
  };

  const handleAddFeedback = () => {
    if (newFeedback.trim()) {
      toast.success("Feedback ajouté avec succès");
      setNewFeedback("");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>
      </div>

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {mockCandidate.firstName} {mockCandidate.lastName}
          </h1>
          <p className="text-lg text-muted-foreground mt-1">
            {mockCandidate.position}
          </p>
        </div>
        <StatusBadge status={mockCandidate.status} />
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informations personnelles</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{mockCandidate.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Téléphone</p>
                    <p className="font-medium">{mockCandidate.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Localisation</p>
                    <p className="font-medium">{mockCandidate.location}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Candidature</p>
                    <p className="font-medium">
                      {new Date(mockCandidate.appliedDate).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Compétences</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {mockCandidate.skills.map((skill) => (
                  <Badge key={skill} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Entretiens et Feedbacks
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockCandidate.interviews.map((interview, index) => (
                <div key={interview.id}>
                  {index > 0 && <Separator className="my-4" />}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold">{interview.type}</p>
                        <p className="text-sm text-muted-foreground">
                          {interview.interviewer} • {new Date(interview.date).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        {[...Array(interview.rating)].map((_, i) => (
                          <span key={i} className="text-warning">★</span>
                        ))}
                      </div>
                    </div>
                    <p className="text-sm">{interview.feedback}</p>
                  </div>
                </div>
              ))}
              
              <Separator />
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Ajouter un feedback</label>
                <Textarea
                  placeholder="Votre feedback sur l'entretien..."
                  value={newFeedback}
                  onChange={(e) => setNewFeedback(e.target.value)}
                  rows={3}
                />
                <Button onClick={handleAddFeedback} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Parcours</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Expérience</p>
                <p className="font-medium">{mockCandidate.experience}</p>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground">Formation</p>
                <p className="font-medium">{mockCandidate.education}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Notes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockCandidate.notes.map((note, index) => (
                <div key={note.id}>
                  {index > 0 && <Separator className="my-3" />}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{note.author}</span>
                      <span>{new Date(note.date).toLocaleDateString('fr-FR')}</span>
                    </div>
                    <p className="text-sm">{note.content}</p>
                  </div>
                </div>
              ))}
              
              <Separator />
              
              <div className="space-y-2">
                <Textarea
                  placeholder="Ajouter une note..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  rows={3}
                />
                <Button onClick={handleAddNote} size="sm" className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter une note
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CandidateDetail;
