import { useState } from "react";
import { CandidateCard } from "@/components/CandidateCard";
import { SearchBar } from "@/components/SearchBar";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter } from "lucide-react";

// Mock data - à remplacer par les appels API
const mockCandidates = [
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
    id: 2,
    firstName: "Thomas",
    lastName: "Martin",
    email: "thomas.martin@email.com",
    status: "screening" as const,
    skills: ["Product Strategy", "Agile", "Roadmapping"],
    appliedDate: "2024-01-18",
    position: "Product Manager",
  },
  {
    id: 3,
    firstName: "Sophie",
    lastName: "Bernard",
    email: "sophie.bernard@email.com",
    phone: "+33 6 98 76 54 32",
    status: "offer" as const,
    skills: ["Figma", "User Research", "Prototyping", "Design Systems"],
    appliedDate: "2024-01-10",
    position: "UX/UI Designer",
  },
  {
    id: 4,
    firstName: "Lucas",
    lastName: "Petit",
    email: "lucas.petit@email.com",
    status: "new" as const,
    skills: ["Python", "Machine Learning", "TensorFlow", "SQL"],
    appliedDate: "2024-01-20",
    position: "Data Scientist",
  },
];

const Candidates = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredCandidates = mockCandidates.filter((candidate) => {
    const matchesSearch = 
      candidate.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidate.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidate.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidate.position.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || candidate.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Candidats</h1>
        <p className="text-muted-foreground mt-1">
          Recherchez et filtrez les candidats
        </p>
      </div>

      <div className="flex gap-4 items-center">
        <div className="flex-1">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Rechercher par nom, email ou poste..."
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="new">Nouveau</SelectItem>
            <SelectItem value="screening">Présélection</SelectItem>
            <SelectItem value="interview">Entretien</SelectItem>
            <SelectItem value="offer">Offre</SelectItem>
            <SelectItem value="hired">Embauché</SelectItem>
            <SelectItem value="rejected">Refusé</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>{filteredCandidates.length} candidat(s) trouvé(s)</span>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredCandidates.map((candidate) => (
          <CandidateCard key={candidate.id} {...candidate} />
        ))}
      </div>
    </div>
  );
};

export default Candidates;
