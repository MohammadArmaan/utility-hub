import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const CompoundInterestCalculator = () => {
  const [principal, setPrincipal] = useState("10000");
  const [rate, setRate] = useState("5");
  const [time, setTime] = useState("10");
  const [frequency, setFrequency] = useState("12");
  const [compoundResult, setCompoundResult] = useState<{
    amount: number;
    interest: number;
  } | null>(null);
  const [simpleResult, setSimpleResult] = useState<{
    amount: number;
    interest: number;
  } | null>(null);

  const calculateCompoundInterest = () => {
    const p = parseFloat(principal);
    const r = parseFloat(rate) / 100;
    const t = parseFloat(time);
    const n = parseFloat(frequency);

    if (isNaN(p) || isNaN(r) || isNaN(t) || isNaN(n)) {
      return;
    }

    const amount = p * Math.pow(1 + r / n, n * t);
    const interest = amount - p;

    setCompoundResult({
      amount: Math.round(amount * 100) / 100,
      interest: Math.round(interest * 100) / 100,
    });
  };

  const calculateSimpleInterest = () => {
    const p = parseFloat(principal);
    const r = parseFloat(rate) / 100;
    const t = parseFloat(time);

    if (isNaN(p) || isNaN(r) || isNaN(t)) {
      return;
    }

    const interest = p * r * t;
    const amount = p + interest;

    setSimpleResult({
      amount: Math.round(amount * 100) / 100,
      interest: Math.round(interest * 100) / 100,
    });
  };

  return (
    <Tabs defaultValue="compound" className="w-full">
      <TabsList className="grid w-full grid-cols-2 bg-muted/50">
        <TabsTrigger value="compound">Compound Interest</TabsTrigger>
        <TabsTrigger value="simple">Simple Interest</TabsTrigger>
      </TabsList>

      <TabsContent value="compound" className="space-y-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="principal">Principal Amount (₹)</Label>
            <Input
              id="principal"
              type="number"
              value={principal}
              onChange={(e) => setPrincipal(e.target.value)}
              className="bg-muted/50"
            />
          </div>

          <div>
            <Label htmlFor="rate">Annual Interest Rate (%)</Label>
            <Input
              id="rate"
              type="number"
              step="0.1"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              className="bg-muted/50"
            />
          </div>

          <div>
            <Label htmlFor="time">Time Period (years)</Label>
            <Input
              id="time"
              type="number"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="bg-muted/50"
            />
          </div>

          <div>
            <Label htmlFor="frequency">Compound Frequency (per year)</Label>
            <Input
              id="frequency"
              type="number"
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              placeholder="12 for monthly, 4 for quarterly, 1 for yearly"
              className="bg-muted/50"
            />
          </div>

          <Button
            onClick={calculateCompoundInterest}
            className="w-full bg-gradient-primary hover:opacity-90"
          >
            Calculate
          </Button>
        </div>

        {compoundResult && (
          <Card className="p-6 bg-gradient-card border-border/50">
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Final Amount</p>
                <p className="text-3xl font-bold text-primary">
                  ₹{compoundResult.amount.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Interest Earned</p>
                <p className="text-2xl font-semibold text-accent">
                  ₹{compoundResult.interest.toLocaleString()}
                </p>
              </div>
              <div className="pt-4 border-t border-border/50">
                <p className="text-xs text-muted-foreground">
                  Principal: ₹{parseFloat(principal).toLocaleString()}
                </p>
              </div>
            </div>
          </Card>
        )}
      </TabsContent>

      <TabsContent value="simple" className="space-y-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="principal-simple">Principal Amount (₹)</Label>
            <Input
              id="principal-simple"
              type="number"
              value={principal}
              onChange={(e) => setPrincipal(e.target.value)}
              className="bg-muted/50"
            />
          </div>

          <div>
            <Label htmlFor="rate-simple">Annual Interest Rate (%)</Label>
            <Input
              id="rate-simple"
              type="number"
              step="0.1"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              className="bg-muted/50"
            />
          </div>

          <div>
            <Label htmlFor="time-simple">Time Period (years)</Label>
            <Input
              id="time-simple"
              type="number"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="bg-muted/50"
            />
          </div>

          <Button
            onClick={calculateSimpleInterest}
            className="w-full bg-gradient-primary hover:opacity-90"
          >
            Calculate
          </Button>
        </div>

        {simpleResult && (
          <Card className="p-6 bg-gradient-card border-border/50">
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Final Amount</p>
                <p className="text-3xl font-bold text-primary">
                  ₹{simpleResult.amount.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Interest Earned</p>
                <p className="text-2xl font-semibold text-accent">
                  ₹{simpleResult.interest.toLocaleString()}
                </p>
              </div>
              <div className="pt-4 border-t border-border/50">
                <p className="text-xs text-muted-foreground">
                  Principal: ₹{parseFloat(principal).toLocaleString()}
                </p>
              </div>
            </div>
          </Card>
        )}
      </TabsContent>
    </Tabs>
  );
};

export default CompoundInterestCalculator;
