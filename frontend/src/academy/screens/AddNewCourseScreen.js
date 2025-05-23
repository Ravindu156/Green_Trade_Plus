import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
  Image,
} from 'react-native';
import {
  TextInput,
  Button,
  Card,
  Text,
  Checkbox,
  ActivityIndicator,
  Appbar,
  Surface,
  IconButton,
  Chip,
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { launchImageLibrary } from 'react-native-image-picker';

const AddNewCourseScreen = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  
  // Form states
  const [courseTitle, setCourseTitle] = useState('');
  const [courseDescription, setCourseDescription] = useState('');
  const [courseFees, setCourseFees] = useState('');
  const [courseVideo, setCourseVideo] = useState('');
  const [courseThumbnail, setCourseThumbnail] = useState(null); // New state for thumbnail
  
  // Checkbox states
  const [suitableFor, setSuitableFor] = useState({
    farmers: false,
    sellers: false,
    buyers: false,
  });

  // Form validation
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!courseTitle.trim()) {
      newErrors.courseTitle = 'Course title is required';
    }
    
    if (!courseDescription.trim()) {
      newErrors.courseDescription = 'Course description is required';
    }
    
    if (!courseFees.trim()) {
      newErrors.courseFees = 'Course fees is required';
    } else if (isNaN(courseFees) || parseFloat(courseFees) < 0) {
      newErrors.courseFees = 'Please enter a valid amount';
    }
    
    if (!courseVideo.trim()) {
      newErrors.courseVideo = 'Course video URL is required';
    }
    
    if (!courseThumbnail) {
      newErrors.courseThumbnail = 'Course thumbnail is required';
    }
    
    const hasSelectedAudience = Object.values(suitableFor).some(value => value);
    if (!hasSelectedAudience) {
      newErrors.suitableFor = 'Please select at least one target audience';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleVideoSelection = async () => {
    const options = {
      mediaType: 'video',
      videoQuality: 'medium',
      durationLimit: 300, // 5 minutes max
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    try {
      launchImageLibrary(options, (response) => {
        if (response.didCancel) {
          console.log('User cancelled video selection');
        } else if (response.errorMessage) {
          Alert.alert('Error', response.errorMessage);
        } else if (response.assets && response.assets[0]) {
          const videoAsset = response.assets[0];
          setCourseVideo({
            uri: videoAsset.uri,
            type: videoAsset.type,
            name: videoAsset.fileName || 'course_video.mp4',
            size: videoAsset.fileSize,
          });
          setErrors(prev => ({ ...prev, courseVideo: null }));
        }
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to select video');
    }
  };

  // New function to handle thumbnail selection
  const handleThumbnailSelection = async () => {
    const options = {
      mediaType: 'photo',
      quality: 0.8,
      maxWidth: 800,
      maxHeight: 600,
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    try {
      launchImageLibrary(options, (response) => {
        if (response.didCancel) {
          console.log('User cancelled thumbnail selection');
        } else if (response.errorMessage) {
          Alert.alert('Error', response.errorMessage);
        } else if (response.assets && response.assets[0]) {
          const imageAsset = response.assets[0];
          setCourseThumbnail({
            uri: imageAsset.uri,
            type: imageAsset.type,
            name: imageAsset.fileName || 'thumbnail.jpg',
            size: imageAsset.fileSize,
          });
          setErrors(prev => ({ ...prev, courseThumbnail: null }));
        }
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to select thumbnail');
    }
  };

  const handleCheckboxChange = (type) => {
    setSuitableFor(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
    setErrors(prev => ({ ...prev, suitableFor: null }));
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please fill in all required fields correctly.');
      return;
    }

    setLoading(true);
    
    try {
      const userData = await AsyncStorage.getItem('user');
      const token = await AsyncStorage.getItem('token');
      
      if (!userData || !token) {
        Alert.alert('Error', 'Authentication required. Please login again.');
        return;
      }

      const user = JSON.parse(userData);
      
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('courseTitle', courseTitle.trim());
      formData.append('courseDescription', courseDescription.trim());
      formData.append('courseFees', parseFloat(courseFees));
      formData.append('tutorId', user.id);
      
      // Add thumbnail to form data
      if (courseThumbnail) {
        formData.append('courseThumbnail', courseThumbnail);
      }
      
      // Add suitable for array
      const suitableForArray = [];
      if (suitableFor.farmers) suitableForArray.push('For Farmers');
      if (suitableFor.sellers) suitableForArray.push('For Sellers');
      if (suitableFor.buyers) suitableForArray.push('For Buyers');
      formData.append('suitableFor', JSON.stringify(suitableForArray));
      
      formData.append('courseVideo', courseVideo.trim());

      const response = await fetch('http://localhost:8080/api/acedemy/add-new-course', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      Alert.alert(
        'Success',
        'Course added successfully!',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
      
    } catch (error) {
      console.error('Error adding course:', error);
      Alert.alert('Error', 'Failed to add course. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setCourseTitle('');
    setCourseDescription('');
    setCourseFees('');
    setCourseVideo('');
    setCourseThumbnail(null); // Reset thumbnail
    setSuitableFor({
      farmers: false,
      sellers: false,
      buyers: false,
    });
    setErrors({});
  };

  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.header}>
        <Appbar.BackAction onPress={() => navigation.goBack()} color="#fff" />
        <Appbar.Content title="Add New Course" titleStyle={styles.headerTitle} />
        <Appbar.Action
          icon="refresh"
          onPress={resetForm}
          color="#fff"
        />
      </Appbar.Header>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.formContainer}>
          {/* Course Title */}
          <Surface style={styles.inputContainer} elevation={2}>
            <Text style={styles.labelText}>Course Title *</Text>
            <TextInput
              mode="outlined"
              value={courseTitle}
              onChangeText={(text) => {
                setCourseTitle(text);
                setErrors(prev => ({ ...prev, courseTitle: null }));
              }}
              placeholder="Enter an engaging course title"
              style={styles.textInput}
              theme={{
                colors: {
                  primary: '#1976d2',
                  outline: errors.courseTitle ? '#d32f2f' : '#e0e0e0',
                }
              }}
              left={<TextInput.Icon icon="book-open-variant" color="#1976d2" />}
            />
            {errors.courseTitle && (
              <Text style={styles.errorText}>{errors.courseTitle}</Text>
            )}
          </Surface>

          {/* Course Description */}
          <Surface style={styles.inputContainer} elevation={2}>
            <Text style={styles.labelText}>Course Description *</Text>
            <TextInput
              mode="outlined"
              value={courseDescription}
              onChangeText={(text) => {
                setCourseDescription(text);
                setErrors(prev => ({ ...prev, courseDescription: null }));
              }}
              placeholder="Describe what students will learn..."
              multiline
              numberOfLines={4}
              style={[styles.textInput, styles.multilineInput]}
              theme={{
                colors: {
                  primary: '#1976d2',
                  outline: errors.courseDescription ? '#d32f2f' : '#e0e0e0',
                }
              }}
              left={<TextInput.Icon icon="text" color="#1976d2" />}
            />
            {errors.courseDescription && (
              <Text style={styles.errorText}>{errors.courseDescription}</Text>
            )}
          </Surface>

          {/* Course Thumbnail */}
          <Surface style={styles.inputContainer} elevation={2}>
            <Text style={styles.labelText}>Course Thumbnail *</Text>
            <Text style={styles.helperText}>Add an attractive thumbnail image for your course</Text>
            
            <TouchableOpacity 
              onPress={handleThumbnailSelection}
              style={[
                styles.thumbnailUploadContainer,
                errors.courseThumbnail && styles.errorBorder
              ]}
            >
              <View style={styles.thumbnailUploadContent}>
                {!courseThumbnail ? (
                  <>
                    <IconButton
                      icon="image-plus"
                      size={36}
                      color="#1976d2"
                    />
                    <Text style={styles.thumbnailUploadText}>
                      Tap to upload a thumbnail image
                    </Text>
                  </>
                ) : (
                  <>
                    <Image
                      source={{ uri: courseThumbnail.uri }}
                      style={styles.thumbnailPreview}
                      resizeMode="cover"
                    />
                    <Chip
                      style={styles.successChip}
                      textStyle={styles.successChipText}
                      icon="check-circle"
                      onPress={handleThumbnailSelection}
                    >
                      Thumbnail Selected (Tap to change)
                    </Chip>
                  </>
                )}
              </View>
            </TouchableOpacity>
            
            {errors.courseThumbnail && (
              <Text style={styles.errorText}>{errors.courseThumbnail}</Text>
            )}
          </Surface>

          {/* Course Fees */}
          <Surface style={styles.inputContainer} elevation={2}>
            <Text style={styles.labelText}>Course Fees ($) *</Text>
            <TextInput
              mode="outlined"
              value={courseFees}
              onChangeText={(text) => {
                setCourseFees(text);
                setErrors(prev => ({ ...prev, courseFees: null }));
              }}
              placeholder="0.00"
              keyboardType="numeric"
              style={styles.textInput}
              theme={{
                colors: {
                  primary: '#1976d2',
                  outline: errors.courseFees ? '#d32f2f' : '#e0e0e0',
                }
              }}
              left={<TextInput.Icon icon="cash" color="#1976d2" />}
            />
            {errors.courseFees && (
              <Text style={styles.errorText}>{errors.courseFees}</Text>
            )}
          </Surface>

          {/* Course Video URL */}
          <Surface style={styles.inputContainer} elevation={2}>
            <Text style={styles.labelText}>Course Video URL *</Text>
            <TextInput
              mode="outlined"
              value={courseVideo}
              onChangeText={(text) => {
                setCourseVideo(text);
                setErrors(prev => ({ ...prev, courseVideo: null }));
              }}
              placeholder="Enter video URL (YouTube, Vimeo, etc.)"
              style={styles.textInput}
              theme={{
                colors: {
                  primary: '#1976d2',
                  outline: errors.courseVideo ? '#d32f2f' : '#e0e0e0',
                }
              }}
              left={<TextInput.Icon icon="video" color="#1976d2" />}
            />
            {errors.courseVideo && (
              <Text style={styles.errorText}>{errors.courseVideo}</Text>
            )}
          </Surface>

          {/* Suitable For */}
          <Surface style={styles.inputContainer} elevation={2}>
            <Text style={styles.labelText}>Suitable For *</Text>
            <Text style={styles.helperText}>Select target audience for your course</Text>
            <View style={styles.checkboxContainer}>
              <TouchableOpacity
                style={styles.checkboxItem}
                onPress={() => handleCheckboxChange('farmers')}
              >
                <Checkbox
                  status={suitableFor.farmers ? 'checked' : 'unchecked'}
                  color="#1976d2"
                />
                <Text style={styles.checkboxLabel}>For Farmers</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.checkboxItem}
                onPress={() => handleCheckboxChange('sellers')}
              >
                <Checkbox
                  status={suitableFor.sellers ? 'checked' : 'unchecked'}
                  color="#1976d2"
                />
                <Text style={styles.checkboxLabel}>For Sellers</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.checkboxItem}
                onPress={() => handleCheckboxChange('buyers')}
              >
                <Checkbox
                  status={suitableFor.buyers ? 'checked' : 'unchecked'}
                  color="#1976d2"
                />
                <Text style={styles.checkboxLabel}>For Buyers</Text>
              </TouchableOpacity>
            </View>
            {errors.suitableFor && (
              <Text style={styles.errorText}>{errors.suitableFor}</Text>
            )}
          </Surface>

          {/* Submit Button */}
          <View style={styles.buttonContainer}>
            <Button
              mode="contained"
              onPress={handleSubmit}
              loading={loading}
              disabled={loading}
              style={styles.submitButton}
              contentStyle={styles.submitButtonContent}
              labelStyle={styles.submitButtonLabel}
            >
              {loading ? 'Creating Course...' : 'Create Course'}
            </Button>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: '#1976d2',
    elevation: 4,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  formContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8fafc',
  },
  inputContainer: {
    marginBottom: 20,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  labelText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  helperText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  textInput: {
    backgroundColor: '#fff',
    fontSize: 16,
  },
  multilineInput: {
    minHeight: 100,
  },
  errorText: {
    color: '#d32f2f',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  videoUploadContainer: {
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 20,
    backgroundColor: '#fafafa',
  },
  thumbnailUploadContainer: {
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 20,
    backgroundColor: '#fafafa',
  },
  thumbnailUploadContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbnailPreview: {
    width: '100%',
    height: 180,
    borderRadius: 8,
    marginBottom: 12,
  },
  thumbnailUploadText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
  },
  errorBorder: {
    borderColor: '#d32f2f',
  },
  videoUploadContent: {
    alignItems: 'center',
  },
  videoUploadText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
  },
  successChip: {
    marginTop: 12,
    backgroundColor: '#e8f5e8',
    borderColor: '#4caf50',
  },
  successChipText: {
    color: '#2e7d32',
    fontWeight: '600',
  },
  checkboxContainer: {
    flexDirection: 'column',
  },
  checkboxItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  checkboxLabel: {
    fontSize: 16,
    marginLeft: 8,
    color: '#333',
  },
  buttonContainer: {
    marginTop: 20,
    marginBottom: 40,
  },
  submitButton: {
    backgroundColor: '#1976d2',
    borderRadius: 12,
    elevation: 4,
  },
  submitButtonContent: {
    height: 56,
  },
  submitButtonLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default AddNewCourseScreen;