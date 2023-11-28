export const momentTemplate = `  
 
<div class="w-full h-[100%] container bg-red-400 mx-auto flex flex-col justify-between pb-20">
<div id="contact-name" class="text-lg font-semibold flex-1 bg-red-400 p-4 text-black">Food Posts</div>


<!-- Chat input -->
<div class="flex bg-black p-4 mb-4" >
    <input
        id="message-input"
        type="text"
        placeholder="Please Share Something..."
        class="flex-1 bg-black rounded-l-lg p-2 outline-none text-white"
    />
    <button 
    id="post-button"
    class="bg-red-600 text-white px-4 rounded-md">
       Post
    </button>
</div>

<div id="post-area" class=" w-full px-2 h-[100%] mx-auto overflow-y-auto ">
    <!-- Post messages -->

</div>


</div>`;

export const postTemplate = `

<!-- User Info -->
<div class="flex items-center mb-2">
   
    <div>
        <h2 id="post-author" class="text-lg text-white font-semibold">John Doe</h2>
        <p id="post-age"  class="text-white text-sm"> 2 hours ago</p>
    </div>
</div>
<!-- Post Content -->
<p id="post-content" 
class="text-white mb-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque in nulla ut metus cursus commodo non vitae nibh.</p>
`;

export const heartLikeSvg = ` <svg class="w-5 h-5 " viewBox="0 0 24 24">
<path d="M12 21.35l-1.45-1.32C5.4 14.25 2 11.39 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C14.09 3.81 15.76 3 17.5 3 20.58 3 23 5.42 23 8.5c0 2.89-3.4 5.75-8.55 11.54L12 21.35z"/>
</svg>`;

export const heartUnlikeSvg = ` <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24">
<path d="M12 21.35l-1.45-1.32C5.4 14.25 2 11.39 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C14.09 3.81 15.76 3 17.5 3 20.58 3 23 5.42 23 8.5c0 2.89-3.4 5.75-8.55 11.54L12 21.35z"/>
</svg>`;
