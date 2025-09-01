import administrasi from "./administrasi";
import akademik from "./akademik";
import appsAndPages from "./apps-and-pages";
import charts from "./charts";
import dashboard from "./dashboard";
import dataAlumni from "./data-alumni";
import dataPpdb from "./data-ppdb";
import dataSiswa from "./data-siswa";
import forms from "./forms";
import kelembagaan from "./kelembagaan";
import others from "./others";
import setting from "./setting";
import uiElements from "./ui-elements";
import user from "./user";

export default [
  ...dashboard,
  ...kelembagaan,
  ...akademik,
  ...administrasi,
  ...dataSiswa,
  ...dataAlumni,
  ...dataPpdb,
  ...user,
  ...setting,
  ...appsAndPages,
  ...charts,
  ...forms,
  ...others,
  ...uiElements,
];
