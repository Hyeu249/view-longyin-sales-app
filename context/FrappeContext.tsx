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
}

const FrappeContext = createContext<FrappeContextType | undefined>(undefined);

interface FrappeProviderProps {
  children: ReactNode;
}

type Profile = {
  email: string;
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

  const frappeApp = new FrappeApp(FRAPPE_URL);
  const db = frappeApp.db();
  const call = frappeApp.call();
  const auth = frappeApp.auth();
  const file = frappeApp.file();

  useEffect(() => {
    const init = async () => {
      try {
        const user = await auth.getLoggedInUser();
        setUser(user);
      } catch (error) {
        console.error("Error getting logged in user:", error);
      }
    };
    init();
  }, []);

  useEffect(() => {
    const init = async () => {
      try {
        const doc = await db.getDoc("User", user);
        setUserInfo({
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
      } catch (error) {}
    };
    init();
  }, [user]);

  return (
    <FrappeContext.Provider
      value={{ db, call, auth, file, setUser, userInfo, setUserInfo }}
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
