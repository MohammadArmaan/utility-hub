import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Copy } from "lucide-react";
import { toast } from "sonner";

import SHA256 from "crypto-js/sha256";
import SHA1 from "crypto-js/sha1";
import SHA512 from "crypto-js/sha512";
import MD5 from "crypto-js/md5";
import RIPEMD160 from "crypto-js/ripemd160";
import { keccak256, keccak512 } from "js-sha3";

const hashAlgorithms = {
    sha256: "SHA-256",
    sha1: "SHA-1",
    sha512: "SHA-512",
    md5: "MD5",
    ripemd160: "RIPEMD-160",
    keccak256: "Keccak-256",
    keccak512: "Keccak-512",
};

const HashGenerator = () => {
    const [input, setInput] = useState("");
    const [algorithm, setAlgorithm] =
        useState<keyof typeof hashAlgorithms>("sha256");
    const [hash, setHash] = useState("");

    useEffect(() => {
        generateHash(input);
    }, [input, algorithm]);

    const generateHash = (value: string) => {
        if (!value) {
            setHash("");
            return;
        }

        let result = "";

        switch (algorithm) {
            case "sha256":
                result = SHA256(value).toString();
                break;
            case "sha1":
                result = SHA1(value).toString();
                break;
            case "sha512":
                result = SHA512(value).toString();
                break;
            case "md5":
                result = MD5(value).toString();
                break;
            case "ripemd160":
                result = RIPEMD160(value).toString();
                break;
            case "keccak256":
                result = keccak256(value);
                break;
            case "keccak512":
                result = keccak512(value);
                break;
        }

        setHash(result);
    };

    const copyHash = () => {
        navigator.clipboard.writeText(hash);
        toast.success("Hash copied!");
    };

    return (
        <div className="space-y-6">
            {/* Algorithm Select */}
            <div>
                <Label>Hash Algorithm</Label>
                <Select
                    value={algorithm}
                    onValueChange={(v: any) => setAlgorithm(v)}
                >
                    <SelectTrigger className="bg-muted/50 mt-1">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {Object.entries(hashAlgorithms).map(([key, label]) => (
                            <SelectItem key={key} value={key}>
                                {label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Input */}
            <div>
                <Label>Input Text</Label>
                <Textarea
                    className="min-h-[120px] bg-muted/50 mt-1"
                    placeholder="Enter text to hash..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />
            </div>

            {/* Hash Output */}
            {hash && (
                <div className="relative">
                    <Label>Hash Output</Label>
                    <Textarea
                        value={hash}
                        readOnly
                        className="min-h-[150px] bg-muted/50 mt-1 font-mono text-xs"
                    />

                    <Button
                        size="sm"
                        variant="outline"
                        className="absolute top-8 right-3"
                        onClick={copyHash}
                    >
                        <Copy className="w-4 h-4 mr-1" /> Copy
                    </Button>
                </div>
            )}
        </div>
    );
};

export default HashGenerator;
