import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ZipConverter from "@/components/utilities/ZipConverter";
import { Archive } from "lucide-react";

const ZipConverterPage = () => {
  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <Card className="bg-gradient-card shadow-card border-border/50">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <Archive className="w-5 h-5 text-primary" />
              </div>
              <CardTitle className="text-2xl">ZIP Converter</CardTitle>
            </div>
            <CardDescription>Create and extract ZIP archives</CardDescription>
          </CardHeader>
          <CardContent>
            <ZipConverter />
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default ZipConverterPage;
