import { PositionCard } from "@/components/PositionCard";
import { Briefcase } from "lucide-react";

// Mock data - à remplacer par les appels API
const mockPositions = [
  {
    id: 1,
    title: "Développeur Full-Stack Senior",
    department: "Engineering",
    candidateCount: 24,
    activeCount: 8,
  },
  {
    id: 2,
    title: "Product Manager",
    department: "Product",
    candidateCount: 15,
    activeCount: 5,
  },
  {
    id: 3,
    title: "UX/UI Designer",
    department: "Design",
    candidateCount: 18,
    activeCount: 6,
  },
  {
    id: 4,
    title: "Data Scientist",
    department: "Data",
    candidateCount: 12,
    activeCount: 4,
  },
];

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Postes ouverts</h1>
          <p className="text-muted-foreground mt-1">
            Gérez vos processus de recrutement en cours
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-lg">
          <Briefcase className="h-5 w-5 text-primary" />
          <span className="font-semibold">{mockPositions.length} postes</span>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {mockPositions.map((position) => (
          <PositionCard key={position.id} {...position} />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
