import { ReactNode } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface UtilityCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  children: ReactNode;
}

const UtilityCard = ({ title, description, icon: Icon, children }: UtilityCardProps) => {
  return (
    <Card className="bg-gradient-card shadow-card border-border/50 hover:shadow-glow transition-all duration-300 hover:scale-[1.02]">
      <CardHeader>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <Icon className="w-5 h-5 text-primary" />
          </div>
          <CardTitle className="text-xl">{title}</CardTitle>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
};

export default UtilityCard;
