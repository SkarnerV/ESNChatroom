export const JoinWaitlistModalTemplate = `
<div id="join-waitlist-modal" class="fixed inset-0 flex items-center justify-center z-50">
  <div class="modal-container bg-white w-11/12 md:w-2/3 lg:w-1/2 xl:w-1/3 mx-auto rounded shadow-lg z-50 overflow-y-auto">
    <div class="modal-content py-4 px-6 relative bg-red-500 text-white">

      <!-- Modal Title -->
      <div class="text-xl text-center font-semibold mb-4">Join Waitlist</div>
      <div id="waitlist-food-input-container"></div>
      <div  class="flex bg-black p-4">
        <input id="waitlist-food-input" type="text" placeholder="Type what you need..." class="flex-1 bg-black rounded-l-lg p-2 outline-none text-white"/>
      </div>

      <!-- Action buttons -->
      <div class="flex justify-between items-center">
        <button id="confirm-join-button" class="font-semibold bg-red-700 text-white px-2 py-2 rounded-md hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-700 focus:ring-opacity-50">
          Donate
        </button>
        <button id="cancel-join-button" class="font-semibold bg-gray-300 text-black px-2 py-2 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-opacity-50">
          Cancel
        </button>
      </div>

    </div>
  </div>
</div>
`;
