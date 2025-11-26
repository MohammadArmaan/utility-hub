import CalendarWithNotes from "@/components/utilities/CalendarWithNotes";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ColorPaletteGenerator from "@/components/utilities/ColorPaletteGenerator";
import { Palette } from "lucide-react";

function CalendarPage() {

    return (
      <Layout>
        <CalendarWithNotes />
    </Layout>
    );
};

export default CalendarPage;
