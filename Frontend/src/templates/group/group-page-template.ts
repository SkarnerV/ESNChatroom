export const GroupPageTemplate = `
<div class="group-page w-full h-full">

  <!-- Header for Group List -->
  <div class="group-list-header bg-black text-white p-4 flex justify-between items-center">
    <h1 class="text-xl font-bold">GROUP LIST</h1>
    <div>
      <button id="create-group" class="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 mr-2">CREATE</button>
      <button id="back-button" class="bg-gray-500 text-white p-2 rounded hover:bg-gray-600">BACK</button>
    </div>
  </div>

  <!-- Group Creation Modal -->
    <div id="group-creation-modal" class="hidden fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
    <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div class="mt-3 text-center">
        <div class="mt-2 px-7 py-3">
            <input type="text" id="group-name" placeholder="Group Name" class="mb-3 w-full border rounded px-3 py-2 text-gray-700 focus:outline-none" />
            <textarea id="group-description" placeholder="Group Description (Optional)" class="w-full border rounded px-3 py-2 text-gray-700 focus:outline-none"></textarea>
        </div>
        <div class="items-center px-4 py-3">
            <button id="cancel-modal" class="px-4 py-2 bg-gray-200 text-gray-900 rounded hover:bg-gray-300">Cancel</button>
            <button id="create-group-btn" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700">Create Group</button>
        </div>
        </div>
    </div>
    </div>

  <!-- List of Groups to Join -->
  <div id="available-groups" class="p-4">
    <!-- Dynamically populated list of available groups -->
  </div>


</div>
`;
