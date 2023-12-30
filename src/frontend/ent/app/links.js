import HomeIcon from "@mui/icons-material/Home";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import CarCrashIcon from "@mui/icons-material/CarCrash";
import DirectionsCarFilledIcon from "@mui/icons-material/DirectionsCarFilled";
import { Flag, People } from "@mui/icons-material";

const LINKS = [
  { text: "Home", href: "/", icon: HomeIcon },
  { text: "Customer", href: "/customer", icon: People },
  { text: "Countries", href: "/countries", icon: Flag },
  { text: "Models", href: "/models", icon: CarCrashIcon },
  { text: "Brands", href: "/brands", icon: CarCrashIcon },
  { text: "Cars", href: "/cars", icon: DirectionsCarFilledIcon },
  { text: "Sale", href: "/sales", icon: AttachMoneyIcon },
  { text: "Credit Cards", href: "/cards", icon: CreditCardIcon },
];
export default LINKS;
