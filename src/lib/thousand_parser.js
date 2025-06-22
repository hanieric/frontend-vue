const parseToThousand = (value) => {
  if (!value) return "0";

  value = String(value);
  // Hapus spasi di awal dan akhir
  value = value.trim();

  if (value === "") {
    value = "0";
    return value;
  }

  if (value.length == 2 && value[1] !== "." && value[0] === "0") {
    value = value.replace("0", "");
    return value;
  }

  // Hanya izinkan satu titik desimal
  const firstDot = value.indexOf(".");
  if (firstDot !== -1) {
    // Hapus semua titik setelah yang pertama
    value =
      value.slice(0, firstDot + 1) +
      value.slice(firstDot + 1).replace(/\./g, "");
  }

  if ((value.match(/\./g) || []).length > 1) {
    // Jika ada lebih dari satu titik, hapus titik terakhir yang dimasukkan
    value =
      value.slice(0, value.lastIndexOf(".")).replace(/\./g, "") +
      value.slice(value.lastIndexOf("."));
  }

  // Hanya izinkan angka, koma, dan titik
  value = value.replace(/[^0-9,.]/g, "");

  // Tambahkan koma setiap 3 digit dari belakang
  let parts = value.replace(/,/g, "").split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  value = parts.join(".");

  return value;
};

const parseToNumber = (value) => {
  if (!value) return 0;

  // Hapus spasi di awal dan akhir
  value = value.trim();

  const firstDot = value.indexOf(".");
  let parts;
  if (firstDot !== -1) {
    parts = [value.slice(0, firstDot), value.slice(firstDot + 1)];
  } else {
    parts = [value];
  }
  // Remove commas from the thousand part
  parts[0] = parts[0].replace(/,/g, "");
  // Join back with dot if decimal exists
  const joined = parts.join(firstDot !== -1 ? "." : "");
  // Parse into number
  return Number(joined);
};

export { parseToThousand, parseToNumber };
