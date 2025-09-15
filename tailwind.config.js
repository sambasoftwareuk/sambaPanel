module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: {
        custom: "843.75px",
      }, // özel kırılım
      fontFamily: {
        roboto: ["var(--font-roboto)", "sans-serif"],
      },
      colors: {
        primary: "#2dbcbc", // Cam göbeği tonu
        primary900: "#1a7f7f", // Daha koyu cam göbeği tonu
        primary500: "#2dbcbc", // Ana cam göbeği tonu
        primary300: "#7edada", // Açık cam göbeği
        primary50: "#e6f7f7", // Çok açık (nötr, pastel cam göbeği)

        secondary: "#2A3A3F", // Soğuk gri-tonlu lacivert (kontrast için)
        secondary400: "#5A6D73", // Açık duman grisi
        secondary200: "#C5D3D4", // Açık gri-mavi
        secondary100: "#E4EFEF", // Çok açık nötr gri-mavi

        red: "#CC3D4D", // Hafif sıcaklık barındıran kırmızı tonu
        red100: "#F9D3D7", // Açık pembe/kırmızı pastel tonu

        sunshine: "#f6b009", // Turkuaza uyumlu sıcak sarı
        sunshine100: "#FFEAC2", // Açık, yumuşak sarı pastel tonu

        white: "#ffffff", // Değişmedi
        black: "#000000", // Değişmedi

        border: "#d6e3e3", // Cam göbeği temalı açık gri (border için)
      },
    },
  },
  plugins: [],
};
