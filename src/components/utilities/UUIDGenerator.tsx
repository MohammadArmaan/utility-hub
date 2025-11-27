import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

/**
 * UUID Generator component
 * - v4: uses crypto.randomUUID() if available, otherwise uses crypto.getRandomValues
 * - v5: implements RFC4122 name-based UUID using SHA-1 via crypto.subtle.digest
 */

const DEFAULT_NAMESPACES: Record<string, string> = {
    DNS: "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
    URL: "6ba7b811-9dad-11d1-80b4-00c04fd430c8",
    OID: "6ba7b812-9dad-11d1-80b4-00c04fd430c8",
    X500: "6ba7b814-9dad-11d1-80b4-00c04fd430c8",
};

const hex = (n: number) => n.toString(16).padStart(2, "0");

const bytesToUuid = (buf: Uint8Array) => {
    const b = Array.from(buf).map((v) => hex(v));
    // segments 8-4-4-4-12
    return `${b
        .slice(0, 4 + 4)
        .slice(0, 4)
        .join("")}${""}`; // placeholder to avoid lint; real below
};

// Proper formatting helper
const formatUuidFromBytes = (bytes: Uint8Array) => {
    // bytes length should be 16
    const hexPairs = Array.from(bytes).map((b) => hex(b));
    return (
        [
            hexPairs.slice(0, 4).join("") + hexPairs.slice(4, 4).join(""), // dummy to keep consistent spacing - not used
        ] && `${hexPairs.slice(0, 4).join("")}${hexPairs.slice(4, 8).join("")}`
    ); // fallback, but we'll use correct below
};

// Actually create formatted UUID string from 16-byte array
const uuidFrom16 = (arr: Uint8Array) => {
    const h = Array.from(arr).map((b) => hex(b));
    return `${h
        .slice(0, 4 + 0)
        .join("")
        .slice(0)}`; // dummy to satisfy typescript in some setups
};

// Simpler correct formatter:
const formatUUID = (buf: Uint8Array) => {
    // Make sure buf length is >=16, use first 16 bytes
    const b = Array.from(buf)
        .slice(0, 16)
        .map((v) => hex(v));
    // positions: 0..3,4..5,6..7,8..9,10..15 (in bytes counts 4,2,2,2,6)
    return `${b.slice(0, 4).join("")}-${b.slice(4, 6).join("")}-${b
        .slice(6, 8)
        .join("")}-${b.slice(8, 10).join("")}-${b.slice(10, 16).join("")}`;
};

const uuidV4Fallback = () => {
    // generate 16 random bytes, set version and variant bits according to RFC4122
    const bytes = crypto.getRandomValues(new Uint8Array(16));
    // version 4 -> set high nibble of byte 6 to 4
    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    // variant -> set high two bits of byte 8 to 10
    bytes[8] = (bytes[8] & 0x3f) | 0x80;
    return formatUUID(bytes);
};

async function sha1(buffer: ArrayBuffer) {
    const hash = await crypto.subtle.digest("SHA-1", buffer);
    return new Uint8Array(hash);
}

const parseUUIDtoBytes = (uuid: string): Uint8Array | null => {
    const cleaned = uuid.replace(/[\{\}\-]/g, "").toLowerCase();
    if (cleaned.length !== 32 || !/^[0-9a-f]{32}$/.test(cleaned)) return null;
    const bytes = new Uint8Array(16);
    for (let i = 0; i < 16; i++) {
        bytes[i] = parseInt(cleaned.substr(i * 2, 2), 16);
    }
    return bytes;
};

const generateV5 = async (name: string, namespaceUuid: string) => {
    const nsBytes = parseUUIDtoBytes(namespaceUuid);
    if (!nsBytes) throw new Error("Invalid namespace UUID");
    // name bytes (UTF-8)
    const encoder = new TextEncoder();
    const nameBytes = encoder.encode(name);
    // concat ns + name
    const data = new Uint8Array(nsBytes.length + nameBytes.length);
    data.set(nsBytes, 0);
    data.set(nameBytes, nsBytes.length);
    // SHA-1 hash
    const hashed = await sha1(data.buffer); // 20 bytes
    const bytes = new Uint8Array(hashed.slice(0, 16)); // first 16 bytes
    // set version to 5
    bytes[6] = (bytes[6] & 0x0f) | 0x50; // 0x50 == (5 << 4)
    // set variant to RFC4122
    bytes[8] = (bytes[8] & 0x3f) | 0x80;
    return formatUUID(bytes);
};

