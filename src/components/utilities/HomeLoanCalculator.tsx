import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const HomeLoanCalculator = () => {
  const [loanAmount, setLoanAmount] = useState("300000");
  const [interestRate, setInterestRate] = useState("3.5");
  const [loanTerm, setLoanTerm] = useState("30");
  const [result, setResult] = useState<{
    monthlyPayment: number;
    totalPayment: number;
    totalInterest: number;
  } | null>(null);

  const calculateLoan = () => {
    const principal = parseFloat(loanAmount);
    const annualRate = parseFloat(interestRate) / 100;
    const monthlyRate = annualRate / 12;
    const numberOfPayments = parseFloat(loanTerm) * 12;

    if (isNaN(principal) || isNaN(annualRate) || isNaN(numberOfPayments)) {
      return;
    }

    const monthlyPayment =
      (principal * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments))) /
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

    const totalPayment = monthlyPayment * numberOfPayments;
    const totalInterest = totalPayment - principal;

    setResult({
      monthlyPayment: Math.round(monthlyPayment * 100) / 100,
      totalPayment: Math.round(totalPayment * 100) / 100,
      totalInterest: Math.round(totalInterest * 100) / 100,
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="loan-amount">Loan Amount (₹)</Label>
          <Input
            id="loan-amount"
            type="number"
            value={loanAmount}
            onChange={(e) => setLoanAmount(e.target.value)}
            className="bg-muted/50"
          />
        </div>

        <div>
          <Label htmlFor="interest-rate">Annual Interest Rate (%)</Label>
          <Input
            id="interest-rate"
            type="number"
            step="0.1"
            value={interestRate}
            onChange={(e) => setInterestRate(e.target.value)}
            className="bg-muted/50"
          />
        </div>

        <div>
          <Label htmlFor="loan-term">Loan Term (years)</Label>
          <Input
            id="loan-term"
            type="number"
            value={loanTerm}
            onChange={(e) => setLoanTerm(e.target.value)}
            className="bg-muted/50"
          />
        </div>

        <Button onClick={calculateLoan} className="w-full bg-gradient-primary hover:opacity-90">
          Calculate
        </Button>
      </div>

      {result && (
        <Card className="p-6 bg-gradient-card border-border/50">
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Monthly Payment</p>
              <p className="text-3xl font-bold text-primary">₹{result.monthlyPayment.toLocaleString()}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Total Payment</p>
                <p className="text-xl font-semibold text-foreground">
                  ₹{result.totalPayment.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Interest</p>
                <p className="text-xl font-semibold text-accent">₹{result.totalInterest.toLocaleString()}</p>
              </div>
            </div>
            <div className="pt-4 border-t border-border/50">
              <p className="text-xs text-muted-foreground">
                Loan Amount: ₹{parseFloat(loanAmount).toLocaleString()}
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default HomeLoanCalculator;
