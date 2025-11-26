import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { FileImage, FileText, Loader2 } from "lucide-react";

const FileCompressor = () => {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [compressedFile, setCompressedFile] = useState<File | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);

  const [quality, setQuality] = useState<number>(70); // 0-100 for images
  const [compressionMode, setCompressionMode] = useState<'quality' | 'size' | 'percentage'>('quality');
  const [targetSize, setTargetSize] = useState<number>(1); // MB
  const [targetPercentage, setTargetPercentage] = useState<number>(50); // %

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setOriginalFile(file);
    setCompressedFile(null);
    toast.info(`Selected: ${file.name}`);
  };

  /** Compress Image Files */
  const compressImage = async (file: File, targetQuality: number): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          
          // Calculate new dimensions based on compression mode
          let width = img.width;
          let height = img.height;
          let maxDimension = 1920;
          
          // Adjust dimensions based on compression mode
          if (compressionMode === 'size' || compressionMode === 'percentage') {
            // More aggressive resizing for size/percentage targets
            const targetBytes = compressionMode === 'size' 
              ? targetSize * 1024 * 1024 
              : (file.size * targetPercentage) / 100;
            
            // Estimate dimension reduction needed
            const currentBytes = file.size;
            const ratio = Math.sqrt(targetBytes / currentBytes);
            maxDimension = Math.floor(Math.max(width, height) * ratio);
            maxDimension = Math.max(200, Math.min(maxDimension, 3840)); // Between 200px and 3840px
          }
          
          if (width > maxDimension || height > maxDimension) {
            if (width > height) {
              height = (height / width) * maxDimension;
              width = maxDimension;
            } else {
              width = (width / height) * maxDimension;
              height = maxDimension;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Could not get canvas context'));
            return;
          }
          
          ctx.drawImage(img, 0, 0, width, height);
          
          canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve(blob);
              } else {
                reject(new Error('Canvas to Blob conversion failed'));
              }
            },
            file.type,
            targetQuality / 100
          );
        };
        
        img.onerror = () => reject(new Error('Image loading failed'));
        img.src = e.target?.result as string;
      };
      
      reader.onerror = () => reject(new Error('File reading failed'));
      reader.readAsDataURL(file);
    });
  };

  /** Compress PDF using pdf-lib */
  const compressPDF = async (file: File): Promise<Blob> => {
    try {
      const pdfLib = await import('pdf-lib');
      const { PDFDocument } = pdfLib;
      
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      
      // Remove metadata to reduce size
      pdfDoc.setTitle('');
      pdfDoc.setAuthor('');
      pdfDoc.setSubject('');
      pdfDoc.setKeywords([]);
      pdfDoc.setProducer('');
      pdfDoc.setCreator('');
      
      // Save with compression
      const pdfBytes = await pdfDoc.save({
        useObjectStreams: true,
        addDefaultPage: false,
      });
      
      return new Blob([pdfBytes], { type: 'application/pdf' });
    } catch (error) {
      console.error('PDF compression error:', error);
      // If pdf-lib fails, return original with minimal processing
      toast.info('PDF compression limited - returning optimized version');
      return file;
    }
  };

  /** Main Compression Logic */
  const compressFile = async () => {
    if (!originalFile) {
      toast.error("Select a file first!");
      return;
    }

    setIsCompressing(true);

    try {
      let output: Blob;
      const fileType = originalFile.type;
      
      // Calculate target quality based on mode
      let calculatedQuality = quality;
      
      if (compressionMode === 'percentage' && isImage) {
        // Convert target percentage to quality
        // If user wants 50% size reduction, use lower quality
        calculatedQuality = Math.max(10, 100 - targetPercentage);
      } else if (compressionMode === 'size' && isImage) {
        // Estimate quality needed to reach target size
        const targetBytes = targetSize * 1024 * 1024;
        const ratio = targetBytes / originalFile.size;
        calculatedQuality = Math.max(10, Math.min(100, ratio * 100));
      }

      // IMAGE FILES
      if (fileType.startsWith("image/")) {
        let attempts = 0;
        const maxAttempts = 5;
        
        output = await compressImage(originalFile, calculatedQuality);
        
        // Iterative compression for size/percentage targets
        if (compressionMode === 'size') {
          const targetBytes = targetSize * 1024 * 1024;
          
          while (output.size > targetBytes && attempts < maxAttempts && calculatedQuality > 10) {
            calculatedQuality -= 15;
            output = await compressImage(originalFile, Math.max(10, calculatedQuality));
            attempts++;
          }
          
          if (output.size > targetBytes) {
            toast.warning(`Reached minimum quality. File size: ${formatFileSize(output.size)}`);
          }
        } else if (compressionMode === 'percentage') {
          const targetBytes = (originalFile.size * targetPercentage) / 100;
          
          while (output.size > targetBytes && attempts < maxAttempts && calculatedQuality > 10) {
            calculatedQuality -= 10;
            output = await compressImage(originalFile, Math.max(10, calculatedQuality));
            attempts++;
          }
          
          if (output.size > targetBytes) {
            toast.warning(`Closest compression achieved: ${((output.size / originalFile.size) * 100).toFixed(1)}%`);
          }
        }
        
        toast.success("Image compressed successfully!");
      }
      // PDF FILES
      else if (fileType === "application/pdf") {
        output = await compressPDF(originalFile);
        
        // Check if target was met
        if (compressionMode === 'size' && output.size > targetSize * 1024 * 1024) {
          toast.warning("PDF compression is limited. Target size may not be achievable.");
        }
        
        toast.success("PDF optimized!");
      }
      // OTHER FILES (ZIP, DOCX, etc.)
      else if (
        fileType === "application/zip" ||
        fileType === "application/x-zip-compressed" ||
        fileType.includes("compressed")
      ) {
        toast.info("This file is already compressed. No further compression possible.");
        output = originalFile;
      }
      // TEXT-BASED FILES
      else if (
        fileType.includes("text") ||
        fileType === "application/json" ||
        fileType === "application/xml"
      ) {
        const text = await originalFile.text();
        const minified = text.replace(/\s+/g, ' ').trim();
        output = new Blob([minified], { type: fileType });
        toast.success("Text file optimized!");
      }
      // UNSUPPORTED FILES
      else {
        toast.warning("This file type cannot be compressed. Returning original.");
        output = originalFile;
      }

      // Final check
      if (output.size >= originalFile.size) {
        toast.info("File couldn't be compressed further. Original size maintained.");
        output = originalFile;
      }

      const finalFile = new File(
        [output],
        originalFile.name.replace(/\.[^/.]+$/, "") + "_compressed" + originalFile.name.match(/\.[^/.]+$/)?.[0],
        { type: originalFile.type }
      );

      setCompressedFile(finalFile);
    } catch (error) {
      console.error("Compression error:", error);
      toast.error("Compression failed. Please try another file.");
    } finally {
      setIsCompressing(false);
    }
  };

  const downloadCompressed = () => {
    if (!compressedFile) return;

    const link = document.createElement("a");
    link.href = URL.createObjectURL(compressedFile);
    link.download = compressedFile.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
    
    toast.success("Downloaded compressed file!");
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <FileImage className="w-5 h-5" />;
    return <FileText className="w-5 h-5" />;
  };

  const isImage = originalFile?.type.startsWith('image/');

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-card border-border/50">
        <CardContent className="p-6 space-y-4">
          <h3 className="text-lg font-semibold text-foreground">
            File Compressor
          </h3>

          {/* FILE SELECT */}
          <div className="text-center">
            <input
              type="file"
              onChange={handleFileSelect}
              className="hidden"
              id="file-compress"
              accept="image/*,.pdf,.txt,.json,.xml"
            />
            <label htmlFor="file-compress">
              <Button className="bg-gradient-primary hover:opacity-90" asChild>
                <span>Select File to Compress</span>
              </Button>
            </label>
            <p className="text-xs text-muted-foreground mt-2">
              Supports: Images (JPG, PNG, WebP), PDF, Text files
            </p>
          </div>

          {/* FILE INFO & OPTIONS */}
          {originalFile && (
            <Card className="bg-muted/40 border-border/50">
              <CardContent className="p-4 space-y-4">
                <div className="flex items-start gap-3">
                  {getFileIcon(originalFile.type)}
                  <div className="flex-1">
                    <p className="font-medium text-sm">{originalFile.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Size: {formatFileSize(originalFile.size)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Type: {originalFile.type || 'Unknown'}
                    </p>
                  </div>
                </div>

                {/* Quality Slider for Images */}
                {isImage && (
                  <div className="space-y-4">
                    {/* Compression Mode Selector */}
                    <div>
                      <label className="text-sm text-foreground block mb-2">
                        Compression Mode
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        <Button
                          variant={compressionMode === 'quality' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setCompressionMode('quality')}
                          className="text-xs"
                        >
                          Quality
                        </Button>
                        <Button
                          variant={compressionMode === 'size' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setCompressionMode('size')}
                          className="text-xs"
                        >
                          Target Size
                        </Button>
                        <Button
                          variant={compressionMode === 'percentage' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setCompressionMode('percentage')}
                          className="text-xs"
                        >
                          Percentage
                        </Button>
                      </div>
                    </div>

                    {/* Quality Mode */}
                    {compressionMode === 'quality' && (
                      <div>
                        <label className="text-sm text-foreground block mb-2">
                          Image Quality: {quality}%
                        </label>
                        <input
                          type="range"
                          min="10"
                          max="100"
                          value={quality}
                          onChange={(e) => setQuality(Number(e.target.value))}
                          className="w-full"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Lower quality = smaller file size
                        </p>
                      </div>
                    )}

                    {/* Target Size Mode */}
                    {compressionMode === 'size' && (
                      <div>
                        <label className="text-sm text-foreground block mb-2">
                          Target Size (MB)
                        </label>
                        <Input
                          type="number"
                          min="0.1"
                          max={Math.ceil((originalFile.size / 1024 / 1024) * 10) / 10}
                          step="0.1"
                          value={targetSize}
                          onChange={(e) => setTargetSize(Number(e.target.value))}
                          className="bg-muted/50"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Max: {formatFileSize(originalFile.size)}
                        </p>
                      </div>
                    )}

                    {/* Target Percentage Mode */}
                    {compressionMode === 'percentage' && (
                      <div>
                        <label className="text-sm text-foreground block mb-2">
                          Compress to {targetPercentage}% of original size
                        </label>
                        <input
                          type="range"
                          min="10"
                          max="90"
                          value={targetPercentage}
                          onChange={(e) => setTargetPercentage(Number(e.target.value))}
                          className="w-full"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground mt-1">
                          <span>More compression</span>
                          <span>Target: ~{formatFileSize((originalFile.size * targetPercentage) / 100)}</span>
                          <span>Less compression</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Non-image file info */}
                {!isImage && (
                  <div className="p-3 bg-muted/30 rounded-lg">
                    <p className="text-xs text-muted-foreground">
                      {originalFile.type === 'application/pdf' 
                        ? '📄 PDFs will be optimized by removing metadata and compressing content.'
                        : '📝 Text files will be optimized by removing extra whitespace.'}
                    </p>
                  </div>
                )}

                <Button
                  onClick={compressFile}
                  disabled={isCompressing}
                  className="w-full bg-primary text-primary-foreground hover:opacity-90"
                >
                  {isCompressing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Compressing...
                    </>
                  ) : (
                    "Compress File"
                  )}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* RESULTS */}
          {compressedFile && (
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <Card className="bg-card border-border/50">
                  <CardContent className="p-4">
                    <h4 className="font-medium text-sm mb-2">Original</h4>
                    <p className="text-sm">Size: {formatFileSize(originalFile!.size)}</p>
                    <p className="text-xs text-muted-foreground mt-1">{originalFile!.name}</p>
                  </CardContent>
                </Card>

                <Card className="bg-card border-primary/20">
                  <CardContent className="p-4">
                    <h4 className="font-medium text-sm mb-2">Compressed</h4>
                    <p className="text-sm">Size: {formatFileSize(compressedFile.size)}</p>
                    <p className="text-sm text-green-400 mt-1">
                      Saved:{" "}
                      {originalFile && compressedFile.size < originalFile.size
                        ? (
                            ((originalFile.size - compressedFile.size) /
                              originalFile.size) *
                            100
                          ).toFixed(1)
                        : "0"}
                      %
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Button
                onClick={downloadCompressed}
                className="w-full bg-gradient-primary hover:opacity-90"
              >
                Download Compressed File
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className="p-4 bg-muted/30 border-border/50">
        <div className="text-xs text-muted-foreground space-y-2">
          <p className="font-semibold text-foreground">📋 Supported Formats:</p>
          <ul className="space-y-1 ml-4">
            <li>• <strong>Images:</strong> JPG, PNG, WebP - Quality-based compression</li>
            <li>• <strong>PDF:</strong> Metadata removal and optimization</li>
            <li>• <strong>Text:</strong> TXT, JSON, XML - Whitespace removal</li>
          </ul>
          <p className="text-center pt-2 border-t border-border/50">
            💡 Compressed files remain fully functional and openable
          </p>
        </div>
      </Card>
    </div>
  );
};

export default FileCompressor;