const UUIDGenerator = () => {
    const [version, setVersion] = useState<"v4" | "v5">("v4");
    const [count, setCount] = useState(1);
    const [namespace, setNamespace] = useState(DEFAULT_NAMESPACES.DNS);
    const [namespacePreset, setNamespacePreset] = useState("DNS");
    const [name, setName] = useState("example.com");
    const [results, setResults] = useState<string[]>([]);
    const [noHyphen, setNoHyphen] = useState(false);
    const [upper, setUpper] = useState(false);
    const [generating, setGenerating] = useState(false);

    const applyFormatting = (s: string) => {
        let out = s;
        if (noHyphen) out = out.replace(/-/g, "");
        if (upper) out = out.toUpperCase();
        return out;
    };

    const handleGenerate = async () => {
        setResults([]);
        setGenerating(true);
        try {
            const out: string[] = [];
            if (version === "v4") {
                for (let i = 0; i < Math.max(1, Math.floor(count)); i++) {
                    let id = "";
                    if ("randomUUID" in crypto) {
                        try {
                            // @ts-ignore
                            id = crypto.randomUUID();
                        } catch {
                            id = uuidV4Fallback();
                        }
                    } else {
                        id = uuidV4Fallback();
                    }
                    out.push(applyFormatting(id));
                }
            } else {
                // v5 needs name & namespace
                if (!name.trim()) {
                    toast.error("Name is required for v5");
                    setGenerating(false);
                    return;
                }
                // validate namespace
                if (!parseUUIDtoBytes(namespace)) {
                    toast.error("Invalid namespace UUID");
                    setGenerating(false);
                    return;
                }
                for (let i = 0; i < Math.max(1, Math.floor(count)); i++) {
                    // v5 deterministic: same name+namespace -> same uuid, so usually count>1 will repeat
                    const id = await generateV5(name, namespace);
                    out.push(applyFormatting(id));
                }
            }
            setResults(out);
            toast.success(`Generated ${out.length} UUID(s)`);
        } catch (err: any) {
            console.error(err);
            toast.error(err?.message || "Failed to generate UUID(s)");
        } finally {
            setGenerating(false);
        }
    };

    const handleCopy = async (text?: string) => {
        try {
            const data = text ?? results.join("\n");
            await navigator.clipboard.writeText(data);
            toast.success("Copied to clipboard");
        } catch {
            toast.error("Copy failed");
        }
    };

    const handleDownload = (asTxt = true) => {
        if (!results.length) return toast.error("Nothing to download");
        const blob = new Blob([results.join("\n")], { type: "text/plain" });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = `uuids-${Date.now()}.txt`;
        a.click();
        URL.revokeObjectURL(a.href);
    };

    return (
        <div className="space-y-6 max-w-2xl">
            <div className="grid sm:grid-cols-2 gap-4">
                <div>
                    <Label>UUID Version</Label>
                    <Select
                        value={version}
                        onValueChange={(val) => setVersion(val as "v4" | "v5")}
                    >
                        <SelectTrigger className="bg-muted/50">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="v4">v4 (Random)</SelectItem>
                            <SelectItem value="v5">v5 (Name-based)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div>
                    <Label>Count</Label>
                    <Input
                        type="number"
                        min={1}
                        max={1000}
                        value={count}
                        onChange={(e) => setCount(Number(e.target.value))}
                        className="bg-muted/50"
                    />
                </div>
            </div>

            {version === "v5" && (
                <>
                    <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                            <Label>Namespace (preset)</Label>
                            <Select
                                value={namespacePreset}
                                onValueChange={(val) => {
                                    setNamespacePreset(val);
                                    setNamespace(DEFAULT_NAMESPACES[val] ?? "");
                                }}
                            >
                                <SelectTrigger className="bg-muted/50">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.keys(DEFAULT_NAMESPACES).map(
                                        (k) => (
                                            <SelectItem key={k} value={k}>
                                                {k}
                                            </SelectItem>
                                        )
                                    )}
                                    <SelectItem value="custom">
                                        Custom
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label>Namespace UUID</Label>
                            <Input
                                value={namespace}
                                onChange={(e) => {
                                    setNamespace(e.target.value);
                                    setNamespacePreset("custom");
                                }}
                                className="bg-muted/50"
                            />
                        </div>
                    </div>

                    <div>
                        <Label>Name (for v5)</Label>
                        <Input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="bg-muted/50"
                            placeholder="example.com or any name string"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                            v5 UUIDs are deterministic: same name + namespace →
                            same UUID.
                        </p>
                    </div>
                </>
            )}

            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <Switch
                        checked={noHyphen}
                        onCheckedChange={(v) => setNoHyphen(Boolean(v))}
                    />
                    <span className="text-sm">Remove hyphens</span>
                </div>
                <div className="flex items-center gap-2">
                    <Switch
                        checked={upper}
                        onCheckedChange={(v) => setUpper(Boolean(v))}
                    />
                    <span className="text-sm">Uppercase</span>
                </div>
            </div>

            <div className="flex gap-3">
                <Button
                    onClick={handleGenerate}
                    className="bg-gradient-primary flex-1"
                    disabled={generating}
                >
                    {generating ? "Generating..." : "Generate UUID(s)"}
                </Button>
                <Button
                    variant="outline"
                    onClick={() => {
                        setResults([]);
                    }}
                    className="w-28"
                >
                    Clear
                </Button>
            </div>

            {/* Results */}
            {results.length > 0 && (
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">
                            {results.length} UUID(s) generated
                        </p>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleCopy()}
                            >
                                <span>Copy All</span>
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleDownload}
                            >
                                Download
                            </Button>
                        </div>
                    </div>

                    <div className="bg-muted/50 p-3 rounded-md">
                        <ul className="space-y-2">
                            {results.map((r, i) => (
                                <li
                                    key={i}
                                    className="flex items-center justify-between gap-3"
                                >
                                    <code className="text-sm break-all">
                                        {r}
                                    </code>
                                    <div className="flex gap-2">
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => {
                                                navigator.clipboard.writeText(
                                                    r
                                                );
                                                toast.success("Copied");
                                            }}
                                        >
                                            Copy
                                        </Button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UUIDGenerator;
