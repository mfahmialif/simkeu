import appsAndPages from "./apps-and-pages";
import charts from "./charts";
import dashboard from "./dashboard";
import forms from "./forms";
import others from "./others";
import pemasukan from "./pemasukan";
import pengeluaran from "./pengeluaran";
import saldo from "./saldo";
import setting from "./setting";
import uiElements from "./ui-elements";
import user from "./user";

export default [
  ...dashboard,
  ...saldo,
  ...pemasukan,
  ...pengeluaran,
  ...user,
  ...setting,
  // ...appsAndPages,
  // ...charts,
  // ...forms,
  // ...others,
  // ...uiElements,
];
