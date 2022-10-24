import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Pressable} from 'react-native';
import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getDatabase, push, ref, remove, onValue } from 'firebase/database';
import {API_KEY}from '@env';
import { Input, Header, Button, ListItem } from'react-native-elements';
import { Ionicons } from "@expo/vector-icons";

export default function App() {
  const firebaseConfig = {
    apiKey: {API_KEY},
    authDomain: "shoppinglist-4be1e.firebaseapp.com",
    databaseURL: "https://shoppinglist-4be1e-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "shoppinglist-4be1e",
    storageBucket: "shoppinglist-4be1e.appspot.com",
    messagingSenderId: "506349611810",
    appId: "1:506349611810:web:56f6ba2f22c6ae510a537b"
  };

  const app = initializeApp(firebaseConfig);
  const database = getDatabase(app);

  const [amount, setAmount] = useState('');
  const [product, setProduct] = useState('');
  const [items, setItems] = useState([]);

  const saveItem = () => {
    push(
      ref(database, 'items/'),
      { 'product': product, 'amount': amount })
      setAmount();
      setProduct();
  }

  useEffect(() => {
    const itemsRef = ref(database, 'items/');
    onValue(itemsRef, (snapshot) => {
      const data = snapshot.val();
      //map keys in so app can delete stuff based on their value
      const keylist = Object.keys(data).map((key) => ({
        key: key,
        product: data[key].product,
        amount: data[key].amount
      }));
      setItems(keylist);
    })
  },
    []);

  //delete  from 'items/' based on key value
  const deleteItem = (key) => {
    remove(ref(database, 'items/' + key));
  }

  const renderItem = ({ item }) => (
    <ListItem bottomDivider>
      <ListItem.Content>
        <ListItem.Title>{item.product}</ListItem.Title>
        <ListItem.Subtitle>{item.amount}</ListItem.Subtitle>
        
      </ListItem.Content>
      <Pressable onPress={()=>deleteItem(item.key)}>
        <Ionicons name="trash" size={30} color="red" />
      </Pressable>
    </ListItem>
  );

  return (   
    <View style={styles.container}>
      <Header 
        centerComponent={{ text: 'SHOPPING LIST', style: { color: '#fff' } }}
      />
      
      <Input
        style={styles.input}
        placeholder='Product'
        label='PRODUCT'
        onChangeText={product => setProduct(product)}
        value={product}
      />

      <Input
        style={styles.input}
        placeholder='Amount'
        label='AMOUNT'
        keyboardType='numeric'
        onChangeText={amount => setAmount(amount)}
        value={amount}
      />
      
      <View style={styles.center}>   
      <TouchableOpacity activeOpacity={0.95} style={{ width: 200}}>
        <Button
          icon={{ name: 'save', color: '#fff'}}
          title="SAVE"
          onPress={saveItem}
        />
      </TouchableOpacity>   
      <Text style={styles.text}>Shopping list:</Text>
      </View> 

      <FlatList
        data={items}
        keyExtractor={(item) => item.key.toString()}
        renderItem={renderItem}
      />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    //alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    width: 180,
    fontSize: 18,
  },
  text: {
    marginTop: 10,
    fontSize: 22,
    marginBottom: 15,
  },
  center: {
    alignItems: 'center'
  }
});
