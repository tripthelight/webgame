interface Dividend {
  jobNm: string;
  stbdCoce: string;
  stbdNm: string;
  procYmd: string;
  baseYmd: string;
  dvdnBaseYmd: string;
  cashPrvsYmd: string;
  exptDvidAmt: string;
  rghtCahsDvidamt: string;
  txonP1dClosvAmt: string | null;
  asgnTypeCode: string;
  yearInvest: string;
  joinDate: string;
  pssQty: number;
  yearInText: string;
  exptDvidAmt1: number;
  rghtCashDvidamt1: number;
  txonP1dClosvAmt1: number;
  p1dClosv: string;
  pssItmsYn: string;
  concItmsYn: string;
  divdYn: string;
  myDrawerYn: string;
  antciDvdnMonth: string;
}

interface GroupedDividends {
  dvdnBaseYmd: string;
  mydividends: Dividend[];
  dividends: Dividend[];
}

const dvdnList2: Dividend[] = [
  // ... the initial array of objects
];

const groupByDvdnBaseYmd2 = (list: Dividend[]): GroupedDividends[] => {
  const grouped: { [key: string]: GroupedDividends } = {};

  list.forEach((item) => {
    if (!grouped[item.dvdnBaseYmd]) {
      grouped[item.dvdnBaseYmd] = {
        dvdnBaseYmd: item.dvdnBaseYmd,
        mydividends: [],
        dividends: [],
      };
    }

    const dividendEntry: Dividend = { ...item };

    if (item.pssItmsYn === "Y") {
      grouped[item.dvdnBaseYmd].mydividends.push(dividendEntry);
    } else {
      grouped[item.dvdnBaseYmd].dividends.push(dividendEntry);
    }
  });

  return Object.values(grouped);
};

const dvdnList2Arr: GroupedDividends[] = groupByDvdnBaseYmd2(dvdnList2);

console.log(dvdnList2Arr);
