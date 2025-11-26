import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import TextToSpeech from "@/components/utilities/TextToSpeech";
import { Volume2 } from "lucide-react";

const TextToSpeechPage = () => {
  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <Card className="bg-gradient-card shadow-card border-border/50">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <Volume2 className="w-5 h-5 text-primary" />
              </div>
              <CardTitle className="text-2xl">Text to Speech & Speech to Text</CardTitle>
            </div>
            <CardDescription>Convert between text and speech</CardDescription>
          </CardHeader>
          <CardContent>
            <TextToSpeech />
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default TextToSpeechPage;
