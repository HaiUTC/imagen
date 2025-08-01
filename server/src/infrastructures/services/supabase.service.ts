import { createClient } from '@supabase/supabase-js';
import { decode } from 'base64-arraybuffer';

const createSupabaseService = () => {
  const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!);

  const uploadImageToSupabase = async (image: string, type: 'base64' | 'url', uniqueId: string) => {
    let dataUploadSuccess = '';
    if (type === 'base64') {
      const { data, error } = await supabase.storage.from('images').upload(`${uniqueId}.png`, decode(image), {
        contentType: 'image/png',
      });

      if (data) {
        dataUploadSuccess = data.path;
      }

      if (error) {
        throw new Error(error.message);
      }
    } else {
      const response = await fetch(image);
      const blob = await response.blob();

      const { data, error } = await supabase.storage.from('images').upload(`${uniqueId}.jpeg`, blob, {
        contentType: 'image/jpeg',
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data) {
        dataUploadSuccess = data.path;
      }
    }

    const { data: publicUrl } = supabase.storage.from('images').getPublicUrl(dataUploadSuccess);

    return publicUrl.publicUrl;
  };

  return { uploadImageToSupabase };
};

export const supabaseService = createSupabaseService();
