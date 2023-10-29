import { dropDownIcon } from "../../constant/svg-icon";

export const bannerTemplate = ` <div class="flex  justify-between items-center py-2 px-4 bg-black text-white">
<p id="home-page-header" class="font-semibold">Directory</p>
<div class="flex space-x-2 justify-between items-center">
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
