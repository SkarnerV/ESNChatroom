import { dropDownIcon } from "../../constant/svg-icon";

export const bannerTemplate = ` <div class="flex  justify-between items-center py-2 px-4 bg-black text-white">
<p id="home-page-header" class="font-semibold">Directory</p>
<div class="flex space-x-2 justify-between items-center">
    <!-- Group Icon as a Button -->
    <a href="/group" class="flex items-center justify-center w-11 h-11 rounded-full bg-blue-500 hover:bg-blue-600 transition-colors">
        <img src="https://img.icons8.com/?size=512&id=tO9KJmSj69NJ&format=png" alt="Group Chat" class="w-10 h-10">
    </a>
    

  <button
    id="speedtest-directory"
    class="w-16 items-center flex-row text-sm font-semibold bg-gray-500 text-white p-1 rounded hover:bg-gray-700"
  >
    Test
  </button>
  <div class="relative">
    <button
      id="change-status"
      class="inline-flex w-16 items-center text-sm font-semibold bg-rose-500 rounded-t rounded-b text-white p-1 hover:bg-rose-700"
    >
      Status ${dropDownIcon}
    </button>
    <ul
      id="status-dropdown"
      class="items-center justify-between absolute left-0 w-16 bg-white rounded-b shadow-lg hidden"
    >
      
    </ul>
  </div>
  <button
    id="quit-directory"
    class="w-16 items-center flex-row text-sm font-semibold bg-rose-500 text-white p-1 rounded hover:bg-rose-700"
  >
    Logout
  </button>
</div>
</div>`;
