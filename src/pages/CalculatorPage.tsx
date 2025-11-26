import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Calculator from "@/components/utilities/Calculator";
import { Calculator as CalculatorIcon } from "lucide-react";

const CalculatorPage = () => {
  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <Card className="bg-gradient-card shadow-card border-border/50">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <CalculatorIcon className="w-5 h-5 text-primary" />
              </div>
              <CardTitle className="text-2xl">Calculator</CardTitle>
            </div>
            <CardDescription>Perform basic arithmetic calculations</CardDescription>
          </CardHeader>
          <CardContent>
            <Calculator />
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default CalculatorPage;
