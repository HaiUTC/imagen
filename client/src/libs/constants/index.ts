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
  {
    id: "1:2",
    name: "1:2    ",
    exclude: ["normal", "plus", "ultra"],
  },
  {
    id: "1:3",
    name: "1:3     ",
    exclude: ["normal", "plus", "ultra"],
  },
  {
    id: "2:1",
    name: "2:1    ",
    exclude: ["normal", "plus", "ultra"],
  },
  {
    id: "2:3",
    name: "2:3    ",
    exclude: ["normal", "plus", "ultra"],
  },
  {
    id: "3:1",
    name: "3:1    ",
    exclude: ["normal", "plus", "ultra"],
  },
  {
    id: "3:2",
    name: "3:2    ",
    exclude: ["normal", "plus", "ultra"],
  },
  {
    id: "3:4",
    name: "3:4    ",
  },
  {
    id: "4:3",
    name: "4:3    ",
  },
  {
    id: "4:5",
    name: "4:5    ",
    exclude: ["normal", "plus", "ultra"],
  },
  {
    id: "5:4",
    name: "5:4    ",
    exclude: ["normal", "plus", "ultra"],
  },
  {
    id: "9:16",
    name: "9:16    ",
    exclude: ["normal", "plus", "ultra"],
  },
  {
    id: "10:16",
    name: "10:16    ",
    exclude: ["normal", "plus", "ultra"],
  },
  {
    id: "16:9",
    name: "16:9    ",
  },
  {
    id: "16:10",
    name: "16:10    ",
    exclude: ["normal", "plus", "ultra"],
  },
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
