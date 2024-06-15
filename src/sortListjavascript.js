const ARR = [
  {
    ym: "202406",
    list: [
      {
        listYm: "20240615",
        con: 1,
      },
      {
        listYm: "20240615",
        con: 2,
      },
      {
        listYm: "20240606",
        con: 3,
      },
    ],
  },
  {
    ym: "202405",
    list: [],
  },
  {
    ym: "202404",
    list: [
      {
        listYm: "20240429",
        con: 4,
      },
      {
        listYm: "20240412",
        con: 5,
      },
      {
        listYm: "20240412",
        con: 6,
      },
    ],
  },
  {
    ym: "202403",
    list: [
      {
        listYm: "20240319",
        con: 4,
      },
      {
        listYm: "20240319",
        con: 8,
      },
      {
        listYm: "20240301",
        con: 11,
      },
    ],
  },
  {
    ym: "202402",
    list: [],
  },
  {
    ym: "202401",
    list: [
      {
        listYm: "20240122",
        con: 5,
      },
      {
        listYm: "20240121",
        con: 78,
      },
      {
        listYm: "20240121",
        con: 12,
      },
    ],
  },
];

/*
const ARR2 = [
  {
    "ym": "202406",
    "list": [
      {
        "listYm": "20240615",
        "dayList": [
          {
            "con": 1
          },
          {
            "con": 2
          }
        ]
      },
      {
        "listYm": "20240606",
        "dayList": [
          {
            "con": 0
          }
        ]
      }
    ]
  },
  {
    "ym": "202404",
    "list": [
      {
        "listYm": "20240429",
        "dayList": [
          {
            "con": 4
          }
        ]
      },
      {
        "listYm": "20240412",
        "dayList": [
          {
            "con": 5
          },
          {
            "con": 6
          }
        ]
      }
    ]
  },
  {
    "ym": "202403",
    "list": [
      {
        "listYm": "20240319",
        "dayList": [
          {
            "con": 4
          },
          {
            "con": 8
          }
        ]
      },
      {
        "listYm": "20240301",
        "dayList": [
          {
            "con": 11
          }
        ]
      }
    ]
  },
  {
    "ym": "202401",
    "list": [
      {
        "listYm": "20240122",
        "dayList": [
          {
            "con": 5
          }
        ]
      },
      {
        "listYm": "20240121",
        "dayList": [
          {
            "con": 78
          },
          {
            "con": 12
          }
        ]
      }
    ]
  }
]
*/

const ARR2 = ARR.map((month) => {
  const dayMap = {};

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

// console.log(JSON.stringify(ARR2, null, 2));
console.log(ARR2);
