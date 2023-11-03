export const chatAreaTemplate = `  
 
<div class="w-full container mx-auto flex flex-col justify-between" style="height: 100dvh">

<!-- Chat Banner -->
<div class="bg-black text-white py-4 px-6 flex justify-between items-center">
<div class="w-6 flex">
<button id="chat-back-button" class="text-lg text-white bg-transparent border-none cursor-pointer"><</button>
</div>
<div class="flex items-center justify-between w-full">
        <div id="contact-name" class="text-lg font-semibold flex-1 text-center">Contact Name</div><!-- Contact Name -->
        <img
            id="search-icon"
            src="https://cdn-icons-png.flaticon.com/512/54/54481.png" 
            class="w-6 h-6 ml-auto cursor-pointer filter invert"/>
        
    </div>
</div>


<div id="message-area" class="w-full px-2 h-[80%] mx-auto overflow-y-auto">
    <!-- Chat messages -->
</div>

<!-- Chat input -->
<div class="flex bg-black p-4">
    <input
        id="message-input"
        type="text"
        placeholder="Type your message..."
        class="flex-1 bg-black rounded-l-lg p-2 outline-none text-white"
    />
    <button 
    id="post-button"
    class="bg-red-600 text-white px-4 rounded-md">
        Send
    </button>
</div>
</div>`;
