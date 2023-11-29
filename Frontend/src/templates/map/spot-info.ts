import { editIcon, deleteIcon } from "../../constant/svg-icon"

export const spotInfo = `
<div id="spot-detail" class="absolute w-screen bottom-20 flex justify-center items-center gap-4 bg-black text-white p-4 hidden">
  <div>
    <img 
      id="spot-img" 
      class="w-[60px] h-[60px] rounded-full cursor-pointer" 
      src="https://avatars.dicebear.com/api/adventurer-neutral/mail%40ashallendesign.co.uk.svg" 
      alt="spot-img"
    >
  </div>
  <div class="flex flex-col w-[80%] gap-1">
    <p id="spot-name" class="font-semibold text-lg"></p>
    <div id="info-div" class="hidden">
      <p id="spot-info"></p>
      <p id="spot-update-time" class="text-xs text-slate-300 self-end"></p>
      <i id="edit-icon" class="absolute right-4 top-4 cursor-pointer hidden">${editIcon}</i>
    </div>
    <div id="edit-div" class="hidden">
      <textarea 
      id="spot-info-input" 
      class="px-1 w-full h-[60px] rounded-md border-2 border-gray-300"
      style="color: black" 
      placeholder="Describe your sharing infomation..."
      ></textarea>
      <button
      id="add-spot-submit-btn"
      class="items-center flex-row text-sm font-semibold bg-rose-500 text-white py-1 px-2 rounded hover:bg-rose-700 self-end"
      ></button>
      <i id="delete-icon" class="absolute right-4 top-4 cursor-pointer ">${deleteIcon}</i>
    </div>
  </div>
</div>
`