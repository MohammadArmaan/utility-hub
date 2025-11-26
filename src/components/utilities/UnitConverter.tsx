import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeftRight } from "lucide-react";

const conversions = {
  length: {
    meters: 1,
    kilometers: 0.001,
    miles: 0.000621371,
    feet: 3.28084,
    inches: 39.3701,
  },
  weight: {
    kilograms: 1,
    grams: 1000,
    pounds: 2.20462,
    ounces: 35.274,
  },
  temperature: {
    celsius: (value: number) => value,
    fahrenheit: (value: number) => (value * 9) / 5 + 32,
    kelvin: (value: number) => value + 273.15,
  },
};

const UnitConverter = () => {
  const [category, setCategory] = useState<keyof typeof conversions>("length");
  const [fromUnit, setFromUnit] = useState("meters");
  const [toUnit, setToUnit] = useState("kilometers");
  const [fromValue, setFromValue] = useState("1");
  const [toValue, setToValue] = useState("");

  const convert = (value: string) => {
    const num = parseFloat(value);
    if (isNaN(num)) {
      setToValue("");
      return;
    }

    if (category === "temperature") {
      const temp = conversions.temperature;
      let celsius = num;
      if (fromUnit === "fahrenheit") celsius = ((num - 32) * 5) / 9;
      if (fromUnit === "kelvin") celsius = num - 273.15;

      let result = celsius;
      if (toUnit === "fahrenheit") result = temp.fahrenheit(celsius);
      if (toUnit === "kelvin") result = temp.kelvin(celsius);
      setToValue(result.toFixed(2));
    } else {
      const rates = conversions[category] as Record<string, number>;
      const inBase = num / rates[fromUnit];
      const result = inBase * rates[toUnit];
      setToValue(result.toFixed(6));
    }
  };

  const handleFromValueChange = (value: string) => {
    setFromValue(value);
    convert(value);
  };

  const units = Object.keys(
    category === "temperature" ? conversions.temperature : conversions[category]
  ).filter((key) => typeof (conversions[category] as any)[key] !== "function");

  return (
    <div className="space-y-6">
      <div>
        <Label>Category</Label>
        <Select
          value={category}
          onValueChange={(value) => {
            setCategory(value as keyof typeof conversions);
            setFromValue("1");
            setToValue("");
          }}
        >
          <SelectTrigger className="bg-muted/50">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="length">Length</SelectItem>
            <SelectItem value="weight">Weight</SelectItem>
            <SelectItem value="temperature">Temperature</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4">
        <div className="space-y-2">
          <Label>From</Label>
          <div className="flex gap-2">
            <Input
              type="number"
              value={fromValue}
              onChange={(e) => handleFromValueChange(e.target.value)}
              placeholder="0"
              className="flex-1 bg-muted/50"
            />
            <Select value={fromUnit} onValueChange={setFromUnit}>
              <SelectTrigger className="w-[140px] bg-muted/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {units.map((unit) => (
                  <SelectItem key={unit} value={unit}>
                    {unit}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-center">
          <div className="p-2 rounded-full bg-primary/10">
            <ArrowLeftRight className="w-5 h-5 text-primary" />
          </div>
        </div>

        <div className="space-y-2">
          <Label>To</Label>
          <div className="flex gap-2">
            <Input
              type="number"
              value={toValue}
              readOnly
              placeholder="0"
              className="flex-1 bg-muted/50"
            />
            <Select value={toUnit} onValueChange={setToUnit}>
              <SelectTrigger className="w-[140px] bg-muted/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {units.map((unit) => (
                  <SelectItem key={unit} value={unit}>
                    {unit}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnitConverter;
