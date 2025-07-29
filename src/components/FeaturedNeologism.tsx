
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNeologism } from '@/context/NeologismContext';
import { Neologism } from '@/types/neologism';
import { AspectRatio } from '@/components/ui/aspect-ratio';

export function FeaturedNeologism() {
  const { getRandomNeologism } = useNeologism();
  const [featured, setFeatured] = useState<Neologism | null>(null);

  useEffect(() => {
    setFeatured(getRandomNeologism());
  }, [getRandomNeologism]);

  if (!featured) {
    return null;
  }

  return (
    <Card className="border-2 border-neologism-accent bg-gradient-to-br from-white to-neologism-light shadow-lg transition-all hover:shadow-xl animate-fade-in">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-2xl md:text-3xl text-neologism-primary">{featured.name}</CardTitle>
            <CardDescription className="text-slate-600">
              {featured.rootWords.join(' + ')}
            </CardDescription>
          </div>
          <Badge className="bg-neologism-accent hover:bg-neologism-accent/90 text-white">
            {featured.category}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-6">
          {featured.imageUrl && (
            <div className="md:w-1/5">
              <AspectRatio ratio={16 / 9}>
                <img 
                  src={featured.imageUrl} 
                  alt={featured.name} 
                  className="rounded-md object-cover w-full h-full"
                />
              </AspectRatio>
            </div>
          )}
          <div className={featured.imageUrl ? "md:w-4/5" : "w-full"}>
            <p className="text-slate-700 leading-relaxed">{featured.definition}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
