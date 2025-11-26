import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import CompoundInterestCalculator from "@/components/utilities/CompoundInterestCalculator";
import { TrendingUp } from "lucide-react";

const CompoundInterestPage = () => {
  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <Card className="bg-gradient-card shadow-card border-border/50">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <CardTitle className="text-2xl">Compound Interest Calculator</CardTitle>
            </div>
            <CardDescription>Calculate your investment growth with compound interest</CardDescription>
          </CardHeader>
          <CardContent>
            <CompoundInterestCalculator />
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default CompoundInterestPage;
