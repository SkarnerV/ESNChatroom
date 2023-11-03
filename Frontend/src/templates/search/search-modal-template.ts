export const SearchModalTemplate = `
<div class="fixed inset-0 flex items-center justify-center z-50">
  <div class="modal-container bg-white w-11/12 md:w-2/3 lg:w-1/2 xl:w-1/3 mx-auto rounded shadow-lg z-50 overflow-y-auto">
    <div class="modal-content p-1 relative">
      
      <!-- Close Button on Top Right -->
      <button id="close-button" class="cursor-pointer absolute top-3 right-4" style="font-size: 20px; background-color: #f5f5f8; color: #555; width: 30px; height: 30px; border-radius: 20%; transition: background-color 0.3s, color 0.3s;">
        X
      </button>

      <!-- Modal Title -->
      <div class="text-2xl text-center font-semibold text-gray-600 mt-2 mb-4">Search</div>

      <!-- Search input -->
      <div class="flex flex-col">
        <div class="flex px-3 py-1 mb-1">
          <input id="search-input" type="text" placeholder="Type your search keyword..." class="flex-1 rounded p-2 outline-none text-black border border-gray-300"/>
          <button id="search-button" class="bg-red-600 text-white px-2 rounded-md  ml-2">Search</button>
        </div>
        
      </div>

      <div id="search-result-area" class="w-full px-2 h-[300px] mx-auto overflow-y-auto">
          <!-- messages/ citizens -->
      </div>

    </div>
  </div>
</div>
`;
