import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// Declare the supabase variable globally
let supabase;

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL.trim();
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_KEY.trim();

if (!SUPABASE_URL || !SUPABASE_KEY) {
  throw new Error("Supabase environment variables are missing or invalid.");
}

// Initialize Supabase client
try {
  supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
  console.log("Supabase client initialized successfully");
} catch (error) {
  console.error("Failed to initialize Supabase client:", error);
}

console.log("Supabase URL:", SUPABASE_URL);
console.log("Supabase Key:", SUPABASE_KEY);
console.log("Supabase client:", supabase);

async function fetchImagesAndText() {
    try {
      if (!supabase) {
        throw new Error("Supabase client is not initialized.");
      }
  
      const { data, error } = await supabase
        .from('transcriptions')
        .select('image_url, transcription, question, created_at')
        .order('created_at', { ascending: false });
  
      if (error) {
        console.error("Error fetching data:", error);
        return;
      }
  
      console.log("Fetched data:", data);
      renderGallery(data);
    } catch (err) {
      console.error("Error in fetchImagesAndText:", err);
    }
  }
  
function renderGallery(data) {
const gallery = document.getElementById('gallery');
if (!gallery) {
    console.error("Gallery element not found");
    return;
}

gallery.innerHTML = ''; // Clear existing content

data.forEach(item => {
    const div = document.createElement('div');
    div.className = 'gallery-item';

    // Handle null or empty questions
    const questionText = item.question ? item.question.trim() : 'No question available';

    // Format transcription by splitting on "."
    const formattedTranscription = item.transcription
    .split('.')
    .filter(line => line.trim() !== '') // Remove empty lines
    .map(line => `<p>${line.trim()}.</p>`) // Add periods back
    .join('');

    div.innerHTML = `
    <img src="${item.image_url}" alt="Image">
    <div class="content">
        <span class="question">${questionText}</span>
        ${formattedTranscription}
    </div>
    `;
    gallery.appendChild(div);
});
}

  function subscribeToUpdates() {
    try {
      if (!supabase) {
        throw new Error("Supabase client is not initialized.");
      }
  
      supabase
        .channel('transcriptions')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'transcriptions' },
          async () => {
            console.log("Real-time update received");
            await fetchImagesAndText();
          }
        )
        .subscribe();
    } catch (err) {
      console.error("Error in subscribeToUpdates:", err);
    }
  }
  
  // Fetch initial data and subscribe to updates
  fetchImagesAndText();
  subscribeToUpdates();