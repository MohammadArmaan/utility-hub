import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { marked } from "marked";
import TurndownService from "turndown";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const turndownService = new TurndownService();

const MarkdownConverter = () => {
  const [markdown, setMarkdown] = useState("# Hello World\n\nThis is **bold**.");
  const [html, setHtml] = useState("");
  const [text, setText] = useState("");
  const [preview, setPreview] = useState("");

  /** Live Markdown Preview */
  useEffect(() => {
    const updatePreview = async () => {
      const converted = await marked(markdown);
      setPreview(converted);
    };
    updatePreview();
  }, [markdown]);

  /** Convert Markdown → HTML */
  const convertMarkdownToHTML = async () => {
    try {
      const converted = await marked(markdown);
      setHtml(converted);
      toast.success("Converted Markdown → HTML");
    } catch {
      toast.error("Conversion failed");
    }
  };

  /** Convert HTML → Markdown */
  const convertHTMLToMarkdown = () => {
    try {
      const converted = turndownService.turndown(html);
      setMarkdown(converted);
      toast.success("Converted HTML → Markdown");
    } catch {
      toast.error("Invalid HTML format");
    }
  };

  /** Convert TEXT → Markdown (simple but useful rules) */
  const convertTextToMarkdown = () => {
    if (!text.trim()) {
      toast.error("Enter some text");
      return;
    }

    const lines = text.split("\n");

    const converted = lines
      .map((line) => {
        if (line.startsWith("### ")) return line;
        if (line.startsWith("## ")) return line;
        if (line.startsWith("# ")) return line;

        if (line.trim() === "") return "";

        // Bullet points
        if (line.match(/^- |• /)) return `- ${line.replace(/^[-•] /, "")}`;

        // Paragraphs
        return `${line}`;
      })
      .join("\n");

    setMarkdown(converted);
    toast.success("Converted Text → Markdown");
  };

  return (
    <div className="space-y-6">
      {/* TABS */}
      <Tabs defaultValue="markdown" className="w-full">
        <TabsList className="grid grid-cols-3 bg-muted/50">
          <TabsTrigger value="markdown">Markdown</TabsTrigger>
          <TabsTrigger value="html">HTML</TabsTrigger>
          <TabsTrigger value="text">Text</TabsTrigger>
        </TabsList>

        {/* MARKDOWN TAB */}
        <TabsContent value="markdown">
          <div className="grid md:grid-cols-2 gap-4 mt-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Markdown Input</h3>
              <Textarea
                value={markdown}
                onChange={(e) => setMarkdown(e.target.value)}
                className="min-h-[280px] bg-muted/50 font-mono"
              />
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium">Preview</h3>
              <div
                className="prose prose-invert p-4 rounded-md bg-muted/50 min-h-[280px] max-w-none"
                dangerouslySetInnerHTML={{ __html: preview }}
              />
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <Button onClick={convertMarkdownToHTML} className="bg-gradient-primary hover:opacity-90">
              Convert to HTML
            </Button>

            <Button
              variant="outline"
              onClick={() => {
                navigator.clipboard.writeText(markdown);
                toast.success("Markdown copied!");
              }}
            >
              Copy Markdown
            </Button>
          </div>
        </TabsContent>

        {/* HTML TAB */}
        <TabsContent value="html">
          <div className="space-y-2 mt-4">
            <h3 className="text-sm font-medium">HTML Input</h3>
            <Textarea
              value={html}
              onChange={(e) => setHtml(e.target.value)}
              className="min-h-[280px] bg-muted/50 font-mono"
              placeholder="<p>Hello world</p>"
            />
          </div>

          <div className="flex gap-2 mt-4">
            <Button onClick={convertHTMLToMarkdown} className="bg-gradient-primary hover:opacity-90">
              Convert to Markdown
            </Button>

            <Button
              variant="outline"
              onClick={() => {
                navigator.clipboard.writeText(html);
                toast.success("HTML copied!");
              }}
            >
              Copy HTML
            </Button>
          </div>
        </TabsContent>

        {/* TEXT TAB */}
        <TabsContent value="text">
          <div className="space-y-2 mt-4">
            <h3 className="text-sm font-medium">Normal Text Input</h3>
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="min-h-[280px] bg-muted/50 font-mono"
              placeholder="Type your plain text here..."
            />
          </div>

          <div className="flex gap-2 mt-4">
            <Button onClick={convertTextToMarkdown} className="bg-gradient-primary hover:opacity-90">
              Convert to Markdown
            </Button>

            <Button
              variant="outline"
              onClick={() => {
                navigator.clipboard.writeText(text);
                toast.success("Text copied!");
              }}
            >
              Copy Text
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MarkdownConverter;
