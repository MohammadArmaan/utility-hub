import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Copy } from "lucide-react";
import { toast } from "sonner";

// Helpers
const randomName = () =>
    [
        "Armaan",
        "Ayesha",
        "Rahul",
        "Sneha",
        "Daniel",
        "Isabella",
        "Omar",
        "Sofia",
        "Muskan",
        "Rakshith",
        "Moinuddin",
        "Shaheer",
        "Akash",
        "Jhon",
        "Mike",
        "Aron",
        "Smith",
        "Ana",
        "Rose",
        "Joseph"
    ][Math.floor(Math.random() * 20)];

const randomEmail = (name: string) => {
    const domain = ["gmail.com", "yahoo.com", "outlook.com"][
        Math.floor(Math.random() * 3)
    ];
    return `${name.toLowerCase()}${Math.floor(Math.random() * 200)}@${domain}`;
};

const randomPhone = () =>
    "+91 " + (6000000000 + Math.floor(Math.random() * 3999999999)).toString();

const randomAddress = () => {
    const streets = ["Park Street", "MG Road", "Brigade Road", "Linking Road"];
    const cities = ["Mumbai", "Delhi", "Bangalore", "Kolkata"];
    return `${Math.floor(Math.random() * 300)}, ${
        streets[Math.floor(Math.random() * streets.length)]
    }, ${cities[Math.floor(Math.random() * cities.length)]}`;
};

const randomCountry = () =>
    ["India", "USA", "Canada", "UK", "Australia"][
        Math.floor(Math.random() * 5)
    ];

const randomAge = () => Math.floor(Math.random() * 60) + 18;

const randomUUID = () => crypto.randomUUID();

const RandomDataGenerator = () => {
    const [count, setCount] = useState(5);
    const [fields, setFields] = useState({
        name: true,
        email: true,
        phone: false,
        address: false,
        age: false,
        country: false,
        uuid: false,
    });
    const [output, setOutput] = useState("");

    const toggleField = (key: string) => {
        setFields({ ...fields, [key]: !fields[key as keyof typeof fields] });
    };

    const generateData = () => {
        const result = [];

        for (let i = 0; i < count; i++) {
            const entry: any = {};

            const name = randomName();

            if (fields.name) entry.name = name;
            if (fields.email) entry.email = randomEmail(name);
            if (fields.phone) entry.phone = randomPhone();
            if (fields.address) entry.address = randomAddress();
            if (fields.age) entry.age = randomAge();
            if (fields.country) entry.country = randomCountry();
            if (fields.uuid) entry.uuid = randomUUID();

            result.push(entry);
        }

        setOutput(JSON.stringify(result, null, 2));
        toast.success("Random data generated!");
    };

    const exportCSV = () => {
        try {
            const arr = JSON.parse(output);
            const headers = Object.keys(arr[0]);
            const csvRows = [headers.join(",")];

            arr.forEach((obj: any) => {
                csvRows.push(headers.map((h) => obj[h]).join(","));
            });

            const csv = csvRows.join("\n");
            const blob = new Blob([csv], { type: "text/csv" });
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = "random-data.csv";
            link.click();
        } catch {
            toast.error("Generate data first");
        }
    };

    const exportJSObject = () => {
        navigator.clipboard.writeText(output);
        toast.success("Copied as JSON object!");
    };

    return (
        <div className="space-y-6">
            {/* Choose count */}
            <div>
                <Label>Number of Records</Label>
                <Input
                    type="number"
                    min={1}
                    value={count}
                    onChange={(e) => setCount(Number(e.target.value))}
                    className="bg-muted/50 mt-1"
                />
            </div>

            {/* Field selection */}
            <div className="grid grid-cols-2 gap-3">
                {Object.keys(fields).map((key) => (
                    <div key={key} className="flex items-center gap-2">
                        <Checkbox
                            checked={fields[key as keyof typeof fields]}
                            onCheckedChange={() => toggleField(key)}
                        />
                        <Label className="capitalize">{key}</Label>
                    </div>
                ))}
            </div>

            <Button
                className="w-full bg-gradient-primary hover:opacity-90"
                onClick={generateData}
            >
                Generate Data
            </Button>

            {/* Output */}
            {output && (
                <>
                    <div className="relative">
                        <Textarea
                            value={output}
                            readOnly
                            className="min-h-[250px] bg-muted/50 font-mono text-sm"
                        />
                        <Button
                            size="sm"
                            variant="outline"
                            className="absolute top-2 right-2"
                            onClick={exportJSObject}
                        >
                            <Copy className="w-4 h-4 mr-1" />
                            Copy JSON
                        </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <Button variant="outline" onClick={exportCSV}>
                            Download CSV
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => {
                                const blob = new Blob([output], {
                                    type: "application/json",
                                });
                                const url = URL.createObjectURL(blob);
                                const a = document.createElement("a");
                                a.href = url;
                                a.download = "random-data.json";
                                a.click();
                            }}
                        >
                            Download JSON
                        </Button>
                    </div>
                </>
            )}
        </div>
    );
};

export default RandomDataGenerator;
