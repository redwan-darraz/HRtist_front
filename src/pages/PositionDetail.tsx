import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CandidateCard } from "@/components/CandidateCard";
import { SearchBar } from "@/components/SearchBar";
import { ArrowLeft, Briefcase } from "lucide-react";
import { useState } from "react";

// Mock data - à remplacer par les appels API
const mockPosition = {
  id: 1,
  title: "Développeur Full-Stack Senior",
  department: "Engineering",
  candidates: [
    {
      id: 1,
      firstName: "Marie",
      lastName: "Dubois",
      email: "marie.dubois@email.com",
      phone: "+33 6 12 34 56 78",
      status: "interview" as const,
      skills: ["React", "TypeScript", "Node.js", "PostgreSQL"],
      appliedDate: "2024-01-15",
      position: "Développeur Full-Stack Senior",
    },
    {
      id: 5,
      firstName: "Paul",
      lastName: "Leroy",
      email: "paul.leroy@email.com",
      status: "screening" as const,
      skills: ["Vue.js", "Python", "Django", "MongoDB"],
      appliedDate: "2024-01-17",
      position: "Développeur Full-Stack Senior",
    },
  ],
};

const PositionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCandidates = mockPosition.candidates.filter((candidate) =>
    candidate.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    candidate.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    candidate.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg">
          <Briefcase className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {mockPosition.title}
          </h1>
          <p className="text-muted-foreground mt-1">
            {mockPosition.department} • {mockPosition.candidates.length} candidat(s)
          </p>
        </div>
      </div>

      <SearchBar
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder="Rechercher un candidat..."
      />

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>{filteredCandidates.length} candidat(s) affiché(s)</span>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredCandidates.map((candidate) => (
          <CandidateCard key={candidate.id} {...candidate} />
        ))}
      </div>
    </div>
  );
};

export default PositionDetail;
