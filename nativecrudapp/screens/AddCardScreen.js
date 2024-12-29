import axios from 'axios';
import React, { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { View, TextInput, Button, StyleSheet, Alert, Image } from 'react-native';

const AddCardScreen = ({ navigation }) => {
  const localhost = "http://localhost:8000/api/";
  const [title, setTitle] = useState('');
  const [details, setDetails] = useState('');
  const [active, setActive] = useState(true);
  const [image, setImage] = useState(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      base64: true,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  };

  const handleSubmit = async () => {
    try {
      const data = {
        title,
        details,
        active,
        image: image ? `data:image/jpeg;base64,${image.base64}` : null
      };

      const response = await axios.post(`${localhost}cards`, data, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      Alert.alert('Success', 'Card added successfully');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput style={styles.input} placeholder="Title" value={title} onChangeText={setTitle} />
      <TextInput style={styles.input} placeholder="Details" value={details} onChangeText={setDetails} multiline />
      <Button title="Select Image" onPress={pickImage} />
      {image && (
        <Image source={{ uri: image.uri }} style={styles.image} />
      )}
      <Button title="Save" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 10
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10
  },
  image: {
    width: 200,
    height: 200,
    alignSelf: 'center',
    marginVertical: 10
  }
});

export default AddCardScreen;