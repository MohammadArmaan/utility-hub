import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

const Base64EncoderDecoder = () => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const encode = () => {
    try {
      const encoded = btoa(input);
      setOutput(encoded);
      toast.success("Encoded successfully!");
    } catch (error) {
      toast.error("Encoding failed");
    }
  };

  const decode = () => {
    try {
      const decoded = atob(input);
      setOutput(decoded);
      toast.success("Decoded successfully!");
    } catch (error) {
      toast.error("Decoding failed - invalid Base64");
    }
  };

  return (
    <Tabs defaultValue="encode" className="w-full">
      <TabsList className="grid w-full grid-cols-2 bg-muted/50">
        <TabsTrigger value="encode">Encode</TabsTrigger>
        <TabsTrigger value="decode">Decode</TabsTrigger>
      </TabsList>

      <TabsContent value="encode" className="space-y-4">
        <Textarea
          placeholder="Enter text to encode..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="min-h-[200px] bg-muted/50"
        />
        <Button onClick={encode} className="w-full bg-gradient-primary hover:opacity-90">
          Encode to Base64
        </Button>
        {output && (
          <div className="relative">
            <Textarea value={output} readOnly className="min-h-[200px] bg-muted/50 font-mono" />
            <Button
              onClick={() => {
                navigator.clipboard.writeText(output);
                toast.success("Copied to clipboard!");
              }}
              variant="outline"
              className="absolute top-2 right-2"
              size="sm"
            >
              Copy
            </Button>
          </div>
        )}
      </TabsContent>

      <TabsContent value="decode" className="space-y-4">
        <Textarea
          placeholder="Enter Base64 to decode..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="min-h-[200px] bg-muted/50 font-mono"
        />
        <Button onClick={decode} className="w-full bg-gradient-primary hover:opacity-90">
          Decode from Base64
        </Button>
        {output && (
          <div className="relative">
            <Textarea value={output} readOnly className="min-h-[200px] bg-muted/50" />
            <Button
              onClick={() => {
                navigator.clipboard.writeText(output);
                toast.success("Copied to clipboard!");
              }}
              variant="outline"
              className="absolute top-2 right-2"
              size="sm"
            >
              Copy
            </Button>
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
};

export default Base64EncoderDecoder;
