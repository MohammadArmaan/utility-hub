import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import UnitConverter from "@/components/utilities/UnitConverter";
import { ArrowLeftRight } from "lucide-react";

const UnitConverterPage = () => {
  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <Card className="bg-gradient-card shadow-card border-border/50">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <ArrowLeftRight className="w-5 h-5 text-primary" />
              </div>
              <CardTitle className="text-2xl">Unit Converter</CardTitle>
            </div>
            <CardDescription>Convert between different units of measurement</CardDescription>
          </CardHeader>
          <CardContent>
            <UnitConverter />
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default UnitConverterPage;
