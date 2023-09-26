export const authFromStatic = `
<div class="text-red-500 text-center font-bold text-2xl mb-5">
  Emergency Social Network
</div>
<div class="text-black text-center font-bold text-l mb-2">
  Join the community!
</div>
<div class="text-black text-center text-base mb-2 max-w-md">
  If you don't have an account yet, you can easily create one by clicking on the
  'Join' button.
</div>
<div class="bg-white p-8 rounded shadow-md w-[100%]">
  <div class="mb-4">
    <label for="username" class="block text-gray-600 text-sm font-medium mb-2"
      >Username</label
    >
    <input
      id="username"
      name="username"
      class="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
    />
  </div>
  <div class="mb-4">
    <label for="password" class="block text-gray-600 text-sm font-medium mb-2"
      >Password</label
    >
    <input
      type="password"
      id="password"
      class="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
    />
  </div>
  <div class="mb-4">
    <button
      id="join-button"
      class="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition duration-300"
    >
      Join
    </button>
  </div>
</div>


  `;
