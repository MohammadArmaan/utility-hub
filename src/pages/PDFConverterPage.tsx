import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import PDFConverter from "@/components/utilities/PDFConverter";
import { FileDown } from "lucide-react";

const PDFConverterPage = () => {
  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <Card className="bg-gradient-card shadow-card border-border/50">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <FileDown className="w-5 h-5 text-primary" />
              </div>
              <CardTitle className="text-2xl">PDF Converter</CardTitle>
            </div>
            <CardDescription>Convert text and images to PDF format instantly</CardDescription>
          </CardHeader>
          <CardContent>
            <PDFConverter />
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default PDFConverterPage;
