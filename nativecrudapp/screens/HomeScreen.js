import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, Alert, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';

const HomeScreen = ({ navigation }) => {
  const localhost = "http://localhost:8000/api/";
  const [cards, setCards] = useState([]);

  // Fetch cards function
  const fetchCards = async () => {
    try {
      const response = await axios.get(`${localhost}cards`);
      console.log(response.data);
      setCards(response.data);
    } catch (error) {
      console.error('Error fetching cards:', error);
    }
  };

  useEffect(() => {
    fetchCards();  // Call fetchCards on component mount
  }, []);

  // Handle card deletion
  const deleteCard = (id) => {
    Alert.alert('Delete Card', 'Are you sure you want to delete this card?', [
      { text: 'Cancel' },
      { 
        text: 'Delete', 
        onPress: async () => {
          try {
            await axios.delete(`${localhost}cards/${id}`);
            fetchCards();  // Re-fetch the cards after deleting one
          } catch (error) {
            console.error('Error deleting card:', error);
          }
        }
      }
    ]);
  };

  return (
    <View style={styles.container}>
      <Button title="Add Card" onPress={() => navigation.navigate('AddCard')} />
      <FlatList
        data={cards}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text>{item.details}</Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity onPress={() => navigation.navigate('EditCard', { id: item.id })}>
                <Text style={styles.button}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => deleteCard(item.id)}>
                <Text style={styles.button}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  card: {
    backgroundColor: '#f8f8f8',
    marginVertical: 10,
    padding: 15,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
  },
  cardTitle: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  button: {
    marginRight: 10,
    color: '#007BFF',
    fontWeight: 'bold',  // Make buttons more visible
  },
});

export default HomeScreen;
