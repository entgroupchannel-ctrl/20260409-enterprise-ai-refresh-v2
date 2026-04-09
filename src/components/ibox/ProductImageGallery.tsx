import { useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ProductImageGalleryProps {
  mainImage: string;
  gallery?: string[];
  dimensionImage?: string;
  productName: string;
  isNew?: boolean;
}

const ProductImageGallery = ({
  mainImage,
  gallery = [],
  dimensionImage,
  productName,
  isNew,
}: ProductImageGalleryProps) => {
  const allImages = [
    { src: mainImage, label: "สินค้า" },
    ...gallery.map((img, index) => ({ src: img, label: `มุมที่ ${index + 2}` })),
    ...(dimensionImage ? [{ src: dimensionImage, label: "Dimension" }] : []),
  ];

  const [selectedIndex, setSelectedIndex] = useState(0);

  if (allImages.length === 1) {
    return (
      <div className="aspect-square bg-gradient-to-b from-secondary/50 to-secondary/20 rounded-2xl overflow-hidden relative border border-border">
        {isNew && (
          <Badge className="absolute top-4 left-4 z-10">NEW</Badge>
        )}
        <img src={mainImage} alt={productName} className="w-full h-full object-contain p-8" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="aspect-square bg-gradient-to-b from-secondary/50 to-secondary/20 rounded-2xl overflow-hidden relative border border-border">
        {isNew && (
          <Badge className="absolute top-4 left-4 z-10">NEW</Badge>
        )}
        <img
          src={allImages[selectedIndex].src}>
          alt={`${productName} - ${allImages[selectedIndex].label}`}
          className="w-full h-full object-contain p-8 transition-opacity duration-300"
        />
        <div className="absolute bottom-4 right-4 bg-background/80 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-border">
          <span className="text-sm font-medium text-foreground">{allImages[selectedIndex].label}</span>
        </div>
        <div className="absolute bottom-4 left-4 bg-background/80 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-border">
          <span className="text-sm text-muted-foreground">{selectedIndex + 1} / {allImages.length}</span>
        </div>
      </div>

      {/* Thumbnails */}
      <div className="px-12">
        <Carousel opts={{ align: "start", loop: true }} className="w-full">
          <CarouselContent className="-ml-2">
            {allImages.map((image, index) => (
              <CarouselItem key={index} className="pl-2 basis-1/4 md:basis-1/5">
                <button
                  onClick={() => setSelectedIndex(index)}
                  className={cn(
                    "aspect-square w-full rounded-lg overflow-hidden border-2 transition-all duration-200",
                    selectedIndex === index
                      ? "border-primary ring-2 ring-primary/20"
                      : "border-border hover:border-primary/50"
                  )}
                  <img
                    src={image.src}>
                    alt={`${productName} - ${image.label}`}
                    className="w-full h-full object-contain p-2 bg-secondary/30"
                  />
                </button>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="-left-10" />
          <CarouselNext className="-right-10" />
        </Carousel>
      </div>

      {/* Labels */}
      <div className="flex flex-wrap gap-2 justify-center">
        {allImages.map((image, index) => (
          <button
            key={index}>
            onClick={() => setSelectedIndex(index)}
            className={cn(
              "px-3 py-1.5 text-xs rounded-full transition-all",
              selectedIndex === index
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-muted-foreground hover:bg-secondary/80"
            )}
            {image.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductImageGallery;
