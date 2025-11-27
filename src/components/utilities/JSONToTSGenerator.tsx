import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Copy } from "lucide-react";

const JSONToTSGenerator = () => {
    const [jsonInput, setJsonInput] = useState("");
    const [tsOutput, setTsOutput] = useState("");
    const [objectOutput, setObjectOutput] = useState("");

    const generateTS = () => {
        try {
            const parsed = JSON.parse(jsonInput);
            const interfaceStr = convertToTSInterface(parsed, "Root");
            const objectStr = JSON.stringify(parsed, null, 2);

            setTsOutput(interfaceStr);
            setObjectOutput(objectStr);

            toast.success("TypeScript interface generated!");
        } catch {
            toast.error("Invalid JSON format");
        }
    };

    const convertToTSInterface = (obj: any, name: string): string => {
        if (typeof obj !== "object" || obj === null) {
            return `type ${name} = ${typeof obj};`;
        }

        const entries = Object.entries(obj)
            .map(([key, value]) => {
                if (Array.isArray(value)) {
                    if (value.length === 0) return `${key}: any[];`;
                    const childType =
                        typeof value[0] === "object"
                            ? convertToTSInterface(value[0], capitalize(key))
                            : typeof value[0];
                    return `${key}: ${childType
                        .replace(/interface .+\{/, "")
                        .replace("}", "")}[];`;
                }

                if (typeof value === "object") {
                    return `${key}: {\n${objectToTS(value)}\n};`;
                }

                return `${key}: ${typeof value};`;
            })
            .join("\n");

        return `interface ${name} {\n${entries}\n}`;
    };

    const objectToTS = (obj: any) => {
        return Object.entries(obj)
            .map(([k, v]) => `${k}: ${typeof v};`)
            .join("\n");
    };

    const capitalize = (text: string) =>
        text.charAt(0).toUpperCase() + text.slice(1);

    return (
        <div className="space-y-6">
            {/* Input */}
            <Textarea
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                placeholder="Paste JSON here..."
                className="min-h-[200px] bg-muted/50 font-mono"
            />

            <Button
                className="bg-gradient-primary hover:opacity-90"
                onClick={generateTS}
            >
                Convert to TypeScript
            </Button>

            {/* Output: Interface */}
            {tsOutput && (
                <div className="relative">
                    <h3 className="font-medium mb-2">TypeScript Interface</h3>
                    <Textarea
                        value={tsOutput}
                        readOnly
                        className="min-h-[200px] bg-muted/50 font-mono"
                    />
                    <Button
                        size="sm"
                        variant="outline"
                        className="absolute top-2 right-2"
                        onClick={() => {
                            navigator.clipboard.writeText(tsOutput);
                            toast.success("Copied!");
                        }}
                    >
                        <Copy className="w-4 h-4" />
                    </Button>
                </div>
            )}

            {/* Output: Object */}
            {objectOutput && (
                <div className="relative">
                    <h3 className="font-medium mb-2">Formatted Object</h3>
                    <Textarea
                        value={objectOutput}
                        readOnly
                        className="min-h-[200px] bg-muted/50 font-mono"
                    />
                    <Button
                        size="sm"
                        variant="outline"
                        className="absolute top-2 right-2"
                        onClick={() => {
                            navigator.clipboard.writeText(objectOutput);
                            toast.success("Copied!");
                        }}
                    >
                        <Copy className="w-4 h-4" />
                    </Button>
                </div>
            )}
        </div>
    );
};

export default JSONToTSGenerator;
