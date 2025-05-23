import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { PinProps } from "@/components/Pin";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Pin } from "@/components/Pin";
import { getRandomPhotos, unsplashPhotoToPin } from "@/services/unsplash";
import { useToast } from "@/components/ui/use-toast";

const Profile = () => {
  const { user } = useAuth();
  const [userPins, setUserPins] = useState<PinProps[]>([]);
  const [savedPins, setSavedPins] = useState<PinProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    if (user) {
      const fetchUserPins = async () => {
        try {
          // For demo purposes, show random photos as user's pins
          const photos = await getRandomPhotos(12);
          const formattedPins = photos.map(unsplashPhotoToPin);
          setUserPins(formattedPins);
          
          // Get saved pins from localStorage
          const savedPinIds = Object.keys(localStorage)
            .filter(key => key.startsWith('pin_') && key.endsWith('_saved'))
            .map(key => key.replace('pin_', '').replace('_saved', ''));
          
          // If there are saved pins, retrieve them
          if (savedPinIds.length > 0) {
            // Get saved pin details from localStorage
            const userSavedPins = savedPinIds.map(id => {
              const pinData = localStorage.getItem(`pin_${id}_data`);
              if (pinData) {
                return JSON.parse(pinData) as PinProps;
              }
              return null;
            }).filter(Boolean) as PinProps[];
            
            setSavedPins(userSavedPins);
          }
          
        } catch (error) {
          console.error("Error fetching user pins:", error);
          toast({
            title: "Error loading pins",
            description: "Please try again later",
            variant: "destructive"
          });
        } finally {
          setIsLoading(false);
          
          // Set image heights for masonry layout after a short delay
          setTimeout(() => {
            const pinElements = document.querySelectorAll('.masonry-item');
            pinElements.forEach((pin) => {
              const randomSpan = Math.floor(Math.random() * 45) + 15; // between 15-60
              pin.setAttribute('style', `--span: ${randomSpan}`);
            });
          }, 300);
        }
      };
      
      fetchUserPins();
    }
  }, [user, toast]);

  if (!user) {
    return (
      <div className="container mx-auto flex h-[70vh] flex-col items-center justify-center px-4">
        <h1 className="text-2xl font-bold">You need to be logged in</h1>
        <p className="mb-4 text-muted-foreground">Please log in to view your profile</p>
        <Button asChild>
          <a href="/login">Log in</a>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-10 flex flex-col items-center justify-center">
        <Avatar className="h-24 w-24">
          <AvatarFallback className="text-3xl">
            {user.username.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <h1 className="mt-4 text-2xl font-bold">{user.username}</h1>
        <p className="text-muted-foreground">@{user.username.toLowerCase().replace(/\s+/g, '')}</p>
      </div>
      
      <Tabs defaultValue="created" className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-[400px] mx-auto">
          <TabsTrigger value="created">Created</TabsTrigger>
          <TabsTrigger value="saved">Saved</TabsTrigger>
          <TabsTrigger value="following">Following</TabsTrigger>
        </TabsList>
        
        <TabsContent value="created" className="mt-8">
          {isLoading ? (
            <div className="flex h-96 items-center justify-center">
              <p>Loading pins...</p>
            </div>
          ) : userPins.length > 0 ? (
            <div className="masonry-grid">
              {userPins.map((pin) => (
                <div key={pin.id} className="masonry-item animate-fade-in" style={{ "--span": "30" } as React.CSSProperties}>
                  <Pin {...pin} />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex h-96 flex-col items-center justify-center gap-4">
              <p className="text-lg font-medium">You haven't created any pins yet</p>
              <Button asChild>
                <a href="/create">Create your first pin</a>
              </Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="saved" className="mt-8">
          {isLoading ? (
            <div className="flex h-96 items-center justify-center">
              <p>Loading saved pins...</p>
            </div>
          ) : savedPins.length > 0 ? (
            <div className="masonry-grid">
              {savedPins.map((pin) => (
                <div key={pin.id} className="masonry-item animate-fade-in" style={{ "--span": "30" } as React.CSSProperties}>
                  <Pin {...pin} />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex h-96 flex-col items-center justify-center gap-4">
              <p className="text-lg font-medium">No saved pins yet</p>
              <p className="text-center text-muted-foreground">
                Save pins by clicking the heart icon on pins you like
              </p>
              <Button asChild>
                <a href="/">Browse pins</a>
              </Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="following" className="mt-8">
          <div className="flex h-96 flex-col items-center justify-center gap-4">
            <p className="text-lg font-medium">Not following anyone yet</p>
            <p className="text-center text-muted-foreground">
              Follow creators to see their latest pins in your feed
            </p>
            <Button asChild>
              <a href="/explore">Explore creators</a>
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;
