import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import FileCompressor from "@/components/utilities/FileCompressor";
import { FileArchive } from "lucide-react";

const FileCompressorPage = () => {
  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <Card className="bg-gradient-card shadow-card border-border/50">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <FileArchive className="w-5 h-5 text-primary" />
              </div>
              <CardTitle className="text-2xl">File Compressor</CardTitle>
            </div>
            <CardDescription>Compress images and reduce file sizes</CardDescription>
          </CardHeader>
          <CardContent>
            <FileCompressor />
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default FileCompressorPage;
