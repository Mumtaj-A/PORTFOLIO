document.addEventListener('DOMContentLoaded', () => {
    // Style Switcher Toggler
    const styleSwitcherToggler = document.querySelector('.style-switcher-toggler');
    const styleSwitcher = document.querySelector('.style-switcher');
    
    styleSwitcherToggler.addEventListener('click', () => {
        styleSwitcher.classList.toggle('open');
    });

    // Day/Night Mode
    const dayNight = document.querySelector('.day-night');
    dayNight.addEventListener('click', () => {
        const isDark = document.body.classList.contains('dark');
        
        if (isDark) {
            document.body.classList.remove('dark');
            document.body.classList.add('light');
            dayNight.querySelector('i').classList.remove('fa-sun');
            dayNight.querySelector('i').classList.add('fa-moon');
            localStorage.setItem('themeMode', 'light');
        } else {
            document.body.classList.remove('light');
            document.body.classList.add('dark');
            dayNight.querySelector('i').classList.remove('fa-moon');
            dayNight.querySelector('i').classList.add('fa-sun');
            localStorage.setItem('themeMode', 'dark');
        }
    });

    // Load saved theme mode
    const savedTheme = localStorage.getItem('themeMode') || 'dark';
    if (savedTheme === 'light') {
        document.body.classList.remove('dark');
        document.body.classList.add('light');
        dayNight.querySelector('i').classList.remove('fa-sun');
        dayNight.querySelector('i').classList.add('fa-moon');
    } else {
        document.body.classList.add('dark');
        dayNight.querySelector('i').classList.remove('fa-moon');
        dayNight.querySelector('i').classList.add('fa-sun');
    }

    // ===========================
    // Theme Colors (class-based)
    // ===========================
    window.setTheme = function(themeClass) {
        document.body.classList.remove('theme-red','theme-orange','theme-green','theme-blue','theme-pink','theme-purple','theme-cyan','theme-teal','theme-amber','theme-rose','theme-gradient-purple','theme-gradient-pink','theme-gradient-blue','theme-gradient-mint','theme-gradient-warm');
        document.body.classList.add(themeClass);
        localStorage.setItem('themeClass', themeClass);
    };

    // Load saved theme
    const savedThemeClass = localStorage.getItem('themeClass');
    if (savedThemeClass) {
        document.body.classList.add(savedThemeClass);
    }
});
