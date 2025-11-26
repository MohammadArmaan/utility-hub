import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import TimerStopwatch from "@/components/utilities/TimerStopwatch";
import { Clock } from "lucide-react";

const TimerStopwatchPage = () => {
  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <Card className="bg-gradient-card shadow-card border-border/50">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <Clock className="w-5 h-5 text-primary" />
              </div>
              <CardTitle className="text-2xl">Timer & Stopwatch</CardTitle>
            </div>
            <CardDescription>Track time with precision for any task</CardDescription>
          </CardHeader>
          <CardContent>
            <TimerStopwatch />
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default TimerStopwatchPage;
