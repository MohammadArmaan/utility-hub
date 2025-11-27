import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

const MasterCalculator = () => {
    const [type, setType] = useState("bmi");

    // -----------------------------
    // BMI CALCULATOR
    // -----------------------------
    const BMI = () => {
        const [weight, setWeight] = useState("");
        const [height, setHeight] = useState("");
        const [bmi, setBmi] = useState("");

        const calc = () => {
            if (!weight || !height) return toast.error("Enter all fields");
            const h = parseFloat(height) / 100;
            const result = parseFloat(weight) / (h * h);
            setBmi(result.toFixed(2));
        };

        return (
            <div className="space-y-4 mt-4">
                <Label>Weight (kg)</Label>
                <Input
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                />

                <Label>Height (cm)</Label>
                <Input
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                />

                <Button onClick={calc} className="w-full bg-gradient-primary">
                    Calculate
                </Button>

                {bmi && (
                    <p className="text-center text-xl font-bold text-primary">
                        BMI: {bmi}
                    </p>
                )}
            </div>
        );
    };

    // -----------------------------
    // AGE CALCULATOR
    // -----------------------------
    const AgeCalculator = () => {
        const [dob, setDob] = useState("");
        const [result, setResult] = useState("");

        const calc = () => {
            if (!dob) return toast.error("Select date");

            const today = new Date();
            const birth = new Date(dob);

            let years = today.getFullYear() - birth.getFullYear();
            let months = today.getMonth() - birth.getMonth();
            let days = today.getDate() - birth.getDate();

            if (days < 0) {
                months--;
                days += 30;
            }
            if (months < 0) {
                years--;
                months += 12;
            }

            setResult(`${years}y ${months}m ${days}d`);
        };

        return (
            <div className="space-y-4 mt-4">
                <Label>Date of Birth</Label>
                <Input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                />

                <Button onClick={calc} className="w-full bg-gradient-primary">
                    Calculate Age
                </Button>

                {result && (
                    <p className="text-xl text-center font-bold text-primary">
                        {result}
                    </p>
                )}
            </div>
        );
    };

    // -----------------------------
    // DATE DIFFERENCE
    // -----------------------------
    const DateDifference = () => {
        const [d1, setD1] = useState("");
        const [d2, setD2] = useState("");
        const [diff, setDiff] = useState("");

        const calc = () => {
            if (!d1 || !d2) return toast.error("Select both dates");
            const date1 = new Date(d1);
            const date2 = new Date(d2);
            const result =
                Math.abs(date2.getTime() - date1.getTime()) /
                (1000 * 3600 * 24);
            setDiff(`${result} days`);
        };

        return (
            <div className="space-y-4 mt-4">
                <Label>Start Date</Label>
                <Input
                    type="date"
                    value={d1}
                    onChange={(e) => setD1(e.target.value)}
                />

                <Label>End Date</Label>
                <Input
                    type="date"
                    value={d2}
                    onChange={(e) => setD2(e.target.value)}
                />

                <Button onClick={calc} className="w-full bg-gradient-primary">
                    Calculate
                </Button>

                {diff && (
                    <p className="text-xl font-bold text-center text-primary">
                        {diff}
                    </p>
                )}
            </div>
        );
    };

    // -----------------------------
    // EMI CALCULATOR
    // -----------------------------
    const EMI = () => {
        const [amount, setAmount] = useState("");
        const [rate, setRate] = useState("");
        const [months, setMonths] = useState("");
        const [emi, setEmi] = useState("");

        const calc = () => {
            if (!amount || !rate || !months)
                return toast.error("Fill all fields");

            const P = parseFloat(amount);
            const R = parseFloat(rate) / 1200;
            const N = parseFloat(months);

            const result =
                (P * R * Math.pow(1 + R, N)) / (Math.pow(1 + R, N) - 1);
            setEmi(result.toFixed(2));
        };

        return (
            <div className="space-y-4 mt-4">
                <Label>Loan Amount</Label>
                <Input
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                />

                <Label>Interest Rate (%)</Label>
                <Input value={rate} onChange={(e) => setRate(e.target.value)} />

                <Label>Tenure (months)</Label>
                <Input
                    value={months}
                    onChange={(e) => setMonths(e.target.value)}
                />

                <Button onClick={calc} className="w-full bg-gradient-primary">
                    Calculate EMI
                </Button>

                {emi && (
                    <p className="text-xl text-center font-bold text-primary">
                        ₹ {emi}
                    </p>
                )}
            </div>
        );
    };

    // -----------------------------
    // DISCOUNT CALCULATOR
    // -----------------------------
    const Discount = () => {
        const [price, setPrice] = useState("");
        const [dis, setDis] = useState("");
        const [final, setFinal] = useState("");

        const calc = () => {
            if (!price || !dis) return toast.error("Fill fields");
            const result =
                parseFloat(price) - (parseFloat(price) * parseFloat(dis)) / 100;
            setFinal(result.toFixed(2));
        };

        return (
            <div className="space-y-4 mt-4">
                <Label>Original Price</Label>
                <Input
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                />

                <Label>Discount (%)</Label>
                <Input value={dis} onChange={(e) => setDis(e.target.value)} />

                <Button onClick={calc} className="w-full bg-gradient-primary">
                    Calculate
                </Button>

                {final && (
                    <p className="text-xl text-center font-bold text-primary">
                        ₹ {final}
                    </p>
                )}
            </div>
        );
    };

    // -----------------------------
    // GST CALCULATOR
    // -----------------------------
    const GST = () => {
        const [amount, setAmount] = useState("");
        const [gst, setGst] = useState("");
        const [final, setFinal] = useState("");

        const calc = () => {
            if (!amount || !gst) return toast.error("Enter fields");
            const result =
                parseFloat(amount) +
                (parseFloat(amount) * parseFloat(gst)) / 100;
            setFinal(result.toFixed(2));
        };

        return (
            <div className="space-y-4 mt-4">
                <Label>Amount</Label>
                <Input
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                />

                <Label>GST (%)</Label>
                <Input value={gst} onChange={(e) => setGst(e.target.value)} />

                <Button onClick={calc} className="w-full bg-gradient-primary">
                    Calculate GST
                </Button>

                {final && (
                    <p className="text-xl text-center font-bold text-primary">
                        ₹ {final}
                    </p>
                )}
            </div>
        );
    };

    // -----------------------------
    // FUEL COST CALCULATOR
    // -----------------------------
    const Fuel = () => {
        const [distance, setDistance] = useState("");
        const [average, setAverage] = useState("");
        const [price, setPrice] = useState("");
        const [total, setTotal] = useState("");

        const calc = () => {
            if (!distance || !average || !price)
                return toast.error("Enter fields");
            const liters = parseFloat(distance) / parseFloat(average);
            const final = liters * parseFloat(price);
            setTotal(final.toFixed(2));
        };

        return (
            <div className="space-y-4 mt-4">
                <Label>Distance (km)</Label>
                <Input
                    value={distance}
                    onChange={(e) => setDistance(e.target.value)}
                />

                <Label>Vehicle Average (km/l)</Label>
                <Input
                    value={average}
                    onChange={(e) => setAverage(e.target.value)}
                />

                <Label>Fuel Price (₹/l)</Label>
                <Input
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                />

                <Button onClick={calc} className="w-full bg-gradient-primary">
                    Calculate
                </Button>

                {total && (
                    <p className="text-xl text-center font-bold text-primary">
                        ₹ {total}
                    </p>
                )}
            </div>
        );
    };

    // -----------------------------
    // TIP CALCULATOR
    // -----------------------------
    const Tip = () => {
        const [bill, setBill] = useState("");
        const [tip, setTip] = useState("");
        const [total, setTotal] = useState("");

        const calc = () => {
            if (!bill || !tip) return toast.error("Enter fields");
            const result =
                parseFloat(bill) + (parseFloat(bill) * parseFloat(tip)) / 100;
            setTotal(result.toFixed(2));
        };

        return (
            <div className="space-y-4 mt-4">
                <Label>Bill Amount</Label>
                <Input value={bill} onChange={(e) => setBill(e.target.value)} />

                <Label>Tip (%)</Label>
                <Input value={tip} onChange={(e) => setTip(e.target.value)} />

                <Button onClick={calc} className="w-full bg-gradient-primary">
                    Calculate
                </Button>

                {total && (
                    <p className="text-xl font-bold text-primary text-center">
                        ₹ {total}
                    </p>
                )}
            </div>
        );
    };

    // -----------------------------
    // PREGNANCY DUE DATE CALCULATOR
    // -----------------------------
    const Pregnancy = () => {
        const [lmp, setLmp] = useState("");
        const [due, setDue] = useState("");

        const calc = () => {
            if (!lmp) return toast.error("Select date");
            const date = new Date(lmp);
            date.setDate(date.getDate() + 280);
            setDue(date.toDateString());
        };

        return (
            <div className="space-y-4 mt-4">
                <Label>Last Menstrual Period</Label>
                <Input
                    type="date"
                    value={lmp}
                    onChange={(e) => setLmp(e.target.value)}
                />

                <Button onClick={calc} className="w-full bg-gradient-primary">
                    Calculate Due Date
                </Button>

                {due && (
                    <p className="text-xl text-center text-primary font-bold">
                        {due}
                    </p>
                )}
            </div>
        );
    };

    // -----------------------------
    // UI VIEW
    // -----------------------------
    return (
        <div className="space-y-6">
            <Label>Select Calculator</Label>
            <Select value={type} onValueChange={setType}>
                <SelectTrigger className="bg-muted/50">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="bmi">BMI Calculator</SelectItem>
                    <SelectItem value="age">Age Calculator</SelectItem>
                    <SelectItem value="datediff">Date Difference</SelectItem>
                    <SelectItem value="emi">EMI Calculator</SelectItem>
                    <SelectItem value="discount">
                        Discount Calculator
                    </SelectItem>
                    <SelectItem value="gst">GST Calculator</SelectItem>
                    <SelectItem value="fuel">Fuel Cost Calculator</SelectItem>
                    <SelectItem value="tip">Tip Calculator</SelectItem>
                    <SelectItem value="pregnancy">
                        Pregnancy Due Date
                    </SelectItem>
                </SelectContent>
            </Select>

            {/* Dynamic Components */}
            {type === "bmi" && <BMI />}
            {type === "age" && <AgeCalculator />}
            {type === "datediff" && <DateDifference />}
            {type === "emi" && <EMI />}
            {type === "discount" && <Discount />}
            {type === "gst" && <GST />}
            {type === "fuel" && <Fuel />}
            {type === "tip" && <Tip />}
            {type === "pregnancy" && <Pregnancy />}
        </div>
    );
};

export default MasterCalculator;
