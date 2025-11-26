import { useEffect, useState } from "react";
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
  temperature: {},
};

// Temperature convert helpers
const convertTemperature = (value: number, from: string, to: string) => {
  let celsius = value;

  if (from === "fahrenheit") celsius = ((value - 32) * 5) / 9;
  if (from === "kelvin") celsius = value - 273.15;

  if (to === "fahrenheit") return (celsius * 9) / 5 + 32;
  if (to === "kelvin") return celsius + 273.15;

  return celsius;
};

const UnitConverter = () => {
  const [category, setCategory] = useState<keyof typeof conversions>("length");
  const [fromUnit, setFromUnit] = useState("meters");
  const [toUnit, setToUnit] = useState("kilometers");
  const [fromValue, setFromValue] = useState("1");
  const [toValue, setToValue] = useState("");

  const convert = (val: string, fUnit = fromUnit, tUnit = toUnit) => {
    const num = parseFloat(val);
    if (isNaN(num)) {
      setToValue("");
      return;
    }

    // Temperature conversion
    if (category === "temperature") {
      const result = convertTemperature(num, fUnit, tUnit);
      setToValue(result.toFixed(2));
      return;
    }

    // Normal conversion
    const rates = conversions[category] as Record<string, number>;
    const inBase = num / rates[fUnit];
    const result = inBase * rates[tUnit];
    setToValue(result.toFixed(6));
  };

  // Swap units + values
  const handleSwap = () => {
    const newFromUnit = toUnit;
    const newToUnit = fromUnit;

    const newFromValue = toValue;
    const newToValue = fromValue;

    setFromUnit(newFromUnit);
    setToUnit(newToUnit);

    setFromValue(newFromValue);
    setToValue(newToValue);

    if (newFromValue) convert(newFromValue, newFromUnit, newToUnit);
  };

  // Auto convert when units change
  useEffect(() => {
    convert(fromValue);
  }, [fromUnit, toUnit]);

  // Reset when switching category
  useEffect(() => {
    if (category === "length") {
      setFromUnit("meters");
      setToUnit("kilometers");
    }
    if (category === "weight") {
      setFromUnit("kilograms");
      setToUnit("grams");
    }
    if (category === "temperature") {
      setFromUnit("celsius");
      setToUnit("fahrenheit");
    }
    setFromValue("1");
    setToValue("");
  }, [category]);

  const units =
    category === "temperature"
      ? ["celsius", "fahrenheit", "kelvin"]
      : Object.keys(conversions[category]);

  return (
    <div className="space-y-6">
      <div>
        <Label>Category</Label>
        <Select
          value={category}
          onValueChange={(value) =>
            setCategory(value as keyof typeof conversions)
          }
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

      <div className="grid gap-6">
        {/* FROM SECTION */}
        <div className="space-y-2">
          <Label>From</Label>
          <div className="flex gap-2">
            <Input
              type="number"
              value={fromValue}
              onChange={(e) => {
                setFromValue(e.target.value);
                convert(e.target.value);
              }}
              placeholder="0"
              className="flex-1 bg-muted/50"
            />
            <Select
              value={fromUnit}
              onValueChange={(val) => {
                setFromUnit(val);
                convert(fromValue, val, toUnit);
              }}
            >
              <SelectTrigger className="w-[140px] bg-muted/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {units.map((unit) => (
                  <SelectItem value={unit} key={unit}>
                    {unit.charAt(0).toUpperCase() + unit.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* SWAP BUTTON */}
        <div className="flex justify-center">
          <button
            onClick={handleSwap}
            className="p-3 rounded-full bg-primary/10 hover:bg-primary/20 transition"
          >
            <ArrowLeftRight className="w-6 h-6 text-primary" />
          </button>
        </div>

        {/* TO SECTION */}
        <div className="space-y-2">
          <Label>To</Label>
          <div className="flex gap-2">
            <Input
              type="number"
              value={toValue}
              readOnly
              className="flex-1 bg-muted/50"
            />
            <Select
              value={toUnit}
              onValueChange={(val) => {
                setToUnit(val);
                convert(fromValue, fromUnit, val);
              }}
            >
              <SelectTrigger className="w-[140px] bg-muted/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {units.map((unit) => (
                  <SelectItem value={unit} key={unit}>
                    {unit.charAt(0).toUpperCase() + unit.slice(1)}
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
