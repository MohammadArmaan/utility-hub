import Layout from "@/components/Layout";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import MasterCalculator from "@/components/utilities/MasterCalculator";
import { Calculator } from "lucide-react";

const AllCalculatorsPage = () => {
    return (
        <Layout>
            <div className="max-w-2xl mx-auto">
                <Card className="bg-gradient-card shadow-card border-border/50">
                    <CardHeader>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 rounded-lg bg-primary/10">
                                <Calculator className="w-5 h-5 text-primary" />
                            </div>
                            <CardTitle className="text-2xl">
                                All-in-One Calculator
                            </CardTitle>
                        </div>
                        <CardDescription>
                            8 powerful calculators combined into one simple
                            interface
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <MasterCalculator/>
                    </CardContent>
                </Card>
            </div>
        </Layout>
    );
};

export default AllCalculatorsPage;
