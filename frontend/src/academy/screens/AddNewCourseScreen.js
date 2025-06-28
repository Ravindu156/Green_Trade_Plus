import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert, // Standard React Native Alert
  TouchableOpacity, // For custom buttons and interactive elements
  Image, // For displaying thumbnails
  TextInput, // Standard React Native TextInput
  ActivityIndicator, // Standard React Native ActivityIndicator
  Platform, // For platform-specific logic (web vs. native)
  Text, // Standard React Native Text
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
// Import FontAwesome5 for icons. Ensure you have installed react-native-vector-icons.
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const AddNewCourseScreen = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

  // Form states
  const [courseTitle, setCourseTitle] = useState('');
  const [courseDescription, setCourseDescription] = useState('');
  const [courseFees, setCourseFees] = useState('');
  const [courseVideo, setCourseVideo] = useState(null);
  const [courseThumbnail, setCourseThumbnail] = useState(null);

  // Checkbox states
  const [suitableFor, setSuitableFor] = useState({
    farmers: false,
    sellers: false,
    buyers: false,
  });

  // Form validation errors state
  const [errors, setErrors] = useState({});

  // --- Form Validation Logic ---
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

    if (!courseVideo) {
      newErrors.courseVideo = 'Course video is required';
    }

    if (!courseThumbnail) {
      newErrors.courseThumbnail = 'Course thumbnail is required';
    }

    const hasSelectedAudience = Object.values(suitableFor).some(value => value);
    if (!hasSelectedAudience) {
      newErrors.suitableFor = 'Please select at least one target audience';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  // --- File Selection Handlers ---

  // Web-compatible video upload handler
  const handleWebVideoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setCourseVideo({
        uri: URL.createObjectURL(file),
        type: file.type,
        name: file.name,
        size: file.size,
        file, // keep the raw file for upload
      });
      setErrors(prev => ({ ...prev, courseVideo: null })); // Clear error
    }
  };

  // Web-compatible thumbnail upload handler
  const handleWebThumbnailChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setCourseThumbnail({
        uri: URL.createObjectURL(file),
        type: file.type,
        name: file.name,
        size: file.size,
        file, // keep the raw file for upload
      });
      setErrors(prev => ({ ...prev, courseThumbnail: null })); // Clear error
    }
  };

  // React Native video selection (for mobile)
  const handleVideoSelection = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        videoQuality: ImagePicker.VideoQualityType.Medium,
        durationLimit: 300, // 5 minutes max
      });

      if (result.canceled) {
        console.log('User cancelled video selection');
        return;
      }

      if (result.assets && result.assets.length > 0) {
        const videoAsset = result.assets[0];
        setCourseVideo({
          uri: videoAsset.uri,
          type: videoAsset.type,
          name: videoAsset.fileName || 'course_video.mp4',
          size: videoAsset.fileSize,
        });
        setErrors(prev => ({ ...prev, courseVideo: null })); // Clear error
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to select video');
    }
  };

  // React Native thumbnail selection (for mobile)
  const handleThumbnailSelection = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
        allowsEditing: true, // Allows cropping on mobile
        aspect: [4, 3], // Aspect ratio for thumbnail
      });

      if (result.canceled) {
        console.log('User cancelled thumbnail selection');
        return;
      }

      if (result.assets && result.assets.length > 0) {
        const imageAsset = result.assets[0];
        setCourseThumbnail({
          uri: imageAsset.uri,
          type: imageAsset.type,
          name: imageAsset.fileName || 'thumbnail.jpg',
          size: imageAsset.fileSize,
        });
        setErrors(prev => ({ ...prev, courseThumbnail: null })); // Clear error
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to select thumbnail');
    }
  };

  // --- Checkbox Change Handler ---
  const handleCheckboxChange = (type) => {
    setSuitableFor(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
    setErrors(prev => ({ ...prev, suitableFor: null })); // Clear error
  };

  // --- Form Submission Logic ---
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
        setLoading(false); // Ensure loading state is reset
        return;
      }

      const user = JSON.parse(userData);
      const userId = user.id;

      // Create FormData for file upload
      const formData = new FormData();
      formData.append('courseTitle', courseTitle.trim());
      formData.append('courseDescription', courseDescription.trim());
      formData.append('courseFees', courseFees.trim());
      formData.append('tutorId', userId.toString());

      // Add boolean values for target audience
      formData.append('forFarmers', suitableFor.farmers.toString());
      formData.append('forSellers', suitableFor.sellers.toString());
      formData.append('forBuyers', suitableFor.buyers.toString());

      // Add thumbnail file
      if (courseThumbnail) {
        formData.append(
          'thumbnailFile',
          Platform.OS === 'web' ? courseThumbnail.file : {
            uri: courseThumbnail.uri.replace('file://', ''), // Ensure proper URI format
            type: courseThumbnail.type || 'image/jpeg', // Default type if not provided
            name: courseThumbnail.name || 'thumbnail.jpg', // Default name if not provided
          }
        );
      } else {
        throw new Error('Thumbnail file is required.');
      }

      // Add video file
      if (courseVideo) {
        formData.append(
          'videoFile',
          Platform.OS === 'web' ? courseVideo.file : {
            uri: courseVideo.uri.replace('file://', ''), // Ensure proper URI format
            type: courseVideo.type || 'video/mp4', // Default type if not provided
            name: courseVideo.name || 'course_video.mp4', // Default name if not provided
          }
        );
      } else {
        throw new Error('Video file is required.');
      }

      const response = await fetch('http://localhost:8080/api/academy/courses/add', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          // Do NOT set 'Content-Type' here! It will be automatically set by FormData for file uploads.
        },
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Backend error:', errorText);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      const result = await response.json(); // Parse the JSON response

      Alert.alert(
        'Success',
        'Course added successfully!',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(), // Navigate back after success
          },
        ]
      );

    } catch (error) {
      console.error('Error adding course:', error);
      Alert.alert('Error', error.message || 'Failed to add course. Please try again.');
    } finally {
      setLoading(false); // Always reset loading state
    }
  };

  // --- Reset Form Fields ---
  const resetForm = () => {
    setCourseTitle('');
    setCourseDescription('');
    setCourseFees('');
    setCourseVideo(null);
    setCourseThumbnail(null);
    setSuitableFor({
      farmers: false,
      sellers: false,
      buyers: false,
    });
    setErrors({}); // Clear all validation errors
  };

  return (
    <View style={styles.container}>
      {/* Custom Header (replaces Appbar.Header) */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerIconContainer}>
          <FontAwesome5 name="arrow-left" size={20} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add New Course</Text>
        <TouchableOpacity onPress={resetForm} style={styles.headerIconContainer}>
          <FontAwesome5 name="sync-alt" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.formContainer}>
          {/* Course Title Input */}
          <View style={[styles.inputCard, styles.shadow]}> {/* Replaces Surface */}
            <Text style={styles.labelText}>Course Title <Text style={styles.requiredAsterisk}>*</Text></Text>
            <View style={[styles.textInputContainer, errors.courseTitle && styles.errorBorder]}>
              <FontAwesome5 name="book-open" size={20} color="#1976d2" style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                value={courseTitle}
                onChangeText={(text) => {
                  setCourseTitle(text);
                  setErrors(prev => ({ ...prev, courseTitle: null }));
                }}
                placeholder="Enter an engaging course title"
                placeholderTextColor="#999"
              />
            </View>
            {errors.courseTitle && (
              <Text style={styles.errorText}>{errors.courseTitle}</Text>
            )}
          </View>

          {/* Course Description Input */}
          <View style={[styles.inputCard, styles.shadow]}> {/* Replaces Surface */}
            <Text style={styles.labelText}>Course Description <Text style={styles.requiredAsterisk}>*</Text></Text>
            <View style={[styles.textInputContainer, styles.multilineInputContainer, errors.courseDescription && styles.errorBorder]}>
              <FontAwesome5 name="align-left" size={20} color="#1976d2" style={[styles.inputIcon, styles.multilineIcon]} />
              <TextInput
                style={[styles.textInput, styles.multilineInput]}
                value={courseDescription}
                onChangeText={(text) => {
                  setCourseDescription(text);
                  setErrors(prev => ({ ...prev, courseDescription: null }));
                }}
                placeholder="Describe what students will learn..."
                placeholderTextColor="#999"
                multiline
                numberOfLines={4}
              />
            </View>
            {errors.courseDescription && (
              <Text style={styles.errorText}>{errors.courseDescription}</Text>
            )}
          </View>

          {/* Course Thumbnail Upload */}
          <View style={[styles.inputCard, styles.shadow]}> {/* Replaces Surface */}
            <Text style={styles.labelText}>Course Thumbnail <Text style={styles.requiredAsterisk}>*</Text></Text>
            <Text style={styles.helperText}>Add an attractive thumbnail image for your course</Text>

            {Platform.OS === 'web' ? (
              <View style={[styles.fileUploadContainer, errors.courseThumbnail && styles.errorBorder]}>
                {!courseThumbnail ? (
                  <>
                    <FontAwesome5 name="image" size={36} color="#1976d2" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleWebThumbnailChange}
                      style={styles.webFileInput}
                    />
                    <Text style={styles.fileUploadText}>Click to select a thumbnail image</Text>
                  </>
                ) : (
                  <>
                    <Image
                      source={{ uri: courseThumbnail.uri }}
                      style={styles.thumbnailPreview}
                      resizeMode="cover"
                    />
                    {/* Custom Chip (replaces Paper's Chip) */}
                    <TouchableOpacity style={styles.successChip} onPress={() => setCourseThumbnail(null)}>
                      <FontAwesome5 name="check-circle" size={16} color="#2e7d32" style={styles.chipIcon} />
                      <Text style={styles.successChipText}>Thumbnail Selected (Click to change)</Text>
                    </TouchableOpacity>
                    <Text style={styles.fileInfoText}>{courseThumbnail.name}</Text>
                    <Text style={styles.fileSizeText}>Size: {(courseThumbnail.size / (1024 * 1024)).toFixed(2)} MB</Text>
                  </>
                )}
              </View>
            ) : (
              <TouchableOpacity
                onPress={handleThumbnailSelection}
                style={[styles.fileUploadContainer, errors.courseThumbnail && styles.errorBorder]}
              >
                {!courseThumbnail ? (
                  <>
                    <FontAwesome5 name="image" size={36} color="#1976d2" />
                    <Text style={styles.fileUploadText}>Tap to upload a thumbnail image</Text>
                  </>
                ) : (
                  <>
                    <Image
                      source={{ uri: courseThumbnail.uri }}
                      style={styles.thumbnailPreview}
                      resizeMode="cover"
                    />
                    {/* Custom Chip (replaces Paper's Chip) */}
                    <TouchableOpacity style={styles.successChip} onPress={handleThumbnailSelection}>
                      <FontAwesome5 name="check-circle" size={16} color="#2e7d32" style={styles.chipIcon} />
                      <Text style={styles.successChipText}>Thumbnail Selected (Tap to change)</Text>
                    </TouchableOpacity>
                    <Text style={styles.fileInfoText}>{courseThumbnail.name}</Text>
                    <Text style={styles.fileSizeText}>Size: {(courseThumbnail.size / (1024 * 1024)).toFixed(2)} MB</Text>
                  </>
                )}
              </TouchableOpacity>
            )}

            {errors.courseThumbnail && (
              <Text style={styles.errorText}>{errors.courseThumbnail}</Text>
            )}
          </View>

          {/* Course Video Upload */}
          <View style={[styles.inputCard, styles.shadow]}> {/* Replaces Surface */}
            <Text style={styles.labelText}>Course Video <Text style={styles.requiredAsterisk}>*</Text></Text>
            <Text style={styles.helperText}>Upload your course video file</Text>

            {Platform.OS === 'web' ? (
              <View style={[styles.fileUploadContainer, errors.courseVideo && styles.errorBorder]}>
                {!courseVideo ? (
                  <>
                    <FontAwesome5 name="video" size={36} color="#1976d2" />
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleWebVideoChange}
                      style={styles.webFileInput}
                    />
                    <Text style={styles.fileUploadText}>Click to select a video file</Text>
                    <Text style={styles.fileHelpText}>Max duration: 5 minutes</Text>
                  </>
                ) : (
                  <>
                    <FontAwesome5 name="check-circle" size={36} color="#4caf50" />
                    {/* Custom Chip (replaces Paper's Chip) */}
                    <TouchableOpacity style={styles.successChip} onPress={() => setCourseVideo(null)}>
                      <FontAwesome5 name="check-circle" size={16} color="#2e7d32" style={styles.chipIcon} />
                      <Text style={styles.successChipText}>Video Selected (Click to change)</Text>
                    </TouchableOpacity>
                    <Text style={styles.fileInfoText}>{courseVideo.name}</Text>
                    <Text style={styles.fileSizeText}>Size: {(courseVideo.size / (1024 * 1024)).toFixed(2)} MB</Text>
                  </>
                )}
              </View>
            ) : (
              <TouchableOpacity
                onPress={handleVideoSelection}
                style={[styles.fileUploadContainer, errors.courseVideo && styles.errorBorder]}
              >
                {!courseVideo ? (
                  <>
                    <FontAwesome5 name="video" size={36} color="#1976d2" />
                    <Text style={styles.fileUploadText}>Tap to upload a video file</Text>
                    <Text style={styles.fileHelpText}>Max duration: 5 minutes</Text>
                  </>
                ) : (
                  <>
                    <FontAwesome5 name="check-circle" size={36} color="#4caf50" />
                    {/* Custom Chip (replaces Paper's Chip) */}
                    <TouchableOpacity style={styles.successChip} onPress={handleVideoSelection}>
                      <FontAwesome5 name="check-circle" size={16} color="#2e7d32" style={styles.chipIcon} />
                      <Text style={styles.successChipText}>Video Selected (Tap to change)</Text>
                    </TouchableOpacity>
                    <Text style={styles.fileInfoText}>{courseVideo.name}</Text>
                    <Text style={styles.fileSizeText}>Size: {(courseVideo.size / (1024 * 1024)).toFixed(2)} MB</Text>
                  </>
                )}
              </TouchableOpacity>
            )}

            {errors.courseVideo && (
              <Text style={styles.errorText}>{errors.courseVideo}</Text>
            )}
          </View>

          {/* Course Fees Input */}
          <View style={[styles.inputCard, styles.shadow]}> {/* Replaces Surface */}
            <Text style={styles.labelText}>Course Fees ($) <Text style={styles.requiredAsterisk}>*</Text></Text>
            <View style={[styles.textInputContainer, errors.courseFees && styles.errorBorder]}>
              <FontAwesome5 name="dollar-sign" size={20} color="#1976d2" style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                value={courseFees}
                onChangeText={(text) => {
                  setCourseFees(text);
                  setErrors(prev => ({ ...prev, courseFees: null }));
                }}
                placeholder="0.00"
                placeholderTextColor="#999"
                keyboardType="numeric"
              />
            </View>
            {errors.courseFees && (
              <Text style={styles.errorText}>{errors.courseFees}</Text>
            )}
          </View>

          {/* Suitable For Checkboxes */}
          <View style={[styles.inputCard, styles.shadow]}> {/* Replaces Surface */}
            <Text style={styles.labelText}>Suitable For <Text style={styles.requiredAsterisk}>*</Text></Text>
            <Text style={styles.helperText}>Select target audience for your course</Text>
            <View style={styles.checkboxContainer}>
              {/* Custom Checkbox Item */}
              <TouchableOpacity
                style={styles.checkboxItem}
                onPress={() => handleCheckboxChange('farmers')}
                activeOpacity={0.7}
              >
                <FontAwesome5
                  name={suitableFor.farmers ? 'check-square' : 'square'}
                  size={24}
                  color={suitableFor.farmers ? '#1976d2' : '#999'}
                />
                <Text style={styles.checkboxLabel}>For Farmers</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.checkboxItem}
                onPress={() => handleCheckboxChange('sellers')}
                activeOpacity={0.7}
              >
                <FontAwesome5
                  name={suitableFor.sellers ? 'check-square' : 'square'}
                  size={24}
                  color={suitableFor.sellers ? '#1976d2' : '#999'}
                />
                <Text style={styles.checkboxLabel}>For Sellers</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.checkboxItem}
                onPress={() => handleCheckboxChange('buyers')}
                activeOpacity={0.7}
              >
                <FontAwesome5
                  name={suitableFor.buyers ? 'check-square' : 'square'}
                  size={24}
                  color={suitableFor.buyers ? '#1976d2' : '#999'}
                />
                <Text style={styles.checkboxLabel}>For Buyers</Text>
              </TouchableOpacity>
            </View>
            {errors.suitableFor && (
              <Text style={styles.errorText}>{errors.suitableFor}</Text>
            )}
          </View>

          {/* Submit Button */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.submitButton, loading && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={loading}
              activeOpacity={0.7}
            >
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.submitButtonText}>Create Course</Text>
              )}
            </TouchableOpacity>
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
  // Custom Header Styles (replaces Appbar.Header)
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1976d2',
    paddingHorizontal: 16,
    height: 60, // Standard app bar height
    elevation: 4, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  headerIconContainer: {
    padding: 8, // Make touch target larger
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
  // Replaces Paper's Surface/Card for input groups
  inputCard: {
    marginBottom: 20,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  shadow: {
    elevation: 2, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
  },
  labelText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  requiredAsterisk: {
    color: '#d32f2f', // Red for required fields
  },
  helperText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  // Custom TextInput styles (replaces Paper's TextInput mode="outlined")
  textInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0', // Default outline color
    borderRadius: 8,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: Platform.OS === 'ios' ? 12 : 8, // Adjust for platform
  },
  inputIcon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingVertical: 0, // Remove default vertical padding
  },
  multilineInputContainer: {
    minHeight: 100, // For multiline text input container
    alignItems: 'flex-start', // Align icon to top for multiline
    paddingVertical: Platform.OS === 'ios' ? 12 : 8,
  },
  multilineInput: {
    paddingTop: Platform.OS === 'ios' ? 0 : 8, // Adjust top padding for multiline text
  },
  multilineIcon: {
    paddingTop: 8, // Align icon to the top for multiline input
  },
  errorText: {
    color: '#d32f2f',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  errorBorder: {
    borderColor: '#d32f2f', // Error outline color
    borderWidth: 2, // Thicker border for error state
  },
  // Custom File Upload Components
  fileUploadContainer: {
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 20,
    backgroundColor: '#fafafa',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 150, // Minimum height for the upload area
  },
  webFileInput: { // Styles for the <input type="file"> on web
    position: 'absolute',
    width: '100%',
    height: '100%',
    opacity: 0,
    cursor: 'pointer',
    zIndex: 1, // Ensure it's clickable
  },
  thumbnailPreview: {
    width: '100%',
    height: 180,
    borderRadius: 8,
    marginBottom: 12,
  },
  fileUploadText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
  },
  fileHelpText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    marginTop: 4,
  },
  fileInfoText: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
    marginTop: 8,
    fontWeight: '500',
  },
  fileSizeText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 2,
  },
  // Custom Chip (replaces Paper's Chip)
  successChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e8f5e8', // Light green background
    borderColor: '#4caf50', // Green border
    borderWidth: 1,
    borderRadius: 20, // Pill shape
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginTop: 12,
  },
  chipIcon: {
    marginRight: 6,
  },
  successChipText: {
    color: '#2e7d32', // Darker green text
    fontWeight: '600',
    fontSize: 14,
  },
  // Custom Checkbox Styles (replaces Paper's Checkbox)
  checkboxContainer: {
    flexDirection: 'column',
    marginTop: 10,
  },
  checkboxItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  checkboxLabel: {
    fontSize: 16,
    marginLeft: 10, // Space between icon and text
    color: '#333',
  },
  // Custom Submit Button Styles (replaces Paper's Button)
  buttonContainer: {
    marginTop: 20,
    marginBottom: 40,
  },
  submitButton: {
    backgroundColor: '#1976d2',
    borderRadius: 12,
    height: 56, // Fixed height for consistency
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  submitButtonDisabled: {
    backgroundColor: '#a0c7ed', // Lighter blue when disabled
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default AddNewCourseScreen;
