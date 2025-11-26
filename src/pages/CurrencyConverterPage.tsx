import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import CurrencyConverter from "@/components/utilities/CurrencyConverter";
import { DollarSign } from "lucide-react";

const CurrencyConverterPage = () => {
  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <Card className="bg-gradient-card shadow-card border-border/50">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <DollarSign className="w-5 h-5 text-primary" />
              </div>
              <CardTitle className="text-2xl">Currency Converter</CardTitle>
            </div>
            <CardDescription>Convert between different currencies with live rates</CardDescription>
          </CardHeader>
          <CardContent>
            <CurrencyConverter />
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default CurrencyConverterPage;
