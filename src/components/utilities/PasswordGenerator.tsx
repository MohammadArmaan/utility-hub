import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Copy, RefreshCw, Shield } from "lucide-react";
import { toast } from "sonner";

const PasswordGenerator = () => {
  const [password, setPassword] = useState("");
  const [length, setLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);

  const generatePassword = () => {
    let charset = "";
    if (includeUppercase) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (includeLowercase) charset += "abcdefghijklmnopqrstuvwxyz";
    if (includeNumbers) charset += "0123456789";
    if (includeSymbols) charset += "!@#$%^&*()_+-=[]{}|;:,.<>?";

    if (charset === "") {
      toast.error("Please select at least one character type");
      return;
    }

    let newPassword = "";
    for (let i = 0; i < length; i++) {
      newPassword += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    setPassword(newPassword);
    toast.success("Password generated!");
  };

  const copyToClipboard = () => {
    if (!password) {
      toast.error("Generate a password first");
      return;
    }
    navigator.clipboard.writeText(password);
    toast.success("Password copied to clipboard!");
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="p-4 bg-muted/50 rounded-lg flex items-center gap-2">
          <Input
            value={password}
            readOnly
            placeholder="Generated password will appear here"
            className="flex-1 font-mono bg-background/50"
          />
          <Button onClick={copyToClipboard} variant="outline" size="icon">
            <Copy className="w-4 h-4" />
          </Button>
        </div>

        <div>
          <Label htmlFor="length">Length: {length}</Label>
          <Input
            id="length"
            type="range"
            min="8"
            max="32"
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
            className="bg-muted/50"
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="uppercase"
              checked={includeUppercase}
              onCheckedChange={(checked) => setIncludeUppercase(checked as boolean)}
            />
            <Label htmlFor="uppercase" className="cursor-pointer">Uppercase (A-Z)</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="lowercase"
              checked={includeLowercase}
              onCheckedChange={(checked) => setIncludeLowercase(checked as boolean)}
            />
            <Label htmlFor="lowercase" className="cursor-pointer">Lowercase (a-z)</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="numbers"
              checked={includeNumbers}
              onCheckedChange={(checked) => setIncludeNumbers(checked as boolean)}
            />
            <Label htmlFor="numbers" className="cursor-pointer">Numbers (0-9)</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="symbols"
              checked={includeSymbols}
              onCheckedChange={(checked) => setIncludeSymbols(checked as boolean)}
            />
            <Label htmlFor="symbols" className="cursor-pointer">Symbols (!@#$...)</Label>
          </div>
        </div>

        <Button onClick={generatePassword} className="w-full bg-gradient-primary hover:opacity-90">
          <RefreshCw className="w-4 h-4 mr-2" />
          Generate Password
        </Button>
      </div>

      <div className="flex items-start gap-2 p-4 bg-muted/30 rounded-lg">
        <Shield className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
        <p className="text-xs text-muted-foreground">
          Strong passwords use a mix of letters, numbers, and symbols. Aim for at least 12 characters.
        </p>
      </div>
    </div>
  );
};

export default PasswordGenerator;
