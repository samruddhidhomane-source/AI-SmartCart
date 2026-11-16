import { useEffect, useState } from "react";
import { FaMoon, FaSun } from "react-icons/fa";

function ThemeToggle() {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <button
      onClick={() => setDarkMode(!darkMode)}
      className="w-11 h-11 rounded-full bg-gray-100 flex items-center justify-center hover:scale-110 transition"
      title="Toggle theme"
    >
      {darkMode ? (
        <FaSun className="text-yellow-500" />
      ) : (
        <FaMoon className="text-gray-700" />
      )}
    </button>
  );
}

export default ThemeToggle;