import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import PasswordGenerator from "@/components/utilities/PasswordGenerator";
import { Lock } from "lucide-react";

const PasswordGeneratorPage = () => {
  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <Card className="bg-gradient-card shadow-card border-border/50">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <Lock className="w-5 h-5 text-primary" />
              </div>
              <CardTitle className="text-2xl">Password Generator</CardTitle>
            </div>
            <CardDescription>Create strong, secure passwords instantly</CardDescription>
          </CardHeader>
          <CardContent>
            <PasswordGenerator />
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default PasswordGeneratorPage;
