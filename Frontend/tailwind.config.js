/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{ts,html}"],
  theme: {
    extend: {},
  },
  safelist: [
    "bg-white",
    "p-8",
    "rounded",
    "shadow-md",
    "w-96",
    "text-2xl",
    "font-semibold",
    "mb-6",
    "mb-4",
    "block",
    "bg-red-100",
    "text-gray-600",
    "text-sm",
    "font-medium",
    "mb-2",
    "w-full",
    "p-2",
    "border",
    " text-black-500 ",
    "focus:outline-none",
    "focus:border-blue-500",
    "email",
    "password",
    "bg-blue-500",
    "text-white",
    "py-2",
    "hover:bg-blue-600",
    "transition",
    "duration-300",
    // Classes used for the "Open Modal" button
    "bg-blue-500",
    "text-white",
    "p-2",
    "rounded",
    "hover:bg-blue-600",

    // Classes used for the modal itself
    "hidden", // Used to hide the modal by default
    "fixed",
    "inset-0",
    "flex",
    "items-center",
    "justify-center",
    "z-50",

    // Classes used for the modal overlay
    "modal-overlay",
    "bg-black",
    "opacity-30",

    // Classes used for the modal container
    "modal-container",
    "bg-white",
    "w-96",
    "mx-auto",
    "rounded",
    "shadow-lg",
    "z-50",
    "overflow-y-auto",

    // Classes used for modal content
    "modal-content",
    "p-4",
    "text-2xl",
    "font-semibold",
    "mb-4",

    // Classes used for the "Close" button
    "bg-red-500",
    "text-white",
    "p-2",
    "rounded",
    "hover:bg-red-600",
  ],
  plugins: [],
};
