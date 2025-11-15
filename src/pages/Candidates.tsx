import { useState } from "react";
import { CandidateCard } from "@/components/CandidateCard";
import { SearchBar } from "@/components/SearchBar";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter } from "lucide-react";

const mockCandidates: any[] = [];

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
