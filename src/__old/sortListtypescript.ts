interface Entry {
  listYm: string;
  con: number;
}

interface Month {
  ym: string;
  list: Entry[];
}

interface ConvertedMonth {
  ym: string;
  list: {
    listYm: string;
    dayList: { con: number }[];
  }[];
}

// Sample data
const ARR_OBJ: Month[] = [
  {
    ym: "202406",
    list: [
      { listYm: "20240615", con: 1 },
      { listYm: "20240615", con: 2 },
      { listYm: "20240606", con: 3 },
    ],
  },
  {
    ym: "202405",
    list: [],
  },
  {
    ym: "202404",
    list: [
      { listYm: "20240429", con: 4 },
      { listYm: "20240412", con: 5 },
      { listYm: "20240412", con: 6 },
    ],
  },
  {
    ym: "202403",
    list: [
      { listYm: "20240319", con: 4 },
      { listYm: "20240319", con: 8 },
      { listYm: "20240301", con: 11 },
    ],
  },
  {
    ym: "202402",
    list: [],
  },
  {
    ym: "202401",
    list: [
      { listYm: "20240122", con: 5 },
      { listYm: "20240121", con: 78 },
      { listYm: "20240121", con: 12 },
    ],
  },
];

// Conversion to ARR2
const ARR2_OBJ: ConvertedMonth[] = ARR_OBJ.map((month) => {
  const dayMap: { [listYm: string]: { con: number }[] } = {};

  month.list.forEach((entry) => {
    if (!dayMap[entry.listYm]) {
      dayMap[entry.listYm] = [];
    }
    dayMap[entry.listYm].push({ con: entry.con });
  });

  const list = Object.keys(dayMap)
    .map((listYm) => ({
      listYm,
      dayList: dayMap[listYm],
    }))
    .sort((a, b) => b.listYm.localeCompare(a.listYm));

  return {
    ym: month.ym,
    list: list,
  };
}).filter((month) => month.list.length > 0);

console.log(JSON.stringify(ARR2_OBJ, null, 2));
