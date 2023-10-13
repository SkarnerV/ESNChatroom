import {
  homeIcon,
  publicChatIcon,
  userDirectoryIcon,
} from "../../constants/svg-icon";

export const navBarContainer = `
<div class="pb-5 pt-3 flex flex-grow fixed bottom-0 left-0 right-0 justify-around items-center bg-black py-2 px-4 text-white">
    <button id="direct-home" class="w-16 font-semibold text-sm flex flex-col flex-row -translate-x-1/3 items-center bg-black text-white p-1 rounded-full transition-colors">
        ${homeIcon}
    </button>

    <button id="direct-chat" class="absolute mb-10 flex items-center justify-center w-12 h-12 bg-white rounded-full hover:bg-rose-700 transition-colors">
        <div class="bg-black flex items-center justify-center w-10 h-10 rounded-full">
            ${publicChatIcon}
        </div>
    </button>

    <button id="direct-directory" class="w-16 font-semibold text-sm flex flex-col flex-row translate-x-1/3 items-center bg-black text-white px-1 py-1 rounded-full transition-colors"> 
        ${userDirectoryIcon}
    </button>
</div>
`;
