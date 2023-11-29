import {
  homeIcon,
  iconWaitlist,
  publicChatIcon,
  userDirectoryIcon,
  mapIcon
} from "../../constant/svg-icon";

export const navBarContainer = `
<div class="pb-5 pt-3 flex flex-grow fixed bottom-0 left-0 right-0 justify-around items-center bg-black py-2 px-4 text-white">
    <button id="direct-home" class="w-16 font-semibold text-sm flex flex-col flex-row items-center bg-black text-white p-1 rounded-full transition-colors">
        ${homeIcon}
    </button>

    <button id="direct-map" class="w-16 font-semibold text-sm flex flex-col flex-row items-center bg-black text-white p-1 rounded-full transition-colors">
        ${mapIcon}
    </button>

    <button id="direct-chat" class="w-16 font-semibold text-sm flex flex-col flex-row items-center bg-black text-white p-1 rounded-full transition-colors">
        ${publicChatIcon}
    </button>

    <button id="direct-directory" class="w-16 font-semibold text-sm flex flex-col flex-row items-center bg-black text-white px-1 py-1 rounded-full transition-colors"> 
        ${userDirectoryIcon}
    </button>

    <button id="direct-waitlist" class="w-16 font-semibold text-sm flex flex-col flex-row items-center bg-black text-white px-1 py-1 rounded-full transition-colors"> 
        ${iconWaitlist}
    </button>
</div>
`;
