export const EVENT_RFID_READ = "";
export type EventSubscription = {
  remove: () => void;
};
export type RFIDTagPayload = {
  epc: string;
  tid: string;
  user: string;
  rssi: string;
  ant: string;
  message: string;
};

let interval = 0;
let startRead = false;

export type powerPayload = { antenna: string; power: number };

const RFIDWithUHFA8 = {
  initRFID: () => {
    return true;
  },
  readSingleTag: async () => ({
    epc: "E28011700000021ABC48825B",
    tid: "E28011700000021ABC48825B",
    user: "E28011700000021ABC48825B",
    rssi: "E28011700000021ABC48825B",
    ant: "E28011700000021ABC48825B",
    message: "E28011700000021ABC48825B",
  }),
  freeRFID: () => {
    return true;
  },
  setInventoryCallback: async () => {},
  addListener: (
    one: string,
    two: (three: RFIDTagPayload) => void
  ): EventSubscription => {
    setInterval(() => {
      if (!startRead) return;
      two({
        epc: "E28011700000021ABC48825B",
        tid: "E28011700000021ABC48825B",
        user: "E28011700000021ABC48825B",
        rssi: "E28011700000021ABC48825B",
        ant: "E28011700000021ABC48825B",
        message: "E28011700000021ABC48825B",
      });
    }, 100);
    return { remove: () => {} };
  },
  startReadingRFID: () => {
    startRead = true;
    return true;
  },
  stopReadingRFID: () => {
    startRead = false;
    return true;
  },
  getRFIDVersion: () => {
    return "true";
  },
  getWorkingMode: () => {
    return "5";
  },
  setAntenna1Power: (one: number) => {
    return { antenna: "", power: 5 };
  },
  getPower: () => {
    return [{ antenna: "1", power: 5 }];
  },
};

export default RFIDWithUHFA8;
