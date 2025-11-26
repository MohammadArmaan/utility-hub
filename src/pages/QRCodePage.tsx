import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import QRCodeGenerator from "@/components/utilities/QRCodeGenerator";
import { QrCode } from "lucide-react";

const QRCodePage = () => {
  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <Card className="bg-gradient-card shadow-card border-border/50">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <QrCode className="w-5 h-5 text-primary" />
              </div>
              <CardTitle className="text-2xl">QR Code Generator</CardTitle>
            </div>
            <CardDescription>Create custom QR codes with your colors and design</CardDescription>
          </CardHeader>
          <CardContent>
            <QRCodeGenerator />
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default QRCodePage;
