import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { X, Upload, Image as ImageIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ImageUploadProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
  label?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  images,
  onImagesChange,
  maxImages = 10,
  label = "Property Images"
}) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    if (files.length + images.length > maxImages) {
      toast({
        title: "Too many images",
        description: `Maximum ${maxImages} images allowed`,
        variant: "destructive"
      });
      return;
    }

    files.forEach(file => {
      // Check file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: "Only image files are allowed",
          variant: "destructive"
        });
        return;
      }

      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Maximum file size is 5MB",
          variant: "destructive"
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        onImagesChange([...images, imageUrl]);
      };
      reader.readAsDataURL(file);
    });

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const files = Array.from(event.dataTransfer.files);
    
    if (files.length + images.length > maxImages) {
      toast({
        title: "Too many images",
        description: `Maximum ${maxImages} images allowed`,
        variant: "destructive"
      });
      return;
    }

    files.forEach(file => {
      if (!file.type.startsWith('image/')) return;
      if (file.size > 5 * 1024 * 1024) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        onImagesChange([...images, imageUrl]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  return (
    <div className="space-y-4">
      <Label>{label}</Label>
      
      {/* Upload Area */}
      <Card
        className="border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 transition-colors cursor-pointer"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="p-8 text-center">
          <Upload className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
          <p className="text-sm text-muted-foreground mb-2">
            Drag and drop images here, or click to select
          </p>
          <p className="text-xs text-muted-foreground">
            Supports: JPG, PNG, GIF, WebP, HEIC, BMP, TIFF (Max 5MB each, {maxImages} images max)
          </p>
          <Button type="button" variant="outline" className="mt-4">
            <ImageIcon className="mr-2 h-4 w-4" />
            Choose Images
          </Button>
        </div>
      </Card>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/jpeg,image/png,image/gif,image/webp,image/heic,image/bmp,image/tiff"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Image Previews */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <Card key={index} className="relative group overflow-hidden">
              <img
                src={image}
                alt={`Preview ${index + 1}`}
                className="w-full h-32 object-cover"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6"
                onClick={() => removeImage(index)}
              >
                <X className="h-3 w-3" />
              </Button>
              {index === 0 && (
                <div className="absolute bottom-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                  Main
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        {images.length} of {maxImages} images selected
      </p>
    </div>
  );
};

export default ImageUpload;