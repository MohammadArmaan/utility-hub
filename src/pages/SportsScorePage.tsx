import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import SportsScoreChecker from "@/components/utilities/SportsScoreChecker";
import { Trophy } from "lucide-react";

const SportsScorePage = () => {
  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <Card className="bg-gradient-card shadow-card border-border/50">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <Trophy className="w-5 h-5 text-primary" />
              </div>
              <CardTitle className="text-2xl">Sports Score Checker</CardTitle>
            </div>
            <CardDescription>Check live sports scores (requires API integration)</CardDescription>
          </CardHeader>
          <CardContent>
            <SportsScoreChecker />
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default SportsScorePage;
