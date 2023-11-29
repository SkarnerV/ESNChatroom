import {
  homeIcon,
  iconWaitlist,
  publicChatIcon,
  userDirectoryIcon,
} from "../../constant/svg-icon";

export const esnDirectoryContainer = `
 <div class="flex items-center py-2 px-4 bg-gray-500 text-white justify-between w-full">
    <div id="contact-name" class="text-lg font-semibold flex-1">ESN Directory</div>
    <img
        id="search-icon"
        src="https://cdn-icons-png.flaticon.com/512/54/54481.png" 
        class="w-6 h-6 ml-auto cursor-pointer filter invert"/>
  </div>
  <ul id="user-status-list" role="list" class="flex-grow flex h-[70%] flex-col overflow-y-auto divide-y bg-red-400 divide-rose-500"></ul>

`;
