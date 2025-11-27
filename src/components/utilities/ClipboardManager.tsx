import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
    Copy,
    Trash,
    Star,
    Download,
    Upload,
    Edit2,
    Check,
    X,
    Search,
} from "lucide-react";
import { toast } from "sonner";

type Clip = {
    id: string;
    text: string;
    pinned?: boolean;
    createdAt: number;
};

const STORAGE_KEY = "clipboardHistoryV1";
const DEFAULT_LIMIT = 20;

const uid = () =>
    `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;

const readStorage = (): Clip[] => {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return [];
        return JSON.parse(raw) as Clip[];
    } catch {
        return [];
    }
};

const writeStorage = (list: Clip[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
};

export default function ClipboardManager({
    limit = DEFAULT_LIMIT,
}: {
    limit?: number;
}) {
    const [list, setList] = useState<Clip[]>([]);
    const [query, setQuery] = useState("");
    const [selected, setSelected] = useState<Clip | null>(null);
    const [editingText, setEditingText] = useState("");
    const [autoCapture, setAutoCapture] = useState(false);

    useEffect(() => {
        setList(readStorage());
    }, []);

    useEffect(() => {
        writeStorage(list);
    }, [list]);

    // filtered & ordered: pinned first (in created order), then others (most recent first)
    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        const pinned = list.filter((c) => c.pinned);
        const others = list
            .filter((c) => !c.pinned)
            .sort((a, b) => b.createdAt - a.createdAt);
        const merged = [...pinned, ...others];
        return q
            ? merged.filter((c) => c.text.toLowerCase().includes(q))
            : merged;
    }, [list, query]);

    const pushClip = async (text: string, opts?: { pin?: boolean }) => {
        if (!text || !text.trim()) {
            toast.error("Empty clipboard content not saved");
            return;
        }
        // avoid duplicates (adjacent)
        const existingIndex = list.findIndex((c) => c.text === text);
        let newList = [...list];

        // If exact duplicate exists, move it to top (unless pinned)
        if (existingIndex !== -1) {
            const existing = newList.splice(existingIndex, 1)[0];
            existing.createdAt = Date.now();
            existing.pinned = opts?.pin ?? existing.pinned;
            newList = [existing, ...newList];
        } else {
            newList = [
                {
                    id: uid(),
                    text,
                    pinned: !!opts?.pin,
                    createdAt: Date.now(),
                },
                ...newList,
            ];
        }

        // Keep pinned items and trim the rest to limit
        const pinned = newList.filter((c) => c.pinned);
        const others = newList
            .filter((c) => !c.pinned)
            .slice(0, Math.max(0, limit - pinned.length));
        const finalList = [...pinned, ...others];
        setList(finalList);
        toast.success("Saved to clipboard history");
    };

    const captureClipboard = async () => {
        try {
            // Requires user gesture & permissions in some browsers
            const text = await navigator.clipboard.readText();
            if (!text) {
                toast.error("Clipboard is empty or cannot be read");
                return;
            }
            await pushClip(text);
        } catch (err) {
            toast.error("Failed to read clipboard. Browser permission needed.");
        }
    };

    // Optional auto-capture (polling approach) - only when enabled
    useEffect(() => {
        if (!autoCapture) return;
        let last = "";
        let mounted = true;

        const poll = async () => {
            try {
                const t = await navigator.clipboard.readText();
                if (!mounted) return;
                if (t && t !== last) {
                    last = t;
                    await pushClip(t);
                }
            } catch {
                // ignore permission errors
            }
        };

        const interval = setInterval(poll, 3000); // poll every 3s
        return () => {
            mounted = false;
            clearInterval(interval);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [autoCapture, list]);

    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            toast.success("Copied!");
        } catch {
            toast.error("Copy failed");
        }
    };

    const togglePin = (id: string) => {
        const next = list.map((c) =>
            c.id === id ? { ...c, pinned: !c.pinned } : c
        );
        // keep pinned on top order
        const pinned = next.filter((c) => c.pinned);
        const others = next
            .filter((c) => !c.pinned)
            .sort((a, b) => b.createdAt - a.createdAt);
        setList([...pinned, ...others]);
    };

    const removeItem = (id: string) => {
        const next = list.filter((c) => c.id !== id);
        setList(next);
        toast.success("Deleted");
    };

    const clearAll = (keepPinned = false) => {
        const next = keepPinned ? list.filter((c) => c.pinned) : [];
        setList(next);
        toast.success("History cleared");
    };

    const startEdit = (item: Clip) => {
        setSelected(item);
        setEditingText(item.text);
    };

    const saveEdit = () => {
        if (!selected) return;
        const next = list.map((c) =>
            c.id === selected.id ? { ...c, text: editingText } : c
        );
        setList(next);
        setSelected(null);
        setEditingText("");
        toast.success("Saved");
    };

    const exportJSON = () => {
        try {
            const blob = new Blob([JSON.stringify(list, null, 2)], {
                type: "application/json",
            });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `clipboard-history-${Date.now()}.json`;
            a.click();
            URL.revokeObjectURL(url);
        } catch {
            toast.error("Export failed");
        }
    };

    const importJSON = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        try {
            const txt = await file.text();
            const parsed = JSON.parse(txt) as Clip[];
            // basic validation
            if (!Array.isArray(parsed)) throw new Error("Invalid");
            // merge preserving pinned duplicates by text
            const merged = [...parsed, ...list];
            // dedupe by text (keep most recent)
            const map = new Map<string, Clip>();
            for (const item of merged) {
                map.set(item.text, item);
            }
            const result = Array.from(map.values())
                .sort((a, b) => b.createdAt - a.createdAt)
                .slice(0, limit);
            setList(result);
            toast.success("Imported successfully");
        } catch (err) {
            toast.error("Failed to import JSON");
        } finally {
            // reset input value so same file can be re-imported if needed
            (e.target as HTMLInputElement).value = "";
        }
    };

    return (
        <div className="space-y-6">
            {/* --- TOP CONTROLS --- */}
            <div className="space-y-4">
                {/* Search Row */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex flex-1 gap-2">
                        <Input
                            placeholder="Search clipboard..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="bg-muted/50"
                        />
                        <Button
                            onClick={() => setQuery("")}
                            variant="outline"
                            className="shrink-0"
                        >
                            <X className="w-4 h-4" />
                        </Button>
                    </div>

                    {/* Capture Button (mobile: full width) */}
                    <Button
                        onClick={captureClipboard}
                        className="bg-gradient-primary hover:opacity-90 w-full sm:w-auto"
                    >
                        <Copy className="w-4 h-4 mr-2" />
                        Capture
                    </Button>
                </div>

                {/* Import / Export / Clear */}
                <div className="flex flex-wrap gap-2">
                    <label htmlFor="import-json" className="cursor-pointer">
                        <input
                            id="import-json"
                            type="file"
                            accept="application/json"
                            onChange={importJSON}
                            className="hidden"
                        />
                        <Button variant="outline" className="w-full sm:w-auto">
                            <Upload className="w-4 h-4 mr-2" />
                            Import
                        </Button>
                    </label>

                    <Button
                        variant="outline"
                        onClick={exportJSON}
                        className="w-full sm:w-auto"
                    >
                        <Download className="w-4 h-4 mr-2" />
                        Export
                    </Button>

                    <Button
                        variant="destructive"
                        onClick={() => clearAll(false)}
                        className="w-full sm:w-auto"
                    >
                        <Trash className="w-4 h-4 mr-2" />
                        Clear
                    </Button>
                </div>

                {/* Auto-capture */}
                <div className="flex items-center gap-3 text-sm">
                    <input
                        id="autoCapture"
                        type="checkbox"
                        checked={autoCapture}
                        onChange={() => setAutoCapture((s) => !s)}
                    />
                    <Label htmlFor="autoCapture">Auto-capture clipboard</Label>
                </div>
            </div>

            {/* --- LIST --- */}
            <div className="grid gap-3">
                {filtered.length === 0 ? (
                    <Card className="p-4 bg-gradient-card border-border/50">
                        <p className="text-sm text-muted-foreground">
                            No clipboard items yet. Use Capture to save
                            clipboard text.
                        </p>
                    </Card>
                ) : (
                    filtered.map((item) => (
                        <Card
                            key={item.id}
                            className="p-3 bg-gradient-card border-border/50 flex flex-col gap-3"
                        >
                            <div className="flex flex-col sm:flex-row justify-between gap-3">
                                {/* Text Block */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between">
                                        <p className="text-sm font-medium text-foreground break-words">
                                            {item.text}
                                        </p>
                                        {item.pinned && (
                                            <Star className="w-4 h-4 text-primary shrink-0 ml-2" />
                                        )}
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {new Date(
                                            item.createdAt
                                        ).toLocaleString()}
                                    </p>
                                </div>

                                {/* Actions */}
                                <div className="flex flex-wrap sm:flex-nowrap gap-2 justify-end">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() =>
                                            copyToClipboard(item.text)
                                        }
                                    >
                                        <Copy className="w-4 h-4 mr-1" /> Copy
                                    </Button>

                                    <Button
                                        size="sm"
                                        variant={
                                            item.pinned ? "default" : "outline"
                                        }
                                        onClick={() => togglePin(item.id)}
                                    >
                                        <Star className="w-4 h-4" />
                                    </Button>

                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => startEdit(item)}
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </Button>

                                    <Button
                                        size="sm"
                                        variant="destructive"
                                        onClick={() => removeItem(item.id)}
                                    >
                                        <Trash className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>

                            <Textarea
                                readOnly
                                value={item.text}
                                className="min-h-[80px] bg-muted/30 text-sm"
                            />
                        </Card>
                    ))
                )}
            </div>

            {/* --- EDIT MODAL (Responsive) --- */}
            {selected && (
                <div
                    className="
        fixed left-0 right-0 bottom-0 
        sm:left-auto sm:right-8 sm:bottom-auto sm:top-24 
        z-50 p-4
      "
                >
                    <Card className="p-4 bg-gradient-card border-border/50 shadow-xl max-w-lg mx-auto w-full">
                        <div className="space-y-3">
                            <Label>Edit clipboard item</Label>
                            <Textarea
                                value={editingText}
                                onChange={(e) => setEditingText(e.target.value)}
                                className="min-h-[120px]"
                            />

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                <Button
                                    onClick={saveEdit}
                                    className="bg-gradient-primary w-full"
                                >
                                    Save
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => setSelected(null)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant="destructive"
                                    onClick={() => {
                                        removeItem(selected.id);
                                        setSelected(null);
                                    }}
                                >
                                    Delete
                                </Button>
                            </div>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
}
