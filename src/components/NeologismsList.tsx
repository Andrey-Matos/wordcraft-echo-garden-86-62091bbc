
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChevronRight } from 'lucide-react';
import { Neologism } from '@/types/neologism';

interface NeologismsListProps {
  neologisms: Neologism[];
}

export function NeologismsList({ neologisms }: NeologismsListProps) {
  const navigate = useNavigate();

  const handleNeologismClick = (id: string) => {
    navigate(`/neologism/${id}`);
  };

  if (neologisms.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No neologisms found. Try a different search or add a new one.
      </div>
    );
  }

  return (
    <ScrollArea className="h-[28rem] pr-4">
      <div className="space-y-4">
        {neologisms.map((neologism) => (
          <Card 
            key={neologism.id} 
            className="hover:shadow-md transition-shadow border-l-4 border-l-neologism-accent cursor-pointer"
            onClick={() => handleNeologismClick(neologism.id)}
          >
            <CardHeader className="py-3 px-4">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg font-medium">{neologism.name}</CardTitle>
                <div className="flex items-center">
                  <Badge variant="outline" className="text-xs border-neologism-accent text-neologism-accent mr-2">
                    {neologism.category}
                  </Badge>
                  <Badge 
                    variant={neologism.status === 'Ready' ? 'default' : 'secondary'} 
                    className="text-xs mr-2"
                  >
                    {neologism.status}
                  </Badge>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            </CardHeader>
            <Separator />
            <CardContent className="py-2 px-4">
              <p className="text-sm text-muted-foreground truncate">{neologism.definition}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
}
