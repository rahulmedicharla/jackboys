import React, { useEffect, useState, useCallback, memo } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Landing from "./authFlow/Landing";
import Login from "./authFlow/Login";
import Register from "./authFlow/Register";
import { primary, secondary, tertiaryGreen, white } from "./Styles";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Measure from "./mainFlow/Measure";
import { Octicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Track from "./mainFlow/Track";
import Profile from "./mainFlow/Profile";
import Meal from "./mainFlow/Meal";
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { User, readUserDoc } from "../backend/db_helper";


const AuthStack = createNativeStackNavigator()
const HomeTab = createBottomTabNavigator()

export default function Navigation() {

  const [user, setUser] = useState<User>(null);

  const auth = getAuth();

  const collectUserData = async (uid: string) => {
    const userData = await readUserDoc(uid);
    setUser({
      uid: uid,
      username: userData.data.username,
      entries: userData.data.entries ? userData.data.entries : [],
    });

  }

  const memoizedSetUser = useCallback((user: User) => {
    console.log('running')
    setUser(user);
  }, []);

  useEffect(() => {
    onAuthStateChanged(auth, (userInfo) =>{
      if (userInfo) {

        collectUserData(userInfo.uid);
      
      } else {
        setUser(null);
      }
    });
  }, []);
  return (
    <>
      {user ? (
          <NavigationContainer>
            <HomeTab.Navigator screenOptions={{tabBarStyle: {backgroundColor: primary}, tabBarActiveTintColor: tertiaryGreen, tabBarInactiveTintColor: white}}>
              <HomeTab.Screen name='Measure' options={{headerShown: false, tabBarLabel: "Measure", tabBarIcon: ({color, size}) => (
                  <Octicons name="graph" size={size} color={color} />)}}
              >
                {() => <Measure user={user} memoizedSetUser={memoizedSetUser} />}
              </HomeTab.Screen>
              <HomeTab.Screen name = "Track" options={{headerShown: false, tabBarLabel: "Track", tabBarIcon: ({color, size}) => (
                <MaterialCommunityIcons name="tape-measure" size={size} color={color} />
              )}} component={Track} />  
              <HomeTab.Screen name="Meal" options = {{headerShown: false, tabBarLabel: "Meal Prep", tabBarIcon: ({color, size}) => (
                <Ionicons name="fast-food" size={size} color={color} />
              )}} component={Meal} />
              <HomeTab.Screen name="Profile" options = {{headerShown: false, tabBarLabel: "Profile", tabBarIcon: ({color, size}) => (
                <MaterialIcons name="person" size={size} color={color} />
              )}} component={Profile} /> 
            </HomeTab.Navigator>
          </NavigationContainer>
      ) : (
        <NavigationContainer>
          <AuthStack.Navigator>
              <AuthStack.Screen name='Landing' options={{headerTitle: "", headerStyle: {backgroundColor: primary}}} component={Landing} />
              <AuthStack.Screen name='Login'  options={{headerTitle: "", headerStyle: {backgroundColor: primary}}} component={Login} />
              <AuthStack.Screen name='Register'  options={{headerTitle: "", headerStyle: {backgroundColor: primary}}} component={Register} />
          </AuthStack.Navigator>
        </NavigationContainer>
      )}
    </>
  )
}