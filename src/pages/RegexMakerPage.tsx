import Layout from "@/components/Layout";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "@/components/ui/card";
import RegexMaker from "@/components/utilities/RegexMaker";
import { SquareAsterisk } from "lucide-react";

const RegexMakerPage = () => {
    return (
        <Layout>
            <div className="max-w-2xl mx-auto">
                <Card className="bg-gradient-card shadow-card border-border/50">
                    <CardHeader>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 rounded-lg bg-primary/10">
                                <SquareAsterisk className="w-5 h-5 text-primary" />
                            </div>
                            <CardTitle className="text-2xl">
                                Regex Maker & Tester
                            </CardTitle>
                        </div>
                        <CardDescription>
                            Build and test Regular Expressions with live
                            validation
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <RegexMaker />
                    </CardContent>
                </Card>
            </div>
        </Layout>
    );
};

export default RegexMakerPage;
