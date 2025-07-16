import React, { useEffect, useState, useRef } from "react";
import { StyleSheet, FlatList, Pressable } from "react-native"; // THAY ScrollView bằng FlatList
import { Text, View } from "@/components/Themed";
import {
  useForm,
  Controller,
  FieldErrors,
  UseFormHandleSubmit,
  Control,
  UseFormReset,
  UseFormGetValues,
} from "react-hook-form";
import { StockEntry } from "./types";
import {
  TextInput,
  Button,
  Card,
  FAB,
  Portal,
  List,
  IconButton,
} from "react-native-paper";
import { useFrappe } from "@/context/FrappeContext";
import RFIDWithUHFA8, {
  RFIDTagPayload,
  EVENT_RFID_READ,
  EventSubscription,
} from "@/utils/mockup";
import { useColorScheme } from "@/components/useColorScheme";
import Colors from "@/constants/Colors";
import RFIDButton from "@/components/RFIDButton";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import PowerDialog from "@/components/PowerDialog";
import { successNotification, errorNotification } from "@/utils/notification";

type Props = {
  id: string;
  control: Control<StockEntry>;
  handleSubmit: UseFormHandleSubmit<StockEntry>;
  errors: FieldErrors;
  reset: UseFormReset<StockEntry>;
  getValues: UseFormGetValues<StockEntry>;
};

