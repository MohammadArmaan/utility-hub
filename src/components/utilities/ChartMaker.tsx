import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

type ChartType = "bar" | "line" | "pie" | "doughnut" | "histogram";

const CHART_JS_CDN = "https://cdn.jsdelivr.net/npm/chart.js";

const ChartMaker = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const chartRef = useRef<any>(null);
    const [chartLoaded, setChartLoaded] = useState(false);

    const [chartType, setChartType] = useState<ChartType>("bar");
    const [labelsText, setLabelsText] = useState("Jan, Feb, Mar, Apr, May");
    const [valuesText, setValuesText] = useState("12, 19, 3, 5, 2");
    const [datasetLabel, setDatasetLabel] = useState("Sales Report");
    const [bgColor, setBgColor] = useState("#4f46e5");
    const [borderColor, setBorderColor] = useState("#4f46e5");

    // Load Chart.js via CDN
    useEffect(() => {
        if ((window as any).Chart) {
            setChartLoaded(true);
            return;
        }
        const script = document.createElement("script");
        script.src = CHART_JS_CDN;
        script.onload = () => setChartLoaded(true);
        script.onerror = () => toast.error("Failed to load Chart.js CDN");
        document.head.appendChild(script);
    }, []);

    const parseLabels = (txt: string) =>
        txt
            .split(",")
            .map((x) => x.trim())
            .filter(Boolean);

    const parseValues = (txt: string) =>
        txt
            .split(",")
            .map((x) => Number(x.trim()))
            .filter((n) => !isNaN(n));

    const generateColors = (count: number) =>
        Array.from({ length: count }).map(
            (_, i) => `hsl(${(i * 40) % 360} 80% 60%)`
        );

    const createHistogram = (values: number[]) => {
        const bins = 8;
        const min = Math.min(...values);
        const max = Math.max(...values);
        const step = (max - min) / bins;

        const labels = [];
        const counts = new Array(bins).fill(0);

        for (let i = 0; i < bins; i++) {
            const start = min + i * step;
            const end = start + step;
            labels.push(`${start.toFixed(1)} – ${end.toFixed(1)}`);
        }
        values.forEach((v) => {
            let idx = Math.floor((v - min) / step);
            if (idx >= bins) idx = bins - 1;
            counts[idx]++;
        });

        return { labels, counts };
    };

    const renderChart = () => {
        if (!chartLoaded) return toast.info("Initializing… please wait");

        const Chart = (window as any).Chart;

        const labels = parseLabels(labelsText);
        const values = parseValues(valuesText);

        if (!values.length) return toast.error("Please enter valid numbers");

        let data: any;
        let config: any;

        if (chartType === "histogram") {
            const { labels: histLabels, counts } = createHistogram(values);
            data = {
                labels: histLabels,
                datasets: [
                    {
                        label: datasetLabel,
                        data: counts,
                        backgroundColor: bgColor,
                        borderColor: borderColor,
                        borderWidth: 1,
                    },
                ],
            };
            config = {
                type: "bar",
                data,
                options: {
                    maintainAspectRatio: false,
                    responsive: true,
                },
            };
        } else if (["pie", "doughnut"].includes(chartType)) {
            const colors = generateColors(values.length);
            data = {
                labels: labels.length
                    ? labels
                    : values.map((_, i) => `Item ${i + 1}`),
                datasets: [
                    {
                        label: datasetLabel,
                        data: values,
                        backgroundColor: colors,
                        borderColor: colors,
                    },
                ],
            };
            config = {
                type: chartType,
                data,
                options: {
                    maintainAspectRatio: false,
                    responsive: true,
                    plugins: { legend: { position: "bottom" } },
                },
            };
        } else {
            data = {
                labels,
                datasets: [
                    {
                        label: datasetLabel,
                        data: values,
                        backgroundColor:
                            chartType === "bar" ? bgColor : "transparent",
                        borderColor,
                        borderWidth: 2,
                        tension: chartType === "line" ? 0.3 : 0,
                    },
                ],
            };
            config = {
                type: chartType,
                data,
                options: {
                    maintainAspectRatio: false,
                    responsive: true,
                },
            };
        }

        if (chartRef.current) chartRef.current.destroy();

        const ctx = canvasRef.current?.getContext("2d");
        chartRef.current = new Chart(ctx, config);
    };

    const downloadPNG = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const url = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = url;
        link.download = `${datasetLabel}.png`;
        link.click();
    };

    return (
        <div className="space-y-8">
            {/* INPUT PANEL */}
            <Card className="p-4 bg-muted/40 backdrop-blur border border-border/50 shadow-inner rounded-xl">
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                        <label className="text-sm font-medium">
                            Chart Type
                        </label>
                        <Select
                            value={chartType}
                            onValueChange={(v) => setChartType(v as ChartType)}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="bar">Bar</SelectItem>
                                <SelectItem value="line">Line</SelectItem>
                                <SelectItem value="pie">Pie</SelectItem>
                                <SelectItem value="doughnut">
                                    Doughnut
                                </SelectItem>
                                <SelectItem value="histogram">
                                    Histogram
                                </SelectItem>
                            </SelectContent>
                        </Select>

                        <label className="text-sm font-medium">
                            Dataset Label
                        </label>
                        <Input
                            value={datasetLabel}
                            onChange={(e) => setDatasetLabel(e.target.value)}
                            placeholder="Example: Sales 2024"
                        />

                        <div className="flex items-center gap-3">
                            <div className="space-y-1 flex items-center gap-2">
                                <label className="text-sm font-medium">
                                    Background
                                </label>
                                <input
                                    type="color"
                                    value={bgColor}
                                    onChange={(e) => setBgColor(e.target.value)}
                                    className="w-8 h-8 rounded-md"
                                />
                            </div>

                            <div className="space-y-1 flex items-center gap-2">
                                <label className="text-sm font-medium">
                                    Border
                                </label>
                                <input
                                    type="color"
                                    value={borderColor}
                                    onChange={(e) =>
                                        setBorderColor(e.target.value)
                                    }
                                    className="w-8 h-8 rounded-md"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-sm font-medium">
                            Labels (comma-separated)
                        </label>
                        <Textarea
                            value={labelsText}
                            onChange={(e) => setLabelsText(e.target.value)}
                            className="min-h-[90px]"
                        />

                        <label className="text-sm font-medium">
                            Values (comma-separated)
                        </label>
                        <Textarea
                            value={valuesText}
                            onChange={(e) => setValuesText(e.target.value)}
                            className="min-h-[90px]"
                        />
                    </div>
                </div>

                <div className="flex gap-3 mt-6 flex-wrap">
                    <Button
                        className="bg-gradient-primary"
                        onClick={renderChart}
                    >
                        Generate Chart
                    </Button>
                    <Button variant="outline" onClick={downloadPNG}>
                        Download PNG
                    </Button>
                </div>
            </Card>

            {/* LARGE BEAUTIFUL PREVIEW */}
            <Card className="p-4 bg-background/40 backdrop-blur-md shadow-xl border border-border/50 rounded-xl">
                <h3 className="text-md font-semibold mb-3 text-muted-foreground">
                    Chart Preview
                </h3>

                <div className="w-full h-[450px] md:h-[550px] rounded-xl bg-card shadow-inner p-4 flex items-center justify-center">
                    <canvas ref={canvasRef} className="w-full h-full" />
                </div>
            </Card>
        </div>
    );
};

export default ChartMaker;
