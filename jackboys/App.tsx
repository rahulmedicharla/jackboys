import { StatusBar } from 'expo-status-bar';
import Navigation from './components/Navigation';
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage"
import { firebaseConfig } from "./config";

const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export default function App() {
  return (
    <Navigation/>
  );
}