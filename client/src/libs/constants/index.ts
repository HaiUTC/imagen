export const DEFAULT_IMAGE_GEN_MODEL = [
  // {
  //   id: 'normal',
  //   name: 'Normal (Gen4 Fast)',
  // },
  {
    id: "plus",
    name: "Plus (Gen4)",
  },
  {
    id: "pro",
    name: "Pro (Ideogram3)",
  },
  {
    id: "ultra",
    name: "Ultra (Gen4 Ultra)",
  },
];

export const DEFAULT_IMAGE_MIXED_GEN_MODEL = [
  {
    id: "pro",
    name: "Pro (Ideogram3)",
  },
];

export const DEFAULT_NUMBER_RESULT = [
  {
    id: "1",
    name: "1",
  },
  {
    id: "2",
    name: "2",
    exclude: ["normal", "plus", "ultra"],
  },
  {
    id: "3",
    name: "3",
    exclude: ["normal", "plus", "ultra"],
  },
  {
    id: "4",
    name: "4",
    exclude: ["normal", "plus", "ultra"],
  },
];

export const DEFAULT_ASPECT_RATIO = [
  {
    id: "1:1",
    name: "1:1   ",
  },
  // {
  //   id: "1:2",
  //   name: "1:2    ",
  //   exclude: ["normal", "plus", "ultra"],
  // },
  // {
  //   id: "1:3",
  //   name: "1:3     ",
  //   exclude: ["normal", "plus", "ultra"],
  // },
  // {
  //   id: "2:1",
  //   name: "2:1    ",
  //   exclude: ["normal", "plus", "ultra"],
  // },
  // {
  //   id: "2:3",
  //   name: "2:3    ",
  //   exclude: ["normal", "plus", "ultra"],
  // },
  // {
  //   id: "3:1",
  //   name: "3:1    ",
  //   exclude: ["normal", "plus", "ultra"],
  // },
  // {
  //   id: "3:2",
  //   name: "3:2    ",
  //   exclude: ["normal", "plus", "ultra"],
  // },
  {
    id: "3:4",
    name: "3:4    ",
  },
  {
    id: "4:3",
    name: "4:3    ",
  },
  // {
  //   id: "4:5",
  //   name: "4:5    ",
  //   exclude: ["normal", "plus", "ultra"],
  // },
  // {
  //   id: "5:4",
  //   name: "5:4    ",
  //   exclude: ["normal", "plus", "ultra"],
  // },
  // {
  //   id: "9:16",
  //   name: "9:16    ",
  //   exclude: ["normal", "plus", "ultra"],
  // },
  // {
  //   id: "10:16",
  //   name: "10:16    ",
  //   exclude: ["normal", "plus", "ultra"],
  // },
  {
    id: "16:9",
    name: "16:9    ",
  },
  // {
  //   id: "16:10",
  //   name: "16:10    ",
  //   exclude: ["normal", "plus", "ultra"],
  // },
];

export const DEFAULT_RESOLUTION = [
  { id: "1024x1024", name: "1024x1024" }, // 1:1 - phổ biến nhất
  { id: "832x1024", name: "832x1024" }, // 5:6 - vertical (portrait)
  { id: "896x1152", name: "896x1152" }, // ~3:4 - vertical
  { id: "768x1024", name: "768x1024" }, // 3:4 - vertical
  { id: "960x1280", name: "960x1280" }, // 3:4 - vertical (nếu có)
  { id: "576x1024", name: "576x1024" }, // slim vertical (rất phổ biến cho story)
  { id: "704x1344", name: "704x1344" }, // ~9:16 - vertical
  { id: "640x1536", name: "640x1536" }, // ~9:16 - vertical
  { id: "512x1536", name: "512x1536" }, // ~9:27 - vertical (poster-like)
  { id: "896x896", name: "896x896" }, // 1:1 - high-res square
  { id: "960x960", name: "960x960" }, // 1:1 - common square
  { id: "1280x960", name: "1280x960" }, // 4:3 - landscape
  { id: "1536x1024", name: "1536x1024" }, // 3:2 - landscape HD
  { id: "1536x640", name: "1536x640" }, // ~21:9 - ultra wide
  { id: "1152x864", name: "1152x864" }, // 4:3 - classic landscape
];

export const DEFAULT_STYLE_GEN = [
  {
    id: "realistic",
    name: "Realistic",
  },
  {
    id: "cartoon",
    name: "Cartoon",
  },
  {
    id: "anime",
    name: "Anime",
  },
  {
    id: "random",
    name: "Random",
  },
];
