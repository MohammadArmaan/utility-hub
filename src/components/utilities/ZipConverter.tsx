import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { FolderOpen, FileArchive, Download, Trash2, Folder, File } from "lucide-react";

interface FileItem {
  file: File;
  path: string;
}

const ZipConverter = () => {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [extractedFiles, setExtractedFiles] = useState<{ name: string; blob: Blob }[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // Handle file/folder selection with webkitdirectory
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    
    if (selectedFiles.length === 0) return;

    const fileItems: FileItem[] = selectedFiles.map(file => ({
      file: file,
      path: (file as any).webkitRelativePath || file.name
    }));

    setFiles(prev => [...prev, ...fileItems]);
    toast.success(`${selectedFiles.length} file(s) added`);
  };

  // Handle drag and drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const items = Array.from(e.dataTransfer.items);
    const fileItems: FileItem[] = [];

    for (const item of items) {
      if (item.kind === 'file') {
        const entry = item.webkitGetAsEntry();
        if (entry) {
          await processEntry(entry, '', fileItems);
        }
      }
    }

    if (fileItems.length > 0) {
      setFiles(prev => [...prev, ...fileItems]);
      toast.success(`${fileItems.length} file(s) added from drag & drop`);
    }
  };

  // Recursively process directory entries
  const processEntry = async (entry: any, path: string, fileItems: FileItem[]): Promise<void> => {
    if (entry.isFile) {
      const file = await new Promise<File>((resolve) => {
        entry.file((f: File) => resolve(f));
      });
      fileItems.push({
        file: file,
        path: path + entry.name
      });
    } else if (entry.isDirectory) {
      const dirReader = entry.createReader();
      const entries = await new Promise<any[]>((resolve) => {
        dirReader.readEntries((e: any[]) => resolve(e));
      });

      for (const childEntry of entries) {
        await processEntry(childEntry, path + entry.name + '/', fileItems);
      }
    }
  };

  // Create ZIP with folder structure
  const createZip = async () => {
    if (files.length === 0) {
      toast.error("Please add files first");
      return;
    }

    setIsProcessing(true);
    toast.info("Creating ZIP file...");

    try {
      const JSZip = (await import("jszip")).default;
      const zip = new JSZip();

      // Add files maintaining folder structure
      for (const item of files) {
        zip.file(item.path, item.file);
      }

      const content = await zip.generateAsync({ 
        type: "blob",
        compression: "DEFLATE",
        compressionOptions: {
          level: 9
        }
      });

      const link = document.createElement("a");
      link.href = URL.createObjectURL(content);
      link.download = `archive-${Date.now()}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
      
      toast.success(`ZIP file created! (${(content.size / 1024 / 1024).toFixed(2)} MB)`);
    } catch (error) {
      console.error("ZIP creation error:", error);
      toast.error("Failed to create ZIP file");
    } finally {
      setIsProcessing(false);
    }
  };

  // Extract ZIP file
  const extractZip = async (file: File) => {
    setIsProcessing(true);
    toast.info("Extracting ZIP file...");

    try {
      const JSZip = (await import("jszip")).default;
      const zip = new JSZip();
      const contents = await zip.loadAsync(file);
      
      const extracted: { name: string; blob: Blob }[] = [];

      for (const [filename, fileData] of Object.entries(contents.files)) {
        if (!fileData.dir) {
          const blob = await fileData.async("blob");
          extracted.push({ name: filename, blob });
        }
      }

      setExtractedFiles(extracted);
      toast.success(`${extracted.length} files extracted!`);
    } catch (error) {
      console.error("ZIP extraction error:", error);
      toast.error("Failed to extract ZIP file");
    } finally {
      setIsProcessing(false);
    }
  };

  // Download individual extracted file
  const downloadExtractedFile = (name: string, blob: Blob) => {
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
    toast.success(`Downloaded: ${name}`);
  };

  // Download all extracted files
  const downloadAllExtracted = () => {
    extractedFiles.forEach(({ name, blob }) => {
      setTimeout(() => downloadExtractedFile(name, blob), 100);
    });
    toast.success("Downloading all files...");
  };

  // Remove file from list
  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    toast.success("File removed");
  };

  // Clear all files
  const clearAllFiles = () => {
    setFiles([]);
    toast.success("All files cleared");
  };

  // Get folder structure
  const getFolderStructure = () => {
    const folders = new Set<string>();
    files.forEach(item => {
      const parts = item.path.split('/');
      if (parts.length > 1) {
        for (let i = 1; i < parts.length; i++) {
          folders.add(parts.slice(0, i).join('/'));
        }
      }
    });
    return folders.size;
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-card border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileArchive className="w-5 h-5 text-primary" />
            ZIP Converter
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Drop Zone */}
          <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors bg-muted/20"
          >
            <FolderOpen className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground mb-2">
              Drag & drop files or folders here
            </p>
            <p className="text-xs text-muted-foreground mb-4">
              Folder structure will be preserved in the ZIP
            </p>
            
            {/* File and Folder Inputs */}
            <div className="flex gap-2 justify-center flex-wrap">
              <input
                type="file"
                multiple
                onChange={handleFileSelect}
                className="hidden"
                id="file-select"
              />
              <label htmlFor="file-select">
                <Button variant="outline" size="sm" asChild>
                  <span>
                    <File className="w-4 h-4 mr-2" />
                    Add Files
                  </span>
                </Button>
              </label>

              <input
                type="file"
                {...({ webkitdirectory: "", directory: "" } as any)}
                multiple
                onChange={handleFileSelect}
                className="hidden"
                id="folder-select"
              />
              <label htmlFor="folder-select">
                <Button variant="outline" size="sm" asChild>
                  <span>
                    <Folder className="w-4 h-4 mr-2" />
                    Add Folder
                  </span>
                </Button>
              </label>
            </div>
          </div>

          {/* File List */}
          {files.length > 0 && (
            <Card className="bg-muted/40 border-border/50">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-foreground">
                      Selected Files ({files.length})
                    </h3>
                    {getFolderStructure() > 0 && (
                      <p className="text-xs text-muted-foreground">
                        {getFolderStructure()} folder(s) detected
                      </p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearAllFiles}
                    className="text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Clear All
                  </Button>
                </div>

                <div className="space-y-1 max-h-60 overflow-y-auto">
                  {files.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-card rounded text-sm hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <File className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        <span className="truncate" title={item.path}>
                          {item.path}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-xs text-muted-foreground">
                          {formatFileSize(item.file.size)}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(index)}
                          className="h-6 w-6 p-0 hover:bg-destructive/10"
                        >
                          <Trash2 className="w-3 h-3 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <Button
                  onClick={createZip}
                  disabled={isProcessing}
                  className="w-full bg-gradient-primary hover:opacity-90"
                >
                  {isProcessing ? (
                    "Creating ZIP..."
                  ) : (
                    <>
                      <FileArchive className="w-4 h-4 mr-2" />
                      Create ZIP File
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Extract ZIP Section */}
          <div className="border-t border-border pt-6 space-y-4">
            <h3 className="font-medium text-foreground">Extract ZIP File</h3>
            
            <input
              type="file"
              accept=".zip"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) extractZip(file);
              }}
              className="hidden"
              id="zip-extract"
            />
            <label htmlFor="zip-extract">
              <Button variant="outline" className="w-full" asChild disabled={isProcessing}>
                <span>
                  <Download className="w-4 h-4 mr-2" />
                  Select ZIP to Extract
                </span>
              </Button>
            </label>

            {/* Extracted Files */}
            {extractedFiles.length > 0 && (
              <Card className="bg-muted/40 border-border/50">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-sm">
                      Extracted Files ({extractedFiles.length})
                    </h4>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={downloadAllExtracted}
                    >
                      Download All
                    </Button>
                  </div>

                  <div className="space-y-1 max-h-60 overflow-y-auto">
                    {extractedFiles.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 bg-card rounded text-sm hover:bg-accent/50 transition-colors"
                      >
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <File className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                          <span className="truncate" title={item.name}>
                            {item.name}
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => downloadExtractedFile(item.name, item.blob)}
                          className="flex-shrink-0"
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className="p-4 bg-muted/30 border-border/50">
        <div className="text-xs text-muted-foreground space-y-2">
          <p className="font-semibold text-foreground">✨ Features:</p>
          <ul className="space-y-1 ml-4">
            <li>• <strong>Drag & Drop:</strong> Drag files or entire folders</li>
            <li>• <strong>Folder Structure:</strong> Preserves complete directory hierarchy</li>
            <li>• <strong>Multiple Selection:</strong> Add files and folders separately</li>
            <li>• <strong>Extract Preview:</strong> View extracted files before downloading</li>
            <li>• <strong>Compression:</strong> Maximum compression level (level 9)</li>
          </ul>
        </div>
      </Card>
    </div>
  );
};

export default ZipConverter;