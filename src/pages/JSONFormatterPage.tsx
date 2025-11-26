import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import JSONFormatter from "@/components/utilities/JSONFormatter";
import { Code } from "lucide-react";

const JSONFormatterPage = () => {
  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <Card className="bg-gradient-card shadow-card border-border/50">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <Code className="w-5 h-5 text-primary" />
              </div>
              <CardTitle className="text-2xl">JSON Formatter</CardTitle>
            </div>
            <CardDescription>Format, minify, and validate JSON data</CardDescription>
          </CardHeader>
          <CardContent>
            <JSONFormatter />
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default JSONFormatterPage;
