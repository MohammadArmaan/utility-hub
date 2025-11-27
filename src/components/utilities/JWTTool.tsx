// File: /components/utilities/JWTTool.tsx
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Copy } from "lucide-react";
import { toast } from "sonner";

/* Helpers: base64url encode/decode */
const base64UrlEncode = (buf: Uint8Array | string) => {
    let str: string;
    if (typeof buf === "string") {
        // string -> utf8 bytes -> base64url
        str = btoa(unescape(encodeURIComponent(buf)));
    } else {
        // bytes -> binary string -> btoa
        let binary = "";
        for (let i = 0; i < buf.byteLength; i++)
            binary += String.fromCharCode(buf[i]);
        str = btoa(binary);
    }
    return str.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
};

const base64UrlDecode = (input: string) => {
    // base64url -> base64
    const b64 =
        input.replace(/-/g, "+").replace(/_/g, "/") +
        (() => {
            const pad = input.length % 4;
            return pad === 2 ? "==" : pad === 3 ? "=" : pad === 0 ? "" : "";
        })();
    try {
        const binary = atob(b64);
        try {
            // try decode as utf8
            return decodeURIComponent(escape(binary));
        } catch {
            // fallback: return binary string
            return binary;
        }
    } catch {
        return null;
    }
};

const utf8ToArray = (str: string) => {
    return new TextEncoder().encode(str);
};

/* HMAC using Web Crypto */
const hmacSign = async (alg: string, keyStr: string, message: string) => {
    if (!keyStr) throw new Error("Secret is required for HMAC signing");
    if (!window.crypto || !window.crypto.subtle)
        throw new Error("Web Crypto not supported");

    const algoMap: Record<string, string> = {
        HS256: "SHA-256",
        HS384: "SHA-384",
        HS512: "SHA-512",
    };
    const hash = algoMap[alg];
    if (!hash) throw new Error("Unsupported algorithm for signing");

    const key = await crypto.subtle.importKey(
        "raw",
        utf8ToArray(keyStr),
        { name: "HMAC", hash: { name: hash } },
        false,
        ["sign", "verify"]
    );

    const sig = await crypto.subtle.sign("HMAC", key, utf8ToArray(message));
    return new Uint8Array(sig);
};

const hmacVerify = async (
    alg: string,
    keyStr: string,
    message: string,
    signatureBytes: Uint8Array
) => {
    if (!keyStr) throw new Error("Secret is required for verification");
    const algoMap: Record<string, string> = {
        HS256: "SHA-256",
        HS384: "SHA-384",
        HS512: "SHA-512",
    };
    const hash = algoMap[alg];
    if (!hash) throw new Error("Unsupported algorithm for verification");

    const key = await crypto.subtle.importKey(
        "raw",
        utf8ToArray(keyStr),
        { name: "HMAC", hash: { name: hash } },
        false,
        ["sign", "verify"]
    );

    const ok = await crypto.subtle.verify(
        "HMAC",
        key,
        signatureBytes,
        utf8ToArray(message)
    );
    return ok;
};

const prettyJSON = (str: string) => {
    try {
        const p = typeof str === "string" ? JSON.parse(str) : str;
        return JSON.stringify(p, null, 2);
    } catch {
        return str;
    }
};

