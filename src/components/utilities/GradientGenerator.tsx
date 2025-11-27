import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Copy, Shuffle, Plus, Minus } from "lucide-react";

const clamp = (v: number, a = 0, b = 360) => Math.max(a, Math.min(b, v));
const randomHex = () =>
    `#${Math.floor(Math.random() * 0xffffff)
        .toString(16)
        .padStart(6, "0")}`;

const PRESETS = [
    {
        name: "Sunset",
        type: "linear",
        angle: 90,
        colors: ["#ff7e5f", "#feb47b"],
    },
    {
        name: "Ocean",
        type: "linear",
        angle: 135,
        colors: ["#2BC0E4", "#EAECC6"],
    },
    {
        name: "Aurora",
        type: "radial",
        angle: 0,
        colors: ["#00d2ff", "#3a7bd5", "#2b5876"],
    },
    {
        name: "Purple Bliss",
        type: "conic",
        angle: 0,
        colors: ["#a18cd1", "#fbc2eb"],
    },
];

const GradientGenerator: React.FC = () => {
    const [type, setType] = useState<"linear" | "radial" | "conic">("linear");
    const [angle, setAngle] = useState<number>(90);
    const [stops, setStops] = useState<string[]>(["#ff7e5f", "#feb47b"]);
    const [usePercentStops, setUsePercentStops] = useState(false);

    const addStop = () => {
        if (stops.length >= 6) return toast.error("Max 6 stops allowed");
        setStops([...stops, randomHex()]);
    };

    const removeStop = (idx: number) => {
        if (stops.length <= 2)
            return toast.error("At least 2 stops are required");
        setStops(stops.filter((_, i) => i !== idx));
    };

    const setStop = (idx: number, value: string) => {
        const next = [...stops];
        next[idx] = value;
        setStops(next);
    };

    const randomize = () => {
        setStops(stops.map(() => randomHex()));
        toast.success("Randomized colors!");
    };

    const applyPreset = (presetIdx: number) => {
        const p = PRESETS[presetIdx];
        setType(p.type as any);
        setAngle(p.angle);
        setStops(p.colors);
        toast.success(`${p.name} applied!`);
    };

    const cssGradient = useMemo(() => {
        const stopStr = stops
            .map((c, i) =>
                usePercentStops
                    ? `${c} ${Math.round((i / (stops.length - 1)) * 100)}%`
                    : c
            )
            .join(", ");

        if (type === "linear")
            return `linear-gradient(${angle}deg, ${stopStr})`;
        if (type === "conic")
            return `conic-gradient(from ${angle}deg, ${stopStr})`;

        return `radial-gradient(circle at center, ${stopStr})`;
    }, [stops, type, angle, usePercentStops]);

    const tailwindArbitrary = useMemo(() => {
        const g = cssGradient.replace(/\s+/g, " ");
        return `bg-[${g}]`;
    }, [cssGradient]);

    const copy = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            toast.success("Copied!");
        } catch {
            toast.error("Failed to copy");
        }
    };

    return (
        <div className="space-y-6">
            {/* Controls */}
            <div className="grid gap-4 md:grid-cols-2">
                <div>
                    <Label>Gradient Type</Label>
                    <div className="flex gap-2 mt-2 flex-wrap">
                        {(["linear", "radial", "conic"] as const).map((t) => (
                            <Button
                                key={t}
                                variant={type === t ? "default" : "outline"}
                                onClick={() => setType(t)}
                                className="capitalize flex-1 sm:flex-none"
                            >
                                {t}
                            </Button>
                        ))}
                    </div>
                </div>

                <div>
                    <Label>
                        {type === "radial"
                            ? "Radial (Preview Only)"
                            : "Angle (°)"}
                    </Label>

                    <div className="flex flex-col sm:flex-row gap-3 mt-2">
                        <Input
                            type="number"
                            min={0}
                            max={360}
                            value={Math.round(angle)}
                            onChange={(e) =>
                                setAngle(
                                    clamp(Number(e.target.value || 0), 0, 360)
                                )
                            }
                            className="w-full sm:w-24 bg-muted/50"
                        />

                        <input
                            type="range"
                            min={0}
                            max={360}
                            value={angle}
                            onChange={(e) => setAngle(Number(e.target.value))}
                            className="w-full"
                        />
                    </div>
                </div>
            </div>

            {/* Color Stops */}
            <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                    <Label>Color Stops</Label>

                    <div className="flex gap-2 flex-wrap">
                        <Button size="sm" variant="outline" onClick={randomize}>
                            <Shuffle className="w-4 h-4 mr-1" /> Random
                        </Button>

                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setStops([randomHex(), randomHex()])}
                        >
                            Reset
                        </Button>

                        <Button size="sm" variant="outline" onClick={addStop}>
                            <Plus className="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                <div className="grid gap-3">
                    {stops.map((c, i) => (
                        <div
                            key={i}
                            className="flex flex-col sm:flex-row gap-3 items-start sm:items-center"
                        >
                            <input
                                type="color"
                                value={c}
                                onChange={(e) => setStop(i, e.target.value)}
                                className="w-12 h-10 rounded cursor-pointer"
                            />

                            <Input
                                value={c}
                                onChange={(e) => setStop(i, e.target.value)}
                                className="flex-1 bg-muted/50"
                            />

                            <div className="flex gap-2">
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => copy(c)}
                                >
                                    <Copy className="w-4 h-4 mr-1" /> Copy
                                </Button>

                                <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => removeStop(i)}
                                >
                                    <Minus className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex gap-2 items-center mt-3">
                    <input
                        type="checkbox"
                        id="percentStops"
                        checked={usePercentStops}
                        onChange={() => setUsePercentStops((s) => !s)}
                    />
                    <Label
                        htmlFor="percentStops"
                        className="text-sm text-muted-foreground"
                    >
                        Use percent stops
                    </Label>
                </div>
            </div>

            {/* Presets */}
            <div className="flex gap-2 flex-wrap">
                {PRESETS.map((p, idx) => (
                    <Button
                        key={p.name}
                        onClick={() => applyPreset(idx)}
                        variant="outline"
                    >
                        {p.name}
                    </Button>
                ))}
            </div>

            {/* Preview */}
            <div>
                <Label>Preview</Label>
                <div className="w-full border border-border/40 rounded-xl overflow-hidden mt-2">
                    <div
                        className="w-full h-64 sm:h-80 md:h-96 flex items-center justify-center text-white text-lg"
                        style={{
                            background: cssGradient,
                            transition: "background 300ms ease",
                        }}
                    >
                        <div className="bg-black/40 px-3 py-1 rounded text-sm">
                            {type} • {stops.length} stops • {Math.round(angle)}°
                        </div>
                    </div>
                </div>
            </div>

            {/* Outputs */}
            <div className="space-y-4">
                <div>
                    <Label>CSS background</Label>
                    <Input
                        readOnly
                        value={`background: ${cssGradient};`}
                        className="bg-muted/50 mt-2"
                    />
                    <Button
                        className="mt-2 w-full"
                        onClick={() => copy(`background: ${cssGradient};`)}
                    >
                        <Copy className="w-4 h-4 mr-1" /> Copy CSS
                    </Button>
                </div>

                <div>
                    <Label>Tailwind arbitrary background</Label>
                    <Input
                        readOnly
                        value={tailwindArbitrary}
                        className="bg-muted/50 mt-2"
                    />
                    <Button
                        className="mt-2 w-full"
                        variant="outline"
                        onClick={() => copy(tailwindArbitrary)}
                    >
                        <Copy className="w-4 h-4 mr-1" /> Copy Tailwind
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default GradientGenerator;
