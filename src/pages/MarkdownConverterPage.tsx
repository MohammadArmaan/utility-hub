import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import MarkdownConverter from "@/components/utilities/MarkdownConverter";
import { FileText } from "lucide-react";

const MarkdownConverterPage = () => {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <Card className="bg-gradient-card shadow-card border-border/50">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <CardTitle className="text-2xl">Markdown Converter</CardTitle>
            </div>
            <CardDescription>Convert Markdown to HTML with live preview</CardDescription>
          </CardHeader>
          <CardContent>
            <MarkdownConverter />
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default MarkdownConverterPage;
