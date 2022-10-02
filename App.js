import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, Button, FlatList } from 'react-native';
import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getDatabase, push, ref, remove, onValue } from 'firebase/database';
import {API_KEY}from '@env';


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

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder='Product'
        onChangeText={product => setProduct(product)}
        value={product}
      />
      <TextInput
        style={{
          marginTop: 10,
          marginBottom: 10,
          width: 180,
          fontSize: 18,
          borderColor: 'gray',
          borderWidth: 1
        }}
        placeholder='Amount'
        keyboardType='numeric'
        onChangeText={amount => setAmount(amount)}
        value={amount}

      />
      <Button title="SAVE" onPress={saveItem} />
      <Text style={styles.text}>Shopping list:</Text>
      <FlatList
        style={{ marginLeft: "5%" }}
        keyExtractor={(item) => item.key.toString()}
        renderItem={({ item }) =>
          <View style={styles.list}>
            <Text style={{ fontSize: 18 }}>{item.product}, {item.amount} </Text>
            <Text style={{ fontSize: 18, color: '#0000ff' }} onPress={() => deleteItem(item.key)}>delete</Text>
          </View>}
        data={items}
      />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    marginTop: 80,
    width: 180,
    fontSize: 18,
    borderColor: 'gray',
    borderWidth: 1
  },
  text: {
    marginTop: 10,
    fontSize: 22,
    marginBottom: 15,
  },
  list: {
    flexDirection: 'row',
    alignItems: 'center'
  }
});
