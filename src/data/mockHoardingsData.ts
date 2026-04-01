export interface HoardingData {
  sNo: number;
  city: string;
  location: string;
  medium: string;
  litType: string;
  width: number;
  height: number;
  unit: number;
  totalSqft: number;
  displayCostPerMonth: number;
  printingCharges: number;
  mountingCharges: number;
  totalCharges: number;
}

export const mockHoardingsData: HoardingData[] = [
  {
    sNo: 1,
    city: "DIMAPUR",
    location: "HONGKONG MARKET",
    medium: "HOARDING",
    litType: "NON LIT",
    width: 40,
    height: 25,
    unit: 1,
    totalSqft: 1000,
    displayCostPerMonth: 65000,
    printingCharges: 10000,
    mountingCharges: 5000,
    totalCharges: 80000
  },
  {
    sNo: 2,
    city: "DIMAPUR",
    location: "MARWARI PATTY NR MAYUR HOTEL",
    medium: "HOARDING",
    litType: "NON LIT",
    width: 25,
    height: 10,
    unit: 2,
    totalSqft: 625,
    displayCostPerMonth: 45000,
    printingCharges: 6250,
    mountingCharges: 3125,
    totalCharges: 54375
  },
  {
    sNo: 3,
    city: "DIMAPUR",
    location: "CIRCUIT HOUSE",
    medium: "HOARDING",
    litType: "NON LIT",
    width: 30,
    height: 30,
    unit: 1,
    totalSqft: 900,
    displayCostPerMonth: 85000,
    printingCharges: 9000,
    mountingCharges: 4500,
    totalCharges: 98500
  },
  {
    sNo: 4,
    city: "DIMAPUR",
    location: "NEW MARKET",
    medium: "UNIPOLE",
    litType: "NON LIT",
    width: 20,
    height: 20,
    unit: 1,
    totalSqft: 400,
    displayCostPerMonth: 85000,
    printingCharges: 4000,
    mountingCharges: 2000,
    totalCharges: 91000
  },
  {
    sNo: 5,
    city: "DIMAPUR",
    location: "OLD SHOWROOM ROAD",
    medium: "HOARDING",
    litType: "NON LIT",
    width: 35,
    height: 20,
    unit: 1,
    totalSqft: 700,
    displayCostPerMonth: 55000,
    printingCharges: 7000,
    mountingCharges: 3500,
    totalCharges: 65500
  },
  {
    sNo: 6,
    city: "DIMAPUR",
    location: "STATION ROAD",
    medium: "HOARDING",
    litType: "NON LIT",
    width: 25,
    height: 15,
    unit: 2,
    totalSqft: 750,
    displayCostPerMonth: 48000,
    printingCharges: 7500,
    mountingCharges: 3750,
    totalCharges: 59250
  },
  {
    sNo: 7,
    city: "DIMAPUR",
    location: "PURANA BAZAR",
    medium: "UNIPOLE",
    litType: "NON LIT",
    width: 22,
    height: 18,
    unit: 1,
    totalSqft: 396,
    displayCostPerMonth: 42000,
    printingCharges: 3960,
    mountingCharges: 1980,
    totalCharges: 47940
  },
  {
    sNo: 8,
    city: "DIMAPUR",
    location: "DZÜVÜRÜ POINT",
    medium: "HOARDING",
    litType: "NON LIT",
    width: 45,
    height: 30,
    unit: 1,
    totalSqft: 1350,
    displayCostPerMonth: 95000,
    printingCharges: 13500,
    mountingCharges: 6750,
    totalCharges: 115250
  },
  {
    sNo: 9,
    city: "DIMAPUR",
    location: "NH-29 NEAR MEDICITY",
    medium: "HOARDING",
    litType: "NON LIT",
    width: 50,
    height: 25,
    unit: 1,
    totalSqft: 1250,
    displayCostPerMonth: 75000,
    printingCharges: 12500,
    mountingCharges: 6250,
    totalCharges: 93750
  },
  {
    sNo: 10,
    city: "DIMAPUR",
    location: "CHUMOUKEDIMA JUNCTION",
    medium: "HOARDING",
    litType: "NON LIT",
    width: 40,
    height: 20,
    unit: 1,
    totalSqft: 800,
    displayCostPerMonth: 68000,
    printingCharges: 8000,
    mountingCharges: 4000,
    totalCharges: 80000
  }
];