export default function Component({
  id,
  control,
  handleSubmit,
  errors,
  reset,
  getValues,
}: Props) {
  const { db } = useFrappe();
  const colorScheme = useColorScheme();
  const [rfids, setRfids] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [stopRead, setStopRead] = useState<boolean>(true);
  const rfidsRef = useRef(rfids);
  const value = getValues("rfids");
  const [powerDialogVisible, setPowerDialogVisible] = useState(false);

  useEffect(() => {
    rfidsRef.current = rfids; // update ref mỗi khi count đổi
  }, [rfids]);

  useEffect(() => {
    const initData = async () => {
      const data = await db.getDocList("RFID Tag", {
        fields: [
          "name",
          "tag",
          "item",
          "gas_serial_no",
          "warehouse",
          "reinspection_date",
          "color",
          "brand",
        ],
        limit: 10000,
      });
      setRfids(data);
    };
    initData();
  }, []);

  useEffect(() => {
    const subscription = RFIDWithUHFA8.addListener(
      EVENT_RFID_READ,
      (tag: RFIDTagPayload) => {
        addRFID(tag.epc);
      }
    );
    return () => {
      const remove = () => {
        handleStopReadRFID();
        subscription?.remove();
      };
      remove();
    };
  }, []);

  const handleStartReadRFID = async () => {
    try {
      const started = await RFIDWithUHFA8.startReadingRFID();
      if (started) setStopRead(false);
    } catch {}
  };

  const handleStopReadRFID = () => {
    try {
      const stopped = RFIDWithUHFA8.stopReadingRFID();
      if (stopped) setStopRead(true);
    } catch {}
  };

  const handleRestartRFID = async () => {
    const status = RFIDWithUHFA8.freeRFID();
    if (status) {
      const status = RFIDWithUHFA8.initRFID();
      if (status) successNotification("Refresh thành công!");
    }
  };

  const get_new_rfid = (record: any, rfid: string) => {
    const cRfids = rfidsRef.current;
    const rfid_tag = cRfids.find(
      (res: any) =>
        res.name === rfid &&
        !record.rfids?.some((res: any) => res.rfid_tag === rfid)
    );

    if (!rfid_tag) return false;

    const is_valid = is_valid_transfer_logic(record, rfid_tag);
    if (!is_valid) return false;

    return {
      rfid_tag: rfid_tag.tag,
      item: rfid_tag.item,
      gas_serial_no: rfid_tag.gas_serial_no,
      reinspection_date: rfid_tag.reinspection_date,
      color: rfid_tag.color,
      brand: rfid_tag.brand,
    };
  };
  const is_valid_transfer_logic = (record: any, rfid_tag: any) => {
    const transfer_type = record?.stock_entry_type === "Material Transfer";
    const in_stock = rfid_tag?.warehouse === record?.from_warehouse;
    const in_items = record?.items?.some(
      (res: any) => res.item_code === rfid_tag.item
    );

    if (transfer_type && in_stock && in_items) return true;
    return false;
  };

  const addRFID = (rfid: string) => {
    reset((record) => {
      const rfid_row = get_new_rfid(record, rfid);
      if (!rfid_row) return record;

      const new_rfids = [...record.rfids, rfid_row];
      const old_items = record.items?.filter(
        (e) => e.item_code !== rfid_row.item
      );
      const newItems = record.items
        ?.filter((e) => e.item_code === rfid_row.item)
        .map((res) => {
          return {
            ...res,
            qty: new_rfids.length,
            serial_no: `${res.serial_no || ""}\n${rfid}`,
          };
        });

      return {
        ...record,
        items: [...newItems, ...old_items],
        rfids: new_rfids,
      };
    });
  };

  const removeRFID = (rfid: string) => {
    reset((record) => {
      const cRfids = rfidsRef.current;
      const rfid_tag = cRfids.find((res: any) => res.name === rfid);
      const new_rfids = record.rfids.filter((res) => res.rfid_tag !== rfid);

      const old_items = record.items?.filter(
        (e) => e.item_code !== rfid_tag.item
      );
      const newItems = record?.items
        .filter((e) => e.item_code === rfid_tag.item)
        .map((item: any) => {
          const rfids_tags = new_rfids
            ?.filter((e) => e.item === item.item_code)
            .map((e: any) => e.rfid_tag);

          return {
            ...item,
            qty: rfids_tags.length,
            serial_no: rfids_tags.join("\n"),
          };
        });

      return {
        ...record,
        rfids: new_rfids,
        items: [...newItems, ...old_items],
      };
    });
  };

  return (
    <View style={styles.container}>
      <RFIDButton
        stopRead={stopRead}
        onSingle={async () => {
          const tag = await RFIDWithUHFA8.readSingleTag();
          addRFID(tag.epc);
        }}
        onAuto={handleStartReadRFID}
        onStopAuto={handleStopReadRFID}
      />

      <Text style={styles.recordTitle}>Đã đọc {value.length} thẻ RFID</Text>

      {/* FlatList render list đẹp hơn */}
      <FlatList
        data={value}
        keyExtractor={(item, index) => `${item.rfid_tag}-${index}`}
        renderItem={({ item, index }) => (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginVertical: 4,
              paddingHorizontal: 12,
              paddingVertical: 8,
              backgroundColor: "#fff",
              borderRadius: 8,
              shadowColor: "#000",
              shadowOpacity: 0.05,
              shadowOffset: { width: 0, height: 1 },
              shadowRadius: 2,
              elevation: 1, // Android shadow
            }}
          >
            <Text
              style={{
                flex: 1,
                fontSize: 14,
                color: "#333",
                fontWeight: "500",
              }}
            >
              {index + 1}.{" "}
              <Text style={{ color: "#555" }}>
                {item.gas_serial_no} - {item.brand} - {item.color} (
                {item.reinspection_date})
              </Text>
            </Text>

            <Pressable
              onPress={() => removeRFID(item.rfid_tag)}
              style={{
                padding: 6,
                borderRadius: 6,
                backgroundColor: "#f8d7da",
              }}
            >
              <FontAwesome size={16} name="remove" color="#c0392b" />
            </Pressable>
          </View>
        )}
        contentContainerStyle={styles.recordList}
      />
      <FAB.Group
        backdropColor="transparent"
        open={open}
        visible={true}
        icon={open ? "close" : "plus"}
        actions={[
          {
            icon: "cube",
            label: "Power",
            onPress: async () => {
              setPowerDialogVisible(true);
            },
          },
          {
            icon: "refresh",
            label: "Refresh",
            onPress: handleRestartRFID,
          },
        ]}
        onStateChange={({ open }) => setOpen(open)}
      />
      <PowerDialog open={powerDialogVisible} setOpen={setPowerDialogVisible} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flex: 1,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 12,
  },
  button: {
    flex: 1,
    marginHorizontal: 4,
    borderRadius: 10,
  },
  recordTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  recordList: {
    paddingBottom: 50,
  },
  rfidCard: {
    marginBottom: 10,
    elevation: 2,
    borderRadius: 10,
  },
});