const JWTTool = () => {
    const [headerText, setHeaderText] = useState(
        JSON.stringify({ alg: "HS256", typ: "JWT" }, null, 2)
    );
    const [payloadText, setPayloadText] = useState(
        JSON.stringify(
            {
                sub: "1234567890",
                name: "John Doe",
                iat: Math.floor(Date.now() / 1000),
            },
            null,
            2
        )
    );
    const [secret, setSecret] = useState("");
    const [alg, setAlg] = useState<"none" | "HS256" | "HS384" | "HS512">(
        "HS256"
    );
    const [token, setToken] = useState("");
    const [decoded, setDecoded] = useState<{
        header?: any;
        payload?: any;
        signature?: string;
        verified?: boolean | null;
    }>({});

    const buildToken = async () => {
        // prepare header/payload
        let headerObj;
        let payloadObj;
        try {
            headerObj = JSON.parse(headerText);
        } catch {
            toast.error("Invalid JSON in header");
            return;
        }
        try {
            payloadObj = JSON.parse(payloadText);
        } catch {
            toast.error("Invalid JSON in payload");
            return;
        }

        // ensure alg matches selected
        headerObj.alg = alg === "none" ? "none" : alg;
        headerObj.typ = headerObj.typ || "JWT";

        const encodedHeader = base64UrlEncode(JSON.stringify(headerObj));
        const encodedPayload = base64UrlEncode(JSON.stringify(payloadObj));
        const signingInput = `${encodedHeader}.${encodedPayload}`;

        try {
            let signature = "";
            if (alg === "none") {
                signature = "";
            } else {
                const sigBytes = await hmacSign(alg, secret, signingInput);
                signature = base64UrlEncode(sigBytes);
            }
            const final = `${signingInput}.${signature}`;
            setToken(final);
            toast.success("JWT generated");
            // set decoded view
            setDecoded({
                header: headerObj,
                payload: payloadObj,
                signature,
                verified:
                    alg === "none" ? null : await verifyToken(final, secret),
            });
        } catch (err: any) {
            toast.error(err?.message || "Failed to sign token");
        }
    };

    const verifyToken = async (tkn: string, key: string) => {
        const parts = tkn.split(".");
        if (parts.length !== 3) return false;
        const [eh, ep, es] = parts;
        const headerJson = base64UrlDecode(eh);
        if (!headerJson) return false;
        let headerObj;
        try {
            headerObj = JSON.parse(headerJson);
        } catch {
            return false;
        }
        const algFromToken = headerObj.alg || "none";
        if (algFromToken === "none") return null;
        if (!["HS256", "HS384", "HS512"].includes(algFromToken)) return null;

        // signature bytes
        let sigBytes: Uint8Array;
        try {
            // atob handling via base64UrlDecode -> returns string; convert to bytes
            const b64 =
                es.replace(/-/g, "+").replace(/_/g, "/") +
                (es.length % 4 === 2 ? "==" : es.length % 4 === 3 ? "=" : "");
            const binary = atob(b64);
            const arr = new Uint8Array(binary.length);
            for (let i = 0; i < binary.length; i++)
                arr[i] = binary.charCodeAt(i);
            sigBytes = arr;
        } catch {
            return false;
        }

        const signingInput = `${eh}.${ep}`;
        try {
            const ok = await hmacVerify(
                algFromToken,
                key,
                signingInput,
                sigBytes
            );
            return ok;
        } catch {
            return false;
        }
    };

    const decodeToken = async (tkn: string, autoVerifySecret?: string) => {
        setToken(tkn);
        const parts = tkn.split(".");
        if (parts.length < 2) {
            toast.error("Invalid token");
            setDecoded({});
            return;
        }
        const [eh, ep, es] = parts;
        const headerStr = base64UrlDecode(eh) ?? "";
        const payloadStr = base64UrlDecode(ep) ?? "";
        let headerObj: any = null;
        let payloadObj: any = null;
        try {
            headerObj = JSON.parse(headerStr);
        } catch {
            headerObj = headerStr;
        }
        try {
            payloadObj = JSON.parse(payloadStr);
        } catch {
            payloadObj = payloadStr;
        }

        let verification: boolean | null = null;
        if (
            headerObj &&
            headerObj.alg &&
            headerObj.alg !== "none" &&
            autoVerifySecret
        ) {
            try {
                verification = await verifyToken(tkn, autoVerifySecret);
            } catch {
                verification = false;
            }
        }

        setDecoded({
            header: headerObj,
            payload: payloadObj,
            signature: es ?? "",
            verified: verification,
        });
    };

    const handleDecodeFromInput = async () => {
        if (!token) return toast.error("Paste token first");
        await decodeToken(token, secret);
        toast.success("Token decoded");
    };

    const copyToClipboard = async (text?: string) => {
        try {
            await navigator.clipboard.writeText(text ?? token);
            toast.success("Copied");
        } catch {
            toast.error("Copy failed");
        }
    };

    const downloadToken = () => {
        if (!token) return toast.error("No token to download");
        const blob = new Blob([token], { type: "text/plain" });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = `jwt-${Date.now()}.txt`;
        a.click();
        URL.revokeObjectURL(a.href);
    };

    return (
        <div className="space-y-6 max-w-2xl">
            <div className="grid sm:grid-cols-2 gap-4">
                <div>
                    <Label>Algorithm</Label>
                    <Select value={alg} onValueChange={(v) => setAlg(v as any)}>
                        <SelectTrigger className="bg-muted/50">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="none">
                                none (unsigned)
                            </SelectItem>
                            <SelectItem value="HS256">
                                HS256 (HMAC SHA-256)
                            </SelectItem>
                            <SelectItem value="HS384">
                                HS384 (HMAC SHA-384)
                            </SelectItem>
                            <SelectItem value="HS512">
                                HS512 (HMAC SHA-512)
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div>
                    <Label>Secret (for HMAC verify/sign)</Label>
                    <Input
                        value={secret}
                        onChange={(e) => setSecret(e.target.value)}
                        placeholder="enter secret for HS algorithms"
                        className="bg-muted/50"
                    />
                </div>
            </div>

            <div>
                <Label>Header (JSON)</Label>
                <Textarea
                    value={headerText}
                    onChange={(e) => setHeaderText(e.target.value)}
                    className="min-h-[120px] bg-muted/50 font-mono"
                />
            </div>

            <div>
                <Label>Payload (JSON)</Label>
                <Textarea
                    value={payloadText}
                    onChange={(e) => setPayloadText(e.target.value)}
                    className="min-h-[160px] bg-muted/50 font-mono"
                />
            </div>

            <div className="flex gap-3">
                <Button
                    onClick={buildToken}
                    className="bg-gradient-primary flex-1"
                >
                    Generate JWT
                </Button>
                <Button
                    variant="outline"
                    onClick={() => {
                        setToken("");
                        setDecoded({});
                    }}
                >
                    Clear
                </Button>
            </div>

            {token && (
                <div className="space-y-2">
                    <Label>Token</Label>
                    <div className="bg-muted/50 p-3 rounded-md break-all">
                        <code className="text-sm">{token}</code>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            size="sm"
                            onClick={() => copyToClipboard()}
                            variant="outline"
                        >
                            <Copy className="w-4 h-4 mr-1" /> Copy Token
                        </Button>
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={downloadToken}
                        >
                            Download
                        </Button>
                    </div>
                </div>
            )}

            {/* Decode section */}
            <div className="pt-4 border-t border-border/30">
                <Label>Decode / Verify</Label>
                <Textarea
                    placeholder="Paste JWT here to decode"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    className="min-h-[120px] bg-muted/50 font-mono"
                />
                <div className="flex gap-2 mt-2">
                    <Button
                        onClick={handleDecodeFromInput}
                        className="bg-gradient-primary"
                    >
                        Decode & Verify
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => decodeToken(token)}
                    >
                        Decode Only
                    </Button>
                    <Button
                        variant="ghost"
                        onClick={() => {
                            setDecoded({});
                            setToken("");
                        }}
                    >
                        Reset
                    </Button>
                </div>
            </div>

            {/* Decoded output */}
            {decoded &&
                (decoded.header || decoded.payload || decoded.signature) && (
                    <div className="space-y-3 pt-3">
                        <div className="flex items-center justify-between">
                            <h4 className="font-medium">Header</h4>
                            <div className="flex gap-2">
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                        navigator.clipboard.writeText(
                                            prettyJSON(decoded.header)
                                        );
                                        toast.success("Copied header");
                                    }}
                                >
                                    Copy
                                </Button>
                            </div>
                        </div>
                        <Textarea
                            readOnly
                            value={prettyJSON(
                                decoded.header
                                    ? JSON.stringify(decoded.header)
                                    : ""
                            )}
                            className="min-h-[120px] bg-muted/50 font-mono"
                        />

                        <div className="flex items-center justify-between">
                            <h4 className="font-medium">Payload</h4>
                            <div className="flex gap-2">
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                        navigator.clipboard.writeText(
                                            prettyJSON(
                                                decoded.payload
                                                    ? JSON.stringify(
                                                          decoded.payload
                                                      )
                                                    : ""
                                            )
                                        );
                                        toast.success("Copied payload");
                                    }}
                                >
                                    Copy
                                </Button>
                            </div>
                        </div>
                        <Textarea
                            readOnly
                            value={prettyJSON(
                                decoded.payload
                                    ? JSON.stringify(decoded.payload)
                                    : ""
                            )}
                            className="min-h-[160px] bg-muted/50 font-mono"
                        />

                        <div className="flex items-center justify-between">
                            <h4 className="font-medium">Signature</h4>
                            <div className="flex gap-2 items-center">
                                <span className="text-sm text-muted-foreground break-all">
                                    {decoded.signature}
                                </span>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                        navigator.clipboard.writeText(
                                            decoded.signature ?? ""
                                        );
                                        toast.success("Copied signature");
                                    }}
                                >
                                    Copy
                                </Button>
                            </div>
                        </div>

                        <div>
                            <Label>Verification</Label>
                            <div>
                                {decoded.verified === null && (
                                    <div className="text-sm text-muted-foreground">
                                        No signature (alg=none)
                                    </div>
                                )}
                                {decoded.verified === true && (
                                    <div className="text-sm text-success">
                                        Signature valid ✅
                                    </div>
                                )}
                                {decoded.verified === false && (
                                    <div className="text-sm text-destructive">
                                        Signature invalid ❌
                                    </div>
                                )}
                                {decoded.verified === undefined && (
                                    <div className="text-sm text-muted-foreground">
                                        Verification not performed
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
        </div>
    );
};

export default JWTTool;
