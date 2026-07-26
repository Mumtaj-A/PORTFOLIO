document.addEventListener("DOMContentLoaded", () => {
  const styleSwitcherToggler = document.querySelector(
    ".style-switcher-toggler",
  );
  const styleSwitcher = document.querySelector(".style-switcher");
  const dayNight = document.querySelector(".day-night");
  const dayNightIcon = dayNight?.querySelector("i");

  if (!styleSwitcherToggler || !styleSwitcher || !dayNight) {
    return;
  }

  styleSwitcherToggler.addEventListener("click", () => {
    styleSwitcher.classList.toggle("open");
  });

  const applyThemeMode = (isDark) => {
    document.body.classList.toggle("dark", isDark);
    document.body.classList.toggle("light", !isDark);

    if (dayNightIcon) {
      dayNightIcon.classList.toggle("fa-sun", isDark);
      dayNightIcon.classList.toggle("fa-moon", !isDark);
    }

    localStorage.setItem("themeMode", isDark ? "dark" : "light");
  };

  dayNight.addEventListener("click", () => {
    const isDark = !document.body.classList.contains("dark");
    applyThemeMode(isDark);
  });

  const savedTheme = localStorage.getItem("themeMode") || "dark";
  applyThemeMode(savedTheme === "dark");

  window.setTheme = function (themeClass) {
    document.body.classList.remove(
      "theme-red",
      "theme-orange",
      "theme-green",
      "theme-blue",
      "theme-pink",
      "theme-purple",
      "theme-cyan",
      "theme-teal",
      "theme-amber",
      "theme-rose",
      "theme-gradient-purple",
      "theme-gradient-pink",
      "theme-gradient-blue",
      "theme-gradient-mint",
      "theme-gradient-warm",
    );
    document.body.classList.add(themeClass);
    localStorage.setItem("themeClass", themeClass);
  };

  const savedThemeClass = localStorage.getItem("themeClass");
  if (savedThemeClass) {
    document.body.classList.add(savedThemeClass);
  }
});
