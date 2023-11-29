import { iconAdd } from "../../constant/svg-icon";

export const foodWaitlistContainer = `
<div class="w-full mx-auto item-center justify-between" style="height: 100dvh">
    <div class="fixed top-0 left-0 right-0 bg-black text-white py-4 px-6 flex justify-between items-center z-20">
      <div class="w-6 flex">
      <button id="waitlist-back-button" class="text-lg text-white bg-transparent border-none cursor-pointer"><</button>
      </div>
      <div id="contact-name" class="text-center text-lg font-semibold flex-1">Food Waitlist</div>
      <button id="drop-waitlist" class="mt-1 w-14 items-center flex-row text-sm font-semibold bg-rose-500 text-white p-1 rounded hover:bg-rose-700">Drop</button>
    </div>

    <div class = "divide-y divide-rose-500 pt-16  style ="padding-bottom: 52px"">
    
      <div id="your-citizen" class = "w-full h-[80%] mx-auto  divide-y divide-rose-500">
        <!-- Donating your food to: section -->
        <div  class="pt-4 px-6 bg-gray-400 overflow-y-auto">
          <div class="text-white font-semibold mb-2">Donating your food to:</div>
        </div>
      </div>

      <div id="other-citizens" class ="w-full h-[80%] mx-auto overflow-y-auto divide-y divide-rose-500">
        <div class="pt-4 px-6 bg-gray-400 overflow-y-auto">
          <div class="text-white font-semibold mb-2">Others:</div>
        </div>

      </div>

    </div>

    <div class="pb-5 pt-10 flex flex-grow fixed bottom-0 left-0 right-0 justify-around items-center bg-black text-white">
      <button id="join-waitlist" class="absolute mb-16 flex items-center justify-center w-12 h-12 bg-white rounded-full hover:bg-rose-700 transition-colors">
        <div class="bg-black flex items-center justify-center w-10 h-10 rounded-full">
            ${iconAdd}
        </div>
      </button>
    </div>
</div>

`;
