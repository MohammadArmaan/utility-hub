import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const ImageConverter = () => {
  const [originalImage, setOriginalImage] = useState<File | null>(null);
  const [format, setFormat] = useState<string>("png");
  const [convertedImage, setConvertedImage] = useState<string | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setOriginalImage(file);
      toast.success("Image loaded");
    } else {
      toast.error("Please select a valid image file");
    }
  };

  const convertImage = () => {
    if (!originalImage) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          const mimeType = `image/${format}`;
          const dataUrl = canvas.toDataURL(mimeType);
          setConvertedImage(dataUrl);
          toast.success(`Converted to ${format.toUpperCase()}!`);
        }
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(originalImage);
  };

  const downloadImage = () => {
    if (convertedImage) {
      const link = document.createElement("a");
      link.href = convertedImage;
      link.download = `converted.${format}`;
      link.click();
      toast.success("Image downloaded!");
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          id="image-convert"
        />
        <label htmlFor="image-convert">
          <Button className="bg-gradient-primary hover:opacity-90" asChild>
            <span>Select Image</span>
          </Button>
        </label>
      </div>

      {originalImage && (
        <>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Convert to:</label>
            <Select value={format} onValueChange={setFormat}>
              <SelectTrigger className="bg-muted/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="png">PNG</SelectItem>
                <SelectItem value="jpeg">JPEG</SelectItem>
                <SelectItem value="webp">WebP</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button onClick={convertImage} className="w-full bg-gradient-primary hover:opacity-90">
            Convert Image
          </Button>
        </>
      )}

      {convertedImage && (
        <div className="space-y-4">
          <img src={convertedImage} alt="Converted" className="w-full rounded-lg border border-border" />
          <Button onClick={downloadImage} className="w-full bg-gradient-primary hover:opacity-90">
            Download {format.toUpperCase()}
          </Button>
        </div>
      )}
    </div>
  );
};

export default ImageConverter;
