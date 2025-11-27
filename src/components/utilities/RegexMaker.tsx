import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import { Copy } from "lucide-react";
import { toast } from "sonner";

const presets = {
    email: {
        label: "Email Address",
        regex: "^[\\w.-]+@[\\w.-]+\\.[A-Za-z]{2,}$",
    },
    phone: {
        label: "Phone Number",
        regex: "^\\+?[0-9]{7,15}$",
    },
    password: {
        label: "Strong Password",
        regex: "^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$",
    },
    url: {
        label: "URL",
        regex: "^(https?:\\/\\/)?([\\w.-]+)\\.([\\w]{2,})([\\w\\-._~:/?#[\\]@!$&'()*+,;=]*)$",
    },
    pincode: {
        label: "Postal Code",
        regex: "^[0-9]{5,6}$",
    },
};

const RegexMaker = () => {
    const [regex, setRegex] = useState("");
    const [flags, setFlags] = useState({
        g: false,
        i: false,
        m: false,
        s: false,
    });
    const [testText, setTestText] = useState("");
    const [result, setResult] = useState<string | null>(null);

    useEffect(() => {
        runTest();
    }, [regex, flags, testText]);

    const applyPreset = (val: string) => {
        setRegex(presets[val].regex);
        toast.success(`${presets[val].label} Regex Loaded`);
    };

    const toggleFlag = (key: keyof typeof flags) => {
        setFlags({ ...flags, [key]: !flags[key] });
    };

    const buildFullRegex = () => {
        const activeFlags = Object.keys(flags)
            .filter((k) => flags[k as keyof typeof flags])
            .join("");

        return `/${regex}/${activeFlags}`;
    };

    const runTest = () => {
        if (!regex.trim()) {
            setResult(null);
            return;
        }

        try {
            const activeFlags = Object.keys(flags)
                .filter((f) => flags[f as keyof typeof flags])
                .join("");

            const pattern = new RegExp(regex, activeFlags);
            const isMatch = pattern.test(testText);

            setResult(isMatch ? "✔ Matches" : "✖ Does Not Match");
        } catch {
            setResult("⚠ Invalid Regex Pattern");
        }
    };

    const copyRegex = () => {
        navigator.clipboard.writeText(buildFullRegex());
        toast.success("Regex copied!");
    };

    return (
        <div className="space-y-6">
            {/* Presets */}
            <div>
                <Label>Preset Patterns</Label>
                <Select onValueChange={applyPreset}>
                    <SelectTrigger className="bg-muted/50 mt-1">
                        <SelectValue placeholder="Choose preset..." />
                    </SelectTrigger>
                    <SelectContent>
                        {Object.entries(presets).map(([key, item]) => (
                            <SelectItem key={key} value={key}>
                                {item.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* REGEX INPUT */}
            <div>
                <Label>Regular Expression</Label>
                <Input
                    placeholder="Enter regex (without slashes)"
                    value={regex}
                    onChange={(e) => setRegex(e.target.value)}
                    className="bg-muted/50"
                />
            </div>

            {/* FLAGS */}
            <div className="space-y-2">
                <Label>Flags</Label>
                <div className="flex gap-2">
                    {(["g", "i", "m", "s"] as const).map((f) => (
                        <Button
                            key={f}
                            variant={flags[f] ? "default" : "outline"}
                            onClick={() => toggleFlag(f)}
                        >
                            {f}
                        </Button>
                    ))}
                </div>
            </div>

            {/* Generated Regex */}
            <div className="relative">
                <Label>Generated Regex</Label>
                <Textarea
                    readOnly
                    value={buildFullRegex()}
                    className="bg-muted/50 min-h-[60px] font-mono"
                />
                <Button
                    size="sm"
                    variant="outline"
                    className="absolute top-8 right-3"
                    onClick={copyRegex}
                >
                    <Copy className="w-4 h-4 mr-1" />
                    Copy
                </Button>
            </div>

            {/* Tester */}
            <div>
                <Label>Test Against Text</Label>
                <Textarea
                    placeholder="Type text to test..."
                    value={testText}
                    onChange={(e) => setTestText(e.target.value)}
                    className="bg-muted/50 min-h-[100px]"
                />
            </div>

            {/* Result */}
            {result && (
                <p
                    className={`text-lg font-semibold ${
                        result.includes("✔")
                            ? "text-green-500"
                            : result.includes("✖")
                            ? "text-red-500"
                            : "text-yellow-400"
                    }`}
                >
                    {result}
                </p>
            )}
        </div>
    );
};

export default RegexMaker;
