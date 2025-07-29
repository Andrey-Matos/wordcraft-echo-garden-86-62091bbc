import { supabase } from "@/integrations/supabase/client";
import { Neologism, Category, NeologismStatus } from '../types/neologism';

// Authentication service
export const authService = {
  async signUp(email: string, password: string, username?: string) {
    const redirectUrl = `${window.location.origin}/`;
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          username: username
        }
      }
    });
    
    if (error) throw error;
    return data;
  },
  
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) throw error;
    return data;
  },
  
  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return true;
  },
  
  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  },
  
  async getCurrentSession() {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return session;
  }
};

// Profile service
export const profileService = {
  async getProfile(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error) throw error;
    return data;
  },
  
  async updateProfile(userId: string, updates: { username?: string }) {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('user_id', userId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};

// Category service
export const categoryService = {
  async getCategories(): Promise<Category[]> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data || [];
  },
  
  async createCategory(name: string): Promise<Category> {
    const { data, error } = await supabase
      .from('categories')
      .insert({ name })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};

// Neologism service
export const neologismService = {
  async getNeologisms(): Promise<Neologism[]> {
    const { data, error } = await supabase
      .from('neologisms')
      .select(`
        *,
        category:categories(name)
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    // Transform the data to match our Neologism type
    return (data || []).map(item => ({
      id: item.id,
      name: item.name,
      rootWords: item.root_words || [],
      categoryId: item.category_id,
      category: item.category?.name,
      definition: item.definition,
      imageUrl: item.image_url,
      status: item.status as NeologismStatus,
      createdAt: new Date(item.created_at)
    }));
  },
  
  async getNeologismById(id: string): Promise<Neologism> {
    const { data, error } = await supabase
      .from('neologisms')
      .select(`
        *,
        category:categories(name)
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      name: data.name,
      rootWords: data.root_words || [],
      categoryId: data.category_id,
      category: data.category?.name,
      definition: data.definition,
      imageUrl: data.image_url,
      status: data.status as NeologismStatus,
      createdAt: new Date(data.created_at)
    };
  },
  
  async createNeologism(neologism: Omit<Neologism, 'id' | 'createdAt'>): Promise<Neologism> {
    const user = await authService.getCurrentUser();
    if (!user) throw new Error('User must be authenticated');
    
    const { data, error } = await supabase
      .from('neologisms')
      .insert({
        name: neologism.name,
        root_words: neologism.rootWords,
        category_id: neologism.categoryId,
        definition: neologism.definition,
        image_url: neologism.imageUrl,
        status: neologism.status,
        user_id: user.id
      })
      .select(`
        *,
        category:categories(name)
      `)
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      name: data.name,
      rootWords: data.root_words || [],
      categoryId: data.category_id,
      category: data.category?.name,
      definition: data.definition,
      imageUrl: data.image_url,
      status: data.status as NeologismStatus,
      createdAt: new Date(data.created_at)
    };
  },
  
  async updateNeologism(id: string, updates: Partial<Neologism>): Promise<Neologism> {
    const user = await authService.getCurrentUser();
    if (!user) throw new Error('User must be authenticated');
    
    const updateData: any = {};
    if (updates.name !== undefined) updateData.name = updates.name;
    if (updates.rootWords !== undefined) updateData.root_words = updates.rootWords;
    if (updates.categoryId !== undefined) updateData.category_id = updates.categoryId;
    if (updates.definition !== undefined) updateData.definition = updates.definition;
    if (updates.imageUrl !== undefined) updateData.image_url = updates.imageUrl;
    if (updates.status !== undefined) updateData.status = updates.status;
    
    const { data, error } = await supabase
      .from('neologisms')
      .update(updateData)
      .eq('id', id)
      .select(`
        *,
        category:categories(name)
      `)
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      name: data.name,
      rootWords: data.root_words || [],
      categoryId: data.category_id,
      category: data.category?.name,
      definition: data.definition,
      imageUrl: data.image_url,
      status: data.status as NeologismStatus,
      createdAt: new Date(data.created_at)
    };
  },
  
  async updateNeologismStatus(id: string, status: NeologismStatus): Promise<Neologism> {
    return this.updateNeologism(id, { status });
  },
  
  async deleteNeologism(id: string): Promise<void> {
    const user = await authService.getCurrentUser();
    if (!user) throw new Error('User must be authenticated');
    
    const { error } = await supabase
      .from('neologisms')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};