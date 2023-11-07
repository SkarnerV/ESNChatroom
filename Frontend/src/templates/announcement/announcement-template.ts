export const announcementTemplate = `
<div class="w-full " >

<div id="announcement-area" class="w-full">
<div class="flex items-center py-2 px-4 bg-gray-500 text-white justify-between w-full">
  <div id="contact-name" class="text-lg font-semibold flex-1">Announcement</div>
  <img
      id="search-icon"
      src="https://cdn-icons-png.flaticon.com/512/54/54481.png" 
      class="w-6 h-6 ml-auto cursor-pointer filter invert"/>
  
</div>
<div class="flex w-full">

<div class="bg-black items-center p-4 shadow-md  w-full">
 
  <div class="flex justify-between items-center mb-2">
    <div class="flex space-x-2 justify-between items-center">
      <span id="announcement-sender" class="text-white font-semibold">
      <!--Announcement Sender-->
      </span>
   
    </div>
    <span id="announcement-time" class="text-white"> 
     <!--Announcement Time-->
     </span>
  </div>
  <p id="announcement-content" class=" text-white break-normal break-all">
  <!--Announcement Content-->
  </p>
</div>
</div>
</div>

<!-- Announcement input -->
<div class="flex bg-black p-4">
    <input
        id="announcement-input"
        type="text"
        placeholder="Post Announcement"
        class="flex-1 bg-black rounded-l-lg p-2 outline-none text-white"
    />
    <button 
    id="announcement-button"
    class="bg-red-600 text-white px-4 rounded-md">
        Post
    </button>
</div>
</div>`;
