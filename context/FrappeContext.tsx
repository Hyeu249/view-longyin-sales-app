import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  ReactNode,
  useEffect,
} from "react";
import {
  FrappeApp,
  FrappeDB,
  FrappeCall,
  FrappeAuth,
  FrappeFileUpload,
} from "frappe-js-sdk";
export const FRAPPE_URL = "https://thanh.bhieu.com";
import { initSocket } from "@/utils/socket";

// Kiểu Auth
interface Auth {
  api_key: string;
  secret_key: string;
}

// Kiểu context
interface FrappeContextType {
  db: FrappeDB;
  auth: FrappeAuth;
  call: FrappeCall;
  file: FrappeFileUpload;
  setUser: React.Dispatch<React.SetStateAction<string>>;
  setUserInfo: React.Dispatch<React.SetStateAction<Profile>>;
  userInfo: Profile;

  notifications: any[];

  __: (txt: string, replace?: any, context?: string | null) => string;
  isTranslated: boolean;
}

const FrappeContext = createContext<FrappeContextType | undefined>(undefined);

interface FrappeProviderProps {
  children: ReactNode;
}

type Profile = {
  email: string;
  language: string;
  first_name: string;
  avatar: string;
  birthdate: string;
  gender: string;
  phone: string;
  company: string;
  warehouse: string;
  driver: string;
  sales_person: string;
};

export const FrappeProvider: React.FC<FrappeProviderProps> = ({ children }) => {
  const [user, setUser] = useState("");
  const [userInfo, setUserInfo] = useState<Profile>({
    language: "",
    email: "",
    first_name: "",
    avatar: "",
    birthdate: "",
    gender: "",
    phone: "",
    company: "",
    warehouse: "",
    sales_person: "",
    driver: "",
  });

  const [messages, setMessages] = useState<Record<string, string>>({});
  const [isTranslated, setIsTranslated] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<any>([]);

  const frappeApp = new FrappeApp(FRAPPE_URL);
  const db = frappeApp.db();
  const call = frappeApp.call();
  const auth = frappeApp.auth();
  const file = frappeApp.file();

  const loadTranslations = async () => {
    try {
      const translations: any = await call.post(
        "hrms.www.hrms.get_context_for_dev"
      );
      setMessages(translations?.message?.__messages || {});
    } catch (error) {
      console.error("Failed to load translations:", error);
    } finally {
      setIsTranslated(true);
    }
  };

  const getUser = async () => {
    try {
      const user = await auth.getLoggedInUser();
      setUser(user);
    } catch (error) {
      console.error("Error getting logged in user:", error);
    }
  };

  useEffect(() => {
    const init = async () => {
      await getUser();
    };
    init();
  }, []);

  const get_notifications = async () => {
    const res: any = await call.post(
      "frappe.desk.doctype.notification_log.notification_log.get_notification_logs",
      {
        limit: 20,
      }
    );
    const notifications = res?.message?.notification_logs;
    if (!notifications) return;
    setNotifications(notifications);
    console.log("notifications: ", notifications);
  };

  useEffect(() => {
    const init = async () => {
      await loadTranslations();
      await get_notifications();
      const socket = initSocket();

      console.log("Socket.IO client initialized222222222:", socket);
    };
    if (user) init();
  }, [user]);

  // ✅ Hàm translate
  const translate = (
    txt: string,
    replace: any = null,
    context: string | null = null
  ): string => {
    if (!txt || typeof txt !== "string") return txt;

    let translated_text = "";
    const key = txt;

    if (context) {
      translated_text = messages[`${key}:${context}`];
    }
    if (!translated_text) {
      translated_text = messages[key] || txt;
    }
    if (replace && typeof replace === "object") {
      translated_text = format(translated_text, replace);
    }

    return translated_text;
  };

  // ✅ Hàm format giống như trong Vue
  function format(str: string, args: any): string {
    if (str === undefined) return str;

    let unkeyed_index = 0;
    return str.replace(/\{(\w*)\}/g, (match, key) => {
      if (key === "") {
        key = unkeyed_index;
        unkeyed_index++;
      }
      if (key == +key) {
        return args[key] !== undefined ? args[key] : match;
      }
      return args[key] !== undefined ? args[key] : match;
    });
  }

  useEffect(() => {
    const init = async () => {
      try {
        const doc = await db.getDoc("User", user);
        setUserInfo({
          language: doc.language,
          email: doc.name,
          first_name: doc.first_name,
          avatar: doc.user_image,
          birthdate: doc.birth_date || "",
          gender: doc.gender || "",
          phone: doc.phone || "",
          company: doc.company || "",
          warehouse: doc.warehouse || "",
          sales_person: doc.sales_person || "",
          driver: doc.driver || "",
        });
      } catch (error) {
        console.log("whats up bro??", error);
      }
    };
    if (user) init();
  }, [user]);

  return (
    <FrappeContext.Provider
      value={{
        db,
        call,
        auth,
        file,
        setUser,
        userInfo,
        setUserInfo,
        notifications,

        __: translate,
        isTranslated,
      }}
    >
      {children}
    </FrappeContext.Provider>
  );
};

export const useFrappe = (): FrappeContextType => {
  const context = useContext(FrappeContext);
  if (!context) {
    throw new Error("useFrappe must be used within a FrappeProvider");
  }
  return context;
};
