
export const toggleDarkMode = () => {
  document.documentElement.classList.toggle('dark');
  
  const isDark = document.documentElement.classList.contains('dark');
  localStorage.setItem('darkMode', isDark);
};

export const initDarkMode = () => {
  const savedMode = localStorage.getItem('darkMode') === 'true';
  if (savedMode) {
    document.documentElement.classList.add('dark');
  }
};

export const isDarkMode = () => {
  return document.documentElement.classList.contains('dark');
};