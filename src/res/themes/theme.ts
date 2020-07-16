import { DarkTheme, DefaultTheme } from "@react-navigation/native";
import { ThemeI } from "../interfaces";

const extraColors = {falseInput: "red"};

export const OwnDarkTheme: ThemeI = {dark: true, colors: Object.assign(DarkTheme.colors, extraColors)}
export const OwnDefaultTheme: ThemeI = {dark: false, colors: Object.assign(DefaultTheme.colors, extraColors)}