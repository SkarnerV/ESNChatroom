export const esnDirectoryContainer = `
  <div class="fixed inset-0 flex items-center justify-center z-50 h-25">
    <div class="modal-overlay fixed inset-0 bg-black opacity-30 z-40"></div>
    <div class="modal-container bg-white w-96 mx-auto rounded shadow-lg z-50 divide-y divide-gray-200">
      <div class="justify-between flex items-center justify-center gap-x-4 py-2 px-4 font-semibold leading-6 text-gray-900 ">
        <p class="flex min-w-0 gap-x-3 font-semibold text-gray-900">Directory</p>
        <button id="quit-directory" class="w-[15%] mt-2 bg-black text-white p-1 rounded hover:bg-gray-800">Quit</button>
      </div>
      <ul id="user-status-list" role="list" class="overflow-y-auto max-h-96 min-h-80 divide-y divide-gray-200"></ul>
    </div>
  </div>
`;
