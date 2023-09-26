export const authFromStatic = `

<h1 class="text-red-500 text-center font-bold text-2xl mb-5">Emergency Social Network</h1>
<div class="bg-white p-8 rounded shadow-md w-[100%]">

<form>
  <div class="mb-4">
    <label
      for="username"
      class="block text-gray-600 text-sm font-medium mb-2"
      >Username</label
    >
    <input
      id="username"
      name="username"
      class="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
      required
    />
  </div>
  <div class="mb-4">
    <label
      for="password"
      class="block text-gray-600 text-sm font-medium mb-2"
      >Password</label
    >
    <input
      type="password"
      id="password"
      name="password"
      class="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
      required
    />
  </div>
  <div class="mb-4">
  <button type="submit" class="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition duration-300">Join</button>
  </div>
</form>
</div>
  `;
