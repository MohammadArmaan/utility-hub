import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const JSONFormatter = () => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const formatJSON = () => {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, 2));
      toast.success("JSON formatted successfully!");
    } catch (error) {
      toast.error("Invalid JSON format");
    }
  };

  const minifyJSON = () => {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
      toast.success("JSON minified successfully!");
    } catch (error) {
      toast.error("Invalid JSON format");
    }
  };

  const validateJSON = () => {
    try {
      JSON.parse(input);
      toast.success("Valid JSON!");
    } catch (error) {
      toast.error("Invalid JSON format");
    }
  };

  /** Convert JSON to CSV */
  const downloadCSV = () => {
    try {
      const json = JSON.parse(input);

      const array = Array.isArray(json) ? json : [json];

      if (array.length === 0) {
        toast.error("JSON is empty. Cannot convert.");
        return;
      }

      const keys = Object.keys(array[0]);

      const csvRows = [
        keys.join(","), // header row
        ...array.map((obj) =>
          keys
            .map((key) => {
              const value = obj[key];
              if (typeof value === "string") {
                return `"${value.replace(/"/g, '""')}"`; // escape quotes
              }
              return value;
            })
            .join(",")
        ),
      ];

      const csvContent = csvRows.join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "data.csv";
      a.click();

      toast.success("CSV downloaded!");
    } catch (error) {
      toast.error("Invalid JSON format");
    }
  };

  return (
    <div className="space-y-4">
      <Textarea
        placeholder="Paste your JSON here..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="min-h-[200px] bg-muted/50 font-mono"
      />

      <div className="flex gap-2 flex-wrap">
        <Button onClick={formatJSON} className="bg-gradient-primary hover:opacity-90">
          Format
        </Button>

        <Button onClick={minifyJSON} variant="outline">
          Minify
        </Button>

        <Button onClick={validateJSON} variant="outline">
          Validate
        </Button>

        <Button onClick={downloadCSV} variant="outline">
          Download CSV
        </Button>
      </div>

      {output && (
        <div className="relative">
          <Textarea
            value={output}
            readOnly
            className="min-h-[200px] bg-muted/50 font-mono"
          />

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
    </div>
  );
};

export default JSONFormatter;
