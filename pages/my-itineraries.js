import { getSession } from 'next-auth/react';
import supabase from '@/lib/supabase';
import { Card, CardContent } from '@/components/ui/card';

export default function MyItineraries({ userItineraries }) {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">My Saved Itineraries</h1>
      {userItineraries.length > 0 ? userItineraries.map(item => (
        <Card key={item.id} className="mb-4">
          <CardContent className="p-4 whitespace-pre-line">
            <h2 className="text-lg font-semibold mb-2">Prompt:</h2>
            <p>{item.prompt}</p>
            <h2 className="text-lg font-semibold mt-4 mb-2">Itinerary:</h2>
            <p>{item.itinerary}</p>
            <p className="text-sm text-muted-foreground mt-2">Saved on: {new Date(item.created_at).toLocaleString()}</p>
          </CardContent>
        </Card>
      )) : <p>No saved itineraries yet.</p>}
    </div>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);
  if (!session) return { redirect: { destination: '/api/auth/signin', permanent: false } };

  const { data: userItineraries } = await supabase
    .from('itineraries')
    .select('*')
    .eq('email', session.user.email)
    .order('created_at', { ascending: false });

  return { props: { userItineraries: userItineraries || [] } };
}
