
import { useState, useRef, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger,
  DialogClose
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { PlusCircle, X } from 'lucide-react';
import { useNeologism } from '@/context/NeologismContext';
import { Badge } from '@/components/ui/badge';

export function AddNeologismModal() {
  const { categories, addNeologism, addCategory } = useNeologism();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  
  // Form state
  const [name, setName] = useState('');
  const [rootWords, setRootWords] = useState<string[]>([]);
  const [currentRootWord, setCurrentRootWord] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [definition, setDefinition] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
  
  const closeRef = useRef<HTMLButtonElement>(null);

  // Reset form when dialog is closed
  useEffect(() => {
    if (!open) {
      resetForm();
    }
  }, [open]);

  const resetForm = () => {
    setName('');
    setRootWords([]);
    setCurrentRootWord('');
    setCategoryId('');
    setDefinition('');
    setImageUrl('');
    setNewCategory('');
    setShowNewCategoryInput(false);
  };

  const handleAddRootWord = () => {
    if (!currentRootWord.trim()) return;
    if (rootWords.length >= 4) { // Changed from 3 to 4
      toast({
        title: "Maximum root words reached",
        description: "A neologism can have at most 4 root words.", // Updated message
        variant: "destructive"
      });
      return;
    }
    setRootWords([...rootWords, currentRootWord.trim()]);
    setCurrentRootWord('');
  };

  const handleRemoveRootWord = (word: string) => {
    setRootWords(rootWords.filter(w => w !== word));
  };

  const handleCreateCategory = () => {
    if (!newCategory.trim()) return;
    
    // Add the new category
    addCategory(newCategory.trim());
    toast({
      title: "Category added",
      description: `New category "${newCategory.trim()}" has been created.`
    });
    
    // Find the newly created category
    setTimeout(() => {
      const updatedCategories = categories;
      const newlyAddedCategory = updatedCategories[updatedCategories.length - 1];
      if (newlyAddedCategory) {
        setCategoryId(newlyAddedCategory.id);
      }
      setNewCategory('');
      setShowNewCategoryInput(false);
    }, 100);
  };

  const handleSubmit = () => {
    if (!name || rootWords.length === 0 || !categoryId || !definition) {
      toast({
        title: "Missing required fields",
        description: "Please fill in all required fields before submitting.",
        variant: "destructive"
      });
      return;
    }

    // Find the selected category by ID
    const selectedCategory = categories.find(cat => cat.id === categoryId);
    if (!selectedCategory) {
      toast({
        title: "Invalid category",
        description: "Please select a valid category.",
        variant: "destructive"
      });
      return;
    }
    
    // Add the neologism with the proper category
    addNeologism({
      name,
      rootWords,
      categoryId,
      category: selectedCategory.name,
      definition,
      imageUrl: imageUrl || undefined,
      status: "Draft"
    });

    // Reset form and close dialog
    resetForm();
    setOpen(false);
    
    toast({
      title: "Neologism added",
      description: "Your neologism has been added as a draft.",
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="bg-neologism-accent hover:bg-neologism-accent/90">
          <PlusCircle className="mr-2 h-4 w-4" /> Add Neologism
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add a New Neologism</DialogTitle>
          <DialogDescription>
            Create your own neologism. All fields except image are required.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {/* Root Words input - moved to the top */}
          <div className="grid gap-2">
            <Label htmlFor="rootWords">Root Words (Max 4)</Label> {/* Changed from 3 to 4 */}
            <div className="flex gap-2">
              <Input
                id="rootWords"
                placeholder="Add a root word"
                value={currentRootWord}
                onChange={(e) => setCurrentRootWord(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddRootWord();
                  }
                }}
              />
              <Button type="button" onClick={handleAddRootWord} disabled={rootWords.length >= 4}> {/* Changed from 3 to 4 */}
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {rootWords.map((word) => (
                <Badge key={word} className="bg-neologism-primary flex items-center gap-1">
                  {word}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => handleRemoveRootWord(word)} 
                  />
                </Badge>
              ))}
            </div>
          </div>
          
          {/* Neologism Name - moved after root words */}
          <div className="grid gap-2">
            <Label htmlFor="name">Neologism Name</Label>
            <Input
              id="name"
              placeholder="Enter the neologism"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="category">Category</Label>
            {showNewCategoryInput ? (
              <div className="flex gap-2">
                <Input
                  id="newCategory"
                  placeholder="New category name"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                />
                <Button type="button" onClick={handleCreateCategory}>
                  Create
                </Button>
                <Button 
                  type="button" 
                  variant="ghost"
                  onClick={() => setShowNewCategoryInput(false)}
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <>
                <Select value={categoryId} onValueChange={setCategoryId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  type="button"
                  variant="outline"
                  className="mt-2"
                  onClick={() => setShowNewCategoryInput(true)}
                >
                  <PlusCircle className="mr-2 h-4 w-4" /> Add New Category
                </Button>
              </>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="definition">Definition</Label>
            <Textarea
              id="definition"
              placeholder="Provide a detailed definition"
              value={definition}
              onChange={(e) => setDefinition(e.target.value)}
              className="min-h-[100px] resize-none"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="image">Image URL (Optional)</Label>
            <Input
              id="image"
              placeholder="Enter an image URL"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose ref={closeRef} />
          <Button type="submit" onClick={handleSubmit} className="bg-neologism-accent hover:bg-neologism-accent/90">
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
