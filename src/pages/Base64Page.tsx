import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Base64EncoderDecoder from "@/components/utilities/Base64EncoderDecoder";
import { Binary } from "lucide-react";

const Base64Page = () => {
  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <Card className="bg-gradient-card shadow-card border-border/50">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <Binary className="w-5 h-5 text-primary" />
              </div>
              <CardTitle className="text-2xl">Base64 Encoder/Decoder</CardTitle>
            </div>
            <CardDescription>Encode and decode Base64 data</CardDescription>
          </CardHeader>
          <CardContent>
            <Base64EncoderDecoder />
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Base64Page;
