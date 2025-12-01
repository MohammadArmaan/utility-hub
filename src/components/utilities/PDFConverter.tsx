import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    FileDown,
    ImagePlus,
    FileText,
    Copy,
    Loader2,
    Trash2,
    X,
} from "lucide-react";
import { toast } from "sonner";

const PDFConverter = () => {
    const [text, setText] = useState("");
    const [convertedContent, setConvertedContent] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const [images, setImages] = useState<File[]>([]);
    const [pdfPages, setPdfPages] = useState<string[]>([]);

    // Multiple Images to PDF
    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        setImages((prev) => [...prev, ...files]);
        toast.success(`${files.length} image(s) added`);
    };

    const removeImage = (index: number) => {
        setImages((prev) => prev.filter((_, i) => i !== index));
    };

    const convertMultipleImagesToPDF = async () => {
        if (images.length === 0) {
            toast.error("Please add at least one image");
            return;
        }

        try {
            setIsProcessing(true);
            const { jsPDF } = await import("jspdf");
            const doc = new jsPDF();

            for (let i = 0; i < images.length; i++) {
                const file = images[i];
                const imageData = await readFileAsDataURL(file);

                const img = await loadImage(imageData);

                if (i > 0) {
                    doc.addPage();
                }

                const pageWidth = doc.internal.pageSize.getWidth();
                const pageHeight = doc.internal.pageSize.getHeight();
                const imgRatio = img.width / img.height;
                const pageRatio = pageWidth / pageHeight;

                let finalWidth = pageWidth;
                let finalHeight = pageHeight;

                if (imgRatio > pageRatio) {
                    finalHeight = pageWidth / imgRatio;
                } else {
                    finalWidth = pageHeight * imgRatio;
                }

                const x = (pageWidth - finalWidth) / 2;
                const y = (pageHeight - finalHeight) / 2;

                doc.addImage(img, "JPEG", x, y, finalWidth, finalHeight);
            }

            doc.save(`images-${Date.now()}.pdf`);
            toast.success(`PDF created with ${images.length} page(s)!`);
            setImages([]);
        } catch (error) {
            toast.error("Failed to create PDF");
            console.error(error);
        } finally {
            setIsProcessing(false);
        }
    };

    // Helper functions
    const readFileAsDataURL = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target?.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    const loadImage = (src: string): Promise<HTMLImageElement> => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = src;
        });
    };

    // Detect if input likely contains Markdown
    const isMarkdown = (text: string): boolean => {
        const mdPatterns = [
            /^#{1,6}\s+/m, // headings
            /\*\*(.*?)\*\*/m, // bold
            /\*(.*?)\*/m, // italic
            /`{1,3}[^`]+`{1,3}/m, // code / code-block
            /^[-*+]\s+/m, // list items
            /\[(.*?)\]\((.*?)\)/m, // links
        ];
        return mdPatterns.some((pattern) => pattern.test(text));
    };

    // Convert Markdown → Clean Plain Text for PDF
    const markdownToPlainText = (md: string): string => {
        let txt = md;

        // 1. Replace headings (#, ##, ###)
        txt = txt.replace(/^#{1,6}\s*(.*)$/gm, (_, g) => g.toUpperCase());

        // 2. Bold & Italic → remove ** and *
        txt = txt.replace(/\*\*(.*?)\*\*/g, "$1");
        txt = txt.replace(/\*(.*?)\*/g, "$1");

        // 3. Inline code `code`
        txt = txt.replace(/`(.*?)`/g, "$1");

        // 4. Code blocks
        txt = txt.replace(/```([\s\S]*?)```/g, (_, g) => g);

        // 5. Turn markdown lists into bullet lists
        txt = txt.replace(/^[-*+]\s+(.*)$/gm, "• $1");

        // 6. Numbered lists keep as-is
        txt = txt.replace(/^\d+\.\s+(.*)$/gm, "$1");

        // 7. Remove link markdown [text](url)
        txt = txt.replace(/\[(.*?)\]\((.*?)\)/g, "$1");

        // 8. Preserve multiple spaces
        txt = txt.replace(/ {2,}/g, (match) => " ".repeat(match.length));

        // 9. Preserve blank lines (do nothing)

        return txt.trim();
    };

    const convertTextToPDF = async () => {
        if (!text.trim()) {
            toast.error("Please enter some text first");
            return;
        }

        try {
            setIsProcessing(true);
            const { jsPDF } = await import("jspdf");

            // --- Check if text contains markdown ---
            const finalText = isMarkdown(text)
                ? markdownToPlainText(text) // <-- convert markdown to clean plain text
                : text;

            // -------- PLAIN TEXT → PDF --------
            const doc = new jsPDF();
            const marginTop = 20;
            const marginBottom = 20;
            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();
            const maxWidth = pageWidth - 40; // left 20 + right 20

            // Split long plain text into wrapped lines
            const lines = doc.splitTextToSize(finalText, maxWidth);
            let y = marginTop;

            lines.forEach((line) => {
                if (y > pageHeight - marginBottom) {
                    doc.addPage();
                    y = marginTop;
                }

                doc.text(line, 20, y);
                y += 7;
            });

            doc.save("text-document.pdf");
            toast.success("PDF created successfully!");
        } catch (error) {
            console.error(error);
            toast.error("Failed to create PDF");
        } finally {
            setIsProcessing(false);
        }
    };

    // DOCX/PPTX to PDF - Trigger print dialog
    const convertDocToPDF = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setIsProcessing(true);

            if (file.name.endsWith(".docx") || file.name.endsWith(".pptx")) {
                // For DOCX/PPTX, we'll convert to viewable HTML and trigger print
                const mammoth = await import("mammoth");
                const arrayBuffer = await file.arrayBuffer();

                let htmlContent = "";

                if (file.name.endsWith(".docx")) {
                    const result = await mammoth.convertToHtml({ arrayBuffer });
                    htmlContent = result.value;
                } else {
                    // For PPTX, show instruction
                    htmlContent = `
                        <div style="padding: 40px; font-family: Arial; text-align: center;">
                            <h2>PowerPoint File Detected</h2>
                            <p>To convert PowerPoint to PDF:</p>
                            <ol style="text-align: left; max-width: 500px; margin: 20px auto;">
                                <li>Open the file in PowerPoint/Google Slides</li>
                                <li>Go to File → Print</li>
                                <li>Select "Save as PDF" or "Microsoft Print to PDF"</li>
                                <li>Click Save</li>
                            </ol>
                            <p style="margin-top: 30px; color: #666;">
                                Direct browser conversion of PPTX maintains limited formatting.
                            </p>
                        </div>
                    `;
                }

                // Open in new window and trigger print dialog
                const printWindow = window.open("", "_blank");
                if (printWindow) {
                    printWindow.document.write(`
                        <!DOCTYPE html>
                        <html>
                        <head>
                            <title>Print to PDF</title>
                            <style>
                                body { 
                                    font-family: Arial, sans-serif; 
                                    padding: 20px;
                                    max-width: 800px;
                                    margin: 20px, auto;
                                }
                                @media print {
                                    body { padding: 0; }
                                }
                            </style>
                        </head>
                        <body>
                            ${htmlContent}
                            <script>
                                window.onload = function() {
                                    setTimeout(function() {
                                        window.print();
                                    }, 500);
                                };
                            </script>
                        </body>
                        </html>
                    `);
                    printWindow.document.close();
                    toast.success(
                        "Print dialog opened! Select 'Save as PDF' from printer options."
                    );
                }
            } else if (file.name.endsWith(".txt")) {
                const textContent = await file.text();
                setText(textContent);
                await convertTextToPDF();
            }
        } catch (error) {
            toast.error("Failed to process document");
            console.error(error);
        } finally {
            setIsProcessing(false);
        }
    };

    // PDF to Text
    const convertPDFToText = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setIsProcessing(true);
            const pdfjs = await import("pdfjs-dist");
            pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

            const arrayBuffer = await file.arrayBuffer();
            const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;

            let fullText = "";
            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();
                const pageText = textContent.items
                    .map((item) => {
                        if ("str" in item) {
                            return item.str;
                        }
                        return "";
                    })
                    .join(" ");
                fullText += `\n--- Page ${i} ---\n${pageText}\n`;
            }

            setConvertedContent(fullText);
            toast.success(`Extracted text from ${pdf.numPages} pages!`);
        } catch (error) {
            toast.error("Failed to extract text from PDF");
            console.error(error);
        } finally {
            setIsProcessing(false);
        }
    };

    // PDF to Images (All Pages)
    const convertPDFToImages = async (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setIsProcessing(true);
            const pdfjs = await import("pdfjs-dist");
            pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

            const arrayBuffer = await file.arrayBuffer();
            const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;

            const pageImages: string[] = [];

            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const scale = 2;
                const viewport = page.getViewport({ scale });

                const canvas = document.createElement("canvas");
                const context = canvas.getContext("2d");

                if (!context) continue;

                canvas.height = viewport.height;
                canvas.width = viewport.width;

                await page.render({
                    canvasContext: context,
                    viewport: viewport,
                    canvas: canvas,
                }).promise;

                const imageData = canvas.toDataURL("image/png");
                pageImages.push(imageData);
            }

            setPdfPages(pageImages);
            toast.success(`Converted ${pageImages.length} pages to images!`);
        } catch (error) {
            toast.error("Failed to convert PDF to images");
            console.error(error);
        } finally {
            setIsProcessing(false);
        }
    };

    // Download single page as image
    const downloadPageImage = (imageData: string, pageNum: number) => {
        const a = document.createElement("a");
        a.href = imageData;
        a.download = `page-${pageNum}.png`;
        a.click();
        toast.success(`Downloaded page ${pageNum}`);
    };

    // Download all pages as images
    const downloadAllImages = () => {
        pdfPages.forEach((imageData, index) => {
            setTimeout(() => {
                downloadPageImage(imageData, index + 1);
            }, index * 200);
        });
        toast.success("Downloading all pages...");
    };

    // PDF to DOCX
    const convertPDFToDocx = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setIsProcessing(true);

            // Extract text from PDF
            const pdfjs = await import("pdfjs-dist");
            pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

            const arrayBuffer = await file.arrayBuffer();
            const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;

            let fullText = "";
            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();
                const pageText = textContent.items
                    .map((item) => {
                        if ("str" in item) {
                            return item.str;
                        }
                        return "";
                    })
                    .join(" ");
                fullText += pageText + "\n\n";
            }

            // Create DOCX
            const { Document, Packer, Paragraph, TextRun } = await import(
                "docx"
            );

            const doc = new Document({
                sections: [
                    {
                        children: fullText.split("\n").map(
                            (line) =>
                                new Paragraph({
                                    children: [new TextRun(line)],
                                })
                        ),
                    },
                ],
            });

            const blob = await Packer.toBlob(doc);
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `converted-${Date.now()}.docx`;
            a.click();
            URL.revokeObjectURL(url);

            toast.success(
                "PDF converted to DOCX! (Note: Formatting may not be preserved)"
            );
        } catch (error) {
            toast.error("Failed to convert PDF to DOCX");
            console.error(error);
        } finally {
            setIsProcessing(false);
        }
    };

    // Copy to clipboard
    const copyToClipboard = () => {
        navigator.clipboard.writeText(convertedContent);
        toast.success("Copied to clipboard!");
    };

    return (
        <div className="max-w-4xl mx-auto">
            <Tabs defaultValue="to-pdf" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="to-pdf">To PDF</TabsTrigger>
                    <TabsTrigger value="from-pdf">From PDF</TabsTrigger>
                </TabsList>

                {/* TO PDF TAB */}
                <TabsContent value="to-pdf" className="space-y-4 mt-4">
                    {/* Text to PDF */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">
                                Text to PDF
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Textarea
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                placeholder="Enter or paste your text here..."
                                className="min-h-[150px] bg-muted/50"
                            />
                            <Button
                                onClick={convertTextToPDF}
                                className="w-full bg-gradient-primary hover:opacity-90"
                                disabled={isProcessing || !text.trim()}
                            >
                                {isProcessing ? (
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                ) : (
                                    <FileDown className="w-4 h-4 mr-2" />
                                )}
                                Convert to PDF
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Multiple Images to PDF */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">
                                Images to PDF
                            </CardTitle>
                            <CardDescription>
                                Select multiple images - each will be a page
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleImageSelect}
                                className="hidden"
                                id="images-upload"
                                disabled={isProcessing}
                            />
                            <label htmlFor="images-upload">
                                <Button
                                    variant="outline"
                                    className="w-full cursor-pointer border-primary/50 hover:bg-primary/10"
                                    asChild
                                    disabled={isProcessing}
                                >
                                    <span>
                                        <ImagePlus className="w-4 h-4 mr-2" />
                                        Add Images ({images.length})
                                    </span>
                                </Button>
                            </label>

                            {images.length > 0 && (
                                <div className="space-y-2">
                                    <div className="max-h-40 overflow-y-auto space-y-1">
                                        {images.map((img, idx) => (
                                            <div
                                                key={idx}
                                                className="flex items-center justify-between p-2 bg-muted/50 rounded text-sm"
                                            >
                                                <span className="truncate flex-1">
                                                    {img.name}
                                                </span>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() =>
                                                        removeImage(idx)
                                                    }
                                                    className="h-6 w-6 p-0"
                                                >
                                                    <X className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                    <Button
                                        onClick={convertMultipleImagesToPDF}
                                        className="w-full bg-gradient-primary hover:opacity-90"
                                        disabled={isProcessing}
                                    >
                                        Create PDF with {images.length} page(s)
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Documents to PDF */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">
                                Document to PDF
                            </CardTitle>
                            <CardDescription>
                                Word (.docx), PowerPoint (.pptx), Text (.txt)
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <input
                                type="file"
                                accept=".docx,.pptx,.txt"
                                onChange={convertDocToPDF}
                                className="hidden"
                                id="doc-upload"
                                disabled={isProcessing}
                            />
                            <label htmlFor="doc-upload">
                                <Button
                                    variant="outline"
                                    className="w-full cursor-pointer border-primary/50 hover:bg-primary/10"
                                    asChild
                                    disabled={isProcessing}
                                >
                                    <span>
                                        <FileText className="w-4 h-4 mr-2" />
                                        Upload Document
                                    </span>
                                </Button>
                            </label>
                            <p className="text-xs text-muted-foreground mt-2 text-center">
                                💡 Opens print dialog - select "Save as PDF"
                            </p>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* FROM PDF TAB */}
                <TabsContent value="from-pdf" className="space-y-4 mt-4">
                    {/* PDF to Text */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">
                                PDF to Text
                            </CardTitle>
                            <CardDescription>
                                Extract text content from PDF
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <input
                                type="file"
                                accept=".pdf"
                                onChange={convertPDFToText}
                                className="hidden"
                                id="pdf-to-text"
                                disabled={isProcessing}
                            />
                            <label htmlFor="pdf-to-text">
                                <Button
                                    variant="outline"
                                    className="w-full cursor-pointer border-primary/50 hover:bg-primary/10"
                                    asChild
                                    disabled={isProcessing}
                                >
                                    <span>
                                        {isProcessing ? (
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        ) : (
                                            <FileDown className="w-4 h-4 mr-2" />
                                        )}
                                        Upload PDF
                                    </span>
                                </Button>
                            </label>

                            {convertedContent && (
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Label>Extracted Text</Label>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={copyToClipboard}
                                        >
                                            <Copy className="w-4 h-4 mr-1" />
                                            Copy
                                        </Button>
                                    </div>
                                    <Textarea
                                        value={convertedContent}
                                        readOnly
                                        className="min-h-[250px] bg-muted/50 font-mono text-sm"
                                    />
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* PDF to Images */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">
                                PDF to Images
                            </CardTitle>
                            <CardDescription>
                                Convert all pages to PNG images
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <input
                                type="file"
                                accept=".pdf"
                                onChange={convertPDFToImages}
                                className="hidden"
                                id="pdf-to-images"
                                disabled={isProcessing}
                            />
                            <label htmlFor="pdf-to-images">
                                <Button
                                    variant="outline"
                                    className="w-full cursor-pointer border-primary/50 hover:bg-primary/10"
                                    asChild
                                    disabled={isProcessing}
                                >
                                    <span>
                                        <ImagePlus className="w-4 h-4 mr-2" />
                                        Upload PDF
                                    </span>
                                </Button>
                            </label>

                            {pdfPages.length > 0 && (
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <Label>
                                            {pdfPages.length} page(s) converted
                                        </Label>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={downloadAllImages}
                                        >
                                            Download All
                                        </Button>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto">
                                        {pdfPages.map((imgData, idx) => (
                                            <div
                                                key={idx}
                                                className="relative group"
                                            >
                                                <img
                                                    src={imgData}
                                                    alt={`Page ${idx + 1}`}
                                                    className="w-full border rounded"
                                                />
                                                <Button
                                                    size="sm"
                                                    className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                                    onClick={() =>
                                                        downloadPageImage(
                                                            imgData,
                                                            idx + 1
                                                        )
                                                    }
                                                >
                                                    <FileDown className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* PDF to DOCX */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">
                                PDF to Word (DOCX)
                            </CardTitle>
                            <CardDescription>
                                Convert PDF to editable Word document
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <input
                                type="file"
                                accept=".pdf"
                                onChange={convertPDFToDocx}
                                className="hidden"
                                id="pdf-to-docx"
                                disabled={isProcessing}
                            />
                            <label htmlFor="pdf-to-docx">
                                <Button
                                    variant="outline"
                                    className="w-full cursor-pointer border-primary/50 hover:bg-primary/10"
                                    asChild
                                    disabled={isProcessing}
                                >
                                    <span>
                                        <FileText className="w-4 h-4 mr-2" />
                                        Upload PDF
                                    </span>
                                </Button>
                            </label>
                            <p className="text-xs text-muted-foreground mt-2 text-center">
                                ⚠️ Text only - formatting may not be preserved
                            </p>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default PDFConverter;
