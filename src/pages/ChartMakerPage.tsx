import Layout from "@/components/Layout";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import ChartMaker from "@/components/utilities/ChartMaker";
import { TrendingUp } from "lucide-react";

const ChartMakerPage = () => {
    return (
        <Layout>
            <div className="max-w-3xl mx-auto">
                <Card className="bg-gradient-card shadow-card border-border/50">
                    <CardHeader>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 rounded-lg bg-primary/10">
                                <TrendingUp className="w-5 h-5 text-primary" />
                            </div>
                            <CardTitle className="text-2xl">
                                Chart Maker
                            </CardTitle>
                        </div>
                        <CardDescription>
                            Create bar, line, pie, doughnut and histogram charts
                            — responsive and downloadable as PNG.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartMaker />
                    </CardContent>
                </Card>
            </div>
        </Layout>
    );
};

export default ChartMakerPage;