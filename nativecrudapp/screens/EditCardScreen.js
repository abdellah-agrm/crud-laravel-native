import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, Alert, CheckBox, Text, Image } from 'react-native';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker'; // Ensure you have this dependency installed

const EditCardScreen = ({ route, navigation }) => {
  const localhost = "http://localhost:8000/api/";
  const localimg = "http://localhost:8000/storage/";
  const { id } = route.params;

  const [title, setTitle] = useState('');
  const [details, setDetails] = useState('');
  const [active, setActive] = useState(true);
  const [image, setImage] = useState(null);

  useEffect(() => {
    const fetchCard = async () => {
      try {
        const response = await axios.get(`${localhost}cards/${id}`);
        const card = response.data;

        setTitle(card.title);
        setDetails(card.details);
        setActive(card.active);

        // If image exists, prepend localimg URL, otherwise leave it as null
        if (card.image) {
          setImage(localimg + card.image);
        } else {
          setImage(null);
        }
      } catch (error) {
        console.error(error);
        Alert.alert('Error', 'Failed to fetch card details.');
      }
    };

    fetchCard();
  }, [id]);

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert('Permission required', 'You need to grant camera roll permissions.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      // Set the selected image URI
      setImage(result.uri);
    }
  };

  const handleSubmit = async () => {
    try {
      const cardData = {
        title,
        details,
        active,
        image, // If image is null, backend should handle that as no image upload
      };

      await axios.put(`${localhost}cards/${id}`, cardData);
      Alert.alert('Success', 'Card updated successfully');
      navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Something went wrong');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Card Title"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Card Details"
        value={details}
        onChangeText={setDetails}
      />
      <View style={styles.checkboxContainer}>
        <CheckBox
          value={active}
          onValueChange={setActive}
          style={styles.checkbox}
        />
        <Text style={styles.label}>Active</Text>
      </View>
      <Button title="Select Image" onPress={pickImage} />
      {image && (
        <Image source={{ uri: image }} style={styles.image} />
      )}
      <Button title="Update Card" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingLeft: 10,
  },
  checkboxContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  checkbox: {
    alignSelf: 'center',
  },
  label: {
    margin: 8,
  },
  image: {
    width: 100,
    height: 100,
    marginVertical: 10,
    borderRadius: 5,
  },
});

export default EditCardScreen;
