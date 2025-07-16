let count = 0;

export function getIdPrefix() {
  return 'screenshot_';
}

export function uid(prefix?: string) {
  count++;
  // Chuyển đổi timestamp thành chuỗi base36
  const base36 = Date.now().toString(36);
  // Lấy 5 ký tự ngẫu nhiên từ phần thập phân của số ngẫu nhiên
  const randomChars = Math.random().toString(36).substring(2, 5);
  return `${prefix || getIdPrefix()}${base36 + count + randomChars}`;
}

export function uid2() {
  count++;
  // Chuyển đổi timestamp thành chuỗi base36
  const base36 = Date.now().toString(36);
  // Lấy 5 ký tự ngẫu nhiên từ phần thập phân của số ngẫu nhiên
  const randomChars = Math.random().toString(36).substring(2, 5);

  return `id_${base36 + count + randomChars}`;
}
