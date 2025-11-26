import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Maximize } from "lucide-react";
import { toast } from "sonner";

const PhotoViewer = () => {
  const [images, setImages] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Zoom & pan state
  const [zoom, setZoom] = useState(1);
  const [dragging, setDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const imgRef = useRef<HTMLImageElement | null>(null);
  const dragStart = useRef({ x: 0, y: 0 });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const imageUrls = files.map((file) => URL.createObjectURL(file));
    setImages(imageUrls);
    if (files.length > 0) toast.success(`${files.length} photo(s) loaded`);
    resetZoom();
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
    resetZoom();
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
    resetZoom();
  };

  const resetZoom = () => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  const zoomIn = () => setZoom((z) => Math.min(z + 0.25, 4));
  const zoomOut = () => setZoom((z) => Math.max(z - 0.25, 1));

  // Mouse wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    if (e.deltaY < 0) zoomIn();
    else zoomOut();
  };

  // Drag functionality when zoomed in
  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom === 1) return;
    setDragging(true);
    dragStart.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragging) return;
    setPosition({
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y,
    });
  };

  const handleMouseUp = () => setDragging(false);

  return (
    <div className="space-y-6">
      {/* Upload Button */}
      <div className="text-center">
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          className="hidden"
          id="photo-upload"
        />
        <label htmlFor="photo-upload">
          <Button className="bg-gradient-primary hover:opacity-90" asChild>
            <span>Select Photos</span>
          </Button>
        </label>
      </div>

      {images.length > 0 && (
        <>
          {/* MAIN VIEWER */}
          <div
            className="relative w-full h-[400px] bg-black rounded-lg overflow-hidden"
            onWheel={handleWheel}
          >
            <img
              ref={imgRef}
              src={images[currentIndex]}
              alt="Selected"
              className="absolute top-1/2 left-1/2 object-contain"
              style={{
                transform: `translate(-50%, -50%) scale(${zoom}) translate(${position.x / zoom}px, ${position.y / zoom}px)`,
                cursor: zoom > 1 ? "grab" : "default",
                transition: dragging ? "none" : "transform 0.2s ease",
              }}
              draggable={false}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            />

            {/* PREV & NEXT BUTTONS */}
            {images.length > 1 && (
              <>
                <Button
                  onClick={goToPrevious}
                  variant="outline"
                  size="icon"
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80"
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                <Button
                  onClick={goToNext}
                  variant="outline"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80"
                >
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </>
            )}

            {/* INDEX INDICATOR */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-background/80 px-4 py-2 rounded-full text-sm">
              {currentIndex + 1} / {images.length}
            </div>

            {/* ZOOM CONTROLS */}
            <div className="absolute top-4 right-4 flex gap-2">
              <Button onClick={zoomOut} size="icon" variant="outline">
                <ZoomOut className="w-4 h-4" />
              </Button>
              <Button onClick={zoomIn} size="icon" variant="outline">
                <ZoomIn className="w-4 h-4" />
              </Button>
              <Button onClick={resetZoom} size="icon" variant="outline">
                <Maximize className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* THUMBNAILS */}
          <div className="grid grid-cols-5 gap-2">
            {images.map((img, index) => (
              <img
                key={index}
                src={img}
                className={`w-full h-20 object-cover rounded cursor-pointer ${
                  index === currentIndex
                    ? "ring-2 ring-primary"
                    : "opacity-60 hover:opacity-100"
                }`}
                onClick={() => {
                  setCurrentIndex(index);
                  resetZoom();
                }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default PhotoViewer;
