import { Link } from "react-router-dom";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface NavigationCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  to: string;
}

const NavigationCard = ({ title, description, icon: Icon, to }: NavigationCardProps) => {
  return (
    <Link to={to}>
      <Card className="bg-gradient-card shadow-card border-border/50 hover:shadow-glow transition-all duration-300 hover:scale-[1.02] cursor-pointer h-full">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <Icon className="w-5 h-5 text-primary" />
            </div>
            <CardTitle className="text-xl">{title}</CardTitle>
          </div>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
      </Card>
    </Link>
  );
};

export default NavigationCard;
