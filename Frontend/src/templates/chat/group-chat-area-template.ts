export const groupChatAreaTemplate = `  
 
<div class="w-full container mx-auto flex flex-col justify-between" style="height: 100dvh">

<!-- Chat Banner -->
<div class="bg-black text-white py-4 px-6 flex justify-between items-center">
    <button id="leave-group-chat-button" class="bg-red-600 text-white px-4 py-2 rounded-lg text-sm shadow hover:bg-red-700">
    Leave
    </button>
    <div id="contact-name" class="text-lg font-semibold flex-1 text-center">Contact Name</div><!-- Contact Name -->
    <button id="settings-button" class="text-lg text-white bg-transparent border-none cursor-pointer">
        &#x22EE;
    </button>
</div>

<!-- Settings Modal -->
<div id="group-settings-modal" class="hidden fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
    <div class="bg-white p-6 rounded-lg shadow-lg">
        <h2 class="text-lg font-bold mb-4">Group Settings (Group Creator Only)</h2>
        <input type="text" id="update-group-name" placeholder="Group Name" class="border p-2 rounded w-full mb-4" />
        <textarea id="update-group-description" placeholder="Group Description" class="border p-2 rounded w-full mb-4"></textarea>
        <div class="flex justify-between">
            <button id="cancel-settings" class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">Cancel</button>
            <button id="update-group" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Update</button>
            <button id="delete-group" class="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">Delete Group</button>
        </div>

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
