import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import HomeLoanCalculator from "@/components/utilities/HomeLoanCalculator";
import { Home } from "lucide-react";

const HomeLoanPage = () => {
  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <Card className="bg-gradient-card shadow-card border-border/50">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <Home className="w-5 h-5 text-primary" />
              </div>
              <CardTitle className="text-2xl">Home Loan Calculator</CardTitle>
            </div>
            <CardDescription>Calculate your monthly mortgage payments</CardDescription>
          </CardHeader>
          <CardContent>
            <HomeLoanCalculator />
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default HomeLoanPage;
