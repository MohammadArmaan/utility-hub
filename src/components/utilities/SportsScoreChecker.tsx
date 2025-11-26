import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const SportsScoreChecker = () => {
  const [sport, setSport] = useState("football");
  const [loading, setLoading] = useState(false);

  const fetchScores = async () => {
    setLoading(true);
    toast.info("Sports score API integration requires a paid API key. This is a demo placeholder.");
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">Select Sport</label>
          <Select value={sport} onValueChange={setSport}>
            <SelectTrigger className="bg-muted/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="football">Football</SelectItem>
              <SelectItem value="cricket">Cricket</SelectItem>
              <SelectItem value="nba">NBA Basketball</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button onClick={fetchScores} disabled={loading} className="w-full bg-gradient-primary hover:opacity-90">
          {loading ? "Loading..." : "Fetch Live Scores"}
        </Button>
      </div>

      <Card className="p-6 bg-gradient-card border-border/50">
        <div className="text-center space-y-2">
          <p className="text-muted-foreground">
            Sports score checking requires integration with a live sports API service like:
          </p>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• API-Sports (api-football.com, api-basketball.com)</li>
            <li>• TheSportsDB</li>
            <li>• ESPN API</li>
          </ul>
          <p className="text-xs text-muted-foreground mt-4">
            These services typically require API keys and have usage limits.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default SportsScoreChecker;
