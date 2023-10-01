export const chatAreaTemplate = `  <div
class="w-full container mx-auto px-2 py-8 flex flex-col h-screen justify-between"
>
<div id="message-area" class="w-full h-[90%] mx-auto overflow-y-auto">
    <!-- Chat messages -->
</div>

<!-- Chat input -->
<div class="flex">
    <input
        id="message-input"
        type="text"
        placeholder="Type your message..."
        class="flex-1 bg-black rounded-l-lg p-2 outline-none text-white"
    />
    <button 
    id="post-button"
    class="bg-red-600 text-white px-4 rounded-r-lg">
        Send
    </button>
</div>
</div>`;
