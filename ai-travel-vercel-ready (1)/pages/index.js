import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Loader } from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";

export default function TravelPlanner() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [itinerary, setItinerary] = useState("");
  const [imageUrls, setImageUrls] = useState([]);
  const { data: session } = useSession();
  const router = useRouter();

  const generateItinerary = async () => {
    setLoading(true);
    setItinerary("");
    setImageUrls([]);

    try {
      const response = await fetch("/api/ai-itinerary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: input, user: session?.user?.email }),
      });
      const data = await response.json();
      setItinerary(data.itinerary);

      const imageResponse = await fetch("/api/image-search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: input }),
      });
      const imageData = await imageResponse.json();
      setImageUrls(imageData.urls);

      await fetch("/api/save-itinerary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: session?.user?.email, prompt: input, itinerary: data.itinerary }),
      });

    } catch (error) {
      console.error("Generation error:", error);
      setItinerary("There was an error generating your itinerary. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">AI-Powered Travel Planner</h1>
      <p className="text-center text-muted-foreground mb-4">Available in multiple languages. Mobile-friendly. Includes booking links and images.</p>

      {!session ? (
        <div className="text-center mb-6">
          <Button onClick={() => signIn()}>Sign in to generate your travel plans</Button>
        </div>
      ) : (
        <>
          <Card>
            <CardContent className="space-y-4 p-6">
              <Textarea
                placeholder="Describe your dream trip (e.g., 5-day foodie trip in Japan on a $1500 budget)"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                rows={4}
              />
              <Button onClick={generateItinerary} disabled={loading} className="w-full">
                {loading ? <Loader className="animate-spin mr-2" /> : "Generate Itinerary"}
              </Button>
            </CardContent>
          </Card>

          {itinerary && (
            <Card className="mt-6">
              <CardContent className="p-6 whitespace-pre-line">
                <h2 className="text-xl font-semibold mb-2">Your Custom Itinerary</h2>
                <div className="space-y-4">
                  {itinerary.split('\n').map((line, idx) => (
                    <p key={idx}>{line}</p>
                  ))}
                </div>
                <div className="mt-4">
                  <a href="https://booking.com" target="_blank" className="underline text-blue-500">View hotel deals</a>
                </div>
              </CardContent>
            </Card>
          )}

          {imageUrls.length > 0 && (
            <div className="grid grid-cols-2 gap-4 mt-6">
              {imageUrls.map((url, index) => (
                <img key={index} src={url} alt="Travel destination" className="rounded-xl w-full h-48 object-cover" />
              ))}
            </div>
          )}

          <div className="text-center mt-6 space-y-2">
            <Button onClick={() => router.push('/my-itineraries')}>View My Itineraries</Button>
            <Button variant="outline" onClick={() => signOut()}>Sign Out</Button>
          </div>
        </>
      )}
    </div>
  );
}
