export const DonateFoodModalTemplate = `
<div class="fixed inset-0 flex items-center justify-center z-50">
  <div class="modal-container bg-white w-11/12 md:w-2/3 lg:w-1/2 xl:w-1/3 mx-auto rounded shadow-lg z-50 overflow-y-auto">
    <div class="modal-content py-4 px-6 relative bg-red-500 text-white">

      <!-- Modal Title -->
      <div id="donate-title" class="text-xl text-center font-semibold mb-4">Donate to: </div>

      <!-- Donation Request -->
      <div class="text-center font-semibold mb-4">
        <p id="donee-username">dsadsadsads</p>
      </div>

      <!-- Action buttons -->
      <div class="flex justify-between items-center">
        <button id="confirm-donate-button" class="bg-red-700 text-white px-4 py-2 rounded-md mr-4 hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-700 focus:ring-opacity-50">
          Yes
        </button>
        <button id="cancel-donate-button" class="bg-gray-300 text-black px-4 py-2 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-opacity-50">
          No
        </button>
      </div>

    </div>
  </div>
</div>
`;
