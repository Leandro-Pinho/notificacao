import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import React, { useState, useEffect, useRef } from 'react';
import { Text, View, Button, Platform, Image } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function App({ navigation }) {
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();
  
  

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      navigation.navigate('Details')
    });

    agendaNot();

    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
    };
  }, []);

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-around',
        backgroundColor: '#FF8C00'
      }}>
      
      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        <View>
          <Image source={require('../assets/delivery.png')}/>
          <Text>HOME Delivery</Text>
        </View>
       
      </View>
      <Button
        title="Press to schedule a notification"
        onPress={async () => {
          await schedulePushNotification();
        }}
      />
    </View>
  );
}

function agendaNot() {
  Notifications.scheduleNotificationAsync({
    content: {
      title: "Um presente para você",
      body: 'R$ 6,00 em pedido de R$ 40,00 ou mais.',
    },
    trigger: { seconds: 60 * 5},
  });

  Notifications.scheduleNotificationAsync({
    content: {
      title: "Não gaste seu tempo cozinhando.",
      body: 'A Home Delivery entrega em 15 minutos',
    },
    trigger: { seconds: 60 * 10},
  });

  Notifications.scheduleNotificationAsync({
    content: {
      title: "Não vai perder essa!",
      body: 'Sexta feira o seu primeiro pedido tem 50% de desconto.',
    },
    trigger: { seconds: 60 * 15},
  });
}

async function schedulePushNotification() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "bem vindo a Home Delivery",
      body: 'Aqui a sua refeição esta na mão.',
    },
    trigger: { seconds: 1 },
  });
}

async function registerForPushNotificationsAsync() {
  let token;
  if (Constants.isDevice) {
    const { status: existingStatus } = await Permissions.getAsync(
      Permissions.NOTIFICATIONS
    );
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
  } else {
    alert("Must use physical device for Push Notifications");
  }

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  return token;
}