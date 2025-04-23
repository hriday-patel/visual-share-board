
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { categories, savePin } from "@/data/pins";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { Upload } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const Create = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload an image smaller than 5MB",
          variant: "destructive",
        });
        return;
      }
      
      // Check file type
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Invalid file type",
          description: "Please upload an image file",
          variant: "destructive",
        });
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to create pins",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }
    
    if (!image) {
      toast({
        title: "Image required",
        description: "Please upload an image for your pin",
        variant: "destructive",
      });
      return;
    }
    
    if (!title.trim()) {
      toast({
        title: "Title required",
        description: "Please provide a title for your pin",
        variant: "destructive",
      });
      return;
    }
    
    setUploading(true);
    
    try {
      // In a real app, you would upload the image to a server
      // For this demo, we'll use the data URL directly
      
      // Create new pin
      const newPin = {
        id: `pin-${Date.now()}`,
        title,
        description: description || undefined,
        image,
        user: {
          id: user.id,
          name: user.username,
        },
        saves: 0,
        category: category || undefined,
      };
      
      // Save pin to "database" (localStorage)
      savePin(newPin);
      
      toast({
        title: "Pin created successfully",
        description: "Your pin is now published!",
      });
      
      // Redirect to pin detail page
      navigate(`/pin/${newPin.id}`);
    } catch (error) {
      toast({
        title: "Failed to create pin",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Create a new pin</h1>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid gap-8 md:grid-cols-2">
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div
                className="flex h-[400px] cursor-pointer items-center justify-center bg-secondary"
                onClick={() => fileInputRef.current?.click()}
              >
                {image ? (
                  <img
                    src={image}
                    alt="Pin preview"
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <div className="flex flex-col items-center space-y-2 text-muted-foreground">
                    <Upload className="h-10 w-10" />
                    <p>Click to upload image</p>
                    <p className="text-xs">Recommended: JPG, PNG, GIF</p>
                  </div>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageSelect}
                  accept="image/*"
                  className="hidden"
                />
              </div>
            </CardContent>
          </Card>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Add a title for your pin"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Add a detailed description (optional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Button
              type="submit"
              className="w-full bg-pin-red hover:bg-pin-hover"
              disabled={!image || !title || uploading}
            >
              {uploading ? "Creating pin..." : "Create Pin"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Create;
